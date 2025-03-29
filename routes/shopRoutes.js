const express = require('express');
const router = express.Router();
const User = require('../models/User');
const itemsForSale = require('../data/shopItems');

// 상점 페이지
router.get('/', async (req, res) => {
  const user = await User.findById(req.session.userId);
  if (!user) return res.redirect('/login');
  res.render('shop', { user, shopItems });
});

// 아이템 구매
router.post('/buy', async (req, res) => {
  const { itemIndex } = req.body;
  const user = await User.findById(req.session.userId);
  const item = shopItems[itemIndex];

  if (!user || !item || user.gold < item.price) return res.redirect('/shop');

  user.gold -= item.price;
  user.inventory.push(item);
  user.messages.push(`[구매] ${item.name}을(를) ${item.price} G에 구입.`);
  await user.save();
  res.redirect('/shop');
});

// 아이템 판매
router.post('/sell', async (req, res) => {
  const { itemIndex } = req.body;
  const user = await User.findById(req.session.userId);
  if (!user || !user.inventory[itemIndex]) return res.redirect('/shop');

  const item = user.inventory[itemIndex];
  const sellPrice = Math.floor((item.price || 50) / 2);

  user.gold += sellPrice;
  user.inventory.splice(itemIndex, 1);
  user.messages.push(`[판매] ${item.name}을(를) ${sellPrice} G에 판매.`);
  await user.save();
  res.redirect('/shop');
});

module.exports = router;
