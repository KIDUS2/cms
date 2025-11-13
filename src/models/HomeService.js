// models/HomeService.js
const mongoose = require('mongoose');

const homeServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    trim: true
  },
  subtitle: {
    type: String, // For "Android and iOS" in mobile development
    trim: true
  },
  icon: {
    type: String // URL or icon name
  },
  features: [{
    type: String
  }],
  buttonText: {
    type: String,
    default: 'Learn More'
  },
  buttonLink: {
    type: String,
    default: '/services'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('HomeService', homeServiceSchema);