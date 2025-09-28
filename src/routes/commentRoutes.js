const express = require("express");
const { auth, permit } = require("../middleware/authMiddleware");
const { createComment, getComments, deleteComment } = require("../controllers/commentController");
const router = express.Router();

/**
 * @swagger
 * /api/comments:
 *   get:
 *     summary: Get all comments (public)
 *     tags: [Comments]
 *     responses:
 *       200:
 *         description: List of comments
 */
router.get("/", getComments);

/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: Create a comment (authenticated)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created
 */
router.post("/", auth, createComment);

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: Delete a comment (admin only)
 *     tags: [Comments]
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
 *         description: Comment deleted
 */
router.delete("/:id", auth, permit("admin"), deleteComment);

module.exports = router;
