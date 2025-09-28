const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

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
        url: "http://localhost:5000/api", // change to your production URL when deploying
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
