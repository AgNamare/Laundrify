import User from "../models/user.model.js";
import {
  generateVerificationCode,
  sendVerificationCode,
} from "../utils/verification.utils.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Laundromat from "../models/laundromat.model.js";

export const createUserService = async (userData) => {
  const session = await mongoose.startSession();

  try {
    let newUser;

    // Start the transaction
    await session.withTransaction(async () => {
      const existingUser = await User.findOne({ email: userData.email }).session(session);
      if (existingUser) {
        throw new Error("User already exists");
      }

      // Generate a verification code
      const verificationCode = generateVerificationCode();

      // Create a new user
      newUser = new User({
        ...userData,
        password: bcrypt.hashSync(userData.password, 10),
        verificationCode, // Store the verification code
        isVerified: false,
      });

      // Save the user within the transaction
      await newUser.save({ session });

      // Send the verification code to user's email (outside the transaction)
      await sendVerificationCode(newUser.email, verificationCode);
    });

    console.log("✅ Created and verification email sent:", newUser);

    return newUser;
  } catch (error) {
    console.error("❌ Transaction failed:", error.message);
    throw error;
  } finally {
    session.endSession();
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
      role: user.role,
      laundromat: user.laundromat,
    },
    token,
  };
};

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const createLaundromatService = async (laundromatData) => {
  // Start a session for the transaction
  const session = await mongoose.startSession();
  let isAborted = false; // Track if transaction was aborted

  try {
    console.log("Starting transaction...");
    session.startTransaction(); // Explicitly start the transaction here

    console.log("Checking if laundromat already exists");
    const existingLaundromat = await Laundromat.findOne({
      name: laundromatData.name,
    }).session(session); // Pass session to operations

    if (existingLaundromat) {
      console.log("Laundromat already exists. Choose a different name.");
      const err = new Error(
        "Laundromat already exists. Choose a different name."
      );
      err.statusCode = 409;
      throw err;
    }

    console.log("Creating new laundromat");
    const newLaundromat = new Laundromat({
      ...laundromatData,
    });

    await newLaundromat.save({ session }); // Save with session

    console.log("Updating user with laundromat ID");
    const adminUser = await User.findById(laundromatData.admin).session(
      session
    ); // Find the admin user with session

    if (!adminUser) {
      // If the admin user is not found, abort the transaction
      const err = new Error("Admin user not found");
      err.statusCode = 404;
      throw err;
    }

    adminUser.laundromat = newLaundromat._id; // Assign laundromat ID to the user
    await adminUser.save({ session }); // Save the updated user

    console.log("Committing transaction...");
    await session.commitTransaction(); // Commit transaction if everything is successful

    console.log("Transaction committed.");
    return {newLaundromat, adminUser}; // Return the created laundromat and updated user
  } catch (error) {
    console.log("Error creating laundromat:", error.message);
    if (!isAborted) {
      // Abort transaction only once
      console.log("Aborting transaction...");
      await session.abortTransaction();
      isAborted = true;
    }
    throw error; // Rethrow the error for handling elsewhere
  } finally {
    console.log("Ending session...");
    session.endSession(); // End the session whether successful or failed
  }
};


