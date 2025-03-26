import mongoose from "mongoose";


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
  unit: {
    type: String,  // How the price is measured
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
});

const laundromatSchema = new mongoose.Schema({
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
  services: [serviceSchema],
}, { timestamps: true });

laundromatSchema.index({ location: "2dsphere" });

const Laundromat = mongoose.model("Laundromat", laundromatSchema);

export default Laundromat;