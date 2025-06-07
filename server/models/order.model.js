import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
<<<<<<< HEAD
=======
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
>>>>>>> 64337caac653959785995131113ab12120a2a5c7
    laundromat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Laundromat",
      required: true,
    },
<<<<<<< HEAD
    services: [
      {
        category: { type: String, required: true },
=======
    serviceType: {
      type: String,
      required: true,
    },
    services: [
      {
>>>>>>> 64337caac653959785995131113ab12120a2a5c7
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
<<<<<<< HEAD
      enum: ["Pending", "Processing", "Ready for Pickup", "Out for Delivery", "Completed", "Cancelled"],
=======
      enum: [
        "Pending",
        "Washing",
        "Drying",
        "Folding",
        "Delivering",
        "Cancelled",
      ],
>>>>>>> 64337caac653959785995131113ab12120a2a5c7
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Refunded"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
<<<<<<< HEAD
      enum: ["M-Pesa", "Credit Card", "Cash"],
      required: true,
    },
    delivery: {
      pickupLocation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Laundromat",
        required: true,
=======
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
>>>>>>> 64337caac653959785995131113ab12120a2a5c7
      },
      deliveryLocation: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
<<<<<<< HEAD
        coordinates: { type: [Number], required: true },
=======
        coordinates: { type: [Number] },
        address: { type: String }, 
>>>>>>> 64337caac653959785995131113ab12120a2a5c7
      },
      deliveryStatus: {
        type: String,
        enum: ["Pending", "On the Way", "Delivered", "Cancelled"],
        default: "Pending",
      },
    },
<<<<<<< HEAD
=======
    estimatedDeliveryTime: {
      type: Date,
      required: false,
    },
>>>>>>> 64337caac653959785995131113ab12120a2a5c7
    placedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

orderSchema.index({ "delivery.deliveryLocation": "2dsphere" });

const Order = mongoose.model("Order", orderSchema);
export default Order;
