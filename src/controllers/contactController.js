const Contact = require("../models/Contact");

// Public - user submits message
const createContact = async (req, res) => {
  const contact = new Contact(req.body);
  await contact.save();
  res.status(201).json({ message: "Message sent successfully" });
};

// Admin - view messages
const getContacts = async (req, res) => {
  const contacts = await Contact.find();
  res.json(contacts);
};

module.exports = { createContact, getContacts };
