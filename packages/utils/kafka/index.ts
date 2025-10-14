import { Kafka} from "kafkajs";

export const kafka = new Kafka({
    clientId:"kafka-service",
    brokers:[""],
    ssl:true,
    sasl:{
        mechanism:"plain",
        username:process.env.KAFKA_API_KEY!,
        password:process.env.KAFKA_API_SECRET!,
    }
});
