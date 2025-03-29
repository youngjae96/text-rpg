// data/shopItems.js
module.exports = [
  {
    name: '[일반] 나무검',
    type: 'weapon',
    price: 50,
    stats: { str: 2 }
  },
  {
    name: '[고급] 청동검',
    type: 'weapon',
    price: 100,
    stats: { str: 4, dex: 1 }
  },
  {
    name: '[일반] 모험가 갑옷',
    type: 'armor',
    price: 80,
    stats: { vit: 3 }
  },
  {
    name: '[희귀] 마나링',
    type: 'accessory',
    price: 70,
    stats: { int: 3, wis: 2 }
  },
  {
    name: '[일반] HP 포션',
    type: 'potion',
    price: 30,
    stats: {},
    effect: { hpRestore: 50 }
  }
];
