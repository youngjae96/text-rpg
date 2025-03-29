const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // 로그인 ID
  password: { type: String, required: true }, // 비밀번호 (암호화 전제)
  nickname: { type: String, required: true },
  job: { type: String, required: true }, // 검사, 마법사, 도적 등
  subClass: { type: String, default: null }, // 전직 직업
  level: { type: Number, default: 1 },
  exp: { type: Number, default: 0 },
  gold: { type: Number, default: 100 },

  // 능력치
  hp: { type: Number, default: 100 },
mp: { type: Number, default: 50 },
maxHp: { type: Number, default: 100 },
maxMp: { type: Number, default: 50 },
  str: { type: Number, default: 5 },
  dex: { type: Number, default: 5 },
  vit: { type: Number, default: 5 },
  int: { type: Number, default: 5 },
  wis: { type: Number, default: 5 },
  luk: { type: Number, default: 5 },



 inventory: { type: [Object], default: [] },
equipped: {
  weapon: { type: Object, default: null },
  armor: { type: Object, default: null },
  accessory: { type: Object, default: null }
},


  isAutoHunting: { type: Boolean, default: false },
  currentLocation: { type: String, default: 'village' },

  messages: { type: [String], default: [] },      // 시스템 메시지
  battleLogs: { type: [String], default: [] }     // ✅ 전투 로그
});


module.exports = mongoose.model('User', userSchema);
