import mongoose from "mongoose";
import Laundromat from "./laundramat.model.js"; // Import the Laundromat model

const userSchema = new mongoose.Schema(
  {
    fName: {
      type: String,
      required: true,
    },
    lName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: Number,
    },
    verificationExpiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 10 * 60 * 1000),
      index: { expires: "10m" },
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      required: true,
      default: "user",
    },
    laundromat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Laundromat",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
