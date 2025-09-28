const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Dynamically pick correct server URL
const serverUrl =
  process.env.NODE_ENV === "production"
    ? `https://${process.env.VERCEL_URL}/api`
    : "http://localhost:5000/api";


const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CMS API",
      version: "1.0.0",
      description: "API documentation for your CMS project",
    },
    servers: [
      {
        url: serverUrl,
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Adjust path depending on project structure
};

const specs = swaggerJsdoc(options);

const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};

module.exports = swaggerDocs;
