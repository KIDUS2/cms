const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  image: String,
  link: String,
}, { timestamps: true });

module.exports = mongoose.model("Card", cardSchema);
