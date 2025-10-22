import { kafka } from "../../../packages/utils/kafka/index";
import redis from "../../../packages/libs/redis";
import { WebSocketServer, WebSocket } from "ws";
import { Server as HttpServer } from "http";

// const producer = kafka.producer();
const connectedUsers: Map<string, WebSocket> = new Map();
const unseenCount: Map<string, number> = new Map();

declare global {
  var _kafkaProducer: any;
}

export async function getKafkaProducer() {
  if (!global._kafkaProducer) {
    global._kafkaProducer = kafka.producer();
    await global._kafkaProducer.connect();
    console.log("Kafka producer connected!");
  }
  return global._kafkaProducer;
}

type IncomingMessage = {
  type?: string;
  fromUserId: string;
  toUserId: string;
  messageBody: string;
  conversationId: string;
  senderType: string;
};

export async function createWebSocketServer(server: HttpServer) {
  const wss = new WebSocketServer({ server });

  const producer = await getKafkaProducer();

  wss.on("connection", (ws: WebSocket) => {
    console.log("New Websocket connection!");

    let registeredUserId: string | null = null;

    ws.on("message", async (rawMessage) => {
      try {
        const messageStr = rawMessage.toString();
        if (!registeredUserId && !messageStr.startsWith("{")) {
          registeredUserId = messageStr;
          connectedUsers.set(registeredUserId, ws);
          console.log(`registered web socket for userId: ${registeredUserId}`);

          const isSeller = registeredUserId.startsWith("seller_");
          const redisKey = isSeller
            ? `online:seller:${registeredUserId.replace("seller_", "")}`
            : `online:user:${registeredUserId}`;

          await redis.set(redisKey, "1");
          await redis.expire(redisKey, 300);
          return;
        }

        const data: IncomingMessage = JSON.parse(messageStr);

        if (data.type === "MARK_AS_SEEN" && registeredUserId) {
          const seenKey = `${registeredUserId}_${data.conversationId}`;
          unseenCount.set(seenKey, 0);
          return;
        }

        const {
          fromUserId,
          toUserId,
          messageBody,
          conversationId,
          senderType,
        } = data;

        if (
          !data ||
          !toUserId ||
          !toUserId ||
          !messageBody ||
          !conversationId
        ) {
          console.warn("Invalid message format", data);
          return;
        }

        const now = new Date().toISOString();

        const messagePayload = {
          conversationId,
          senderId: fromUserId,
          senderType,
          content: messageBody,
          createdAt: now,
        };

        const messageEvent = JSON.stringify({
          type: "NEW_MESSAGE",
          payload: messagePayload,
        });

        const receiverKey =
          senderType === "user" ? `seller_${toUserId}` : `user_${toUserId}`;
        const senderKey =
          senderType === "user" ? `user_${fromUserId}` : `seller_${fromUserId}`;

        const unseenkey = `${receiverKey}_${conversationId}`;
        const prevCount = unseenCount.get(unseenkey) || 0;
        unseenCount.set(unseenkey, prevCount + 1);

        const receiverSocket = connectedUsers.get(receiverKey);
        if (receiverSocket && receiverSocket.readyState === WebSocket.OPEN) {
          receiverSocket.send(messageEvent);

          receiverSocket.send(
            JSON.stringify({
              type: "UNSEEN_COUNT_UPDATE",
              payload: {
                conversationId,
                count: prevCount + 1,
              },
            })
          );

          console.log("MEegsge delivered");
        } else {
          console.log("user is offline . messsage queued");
        }

        const senderSocket = connectedUsers.get(senderKey);
        if (senderSocket && senderSocket.readyState === WebSocket.OPEN) {
          senderSocket.send(messageEvent);
          console.log("Echoed message to sender");
        }

        await producer.send({
          topic: "chat.new_message",
          messages: [
            {
              key: conversationId,
              value: JSON.stringify(messagePayload),
            },
          ],
        });

        console.log("Message qued to kafka");
      } catch (error) {
        console.error("Error processign kafka message : ", error);
      }
    });

    wss.on("close", async () => {
      if (registeredUserId) {
        connectedUsers.delete(registeredUserId);
        console.log("disconnected user");
        const isSeller = registeredUserId.startsWith("seller_");
        const redisKey = isSeller
            ? `online:seller:${registeredUserId.replace("seller_", "")}`
            : `online:user:${registeredUserId}`;
        await redis.del(redisKey);
      }
    });

    ws.on("error",(err)=>{
        console.error("Websocket error: ",err);
    })
  });

  console.log("WebSocket server ready 😂");
}
