const Contact = require("../models/Contact");

// ========== COMPANY CONTACT METHODS ==========

// @desc    Get company contact information
// @route   GET /api/contacts/company
// @access  Public
const getCompanyContact = async (req, res) => {
  try {
    const companyContact = await Contact.getCompanyInfo();
    
    res.status(200).json({
      success: true,
      data: companyContact.companyInfo
    });
  } catch (error) {
    console.error("Get company contact error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching company contact information"
    });
  }
};

// @desc    Update company contact information
// @route   PUT /api/contacts/company
// @access  Private/Admin
const updateCompanyContact = async (req, res) => {
  try {
    const companyContact = await Contact.findOneAndUpdate(
      { type: 'company' },
      { 
        type: 'company',
        companyInfo: req.body 
      },
      {
        new: true,
        runValidators: true,
        upsert: true
      }
    );

    res.status(200).json({
      success: true,
      message: "Company contact information updated successfully",
      data: companyContact.companyInfo
    });
  } catch (error) {
    console.error("Update company contact error:", error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: "Error updating company contact information"
    });
  }
};

// @desc    Get public company info
// @route   GET /api/contacts/company/public
// @access  Public
const getPublicCompanyInfo = async (req, res) => {
  try {
    const companyContact = await Contact.getPublicCompanyInfo();

    res.status(200).json({
      success: true,
      data: companyContact ? companyContact.companyInfo : {}
    });
  } catch (error) {
    console.error("Get public company info error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching company information"
    });
  }
};

// ========== CONTACT SUBMISSION METHODS ==========

// @desc    Submit contact form
// @route   POST /api/contacts/submit
// @access  Public
const submitContact = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      position,
      subject,
      message,
      serviceInterest,
      budget,
      timeline,
      privacyConsent
    } = req.body;

    // Validate required consent
    if (!privacyConsent) {
      return res.status(400).json({
        success: false,
        message: "Privacy consent is required"
      });
    }

    const contact = await Contact.create({
      type: 'submission',
      submission: {
        name,
        email,
        phone,
        company,
        position,
        subject,
        message,
        serviceInterest: serviceInterest || [],
        budget: budget || 'undecided',
        timeline: timeline || 'flexible',
        privacyConsent
      },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(201).json({
      success: true,
      message: "Thank you for your message! We'll get back to you soon.",
      data: {
        id: contact._id,
        name: contact.submission.name,
        email: contact.submission.email
      }
    });

  } catch (error) {
    console.error("Contact submission error:", error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: "Error submitting contact form"
    });
  }
};

// @desc    Get all contact submissions
// @route   GET /api/contacts/submissions
// @access  Private/Admin
const getContactSubmissions = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const filter = { type: 'submission' };
    if (status) filter.status = status;
    
    const skip = (page - 1) * limit;

    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Contact.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: contacts.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: contacts
    });
  } catch (error) {
    console.error("Get contacts error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching contacts"
    });
  }
};

// @desc    Get contact submission by ID
// @route   GET /api/contacts/submissions/:id
// @access  Private/Admin
const getContactSubmissionById = async (req, res) => {
  try {
    const contact = await Contact.findOne({
      _id: req.params.id,
      type: 'submission'
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact submission not found"
      });
    }

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error("Get contact by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching contact submission"
    });
  }
};

// @desc    Update contact submission
// @route   PUT /api/contacts/submissions/:id
// @access  Private/Admin
const updateContactSubmission = async (req, res) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { 
        _id: req.params.id,
        type: 'submission' 
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact submission not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact submission updated successfully",
      data: contact
    });
  } catch (error) {
    console.error("Update contact error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating contact submission"
    });
  }
};

// @desc    Delete contact submission
// @route   DELETE /api/contacts/submissions/:id
// @access  Private/Admin
const deleteContactSubmission = async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({
      _id: req.params.id,
      type: 'submission'
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact submission not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact submission deleted successfully"
    });
  } catch (error) {
    console.error("Delete contact error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting contact submission"
    });
  }
};

module.exports = {
  // Company methods
  getCompanyContact,
  updateCompanyContact,
  getPublicCompanyInfo,
  
  // Submission methods
  submitContact,
  getContactSubmissions,
  getContactSubmissionById,
  updateContactSubmission,
  deleteContactSubmission
};