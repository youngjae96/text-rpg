const itemStatsData = {
  '나무검': { str: 2, atk: 1 },
  '청동검': { str: 5, atk: 3 },
  '전설의 검': { str: 10, atk: 5 },
  '낡은 갑옷': { def: 3, vit: 1 },
  '청동 갑옷': { def: 5, vit: 2 },
  '지팡이': { int: 5, mp: 5 },
  '빛의 로브': { wis: 5, mp: 10 },
  '행운의 반지': { luk: 5 },
};

function getItemStatsByName(name) {
  if (!name) return {};

  // ✅ 이름 끝의 " +숫자" 제거 (예: "청동검 +1" → "청동검")
  const cleanName = name.replace(/\s*\+\d+$/, '');
  return itemStatsData[cleanName] || {};
}

module.exports = { getItemStatsByName };
