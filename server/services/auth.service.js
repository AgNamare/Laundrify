import User from "../models/User.model.js";
import {
  generateVerificationCode,
  sendVerificationCode,
} from "../utils/verification.utils.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const createUserService = async (userData) => {
  const { password, email, ...rest } = userData;

  // Start a session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log("Checking if user already exists in User collection");
    const existingUser = await User.findOne({ email }).session(session);

    if (existingUser) {
      if (!existingUser.isVerified) {
        console.log("User already registered. Please enter verification code.");
        const err = new Error(
          "User already registered. Please enter verification code."
        );
        err.statusCode = 400;
        throw err;
      }
      console.log("User already exists. Please login.");
      const err = new Error("User already exists. Please login.");
      err.statusCode = 409;
      throw err;
    }

    console.log("Hashing password and generating verification code");
    const hashedPassword = bcrypt.hashSync(password, 10);
    const verificationCode = generateVerificationCode();

    console.log("Creating new user with isVerified: false");
    const newUser = new User({
      ...rest,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationCode, // Store code temporarily
    });

    await newUser.save({ session });

    console.log("Sending verification code to user's email");
    try {
      await sendVerificationCode(newUser.email, verificationCode);
      await session.commitTransaction();
    } catch (error) {
      console.log("Error sending verification code:", error.message);
      await session.abortTransaction();
      throw error;
    }

    session.endSession();

    const {
      password: pass,
      verificationCode: code,
      ...userWithoutSensitiveData
    } = newUser.toObject();
    return userWithoutSensitiveData;
  } catch (error) {
    console.log("Error creating user:", error.message);
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// Function to verify user with code
export const verifyUserService = async (email, code) => {
  console.log("Verifying user with code...");
  const user = await User.findOne({ email });

  console.log("User found: ", user);

  if (!user) {
    console.log("User not found");
    throw new Error("User not found");
  }

  if (user.isVerified) {
    console.log("User is already verified");
    throw new Error("User is already verified");
  }

  console.log("DB: ", user.verificationCode);
  console.log("Req: ", code);

  // Ensure correct type comparison
  if (user.verificationCode !== Number(code)) {
    console.log("Invalid verification code");
    throw new Error("Invalid verification code");
  }

  // Mark as verified and remove verification code
  user.isVerified = true;
  user.verificationCode = undefined;
  user.verificationExpiresAt = undefined;
  await user.save();

  console.log("User verified successfully");
  return { success: true, message: "User verified successfully" };
};

// Login Service
export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid email or password");
  }

  if (!user.isVerified) {
    throw new Error(
      "User is not verified. Please enter the verification code."
    );
  }

  const token = generateToken(user._id);

  return {
    success: true,
    user: {
      _id: user._id,
      fName: user.fName,
      lName: user.lName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      token,
    },
  };
};

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};
