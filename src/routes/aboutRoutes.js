// routes/aboutRoutes.js
const express = require("express");
const { getAbout, updateAbout } = require("../controllers/aboutController");
const { auth, permit } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/about:
 *   get:
 *     summary: Get about information
 *     tags: [About]
 *     responses:
 *       200:
 *         description: About content retrieved successfully
 *       404:
 *         description: About content not found
 */
router.get("/", getAbout);

/**
 * @swagger
 * /api/about:
 *   put:
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
 *               heroTitle:
 *                 type: string
 *               heroSubtitle:
 *                 type: string
 *               mission:
 *                 type: string
 *               vision:
 *                 type: string
 *               companyName:
 *                 type: string
 *     responses:
 *       200:
 *         description: About content updated successfully
 *       401:
 *         description: Not authorized
 */
router.put("/", auth, permit("admin"), updateAbout);

module.exports = router;