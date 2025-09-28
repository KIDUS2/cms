const About = require("../models/About");

const getAbout = async (req, res) => {
  const about = await About.findOne();
  res.json(about);
};

const updateAbout = async (req, res) => {
  const { content, image } = req.body;
  const about = await About.findOneAndUpdate({}, { content, image }, { new: true, upsert: true });
  res.json(about);
};

module.exports = { getAbout, updateAbout };
