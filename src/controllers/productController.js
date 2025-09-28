const Product = require("../models/Product");

// Public
const getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

// Admin
const createProduct = async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json(product);
};

const updateProduct = async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };
