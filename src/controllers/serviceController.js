const Service = require("../models/Service");

// Public
const getServices = async (req, res) => {
  const services = await Service.find();
  res.json(services);
};

// Admin
const createService = async (req, res) => {
  const service = new Service(req.body);
  await service.save();
  res.status(201).json(service);
};

const updateService = async (req, res) => {
  const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

const deleteService = async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.json({ message: "Service deleted" });
};

module.exports = { getServices, createService, updateService, deleteService };
