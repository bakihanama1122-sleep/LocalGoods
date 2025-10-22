import { kafka } from "../../../packages/utils/kafka/index";
import prisma from "../../../packages/libs/prisma/index";
import { Consumer, EachMessagePayload } from "kafkajs";
import { incrementUnseenCount } from "../../../packages/libs/redis/message.redis";


interface BufferedMessage {
  conversationId: string;
  senderId: string;
  senderType: string;
  content: string;
  createdAt: string;
  attachments: string[],
}

const TOPIC = "chat.new_message";
const GROUP_ID = "chat-message-db-writer";
const BATCH_INTERVAL_MS = 3000;

let buffer: BufferedMessage[] = [];
let flushTimer: NodeJS.Timeout | null = null;

export async function startConsumer() {
  const consumer: Consumer = kafka.consumer({ groupId: GROUP_ID });
  await consumer.connect();
  await consumer.subscribe({ topic: TOPIC, fromBeginning: false });
  console.log("Kafka consumer connedted and subscribed to topic chat");

  await consumer.run({
    eachMessage: async ({ message }: EachMessagePayload) => {
      if (!message.value) return;
      try {
        const parsed: BufferedMessage = JSON.parse(message.value.toString());
        buffer.push(parsed);

        // if this is first message in an empty array then start timer
        if (buffer.length === 1 && !flushTimer) {
          flushTimer = setTimeout(flushBufferToDb, BATCH_INTERVAL_MS);
        }
      } catch (error) {
        console.log("Failded to parse kafka message", error);
      }
    },
  });
}

async function flushBufferToDb() {
  const toInsert = buffer.splice(0, buffer.length);
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }

  if (toInsert.length === 0) return;

  try {
    const prismaPayload= toInsert.map((msg) => ({
      conversationId: msg.conversationId,
      senderId: msg.senderId,
      senderType: msg.senderType,
      content: msg.content,
      attachments: [],
      createdAt: new Date(msg.createdAt),
    }));

    await prisma.message.createMany({
      data: prismaPayload,
    });

    for (const msg of prismaPayload) {
      const receiverType = msg.senderType === "user" ? "seller" : "user";
      await incrementUnseenCount(receiverType, msg.conversationId);
    }

    console.log("flushed messages");
  } catch (error) {
      console.error("Failed to insert messages to DB:", error);
      buffer.unshift(...toInsert);
      if(!flushTimer){
        flushTimer = setTimeout(flushBufferToDb,BATCH_INTERVAL_MS);
      }
  }
}
