const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  categories: [{ type: String }],
  tags: [{ type: String }],
  status: { type: String, enum: ["draft", "published"], default: "draft" },
  image: { type: String }, // optional image path
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);
