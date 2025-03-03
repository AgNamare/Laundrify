import { createUserService } from "../services/auth.service.js";
import { loginUser } from "../services/auth.service.js";
import asyncHandler from "express-async-handler";
import { verifyUserService } from "../services/auth.service.js";

export const createUserHandler = async (req, res, next) => {
  console.log(req.body);
  try {
    const newUser = await createUserService(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const verifyCodeHandler = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    res.status(400);
    throw new Error("Email and verification code are required");
  }

  const result = await verifyUserService(email, code);
  res.json(result);
});

export const loginHandler = asyncHandler(async (req, res, next) => {
  console.log(req.body);

  try {
    const data = await loginUser(req.body.email, req.body.password);
    res.json(data); // Sends { success: true, user: { ...userData, token } }
  } catch (error) {
    res.status(401).json({ success: false, message: error.message }); // Sends { success: false, message: "Invalid email or password" }
  }
});
