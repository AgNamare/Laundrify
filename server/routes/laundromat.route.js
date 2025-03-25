import { Router } from "express";
import { addServiceHandler, getLaundromatHandler } from "../controllers/laundramat.controller.js";


const router = Router();

router.post("/:laundromatId/services", addServiceHandler);
router.get("/:laundromatId/", getLaundromatHandler);

export default router;
