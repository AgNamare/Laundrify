import { useQuery } from "react-query";
import axios from "@/api/axios.js";
import { toast } from "sonner";

const getUsersRequest = async () => {
  const response = await axios.get("/api/v1/users");
  return response.data;
};

// Custom hook
export const useGetUsers = () => {
  const { data: users, isLoading, isError, error } = useQuery(
    ["users"],
    getUsersRequest,
    {
      onError: (error) => {
        const errorMessage = error.response?.data?.message || "Failed to load users";
        toast.error(errorMessage);
      },
    }
  );

  return { users, isLoading, isError, error };
};