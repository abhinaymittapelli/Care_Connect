const Review = require("../models/Review");
const Booking = require("../models/Booking");
const Provider = require("../models/Provider");

// Customer creates a review
const createReview = async (req, res) => {
  try {
    const {
      bookingId,
      rating,
      comment,
    } = req.body;

    if (!bookingId || rating === undefined) {
      return res.status(400).json({
        message: "Booking ID and rating are required",
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    // Find booking
    const booking = await Booking.findById(
      bookingId
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Only booking customer can review
    if (
      booking.customer.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message:
          "You can only review your own booking",
      });
    }

    // Only completed bookings can be reviewed
    if (booking.status !== "completed") {
      return res.status(400).json({
        message:
          "Only completed bookings can be reviewed",
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      booking: bookingId,
    });

    if (existingReview) {
      return res.status(400).json({
        message:
          "You have already reviewed this booking",
      });
    }

    // Create review
    const review = await Review.create({
      booking: bookingId,
      customer: booking.customer,
      provider: booking.provider,
      rating,
      comment: comment || "",
    });

    // Recalculate provider rating
    const providerReviews = await Review.find({
      provider: booking.provider,
    });

    const totalReviews = providerReviews.length;

    const totalRating = providerReviews.reduce(
      (sum, item) => sum + item.rating,
      0
    );

    const averageRating =
      totalReviews > 0
        ? Number(
            (totalRating / totalReviews).toFixed(1)
          )
        : 0;

    // Update provider
    await Provider.findByIdAndUpdate(
      booking.provider,
      {
        rating: averageRating,
        totalReviews: totalReviews,
      }
    );

    const populatedReview =
      await Review.findById(review._id)
        .populate(
          "customer",
          "name email phone"
        )
        .populate(
          "provider",
          "businessName rating totalReviews"
        )
        .populate(
          "booking",
          "scheduledDate startTime endTime amount status"
        );

    res.status(201).json({
      message: "Review submitted successfully",
      review: populatedReview,
    });
  } catch (error) {
    console.error(
      "Create Review Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Customer views reviews they submitted
const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      customer: req.user.id,
    })
      .populate(
        "provider",
        "businessName rating totalReviews"
      )
      .populate(
        "booking",
        "scheduledDate startTime endTime amount status"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error(
      "Get My Reviews Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Customer views reviews for a provider
const getProviderReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      provider: req.params.providerId,
    })
      .populate(
        "customer",
        "name"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error(
      "Get Provider Reviews Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  createReview,
  getMyReviews,
  getProviderReviews,
};