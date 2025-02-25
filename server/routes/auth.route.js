import { Router } from "express";
import { createUserHandler } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", createUserHandler);

export default router;
