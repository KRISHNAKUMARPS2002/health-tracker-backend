// app.js
const express = require("express");
const app = express();
const cors = require("cors");
const logger = require("./utils/logger");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const vitalsRoutes = require("./routes/vitalsRoutes");
const dietRoutes = require("./routes/dietRoutes");

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

// Auth Routes
app.use("/api/auth", authRoutes);
// User Routes
app.use("/api/users", userRoutes);
// Vitals Routes
app.use("/api/vitals", vitalsRoutes);
// Diet Routes
app.use("/api/diet", dietRoutes);

// Global error handler
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

module.exports = app;
