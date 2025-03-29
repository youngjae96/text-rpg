const getEquippedStats = (user) => {
  const total = { str: 0, dex: 0, int: 0, vit: 0, wis: 0, luk: 0 };
  for (const slot of ['weapon', 'armor', 'accessory']) {
    const item = user.equipped?.[slot];
    if (item?.stats) {
      for (let stat in item.stats) {
        total[stat] += item.stats[stat];
      }
    }
  }
  return total;
};
