// models/Contact.js
const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  company: String,
  phone: String,
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  serviceInterest: [String],
  budget: {
    type: String,
    enum: ['<10k', '10k-50k', '50k-100k', '100k+', 'undecided']
  },
  timeline: {
    type: String,
    enum: ['immediately', '1-3 months', '3-6 months', '6+ months']
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'proposal-sent', 'closed-won', 'closed-lost'],
    default: 'new'
  },
  source: {
    type: String,
    enum: ['website', 'referral', 'social-media', 'email', 'other']
  },
  notes: String,
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model("Contact", contactSchema);