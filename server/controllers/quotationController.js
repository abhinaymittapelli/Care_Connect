const Quotation = require("../models/Quotation");
const ServiceRequest = require("../models/ServiceRequest");
const Provider = require("../models/Provider");

// Provider submits quotation
const createQuotation = async (req, res) => {
  try {
    const {
      serviceRequest,
      amount,
      message,
      estimatedDuration,
    } = req.body;

    if (
      !serviceRequest ||
      amount === undefined ||
      !estimatedDuration
    ) {
      return res.status(400).json({
        message:
          "Service request, amount and estimated duration are required",
      });
    }

    // Find provider profile of logged-in user
    const provider = await Provider.findOne({
      user: req.user.id,
    });

    if (!provider) {
      return res.status(404).json({
        message: "Provider profile not found",
      });
    }

    // Check provider verification
    if (!provider.isVerified) {
      return res.status(403).json({
        message: "Provider is not verified",
      });
    }

    // Check service request
    const request = await ServiceRequest.findById(
      serviceRequest
    );

    if (!request) {
      return res.status(404).json({
        message: "Service request not found",
      });
    }

    // Only pending/matched requests can receive quotations
    if (
      request.status !== "pending" &&
      request.status !== "matched"
    ) {
      return res.status(400).json({
        message:
          "Quotation cannot be submitted for this request",
      });
    }

    // Provider must be available
    if (!provider.isAvailable) {
      return res.status(400).json({
        message: "Provider is currently unavailable",
      });
    }

    // Check if provider already submitted quotation
    const existingQuotation = await Quotation.findOne({
      serviceRequest,
      provider: provider._id,
    });

    if (existingQuotation) {
      return res.status(400).json({
        message:
          "You have already submitted a quotation for this request",
      });
    }

    const quotation = await Quotation.create({
      serviceRequest,
      provider: provider._id,
      amount,
      message,
      estimatedDuration,
    });

    const populatedQuotation =
      await Quotation.findById(quotation._id)
        .populate(
          "provider",
          "businessName phone city state experienceYears hourlyRate rating"
        )
        .populate(
          "serviceRequest",
          "title description address city preferredDate preferredTime status"
        );

    res.status(201).json({
      message: "Quotation submitted successfully",
      quotation: populatedQuotation,
    });
  } catch (error) {
    console.error(
      "Create Quotation Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Provider views own quotations
const getMyQuotations = async (req, res) => {
  try {
    const provider = await Provider.findOne({
      user: req.user.id,
    });

    if (!provider) {
      return res.status(404).json({
        message: "Provider profile not found",
      });
    }

    const quotations = await Quotation.find({
      provider: provider._id,
    })
      .populate(
        "serviceRequest",
        "title description address city preferredDate preferredTime status"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: quotations.length,
      quotations,
    });
  } catch (error) {
    console.error(
      "Get My Quotations Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Customer views quotations for own request
const getQuotationsForRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(
      req.params.requestId
    );

    if (!request) {
      return res.status(404).json({
        message: "Service request not found",
      });
    }

    // Only request owner can view quotations
    if (
      request.customer.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message:
          "You can only view quotations for your own request",
      });
    }

    const quotations = await Quotation.find({
      serviceRequest: request._id,
    })
      .populate(
        "provider",
        "businessName phone city state experienceYears hourlyRate rating totalReviews isVerified"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      requestId: request._id,
      count: quotations.length,
      quotations,
    });
  } catch (error) {
    console.error(
      "Get Request Quotations Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Customer accepts quotation
const acceptQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findById(
      req.params.id
    ).populate("serviceRequest");

    if (!quotation) {
      return res.status(404).json({
        message: "Quotation not found",
      });
    }

    const request = quotation.serviceRequest;

    // Only customer who created request can accept
    if (
      request.customer.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message:
          "You can only accept quotations for your own request",
      });
    }

    if (quotation.status !== "pending") {
      return res.status(400).json({
        message:
          "Only pending quotations can be accepted",
      });
    }

    // Accept selected quotation
    quotation.status = "accepted";
    await quotation.save();

    // Assign provider to service request
    request.assignedProvider = quotation.provider;
    request.estimatedBudget = quotation.amount;
    request.status = "accepted";

    await request.save();

    // Reject other pending quotations
    await Quotation.updateMany(
      {
        serviceRequest: request._id,
        _id: { $ne: quotation._id },
        status: "pending",
      },
      {
        $set: {
          status: "rejected",
        },
      }
    );

    const updatedQuotation =
      await Quotation.findById(quotation._id)
        .populate(
          "provider",
          "businessName phone city state experienceYears hourlyRate rating"
        )
        .populate(
          "serviceRequest",
          "title description address city preferredDate preferredTime status assignedProvider estimatedBudget"
        );

    res.status(200).json({
      message: "Quotation accepted successfully",
      quotation: updatedQuotation,
    });
  } catch (error) {
    console.error(
      "Accept Quotation Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Customer rejects quotation
const rejectQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findById(
      req.params.id
    ).populate("serviceRequest");

    if (!quotation) {
      return res.status(404).json({
        message: "Quotation not found",
      });
    }

    const request = quotation.serviceRequest;

    // Only request owner can reject
    if (
      request.customer.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message:
          "You can only reject quotations for your own request",
      });
    }

    if (quotation.status !== "pending") {
      return res.status(400).json({
        message:
          "Only pending quotations can be rejected",
      });
    }

    quotation.status = "rejected";

    await quotation.save();

    res.status(200).json({
      message: "Quotation rejected successfully",
      quotation,
    });
  } catch (error) {
    console.error(
      "Reject Quotation Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  createQuotation,
  getMyQuotations,
  getQuotationsForRequest,
  acceptQuotation,
  rejectQuotation,
};