// src/server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------------
// Swagger setup
// -------------------------
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CMS API",
      version: "1.0.0",
      description: "Content Management System API documentation",
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? "https://cms-7hralkrc2-kidus2s-projects.vercel.app"
            : "http://localhost:5000",
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
  apis: ["./src/routes/*.js"], // all routes for Swagger
};
const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// -------------------------
// MongoDB connection
// -------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// -------------------------
// Routes
// -------------------------
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/posts", require("./routes/postRoutes"));
app.use("/api/about", require("./routes/aboutRoutes"));
app.use("/api/services", require("./routes/serviceRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/insights", require("./routes/insightRoutes"));
app.use("/api/cards", require("./routes/cardRoutes"));
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));

// -------------------------
// Root
// -------------------------
app.get("/", (req, res) => {
  res.send("🚀 CMS API is running!");
});

// -------------------------
// 404 Handler
// -------------------------
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// -------------------------
// Start server
// -------------------------
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export for serverless (Vercel, etc.)
module.exports = app;
