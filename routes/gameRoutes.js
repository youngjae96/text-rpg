const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { getItemStatsByName } = require('../utils/itemStats');

// 로그인 상태 확인용 미들웨어
function checkLogin(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
}

// 메인 게임 화면
router.get('/', checkLogin, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) return res.redirect('/login');

    // 장착한 아이템 정보 가져오기
    const weapon = user.equipped.weapon;
    const armor = user.equipped.armor;
    const accessory = user.equipped.accessory;

    // 아이템 스탯 가져오기
    const weaponStats = weapon ? getItemStatsByName(weapon.name) : {};
    const armorStats = armor ? getItemStatsByName(armor.name) : {};
    const accessoryStats = accessory ? getItemStatsByName(accessory.name) : {};

    // 보너스 스탯 계산
    const bonus = {
      atk: (user.attack || 0) + (weaponStats.atk || 0),
      def: (user.defense || 0) + (armorStats.def || 0),
      mp: (user.mp || 0) + (accessoryStats.mp || 0)
    };

    res.render('game', { user, bonus });
  } catch (err) {
    console.error('게임 화면 로딩 중 오류:', err);
    res.status(500).send('서버 오류');
  }
});

// 상태 정보 제공 API
router.get('/status', async (req, res) => {
  const user = await User.findById(req.session.userId);
  if (!user) return res.status(401).json({});

  // 장착한 아이템 정보 가져오기
  const weapon = user.equipped.weapon;
  const armor = user.equipped.armor;
  const accessory = user.equipped.accessory;

  // 아이템 스탯 가져오기
  const weaponStats = weapon ? getItemStatsByName(weapon.name) : {};
  const armorStats = armor ? getItemStatsByName(armor.name) : {};
  const accessoryStats = accessory ? getItemStatsByName(accessory.name) : {};

  // 보너스 스탯 계산
  const bonus = {
    atk: (user.attack || 0) + (weaponStats.atk || 0),
    def: (user.defense || 0) + (armorStats.def || 0),
    mp: (user.mp || 0) + (accessoryStats.mp || 0)
  };

  res.json({
    level: user.level,
    exp: user.exp,
    hp: user.hp,
    mp: user.mp,
    gold: user.gold,
    attack: user.attack,
    defense: user.defense,
    bonus,
    battleLogs: user.battleLogs.slice(-10).reverse()
  });
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

  const totalStats = calculateTotalStats(user);

  const bonus = {
    str: totalStats.str - user.str,
    dex: totalStats.dex - user.dex,
    int: totalStats.int - user.int,
    vit: totalStats.vit - user.vit,
    wis: totalStats.wis - user.wis,
    luk: totalStats.luk - user.luk,
    def: 0,
    atk: 0,
    mp: 0
  };

  const weapon = user.equipped.weapon;
  const armor = user.equipped.armor;
  const accessory = user.equipped.accessory;

  const weaponStats = weapon ? getItemStatsByName(weapon.name) : {};
  const armorStats = armor ? getItemStatsByName(armor.name) : {};
  const accessoryStats = accessory ? getItemStatsByName(accessory.name) : {};

const def = typeof armorStats.def === 'number' ? armorStats.def : 0,
const mp = typeof accessoryStats.mp === 'number' ? accessoryStats.mp : 0


  const baseStr = user.str || 0;
  const totalStr = baseStr + bonus.str;
  const weaponAtk = weaponStats.atk || 0;

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
    bonus, // ✅ 여기에 포함!
    battleLogs: user.battleLogs.slice(-10).reverse()
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
