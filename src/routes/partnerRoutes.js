// routes/partnerRoutes.js
const express = require('express');
const router = express.Router();
const {
  getPartners,
  createPartner,
  updatePartner,
  deletePartner
} = require('../controllers/partnerController');

// Public routes
router.get('/', getPartners);

// Admin routes (protect these with auth middleware)
router.post('/', createPartner);
router.put('/:id', updatePartner);
router.delete('/:id', deletePartner);

module.exports = router;