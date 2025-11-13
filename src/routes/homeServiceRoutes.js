// routes/homeServiceRoutes.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: "Home services routes are working!",
    data: []
  });
});

module.exports = router;