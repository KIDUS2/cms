// controllers/heroController.js
const Hero = require("../models/Hero");

// Public - Get active hero section
const getActiveHero = async (req, res) => {
  try {
    const hero = await Hero.findOne({ isActive: true })
      .sort({ order: 1 })
      .select('title subtitle description backgroundImage primaryButton secondaryButton');
    
    res.json({
      success: true,
      data: hero
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching hero section"
    });
  }
};

// Admin - Get all hero sections
const getAllHeroes = async (req, res) => {
  try {
    const heroes = await Hero.find().sort({ order: 1 });
    
    res.json({
      success: true,
      data: heroes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching hero sections"
    });
  }
};

// Admin - Create hero section
const createHero = async (req, res) => {
  try {
    const hero = new Hero(req.body);
    await hero.save();
    res.status(201).json({
      success: true,
      data: hero
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating hero section"
    });
  }
};

// Admin - Update hero section
const updateHero = async (req, res) => {
  try {
    const updated = await Hero.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating hero section"
    });
  }
};

// Admin - Delete hero section
const deleteHero = async (req, res) => {
  try {
    await Hero.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: "Hero section deleted successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error deleting hero section"
    });
  }
};

module.exports = {
  getActiveHero,
  getAllHeroes,
  createHero,
  updateHero,
  deleteHero
};