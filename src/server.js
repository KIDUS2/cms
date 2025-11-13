const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables
dotenv.config();

const app = express();

// ========== CORS CONFIGURATION ==========
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// ========== MIDDLEWARE ==========
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== SWAGGER SETUP ==========
const Swagger = require("./config/swagger");
new Swagger(app);

// ========== API ROUTES ==========
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/posts", require("./routes/postRoutes"));
app.use("/api/about", require("./routes/aboutRoutes"));
app.use("/api/services", require("./routes/serviceRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/insights", require("./routes/insightRoutes"));
app.use("/api/cards", require("./routes/cardRoutes"));
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));
app.use("/api/home", require("./routes/homeRoutes"));

// ========== NEW ROUTES FOR HOME SECTIONS ==========
app.use("/api/hero", require("./routes/heroRoutes"));
app.use("/api/home-services", require("./routes/homeServiceRoutes"));
app.use("/api/testimonials", require("./routes/testimonialRoutes"));
app.use("/api/partners", require("./routes/partnerRoutes"));

// ========== MONGODB CONNECTION ==========
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ========== BASIC ROUTES ==========
app.get("/", (req, res) => {
  res.json({ 
    message: "🚀 CMS API is running!",
    documentation: "/api-docs",
    health: "/health",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    availableRoutes: [
       "/api/home",
      "/api/hero",
      "/api/home-services", 
      "/api/testimonials",
      "/api/partners",
      "/api/users",
      "/api/posts",
      "/api/products",
      "/api/services",
      "/api/insights",
      "/api/cards",
      "/api/contacts"
    ]
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    vercel: !!process.env.VERCEL,
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
  });
});

// ========== 404 HANDLER ==========
app.use((req, res) => {
  res.status(404).json({ 
    message: "Route not found",
    availableRoutes: [
      "/api-docs",
      "/docs",
      "/health",
      "/api/hero",
      "/api/home-services",
      "/api/testimonials",
      "/api/partners",
      "/api/home",
      "/api/users",
      "/api/posts",
      "/api/products",
      "/api/services",
      "/api/insights",
      "/api/cards",
      "/api/contacts"
    ]
  });
});

// ========== START SERVER ==========
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
    console.log(`🔗 Alternative: http://localhost:${PORT}/docs`);
    console.log(`🏠 Home API: http://localhost:${PORT}/api/home`);
    console.log(`⭐ New Routes:`);
    console.log(`   - Hero: http://localhost:${PORT}/api/hero`);
    console.log(`   - Home Services: http://localhost:${PORT}/api/home-services`);
    console.log(`   - Testimonials: http://localhost:${PORT}/api/testimonials`);
    console.log(`   - Partners: http://localhost:${PORT}/api/partners`);
  });
}

module.exports = app;