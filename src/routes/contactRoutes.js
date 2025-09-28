const express = require("express");
const { auth, permit } = require("../middleware/authMiddleware");
const { createContact, getContacts } = require("../controllers/contactController");
const router = express.Router();



/**
 * @swagger
 * /api/contacts:
 *   post:
 *     summary: Create a contact message (public)
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Contact created
 */
router.post("/", createContact); 
/**
 * @swagger
 * /api/contacts:
 *   get:
 *     summary: Get all contact messages (admin only)
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of contacts
 */
router.get("/", auth, permit("admin"), getContacts);




module.exports = router;
