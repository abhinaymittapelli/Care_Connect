const Invoice = require("../models/Invoice");
const Booking = require("../models/Booking");
const Provider = require("../models/Provider");

// Create invoice for completed booking
const createInvoice = async (req, res) => {
  try {
    const {
      bookingId,
      taxAmount,
      discountAmount,
      paymentMethod,
      notes,
    } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        message: "Booking ID is required",
      });
    }

    // Find booking
    const booking = await Booking.findById(
      bookingId
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Only completed bookings can have invoices
    if (booking.status !== "completed") {
      return res.status(400).json({
        message:
          "Invoice can only be created for completed bookings",
      });
    }

    // Only customer who owns booking can create invoice
    if (
      booking.customer.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message:
          "You can only create an invoice for your own booking",
      });
    }

    // Check if invoice already exists
    const existingInvoice = await Invoice.findOne({
      booking: bookingId,
    });

    if (existingInvoice) {
      return res.status(400).json({
        message:
          "Invoice already exists for this booking",
      });
    }

    const tax = Number(taxAmount) || 0;
    const discount = Number(discountAmount) || 0;
    const serviceAmount = booking.amount;

    if (tax < 0 || discount < 0) {
      return res.status(400).json({
        message:
          "Tax and discount cannot be negative",
      });
    }

    if (discount > serviceAmount + tax) {
      return res.status(400).json({
        message:
          "Discount cannot exceed the invoice amount",
      });
    }

    const totalAmount =
      serviceAmount + tax - discount;

    // Generate invoice number
    const invoiceNumber =
      `CC-${Date.now()}-${Math.floor(
        Math.random() * 1000
      )}`;

    const invoice = await Invoice.create({
      booking: bookingId,
      customer: booking.customer,
      provider: booking.provider,
      invoiceNumber,
      serviceAmount,
      taxAmount: tax,
      discountAmount: discount,
      totalAmount,
      paymentMethod:
        paymentMethod || "online",
      notes: notes || "",
    });

    const populatedInvoice =
      await Invoice.findById(invoice._id)
        .populate(
          "customer",
          "name email phone"
        )
        .populate(
          "provider",
          "businessName phone city state"
        )
        .populate(
          "booking",
          "scheduledDate startTime endTime amount status address city"
        );

    res.status(201).json({
      message: "Invoice created successfully",
      invoice: populatedInvoice,
    });
  } catch (error) {
    console.error(
      "Create Invoice Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Customer views own invoices
const getMyInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({
      customer: req.user.id,
    })
      .populate(
        "provider",
        "businessName phone city state"
      )
      .populate(
        "booking",
        "scheduledDate startTime endTime amount status address city"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: invoices.length,
      invoices,
    });
  } catch (error) {
    console.error(
      "Get My Invoices Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Get single invoice
const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(
      req.params.id
    )
      .populate(
        "customer",
        "name email phone"
      )
      .populate(
        "provider",
        "businessName phone city state"
      )
      .populate(
        "booking",
        "scheduledDate startTime endTime amount status address city"
      );

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    // Customer can view own invoice
    if (
      invoice.customer._id.toString() === req.user.id
    ) {
      return res.status(200).json({
        invoice,
      });
    }

    // Provider can view invoice for their booking
    if (
      invoice.provider._id.toString() === req.user.id
    ) {
      return res.status(200).json({
        invoice,
      });
    }

    return res.status(403).json({
      message: "Access denied",
    });
  } catch (error) {
    console.error(
      "Get Invoice Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Mark invoice as paid
const markInvoicePaid = async (req, res) => {
  try {
    const invoice = await Invoice.findById(
      req.params.id
    );

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    if (invoice.paymentStatus === "paid") {
      return res.status(400).json({
        message: "Invoice is already paid",
      });
    }

    if (invoice.paymentStatus === "refunded") {
      return res.status(400).json({
        message:
          "Refunded invoice cannot be marked as paid",
      });
    }

    invoice.paymentStatus = "paid";
    invoice.paidAt = new Date();

    await invoice.save();

    res.status(200).json({
      message: "Invoice marked as paid",
      invoice,
    });
  } catch (error) {
    console.error(
      "Mark Invoice Paid Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  createInvoice,
  getMyInvoices,
  getInvoiceById,
  markInvoicePaid,
};