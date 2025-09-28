// src/swagger.js
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

class Swagger {
  constructor(app) {
    if (!app) throw new Error("Express app instance is required");
    this.app = app;
    this.init();
  }

  // Determine server URL based on environment
  getServerUrl() {
    if (process.env.NODE_ENV === "production") {
      return process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}/api`
        : "https://your-production-domain/api";
    }
    return "http://localhost:5000/api";
  }

  // Get correct API file paths for Swagger
  getApiPaths() {
    // Try multiple paths for different environments
    const paths = [
      path.join(__dirname, "routes/*.js"),
      path.join(process.cwd(), "src/routes/*.js"),
      path.join(process.cwd(), "routes/*.js"),
      "./src/routes/*.js",
      "./routes/*.js"
    ];
    
    console.log("Looking for API files in:", paths);
    return paths;
  }

  // Initialize Swagger
  init() {
    const options = {
      definition: {
        openapi: "3.0.0",
        info: {
          title: "CMS API",
          version: "1.0.0",
          description: "API documentation for the CMS project",
        },
        servers: [
          {
            url: this.getServerUrl(),
            description: process.env.NODE_ENV === "production" ? "Production server" : "Development server"
          },
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
      apis: this.getApiPaths(),
    };

    try {
      const specs = swaggerJsdoc(options);
      
      // Log successful spec generation
      console.log("Swagger spec generated successfully");
      console.log("Paths found:", Object.keys(specs.paths || {}));
      
      // Swagger UI options
      const swaggerOptions = {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
        swaggerOptions: {
          persistAuthorization: true,
          tryItOutEnabled: true,
        },
        customSiteTitle: "CMS API Documentation",
      };

      // Serve Swagger UI
      this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));
      
      // Add a test endpoint to verify Swagger spec
      this.app.get("/api/swagger-spec", (req, res) => {
        res.json({
          success: true,
          paths: Object.keys(specs.paths || {}),
          components: Object.keys(specs.components || {})
        });
      });
      
      console.log("✅ Swagger UI available at /api-docs");
    } catch (error) {
      console.error("❌ Swagger initialization error:", error);
    }
  }
}

module.exports = Swagger;