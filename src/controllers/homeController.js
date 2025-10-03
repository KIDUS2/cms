const Product = require("../models/Product");
const Service = require("../models/Service"); // If you have services
const Insight = require("../models/Insight"); // If you have insights/blog
const Card = require("../models/Card");
const Contact = require("../models/Contact");

// @desc    Get homepage data
// @route   GET /api/home
// @access  Public
const getHomeData = async (req, res) => {
  try {
    // Fetch data from multiple collections in parallel
    const [
      featuredProducts,
      featuredServices,
      recentInsights,
      aboutCards,
      serviceCards,
      stats
    ] = await Promise.all([
      // Featured products (limit to 4)
      Product.find({ 
        isFeatured: true, 
        isActive: true 
      })
      .sort({ order: 1, createdAt: -1 })
      .limit(4)
      .select('name slug description image category features'),

      // Featured services (limit to 6)
      Card.find({
        type: 'service',
        isActive: true,
        isFeatured: true
      })
      .sort({ order: 1 })
      .limit(6)
      .select('title description shortDescription icon features buttonText buttonLink'),

      // Recent insights/blog posts (limit to 3)
      Insight.find({ 
        status: 'published',
        isActive: true 
      })
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(3)
      .select('title slug excerpt image publishedAt readingTime'),

      // About section cards
      Card.find({
        type: 'about',
        isActive: true
      })
      .sort({ order: 1 })
      .limit(4)
      .select('title description shortDescription icon features'),

      // Service cards for services section
      Card.find({
        type: 'service',
        isActive: true
      })
      .sort({ order: 1 })
      .limit(8)
      .select('title description shortDescription icon features buttonText buttonLink order'),

      // Get some stats (optional)
      getHomepageStats()
    ]);

    res.status(200).json({
      success: true,
      message: "Homepage data retrieved successfully",
      data: {
        hero: {
          title: "Welcome to Our Platform",
          subtitle: "Building amazing digital experiences",
          description: "We create innovative solutions that drive business growth and deliver exceptional user experiences.",
          primaryButton: {
            text: "Get Started",
            link: "/contact"
          },
          secondaryButton: {
            text: "View Our Work",
            link: "/portfolio"
          }
        },
        featuredProducts: {
          title: "Featured Products",
          subtitle: "Check out our latest creations",
          items: featuredProducts
        },
        services: {
          title: "Our Services",
          subtitle: "What we can do for you",
          items: featuredServices,
          allServices: serviceCards
        },
        about: {
          title: "About Us",
          subtitle: "Why choose our platform",
          items: aboutCards
        },
        insights: {
          title: "Latest Insights",
          subtitle: "News and updates from our blog",
          items: recentInsights
        },
        stats: stats,
        cta: {
          title: "Ready to Start Your Project?",
          description: "Let's work together to bring your ideas to life",
          buttonText: "Contact Us",
          buttonLink: "/contact"
        }
      }
    });

  } catch (error) {
    console.error("Get home data error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching homepage data",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Helper function to get homepage stats
const getHomepageStats = async () => {
  try {
    const [productsCount, servicesCount, insightsCount] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Card.countDocuments({ type: 'service', isActive: true }),
      Insight.countDocuments({ status: 'published', isActive: true })
    ]);

    return {
      projects: productsCount,
      services: servicesCount,
      blogPosts: insightsCount,
      happyClients: 50 // You can make this dynamic if you have a clients collection
    };
  } catch (error) {
    console.error("Error getting stats:", error);
    return {
      projects: 0,
      services: 0,
      blogPosts: 0,
      happyClients: 0
    };
  }
};

// @desc    Get homepage featured sections only
// @route   GET /api/home/featured
// @access  Public
const getFeaturedData = async (req, res) => {
  try {
    const [products, services, insights] = await Promise.all([
      Product.find({ 
        isFeatured: true, 
        isActive: true 
      })
      .sort({ order: 1 })
      .limit(3)
      .select('name slug description image category'),

      Card.find({
        type: 'service',
        isActive: true,
        isFeatured: true
      })
      .sort({ order: 1 })
      .limit(3)
      .select('title description icon buttonText buttonLink'),

      Insight.find({ 
        status: 'published',
        isActive: true,
        isFeatured: true 
      })
      .sort({ publishedAt: -1 })
      .limit(3)
      .select('title slug excerpt image publishedAt')
    ]);

    res.status(200).json({
      success: true,
      data: {
        featuredProducts: products,
        featuredServices: services,
        featuredInsights: insights
      }
    });

  } catch (error) {
    console.error("Get featured data error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching featured data"
    });
  }
};

// @desc    Get homepage stats only
// @route   GET /api/home/stats
// @access  Public
const getHomeStats = async (req, res) => {
  try {
    const stats = await getHomepageStats();
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error("Get home stats error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching homepage statistics"
    });
  }
};

module.exports = {
  getHomeData,
  getFeaturedData,
  getHomeStats
};