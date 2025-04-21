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

export const getOrdersRequest = async (laundromatId, filters) => {
  const response = await axios.get(`/api/v1/orders/laundromat/${laundromatId}`, {
    params: filters, // sending filters as query params
  });
  return response.data;
};

// Custom hook for fetching orders with filters
export const useGetOrders = (laundromatId, filters) => {
  const { data, isLoading, isError, error } = useQuery(
    ["orders", laundromatId, filters], // unique query key with laundromatId and filters
    () => getOrdersRequest(laundromatId, filters), // function to fetch data
    {
      onSuccess: () => {
        toast.success("Orders fetched successfully!");
      },
      onError: (err) => {
        const errorMessage = err.response?.data?.message || "Failed to fetch orders";
        toast.error(errorMessage);
      },
      enabled: !!laundromatId, // Query will not run unless laundromatId is provided
    }
  );

  return { orders: data, isLoading, isError, error };
};

export const getOrderRequest = async (orderId) => {
  const response = await axios.get(`/api/v1/orders/${orderId}`);
  return response.data;
};

// Custom hook for fetching a single order by ID
export const useGetOrder = (orderId) => {
  const { data, isLoading, isError, error } = useQuery(
    ["order", orderId],
    () => getOrderRequest(orderId),
    {
      enabled: !!orderId,
      onSuccess: () => {
        toast.success("Order fetched successfully!");
      },
      onError: (err) => {
        const errorMessage = err.response?.data?.message || "Failed to fetch order";
        toast.error(errorMessage);
      },
    }
  );

  return { order: data, isLoading, isError, error };
};

// Function to update an order
const updateOrderRequest = async (orderId, updateData) => {
  const response = await axios.put(`/api/v1/orders/${orderId}`, updateData);
  return response.data;
};

// Custom hook for updating an order
export const useUpdateOrder = () => {
  const { mutateAsync: updateOrder, isLoading: isUpdatingOrder, isError, error } = useMutation(
    // Function to update the order
    ({ orderId, updateData }) => updateOrderRequest(orderId, updateData),
    {
      onSuccess: (data) => {
        toast.success("Order updated successfully!");
      },
      onError: (err) => {
        const errorMessage = err.response?.data?.message || "Failed to update order";
        toast.error(errorMessage);
      },
    }
  );

  return { updateOrder, isUpdatingOrder, isError, error };
};
