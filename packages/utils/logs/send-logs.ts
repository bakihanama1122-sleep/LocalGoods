
import {kafka} from "../kafka/index"

const producer = kafka.producer();

export async function sendLog({
    type="info",
    message,
    source="unknon-service"
}:{
    type?:"info" | "error" | "warning" | "success" | "debug"
    message:string;
    source?:string;
}){
    const logpayload = {
        type,
        message,
        timeStamp:new Date().toISOString(),
        source,
    };

    await producer.connect();
    await producer.send({
        topic:"logs",
        messages:[{value: JSON.stringify(logpayload)}],
    });
    await producer.disconnect();
}