import express from "express";
import { fetchLaundromats, findLaundromats } from "../controllers/laundromat.controller.js";

const router = express.Router();

router.get("/", fetchLaundromats);
router.get("/search", findLaundromats);

export default router;
