const Notification = require("../models/Notification");

// Get my notifications
const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error(
      "Get Notifications Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Get unread notifications
const getUnreadNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user.id,
      isRead: false,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error(
      "Get Unread Notifications Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Mark notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const notification =
      await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    if (
      notification.recipient.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    notification.isRead = true;

    await notification.save();

    res.status(200).json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error(
      "Mark Notification Read Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Mark all notifications as read
const markAllNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        recipient: req.user.id,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

    res.status(200).json({
      message:
        "All notifications marked as read",
    });
  } catch (error) {
    console.error(
      "Mark All Notifications Read Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const notification =
      await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    if (
      notification.recipient.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    await Notification.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Notification Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  getMyNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
};
