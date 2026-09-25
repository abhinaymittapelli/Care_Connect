const express = require("express");

const {
  findMatchingProviders,
} = require("../controllers/matchingController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Find matching providers for a service request
router.get(
  "/:requestId",
  protect,
  authorizeRoles("customer"),
  findMatchingProviders
);

module.exports = router;