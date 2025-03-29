// utils/itemStats.js

function getItemStatsByName(name) {
  const stats = {
    str: 0, dex: 0, int: 0, vit: 0, wis: 0, luk: 0
  };

  const lower = name.toLowerCase();

  if (lower.includes('검') || lower.includes('소드') || lower.includes('칼')) {
    stats.str += 5;
  }
  if (lower.includes('활')) {
    stats.dex += 5;
  }
  if (lower.includes('지팡이') || lower.includes('완드') || lower.includes('스태프')) {
    stats.int += 5;
  }
  if (lower.includes('갑옷') || lower.includes('방패') || lower.includes('아머')) {
    stats.vit += 3;
  }
  if (lower.includes('로브') || lower.includes('천')) {
    stats.wis += 3;
  }
  if (lower.includes('반지') || lower.includes('목걸이')) {
    stats.luk += 2;
  }

  return stats;
}

module.exports = { getItemStatsByName };
