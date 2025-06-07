import express from "express";
import { getUsersHandler } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", getUsersHandler);

export default router;
