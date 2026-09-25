const mongoose = require("mongoose");

const jobEvidenceSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true,
    },

    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },

    beforeImages: [
      {
        type: String,
        trim: true,
      },
    ],

    afterImages: [
      {
        type: String,
        trim: true,
      },
    ],

    completionNotes: {
      type: String,
      trim: true,
      default: "",
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const JobEvidence = mongoose.model(
  "JobEvidence",
  jobEvidenceSchema
);

module.exports = JobEvidence;