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

// Anyone can view providers
router.get("/", getProviders);


router.put(
  "/skills",
  protect,
  authorizeRoles("provider"),
  updateProviderSkills
);

router.get("/:id", getProviderById);

// Only customers can create a provider profile
router.post(
  "/",
  protect,
  authorizeRoles("customer"),
  createProvider
);

// Only providers can update their own profile
router.put(
  "/",
  protect,
  authorizeRoles("provider"),
  updateProvider
);

// Only providers can delete their own profile
router.delete(
  "/",
  protect,
  authorizeRoles("provider"),
  deleteProvider
);

router.put(
  "/:id/verify",
  protect,
  authorizeRoles("admin"),
  verifyProvider
);


console.log("Provider routes loaded");
module.exports = router;