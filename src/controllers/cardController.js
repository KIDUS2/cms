const Card = require("../models/Card");

// Public
const getCards = async (req, res) => {
  const cards = await Card.find();
  res.json(cards);
};

// Admin
const createCard = async (req, res) => {
  const card = new Card(req.body);
  await card.save();
  res.status(201).json(card);
};

const updateCard = async (req, res) => {
  const updated = await Card.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

const deleteCard = async (req, res) => {
  await Card.findByIdAndDelete(req.params.id);
  res.json({ message: "Card deleted" });
};

module.exports = { getCards, createCard, updateCard, deleteCard };
