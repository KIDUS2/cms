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
    return [
      path.join(__dirname, "routes/*.js"),
      path.join(process.cwd(), "src/routes/*.js"),
      "./src/routes/*.js",
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
      
      // Custom Swagger UI configuration with CDN
      const swaggerOptions = {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: "CMS API Documentation",
        swaggerOptions: {
          persistAuthorization: true,
          docExpansion: 'none',
          filter: true,
        },
        customJs: [
          'https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js',
          'https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js'
        ],
        customCssUrl: [
          'https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css'
        ]
      };

      // Serve Swagger UI
      this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));
      
      console.log("✅ Swagger UI available at /api-docs");
    } catch (error) {
      console.error("❌ Swagger initialization error:", error);
    }
  }
}

module.exports = Swagger;