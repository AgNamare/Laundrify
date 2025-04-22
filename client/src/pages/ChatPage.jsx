import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  useChatWithLaundromat,
  useMessages,
  useSendMessage,
} from "../api/ChatsApi";
import { io } from "socket.io-client";
import { Send } from "lucide-react";

const ChatPage = () => {
  const { laundromatId } = useParams();
  const user = useSelector((state) => state.user?.user?.user);

  const {
    data: chat,
    isLoading: isChatLoading,
    isError: isChatError,
  } = useChatWithLaundromat(laundromatId);
  const {
    data: messages,
    isLoading: isMessagesLoading,
    isError: isMessagesError,
  } = useMessages(chat?._id);
  const { sendMessage, isLoading: isSending } = useSendMessage();

  const [messageContent, setMessageContent] = useState("");
  const [localMessages, setLocalMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const socketInstance = io("http://localhost:5000", {
      withCredentials: true,
    });

    setSocket(socketInstance);

    if (chat) {
      socketInstance.emit("join_chat", chat._id);
    }

    socketInstance.on("receive_message", (newMessage) => {
      setLocalMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [chat]);

  useEffect(() => {
    if (messages) {
      setLocalMessages(messages);
    }
  }, [messages]);

  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };

    const timeout = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeout);
  }, [localMessages]);

  const handleSendMessage = async () => {
    if (!messageContent.trim()) return;

    try {
      const message = {
        chatId: chat._id,
        senderId: user._id,
        content: messageContent,
      };

      const sentMessage = await sendMessage(message);
      setMessageContent("");

      setLocalMessages((prev) => [
        ...prev,
        {
          ...sentMessage,
          sender: { _id: user._id },
          createdAt: new Date().toISOString(),
        },
      ]);

      socket.emit("send_message", message);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (isChatLoading || isMessagesLoading) {
    return <p className="p-4">Loading chat...</p>;
  }

  if (isChatError || isMessagesError) {
    return <p className="p-4 text-red-500">Failed to load chat.</p>;
  }

  if (!chat || !user) {
    return <p className="p-4 text-red-500">Chat or user data is missing.</p>;
  }

  const otherUser = chat.participants.find((p) => p._id !== user._id);

  return (
    <div className="flex flex-col w-full h-[calc(100vh-75px)] bg-transparent overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white shrink-0">
        <img
          src={
            otherUser?.img ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT15mynqqFBDhVBtNogWaARJBgMFvA7IQssIA&s"
          }
          alt={otherUser?.fName}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h2 className="text-base font-semibold text-gray-800">
            {otherUser?.fName}
          </h2>
          <p className="text-xs text-green-500">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto py-6 space-y-4 px-4 bg-[#EFF1F5]"
      >
        {localMessages?.length ? (
          localMessages.map((msg) => {
            const isUser = msg.sender._id === user._id;
            return (
              <div
                key={msg._id || Math.random()}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-sm p-3 rounded-xl text-sm ${
                    isUser
                      ? "bg-primary text-white"
                      : "bg-white text-gray-800 shadow-sm"
                  }`}
                >
                  <p>{msg.content}</p>
                  <span className="text-[10px] text-gray-300 mt-1 block text-right">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-400">No messages yet.</p>
        )}
      </div>

      {/* Message Input */}
      <div className="bg-white p-3 flex items-center gap-1 sticky bottom-0 z-40">
        <div className="bg-[#EFF1F5] rounded-full px-4 py-2 flex items-center gap-2 w-full">
          <input
            type="text"
            placeholder="Type a message"
            className="flex-1 bg-[#EFF1F5] text-sm outline-none"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
          />
          <button
            className=""
            onClick={handleSendMessage}
            disabled={isSending}
          >
            <Send size={26} className={isSending ? "text-textSecondary rotate-45" : "text-primary rotate-45"} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
