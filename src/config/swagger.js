const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const fs = require("fs");

class Swagger {
  constructor(app) {
    if (!app) throw new Error("Express app instance is required");
    this.app = app;
    this.init();
  }

  getServerUrl() {
    if (process.env.NODE_ENV === "production") {
      return process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}/api`
        : "https://your-production-domain/api";
    }
    return "http://localhost:5000/api";
  }

  getApiPaths() {
    const routesPath = path.join(process.cwd(), 'src', 'routes', '*.js');
    console.log('📁 Looking for route files in:', routesPath);
    
    // Check if the path exists
    if (fs.existsSync(path.dirname(routesPath))) {
      console.log('✅ Routes directory exists');
    } else {
      console.log('❌ Routes directory not found');
    }
    
    return [routesPath];
  }

  init() {
    const options = {
      definition: {
        openapi: "3.0.0",
        info: {
          title: "Upeosoft CMS API",
          version: "1.0.0",
          description: "Professional API documentation for Upeosoft CMS",
        },
        servers: [
          {
            url: this.getServerUrl(),
            description: process.env.NODE_ENV
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
      
      console.log("✅ Swagger spec generated");
      console.log("📊 Paths found:", Object.keys(specs.paths || {}));

      // Professional Swagger UI configuration
      const swaggerOptions = {
        explorer: true,
        customCss: `
          .swagger-ui .topbar { display: none }
          .swagger-ui .info .title { color: #2563eb }
        `,
        customSiteTitle: "Upeosoft CMS API",
        swaggerOptions: {
          persistAuthorization: true,
          docExpansion: "list",
          filter: true,
          displayRequestDuration: true,
        },
      };

      // Serve Swagger UI
      this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));

      console.log("✅ Swagger UI mounted at /api-docs");
      
    } catch (error) {
      console.error("❌ Swagger error:", error);
    }
  }
}

module.exports = Swagger;