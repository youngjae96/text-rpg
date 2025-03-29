const express = require('express');
const router = express.Router();
const PlazaMessage = require('../models/PlazaMessage');
const User = require('../models/User');

// 메시지 불러오기 (최신 30개)
router.get('/messages', async (req, res) => {
  const messages = await PlazaMessage.find().sort({ createdAt: -1 }).limit(30);
  res.json(messages.reverse().map(msg => `[${msg.nickname}] ${msg.message}`));
});

// 메시지 등록
router.post('/post', async (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.status(401).end();

  const user = await User.findById(userId);
  const nickname = user.nickname || '알 수 없음';

  const text = req.body.message;
  if (text) {
    await PlazaMessage.create({ nickname, message: text });
  }

  res.status(200).end();
});
module.exports = router;
