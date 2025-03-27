import Laundromat from "../models/laundromat.model.js";

export const getLaundromats = async () => {
  return await Laundromat.find().limit(5);
};

export const searchLaundromats = async (query) => {
  return await Laundromat.find({ name: { $regex: query, $options: "i" } });
};