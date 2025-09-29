// routes/cardRoutes.js
const express = require("express");
const {
  getCards,
  createCard,
  updateCard,
  deleteCard
} = require("../controllers/cardController");
const { auth, permit } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/cards:
 *   get:
 *     summary: Get all active cards
 *     tags: [Cards]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by card type
 *     responses:
 *       200:
 *         description: Cards retrieved successfully
 */
router.get("/", getCards);

/**
 * @swagger
 * /api/cards:
 *   post:
 *     summary: Create a new card (admin only)
 *     tags: [Cards]
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
 *               - description
 *               - type
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [service, feature, team, technology, testimonial, project]
 *               icon:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Card created successfully
 */
router.post("/", auth, permit("admin"), createCard);

/**
 * @swagger
 * /api/cards/{id}:
 *   put:
 *     summary: Update a card (admin only)
 *     tags: [Cards]
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
 *         description: Card updated successfully
 */
router.put("/:id", auth, permit("admin"), updateCard);

/**
 * @swagger
 * /api/cards/{id}:
 *   delete:
 *     summary: Delete a card (admin only)
 *     tags: [Cards]
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
 *         description: Card deleted successfully
 */
router.delete("/:id", auth, permit("admin"), deleteCard);

module.exports = router;