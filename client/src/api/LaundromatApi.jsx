import { useQuery } from "react-query";
import axios from "@/api/axios.js";
import { useMutation } from "react-query";
import { toast } from "sonner";

const getLaundromatDetailsRequest = async (laundromatId) => {
  try {
    const response = await axios.get(`/api/v1/laundromats/${laundromatId}`); // Adjust the API endpoint as needed
    return response.data;
  } catch (error) {
    console.error("Error fetching laundromat details:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch laundromat details");
  }
};

export const useGetLaundromatDetails = (laundromatId) => {
  const {
    data: laundromat,
    isLoading,
    isError,
    error,
  } = useQuery(["laundromat", laundromatId], () => getLaundromatDetailsRequest(laundromatId), {
    enabled: !!laundromatId, // Only run the query if laundromatId is available
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { laundromat, isLoading, isError, error };
};

const addServiceRequest = async ({ laundromatId, serviceData }) => {
  const response = await axios.post(`/api/v1/laundromats/${laundromatId}/services`, serviceData);
  return response.data;
};

export const useAddService = () => {
  const { mutateAsync: addService, isLoading: isAdding } = useMutation(addServiceRequest, {
    onSuccess: () => {
      toast.success("Service added successfully!");
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
    },
  });

  return { addService, isAdding };
};