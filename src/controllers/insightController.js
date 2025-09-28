const Insight = require("../models/Insight");

// Public
const getInsights = async (req, res) => {
  const insights = await Insight.find();
  res.json(insights);
};

// Admin
const createInsight = async (req, res) => {
  const insight = new Insight(req.body);
  await insight.save();
  res.status(201).json(insight);
};

const updateInsight = async (req, res) => {
  const updated = await Insight.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

const deleteInsight = async (req, res) => {
  await Insight.findByIdAndDelete(req.params.id);
  res.json({ message: "Insight deleted" });
};

module.exports = { getInsights, createInsight, updateInsight, deleteInsight };
