// controllers/insightController.js
const Insight = require("../models/Insight");

// @desc    Get all published insights with pagination and filtering
// @route   GET /api/insights
// @access  Public
const getInsights = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      tag, 
      featured,
      search 
    } = req.query;

    // Build filter for published insights
    let filter = { isPublished: true };
    
    // Filter by category
    if (category) {
      filter.category = category;
    }
    
    // Filter by tag
    if (tag) {
      filter.tags = { $in: [tag] };
    }
    
    // Filter by featured
    if (featured === 'true') {
      filter.isFeatured = true;
    }
    
    // Search in title and content
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const insights = await Insight.find(filter)
      .populate('author', 'username profile.firstName profile.lastName profile.avatar')
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .select('-content');

    const total = await Insight.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      count: insights.length,
      total,
      totalPages,
      currentPage: pageNum,
      data: insights
    });
  } catch (error) {
    console.error("Get insights error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching insights",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get featured insights
// @route   GET /api/insights/featured
// @access  Public
const getFeaturedInsights = async (req, res) => {
  try {
    const insights = await Insight.find({
      isPublished: true,
      isFeatured: true
    })
    .populate('author', 'username profile.firstName profile.lastName profile.avatar')
    .sort({ publishedAt: -1 })
    .limit(4)
    .select('-content');

    res.status(200).json({
      success: true,
      count: insights.length,
      data: insights
    });
  } catch (error) {
    console.error("Get featured insights error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching featured insights",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get insights by category
// @route   GET /api/insights/category/:category
// @access  Public
const getInsightsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const insights = await Insight.find({
      category,
      isPublished: true
    })
    .populate('author', 'username profile.firstName profile.lastName profile.avatar')
    .sort({ publishedAt: -1 })
    .skip(skip)
    .limit(limitNum)
    .select('-content');

    const total = await Insight.countDocuments({ 
      category, 
      isPublished: true 
    });
    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      count: insights.length,
      total,
      totalPages,
      currentPage: pageNum,
      category,
      data: insights
    });
  } catch (error) {
    console.error("Get insights by category error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching insights by category",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get insight by slug
// @route   GET /api/insights/:slug
// @access  Public
const getInsightBySlug = async (req, res) => {
  try {
    const insight = await Insight.findOne({ 
      slug: req.params.slug 
    })
    .populate('author', 'username profile.firstName profile.lastName profile.avatar');

    if (!insight) {
      return res.status(404).json({
        success: false,
        message: "Insight not found"
      });
    }

    // Increment views
    insight.views += 1;
    await insight.save();

    res.status(200).json({
      success: true,
      data: insight
    });
  } catch (error) {
    console.error("Get insight by slug error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching insight",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Create a new insight
// @route   POST /api/insights
// @access  Private/Admin
const createInsight = async (req, res) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      category,
      tags,
      readTime,
      metaTitle,
      metaDescription,
      isFeatured,
      isPublished
    } = req.body;

    // Check if insight with same slug already exists
    const existingInsight = await Insight.findOne({ slug });
    if (existingInsight) {
      return res.status(400).json({
        success: false,
        message: "Insight with this slug already exists"
      });
    }

    // Calculate read time if not provided
    const calculatedReadTime = readTime || Math.ceil(content.split(/\s+/).length / 200);

    const insight = await Insight.create({
      title,
      slug,
      excerpt,
      content,
      coverImage,
      author: req.user.id,
      category,
      tags: tags || [],
      readTime: calculatedReadTime,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt,
      isFeatured: isFeatured || false,
      isPublished: isPublished || false,
      ...(isPublished && { publishedAt: new Date() })
    });

    // Populate author info in response
    await insight.populate('author', 'username profile.firstName profile.lastName profile.avatar');

    res.status(201).json({
      success: true,
      message: "Insight created successfully",
      data: insight
    });
  } catch (error) {
    console.error("Create insight error:", error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Insight with this slug already exists"
      });
    }

    res.status(500).json({
      success: false,
      message: "Error creating insight",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update an insight
// @route   PUT /api/insights/:id
// @access  Private/Admin
const updateInsight = async (req, res) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      category,
      tags,
      readTime,
      metaTitle,
      metaDescription,
      isFeatured,
      isPublished
    } = req.body;

    // Check if slug is being updated and if it already exists
    if (slug) {
      const existingInsight = await Insight.findOne({ 
        slug, 
        _id: { $ne: req.params.id } 
      });
      
      if (existingInsight) {
        return res.status(400).json({
          success: false,
          message: "Insight with this slug already exists"
        });
      }
    }

    // Calculate read time if content is updated
    let calculatedReadTime = readTime;
    if (content && !readTime) {
      calculatedReadTime = Math.ceil(content.split(/\s+/).length / 200);
    }

    const updateData = {
      ...(title && { title }),
      ...(slug && { slug }),
      ...(excerpt && { excerpt }),
      ...(content && { content }),
      ...(coverImage !== undefined && { coverImage }),
      ...(category && { category }),
      ...(tags !== undefined && { tags }),
      ...(calculatedReadTime && { readTime: calculatedReadTime }),
      ...(metaTitle !== undefined && { metaTitle }),
      ...(metaDescription !== undefined && { metaDescription }),
      ...(isFeatured !== undefined && { isFeatured }),
      ...(isPublished !== undefined && { 
        isPublished,
        ...(isPublished && { publishedAt: new Date() })
      })
    };

    const insight = await Insight.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).populate('author', 'username profile.firstName profile.lastName profile.avatar');

    if (!insight) {
      return res.status(404).json({
        success: false,
        message: "Insight not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Insight updated successfully",
      data: insight
    });
  } catch (error) {
    console.error("Update insight error:", error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Insight with this slug already exists"
      });
    }

    res.status(500).json({
      success: false,
      message: "Error updating insight",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete an insight
// @route   DELETE /api/insights/:id
// @access  Private/Admin
const deleteInsight = async (req, res) => {
  try {
    const insight = await Insight.findByIdAndDelete(req.params.id);

    if (!insight) {
      return res.status(404).json({
        success: false,
        message: "Insight not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Insight deleted successfully"
    });
  } catch (error) {
    console.error("Delete insight error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting insight",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Toggle insight published status
// @route   PATCH /api/insights/:id/publish
// @access  Private/Admin
const togglePublishStatus = async (req, res) => {
  try {
    const insight = await Insight.findById(req.params.id);

    if (!insight) {
      return res.status(404).json({
        success: false,
        message: "Insight not found"
      });
    }

    insight.isPublished = !insight.isPublished;
    
    // Set publishedAt when publishing
    if (insight.isPublished && !insight.publishedAt) {
      insight.publishedAt = new Date();
    }

    await insight.save();
    await insight.populate('author', 'username profile.firstName profile.lastName profile.avatar');

    res.status(200).json({
      success: true,
      message: `Insight ${insight.isPublished ? 'published' : 'unpublished'} successfully`,
      data: insight
    });
  } catch (error) {
    console.error("Toggle publish status error:", error);
    res.status(500).json({
      success: false,
      message: "Error toggling publish status",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get popular insights (most viewed)
// @route   GET /api/insights/popular
// @access  Public
const getPopularInsights = async (req, res) => {
  try {
    const insights = await Insight.find({
      isPublished: true
    })
    .populate('author', 'username profile.firstName profile.lastName profile.avatar')
    .sort({ views: -1, publishedAt: -1 })
    .limit(5)
    .select('-content');

    res.status(200).json({
      success: true,
      count: insights.length,
      data: insights
    });
  } catch (error) {
    console.error("Get popular insights error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching popular insights",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get insights by tag
// @route   GET /api/insights/tag/:tag
// @access  Public
const getInsightsByTag = async (req, res) => {
  try {
    const { tag } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const insights = await Insight.find({
      tags: { $in: [tag] },
      isPublished: true
    })
    .populate('author', 'username profile.firstName profile.lastName profile.avatar')
    .sort({ publishedAt: -1 })
    .skip(skip)
    .limit(limitNum)
    .select('-content');

    const total = await Insight.countDocuments({ 
      tags: { $in: [tag] },
      isPublished: true 
    });
    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      count: insights.length,
      total,
      totalPages,
      currentPage: pageNum,
      tag,
      data: insights
    });
  } catch (error) {
    console.error("Get insights by tag error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching insights by tag",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getInsights,
  getFeaturedInsights,
  getInsightsByCategory,
  getInsightBySlug,
  createInsight,
  updateInsight,
  deleteInsight,
  togglePublishStatus,
  getPopularInsights,
  getInsightsByTag
};