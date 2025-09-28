const express = require("express");
const { getAbout } = require("../controllers/aboutController");
const { getServices } = require("../controllers/serviceController");
const { getProducts } = require("../controllers/productController");
const { getInsights } = require("../controllers/insightController");
const { getCards } = require("../controllers/cardController");
const { createContact } = require("../controllers/contactController");

const router = express.Router();

router.get("/about", getAbout);
router.get("/services", getServices);
router.get("/products", getProducts);
router.get("/insights", getInsights);
router.get("/cards", getCards);
router.post("/contact", createContact);

module.exports = router;
