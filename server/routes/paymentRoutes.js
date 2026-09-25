const express = require("express");

const {
  createPayment,
  getMyPayments,
  getPaymentById,
} = require("../controllers/paymentController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Create payment
router.post(
  "/",
  protect,
  authorizeRoles("customer"),
  createPayment
);

// Get customer's payments
router.get(
  "/my",
  protect,
  authorizeRoles("customer"),
  getMyPayments
);

// Get single payment
router.get(
  "/:id",
  protect,
  authorizeRoles("customer", "provider"),
  getPaymentById
);

module.exports = router;