const express = require("express");

const {
  getMyNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  
} = require("../controllers/notificationController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get all my notifications
router.get(
  "/my",
  protect,
  getMyNotifications
);

// Get unread notifications
router.get(
  "/unread",
  protect,
  getUnreadNotifications
);


// Mark one notification as read
router.put(
  "/:id/read",
  protect,
  markNotificationAsRead
);

// Mark all notifications as read
router.put(
  "/read-all",
  protect,
  markAllNotificationsAsRead
);

// Delete notification
router.delete(
  "/:id",
  protect,
  deleteNotification
);


module.exports = router;