const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

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

// ========== VERCEL-COMPATIBLE SWAGGER SETUP ==========
const getServerUrl = () => {
  if (process.env.NODE_ENV === "production") {
    return process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}/api`
      : "https://cms-m0p6hhgqo-kidus2s-projects.vercel.app/api";
  }
  return `http://localhost:${process.env.PORT || 5000}/api`;
};

// Dynamic API paths for different environments
const getApiPaths = () => {
  const paths = [
    path.join(process.cwd(), 'src', 'routes', '*.js'),
    path.join(process.cwd(), 'routes', '*.js'),
    './src/routes/*.js',
    './routes/*.js'
  ];
  
  console.log('🔍 Looking for API files in:', paths);
  return paths;
};

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
        url: getServerUrl(),
        description: `${process.env.NODE_ENV} server`
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
  apis: getApiPaths(),
};

try {
  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  
  console.log('✅ Swagger spec generated successfully');
  console.log('📊 Found paths:', Object.keys(swaggerSpec.paths || {}));
  console.log('🌐 Server URL:', getServerUrl());

  // Serve Swagger UI
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "CMS API Documentation",
    swaggerOptions: {
      persistAuthorization: true,
    }
  }));

  // Alternative docs route
  app.get("/docs", (req, res) => {
    res.redirect("/api-docs");
  });

  // Swagger JSON endpoint for debugging
  app.get("/api-docs.json", (req, res) => {
    res.json({
      success: true,
      paths: Object.keys(swaggerSpec.paths || {}),
      components: Object.keys(swaggerSpec.components || {}),
      serverUrl: getServerUrl(),
      environment: process.env.NODE_ENV,
      vercelUrl: process.env.VERCEL_URL
    });
  });

} catch (error) {
  console.error('❌ Swagger setup failed:', error);
  
  // Fallback route if Swagger fails
  app.get("/api-docs", (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>API Documentation - Swagger Not Available</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .error { color: red; background: #fee; padding: 20px; border-radius: 5px; }
        </style>
      </head>
      <body>
        <h1>API Documentation</h1>
        <div class="error">
          <h3>Swagger documentation is currently unavailable</h3>
          <p><strong>Error:</strong> ${error.message}</p>
          <p>Check the server logs for more details.</p>
        </div>
        <p>Available API endpoints:</p>
        <ul>
          <li><a href="/api/users">/api/users</a></li>
          <li><a href="/api/posts">/api/posts</a></li>
          <li><a href="/api/products">/api/products</a></li>
          <li><a href="/api/services">/api/services</a></li>
          <li><a href="/api/contacts">/api/contacts</a></li>
        </ul>
      </body>
      </html>
    `);
  });
}

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
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ========== ROOT ROUTE ==========
app.get("/", (req, res) => {
  res.json({ 
    message: "🚀 CMS API is running!",
    environment: process.env.NODE_ENV,
    vercelUrl: process.env.VERCEL_URL,
    documentation: "/api-docs",
    health: "/health",
    apiBase: "/api"
  });
});

// ========== HEALTH CHECK ==========
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    vercel: !!process.env.VERCEL,
    vercelUrl: process.env.VERCEL_URL
  });
});

// ========== 404 HANDLER ==========
app.use((req, res) => {
  res.status(404).json({ 
    message: "Route not found",
    requestedUrl: req.url,
    availableRoutes: [
      "/api-docs",
      "/docs", 
      "/health",
      "/api/users",
      "/api/posts",
      "/api/products",
      "/api/services"
    ]
  });
});

// ========== START SERVER ==========
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  });
}

module.exports = app;