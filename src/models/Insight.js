const mongoose = require("mongoose");

const insightSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  excerpt: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  coverImage: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['technology', 'business', 'development', 'design', 'news'],
    required: true
  },
  tags: [String],
  readTime: Number,
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: Date,
  metaTitle: String,
  metaDescription: String,
  isFeatured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Insight", insightSchema);