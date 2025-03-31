import Review from "./models/review.model.js";

/**
 * Create a new review
 */
export const createReview = async (laundromat, user, rating, comment) => {
  if (!laundromat || !user || !rating || !comment) {
    throw new Error("All fields are required");
  }

  const review = new Review({ laundromat, user, rating, comment });
  return await review.save();
};

/**
 * Get all reviews for a laundromat
 */
export const getReviewsByLaundromat = async (laundromatId) => {
  return await Review.find({ laundromat: laundromatId }).populate("user", "name");
};
