// src/server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------------
// Swagger setup
// -------------------------
const Swagger = require("./config/swagger");
new Swagger(app); // This initializes Swagger with your app

// -------------------------
// MongoDB connection
// -------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// -------------------------
// Routes
// -------------------------
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/about", require("./routes/aboutRoutes"));
app.use("/api/services", require("./routes/serviceRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/insights", require("./routes/insightRoutes"));
app.use("/api/cards", require("./routes/cardRoutes"));
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/home", require("./routes/homeRoutes"));

// -------------------------
// Root - Add link to Swagger docs
// -------------------------
app.get("/", (req, res) => {
  res.json({ 
    message: "🚀 Upeosoft CMS API is running!",
    version: "1.0.0",
    documentation: `${req.protocol}://${req.get('host')}/api-docs`,
    endpoints: [
      "/api/users",
      "/api/about", 
      "/api/services",
      "/api/products",
      "/api/insights",
      "/api/cards",
      "/api/contacts",
      "/api/home",
      "/api-docs"
    ]
  });
});

// -------------------------
// Health check
// -------------------------
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    documentation: `${req.protocol}://${req.get('host')}/api-docs`,
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// -------------------------
// 404 Handler
// -------------------------
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: `Route not found: ${req.method} ${req.url}`,
    documentation: `${req.protocol}://${req.get('host')}/api-docs`,
    availableEndpoints: [
      "/api/users",
      "/api/about",
      "/api/services", 
      "/api/products",
      "/api/insights",
      "/api/cards",
      "/api/contacts",
      "/api/home",
      "/api-docs",
      "/health"
    ]
  });
});

// -------------------------
// Start server
// -------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`📚 Swagger Docs: http://localhost:${PORT}/api-docs`);
  console.log(`❤️  Health: http://localhost:${PORT}/health`);
  console.log(`\n📋 Available Endpoints:`);
  console.log(`   🔐 Auth: http://localhost:${PORT}/api/users`);
  console.log(`   ℹ️  About: http://localhost:${PORT}/api/about`);
  console.log(`   🛠️  Services: http://localhost:${PORT}/api/services`);
  console.log(`   📦 Products: http://localhost:${PORT}/api/products`);
  console.log(`   📝 Insights: http://localhost:${PORT}/api/insights`);
  console.log(`   🃏 Cards: http://localhost:${PORT}/api/cards`);
  console.log(`   📞 Contacts: http://localhost:${PORT}/api/contacts`);
  console.log(`   🏠 Home: http://localhost:${PORT}/api/home`);
});

module.exports = app;