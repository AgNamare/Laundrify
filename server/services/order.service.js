import Order from "../models/order.model.js";

export const createOrderService = async (orderData) => {
  return await Order.create(orderData);
};

export const getOrdersService = async () => {
  return await Order.find().populate("user laundromat services.clothesType");
};

export const getOrderService = async (orderId) => {
  return await Order.findById(orderId).populate("user laundromat services.clothesType");
};

export const updateOrderService = async (orderId, updateData) => {
  return await Order.findByIdAndUpdate(orderId, updateData, { new: true });
};

export const deleteOrderService = async (orderId) => {
  return await Order.findByIdAndDelete(orderId);
};
