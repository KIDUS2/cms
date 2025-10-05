const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables
dotenv.config();

const app = express();

// ========== SIMPLE CORS CONFIGURATION ==========
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
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CMS API Documentation",
      version: "1.0.0",
      description: "Complete API documentation for the CMS system",
      contact: {
        name: "API Support",
        email: "support@example.com"
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === "production" 
          ? `https://${process.env.VERCEL_URL}/api`
          : `http://localhost:${process.env.PORT || 5000}/api`,
        description: process.env.NODE_ENV === "production" ? "Production" : "Development"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: [path.join(__dirname, "routes", "*.js")], // Path to your route files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "CMS API Documentation"
}));

// Alternative docs route
app.get("/docs", (req, res) => {
  res.redirect("/api-docs");
});

// Swagger JSON endpoint
app.get("/api-docs.json", (req, res) => {
  res.json(swaggerSpec);
});

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
    environment: process.env.NODE_ENV,
    documentation: "/api-docs",
    health: "/health"
  });
});

// ========== HEALTH CHECK ==========
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// ========== 404 HANDLER ==========
app.use((req, res) => {
  res.status(404).json({ 
    message: "Route not found",
    availableRoutes: [
      "/api-docs",
      "/health", 
      "/api/users",
      "/api/posts",
      "/api/products",
      "/api/services",
      "/api/contacts"
    ]
  });
});

// ========== START SERVER ==========
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
    console.log(`📋 Swagger JSON: http://localhost:${PORT}/api-docs.json`);
    console.log(`🔗 Alternative: http://localhost:${PORT}/docs`);
    console.log(`❤️ Health Check: http://localhost:${PORT}/health`);
  });
}

module.exports = app;