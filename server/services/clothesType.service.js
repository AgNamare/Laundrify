import ClothesType from "../models/clothesType.model.js";

export const getAllClothesTypesService = async () => {
  return await ClothesType.find({});
};
