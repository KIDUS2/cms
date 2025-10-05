const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables
dotenv.config();

const app = express();

// ========== SIMPLE CORS CONFIGURATION ==========
// This is the simplest and most reliable approach
app.use(cors({
  origin: true, // Allow all origins (you can restrict this in production)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// No need for separate app.options() calls with the simple approach

// ========== MIDDLEWARE ==========
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== ROUTES ==========
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

// ========== SWAGGER SETUP ==========
// Your existing Swagger setup...

// ========== MONGODB CONNECTION ==========
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ========== ROOT ROUTE ==========
app.get("/", (req, res) => {
  res.json({ 
    message: "🚀 CMS API is running!",
    cors: "CORS is enabled",
    environment: process.env.NODE_ENV
  });
});

// ========== START SERVER ==========
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`CORS enabled for all origins`);
  });
}

module.exports = app;