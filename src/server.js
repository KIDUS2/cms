const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

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

// ========== SWAGGER CONFIGURATION ==========
const getServerUrl = () => {
  if (process.env.NODE_ENV === "production") {
    return `https://cms-m0p6hhgqo-kidus2s-projects.vercel.app/api`;
  }
  return `http://localhost:${process.env.PORT || 5000}/api`;
};

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CMS API Documentation",
      version: "1.0.0",
      description: "Complete API documentation for the CMS system"
    },
    servers: [{ url: getServerUrl() }],
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
  apis: [path.join(process.cwd(), 'src', 'routes', '*.js')],
};

try {
  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  
  console.log('✅ Swagger spec generated successfully');
  console.log('📊 API paths found:', Object.keys(swaggerSpec.paths || {}).length);

  // CDN-based Swagger UI - Works on both localhost and Vercel
  app.get("/api-docs", (req, res) => {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CMS API Documentation</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
  <style>
    html { 
      box-sizing: border-box; 
      overflow-y: scroll; 
    }
    *, *:before, *:after { 
      box-sizing: inherit; 
    }
    body { 
      margin: 0; 
      background: #fafafa; 
    }
    .swagger-ui .topbar { 
      display: none 
    }
    .swagger-ui .info .title { 
      color: #2563eb 
    }
    .swagger-ui .btn.authorize { 
      background-color: #2563eb; 
      border-color: #2563eb; 
    }
    .swagger-ui .btn.authorize:hover { 
      background-color: #1d4ed8; 
    }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  
  <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        spec: ${JSON.stringify(swaggerSpec)},
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.presets.standalone
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout",
        filter: true,
        persistAuthorization: true,
        docExpansion: "list",
        displayRequestDuration: true,
        showExtensions: true
      });
      
      window.ui = ui;
    }
  </script>
</body>
</html>
    `;
    res.send(html);
  });

  // Alternative docs route
  app.get("/docs", (req, res) => {
    res.redirect("/api-docs");
  });

  // Debug endpoint to check Swagger spec
  app.get("/api/swagger-spec", (req, res) => {
    res.json({
      success: true,
      paths: Object.keys(swaggerSpec.paths || {}),
      totalEndpoints: Object.keys(swaggerSpec.paths || {}).length,
      serverUrl: getServerUrl(),
      environment: process.env.NODE_ENV,
      vercelUrl: process.env.VERCEL_URL
    });
  });

} catch (error) {
  console.error('❌ Swagger setup failed:', error);
  
  // Fallback if Swagger fails
  app.get("/api-docs", (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>API Documentation</title>
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
        </div>
        <p>Available endpoints:</p>
        <ul>
          <li><a href="/api/users">/api/users</a></li>
          <li><a href="/api/posts">/api/posts</a></li>
          <li><a href="/api/products">/api/products</a></li>
          <li><a href="/api/services">/api/services</a></li>
          <li><a href="/api/contacts">/api/contacts</a></li>
          <li><a href="/health">/health</a></li>
        </ul>
      </body>
      </html>
    `);
  });
}

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
    timestamp: new Date().toISOString()
  });
});

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
    console.log(`🔗 Alternative: http://localhost:${PORT}/docs`);
    console.log(`❤️ Health Check: http://localhost:${PORT}/health`);
  });
}

module.exports = app;