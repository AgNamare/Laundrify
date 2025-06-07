import axios from "@/api/axios.js";
import { toast } from "sonner";
import { useQuery } from "react-query";

const getClothesTypesRequest = async () => {
  try {
    const response = await axios.get("/api/v1/clothes-types");
    return response.data;
  } catch (error) {
    console.error("Error fetching clothes types:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch clothes types");
  }
};

export const useGetClothesTypes = () => {
  const { data: clothesTypes, isLoading, isError, error } = useQuery(
    ["clothesTypes"],
    getClothesTypesRequest,
    {
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  return { clothesTypes, isLoading, isError, error };
};


