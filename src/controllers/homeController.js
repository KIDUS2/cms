const Product = require("../models/Product");
const Service = require("../models/Service"); // If you have services
const Insight = require("../models/Insight"); // If you have insights/blog
const Card = require("../models/Card");
const Contact = require("../models/Contact");
const Testimonial = require("../models/Testimonial");
const Partner = require("../models/Partner");
const Hero = require("../models/Hero");
const HomeService = require("../models/HomeService");
// @desc    Get homepage data
// @route   GET /api/home
// @access  Public
// controllers/homeController.js
// const Product = require("../models/Product");
// const Insight = require("../models/Insight");
// const Card = require("../models/Card");
// const Testimonial = require("../models/Testimonial");
// const Partner = require("../models/Partner");
// const Hero = require("../models/Hero");
// const HomeService = require("../models/HomeService");

// @desc    Get homepage data
// @route   GET /api/home
// @access  Public
const getHomeData = async (req, res) => {
  try {
    // Fetch data from multiple collections in parallel
    const [
      heroData,
      homeServices,
      featuredProducts,
      recentInsights,
      aboutCards,
      testimonials,
      partners,
      stats
    ] = await Promise.all([
      // Hero section data
      Hero.findOne({
        isActive: true
      })
      .sort({ order: 1 })
      .select('title subtitle description backgroundImage primaryButton secondaryButton'),

      // Home services specifically for home page
      HomeService.find({
        isActive: true
      })
      .sort({ order: 1 })
      .limit(6)
      .select('title description shortDescription subtitle icon features buttonText buttonLink'),

      // Featured products (limit to 4)
      Product.find({ 
        isFeatured: true, 
        isActive: true 
      })
      .sort({ order: 1, createdAt: -1 })
      .limit(4)
      .select('name slug description image category features'),

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

      // Testimonials
      Testimonial.find({
        isActive: true,
        isFeatured: true
      })
      .sort({ order: 1, createdAt: -1 })
      .limit(5)
      .select('clientName position company content rating image'),

      // Partners
      Partner.find({
        isActive: true
      })
      .sort({ order: 1, createdAt: 1 })
      .limit(8)
      .select('name description logo website'),

      // Get some stats (optional)
      getHomepageStats()
    ]);

    // Default hero data in case no hero is found in database
    const defaultHero = {
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
    };

    res.status(200).json({
      success: true,
      message: "Homepage data retrieved successfully",
      data: {
        // Hero section from database or default
        hero: heroData || defaultHero,
        
        // Services We Provide Section - Using HomeService model
        services: {
          title: "Services provide for you",
          subtitle: "Next Core Technologies is a leading provider of enterprise solutions, empowering businesses with innovative software that drives growth and efficiency.",
          description: "Our core service is delivering cutting-edge technology solutions tailored to your business needs.",
          learnMore: {
            text: "Learn More",
            link: "/services"
          },
          items: homeServices.map(service => ({
            id: service._id,
            title: service.title,
            description: service.description,
            shortDescription: service.shortDescription,
            subtitle: service.subtitle,
            icon: service.icon,
            features: service.features || [],
            buttonText: service.buttonText || "Learn More",
            buttonLink: service.buttonLink || "/services"
          }))
        },

        // Partners Section
        partners: {
          title: "Our Partner Companies",
          subtitle: "Trusted by industry leaders",
          items: partners.map(partner => ({
            id: partner._id,
            name: partner.name,
            description: partner.description,
            logo: partner.logo,
            website: partner.website
          }))
        },

        // Testimonials Section
        testimonials: {
          title: "What People Say",
          subtitle: "Hear from our satisfied clients",
          items: testimonials.map(testimonial => ({
            id: testimonial._id,
            clientName: testimonial.clientName,
            position: testimonial.position,
            company: testimonial.company,
            content: testimonial.content,
            rating: testimonial.rating,
            image: testimonial.image
          }))
        },

        featuredProducts: {
          title: "Featured Products",
          subtitle: "Check out our latest creations",
          items: featuredProducts
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
    const [productsCount, homeServicesCount, insightsCount, testimonialsCount, partnersCount] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      HomeService.countDocuments({ isActive: true }),
      Insight.countDocuments({ status: 'published', isActive: true }),
      Testimonial.countDocuments({ isActive: true }),
      Partner.countDocuments({ isActive: true })
    ]);

    return {
      projects: productsCount,
      services: homeServicesCount,
      blogPosts: insightsCount,
      testimonials: testimonialsCount,
      partners: partnersCount,
      happyClients: 50
    };
  } catch (error) {
    console.error("Error getting stats:", error);
    return {
      projects: 0,
      services: 0,
      blogPosts: 0,
      testimonials: 0,
      partners: 0,
      happyClients: 0
    };
  }
};
const getFeaturedData = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        message: "Featured data endpoint"
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching featured data"
    });
  }
};

module.exports = {
  getHomeData,
  getFeaturedData,
  getHomepageStats
};