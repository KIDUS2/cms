const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Choose server URL dynamically
const serverUrl =
  process.env.NODE_ENV === "production"
    ? process.env.PROD_URL || "https://cms-7hralkrc2-kidus2s-projects.vercel.app/api"
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
  apis: ["./src/routes/*.js"], // Path to your route files for Swagger annotations
};

const specs = swaggerJsdoc(options);

const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};

module.exports = swaggerDocs;
