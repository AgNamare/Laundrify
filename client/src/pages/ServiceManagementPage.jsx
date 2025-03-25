import { useParams } from "react-router-dom";
import { useGetClothesTypes } from "../api/clothesTypeApi";
import { useAddService } from "../api/laundromatApi";
import ServiceManagementForm from "../forms/ServiceManagementForm";
import { toast } from "sonner";

const ServiceManagementPage = () => {
  const { laundromatId } = useParams();
  const {clothesTypes, isLoading: isLoadingTypes } = useGetClothesTypes();
  const { addService, isAdding } = useAddService();

  const handleSave = async (formData) => {
    try {
      await addService({ laundromatId, serviceData: formData });
      toast.success("Service added successfully");
    } catch (error) {
      // Error handling is already managed in the hook.
    }
  };

  if (isLoadingTypes) return <p>Loading clothes types...</p>;

  return (
    <div className="flex items-center justify-center min-h-screen">
      <ServiceManagementForm
        onSave={handleSave}
        isLoading={isAdding}
        clothesTypes={clothesTypes}
      />
    </div>
  );
};

export default ServiceManagementPage;
