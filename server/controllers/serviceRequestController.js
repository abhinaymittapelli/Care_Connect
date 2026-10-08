const ServiceRequest = require("../models/ServiceRequest");
const ServiceCategory = require("../models/ServiceCategory");

// Create Service Request
const createServiceRequest = async (req, res) => {
  try {
    const {
      category,
      title,
      description,
      address,
      city,
      preferredDate,
      preferredTime,
      estimatedBudget,
    } = req.body;

    if (
      !category ||
      !title ||
      !description ||
      !address ||
      !city ||
      !preferredDate ||
      !preferredTime
    ) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    // Check category exists
    const existingCategory = await ServiceCategory.findById(category);

    if (!existingCategory) {
      return res.status(404).json({
        message: "Service category not found",
      });
    }

    // Check category is active
    if (!existingCategory.isActive) {
      return res.status(400).json({
        message: "This service category is currently inactive",
      });
    }

    const serviceRequest = await ServiceRequest.create({
      customer: req.user.id,
      category,
      title,
      description,
      address,
      city,
      preferredDate,
      preferredTime,
      estimatedBudget: estimatedBudget || 0,
    });

    const populatedRequest = await ServiceRequest.findById(
      serviceRequest._id
    )
      .populate("customer", "name email phone")
      .populate("category", "name description");

    res.status(201).json({
      message: "Service request created successfully",
      serviceRequest: populatedRequest,
    });
  } catch (error) {
    console.error(
      "Create Service Request Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Get Customer's Service Requests
const getMyServiceRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({
      customer: req.user.id,
    })
      .populate("category", "name description")
      .populate(
        "assignedProvider",
        "businessName city state rating isVerified"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: requests.length,
      serviceRequests: requests,
    });
  } catch (error) {
    console.error(
      "Get My Service Requests Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Get Single Service Request
const getServiceRequestById = async (req, res) => {
  try {
    const serviceRequest = await ServiceRequest.findById(
      req.params.id
    )
      .populate("customer", "name email phone")
      .populate("category", "name description")
      .populate(
        "assignedProvider",
        "businessName city state rating isVerified"
      );

    if (!serviceRequest) {
      return res.status(404).json({
        message: "Service request not found",
      });
    }

    // Customer can only view their own request
    if (
      serviceRequest.customer._id.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        message: "You can only access your own service requests",
      });
    }

    res.status(200).json({
      serviceRequest,
    });
  } catch (error) {
    console.error(
      "Get Service Request Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Cancel Service Request
const cancelServiceRequest = async (req, res) => {
  try {
    const serviceRequest = await ServiceRequest.findById(
      req.params.id
    );

    if (!serviceRequest) {
      return res.status(404).json({
        message: "Service request not found",
      });
    }

    if (
      serviceRequest.customer.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        message: "You can only cancel your own request",
      });
    }

    if (
      ["completed", "cancelled"].includes(
        serviceRequest.status
      )
    ) {
      return res.status(400).json({
        message: "This request cannot be cancelled",
      });
    }

    serviceRequest.status = "cancelled";

    await serviceRequest.save();

    res.status(200).json({
      message: "Service request cancelled successfully",
      serviceRequest,
    });
  } catch (error) {
    console.error(
      "Cancel Service Request Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getProviderRequests = async (req, res) => {
  try {
    const Provider = (await import("../models/Provider.js")).default;

    const provider = await Provider.findOne({
      user: req.user.id,
      isVerified: true,
      isAvailable: true,
    }).populate("skills");

    if (!provider) {
      return res.status(404).json({
        message: "Provider profile not found or not verified.",
      });
    }

    const skillIds = provider.skills.map(
      (skill) => skill._id
    );

    const requests = await ServiceRequest.find({
      status: {
        $in: ["pending", "matched"],
      },
      category: {
        $in: skillIds,
      },
      city: {
        $regex: new RegExp(`^${provider.city}$`, "i"),
      },
    })
      .populate("category", "name description")
      .populate(
        "customer",
        "name email phone"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      requests,
    });
  } catch (error) {
    console.error(
      "Get provider requests error:",
      error
    );

    res.status(500).json({
      message: "Unable to load provider requests.",
    });
  }
};


module.exports = {
  createServiceRequest,
  getMyServiceRequests,
  getServiceRequestById,
  cancelServiceRequest,
  getProviderRequests,
};