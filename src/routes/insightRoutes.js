// routes/insightRoutes.js
const express = require("express");
const {
  getInsights,
  getFeaturedInsights,
  getInsightsByCategory,
  getInsightBySlug,
  createInsight,
  updateInsight,
  deleteInsight,
  togglePublishStatus,
  getPopularInsights,
  getInsightsByTag
} = require("../controllers/insightController");
const { auth, permit } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/insights:
 *   get:
 *     summary: Get all published insights with pagination and filtering
 *     tags: [Insights]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of insights per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: Filter by tag
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Filter featured insights
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title and content
 *     responses:
 *       200:
 *         description: Insights retrieved successfully
 */
router.get("/", getInsights);

/**
 * @swagger
 * /api/insights/featured:
 *   get:
 *     summary: Get featured insights
 *     tags: [Insights]
 *     responses:
 *       200:
 *         description: Featured insights retrieved successfully
 */
router.get("/featured", getFeaturedInsights);

/**
 * @swagger
 * /api/insights/popular:
 *   get:
 *     summary: Get popular insights (most viewed)
 *     tags: [Insights]
 *     responses:
 *       200:
 *         description: Popular insights retrieved successfully
 */
router.get("/popular", getPopularInsights);

/**
 * @swagger
 * /api/insights/category/:category:
 *   get:
 *     summary: Get insights by category
 *     tags: [Insights]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Insights by category retrieved successfully
 */
router.get("/category/:category", getInsightsByCategory);

/**
 * @swagger
 * /api/insights/tag/:tag:
 *   get:
 *     summary: Get insights by tag
 *     tags: [Insights]
 *     parameters:
 *       - in: path
 *         name: tag
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Insights by tag retrieved successfully
 */
router.get("/tag/:tag", getInsightsByTag);

/**
 * @swagger
 * /api/insights/:slug:
 *   get:
 *     summary: Get insight by slug
 *     tags: [Insights]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Insight retrieved successfully
 *       404:
 *         description: Insight not found
 */
router.get("/:slug", getInsightBySlug);

/**
 * @swagger
 * /api/insights:
 *   post:
 *     summary: Create a new insight (admin only)
 *     tags: [Insights]
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
 *               - excerpt
 *               - content
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *               slug:
 *                 type: string
 *               excerpt:
 *                 type: string
 *               content:
 *                 type: string
 *               coverImage:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [technology, business, development, design, news]
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               readTime:
 *                 type: number
 *               isFeatured:
 *                 type: boolean
 *               isPublished:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Insight created successfully
 *       400:
 *         description: Validation error
 */
router.post("/", auth, permit("admin"), createInsight);

/**
 * @swagger
 * /api/insights/:id:
 *   put:
 *     summary: Update an insight (admin only)
 *     tags: [Insights]
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
 *               slug:
 *                 type: string
 *               excerpt:
 *                 type: string
 *               content:
 *                 type: string
 *               category:
 *                 type: string
 *               isFeatured:
 *                 type: boolean
 *               isPublished:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Insight updated successfully
 *       404:
 *         description: Insight not found
 */
router.put("/:id", auth, permit("admin"), updateInsight);

/**
 * @swagger
 * /api/insights/:id/publish:
 *   patch:
 *     summary: Toggle insight published status (admin only)
 *     tags: [Insights]
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
 *         description: Insight publish status toggled successfully
 *       404:
 *         description: Insight not found
 */
router.patch("/:id/publish", auth, permit("admin"), togglePublishStatus);

/**
 * @swagger
 * /api/insights/:id:
 *   delete:
 *     summary: Delete an insight (admin only)
 *     tags: [Insights]
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
 *         description: Insight deleted successfully
 *       404:
 *         description: Insight not found
 */
router.delete("/:id", auth, permit("admin"), deleteInsight);

module.exports = router;