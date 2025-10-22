
import express from 'express';
import cors from "cors";
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import {errorMiddleware} from '../../../packages/error-handler/error-middleware';
import router from './routes/order.route';
import { createOrder } from './controllers/order.controller';


const app = express();
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
app.post("/api/create-order",bodyParser.raw({type:"application/json"}),(req,res,next)=>{
  (req as any).rawBody = req.body;
  next();
},createOrder);

app.use(express.json())
app.use(cookieParser())


app.get('/', (req, res) => {
  res.send({ message: 'Welcome to order-service!' });
});

app.use("/api",router);

app.use(errorMiddleware);
const port = process.env.PORT || 6004;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
