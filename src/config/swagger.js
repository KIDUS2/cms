const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

class Swagger {
  constructor(app) {
    if (!app) throw new Error("Express app instance is required");
    this.app = app;
    this.init();
  }

  getServerUrl() {
    // Dynamic URL handling for Vercel
    if (process.env.NODE_ENV === "production") {
      // Vercel provides VERCEL_URL and VERCEL_ENV
      const vercelUrl = process.env.VERCEL_URL;
      const vercelEnv = process.env.VERCEL_ENV; // production, preview, development
      
      if (vercelUrl) {
        // For production deployments
        if (vercelEnv === 'production') {
          return `https://${vercelUrl}`;
        }
        // For preview deployments (branch deployments)
        else if (vercelEnv === 'preview') {
          return `https://${vercelUrl}`;
        }
      }
      
      // Fallback for Vercel
      return `https://${vercelUrl || 'your-app.vercel.app'}`;
    }
    
    // Local development
    return `http://localhost:${process.env.PORT || 5000}`;
  }

  getApiPaths() {
    return [
      path.join(process.cwd(), 'src', 'routes', '*.js'),
      './src/routes/*.js'
    ];
  }

  init() {
    const serverUrl = this.getServerUrl();
    
    console.log('🌐 Detected server URL:', serverUrl);
    console.log('🚀 Vercel Environment:', process.env.VERCEL_ENV);
    console.log('🔗 Vercel URL:', process.env.VERCEL_URL);
    console.log('🏷️ Node Environment:', process.env.NODE_ENV);

    const options = {
      definition: {
        openapi: "3.0.0",
        info: {
          title: "CMS API Documentation",
          version: "1.0.0",
          description: "Complete API documentation for the CMS system"
        },
        servers: [
          { 
            url: serverUrl,
            description: this.getServerDescription()
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
      apis: this.getApiPaths(),
    };

    try {
      const specs = swaggerJsdoc(options);
      
      console.log('✅ Swagger spec generated successfully');
      console.log('📊 API paths found:', Object.keys(specs.paths || {}).length);

      // CDN-based Swagger UI with dynamic URL
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
    .environment-badge {
      position: fixed;
      top: 10px;
      right: 10px;
      background: #2563eb;
      color: white;
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 10000;
    }
  </style>
</head>
<body>
  <div class="environment-badge">${this.getServerDescription()}</div>
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

      // Debug endpoint with dynamic info
      this.app.get("/api/swagger-spec", (req, res) => {
        res.json({
          success: true,
          paths: Object.keys(specs.paths || {}),
          totalEndpoints: Object.keys(specs.paths || {}).length,
          server: {
            url: serverUrl,
            description: this.getServerDescription(),
            environment: process.env.NODE_ENV,
            vercel: {
              url: process.env.VERCEL_URL,
              env: process.env.VERCEL_ENV,
              region: process.env.VERCEL_REGION
            }
          },
          exampleUrls: {
            cards: `${serverUrl}/api/cards`,
            users: `${serverUrl}/api/users`,
            products: `${serverUrl}/api/products`
          }
        });
      });

    } catch (error) {
      console.error('❌ Swagger setup failed:', error);
      
      // Fallback with dynamic URL info
      this.app.get("/api-docs", (req, res) => {
        res.send(`
          <h1>API Documentation</h1>
          <div style="background: #fee; padding: 20px; border-radius: 5px;">
            <h3>Swagger is currently unavailable</h3>
            <p><strong>Error:</strong> ${error.message}</p>
            <p><strong>Current Server:</strong> ${serverUrl}</p>
            <p><strong>Environment:</strong> ${this.getServerDescription()}</p>
          </div>
          <p>Available endpoints:</p>
          <ul>
            <li><a href="${serverUrl}/api/users">${serverUrl}/api/users</a></li>
            <li><a href="${serverUrl}/api/cards">${serverUrl}/api/cards</a></li>
            <li><a href="${serverUrl}/api/products">${serverUrl}/api/products</a></li>
            <li><a href="${serverUrl}/health">${serverUrl}/health</a></li>
          </ul>
        `);
      });
    }
  }

  getServerDescription() {
    if (process.env.VERCEL_ENV === 'production') {
      return 'Production Server';
    } else if (process.env.VERCEL_ENV === 'preview') {
      return 'Preview Server';
    } else if (process.env.NODE_ENV === 'production') {
      return 'Production Server';
    } else {
      return 'Development Server';
    }
  }
}

module.exports = Swagger;