const express = require("express");

const {
  createServiceRequest,
  getMyServiceRequests,
  getServiceRequestById,
  cancelServiceRequest,
} = require("../controllers/serviceRequestController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Customer creates a service request
router.post(
  "/",
  protect,
  authorizeRoles("customer"),
  createServiceRequest
);

// Customer gets their own requests
router.get(
  "/",
  protect,
  authorizeRoles("customer"),
  getMyServiceRequests
);

// Customer gets one request
router.get(
  "/:id",
  protect,
  authorizeRoles("customer"),
  getServiceRequestById
);

// Customer cancels their request
router.put(
  "/:id/cancel",
  protect,
  authorizeRoles("customer"),
  cancelServiceRequest
);

module.exports = router;