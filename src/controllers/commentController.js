const Comment = require("../models/Comment");

// Get all comments
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find().populate("author", "username role").populate("post", "title slug");
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single comment by ID
const getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)
      .populate("author", "username role")
      .populate("post", "title slug");
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create comment
const createComment = async (req, res) => {
  try {
    const { content, postId } = req.body;
    const comment = new Comment({ content, post: postId, author: req.user._id });
    await comment.save();
    res.status(201).json({ message: "Comment created", comment });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update comment
const updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { content },
      { new: true }
    );
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    res.json({ message: "Comment updated", comment });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete comment
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
};
