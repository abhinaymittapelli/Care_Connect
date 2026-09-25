const JobEvidence = require("../models/JobEvidence");
const Booking = require("../models/Booking");
const Provider = require("../models/Provider");

// Provider adds job completion evidence
const createJobEvidence = async (req, res) => {
  try {
    const {
      bookingId,
      beforeImages,
      afterImages,
      completionNotes,
    } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        message: "Booking ID is required",
      });
    }

    // Find booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Find provider profile
    const provider = await Provider.findOne({
      user: req.user.id,
    });

    if (!provider) {
      return res.status(404).json({
        message: "Provider profile not found",
      });
    }

    // Only assigned provider can add evidence
    if (
      booking.provider.toString() !==
      provider._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You can only add evidence for your assigned booking",
      });
    }

    // Evidence should be added after job starts
    if (
      booking.status !== "in_progress" &&
      booking.status !== "completed"
    ) {
      return res.status(400).json({
        message:
          "Job evidence can only be added when the job is in progress or completed",
      });
    }

    // Check if evidence already exists
    const existingEvidence = await JobEvidence.findOne({
      booking: bookingId,
    });

    if (existingEvidence) {
      return res.status(400).json({
        message:
          "Job evidence already exists for this booking",
      });
    }

    // Validate image arrays
    if (
      beforeImages !== undefined &&
      !Array.isArray(beforeImages)
    ) {
      return res.status(400).json({
        message: "beforeImages must be an array",
      });
    }

    if (
      afterImages !== undefined &&
      !Array.isArray(afterImages)
    ) {
      return res.status(400).json({
        message: "afterImages must be an array",
      });
    }

    const evidence = await JobEvidence.create({
      booking: bookingId,
      provider: provider._id,
      beforeImages: beforeImages || [],
      afterImages: afterImages || [],
      completionNotes: completionNotes || "",
      completedAt:
        booking.status === "completed"
          ? new Date()
          : null,
    });

    const populatedEvidence =
      await JobEvidence.findById(evidence._id)
        .populate(
          "booking",
          "scheduledDate startTime endTime amount status address city"
        )
        .populate(
          "provider",
          "businessName phone city state"
        );

    res.status(201).json({
      message: "Job evidence created successfully",
      evidence: populatedEvidence,
    });
  } catch (error) {
    console.error(
      "Create Job Evidence Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Customer views evidence for a booking
const getJobEvidence = async (req, res) => {
  try {
    const evidence = await JobEvidence.findOne({
      booking: req.params.bookingId,
    })
      .populate(
        "provider",
        "businessName phone city state"
      )
      .populate(
        "booking",
        "scheduledDate startTime endTime amount status address city"
      );

    if (!evidence) {
      return res.status(404).json({
        message: "Job evidence not found",
      });
    }

    // Get booking to verify customer access
    const booking = await Booking.findById(
      req.params.bookingId
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Customer can view evidence for own booking
    if (
      booking.customer.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message:
          "You can only view evidence for your own booking",
      });
    }

    res.status(200).json({
      evidence,
    });
  } catch (error) {
    console.error(
      "Get Job Evidence Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  createJobEvidence,
  getJobEvidence,
};