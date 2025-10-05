const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

class Swagger {
  constructor(app) {
    if (!app) throw new Error("Express app instance is required");
    this.app = app;
    this.init();
  }

  getServerUrl() {
    if (process.env.NODE_ENV === "production") {
      return `https://cms-m0p6hhgqo-kidus2s-projects.vercel.app/api`;
    }
    return `http://localhost:${process.env.PORT || 5000}/api`;
  }

  getApiPaths() {
    return [
      path.join(process.cwd(), 'src', 'routes', '*.js'),
      './src/routes/*.js'
    ];
  }

  init() {
    const options = {
      definition: {
        openapi: "3.0.0",
        info: {
          title: "CMS API Documentation",
          version: "1.0.0",
          description: "Complete API documentation for the CMS system"
        },
        servers: [{ url: this.getServerUrl() }],
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
      
      console.log('✅ Swagger spec generated successfully');
      console.log('📊 API paths found:', Object.keys(specs.paths || {}).length);

      // CDN-based Swagger UI
      this.app.get("/api-docs", (req, res) => {
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
        spec: ${JSON.stringify(specs)},
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "BaseLayout",
        filter: true,
        persistAuthorization: true,
        docExpansion: "list",
        displayRequestDuration: true
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
      this.app.get("/docs", (req, res) => {
        res.redirect("/api-docs");
      });

      // Debug endpoint
      this.app.get("/api/swagger-spec", (req, res) => {
        res.json({
          success: true,
          paths: Object.keys(specs.paths || {}),
          totalEndpoints: Object.keys(specs.paths || {}).length,
          serverUrl: this.getServerUrl(),
          environment: process.env.NODE_ENV
        });
      });

    } catch (error) {
      console.error('❌ Swagger setup failed:', error);
      
      // Fallback
      this.app.get("/api-docs", (req, res) => {
        res.send(`
          <h1>API Documentation</h1>
          <p>Swagger is currently unavailable. Error: ${error.message}</p>
        `);
      });
    }
  }
}

module.exports = Swagger;