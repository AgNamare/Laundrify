import Laundromat from "../models/laundromat.model.js";
import ClothesType from "../models/clothesType.model.js";

export const addServiceToLaundromatService = async (serviceData) => {
  const { laundromatId, category, prices, unit, description } = serviceData;

  // 1. Validation
  //    - Ensure laundromat exists
  const laundromat = await Laundromat.findById(laundromatId);
  if (!laundromat) {
    throw new Error("Laundromat not found");
  }

  //   - Validate input data
  if (!category || !unit || !prices || !Array.isArray(prices)) {
    throw new Error("Invalid service data");
  }

  //   - Validate each price entry in the prices array
  for (const priceEntry of prices) {
    if (!priceEntry.clothesType || !priceEntry.customPrice) {
      throw new Error("Invalid price data");
    }

    //  - Ensure ClothesType exists
    const clothesType = await ClothesType.findById(priceEntry.clothesType);
    if (!clothesType) {
      throw new Error("ClothesType not found");
    }
  }

  // 2. Create the new service
  const newService = {
    category,
    prices,
    unit,
    description,
  };

  // 3. Add the service to the laundromat's services array
  laundromat.services.push(newService);

  // 4. Save the laundromat
  await laundromat.save();

  // 5. Populate the clothesType details (optional, but useful)
  await laundromat.populate({
    path: "services.prices.clothesType",
    model: "ClothesType",
  });

  return laundromat;
};

export const getLaundromatService = async (laundromatId) => {
  // 1. Find the laundromat by ID
  const laundromat = await Laundromat.findById(laundromatId).populate({
    path: "services.prices.clothesType",
    model: "ClothesType",
  });

  // 2. Handle not found scenario
  if (!laundromat) {
    throw new Error("Laundromat not found"); // Or create a custom error
  }

  return laundromat;
};

export const getServiceByCategory = async (laundromatId, category) => {
  try {
    const laundromat = await Laundromat.findById(laundromatId);

    if (!laundromat) {
      throw new Error("Laundromat not found");
    }

    const service = laundromat.services.find(
      (service) => service.category === category
    );

    if (!service) {
      throw new Error("Service not found for the given category");
    }

    return service;
  } catch (error) {
    throw error;
  }
};

export const updateServiceByCategory = async (
  laundromatId,
  category,
  serviceData
) => {
  try {
    const laundromat = await Laundromat.findById(laundromatId)

    if (!laundromat) {
      throw new Error("Laundromat not found");
    }

    const serviceIndex = laundromat.services.findIndex(
      (service) => service.category === category
    );
    console.log(serviceIndex);

    if (serviceIndex === -1) {
      throw new Error("Service not found for the given category");
    }

    console.log(laundromat.services[serviceIndex].category)

    // Update the service
    laundromat.services[serviceIndex].category = serviceData.category;
    laundromat.services[serviceIndex].unit = serviceData.unit;
    laundromat.services[serviceIndex].description = serviceData.description;

    //Update the prices array
    laundromat.services[serviceIndex].prices = serviceData.prices;

    await laundromat.save();

    return laundromat.services[serviceIndex]; // Return the updated service
  } catch (error) {
    throw error;
  }
};

export const getAllServicesForLaundromatService = async (laundromatId) => {
  const laundromat = await Laundromat.findById(laundromatId).populate(
    "services.prices.clothesType"
  );

  if (!laundromat) {
    throw new Error("Laundromat not found");
  }

  return laundromat.services;
};
