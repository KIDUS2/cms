const express = require("express");
const { getAbout, updateAbout } = require("../controllers/aboutController");
const { auth, permit } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/about:
 *   get:
 *     summary: Get about information (public)
 *     tags: [About]
 *     responses:
 *       200:
 *         description: About info retrieved successfully
 */
router.get("/", getAbout);

/**
 * @swagger
 * /api/about:
 *   post:
 *     summary: Update about information (admin only)
 *     tags: [About]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: About info updated
 */
router.post("/", auth, permit("admin"), updateAbout);

module.exports = router;
