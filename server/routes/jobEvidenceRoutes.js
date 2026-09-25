const express = require("express");

const {
  createJobEvidence,
  getJobEvidence,
} = require("../controllers/jobEvidenceController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Provider adds job evidence
router.post(
  "/",
  protect,
  authorizeRoles("provider"),
  createJobEvidence
);

// Customer views evidence for a booking
router.get(
  "/:bookingId",
  protect,
  authorizeRoles("customer"),
  getJobEvidence
);

module.exports = router;