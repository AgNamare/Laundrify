import express from "express";
import {
  createOrderHandler,
  getOrdersHandler,
  getOrderHandler,
  updateOrderHandler,
  deleteOrderHandler,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", createOrderHandler);
router.get("/:userId", getOrdersHandler);
router.get("/:orderId", getOrderHandler);
router.patch("/:orderId", updateOrderHandler);
router.delete("/:orderId", deleteOrderHandler);

export default router;
