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
router.get("/laundromat/:laundromatId:userId", getOrdersHandler);
router.get("/:orderId", getOrderHandler);
router.put("/:orderId", updateOrderHandler);
router.delete("/:orderId", deleteOrderHandler);

export default router;
