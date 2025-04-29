import express from "express";
import {
  createOrGetChat,
  getChat,
  getUserChats,
  getUserChatsController,
} from "../controllers/chat.controllers.js";
import Chat from "../models/chat.model.js";
import protect from "../middlewares/auth.middleware.js";
import Laundromat from "../models/laundromat.model.js";

const router = express.Router();

router.post("/", createOrGetChat); // Create a chat or get existing between user & laundromat
router.get("/get/:chatId", getChat); // Create a chat or get existing between user & laundromat
router.get("/", getUserChatsController); // Create a chat or get existing between user & laundromat
router.get("/:userId", getUserChats); // Get all chats for a user
router.post("/laundromat", protect, async (req, res) => {
  const userId = req.user._id;
  const { laundromatId } = req.body;

  try {
    // Fetch laundromat and its admin
    const laundromat = await Laundromat.findById(laundromatId);
    if (!laundromat) {
      return res.status(404).json({ message: "Laundromat not found" });
    }

    const adminId = laundromat.admin; // Assuming `admin` is a field on the laundromat that contains the admin's user ID

    // Find an existing chat or create a new one with both the user and the laundromat's admin as participants
    let chat = await Chat.findOne({
      participants: { $all: [userId, adminId] },
      laundromat: laundromatId,
    }).populate("participants", "-password");

    if (!chat) {
      // If no existing chat is found, create a new chat
      chat = await Chat.create({
        participants: [userId, adminId],  // Add both user and admin as participants
        laundromat: laundromatId,
      });
    }

    // Fetch the full chat with populated participants
    const fullChat = await Chat.findById(chat._id).populate("participants", "-password");

    res.status(200).json(fullChat);  // Send the chat details back
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
