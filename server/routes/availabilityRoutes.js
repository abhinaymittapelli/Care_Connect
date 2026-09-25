const express = require("express");

const {
  addAvailability,
  getMyAvailability,
  updateAvailability,
  deleteAvailability,
} = require("../controllers/availabilityController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Get provider's own availability
router.get(
  "/",
  protect,
  authorizeRoles("provider"),
  getMyAvailability
);

// Add availability
router.post(
  "/",
  protect,
  authorizeRoles("provider"),
  addAvailability
);

// Update availability
router.put(
  "/:id",
  protect,
  authorizeRoles("provider"),
  updateAvailability
);

// Delete availability
router.delete(
  "/:id",
  protect,
  authorizeRoles("provider"),
  deleteAvailability
);

module.exports = router;