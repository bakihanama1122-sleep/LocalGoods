import {kafka} from "../../../packages/utils/kafka/index"
import { updateUserAnalytics } from "./services/analytics.service";

const consumer = kafka.consumer({groupId:"user-events-group"});

const eventQueue: any[] = [];

const processQueue = async()=>{
  if(eventQueue.length===0) return;

  const events=[...eventQueue];
  eventQueue.length = 0;

  for(const event of events){
    if(event.action === "shop_visit"){
      // update shop analytics
    }
    const validActions = [
      "add_to_wishlist",
      "add_to_cart",
      "product_view",
      "remove_from_cart",
      "remove_from_wishlist"
    ];
    if(!event.action || !validActions.includes(event.action)){
      console.warn("⚠️ Invalid event action:", event.action);
    continue;
    }

    try {
      await updateUserAnalytics(event);
      console.log("✅ Updated analytics for:", event.action);
    } catch (error) {
      console.log("Error processing event : ",error);
      console.error("❌ Error processing event:", error);
    }
  }
};

setInterval(processQueue,3000);

// kafka consumer for user events
// export const consumeKafkaMessages = async()=>{
//   await consumer.connect();
//   await consumer.subscribe({topic:"users-events",fromBeginning:false});
//     await consumer.run({
//       eachMessage:async({message})=>{
//         if(!message.value) return;
//         const event = JSON.parse(message.value.toString());
//         eventQueue.push(event);
//       },
//     });
// };

export const consumeKafkaMessages = async () => {
  await consumer.connect();
  console.log("✅ Kafka consumer connected");
  await consumer.subscribe({ topic: "users-events", fromBeginning: false });
  console.log("📨 Subscribed to topic users-events");

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        if (!message.value) return;
        const event = JSON.parse(message.value.toString());
        console.log("📥 Received event:", event);
        eventQueue.push(event);
      } catch (err) {
        console.error("❌ Error parsing Kafka message:", err);
      }
    },
  });
};
consumeKafkaMessages().catch(console.error);