import Chat from "../models/chat.model.js";

export const createOrGetChat = async (req, res, next) => {
  try {
    const { senderId, receiverId, laundromatId } = req.body;

    let chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
      laundromat: laundromatId,
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [senderId, receiverId],
        laundromat: laundromatId,
      });
    }

    res.status(200).json(chat);
  } catch (error) {
    next(error);
  }
};

export const getChat = async (req, res, next) => {
  const { chatId } = req.params; // Get chatId from request body
  console.log("chatId", chatId);
  try {
    const chat = await Chat.findById(chatId)
      .populate("participants", "laundromat")
      .sort({ updatedAt: -1 });

    res.status(200).json(chat);
  } catch (error) {
    next(error);
  }
};

export const getUserChats = async (req, res, next) => {
  const userId = req.params.userId; // Get userId from request parameters
  console.log("userId", userId);
  try {
    const chats = await Chat.find({ participants: userId })
      .populate("laundromat")
      .populate("participants")
      .populate("latestMessage");
    console.log("chats", chats);

    res.status(200).json(chats);
  } catch (error) {
    next(error);
  }
};

export const getUserChatsController = async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await Chat.find({ participants: userId })
      .populate("participants", "name email profilePic")
      .populate({
        path: "latestMessage",
        populate: {
          path: "sender",
          select: "name",
        },
      })
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      chats,
    });
  } catch (error) {
    console.error("Error fetching chats", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch chats",
    });
  }
};
