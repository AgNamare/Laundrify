// models/laundromat.model.js
import mongoose from "mongoose";

const laundromatSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true },
    },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    services: [{ type: String }],
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

laundromatSchema.index({ location: "2dsphere" });
const Laundromat = mongoose.model("Laundromat", laundromatSchema);
export default Laundromat;
