import { useQuery } from "react-query";
import axios from "@/api/axios.js";
import { useMutation } from "react-query";
import { toast } from "sonner";

const getLaundromatDetailsRequest = async (laundromatId) => {
  try {
    const response = await axios.get(`/api/v1/laundromats/${laundromatId}`); // Adjust the API endpoint as needed
    console.log("Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching laundromat details:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch laundromat details"
    );
  }
};

export const useGetLaundromatDetails = (laundromatId) => {
  const {
    data: laundromat,
    isLoading,
    isError,
    error,
  } = useQuery(
    ["laundromat", laundromatId],
    () => getLaundromatDetailsRequest(laundromatId),
    {
      enabled: !!laundromatId, // Only run the query if laundromatId is available
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  return { laundromat, isLoading, isError, error };
};

const addServiceRequest = async ({ laundromatId, serviceData }) => {
  const response = await axios.post(
    `/api/v1/laundromats/${laundromatId}/services`,
    serviceData
  );
  return response.data;
};

export const useAddService = () => {
  const { mutateAsync: addService, isLoading: isAdding } = useMutation(
    addServiceRequest,
    {
      onSuccess: () => {
        toast.success("Service added successfully!");
      },
      onError: (error) => {
        const errorMessage =
          error.response?.data?.message || "An error occurred";
        toast.error(errorMessage);
      },
    }
  );

  return { addService, isAdding };
};

 

const updateServiceByCategoryRequest = async ({ laundromatId, category, serviceData }) => {
  const encodedCategory = encodeURIComponent(category)
  const response = await axios.put(
    `/api/v1/laundromats/${laundromatId}/services/${encodedCategory}`,
    serviceData
  );
  return response.data;
};

export const useUpdateServiceByCategory = () => {
  const { mutateAsync: updateServiceByCategory, isLoading: isUpdatingServiceByCategory } = useMutation(
    updateServiceByCategoryRequest,
    {
      onSuccess: () => {
        toast.success("Service updated successfully!");
      },
      onError: (error) => {
        const errorMessage = error.response?.data?.message || "An error occurred";
        toast.error(errorMessage);
      },
    }
  );

  return { updateServiceByCategory, isUpdatingServiceByCategory };
};

export const useGetServiceByCategory = (laundromatId, category) => {
  const fetchServiceById = async (laundromatId, category) => {
    const encodedCategory = encodeURIComponent(category); // Encode the category

    const response = await axios.get(
      `/api/v1/laundromats/${laundromatId}/services/${encodedCategory}`
    );
    return response.data;
  };

  const {
    data: service,
    isLoading: isLoadingService,
    refetch,
  } = useQuery(
    ["service", laundromatId, category],
    () => fetchServiceById(laundromatId, category),
    {
      enabled: !!laundromatId && !!category,
    }
  );

  return { service, isLoadingService, refetch };
};

const getServicesRequest = async (laundromatId) => {
  try {
    const response = await axios.get(`/api/v1/laundromats/${laundromatId}/services`);
    return response.data;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch services");
  }
};

export const useGetServices = (laundromatId) => {
  const { data: services, isLoading, isError, error } = useQuery(
    ["services", laundromatId],
    () => getServicesRequest(laundromatId),
    {
      onError: (error) => {
        toast.error(error.message);
      },
      enabled: !!laundromatId,
    }
  );

  return { services, isLoading, isError, error };
};
const searchLaundromatsRequest = async (query) => {
  const encodedQuery = encodeURIComponent(query);
  const response = await axios.get(`/api/v1/laundromats/search?query=${encodedQuery}`);
  return response.data;
};

export const useSearchLaundromats = () => {
  const { mutateAsync: searchLaundromats, isLoading: isSearchingLaundromats } = useMutation(
    searchLaundromatsRequest,
    {
      onSuccess: (data) => {
        if (data.length === 0) {
          toast.info("No laundromats found.");
        } else {
          toast.success("Laundromats found!");
        }
      },
      onError: (error) => {
        const errorMessage = error.response?.data?.message || "An error occurred";
        toast.error(errorMessage);
      },
    }
  );

  return { searchLaundromats, isSearchingLaundromats };
};

const getLaundromatsRequest = async () => {
  const response = await axios.get("/api/v1/laundromats?limit=5");
  return response.data;
};

export const useGetLaundromats = () => {
  const { data: laundromats, isLoading, isError, error } = useQuery(
    ["laundromats"],
    getLaundromatsRequest,
    {
      onError: (error) => {
        const errorMessage = error.response?.data?.message || "Failed to load laundromats";
        toast.error(errorMessage);
      },
    }
  );

  return { laundromats, isLoading, isError, error };
};
