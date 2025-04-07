import mongoose from "mongoose";

// Optional Service Schema for add-ons
const optionalServiceSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  priceIncreasePercentage: {  // Percentage increase in total price for this optional service
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
});

// Service Schema (For both primary and optional services)
const serviceSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  prices: [ // Array of pricing for different clothes types
    {
      clothesType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ClothesType",
        required: true,
      },
      customPrice: {
        type: Number,
        required: true,
      },
    },
  ],
  optionalServices: [ optionalServiceSchema ],
  unit: {
    type: String,  // How the price is measured (e.g., per item, per kilogram)
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
});

// Laundromat Schema
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
    services: [serviceSchema],  // Main services like washing, folding, etc.
  },
  { timestamps: true }
);

laundromatSchema.index({ location: "2dsphere" });

const Laundromat = mongoose.model("Laundromat", laundromatSchema);

export default Laundromat;
