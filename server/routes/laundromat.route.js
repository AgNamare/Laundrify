import { Router } from "express";
import { addServiceHandler, getLaundromatHandler, getServiceByCategoryHandler, updateServiceByCategoryHandler } from "../controllers/laundramat.controller.js";


const router = Router();

router.post("/:laundromatId/services", addServiceHandler);
router.get("/:laundromatId/services/:category", getServiceByCategoryHandler);
router.put("/:laundromatId/services/:category", updateServiceByCategoryHandler);
router.get("/:laundromatId/", getLaundromatHandler);

export default router;
