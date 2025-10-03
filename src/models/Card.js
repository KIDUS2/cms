const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  // Basic identification
  type: {
    type: String,
    required: true,
    enum: ["about", "service", "product", "insight", "team"],
    default: "about"
  },
  
  // Core content
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
  
  // Visual elements
  image: {
    type: String,
    default: ""
  },
  icon: {
    type: String,
    default: ""
  },
  
  // Additional content
  features: [{
    type: String,
    trim: true
  }],
  buttonText: {
    type: String,
    default: "Learn More"
  },
  buttonLink: {
    type: String,
    default: "#"
  },
  
  // Meta fields
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Optional: For service-specific fields
  price: {
    type: String,
    default: ""
  },
  duration: {
    type: String,
    default: ""
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Indexes for better performance
cardSchema.index({ type: 1, order: 1 });
cardSchema.index({ type: 1, isActive: 1, order: 1 });
cardSchema.index({ tags: 1 });

module.exports = mongoose.model("Card", cardSchema);