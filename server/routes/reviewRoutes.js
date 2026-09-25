const express = require("express");

const {
  createReview,
  getMyReviews,
  getProviderReviews,
} = require("../controllers/reviewController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Customer creates a review
router.post(
  "/",
  protect,
  authorizeRoles("customer"),
  createReview
);

// Customer views reviews they submitted
router.get(
  "/my",
  protect,
  authorizeRoles("customer"),
  getMyReviews
);

// Anyone authenticated can view provider reviews
router.get(
  "/provider/:providerId",
  protect,
  getProviderReviews
);

module.exports = router;