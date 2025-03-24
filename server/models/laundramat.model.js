import mongoose from "mongoose";

const laundromatSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, 
    },
    address: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    operatingHours: {
      type: Map,
      of: String, 
      required: false,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"], 
        required: true,
      },
      coordinates: {
        type: [Number], 
        required: true,
      },
    },
    description: {
      type: String,
      required: false,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
  },
  { timestamps: true }
);

// Create a 2dsphere index for the location to allow geo queries (distance, etc.)
laundromatSchema.index({ location: "2dsphere" });

const Laundromat = mongoose.model("Laundromat", laundromatSchema);

export default Laundromat;
