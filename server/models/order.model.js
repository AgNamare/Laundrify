import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    laundromat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Laundromat",
      required: true,
    },
    serviceType: {
      type: String,
      required: true,
    },
    services: [
      {
        clothesType: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ClothesType",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        unit: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        "Pending",
        "Washing",
        "Drying",
        "Folding",
        "Delivering",
        "Cancelled",
      ],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Refunded"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: ["M-Pesa", "Credit Card"],
    },
    delivery: {
      pickupLocation: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: { type: [Number] },
      },
      deliveryLocation: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: { type: [Number] },
        address: { type: String }, 
      },
      deliveryStatus: {
        type: String,
        enum: ["Pending", "On the Way", "Delivered", "Cancelled"],
        default: "Pending",
      },
    },
    estimatedDeliveryTime: {
      type: Date,
      required: false,
    },
    placedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

orderSchema.index({ "delivery.deliveryLocation": "2dsphere" });

const Order = mongoose.model("Order", orderSchema);
export default Order;
