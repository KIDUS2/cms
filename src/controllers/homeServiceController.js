// controllers/homeServiceController.js
const HomeService = require("../models/HomeService");

// Public - Get all active home services
const getHomeServices = async (req, res) => {
  try {
    const services = await HomeService.find({ isActive: true })
      .sort({ order: 1 });
    
    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching home services"
    });
  }
};

// Admin - Create home service
const createHomeService = async (req, res) => {
  try {
    const service = new HomeService(req.body);
    await service.save();
    res.status(201).json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating home service"
    });
  }
};

// Admin - Update home service
const updateHomeService = async (req, res) => {
  try {
    const updated = await HomeService.findByIdAndUpdate(
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
      message: "Error updating home service"
    });
  }
};

// Admin - Delete home service
const deleteHomeService = async (req, res) => {
  try {
    await HomeService.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: "Home service deleted successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error deleting home service"
    });
  }
};

module.exports = {
  getHomeServices,
  createHomeService,
  updateHomeService,
  deleteHomeService
};