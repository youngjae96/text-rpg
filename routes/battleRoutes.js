const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ✅ 세션 로그인 체크 미들웨어
function checkLogin(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.redirect('/login');
  }
  next();
}

// ✅ 사냥 시작
router.post('/start', checkLogin, async (req, res) => {
  const user = await User.findById(req.session.userId);
  user.isAutoHunting = true;
  user.messages.push("⚔️ 자동사냥을 시작합니다!");
  await user.save();
  res.redirect('/');
});

// 자동사냥 중지 라우터 추가
router.post('/stop', checkLogin, async (req, res) => {
  const user = await User.findById(req.session.userId);
  if (!user) return res.redirect('/login');

  user.isAutoHunting = false;
  user.messages.push("⛔ 자동사냥을 중단했습니다.");
  await user.save();
  res.redirect('/');
});

module.exports = router;
