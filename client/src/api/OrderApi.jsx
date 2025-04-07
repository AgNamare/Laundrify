import { useQuery } from "react-query";
import axios from "@/api/axios.js";
import { useMutation } from "react-query";
import { toast } from "sonner";

export const placeOrderRequest = async (orderData) => {
  const response = await axios.post("/api/v1/orders", orderData);
  return response.data;
};

export const usePlaceOrder = () => {
  const { mutateAsync: placeOrder, isLoading: isPlacingOrder } = useMutation(placeOrderRequest, {
    onSuccess: () => {
      toast.success("Order placed successfully!");
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Failed to place order";
      toast.error(errorMessage);
    },
  });
  return { placeOrder, isPlacingOrder };
};