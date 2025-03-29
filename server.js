const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express(); // ✅ 반드시 app 선언 먼저!!

// ✅ 세션 설정은 가장 위에!
app.use(session({
  secret: 'rpgsecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 2
  }
}));

// 📦 기본 미들웨어
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ MongoDB 연결
mongoose.connect('mongodb://localhost:27017/text_rpg', {
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB 연결 실패:', err));

// ✅ 라우터 등록
const gameRoutes = require('./routes/gameRoutes');
const shopRoutes = require('./routes/shopRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const jobRoutes = require('./routes/jobRoutes');
const mapRoutes = require('./routes/mapRoutes');
const battleRoutes = require('./routes/battleRoutes');
const startAutoHuntLoop = require('./utils/autoHuntLoop');
const messageRoutes = require('./routes/messageRoutes');
const plazaRoutes = require('./routes/plazaRoutes');

app.use('/', gameRoutes);
app.use('/shop', shopRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/jobchange', jobRoutes);
app.use('/map', mapRoutes);
app.use('/battle', battleRoutes);
app.use('/messages', messageRoutes);
app.use('/plaza', plazaRoutes);

// ✅ 서버 실행
app.listen(3000, () => {
  console.log('✅ 서버가 포트 3000에서 실행 중입니다!');
});

startAutoHuntLoop();