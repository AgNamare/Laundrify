import Message from "../models/message.model.js";
import Chat from "../models/chat.model.js";

export const sendMessage = async (req, res, next) => {
  try {
    const { chatId, senderId, content } = req.body;

    // 1. Create the message
    const message = await Message.create({
      chat: chatId,
      sender: senderId,
      content,
    });

    // 2. Populate sender and chat if needed
    const fullMessage = await message
      .populate("sender") 

    // 3. Update chat's latestMessage field
    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message._id,
    });

    // 4. Emit via Socket.IO
    req.app.get("io").to(chatId).emit("receive_message", fullMessage);

    // 5. Return the message
    res.status(201).json(fullMessage);
  } catch (error) {
    next(error);
  }
};


export const getMessagesByChat = async (req, res, next) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};
