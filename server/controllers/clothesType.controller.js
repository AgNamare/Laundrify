import asyncHandler from "express-async-handler";
import { getAllClothesTypesService } from "../services/clothesType.service.js";

export const getAllClothesTypesHandler = asyncHandler(async (req, res) => {
  const clothesTypes = await getAllClothesTypesService();
  res.status(200).json(clothesTypes);
});
