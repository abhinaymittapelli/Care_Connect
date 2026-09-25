const mongoose = require("mongoose");
const Payment = require("../models/Payment");
const Invoice = require("../models/Invoice");

// Create payment record
const createPayment = async (req, res) => {
  try {
    const {
      invoiceId,
      paymentMethod,
      transactionId,
      notes,
    } = req.body;
     
    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
  return res.status(400).json({
    message: "Invalid invoice ID",
  });
}

    if (!invoiceId) {
      return res.status(400).json({
        message: "Invoice ID is required",
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        message: "Payment method is required",
      });
    }

    const invoice = await Invoice.findById(invoiceId);

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    // Check invoice ownership
    if (
      invoice.customer.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message:
          "You can only make payment for your own invoice",
      });
    }

    // Check if payment already exists
    const existingPayment = await Payment.findOne({
      invoice: invoiceId,
    });

    if (existingPayment) {
      return res.status(400).json({
        message:
          "Payment record already exists for this invoice",
      });
    }

    // Check if invoice is already paid
    if (invoice.paymentStatus === "paid") {
      return res.status(400).json({
        message: "Invoice is already paid",
      });
    }

    const payment = await Payment.create({
      invoice: invoice._id,
      booking: invoice.booking,
      customer: invoice.customer,
      provider: invoice.provider,
      amount: invoice.totalAmount,
      paymentMethod,
      transactionId:
        transactionId || undefined,
      status: "success",
      paidAt: new Date(),
      notes: notes || "",
    });

    // Update invoice
    invoice.paymentStatus = "paid";
    invoice.paymentMethod = paymentMethod;
    invoice.paidAt = payment.paidAt;

    await invoice.save();

    const populatedPayment =
      await Payment.findById(payment._id)
        .populate(
          "invoice",
          "invoiceNumber totalAmount paymentStatus"
        )
        .populate(
          "booking",
          "scheduledDate startTime endTime status"
        )
        .populate(
          "customer",
          "name email phone"
        )
        .populate(
          "provider",
          "businessName phone"
        );

    res.status(201).json({
      message: "Payment recorded successfully",
      payment: populatedPayment,
    });
  } catch (error) {
    console.error(
      "Create Payment Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Get customer's payments
const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({
      customer: req.user.id,
    })
      .populate(
        "invoice",
        "invoiceNumber totalAmount paymentStatus"
      )
      .populate(
        "booking",
        "scheduledDate startTime endTime status"
      )
      .populate(
        "provider",
        "businessName phone city state"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error(
      "Get My Payments Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Get payment by ID
const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(
      req.params.id
    )
      .populate(
        "invoice",
        "invoiceNumber totalAmount paymentStatus"
      )
      .populate(
        "booking",
        "scheduledDate startTime endTime status"
      )
      .populate(
        "customer",
        "name email phone"
      )
      .populate(
        "provider",
        "businessName phone city state"
      );

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    // Customer access
    if (
      payment.customer._id.toString() === req.user.id
    ) {
      return res.status(200).json({
        payment,
      });
    }

    // Provider access
    if (
      payment.provider._id.toString() === req.user.id
    ) {
      return res.status(200).json({
        payment,
      });
    }

    return res.status(403).json({
      message: "Access denied",
    });
  } catch (error) {
    console.error(
      "Get Payment Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  createPayment,
  getMyPayments,
  getPaymentById,
};