const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db.js");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/categories", categoryRoutes);

// Routes
app.use("/api/users", userRoutes);

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