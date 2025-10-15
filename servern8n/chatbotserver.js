// server/routes/chatbotRoutes.js
import express from "express";
import { getChatbotResponse } from "../controllers/chatbotController.js";

const router = express.Router();

router.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  const response = await getChatbotResponse(userMessage);
  res.json(response);
});

export default router;
