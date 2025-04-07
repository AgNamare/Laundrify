import { createReview, getReviewsByLaundromat } from "../services/review.service.js";

/**
 * @desc    Add a new review
 * @route   POST /api/reviews
 */
export const addReview = async (req, res) => {
  try {
    const { laundromat, user, rating, comment } = req.body;
    const review = await createReview(laundromat, user, rating, comment);
    res.status(201).json({ message: "Review added successfully", review });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Get reviews for a laundromat
 * @route   GET /api/reviews/:laundromatId
 */
export const getLaundromatReviews = async (req, res) => {
  try {
    const reviews = await getReviewsByLaundromat(req.params.laundromatId);
    if (!reviews.length) {
      return res.status(404).json({ message: "No reviews found" });
    }
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
