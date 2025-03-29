const mongoose = require('mongoose');

// 기존 스탯들 제거 후 단순화
const UserSchema = new mongoose.Schema({
  nickname: String,
  password: String,
  location: {
    x: Number,
    y: Number
  },
  map: String,
  hp: { type: Number, default: 100 },
  mp: { type: Number, default: 30 },
  attack: { type: Number, default: 10 },
  defense: { type: Number, default: 5 },
  inventory: { type: [Object], default: [] },
  equipped: {
    weapon: { type: Object, default: null },
    armor: { type: Object, default: null },
    accessory: { type: Object, default: null }
  },
  gold: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  exp: { type: Number, default: 0 },
  
  // 스키마 내부에 추가 필드 포함
  isAutoHunting: { type: Boolean, default: false },
  currentLocation: { type: String, default: 'village' },
  messages: { type: [String], default: [] },      // 시스템 메시지
  battleLogs: { type: [String], default: [] }       // 전투 로그
});

module.exports = mongoose.model('User', UserSchema);
