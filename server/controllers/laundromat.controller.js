import asyncHandler from "express-async-handler";
import { getLaundromats, searchLaundromats } from "../services/laundromat.service.js";

export const fetchLaundromats = asyncHandler(async (req, res) => {
  const laundromats = await getLaundromats();
  res.status(200).json(laundromats);
});

export const findLaundromats = asyncHandler(async (req, res) => {
  const { query } = req.query;
  const laundromats = await searchLaundromats(query);
  res.status(200).json(laundromats);
});
