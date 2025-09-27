const express = require("express");
const Post = require("../models/Post");
const { auth, permit } = require("../middleware/auth");
const router = express.Router();

// Create Post
router.post("/", auth, async (req, res) => {
  try {
    const { title, content, categories, tags, status, image } = req.body;
    const slug = title.toLowerCase().replace(/\s+/g, "-");
    const post = new Post({ title, slug, content, categories, tags, status, image, author: req.user._id });
    await post.save();
    res.status(201).json({ message: "Post created", post });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  const { q, category, tag, author } = req.query;

  let filter = { status: "published" };

  if (q) filter.$or = [
    { title: { $regex: q, $options: "i" } },
    { content: { $regex: q, $options: "i" } }
  ];

  if (category) filter.categories = category;
  if (tag) filter.tags = tag;
  if (author) filter.author = author;

  const posts = await Post.find(filter).populate("author", "username role");
  res.json(posts);
});


// Get single post
router.get("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id).populate("author", "username role");
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json(post);
});

// Update post
router.put("/:id", auth, async (req, res) => {
  const { title, content, categories, tags, status, image } = req.body;
  const post = await Post.findByIdAndUpdate(req.params.id, { title, content, categories, tags, status, image }, { new: true });
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json({ message: "Post updated", post });
});

// Delete post (admin only)
router.delete("/:id", auth, permit, async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json({ message: "Post deleted" });
});

module.exports = router;
