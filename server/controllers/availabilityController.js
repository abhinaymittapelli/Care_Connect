const Availability = require("../models/Availability");
const Provider = require("../models/Provider");

// Add Availability
const addAvailability = async (req, res) => {
  try {
    const {
      dayOfWeek,
      startTime,
      endTime,
      isAvailable,
    } = req.body;

    if (!dayOfWeek || !startTime || !endTime) {
      return res.status(400).json({
        message: "Day, start time and end time are required",
      });
    }

    // Find provider using logged-in user's ID
    const provider = await Provider.findOne({
      user: req.user.id,
    });

    if (!provider) {
      return res.status(404).json({
        message: "Provider profile not found",
      });
    }

    // Check if start time is before end time
    if (startTime >= endTime) {
      return res.status(400).json({
        message: "Start time must be before end time",
      });
    }

    // Check duplicate day
    const existingAvailability = await Availability.findOne({
      provider: provider._id,
      dayOfWeek,
    });

    if (existingAvailability) {
      return res.status(400).json({
        message: "Availability for this day already exists",
      });
    }

    const availability = await Availability.create({
      provider: provider._id,
      dayOfWeek,
      startTime,
      endTime,
      isAvailable:
        isAvailable !== undefined ? isAvailable : true,
    });

    res.status(201).json({
      message: "Availability added successfully",
      availability,
    });
  } catch (error) {
    console.error("Add Availability Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Get My Availability
const getMyAvailability = async (req, res) => {
  try {
    const provider = await Provider.findOne({
      user: req.user.id,
    });

    if (!provider) {
      return res.status(404).json({
        message: "Provider profile not found",
      });
    }

    const availability = await Availability.find({
      provider: provider._id,
    }).sort({ dayOfWeek: 1 });

    res.status(200).json({
      count: availability.length,
      availability,
    });
  } catch (error) {
    console.error("Get Availability Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Update Availability
const updateAvailability = async (req, res) => {
  try {
    const availability = await Availability.findById(
      req.params.id
    );

    if (!availability) {
      return res.status(404).json({
        message: "Availability not found",
      });
    }

    const provider = await Provider.findOne({
      user: req.user.id,
    });

    if (!provider) {
      return res.status(404).json({
        message: "Provider profile not found",
      });
    }

    // Make sure this availability belongs to logged-in provider
    if (
      availability.provider.toString() !==
      provider._id.toString()
    ) {
      return res.status(403).json({
        message: "You can only update your own availability",
      });
    }

    const {
      dayOfWeek,
      startTime,
      endTime,
      isAvailable,
    } = req.body;

    if (startTime && endTime && startTime >= endTime) {
      return res.status(400).json({
        message: "Start time must be before end time",
      });
    }

    if (dayOfWeek !== undefined) {
      availability.dayOfWeek = dayOfWeek;
    }

    if (startTime !== undefined) {
      availability.startTime = startTime;
    }

    if (endTime !== undefined) {
      availability.endTime = endTime;
    }

    if (isAvailable !== undefined) {
      availability.isAvailable = isAvailable;
    }

    await availability.save();

    res.status(200).json({
      message: "Availability updated successfully",
      availability,
    });
  } catch (error) {
    console.error("Update Availability Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Delete Availability
const deleteAvailability = async (req, res) => {
  try {
    const availability = await Availability.findById(
      req.params.id
    );

    if (!availability) {
      return res.status(404).json({
        message: "Availability not found",
      });
    }

    const provider = await Provider.findOne({
      user: req.user.id,
    });

    if (!provider) {
      return res.status(404).json({
        message: "Provider profile not found",
      });
    }

    if (
      availability.provider.toString() !==
      provider._id.toString()
    ) {
      return res.status(403).json({
        message: "You can only delete your own availability",
      });
    }

    await availability.deleteOne();

    res.status(200).json({
      message: "Availability deleted successfully",
    });
  } catch (error) {
    console.error("Delete Availability Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  addAvailability,
  getMyAvailability,
  updateAvailability,
  deleteAvailability,
};