import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    laundromat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Laundromat",
      required: true,
    },
    services: [
      {
        category: { type: String, required: true },
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
      enum: ["Pending", "Processing", "Ready for Pickup", "Out for Delivery", "Completed", "Cancelled"],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Refunded"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: ["M-Pesa", "Credit Card", "Cash"],
      required: true,
    },
    delivery: {
      pickupLocation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Laundromat",
        required: true,
      },
      deliveryLocation: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: { type: [Number], required: true },
      },
      deliveryStatus: {
        type: String,
        enum: ["Pending", "On the Way", "Delivered", "Cancelled"],
        default: "Pending",
      },
    },
    placedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

orderSchema.index({ "delivery.deliveryLocation": "2dsphere" });

const Order = mongoose.model("Order", orderSchema);
export default Order;
