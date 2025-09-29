const About = require("../models/About");

const getAbout = async (req, res) => {
  try {
    const about = await About.findOne();
    if (!about) {
      return res.status(404).json({ 
        success: false,
        message: "About content not found" 
      });
    }
    res.json({
      success: true,
      data: about
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: error.message 
    });
  }
};

const updateAbout = async (req, res) => {
  try {
    const {
      // Existing fields
      content,
      image,
      
      // New fields
      heroTitle,
      heroSubtitle,
      heroImage,
      mission,
      vision,
      story,
      companyName,
      tagline,
      foundedYear,
      employeesCount,
      clientsCount,
      projectsCompleted,
      values,
      teamDescription,
      teamImage,
      achievements,
      ctaTitle,
      ctaDescription,
      ctaButtonText,
      ctaButtonLink,
      metaTitle,
      metaDescription,
      keywords
    } = req.body;

    const updateData = {
      // Update existing fields if provided
      ...(content !== undefined && { content }),
      ...(image !== undefined && { image }),
      
      // New fields
      ...(heroTitle !== undefined && { heroTitle }),
      ...(heroSubtitle !== undefined && { heroSubtitle }),
      ...(heroImage !== undefined && { heroImage }),
      ...(mission !== undefined && { mission }),
      ...(vision !== undefined && { vision }),
      ...(story !== undefined && { story }),
      ...(companyName !== undefined && { companyName }),
      ...(tagline !== undefined && { tagline }),
      ...(foundedYear !== undefined && { foundedYear }),
      ...(employeesCount !== undefined && { employeesCount }),
      ...(clientsCount !== undefined && { clientsCount }),
      ...(projectsCompleted !== undefined && { projectsCompleted }),
      ...(values !== undefined && { values }),
      ...(teamDescription !== undefined && { teamDescription }),
      ...(teamImage !== undefined && { teamImage }),
      ...(achievements !== undefined && { achievements }),
      ...(ctaTitle !== undefined && { ctaTitle }),
      ...(ctaDescription !== undefined && { ctaDescription }),
      ...(ctaButtonText !== undefined && { ctaButtonText }),
      ...(ctaButtonLink !== undefined && { ctaButtonLink }),
      ...(metaTitle !== undefined && { metaTitle }),
      ...(metaDescription !== undefined && { metaDescription }),
      ...(keywords !== undefined && { keywords })
    };

    // Using upsert: true will create if doesn't exist, update if it does
    const about = await About.findOneAndUpdate(
      {}, 
      updateData, 
      { 
        new: true, 
        upsert: true,
        runValidators: true 
      }
    );

    res.json({
      success: true,
      message: "About content updated successfully",
      data: about
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error updating about content",
      error: error.message 
    });
  }
};

module.exports = { getAbout, updateAbout };