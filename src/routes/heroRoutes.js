// routes/heroRoutes.js
const express = require('express');
const router = express.Router();
const {
  getActiveHero,
  getAllHeroes,
  createHero,
  updateHero,
  deleteHero
} = require('../controllers/heroController');

// Public route
router.get('/active', getActiveHero);

// Admin routes (protect these with auth middleware)
router.get('/', getAllHeroes);
router.post('/', createHero);
router.put('/:id', updateHero);
router.delete('/:id', deleteHero);

module.exports = router;