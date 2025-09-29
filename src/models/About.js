const mongoose = require("mongoose");

const valueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String
  }
});

const achievementSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  suffix: {
    type: String,
    default: ""
  }
});

const aboutSchema = new mongoose.Schema({
  // Keep your existing fields for backward compatibility
  content: { 
    type: String, 
    required: true 
  },
  image: String,

  // New comprehensive fields for tech company
  // Hero Section
  heroTitle: {
    type: String,
    default: "About Our Company"
  },
  heroSubtitle: {
    type: String,
    default: "Leading the way in technology innovation"
  },
  heroImage: String,

  // Main Content
  mission: String,
  vision: String,
  story: String,

  // Company Information
  companyName: String,
  tagline: String,
  foundedYear: Number,
  employeesCount: Number,
  clientsCount: Number,
  projectsCompleted: Number,

  // Company Values
  values: [valueSchema],

  // Team Section
  teamDescription: String,
  teamImage: String,

  // Achievements/Counter Section
  achievements: [achievementSchema],

  // Call to Action Section
  ctaTitle: {
    type: String,
    default: "Ready to work with us?"
  },
  ctaDescription: {
    type: String,
    default: "Let's build something amazing together"
  },
  ctaButtonText: {
    type: String,
    default: "Get Started"
  },
  ctaButtonLink: {
    type: String,
    default: "/contact"
  },

  // SEO Fields
  metaTitle: String,
  metaDescription: String,
  keywords: [String]

}, { 
  timestamps: true 
});

module.exports = mongoose.model("About", aboutSchema);