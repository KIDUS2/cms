// src/swagger.js
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

class Swagger {
  constructor(app) {
    if (!app) throw new Error("Express app instance is required");
    this.app = app;
    this.init();
  }

  // Determine server URL based on environment
  getServerUrl() {
    if (process.env.NODE_ENV === "production") {
      // Vercel automatically sets process.env.VERCEL_URL
      return process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}/api`
        : "https://your-production-domain/api"; // fallback
    }
    return "http://localhost:5000/api"; // local development
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
      apis: ["./src/routes/*.js"], // path to your route files for annotations
    };

    const specs = swaggerJsdoc(options);

    // Serve Swagger UI at /api-docs
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
  }
}

module.exports = Swagger;
