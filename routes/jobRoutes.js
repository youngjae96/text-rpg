const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 전직 화면
router.get('/', async (req, res) => {
  const user = await User.findById(req.session.userId);
  if (!user || user.level < 50 || user.subClass) {
    return res.send('⚠️ 전직 조건을 만족하지 않거나 이미 전직했습니다.');
  }

  let options = [];
  if (user.job === '검사') options = ['나이트', '버서커'];
  if (user.job === '궁수') options = ['레인저', '스나이퍼'];
  if (user.job === '마법사') options = ['소서러', '아크메이지'];
  if (user.job === '도적') options = ['어쌔신', '트릭스터'];

  res.render('jobchange', { user, options });
});

// 전직 처리
router.post('/', async (req, res) => {
  const { subClass } = req.body;
  const user = await User.findById(req.session.userId);

  if (!user || user.level < 50 || user.subClass) {
    return res.send('⚠️ 전직 조건이 부족하거나 이미 전직했습니다.');
  }

  user.subClass = subClass;
  user.messages.push(`🎉 ${subClass}으로 전직했습니다!`);
  await user.save();

  res.redirect('/');
});

module.exports = router;
