import express from "express";
import { addReview, getLaundromatReviews } from "./controllers/review.controller.js";

const router = express.Router();

router.post("/", addReview); // Add a review
router.get("/:laundromatId", getLaundromatReviews); // Get reviews for a laundromat

export default router;
