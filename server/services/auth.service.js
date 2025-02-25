import PendingUser from "../models/pendingUser.model.js";
import User from "../models/User.model.js";
import {
  generateVerificationCode,
  sendVerificationCode,
} from "../utils/verification.utils.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs"


export const createUserService = async (userData) => {
  const { password, email, ...rest } = userData;

  // Start a session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if the user already exists in PendingUser or User collections
    console.log(
      "Checking if user already exists in PendingUser or User collections"
    );
    const existingPendingUser = await PendingUser.findOne({ email }).session(
      session
    );
    const existingUser = await User.findOne({ email }).session(session);

    if (existingPendingUser) {
      console.log("User already registered. Please Enter Verification Code");
      const err = new Error(
        "User already registered. Please Enter Verification Code"
      );
      err.statusCode = 400; // You can customize the status code here (e.g., 400 for bad request)
      throw err;
    }

    if (existingUser) {
      console.log("User already exists. Login");
      const err = new Error("User already exists. Login");
      err.statusCode = 409; // Conflict status for already existing user
      throw err;
    }

    // Hash password and generate verification code
    console.log("Hashing password and generating verification code");
    const hashedPassword = bcrypt.hashSync(password, 10);
    const verificationCode = generateVerificationCode();

    // Create and save the pending user with hashed password
    console.log("Creating and saving the pending user with hashed password");
    const newPendingUser = new PendingUser({
      ...rest,
      password: hashedPassword,
      email,
      verificationCode,
    });
    await newPendingUser.save({ session });

    // Send verification code to user's phone number (handle error after commit)
    console.log("Sending verification code to user's phone number");
    try {
      await sendVerificationCode(newPendingUser.email, verificationCode);
      await session.commitTransaction();
    } catch (error) {
      // Abort the transaction if verification code cannot be sent
      console.log("Error sending verification code:", error.message);
      await session.abortTransaction();

      // Throw error with custom message and status code
      const err = new Error("Failed to send verification code");
      err.statusCode = 500; // Internal server error if the sending fails
      throw err;
    }

    // Omit sensitive fields from returned user object
    const { password: pass, ...pendingUser } = newPendingUser.toObject();

    // End the session
    console.log("Ending the session");
    session.endSession();

    return pendingUser;
  } catch (error) {
    // Abort transaction on any error before commit
    console.log("Error creating user:", error.message);
    await session.abortTransaction();
    session.endSession(); // End the session after aborting

    // If the error is already thrown with a message and status code, propagate that error
    if (error.statusCode) {
      throw error; // Re-throw the error as it is
    }

    // If the error doesn't have a status code (e.g., unexpected error), create a new one
    const err = new Error("Internal Server Error. Please Try Again");
    err.statusCode = 500;
    throw err;
  }
};
