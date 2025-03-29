const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/latest', async (req, res) => {
  const user = await User.findById(req.session.userId);
  if (!user) return res.status(401).send([]);
  res.json(user.messages.slice(-30).reverse());
});

module.exports = router;
