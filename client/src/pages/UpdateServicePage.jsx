import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useGetServiceByCategory } from "../api/laundromatApi"; // Assuming this is where useGetServiceByCategory is
import { useUpdateServiceByCategory } from "../api/laundromatApi"; // Assuming this is where useUpdateServiceByCategory is
import { useGetClothesTypes } from "../api/clothesTypeApi";
import ServiceManagementForm from "../forms/ServiceManagementForm";
import { Plus } from "lucide-react";

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
    console.log(laundromatId, category, data);
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
      <div className="p-2 my-2 border flex justify-between border-slate-200 rounded-md">
        <h1 className="text-lg font-medium ">Service Management</h1>
        <div className="hover:cursor-pointer">
          <Link
            to={`/laundromat/{laundromatId}/services/add`}
            className=" flex gap-1 justify-center items-center bg-primary text-white px-2 py-1 rounded-full"
          >
            <button>Add New Service</button>
            <Plus size={20} />
          </Link>
        </div>
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
