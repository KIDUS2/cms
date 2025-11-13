// models/Hero.js
const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  backgroundImage: {
    type: String // URL for hero background image
  },
  primaryButton: {
    text: {
      type: String,
      default: "Get Started"
    },
    link: {
      type: String,
      default: "/contact"
    }
  },
  secondaryButton: {
    text: {
      type: String,
      default: "View Our Work"
    },
    link: {
      type: String,
      default: "/portfolio"
    }
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

module.exports = mongoose.model('Hero', heroSchema);