const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema({
  content: { type: String, required: true },
  image: String,
}, { timestamps: true });

module.exports = mongoose.model("About", aboutSchema);
