// controllers/partnerController.js
const Partner = require("../models/Partner");

// Public - Get all active partners
const getPartners = async (req, res) => {
  try {
    const partners = await Partner.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 });
    
    res.json({
      success: true,
      data: partners
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching partners"
    });
  }
};

// Admin - Create partner
const createPartner = async (req, res) => {
  try {
    const partner = new Partner(req.body);
    await partner.save();
    res.status(201).json({
      success: true,
      data: partner
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating partner"
    });
  }
};

// Admin - Update partner
const updatePartner = async (req, res) => {
  try {
    const updated = await Partner.findByIdAndUpdate(
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
      message: "Error updating partner"
    });
  }
};

// Admin - Delete partner
const deletePartner = async (req, res) => {
  try {
    await Partner.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: "Partner deleted successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error deleting partner"
    });
  }
};

module.exports = {
  getPartners,
  createPartner,
  updatePartner,
  deletePartner
};