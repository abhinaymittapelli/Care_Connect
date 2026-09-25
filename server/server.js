const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db.js");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const providerRoutes = require("./routes/providerRoutes");
const availabilityRoutes = require("./routes/availabilityRoutes");
const serviceRequestRoutes = require("./routes/serviceRequestRoutes");
const matchingRoutes = require("./routes/matchingRoutes");
const quotationRoutes = require("./routes/quotationRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const jobEvidenceRoutes = require("./routes/jobEvidenceRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
// Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/service-requests", serviceRequestRoutes);
app.use("/api/matching", matchingRoutes);
app.use("/api/quotations", quotationRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/job-evidence", jobEvidenceRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", notificationRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("CareConnect Backend is Running!");
});

// Server Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});