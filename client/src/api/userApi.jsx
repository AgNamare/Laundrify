import { useQuery } from "react-query";
import axios from "@/api/axios.js";
import { toast } from "sonner";

// Function to fetch users with optional role
const getUsersRequest = async (role) => {
  const response = await axios.get("/api/v1/users", {
    params: role ? { role } : {}, // Add role if provided
  });
  return response.data;
};

// Custom hook with optional role
export const useGetUsers = (role) => {
  const { data: users, isLoading, isError, error } = useQuery(
    ["users", role], // Include role in query key for caching
    () => getUsersRequest(role),
    {
      onError: (error) => {
        const errorMessage = error.response?.data?.message || "Failed to load users";
        toast.error(errorMessage);
      },
    }
  );

  return { users, isLoading, isError, error };
};
