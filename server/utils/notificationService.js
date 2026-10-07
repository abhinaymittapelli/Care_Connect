const Notification = require("../models/Notification");
const sendEmail = require("./emailService");

const createNotification = async ({
  recipientId,
  email,
  type,
  title,
  message,
  relatedId = null,
}) => {
  try {
    // Create in-app notification
    const notification = await Notification.create({
      recipient: recipientId,
      type,
      title,
      message,
      relatedId,
      isRead: false,
      emailSent: false,
    });

    // Send email
    const emailResult = await sendEmail({
      to: email,
      subject: `CareConnect - ${title}`,
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>${title}</h2>
          <p>${message}</p>

          <hr />

          <p>
            Thank you for using <strong>CareConnect</strong>.
          </p>
        </div>
      `,
    });

    // Update email status
    if (emailResult.success) {
      notification.emailSent = true;
      await notification.save();
    }

    return {
      success: true,
      notification,
      emailSent: emailResult.success,
    };
  } catch (error) {
    console.error(
      "Create Notification Error:",
      error.message
    );

    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = createNotification;