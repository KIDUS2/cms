const express = require("express");
const { auth, permit } = require("../middleware/authMiddleware");
const { getServices, createService, updateService, deleteService } = require("../controllers/serviceController");
const router = express.Router();

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all services (public)
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: List of services
 */
router.get("/", getServices);

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Create a service (admin only)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
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
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Service created
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
 *       - name: id
 *         in: path
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
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Service updated
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
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service deleted
 */
router.delete("/:id", auth, permit("admin"), deleteService);

module.exports = router;
