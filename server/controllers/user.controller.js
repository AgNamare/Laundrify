import expressAsyncHandler from "express-async-handler";
import { getUsersService } from "../services/user.service.js";

export const getUsersHandler = expressAsyncHandler(async (req, res) => {
  const orders = await getUsersService();
  res.json(orders);
});