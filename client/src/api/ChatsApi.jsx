// src/api/useChats.js
import { useQuery, useMutation } from "react-query";
import axios from "@/api/axios.js";// Adjust path based on your setup
import { toast } from "sonner"; 

// Pass userId as a parameter in the URL
const fetchChats = async (userId) => {
  console.log("Fetching chats for userId: ", userId); // Log the userId to see if it's being passed correctly
  const res = await axios.get(`/api/v1/chats/${userId}`);
  return res.data; // assuming response = { success: true, chats: [...] }
};

export const useChats = (userId) => {
  return useQuery(["chats", userId], () => fetchChats(userId), {
    enabled: !!userId, // Only run query when userId exists
    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
    retry: 1,
  });
};


const fetchChatWithLaundromat = async (laundromatId) => {
  const res = await axios.post(`/api/v1/chats/laundromat`, {
    laundromatId,
  });
  console.log("Response: ", res.data);
  return res.data;
};

export const useChatWithLaundromat = (laundromatId) => {
  return useQuery(
    ["chat-with-laundromat", laundromatId],
    () => fetchChatWithLaundromat(laundromatId),
    {
      enabled: !!laundromatId ,
      staleTime: 1000 * 60, // 1 minute
      refetchOnWindowFocus: true,
      retry: 1,
    }
  );
};

const fetchChat = async ({ senderId, receiverId, laundromatId }) => {
  const res = await axios.post(`/api/v1/chats/laundromat`, {
    senderId,
    receiverId,
    laundromatId,
  });
  console.log("Response: ", res.data);
  return res.data;
};

export const useChat = ({ senderId, receiverId, laundromatId }) => {
  return useQuery(
    ["chat", senderId, receiverId, laundromatId],
    () => fetchChat({ senderId, receiverId, laundromatId }),
    {
      enabled: !!senderId && !!receiverId && !!laundromatId,
      staleTime: 1000 * 60, // 1 minute
      refetchOnWindowFocus: true,
      retry: 1,
    }
  );
};



const fetchMessages = async (chatId) => {
  const res = await axios.get(`/api/v1/messages/${chatId}`); // Assuming endpoint returns messages for a given chat
  return res.data; // Assuming response = { success: true, messages: [...] }
};

// Hook to fetch messages of a particular chat
export const useMessages = (chatId) => {
  return useQuery(["messages", chatId], () => fetchMessages(chatId), {
    enabled: !!chatId, // Only run when chatId is available
    staleTime: 1000 * 60, // Cache for 1 minute
    refetchOnWindowFocus: true,
    retry: 1, // Retry once if the request fails
  });
};

const sendMessageRequest = async ({ chatId, senderId, content }) => {
  const response = await axios.post("/api/v1/messages", {
    chatId,
    senderId,
    content,
  });
  return response.data; // Assuming it returns the full message
};

export const useSendMessage = () => {
  const { mutateAsync: sendMessage, isLoading } = useMutation(sendMessageRequest, {
    onSuccess: (data) => {
      toast.success("Message sent successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send message");
    },
  });

  return { sendMessage, isLoading };
};


const getChat = async (chatId) => {
  const res = await axios.get(`/api/v1/chats/get/${chatId}`);
  return res.data;
};

export const useGetChat = (chatId) => {
  return useQuery(
    ["chat", chatId],
    () => getChat(chatId),
    {
      enabled: !!chatId,
      staleTime: 1000 * 60, // 1 minute
      refetchOnWindowFocus: true,
      retry: 1,
    }
  );
};
