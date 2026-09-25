const ServiceRequest = require("../models/ServiceRequest");
const Provider = require("../models/Provider");

// Find matching providers
const findMatchingProviders = async (req, res) => {
  try {
    const serviceRequest = await ServiceRequest.findById(
      req.params.requestId
    ).populate("category", "name");

    if (!serviceRequest) {
      return res.status(404).json({
        message: "Service request not found",
      });
    }

    // Only the customer who created the request
    // can find providers for that request
    if (
      serviceRequest.customer.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message:
          "You can only match providers for your own request",
      });
    }

    const providers = await Provider.find({
      isVerified: true,
      isAvailable: true,
      skills: serviceRequest.category._id,
      city: {
        $regex: new RegExp(
          `^${serviceRequest.city}$`,
          "i"
        ),
      },
    })
      .populate("user", "name email phone")
      .populate("skills", "name description");

    res.status(200).json({
      requestId: serviceRequest._id,
      category: serviceRequest.category.name,
      city: serviceRequest.city,
      count: providers.length,
      providers,
    });
  } catch (error) {
    console.error(
      "Provider Matching Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  findMatchingProviders,
};