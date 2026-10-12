
const express = require("express");

const {
  createProvider,
  getProviders,
  getProviderById,
  updateProvider,
  deleteProvider,
  verifyProvider,
  updateProviderSkills,
} = require("../controllers/providerController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Anyone can view all providers
router.get("/", getProviders);

// Providers can update their service skills
router.put(
  "/skills",
  protect,
  authorizeRoles("provider"),
  updateProviderSkills
);

// Anyone can view a provider by ID
router.get("/:id", getProviderById);

// Providers can create their own profile
router.post(
  "/",
  protect,
  authorizeRoles("provider"),
  createProvider
);

// Providers can update their own profile
router.put(
  "/",
  protect,
  authorizeRoles("provider"),
  updateProvider
);

// Providers can delete their own profile
router.delete(
  "/",
  protect,
  authorizeRoles("provider"),
  deleteProvider
);

// Only admins can verify providers
router.put(
  "/:id/verify",
  protect,
  authorizeRoles("admin"),
  verifyProvider
);

console.log("Provider routes loaded");

module.exports = router;
