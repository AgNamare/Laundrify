import { Router } from "express";
import { createLaundramatHandler, createUserHandler, loginHandler, verifyCodeHandler } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", createUserHandler);
router.post("/register-landromat", createLaundramatHandler);
router.post("/verify-code", verifyCodeHandler);
router.post("/login", loginHandler);

export default router;
