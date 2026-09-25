 const mongoose = require("mongoose");

const quotationSchema = new mongoose.Schema(
  {
    serviceRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceRequest",
      required: true,
    },

    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    message: {
      type: String,
      trim: true,
    },

    estimatedDuration: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
        "withdrawn",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

quotationSchema.index(
  {
    serviceRequest: 1,
    provider: 1,
  },
  {
    unique: true,
  }
);

const Quotation = mongoose.model(
  "Quotation",
  quotationSchema
);

module.exports = Quotation;