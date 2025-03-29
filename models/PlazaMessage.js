const mongoose = require('mongoose');

const PlazaMessageSchema = new mongoose.Schema({
  nickname: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PlazaMessage', PlazaMessageSchema);
