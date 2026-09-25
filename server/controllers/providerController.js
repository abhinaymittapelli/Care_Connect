const Provider = require("../models/Provider");
const User = require("../models/User");

// Create Provider Profile
const createProvider = async (req, res) => {
  try {
    const {
      businessName,
      bio,
      phone,
      address,
      city,
      state,
      skills,
      experienceYears,
      hourlyRate,
    } = req.body;

    // Check required fields
    if (
      !businessName ||
      !phone ||
      !address ||
      !city ||
      !state ||
      experienceYears === undefined ||
      hourlyRate === undefined
    ) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    // Check if user exists
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check if provider profile already exists
    const existingProvider = await Provider.findOne({
      user: req.user.id,
    });

    if (existingProvider) {
      return res.status(400).json({
        message: "Provider profile already exists",
      });
    }

    const provider = await Provider.create({
      user: req.user.id,
      businessName,
      bio,
      phone,
      address,
      city,
      state,
      skills: skills || [],
      experienceYears,
      hourlyRate,
    });

    // Change user role to provider
    user.role = "provider";
    await user.save();

    res.status(201).json({
      message: "Provider profile created successfully",
      provider,
    });
  } catch (error) {
    console.error("Create Provider Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Get All Providers
const getProviders = async (req, res) => {
  try {
    const providers = await Provider.find()
      .populate("user", "name email phone")
      .populate("skills", "name description");

    res.status(200).json({
      count: providers.length,
      providers,
    });
  } catch (error) {
    console.error("Get Providers Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Get Provider By ID
const getProviderById = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("skills", "name description");

    if (!provider) {
      return res.status(404).json({
        message: "Provider not found",
      });
    }

    res.status(200).json({
      provider,
    });
  } catch (error) {
    console.error("Get Provider Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Update Provider Profile
const updateProvider = async (req, res) => {
  try {
    const provider = await Provider.findOne({
      user: req.user.id,
    });

    if (!provider) {
      return res.status(404).json({
        message: "Provider profile not found",
      });
    }

    const {
      businessName,
      bio,
      phone,
      address,
      city,
      state,
      skills,
      experienceYears,
      hourlyRate,
      isAvailable,
    } = req.body;

    if (businessName !== undefined) {
      provider.businessName = businessName;
    }

    if (bio !== undefined) {
      provider.bio = bio;
    }

    if (phone !== undefined) {
      provider.phone = phone;
    }

    if (address !== undefined) {
      provider.address = address;
    }

    if (city !== undefined) {
      provider.city = city;
    }

    if (state !== undefined) {
      provider.state = state;
    }

    if (skills !== undefined) {
      provider.skills = skills;
    }

    if (experienceYears !== undefined) {
      provider.experienceYears = experienceYears;
    }

    if (hourlyRate !== undefined) {
      provider.hourlyRate = hourlyRate;
    }

    if (isAvailable !== undefined) {
      provider.isAvailable = isAvailable;
    }

    await provider.save();

    res.status(200).json({
      message: "Provider profile updated successfully",
      provider,
    });
  } catch (error) {
    console.error("Update Provider Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Delete Provider Profile
const deleteProvider = async (req, res) => {
  try {
    const provider = await Provider.findOne({
      user: req.user.id,
    });

    if (!provider) {
      return res.status(404).json({
        message: "Provider profile not found",
      });
    }

    await provider.deleteOne();

    // Change role back to customer
    const user = await User.findById(req.user.id);

    if (user) {
      user.role = "customer";
      await user.save();
    }

    res.status(200).json({
      message: "Provider profile deleted successfully",
    });
  } catch (error) {
    console.error("Delete Provider Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Verify Provider
const verifyProvider = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);

    if (!provider) {
      return res.status(404).json({
        message: "Provider not found",
      });
    }

    provider.isVerified = true;

    await provider.save();

    res.status(200).json({
      message: "Provider verified successfully",
      provider,
    });
  } catch (error) {
    console.error("Verify Provider Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Update Provider Skills
const updateProviderSkills = async (req, res) => {
  try {
    const { skills } = req.body;

    if (!Array.isArray(skills)) {
      return res.status(400).json({
        message: "Skills must be an array of category IDs",
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

    provider.skills = skills;

    await provider.save();

    const updatedProvider = await Provider.findById(provider._id)
      .populate("skills", "name description");

    res.status(200).json({
      message: "Provider skills updated successfully",
      provider: updatedProvider,
    });
  } catch (error) {
    console.error("Update Provider Skills Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  createProvider,
  getProviders,
  getProviderById,
  updateProvider,
  deleteProvider,
  verifyProvider,
  updateProviderSkills,
};