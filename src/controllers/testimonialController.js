// controllers/testimonialController.js
const Testimonial = require("../models/Testimonial");

// Public - Get all active testimonials
const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 });
    
    res.json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching testimonials"
    });
  }
};

// Public - Get featured testimonials
const getFeaturedTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ 
      isActive: true, 
      isFeatured: true 
    })
    .sort({ order: 1 })
    .limit(6);
    
    res.json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching featured testimonials"
    });
  }
};

// Admin - Create testimonial
const createTestimonial = async (req, res) => {
  try {
    const testimonial = new Testimonial(req.body);
    await testimonial.save();
    res.status(201).json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating testimonial"
    });
  }
};

// Admin - Update testimonial
const updateTestimonial = async (req, res) => {
  try {
    const updated = await Testimonial.findByIdAndUpdate(
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
      message: "Error updating testimonial"
    });
  }
};

// Admin - Delete testimonial
const deleteTestimonial = async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: "Testimonial deleted successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error deleting testimonial"
    });
  }
};

module.exports = {
  getTestimonials,
  getFeaturedTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
};