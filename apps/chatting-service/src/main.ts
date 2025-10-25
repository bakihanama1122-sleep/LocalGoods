
import express from 'express';
import cookieParser from "cookie-parser"
import { createWebSocketServer } from './websocket';
import { startConsumer } from './chat-message.consumer';
import router from './routes/chat.routes';
import cors from "cors";

const app = express();
app.use(express.json())
app.use(cookieParser());


const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
];


app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.get('/', (req, res) => {
  res.send({ message: 'Welcome to chatting-service!' });
});

app.use("/api",router);

const port = process.env.PORT || 6006;




const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);

// websockets server
createWebSocketServer(server);

startConsumer().catch((error:any)=>{
  console.log(error);
});