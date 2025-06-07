import { createLaundromatService, createUserService } from "../services/auth.service.js";
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

    // Set token as HTTP-only cookie
    res.cookie("access_token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only use secure in production
      sameSite: "Strict", // Helps prevent CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send user data without token
    res.json({ success: true, user: data.user });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
});

export const createLaundramatHandler = async (req, res, next) => {
  try {
    const result = await createLaundromatService(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

