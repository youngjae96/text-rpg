const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 지역 목록 (간단 예시)
const areas = [
  { id: 'town', name: '마을', desc: '휴식을 취할 수 있는 고요한 마을' },
  { id: 'field', name: '초원', desc: '약한 몬스터들이 서식하는 넓은 초원' },
  { id: 'forest', name: '숲', desc: '중급 몬스터가 출몰하는 어두운 숲' },
  { id: 'dungeon', name: '던전', desc: '보스 몬스터가 등장하는 위험한 지역' },
  { id: 'volcano', name: '화산지대', desc: '화염 몬스터가 서식하는 뜨거운 지역' },
  { id: 'icecave', name: '얼음 동굴', desc: '빙결 마법의 기운이 감도는 곳' },
  { id: 'ruins', name: '고대 유적', desc: '잊혀진 문명의 흔적이 남아있는 장소' },
  { id: 'skyisland', name: '하늘섬', desc: '공중에 떠 있는 신비한 섬' }
];

// 지역 선택 화면
router.get('/', async (req, res) => {
  const user = await User.findById(req.session.userId);
  if (!user) return res.redirect('/login');

  res.render('map', { user, areas });
});

// 지역 이동 처리
router.post('/move', async (req, res) => {
  const { destination } = req.body;
  const user = await User.findById(req.session.userId);
  if (!user) return res.redirect('/login');

  const validArea = areas.find(a => a.id === destination);
  if (!validArea) return res.send('❌ 존재하지 않는 지역입니다.');

  user.currentLocation = destination;
  user.messages.push(`📍 ${validArea.name}(으)로 이동했습니다.`);
  await user.save();

  res.redirect('/');
});

module.exports = router;
