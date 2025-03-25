import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import Loader from "@/components/Loader";

const formSchema = z.object({
  category: z.string().nonempty("Service category is required"),
  unit: z.string().nonempty("Unit is required"),
  description: z.string().optional(),
  prices: z.record(z.string()).optional(),
});

const ServiceManagementForm = ({ onSave, isLoading, clothesTypes }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const [selectedClothes, setSelectedClothes] = useState({});

  const handleClothesSelection = (id) => {
    setSelectedClothes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const submitHandler = (data) => {
    const pricesArray = Object.entries(data.prices || {})
      .filter(([id, price]) => selectedClothes[id] && price.trim() !== "")
      .map(([clothesType, priceValue]) => ({
        clothesType,
        customPrice: parseFloat(priceValue),
      }));

    const serviceData = {
      category: data.category,
      unit: data.unit,
      description: data.description,
      prices: pricesArray,
    };

    onSave(serviceData);
    reset();
  };

  return (
    <div className="bg-white sm:border sm:border-gray-300 sm:rounded-xl w-full max-w-5xl mx-auto p-6 space-y-6 shadow-lg">
      <h2 className="text-2xl font-bold text-center">Service Management</h2>

      <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
        {/* Service Category */}
        <div>
          <label className="block font-medium mb-1">Service Category</label>
          <select
            {...register("category")}
            className="border p-3 w-full rounded-md"
          >
            <option value="">Select Category</option>
            <option value="Wash & Fold">Wash & Fold</option>
            <option value="Dry Cleaning">Dry Cleaning</option>
            <option value="Ironing">Ironing</option>
            <option value="Stain Removal">Stain Removal</option>
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Unit</label>
          <select
            {...register("unit")}
            className="border p-3 w-full rounded-md"
          >
            <option value="">Select Unit</option>
            <option value="Per kg">Per kg</option>
            <option value="Per item">Per item</option>
          </select>
          {errors.unit && (
            <p className="text-red-500 text-sm">{errors.unit.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">
            Description (Optional)
          </label>
          <textarea
            placeholder="Service description"
            {...register("description")}
            className="border p-3 w-full rounded-md"
          ></textarea>
        </div>

        {/* Clothes Pricing Selection */}
        <div>
          <label className="block font-medium mb-2">
            Set Pricing for Clothes
          </label>
          {clothesTypes && clothesTypes.length > 0 ? (
            <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
              {clothesTypes.map((type) => (
                <div
                  key={type._id}
                  className="flex items-center gap-4 border-b py-3"
                >
                  <img
                    src={type.imageUrl || "/placeholder-image.jpg"}
                    alt={type.name}
                    className="w-14 h-14 object-cover rounded-md"
                  />
                  <span className="font-medium">{type.name}</span>
                  <input
                    type="checkbox"
                    checked={selectedClothes[type._id] || false}
                    onChange={() => handleClothesSelection(type._id)}
                    className="ml-auto"
                  />
                  {selectedClothes[type._id] && (
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Custom Price"
                      {...register(`prices.${type._id}`)}
                      className="border p-2 rounded-md w-28 focus:border-primary"
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No clothes types available.</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-white font-semibold py-3 rounded-full transition hover:opacity-90"
        >
          {isLoading ? <Loader /> : "Add Service"}
        </button>
      </form>
    </div>
  );
};

export default ServiceManagementForm;
