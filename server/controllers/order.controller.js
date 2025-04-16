import asyncHandler from "express-async-handler";
import {
  createOrderService,
  getOrdersService,
  getOrderService,
  updateOrderService,
  deleteOrderService,
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
  const orders = await getOrdersService(req.params.userId);
  res.json(orders);
});

export const getOrderHandler = asyncHandler(async (req, res) => {
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
