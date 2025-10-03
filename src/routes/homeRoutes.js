const express = require("express");
const {
  getHomeData,
  getFeaturedData,
  getHomeStats
} = require("../controllers/homeController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Home
 *   description: Homepage data endpoints
 */

/**
 * @swagger
 * /api/home:
 *   get:
 *     summary: Get complete homepage data
 *     tags: [Home]
 *     description: Returns all data needed for the homepage including featured products, services, insights, and stats
 *     responses:
 *       200:
 *         description: Homepage data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     hero:
 *                       type: object
 *                     featuredProducts:
 *                       type: object
 *                     services:
 *                       type: object
 *                     about:
 *                       type: object
 *                     insights:
 *                       type: object
 *                     stats:
 *                       type: object
 *                     cta:
 *                       type: object
 */
router.get("/", getHomeData);

/**
 * @swagger
 * /api/home/featured:
 *   get:
 *     summary: Get featured homepage data only
 *     tags: [Home]
 *     description: Returns only featured products, services, and insights
 *     responses:
 *       200:
 *         description: Featured data retrieved successfully
 */
router.get("/featured", getFeaturedData);

/**
 * @swagger
 * /api/home/stats:
 *   get:
 *     summary: Get homepage statistics
 *     tags: [Home]
 *     description: Returns statistics for the homepage
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 */
router.get("/stats", getHomeStats);

module.exports = router;