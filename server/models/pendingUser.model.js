import mongoose from "mongoose";

const pendingUserSchema = new mongoose.Schema(
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
      unique: true, // Ensure email is unique in this collection as well
    },
    password: {
      type: String,
      required: true,
    },
    verificationCode: {
      type: Number,
      required: true, // Code is necessary for verification
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: "10m",
    },
  },
  { timestamps: true }
);

const PendingUser = mongoose.model("PendingUser", pendingUserSchema);

export default PendingUser;
