
const express = require("express");

const {
  createServiceRequest,
  getMyServiceRequests,
  getServiceRequestById,
  cancelServiceRequest,
  getProviderRequests,
} = require("../controllers/serviceRequestController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Provider route must be before /:id
router.get(
  "/provider/available",
  protect,
  authorizeRoles("provider"),
  getProviderRequests
);

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
