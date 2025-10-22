"use server"
import {kafka} from "../../../../packages/utils/kafka/index"

const producer = kafka.producer();

let isConnected = false;

export async function sendKafkaevent(eventData:{
    userId?:string;
    productId?:string;
    shopId?:string;
    action:string;
    device?:string;
    country?:string;
    city?:string;
}){
    try {
        if (!isConnected) {
      await producer.connect();
      isConnected = true;
      console.log("🔌 Kafka producer connected once");
    }
       

        await producer.send({
            topic:"users-events",
            messages:[{value:JSON.stringify(eventData)}],
        });
        console.log("✅ Event sent to Kafka:", eventData);
    } catch (error) {
        console.log(error);
    }finally{
        await producer.disconnect();
    }
}