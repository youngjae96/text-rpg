const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 로그인 상태 확인용 미들웨어
function checkLogin(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
}

// 메인 게임 화면

// gameRoutes.js

router.get('/', checkLogin, async (req, res) => {
  const user = await User.findById(req.session.userId);
  if (!user) return res.redirect('/login');

  // 장착 아이템의 능력치 합산
  const equipped = user.equipped || {};
  const weapon = equipped.weapon || {};
  const armor = equipped.armor || {};
  const accessory = equipped.accessory || {};

  const bonus = {
  str: weapon.str || 0,
  dex: weapon.dex || 0,
  int: weapon.int || 0,
  vit: armor.vit || 0,
  wis: accessory.wis || 0,
  luk: accessory.luk || 0,
  atk: weapon.atk || 0, // ✅ 추가
  def: armor.def || 0,
  mpPlus: accessory.mp || 0
};


  res.render('game', { user, bonus });
});




// 로그인 화면
router.get('/login', (req, res) => {
  res.render('login');
});

// 로그인 처리
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (!user) return res.send('❌ 로그인 실패');

  req.session.userId = user._id;
  res.redirect('/');
});

// 회원가입 화면
router.get('/register', (req, res) => {
  res.render('register');
});

// 회원가입 처리
router.post('/register', async (req, res) => {
  const { username, password, nickname, job } = req.body;
  const exists = await User.findOne({ username });
  if (exists) return res.send('❌ 이미 존재하는 아이디');

  const newUser = new User({
    username,
    password,
    nickname,
    job,
    level: 1,
    str: job === '검사' ? 6 : 4,
    dex: job === '도적' ? 6 : 4,
    int: job === '마법사' ? 6 : 4,
    wis: job === '마법사' ? 5 : 3,
    vit: 5,
    luk: 4
  });
  await newUser.save();
  res.redirect('/login');
});

// 로그아웃
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

router.get('/status', async (req, res) => {
  const user = await User.findById(req.session.userId);
  if (!user) return res.status(401).json({});

  res.json({
    level: user.level,
    exp: user.exp,
    hp: user.hp,
    mp: user.mp,
    gold: user.gold,
    str: user.str,
    dex: user.dex,
    int: user.int,
    vit: user.vit,
    wis: user.wis,
    luk: user.luk,
    battleLogs: user.battleLogs.slice(-10).reverse() // 최신 10개만
  });
});


// 여관 페이지 렌더링
router.get('/inn', (req, res) => {
  res.render('inn');
});

router.post('/inn/rest', async (req, res) => {
  const user = await User.findById(req.session.userId);
  if (!user) return res.redirect('/login');

  // 👉 maxHp / maxMp 없을 경우 기본값을 할당
  user.maxHp = user.maxHp || 100;
  user.maxMp = user.maxMp || 50;

  const innPrice = 10;
  if (user.gold < innPrice) {
    user.messages.push('💰 골드가 부족합니다.');
  } else if (user.currentLocation !== 'town') {
    user.messages.push('❌ 여관은 마을에서만 이용 가능합니다.');
  } else {
    user.gold -= innPrice;
    user.hp = user.maxHp;
    user.mp = user.maxMp;
    user.messages.push(`🛏️ 여관에서 휴식을 취했습니다! HP/MP가 회복되었습니다. (-${innPrice}G)`);
    await user.save(); // 이때 DB에 maxHp, maxMp도 저장됨!
  }

  res.redirect('/');
});





module.exports = router;
