import { useParams } from "react-router-dom";
import { useGetClothesTypes } from "../api/clothesTypeApi";
import { useAddService } from "../api/LaundromatApi";
import ServiceManagementForm from "../forms/ServiceManagementForm";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const AddNewServicePage = () => {
  const { clothesTypes, isLoading: isLoadingTypes } = useGetClothesTypes();
  const { addService, isAdding } = useAddService();
  const user = useSelector((state) => state.user?.user?.user);
  console.log(user)
  const laundromatId = user.laundromat
  console.log(laundromatId)

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
    <div className="">
      <div className="p-2 my-2 border flex justify-between border-slate-200 rounded-md">
        <h1 className="text-lg font-medium ">Service Management</h1>
      </div>
      <ServiceManagementForm
        onSave={handleSave}
        isLoading={isAdding}
        clothesTypes={clothesTypes}
      />
    </div>
  );
};

export default AddNewServicePage;
