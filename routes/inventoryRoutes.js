const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 인벤토리 화면
router.get('/', async (req, res) => {
  const user = await User.findById(req.session.userId);
  if (!user) return res.redirect('/login');
  res.render('inventory', { user });
});

// 아이템 장착
router.post('/equip', async (req, res) => {
  const { itemIndex } = req.body;
  const user = await User.findById(req.session.userId);
  if (!user || !user.inventory[itemIndex]) return res.redirect('/inventory');

  const item = user.inventory[itemIndex];
  const slot = item.type;

  // 기존 장비 해제
  if (user.equipped[slot]) {
    user.inventory.push(user.equipped[slot]);
  }

  user.equipped[slot] = item;
  user.inventory.splice(itemIndex, 1);
  user.messages.push(`[장착] ${item.name}을(를) 장착했습니다.`);
  await user.save();
  res.redirect('/inventory');
});

// 아이템 해제
router.post('/unequip', async (req, res) => {
  const { slot } = req.body;
  const user = await User.findById(req.session.userId);
  if (!user || !user.equipped[slot]) return res.redirect('/inventory');

  user.inventory.push(user.equipped[slot]);
  user.messages.push(`[해제] ${user.equipped[slot].name}을(를) 장비 해제했습니다.`);
  user.equipped[slot] = null;
  await user.save();
  res.redirect('/inventory');
});

// 아이템 사용
router.post('/use', async (req, res) => {
  const { itemIndex } = req.body;
  const user = await User.findById(req.session.userId);
  if (!user || !user.inventory[itemIndex]) return res.redirect('/inventory');

  const item = user.inventory[itemIndex];

  if (item.effect === 'heal') {
    user.hp = Math.min(user.hp + 50, 100);
    user.messages.push(`[사용] ${item.name}을(를) 사용해 HP 50 회복.`);
    user.inventory.splice(itemIndex, 1);
  }

  await user.save();
  res.redirect('/inventory');
});

module.exports = router;
