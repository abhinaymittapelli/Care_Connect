const Booking = require("../models/Booking");
const Quotation = require("../models/Quotation");
const ServiceRequest = require("../models/ServiceRequest");
const Provider = require("../models/Provider");
const createNotification = require("../utils/notificationService");
const User = require("../models/User");

// Create booking from accepted quotation
const createBooking = async (req, res) => {
  try {
    const {
      quotationId,
      scheduledDate,
      startTime,
      endTime,
      notes,
    } = req.body;

    if (
      !quotationId ||
      !scheduledDate ||
      !startTime ||
      !endTime
    ) {
      return res.status(400).json({
        message:
          "Quotation, date, start time and end time are required",
      });
    }

    // Find quotation
    const quotation = await Quotation.findById(
      quotationId
    ).populate("serviceRequest");

    if (!quotation) {
      return res.status(404).json({
        message: "Quotation not found",
      });
    }

    // Only accepted quotation can become a booking
    if (quotation.status !== "accepted") {
      return res.status(400).json({
        message:
          "Only accepted quotations can be booked",
      });
    }

    const serviceRequest = quotation.serviceRequest;

    // Only the customer who created the request
    // can create the booking
    if (
      serviceRequest.customer.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message:
          "You can only create a booking for your own request",
      });
    }

    // Make sure request is accepted
    if (serviceRequest.status !== "accepted") {
      return res.status(400).json({
        message:
          "Service request is not ready for booking",
      });
    }

    // Check if booking already exists
    const existingBooking = await Booking.findOne({
      serviceRequest: serviceRequest._id,
    });

    if (existingBooking) {
      return res.status(400).json({
        message:
          "A booking already exists for this service request",
      });
    }

    // Validate time
    if (startTime >= endTime) {
      return res.status(400).json({
        message:
          "End time must be later than start time",
      });
    }

    // Find provider
    const provider = await Provider.findById(
      quotation.provider
    );

    if (!provider) {
      return res.status(404).json({
        message: "Provider not found",
      });
    }

    // Check provider availability
    if (!provider.isAvailable) {
      return res.status(400).json({
        message: "Provider is currently unavailable",
      });
    }

    // Check provider booking conflicts
    const conflictingBooking = await Booking.findOne({
      provider: provider._id,
      scheduledDate: new Date(scheduledDate),
      status: {
        $nin: ["cancelled", "completed"],
      },
      startTime: {
        $lt: endTime,
      },
      endTime: {
        $gt: startTime,
      },
    });

    if (conflictingBooking) {
      return res.status(409).json({
        message:
          "Provider already has a booking during this time",
      });
    }

    // Create booking
    const booking = await Booking.create({
      serviceRequest: serviceRequest._id,
      quotation: quotation._id,
      customer: serviceRequest.customer,
      provider: quotation.provider,
      scheduledDate,
      startTime,
      endTime,
      amount: quotation.amount,
      address: serviceRequest.address,
      city: serviceRequest.city,
      notes: notes || "",
    });

    // Update service request
    serviceRequest.status = "scheduled";

    await serviceRequest.save();

    const populatedBooking =
      await Booking.findById(booking._id)
        .populate(
          "customer",
          "name email phone"
        )
        .populate(
          "provider",
          "businessName phone city state"
        )
        .populate(
          "quotation",
          "amount message estimatedDuration status"
        )
        .populate(
          "serviceRequest",
          "title description address city preferredDate preferredTime status"
        );

    res.status(201).json({
      message: "Booking created successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    console.error(
      "Create Booking Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Customer views own bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      customer: req.user.id,
    })
      .populate(
        "provider",
        "businessName phone city state rating"
      )
      .populate(
        "serviceRequest",
        "title description address city status"
      )
      .populate(
        "quotation",
        "amount estimatedDuration"
      )
      .sort({ scheduledDate: 1, startTime: 1 });

    res.status(200).json({
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error(
      "Get Customer Bookings Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Provider views own bookings
const getProviderBookings = async (req, res) => {
  try {
    const provider = await Provider.findOne({
      user: req.user.id,
    });

    if (!provider) {
      return res.status(404).json({
        message: "Provider profile not found",
      });
    }

    const bookings = await Booking.find({
      provider: provider._id,
    })
      .populate(
        "customer",
        "name email phone"
      )
      .populate(
        "serviceRequest",
        "title description address city status"
      )
      .populate(
        "quotation",
        "amount estimatedDuration"
      )
      .sort({ scheduledDate: 1, startTime: 1 });

    res.status(200).json({
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error(
      "Get Provider Bookings Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Get single booking
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(
      req.params.id
    )
      .populate(
        "customer",
        "name email phone"
      )
      .populate(
        "provider",
        "businessName phone city state rating"
      )
      .populate(
        "quotation",
        "amount message estimatedDuration status"
      )
      .populate(
        "serviceRequest",
        "title description address city preferredDate preferredTime status"
      );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Customer can view their booking
    if (
      booking.customer._id.toString() === req.user.id
    ) {
      return res.status(200).json({
        booking,
      });
    }

    // Provider can view their booking
    if (
      booking.provider._id.toString() === req.user.id
    ) {
      return res.status(200).json({
        booking,
      });
    }

    return res.status(403).json({
      message: "Access denied",
    });
  } catch (error) {
    console.error(
      "Get Booking Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(
      req.params.id
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Only customer who owns booking can cancel
    if (
      booking.customer.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message:
          "You can only cancel your own booking",
      });
    }

    if (
      booking.status === "completed" ||
      booking.status === "cancelled"
    ) {
      return res.status(400).json({
        message:
          "This booking cannot be cancelled",
      });
    }

    booking.status = "cancelled";

    await booking.save();

    // Update service request
    await ServiceRequest.findByIdAndUpdate(
      booking.serviceRequest,
      {
        status: "cancelled",
      }
    );

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.error(
      "Cancel Booking Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Provider updates booking status
const updateBookingStatus = async (req, res) => {
  try {
   const status = req.body.status?.trim().toLowerCase();

    const allowedStatuses = [
      "confirmed",
      "in_progress",
      "completed",
    ];

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message:
          "Invalid status. Allowed values: confirmed, in_progress, completed",
      });
    }

    const booking = await Booking.findById(
      req.params.id
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
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

    // Only the assigned provider can update the booking
    if (
      booking.provider.toString() !==
      provider._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You can only update your assigned bookings",
      });
    }

    // Validate status transition
    const currentStatus = booking.status;

    if (
      currentStatus === "scheduled" &&
      status !== "confirmed"
    ) {
      return res.status(400).json({
        message:
          "Scheduled booking must first be confirmed",
      });
    }

    if (
      currentStatus === "confirmed" &&
      status !== "in_progress"
    ) {
      return res.status(400).json({
        message:
          "Confirmed booking must move to in_progress",
      });
    }

    if (
      currentStatus === "in_progress" &&
      status !== "completed"
    ) {
      return res.status(400).json({
        message:
          "In-progress booking must move to completed",
      });
    }

    booking.status = status;

    await booking.save();

    // Send notification when booking is confirmed
if (status === "confirmed") {
  const customer = await User.findById(
    booking.customer
  );

  if (customer) {
    await createNotification({
      recipientId: customer._id,
      email: customer.email,
      type: "booking",
      title: "Booking Confirmed",
      message: `Your booking has been confirmed. Your service is scheduled for ${booking.startTime} to ${booking.endTime}.`,
      relatedId: booking._id,
    });
  }
}

// Notify customer when booking is completed
if (status === "completed") {
  const customer = await User.findById(
    booking.customer
  );

  if (customer) {
    await createNotification({
      recipientId: customer._id,
      email: customer.email,
      type: "job",
      title: "Service Completed",
      message: `Your service booking has been completed successfully. Thank you for using CareConnect.`,
      relatedId: booking._id,
    });
  }
}

    // Keep service request status synchronized
    let requestStatus;

    if (status === "confirmed") {
      requestStatus = "scheduled";
    } else if (status === "in_progress") {
      requestStatus = "in_progress";
    } else if (status === "completed") {
      requestStatus = "completed";
    }

    await ServiceRequest.findByIdAndUpdate(
      booking.serviceRequest,
      {
        status: requestStatus,
      }
    );

    const updatedBooking =
      await Booking.findById(booking._id)
        .populate(
          "customer",
          "name email phone"
        )
        .populate(
          "provider",
          "businessName phone city state"
        )
        .populate(
          "serviceRequest",
          "title description address city status"
        );

    res.status(200).json({
      message: "Booking status updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error(
      "Update Booking Status Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  createBooking,
  getMyBookings,
  getProviderBookings,
  getBookingById,
  cancelBooking,
  updateBookingStatus,
};