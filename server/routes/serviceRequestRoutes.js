import express from "express";
import {
  getProviderRequests,
} from "../controllers/serviceRequestController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
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

router.get(
  "/provider/available",
  protect,
  authorizeRoles("provider"),
  getProviderRequests
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