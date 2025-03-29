// utils/statCalculator.js
const { getItemStatsByName } = require('./itemStats');

function calculateTotalStats(user) {
  const baseStats = {
    str: user.str,
    dex: user.dex,
    int: user.int,
    vit: user.vit,
    wis: user.wis,
    luk: user.luk
  };

  for (let type of ['weapon', 'armor', 'accessory']) {
    const item = user.equipped[type];
    if (item && item.name) {
      const bonus = getItemStatsByName(item.name);
      for (let key in bonus) {
        baseStats[key] += bonus[key];
      }
    }
  }

  return baseStats;
}

module.exports = { calculateTotalStats };
