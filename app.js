// app.js
const express = require("express");
const app = express();
const cors = require("cors");
const logger = require("./utils/logger");
const authRoutes = require("./routes/authRoutes");

// ✅ Enable CORS
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// Health Check
app.get("/", (req, res) => {
  logger.info("Root route hit");
  res.send("🚀 Health Tracker API is Live");
});

// Auth Route
app.use("/api/auth", authRoutes);

// Global error handler
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

module.exports = app;
