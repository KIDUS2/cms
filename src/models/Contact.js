const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  // Type: 'company' for company info, 'submission' for contact form submissions
  type: {
    type: String,
    required: true,
    enum: ['company', 'submission'],
    default: 'submission'
  },

  // ========== COMPANY INFORMATION (type: 'company') ==========
  companyInfo: {
    companyName: {
      type: String,
      trim: true
    },
    tagline: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    },
    alternatePhone: {
      type: String,
      trim: true
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    fullAddress: {
      type: String,
      trim: true
    },
    socialMedia: {
      website: String,
      linkedin: String,
      twitter: String,
      github: String,
      facebook: String,
      instagram: String
    },
    businessHours: {
      monday: { type: String, default: "9:00 AM - 6:00 PM" },
      tuesday: { type: String, default: "9:00 AM - 6:00 PM" },
      wednesday: { type: String, default: "9:00 AM - 6:00 PM" },
      thursday: { type: String, default: "9:00 AM - 6:00 PM" },
      friday: { type: String, default: "9:00 AM - 6:00 PM" },
      saturday: { type: String, default: "Closed" },
      sunday: { type: String, default: "Closed" }
    },
    whatsappNumber: String,
    skypeId: String,
    googleMapsLink: String,
    isActive: {
      type: Boolean,
      default: true
    }
  },

  // ========== CONTACT SUBMISSION (type: 'submission') ==========
  submission: {
    // Personal Information
    name: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    },
    company: {
      type: String,
      trim: true
    },
    position: {
      type: String,
      trim: true
    },

    // Project Details
    subject: {
      type: String,
      trim: true
    },
    message: {
      type: String,
      trim: true
    },

    // Service Interests
    serviceInterest: [{
      type: String,
      enum: [
        'web-development',
        'mobile-app-development',
        'ecommerce-solutions',
        'ui-ux-design',
        'digital-marketing',
        'seo-optimization',
        'custom-software',
        'consultation',
        'maintenance-support',
        'other'
      ]
    }],

    // Project Requirements
    budget: {
      type: String,
      enum: [
        '<$5k', 
        '$5k-$10k', 
        '$10k-$25k', 
        '$25k-$50k', 
        '$50k-$100k', 
        '$100k+', 
        'undecided'
      ],
      default: 'undecided'
    },
    timeline: {
      type: String,
      enum: [
        'immediately', 
        '2-4 weeks', 
        '1-3 months', 
        '3-6 months', 
        '6+ months', 
        'flexible'
      ],
      default: 'flexible'
    },

    // Consent
    privacyConsent: {
      type: Boolean,
      default: false
    }
  },

  // ========== COMMON FIELDS ==========
  // Lead Management (for submissions)
  status: {
    type: String,
    enum: [
      'new',
      'contacted',
      'under-review',
      'proposal-sent',
      'approved',
      'closed-won',
      'closed-lost'
    ],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  source: {
    type: String,
    enum: [
      'website-form',
      'referral',
      'social-media',
      'email-campaign',
      'other'
    ],
    default: 'website-form'
  },

  // Internal Management
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: String,

  // Metadata
  ipAddress: String,
  userAgent: String
}, { 
  timestamps: true 
});

// Indexes
contactSchema.index({ type: 1 });
contactSchema.index({ type: 1, 'companyInfo.isActive': 1 });
contactSchema.index({ type: 1, status: 1 });
contactSchema.index({ type: 1, createdAt: -1 });

// Static method to get company information
contactSchema.statics.getCompanyInfo = function() {
  return this.findOneAndUpdate(
    { type: 'company' },
    { type: 'company' },
    { 
      upsert: true, 
      new: true, 
      setDefaultsOnInsert: true 
    }
  );
};

// Static method to get active company info for public
contactSchema.statics.getPublicCompanyInfo = function() {
  return this.findOne(
    { 
      type: 'company',
      'companyInfo.isActive': true 
    },
    { 
      'companyInfo.companyName': 1,
      'companyInfo.email': 1,
      'companyInfo.phone': 1,
      'companyInfo.address': 1,
      'companyInfo.fullAddress': 1,
      'companyInfo.socialMedia': 1,
      'companyInfo.businessHours': 1
    }
  );
};

// Method to check if document is company type
contactSchema.methods.isCompany = function() {
  return this.type === 'company';
};

// Method to check if document is submission type
contactSchema.methods.isSubmission = function() {
  return this.type === 'submission';
};

module.exports = mongoose.model("Contact", contactSchema);