// controllers/productController.js
const Product = require("../models/Product");

// @desc    Get all active products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, featured, active } = req.query;
    
    console.log("Query parameters:", { category, featured, active });
    
    // Build filter - temporarily remove isActive filter for debugging
    let filter = {};
    
    // Only filter by active if explicitly requested
    if (active === 'true' || active === 'false') {
      filter.isActive = active === 'true';
    }
    // If active is not specified, don't filter by it
    
    if (category) {
      filter.category = category;
    }
    
    if (featured === 'true') {
      filter.isFeatured = true;
    }
    
    console.log("Final filter:", filter);
    
    const products = await Product.find(filter)
      .sort({ order: 1, createdAt: -1 });

    console.log("Products found:", products.length);
    console.log("Products:", products);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isFeatured: true,
      isActive: true
    })
    .sort({ order: 1, createdAt: -1 })
    .limit(6); // Limit to 6 featured products

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error("Get featured products error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching featured products",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get product by slug
// @route   GET /api/products/:slug
// @access  Public
const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ 
      slug: req.params.slug,
      isActive: true 
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error("Get product by slug error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      fullDescription,
      category,
      images,
      logo,
      features,
      technologies,
      demoUrl,
      liveUrl,
      githubUrl,
      client,
      metaTitle,
      metaDescription,
      isFeatured,
      order
    } = req.body;

    // Check if product with same slug already exists
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Product with this slug already exists"
      });
    }

    const product = await Product.create({
      name,
      slug,
      description,
      fullDescription,
      category,
      images: images || [],
      logo,
      features: features || [],
      technologies: technologies || [],
      demoUrl,
      liveUrl,
      githubUrl,
      client: client || {},
      metaTitle,
      metaDescription,
      isFeatured: isFeatured || false,
      order: order || 0
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product
    });
  } catch (error) {
    console.error("Create product error:", error);
    
    // Mongoose validation error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    // Duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Product with this slug already exists"
      });
    }

    res.status(500).json({
      success: false,
      message: "Error creating product",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      fullDescription,
      category,
      images,
      logo,
      features,
      technologies,
      demoUrl,
      liveUrl,
      githubUrl,
      client,
      metaTitle,
      metaDescription,
      isFeatured,
      isActive,
      status,
      order
    } = req.body;

    // Check if slug is being updated and if it already exists
    if (slug) {
      const existingProduct = await Product.findOne({ 
        slug, 
        _id: { $ne: req.params.id } 
      });
      
      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: "Product with this slug already exists"
        });
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description && { description }),
        ...(fullDescription !== undefined && { fullDescription }),
        ...(category && { category }),
        ...(images !== undefined && { images }),
        ...(logo !== undefined && { logo }),
        ...(features !== undefined && { features }),
        ...(technologies !== undefined && { technologies }),
        ...(demoUrl !== undefined && { demoUrl }),
        ...(liveUrl !== undefined && { liveUrl }),
        ...(githubUrl !== undefined && { githubUrl }),
        ...(client !== undefined && { client }),
        ...(metaTitle !== undefined && { metaTitle }),
        ...(metaDescription !== undefined && { metaDescription }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(isActive !== undefined && { isActive }),
        ...(status && { status }),
        ...(order !== undefined && { order })
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product
    });
  } catch (error) {
    console.error("Update product error:", error);
    
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
        message: "Product with this slug already exists"
      });
    }

    res.status(500).json({
      success: false,
      message: "Error updating product",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Toggle product featured status
// @route   PATCH /api/products/:id/featured
// @access  Private/Admin
const toggleFeatured = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    product.isFeatured = !product.isFeatured;
    await product.save();

    res.status(200).json({
      success: true,
      message: `Product ${product.isFeatured ? 'added to' : 'removed from'} featured`,
      data: product
    });
  } catch (error) {
    console.error("Toggle featured error:", error);
    res.status(500).json({
      success: false,
      message: "Error toggling featured status",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const products = await Product.find({
      category,
      isActive: true
    }).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error("Get products by category error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching products by category",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getProducts,
  getFeaturedProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleFeatured,
  getProductsByCategory
};