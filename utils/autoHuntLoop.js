const User = require('../models/User');

// 장비 이름에 따라 능력치 보너스를 주는 함수
function getItemStatsByName(name) {
  const stats = {
    str: 0,
    dex: 0,
    int: 0
  };

  if (!name) return stats;

  name = name.toLowerCase();

  if (name.includes('검') || name.includes('sword')) {
    stats.str += 3;
  }
  if (name.includes('활') || name.includes('bow')) {
    stats.dex += 3;
  }
  if (name.includes('지팡이') || name.includes('wand')) {
    stats.int += 3;
  }

  return stats;
}

// 착용 장비로부터 능력치 합산
const { getItemStatsByName } = require('./itemStats');

function getEquippedStats(user) {
  const total = { atk: 0, def: 0, mp: 0 };

  for (const slot of ['weapon', 'armor', 'accessory']) {
    const item = user.equipped?.[slot];
    if (item && item.name) {
      const bonus = getItemStatsByName(item.name);
      total.atk += bonus.atk || 0;
      total.def += bonus.def || 0;
      total.mp += bonus.mp || 0;
    }
  }

  return total;
}


function startAutoHuntLoop() {
  setInterval(async () => {
    const users = await User.find({ isAutoHunting: true });

    for (const user of users) {
  if (user.hp <= 0) {
    user.isAutoHunting = false;
    user.messages.push(" 당신은 사망했습니다. 자동사냥이 중단됩니다.");
    await user.save();
    continue;
  }

  if (!Array.isArray(user.battleLogs)) {
    user.battleLogs = []; // ✅ 로그 배열 보장
  }

  const equipped = getEquippedStats(user);
  const baseAtk = user.attack || 0;
const equipAtk = equippedStats.atk || 0;
const damage = baseAtk + equipAtk + Math.floor(user.level / 2);


  const expGain = 10;
  const goldGain = 5;
  user.exp += expGain;
  user.gold += goldGain;

 user.battleLogs.push(`🗡️ 몬스터 처치 (공격력: ${damage} / +${expGain} EXP, +${goldGain} G)`);

  // 몬스터 반격
  const monsterDamage = Math.floor(Math.random() * 5) + 5;
  user.hp -= monsterDamage;
  user.hp = Math.max(user.hp, 0);

  user.battleLogs.push(`🔥 몬스터의 공격! HP -${monsterDamage} → ${user.hp}`);

  // 레벨업 처리
  const nextLevel = user.level * 100;
  if (user.exp >= nextLevel) {
    user.level++;
    user.exp -= nextLevel;
    user.str += 1;
    user.dex += 1;
    user.int += 1;
    user.vit += 1;
    user.messages.push(`🎉 레벨업! → Lv.${user.level}`);
  }

  await user.save();
}

  }, 5000);
}

module.exports = startAutoHuntLoop;
