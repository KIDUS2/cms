const express = require("express");
const router = express.Router();
const Card = require("../models/Card");

/**
 * @swagger
 * components:
 *   schemas:
 *     Card:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - type
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the card
 *         type:
 *           type: string
 *           enum: [about, service, product, insight, team, home]
 *           description: The category of the card
 *         title:
 *           type: string
 *           description: The card title
 *         description:
 *           type: string
 *           description: The card description
 *         shortDescription:
 *           type: string
 *           description: Short version of description
 *         image:
 *           type: string
 *           description: URL of the card image
 *         icon:
 *           type: string
 *           description: Icon name or URL
 *         features:
 *           type: array
 *           items:
 *             type: string
 *           description: List of features or bullet points
 *         buttonText:
 *           type: string
 *           description: Text for the action button
 *         buttonLink:
 *           type: string
 *           description: URL for the action button
 *         order:
 *           type: number
 *           description: Display order of the card
 *         isActive:
 *           type: boolean
 *           description: Whether the card is active
 *         price:
 *           type: string
 *           description: Price information
 *         duration:
 *           type: string
 *           description: Service duration
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Additional tags for filtering
 *         section:
 *           type: string
 *           enum: [hero, features, stats, testimonials, cta]
 *           description: Home page section for home type cards
 *       example:
 *         type: "service"
 *         title: "Mobile App Development"
 *         description: "Native and cross-platform mobile applications"
 *         shortDescription: "Build powerful mobile experiences"
 *         icon: "mobile"
 *         features: ["iOS Development", "Android Development", "React Native", "Flutter"]
 *         buttonText: "Learn More"
 *         buttonLink: "/services/mobile-development"
 *         order: 2
 *         isActive: true
 */

/**
 * @swagger
 * /api/cards:
 *   post:
 *     summary: Create a new card
 *     tags: [Cards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Card'
 *     responses:
 *       201:
 *         description: Card created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 */
router.post("/", async (req, res) => {
  try {
    const card = new Card(req.body);
    const savedCard = await card.save();
    res.status(201).json(savedCard);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/cards:
 *   get:
 *     summary: Get all cards with filtering
 *     tags: [Cards]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [about, service, product, insight, team, home]
 *         description: Filter cards by type
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Filter by tags (comma separated)
 *       - in: query
 *         name: section
 *         schema:
 *           type: string
 *           enum: [hero, features, stats, testimonials, cta]
 *         description: Filter home cards by section
 *     responses:
 *       200:
 *         description: List of cards
 */
router.get("/", async (req, res) => {
  try {
    const { type, isActive, tags, section } = req.query;
    const filter = {};
    
    if (type) filter.type = type;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (tags) filter.tags = { $in: tags.split(',') };
    if (section) filter.section = section;
    
    const cards = await Card.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/cards/home:
 *   get:
 *     summary: Get all active home page cards
 *     tags: [Cards]
 *     parameters:
 *       - in: query
 *         name: section
 *         schema:
 *           type: string
 *           enum: [hero, features, stats, testimonials, cta]
 *         description: Filter by home page section
 *     responses:
 *       200:
 *         description: List of home page cards
 */
router.get("/home", async (req, res) => {
  try {
    const { section } = req.query;
    const filter = { 
      type: "home", 
      isActive: true 
    };
    
    if (section) filter.section = section;
    
    const homeCards = await Card.find(filter).sort({ order: 1 });
    res.json(homeCards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/cards/home/hero:
 *   get:
 *     summary: Get hero section cards for home page
 *     tags: [Cards]
 *     responses:
 *       200:
 *         description: List of hero section cards
 */
router.get("/home/hero", async (req, res) => {
  try {
    const heroCards = await Card.find({ 
      type: "home", 
      section: "hero",
      isActive: true 
    }).sort({ order: 1 });
    res.json(heroCards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/cards/home/features:
 *   get:
 *     summary: Get features section cards for home page
 *     tags: [Cards]
 *     responses:
 *       200:
 *         description: List of features section cards
 */
router.get("/home/features", async (req, res) => {
  try {
    const featureCards = await Card.find({ 
      type: "home", 
      section: "features",
      isActive: true 
    }).sort({ order: 1 });
    res.json(featureCards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/cards/home/stats:
 *   get:
 *     summary: Get stats section cards for home page
 *     tags: [Cards]
 *     responses:
 *       200:
 *         description: List of stats section cards
 */
router.get("/home/stats", async (req, res) => {
  try {
    const statsCards = await Card.find({ 
      type: "home", 
      section: "stats",
      isActive: true 
    }).sort({ order: 1 });
    res.json(statsCards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/cards/home/testimonials:
 *   get:
 *     summary: Get testimonials section cards for home page
 *     tags: [Cards]
 *     responses:
 *       200:
 *         description: List of testimonials section cards
 */
router.get("/home/testimonials", async (req, res) => {
  try {
    const testimonialCards = await Card.find({ 
      type: "home", 
      section: "testimonials",
      isActive: true 
    }).sort({ order: 1 });
    res.json(testimonialCards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/cards/home/cta:
 *   get:
 *     summary: Get call-to-action section cards for home page
 *     tags: [Cards]
 *     responses:
 *       200:
 *         description: List of CTA section cards
 */
router.get("/home/cta", async (req, res) => {
  try {
    const ctaCards = await Card.find({ 
      type: "home", 
      section: "cta",
      isActive: true 
    }).sort({ order: 1 });
    res.json(ctaCards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/cards/service:
 *   get:
 *     summary: Get all active service cards
 *     tags: [Cards]
 *     responses:
 *       200:
 *         description: List of service cards
 */
router.get("/service", async (req, res) => {
  try {
    const serviceCards = await Card.find({ 
      type: "service", 
      isActive: true 
    }).sort({ order: 1 });
    res.json(serviceCards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/cards/about:
 *   get:
 *     summary: Get all active about cards
 *     tags: [Cards]
 *     responses:
 *       200:
 *         description: List of about cards
 */
router.get("/about", async (req, res) => {
  try {
    const aboutCards = await Card.find({ 
      type: "about", 
      isActive: true 
    }).sort({ order: 1 });
    res.json(aboutCards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/cards/type/{type}:
 *   get:
 *     summary: Get cards by type
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: Card type
 *     responses:
 *       200:
 *         description: List of cards by type
 */
router.get("/type/:type", async (req, res) => {
  try {
    const cards = await Card.find({ 
      type: req.params.type,
      isActive: true
    }).sort({ order: 1 });
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/cards/{id}:
 *   get:
 *     summary: Get a card by ID
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Card data
 */
router.get("/:id", async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: "Card not found" });
    res.json(card);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/cards/{id}:
 *   put:
 *     summary: Update a card
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Card'
 *     responses:
 *       200:
 *         description: Card updated
 */
router.put("/:id", async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!card) return res.status(404).json({ message: "Card not found" });
    res.json(card);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/cards/{id}:
 *   delete:
 *     summary: Delete a card
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Card deleted
 */
router.delete("/:id", async (req, res) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.id);
    if (!card) return res.status(404).json({ message: "Card not found" });
    res.json({ message: "Card deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;