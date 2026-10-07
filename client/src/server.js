const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

const PORT = process.env.PORT || 5000;

// Database
connectDB();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Root
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to CrediTrust API",
  });
});

// Health
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CrediTrust API is running",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(
    `CrediTrust server running on http://localhost:${PORT}`
  );
});