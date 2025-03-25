import express from "express";
import { getAllClothesTypesHandler } from "../controllers/clothesType.controller.js";

const router = express.Router();

router.get("/", getAllClothesTypesHandler);

export default router;
