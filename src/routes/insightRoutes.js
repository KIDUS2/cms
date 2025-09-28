const express = require("express");
const { auth, permit } = require("../middleware/authMiddleware");
const { getInsights, createInsight, updateInsight, deleteInsight } = require("../controllers/insightController");
const router = express.Router();

/**
 * @swagger
 * /api/insights:
 *   get:
 *     summary: Get all insights (public)
 *     tags: [Insights]
 *     responses:
 *       200:
 *         description: List of insights
 */
router.get("/", getInsights);

/**
 * @swagger
 * /api/insights:
 *   post:
 *     summary: Create an insight (admin only)
 *     tags: [Insights]
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
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Insight created
 */
router.post("/", auth, permit("admin"), createInsight);

/**
 * @swagger
 * /api/insights/{id}:
 *   put:
 *     summary: Update an insight (admin only)
 *     tags: [Insights]
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
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Insight updated
 */
router.put("/:id", auth, permit("admin"), updateInsight);

/**
 * @swagger
 * /api/insights/{id}:
 *   delete:
 *     summary: Delete an insight (admin only)
 *     tags: [Insights]
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
 *         description: Insight deleted
 */
router.delete("/:id", auth, permit("admin"), deleteInsight);

module.exports = router;
