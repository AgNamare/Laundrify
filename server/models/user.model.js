import mongoose from "mongoose";

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
      default: () => new Date(Date.now() + 10 * 60 * 1000), // Expires in 10 minutes
      index: { expires: "10m" }, // TTL index: Deletes document after 10 minutes
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
