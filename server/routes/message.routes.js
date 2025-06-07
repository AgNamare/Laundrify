import express from "express";
import { sendMessage, getMessagesByChat } from "../controllers/message.controller.js";

const router = express.Router();

router.post("/", sendMessage); // Send a message
router.get("/:chatId", getMessagesByChat); // Get all messages in a chat

export default router;
