const mongoose = require("mongoose");

const insightSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: String,
  author: String,
}, { timestamps: true });

module.exports = mongoose.model("Insight", insightSchema);
