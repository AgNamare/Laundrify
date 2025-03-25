import Laundromat from "../models/laundromat.model.js";
import ClothesType from "../models/clothesType.model.js"

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