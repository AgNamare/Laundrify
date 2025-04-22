import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useChats } from "../api/ChatsApi";
import { useSelector } from "react-redux";

const ChatListPage = () => {
  const user = useSelector((state) => state.user?.user?.user);
  const { data: chats, isLoading, error } = useChats(user?._id); // Added error and loading states
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (user?._id) {
      console.log("Fetching chats for user: ", user._id);
    } else {
      console.log("User ID is not available.");
    }
  }, [user]);

  // Log the chats or errors
  useEffect(() => {
    if (chats) {
      console.log("Fetched Chats: ", chats);
    }
    if (error) {
      console.error("Error fetching chats: ", error);
    }
  }, [chats, error]);

  const filteredChats = chats?.filter((chat) => {
    const otherUser = chat.participants[1]; // always index 1
    const fullName = `${otherUser?.fName || ""} ${otherUser?.lName || ""}`;
    return fullName.toLowerCase().includes(search.toLowerCase());
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading chats. Please try again later.</div>;
  }

  return (
    <div className="min-h-screen  px-4 py-6">
      <h2 className="text-2xl font-semibold mb-4">Chats</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search in chats"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-xl bg-gray-100 focus:outline-none"
        />
      </div>

      <h3 className="text-sm text-gray-500 mb-2">All Messages</h3>
      {filteredChats?.map((chat) => (
        <ChatItem key={chat._id} chat={chat} />
      ))}
    </div>
  );
};

const ChatItem = ({ chat }) => {
  console.log("Chat Item: ", chat); // Log the chat item
  const otherUser = chat.participants[1];
  const latestMsg = chat.latestMessage;

  const formattedTime = latestMsg?.createdAt
    ? new Date(latestMsg.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <Link
      to={`/app/chat/${chat.laundromat._id}`}
      className="flex items-center justify-between gap-4 py-3 px-2 hover:bg-gray-100 rounded-xl cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <img
          src={
            otherUser?.img ||
            "data:image/jpeg;base64,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"
          }
          alt={`${otherUser?.fName} ${otherUser?.lName}`}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h4 className="font-medium text-sm text-gray-900">
            {otherUser?.fName} {otherUser?.lName}
          </h4>
          <p className="text-gray-500 text-sm truncate max-w-[200px]">
            {latestMsg?.content || "No messages yet..."}
          </p>
        </div>
      </div>
      <span className="text-xs text-gray-400">{formattedTime}</span>
    </Link>
  );
};

export default ChatListPage;
