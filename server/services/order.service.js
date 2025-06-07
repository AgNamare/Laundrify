import Order from "../models/order.model.js";

export const createOrderService = async (orderData) => {
  return await Order.create(orderData);
};

export const getOrdersService = async (filters = {}) => {
  return await Order.find(filters)
    .populate("user laundromat services.clothesType");
}


export const getUserOrdersService = async (userId) => {
  return await Order.find({ user: userId })
    .populate("user laundromat services.clothesType")
    .sort({ createdAt: -1 }); // Sort by most recent
};



export const getOrderService = async (orderId) => {
  const order = await Order.findById(orderId).populate("user laundromat services.clothesType driver");
  if (!order) {
    throw new Error("Order not found");
  }
  return order;
};


export const updateOrderService = async (orderId, updateData) => {
  return await Order.findByIdAndUpdate(orderId, updateData, { new: true });
};

export const deleteOrderService = async (orderId) => {
  return await Order.findByIdAndDelete(orderId);
};
