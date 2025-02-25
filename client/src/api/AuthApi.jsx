import { useMutation } from "react-query";
import axios from "@/api/axios.js";
import { toast } from "sonner";

export const useRegister = () => {
  const registerRequest = async (userData) => {
    try {
      const response = await axios.post("/api/v1/auth/register", userData);
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error(error.response?.data?.message || "An error occurred");
    }
  };

  const { mutateAsync: register, isLoading: isRegistering } = useMutation(
    registerRequest,
    {
      onSuccess: () => {
        toast.success("Registration Successful");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  return { register, isRegistering };
};
