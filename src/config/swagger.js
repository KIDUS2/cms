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
    return [
      path.join(__dirname, "routes/*.js"),
      path.join(process.cwd(), "src/routes/*.js"),
      path.join(process.cwd(), "routes/*.js"),
      "./src/routes/*.js",
      "./routes/*.js"
    ];
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
      
      // Swagger UI options with CDN
      const swaggerOptions = {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
        swaggerOptions: {
          persistAuthorization: true,
        },
        customSiteTitle: "CMS API Documentation",
      };

      // Serve Swagger UI with CDN assets
      this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));
      
      console.log("Swagger documentation initialized successfully");
    } catch (error) {
      console.error("Swagger initialization error:", error);
    }
  }
}

module.exports = Swagger;