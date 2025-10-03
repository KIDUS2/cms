// routes/serviceRoutes.js
const express = require("express");
const {
  getServices,
  getServiceBySlug,
  createService,
  updateService,
  deleteService
} = require("../controllers/serviceController");
const { auth, permit } = require("../middleware/authMiddleware");
const Card = require("../models/Card");
const router = express.Router();

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all active services
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: Services retrieved successfully
 */
router.get("/", getServices);

/**
 * @swagger
 * /api/services/{slug}:
 *   get:
 *     summary: Get service by slug
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service retrieved successfully
 *       404:
 *         description: Service not found
 */
router.get("/:slug", getServiceBySlug);

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Create a new service (admin only)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - slug
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               slug:
 *                 type: string
 *               description:
 *                 type: string
 *               fullDescription:
 *                 type: string
 *               icon:
 *                 type: string
 *               coverImage:
 *                 type: string
 *     responses:
 *       201:
 *         description: Service created successfully
 *       400:
 *         description: Validation error
 */
router.post("/", auth, permit("admin"), createService);

/**
 * @swagger
 * /api/services/{id}:
 *   put:
 *     summary: Update a service (admin only)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Service updated successfully
 *       404:
 *         description: Service not found
 */
router.put("/:id", auth, permit("admin"), updateService);

/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     summary: Delete a service (admin only)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service deleted successfully
 *       404:
 *         description: Service not found
 */
router.delete("/:id", auth, permit("admin"), deleteService);


/**
 * @swagger
 * /api/services/cards:
 *   get:
 *     summary: Get all service cards with full details
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: List of service cards with complete information
 */
router.get("/cards", async (req, res) => {
  try {
    const serviceCards = await Card.find({ 
      type: "service", 
      isActive: true 
    }).sort({ order: 1 });
    res.json(serviceCards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;