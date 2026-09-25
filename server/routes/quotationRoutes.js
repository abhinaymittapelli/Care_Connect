const express = require("express");

const {
  createQuotation,
  getMyQuotations,
  getQuotationsForRequest,
  acceptQuotation,
  rejectQuotation,
} = require("../controllers/quotationController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Provider submits quotation
router.post(
  "/",
  protect,
  authorizeRoles("provider"),
  createQuotation
);

// Provider views own quotations
router.get(
  "/my",
  protect,
  authorizeRoles("provider"),
  getMyQuotations
);

// Customer views quotations for a request
router.get(
  "/request/:requestId",
  protect,
  authorizeRoles("customer"),
  getQuotationsForRequest
);

// Customer accepts quotation
router.put(
  "/:id/accept",
  protect,
  authorizeRoles("customer"),
  acceptQuotation
);

// Customer rejects quotation
router.put(
  "/:id/reject",
  protect,
  authorizeRoles("customer"),
  rejectQuotation
);

module.exports = router;