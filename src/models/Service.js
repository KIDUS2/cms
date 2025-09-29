// models/Service.js
const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  fullDescription: {
    type: String,
    required: true
  },
  icon: String,
  coverImage: String,
  features: [{
    title: String,
    description: String,
    icon: String
  }],
  process: [{
    step: Number,
    title: String,
    description: String
  }],
  technologies: [String],
  caseStudies: [{
    title: String,
    description: String,
    result: String
  }],
  metaTitle: String,
  metaDescription: String,
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("Service", serviceSchema);