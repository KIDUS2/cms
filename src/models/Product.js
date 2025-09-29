// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
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
  fullDescription: String,
  category: {
    type: String,
    enum: ['software', 'mobile-app', 'web-app', 'custom-solution'],
    required: true
  },
  images: [String],
  logo: String,
  features: [{
    title: String,
    description: String
  }],
  technologies: [String],
  demoUrl: String,
  liveUrl: String,
  githubUrl: String,
  status: {
    type: String,
    enum: ['active', 'development', 'maintenance', 'archived'],
    default: 'active'
  },
  client: {
    name: String,
    industry: String,
    website: String
  },
  metaTitle: String,
  metaDescription: String,
  isFeatured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);