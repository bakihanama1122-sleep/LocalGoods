import express from 'express';
import cors from 'cors';
import {errorMiddleware} from '../../../packages/error-handler/error-middleware';
import cookieParser from 'cookie-parser';
import AuthRouter from "./routes/auth.router.js"
import swaggerUi from "swagger-ui-express";
import * as fs from 'fs';
import * as path from 'path';
const swaggerJsonPath = path.join(__dirname, 'src/swagger-output.json');
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerJsonPath, 'utf8'));

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 6001;

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
];

// Add this CORS middleware to your admin service
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
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send({ 'message': 'Hello API'});
});

// Routes
app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerDocument));
app.get("/docs",(req,res)=>{
  res.json(swaggerDocument);
})
app.use("/api",AuthRouter);

app.use(errorMiddleware);

const server = app.listen(port, host, () => {
    console.log(`[ ready ] http://${host}:${port}/api`);
    console.log(`swagger Docs available at http://localhost:${port}/docs`)
});

server.on('error',(error) => console.error(error));
