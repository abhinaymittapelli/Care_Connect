const express = require("express");

const {
  createInvoice,
  getMyInvoices,
  getInvoiceById,
  markInvoicePaid,
} = require("../controllers/invoiceController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Customer creates invoice for completed booking
router.post(
  "/",
  protect,
  authorizeRoles("customer"),
  createInvoice
);

// Customer views own invoices
router.get(
  "/my",
  protect,
  authorizeRoles("customer"),
  getMyInvoices
);

// Customer or provider views a single invoice
router.get(
  "/:id",
  protect,
  authorizeRoles("customer", "provider"),
  getInvoiceById
);

// Mark invoice as paid
router.put(
  "/:id/pay",
  protect,
  authorizeRoles("customer"),
  markInvoicePaid
);

module.exports = router;