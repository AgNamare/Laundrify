import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import Loader from "@/components/Loader";

// Form validation schema
const formSchema = z.object({
  category: z.string().nonempty("Service category is required"),
  unit: z.string().nonempty("Unit is required"),
  description: z.string().optional(),
  prices: z.record(z.string()).optional(),
});

const ServiceManagementForm = ({
  onSave,
  isLoading,
  clothesTypes,
  defaultValues,
  action = "Add Service",
}) => {
  // Memoize default values to ensure proper updates
  const initialValues = useMemo(() => ({ ...defaultValues }), [defaultValues]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  const [selectedClothes, setSelectedClothes] = useState({});
  const [selectedOptionalServices, setSelectedOptionalServices] = useState({
    ironing: { selected: false, percentage: "" }, // Empty string initially
  });

  useEffect(() => {
    reset(initialValues);
    if (initialValues?.prices) {
      const selected = {};
      const priceData = {};

      initialValues.prices.forEach((price) => {
        selected[price.clothesType] = true;
        priceData[price.clothesType] = price.customPrice;
      });

      setSelectedClothes(selected);
      setValue("prices", priceData, { shouldDirty: true });
    }

    if (initialValues?.optionalServices) {
      setSelectedOptionalServices(initialValues.optionalServices);
    }
  }, [initialValues, reset, setValue]);

  const handleClothesSelection = (id) => {
    setSelectedClothes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOptionalServiceSelection = (service) => {
    setSelectedOptionalServices((prev) => ({
      ...prev,
      [service]: {
        ...prev[service],
        selected: !prev[service].selected,
        percentage: "", // Reset percentage when toggling checkbox
      },
    }));
  };

  const handlePercentageChange = (service, value) => {
    setSelectedOptionalServices((prev) => ({
      ...prev,
      [service]: {
        ...prev[service],
        percentage: value,
      },
    }));
  };

  const submitHandler = (data) => {
    console.log(data);
    const pricesArray = Object.entries(data.prices || {})
      .filter(([id, price]) => selectedClothes[id] && price.trim() !== "")
      .map(([clothesType, priceValue]) => ({
        clothesType,
        customPrice: parseFloat(priceValue),
      }));

    const optionalServicesArray = Object.entries(selectedOptionalServices)
      .filter(([service, { selected }]) => selected)
      .map(([service, { percentage }]) => ({
        category: service,
        priceIncreasePercentage: percentage ? parseFloat(percentage) : 0, // Ensure percentage is numeric
      }));

    const serviceData = {
      category: data.category,
      unit: data.unit,
      description: data.description,
      prices: pricesArray,
      optionalServices: optionalServicesArray,
    };

    onSave(serviceData);
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="min-h-full bg-background flex flex-col gap-4 justify-around p-2 rounded-lg h-screen border border-slate-300 m-0 shadow-sm"
    >
      <h2 className="text-xl font-semibold text-gray-800">
        {action === "Add Service" ? "Add New Service" : "Update Service"}
      </h2>

      <div className="flex width-full flex-1 gap-2">
        {/* General Information section */}
        <div className="bg-white flex-1 p-4 rounded-lg border width-full border-slate-200 shadow-sm">
          <h3 className="font-semibold text-md mb-3">General Information</h3>
          <div className="mb-3">
            <label className="block text-sm text-gray-500">
              Service Category
            </label>
            <select
              {...register("category")}
              className="w-full text-sm border border-slate-200 rounded-md p-2"
            >
              <option value="">Select Category</option>
              <option value="Wash & Fold">Wash & Fold</option>
              <option value="Dry Cleaning">Dry Cleaning</option>
              <option value="Ironing">Ironing</option>
              <option value="Stain Removal">Stain Removal</option>
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          <div className="mb-3">
            <label className="block text-sm text-gray-500">Unit</label>
            <select
              {...register("unit")}
              className="w-full text-sm border border-slate-200 rounded-md p-2"
            >
              <option value="">Select Unit</option>
              <option value="Per kg">Per kg</option>
              <option value="Per item">Per item</option>
            </select>
            {errors.unit && (
              <p className="text-red-500 text-sm mt-1">{errors.unit.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-500">
              Description (Optional)
            </label>
            <textarea
              {...register("description")}
              className="w-full text-sm border border-slate-200 rounded-md p-2"
            />
          </div>
        </div>

        {/* Pricing section */}
        <div className="bg-white flex-1 p-4 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-md mb-3">
            Set Pricing for Clothes
          </h3>
          {clothesTypes && clothesTypes.length > 0 ? (
            <div className="border border-slate-200 rounded-lg py-2 max-h-120 overflow-y-auto">
              {clothesTypes.map((type) => (
                <div
                  key={type._id}
                  className="flex items-center gap-2 border-b border-slate-200 py-2"
                >
                  <img
                    src={type.imageUrl || "/placeholder-image.jpg"}
                    alt={type.name}
                    className="w-10 h-10 ml-4 object-cover rounded-full shadow-sm"
                  />
                  <span className="font-medium text-gray-800">{type.name}</span>
                  <input
                    type="checkbox"
                    checked={selectedClothes[type._id] || false}
                    onChange={() => handleClothesSelection(type._id)}
                    className="ml-auto h-4 w-4"
                  />
                  {selectedClothes[type._id] && (
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Custom Price"
                      {...register(`prices.${type._id}`)}
                      className="border border-slate-200 text-sm p-2 rounded-lg w-24"
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No clothes types available.</p>
          )}
        </div>

        {/* Optional Services section */}
        <div className="bg-white flex-1 p-4 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-md mb-3">Optional Services</h3>
          <div className="flex items-center gap-2 border-b border-slate-200 py-2">
            <span className="font-medium text-gray-800">Ironing</span>
            <input
              type="checkbox"
              checked={selectedOptionalServices.ironing.selected}
              onChange={() => handleOptionalServiceSelection("ironing")}
              className="ml-auto h-4 w-4"
            />
            {selectedOptionalServices.ironing.selected && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={selectedOptionalServices.ironing.percentage}
                  onChange={(e) =>
                    handlePercentageChange("ironing", e.target.value)
                  }
                  className="border border-slate-200 text-sm p-2 rounded-lg w-24"
                  placeholder="Increase %"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:shadow-md"
      >
        {isLoading ? <Loader /> : action}
      </button>
    </form>
  );
};

export default ServiceManagementForm;
