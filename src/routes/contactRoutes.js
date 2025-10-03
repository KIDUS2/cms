const express = require("express");
const {
  // Company methods
  getCompanyContact,
  updateCompanyContact,
  getPublicCompanyInfo,
  
  // Submission methods
  submitContact,
  getContactSubmissions,
  getContactSubmissionById,
  updateContactSubmission,
  deleteContactSubmission
} = require("../controllers/contactController");
const { auth, permit } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: Combined company info and contact submissions
 */

// ========== COMPANY ROUTES ==========

/**
 * @swagger
 * /api/contacts/company:
 *   get:
 *     summary: Get company contact information
 *     tags: [Contacts]
 *     responses:
 *       200:
 *         description: Company contact information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     companyName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     address:
 *                       type: object
 */
router.get("/company", getCompanyContact);

/**
 * @swagger
 * /api/contacts/company/public:
 *   get:
 *     summary: Get public company information
 *     tags: [Contacts]
 *     responses:
 *       200:
 *         description: Public company information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     companyName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     fullAddress:
 *                       type: string
 *                     socialMedia:
 *                       type: object
 *                     businessHours:
 *                       type: object
 */
router.get("/company/public", getPublicCompanyInfo);

/**
 * @swagger
 * /api/contacts/company:
 *   put:
 *     summary: Update company contact information (Admin only)
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: object
 *               socialMedia:
 *                 type: object
 *               businessHours:
 *                 type: object
 *     responses:
 *       200:
 *         description: Company contact information updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.put("/company", auth, permit("admin"), updateCompanyContact);

// ========== SUBMISSION ROUTES ==========

/**
 * @swagger
 * /api/contacts/submit:
 *   post:
 *     summary: Submit contact form
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
 *               - privacyConsent
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *               company:
 *                 type: string
 *                 example: "ABC Corp"
 *               subject:
 *                 type: string
 *                 example: "Website Development Inquiry"
 *               message:
 *                 type: string
 *                 example: "I would like to discuss a new website project."
 *               serviceInterest:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [web-development, mobile-app-development, ecommerce-solutions, ui-ux-design]
 *               budget:
 *                 type: string
 *                 enum: [<$5k, $5k-$10k, $10k-$25k, $25k-$50k, $50k-$100k, $100k+, undecided]
 *               timeline:
 *                 type: string
 *                 enum: [immediately, 2-4 weeks, 1-3 months, 3-6 months, 6+ months, flexible]
 *               privacyConsent:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Contact submitted successfully
 *       400:
 *         description: Bad request - validation error
 */
router.post("/submit", submitContact);

/**
 * @swagger
 * /api/contacts/submissions:
 *   get:
 *     summary: Get all contact submissions (Admin only)
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [new, contacted, under-review, proposal-sent, approved, closed-won, closed-lost]
 *         description: Filter by status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Contact submissions retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get("/submissions", auth, permit("admin"), getContactSubmissions);

/**
 * @swagger
 * /api/contacts/submissions/{id}:
 *   get:
 *     summary: Get contact submission by ID (Admin only)
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact submission ID
 *     responses:
 *       200:
 *         description: Contact submission retrieved successfully
 *       404:
 *         description: Contact submission not found
 *       401:
 *         description: Unauthorized
 */
router.get("/submissions/:id", auth, permit("admin"), getContactSubmissionById);

/**
 * @swagger
 * /api/contacts/submissions/{id}:
 *   put:
 *     summary: Update contact submission (Admin only)
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact submission ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [new, contacted, under-review, proposal-sent, approved, closed-won, closed-lost]
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high, urgent]
 *               notes:
 *                 type: string
 *               assignedTo:
 *                 type: string
 *                 description: User ID to assign this contact to
 *     responses:
 *       200:
 *         description: Contact submission updated successfully
 *       404:
 *         description: Contact submission not found
 *       401:
 *         description: Unauthorized
 */
router.put("/submissions/:id", auth, permit("admin"), updateContactSubmission);

/**
 * @swagger
 * /api/contacts/submissions/{id}:
 *   delete:
 *     summary: Delete contact submission (Admin only)
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact submission ID
 *     responses:
 *       200:
 *         description: Contact submission deleted successfully
 *       404:
 *         description: Contact submission not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/submissions/:id", auth, permit("admin"), deleteContactSubmission);

module.exports = router;