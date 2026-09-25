const express = require("express");

const {
  createBooking,
  getMyBookings,
  getProviderBookings,
  getBookingById,
  cancelBooking,
  updateBookingStatus,
} = require("../controllers/bookingController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Customer creates booking from accepted quotation
router.post(
  "/",
  protect,
  authorizeRoles("customer"),
  createBooking
);

// Customer views own bookings
router.get(
  "/my",
  protect,
  authorizeRoles("customer"),
  getMyBookings
);

// Provider views assigned bookings
router.get(
  "/provider",
  protect,
  authorizeRoles("provider"),
  getProviderBookings
);



// Provider updates booking status
router.put(
  "/:id/status",
  protect,
  authorizeRoles("provider"),
  updateBookingStatus
);


// Customer or provider views a single booking
router.get(
  "/:id",
  protect,
  authorizeRoles("customer", "provider"),
  getBookingById
);

// Customer cancels booking
router.put(
  "/:id/cancel",
  protect,
  authorizeRoles("customer"),
  cancelBooking
);

module.exports = router;