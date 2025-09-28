const express = require("express");
const { auth, permit } = require("../middleware/authMiddleware");

const { updateAbout } = require("../controllers/aboutController");
const { createService, updateService, deleteService } = require("../controllers/serviceController");
const { createProduct, updateProduct, deleteProduct } = require("../controllers/productController");
const { createInsight, updateInsight, deleteInsight } = require("../controllers/insightController");
const { createCard, updateCard, deleteCard } = require("../controllers/cardController");
const { getContacts } = require("../controllers/contactController");

const router = express.Router();

router.post("/about", auth, permit, updateAbout);

router.post("/services", auth, permit, createService);
router.put("/services/:id", auth, permit, updateService);
router.delete("/services/:id", auth, permit, deleteService);

router.post("/products", auth, permit, createProduct);
router.put("/products/:id", auth, permit, updateProduct);
router.delete("/products/:id", auth, permit, deleteProduct);

router.post("/insights", auth, permit, createInsight);
router.put("/insights/:id", auth, permit, updateInsight);
router.delete("/insights/:id", auth, permit, deleteInsight);

router.post("/cards", auth, permit, createCard);
router.put("/cards/:id", auth, permit, updateCard);
router.delete("/cards/:id", auth, permit, deleteCard);

router.get("/contacts", auth, permit, getContacts);

module.exports = router;
