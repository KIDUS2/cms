// routes/contactRoutes.js
const express = require("express");
const {
  submitContact,
  getContacts,
  updateContactStatus,
  deleteContact
} = require("../controllers/contactController");
const { auth, permit } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/contacts:
 *   post:
 *     summary: Submit a contact form
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - subject
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               company:
 *                 type: string
 *               phone:
 *                 type: string
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Contact form submitted successfully
 */
router.post("/", submitContact);

/**
 * @swagger
 * /api/contacts:
 *   get:
 *     summary: Get all contacts (admin only)
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Contacts retrieved successfully
 */
router.get("/", auth, permit("admin"), getContacts);

/**
 * @swagger
 * /api/contacts/{id}/status:
 *   put:
 *     summary: Update contact status (admin only)
 *     tags: [Contacts]
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
 *               status:
 *                 type: string
 *                 enum: [new, contacted, qualified, proposal-sent, closed-won, closed-lost]
 *     responses:
 *       200:
 *         description: Contact status updated successfully
 */
router.put("/:id/status", auth, permit("admin"), updateContactStatus);

/**
 * @swagger
 * /api/contacts/{id}:
 *   delete:
 *     summary: Delete a contact (admin only)
 *     tags: [Contacts]
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
 *         description: Contact deleted successfully
 */
router.delete("/:id", auth, permit("admin"), deleteContact);

module.exports = router;