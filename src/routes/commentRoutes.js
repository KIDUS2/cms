const express = require("express");
const Comment = require("../models/Comment");
const { auth, permit } = require("../middleware/auth");

const router = express.Router();

// Add comment
router.post("/", auth, async (req, res) => {
  const { postId, content } = req.body;
  const comment = new Comment({ post: postId, content, user: req.user._id });
  await comment.save();
  res.json({ message: "Comment submitted", comment });
});

// Approve comment (admin)
router.put("/:id/approve", auth, permit("admin"), async (req, res) => {
  const comment = await Comment.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
  res.json({ message: "Comment approved", comment });
});

// Get comments for post
router.get("/post/:postId", async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId, approved: true }).populate("user", "username");
  res.json(comments);
});

module.exports = router;
