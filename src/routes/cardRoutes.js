const express = require("express");
const { auth, permit } = require("../middleware/authMiddleware");
const { getCards, createCard, updateCard, deleteCard } = require("../controllers/cardController");
const router = express.Router();

/**
 * @swagger
 * /api/cards:
 *   get:
 *     summary: Get all cards (public)
 *     tags: [Cards]
 *     responses:
 *       200:
 *         description: List of cards
 */
router.get("/", getCards);

/**
 * @swagger
 * /api/cards:
 *   post:
 *     summary: Create a card (admin only)
 *     tags: [Cards]
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
 *         description: Card created
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
 *         description: Card updated
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
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Card deleted
 */
router.delete("/:id", auth, permit("admin"), deleteCard);

module.exports = router;
