import asyncHandler from "express-async-handler";
import {
  createOrderService,
  getOrdersService,
  getOrderService,
  updateOrderService,
  deleteOrderService,
  getUserOrdersService,
} from "../services/order.service.js";

export const createOrderHandler = async (req, res, next) => {
  try {
    const orderData = {
      ...req.body,
    };

    const order = await createOrderService(orderData);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const getOrdersHandler = asyncHandler(async (req, res) => {
  const { laundromatId } = req.params;  // Capture laundromatId from URL parameters
  const { status, service, user, startDate, endDate } = req.query;

  const filters = { laundromat: laundromatId };  // Set laundromatId as a filter

  if (status) filters.status = status;
  if (user) filters.user = user;
  if (service) filters.serviceType = service;

  // Timeframe filter
  if (startDate || endDate) {
    filters.placedAt = {};
    if (startDate) filters.placedAt.$gte = new Date(startDate);
    if (endDate) filters.placedAt.$lte = new Date(endDate);
  }

  const orders = await getOrdersService(filters);
  res.json(orders);
});

export const getUserOrdersHandler = asyncHandler(async (req, res) => {
  const { userId  } = req.params;
  const order = await getUserOrdersService(userId);
  res.json(order);
});

export const getOrderHandler = asyncHandler(async (req, res) => {
  console.log(req.params.orderId)
  const order = await getOrderService(req.params.orderId);
  res.json(order);
});

export const updateOrderHandler = asyncHandler(async (req, res) => {
  const order = await updateOrderService(req.params.orderId, req.body);
  res.json(order);
});

export const deleteOrderHandler = asyncHandler(async (req, res) => {
  await deleteOrderService(req.params.orderId);
  res.status(204).send();
});
