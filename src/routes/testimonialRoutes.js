// routes/testimonialRoutes.js
const express = require('express');
const router = express.Router();
const {
  getTestimonials,
  getFeaturedTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} = require('../controllers/testimonialController');

// Public routes
router.get('/', getTestimonials);
router.get('/featured', getFeaturedTestimonials);

// Admin routes (protect these with auth middleware)
router.post('/', createTestimonial);
router.put('/:id', updateTestimonial);
router.delete('/:id', deleteTestimonial);

module.exports = router;