const User = require('../models/User');

function startAutoHuntLoop() {
  setInterval(async () => {
    const users = await User.find({ isAutoHunting: true });

    for (const user of users) {
      if (user.hp <= 0) {
        user.isAutoHunting = false;
        user.messages.push("💀 당신은 사망했습니다. 자동사냥이 중단됩니다.");
        await user.save();
        continue;
      }

      // 유저가 몬스터 공격 (기존)
      const expGain = 10;
      const goldGain = 5;
      user.exp += expGain;
      user.gold += goldGain;
user.messages.push(`🗡️ 몬스터 처치 (+${expGain} EXP, +${goldGain} G)`);

      // 몬스터가 유저에게 피해 줌
      const monsterDamage = Math.floor(Math.random() * 5) + 5; // 5~9 데미지
      user.hp -= monsterDamage;
      user.hp = Math.max(user.hp, 0);
      user.messages.push(`💢 몬스터의 공격! HP -${monsterDamage} → ${user.hp}`);
user.battleLogs.push(`🩸 몬스터에게 공격당해 HP -${monsterDamage} → ${user.hp}`);

      // 레벨업 체크
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
