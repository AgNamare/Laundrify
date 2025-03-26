import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetServiceByCategory } from "../api/laundromatApi"; // Assuming this is where useGetServiceByCategory is
import { useUpdateServiceByCategory } from "../api/laundromatApi"; // Assuming this is where useUpdateServiceByCategory is
import { useGetClothesTypes } from "../api/clothesTypeApi";
import ServiceManagementForm from "../forms/ServiceManagementForm";

const UpdateServicePage = () => {
  const { laundromatId, category } = useParams();
  const { service, isLoadingService, refetch } = useGetServiceByCategory(
    laundromatId,
    category
  );
  const { updateServiceByCategory, isUpdatingServiceByCategory } =
    useUpdateServiceByCategory();
  const { clothesTypes, isLoading: isLoadingTypes } = useGetClothesTypes();

  const [serviceData, setServiceData] = useState(null);

  useEffect(() => {
    if (service && !isLoadingService) {
      setServiceData(service);
    }
  }, [service, isLoadingService]);

  const defaultValues = serviceData
    ? {
        category: serviceData.category || "",
        unit: serviceData.unit || "",
        description: serviceData.description || "",
        prices: serviceData.prices || [],
      }
    : {};

  const handleUpdateSubmit = async (data) => {
    console.log(laundromatId, category, serviceData);
    try {
      await updateServiceByCategory({
        laundromatId,
        category,
        serviceData: data,
      });
      setServiceData({ ...data });
      refetch();
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  if (isLoadingService || isLoadingTypes) return <p>Loading....</p>;

  return (
    <div>
      <div className="p-2 m-2 border rounded-md">
        <h1 className="text-lg font-medium">Update Service</h1>
      </div>
      {serviceData && (
        <ServiceManagementForm
          onSave={handleUpdateSubmit}
          defaultValues={defaultValues}
          isLoading={isUpdatingServiceByCategory} // Changed to isUpdatingServiceByCategory
          clothesTypes={clothesTypes}
          action="Update Service"
        />
      )}
    </div>
  );
};

export default UpdateServicePage;
