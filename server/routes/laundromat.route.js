import { Router } from "express";
import {
  addServiceHandler,
  getAllServicesHandler,
  getLaundromatHandler,
  getServiceByCategoryHandler,
  updateServiceByCategoryHandler,
} from "../controllers/laundramat.controller.js";

const router = Router();

router.get("/:laundromatId/", getLaundromatHandler);
router.get("/:laundromatId/services", getAllServicesHandler);
router.post("/:laundromatId/services", addServiceHandler);
router.get("/:laundromatId/services/:category", getServiceByCategoryHandler);
router.put("/:laundromatId/services/:category", updateServiceByCategoryHandler);

export default router;
