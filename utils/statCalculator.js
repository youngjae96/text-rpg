// utils/statCalculator.js

const { getItemStatsByName } = require('./itemStats');

function calculateTotalStats(user) {
  // 기본 스탯 설정
  const baseStats = {
    attack: user.attack || 0,
    defense: user.defense || 0,
    hp: user.hp || 0,
    mp: user.mp || 0
  };

  // 장비 아이템의 스탯을 합산
  for (let type of ['weapon', 'armor', 'accessory']) {
    const item = user.equipped[type];
    if (item && item.name) {
      const bonus = getItemStatsByName(item.name);
      baseStats.attack += bonus.attack || 0;
      baseStats.defense += bonus.defense || 0;
      baseStats.hp += bonus.hp || 0;
      baseStats.mp += bonus.mp || 0;
    }
  }

  return baseStats;
}

module.exports = { calculateTotalStats };
