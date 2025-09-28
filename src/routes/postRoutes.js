const express = require("express");
const { auth, permit } = require("../middleware/authMiddleware");
const { getPosts, createPost, updatePost, deletePost } = require("../controllers/postController");
const router = express.Router();

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all published posts (public)
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List of posts
 */
router.get("/", getPosts);

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Get post by ID (public)
 *     tags: [Posts]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post data
 */

router.post("/", auth, createPost);

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Update a post (authenticated)
 *     tags: [Posts]
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
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post updated
 */
router.put("/:id", auth, updatePost);

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete a post (admin only)
 *     tags: [Posts]
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
 *         description: Post deleted
 */
router.delete("/:id", auth, permit("admin"), deletePost);

module.exports = router;
