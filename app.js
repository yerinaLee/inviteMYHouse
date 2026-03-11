/* ===================================================
   밍예리 하우스 – App Logic
=================================================== */

// ── Guest list (성 제외, 이름만) ────────────────
const GUEST_LIST = ['소향', '우희', '진선', '규원', '가영', '주아', '유진', '상언', '수빈', '정인', '밍구', '세미', '용미', '정우'];

// ── YouTube video ID ─────────────────────────────
const YT_VIDEO_ID = 'Dt28r9ZDCZo';

// ── State ────────────────────────────────────────
let guestName = '';
let declineCount = 0;
let ytPlayer = null;
let envelopeOpened = false;

// Decline messages (cycling)
const DECLINE_MSGS = [
  '🤔 다시 생각해봐요...',
  '😢 저희 집 구경하고 싶지 않으세요?',
  '🥺 한 번만요... 제발요!',
  '😭 No는 없습니다요!',
  '🚨 경고: X 버튼은 작동하지 않아요!',
  '💖 결국엔 O를 누르실 거잖아요~',
  '🎀 밍예리 하우스가 기다리고 있어요!',
  '✨ 현명한 선택을 해주세요!',
];

// ──────────────────────────────────────────────────────────
// 💌 이름별 개인 편지 내용
//    줄바꿈은 '\n'으로 표시하면 됩니다.
//    이름을 키로, 편지 내용을 값으로 작성해주세요.
// ──────────────────────────────────────────────────────────
const LETTERS = {
  '소향': `사랑하는 소향찡😄\n어릴때 서로의 집에 놀러갔던 기억이 아직도 선한데,\n어느새 이렇게 다 커서 신혼집에 초대까지 하게되다니!🤦‍♂️\n긴 시간 곁에 있어줘서 고맙고,\n네 사랑을 따라가려면 나는 아직 멀었지만 💖\n조금이나마 따수운 밥으로 보답해보겠습니당 ㅎㅎㅎ\n먼 길 와줘서 고맙고, \n따뜻하고 좋은 추억 만들자!\n넘넘넘 사랑해 💖💖💖`,
  '우희': `사랑하는 우리 우희💖\n내가 아현동을 떠나면서 제일 서러웠던 것중 하나가 너와 멀어지는거여써...ㅠㅠ\n사실 아직도 때때로 좀 슬프긴하지만!\n그래도 내가 네, 네가 내 소중한 친구라는건 변함없으니까!💖\n먼 길 와줘서 너무너무 고맙고,\n우하하 나의 요리실력을 기대하시라 우하하하\n첨으로 내가 사랑하는 내칭구에게 맛난걸 대접할수있어서 넘 신나고 기쁘다!\n조심해서 오구, 행복한 시간보내자💖\n사랑해 💖💖💖`,
  '진선': `사랑하는 진선아 😍\n언제 이렇게 서로 잘 커서, 신혼집에도 초대하는 날이 온거니...!!!\n사실 더 소중한 사실은 우리가 이때까지 서로에게 좋은 친구라는 것이지! ㅎㅎㅎ\n일도 결혼준비도 바쁠텐데 귀한 시간내어서 먼길 와줘서 넘 고맙고,\n오게되면, 우리집 소파를 유심히 봐봐....! 🪑\n아마 소파가 너에게, 자기 데려다놔줘서 고맙다고 인사할거야...(?)ㅎㅎㅎ\n덕분에 편안한 저녁시간을 보내고있어! 다시한번 너무 고마워...ㅠㅠ💖\n조심히 오구, 같이 맛난거 먹고 따뜻한 추억 만들자아!💖`,
  '규원': ``,
  '가영': ``,
  '주아': ``,
  '유진': ``,
  '상언': ``,
  '수빈': `사랑하고 애정하고 아끼고 소중한 우리 수빈이💖\n귀한 시간 내서 놀러와줘서 너무 고마워!\n그간 우리 수빈이에게 받은 커어다란 사랑을\n조금이나마 따수운 밥으로 같이 나눌수있어서\n넘넘 신나고 기대되고 기뻐용 😄🥰\n먼길 와줘서 너무 고맙고,\n정인이랑 같이 따뜻하고 오래갈 추억 만들자!\n싸랑행 💖\n`,
  '정인': `싸랑하는 정인아!\n너에게 드디어 따수운 밥을 만들어줄수있다니\n감개가 무량하구나.\n먼길 와줘서 너무너무 고맙고,\n따뜻하고 햅삐한 시간 보내자!\n사랑행 💖\n엄청마니💖💖💖`,
  '밍구': `사랑하는 우리 민규💖\n민규가 있어서 밍예리하우스가 늘 반짝반짝 따뜻하게 빛나아✨\n항상 고맙구 너무너무 사랑해💖💖💖💖💖💖💖💖💖💖💖💖`,
  '세미': `세미야 💖\n언제한번 우리집에 놀러오지 않겠니?\n아직 많이 어색하겠지만...\n일단 맛있는걸 먹다보면 기분이 좀 나아지지않을까?\nㅋㅋㅋㅋㅋㅋ 하지만 너의 하루가 바쁘고 휴일이 귀하니 언제든 편하게...\n우리집은 항상 열려있딴다....민수랑 언제든 놀러오련,,,,💖\n늘 응원하고 사랑해💖`,
  '용미': `사랑하는 용미씨💖\n엄마 덕분에 밍예리 하우스가 구석구석 풍성하고 반짝반짝하답니당✨\n항상 챙겨주셔서 감사하고,, 우리엄마,,, 너무너무 사랑하구,,,\n좀 멀긴하지만 좀 더 업그레이드된 집이 궁금하시다면\n언제든 콜하십시요\n알라븅💖💖💖`,
  '정우': `아부지....💖\n덕분에 날마다 깨끗한 물 잘 마시고\n따뜻하고 맛있는 밥 먹고 민규랑 사이좋게 잘 지내고있습니다,,,💖\n좀 멀긴하지만,, 조금씩 업그레이드된 밍예리 하우스가 궁금하시다면\n언제든 초대드립니다,,,,\n단 이 초대장을 소유하고계셔야합니다,,,💌,,,\n뻥이에요....ㅋㅋㅋㅋ\n아무튼지간에 사랑합니당...💖`
};

// 편지 내용이 없을 때 기본 문구
const DEFAULT_LETTER = `먼 길 와주셔서 증맬루 감사합니다!😄\n행복하고 따뜻한 시간 보내요~~~\n알라뷰입니당 🌸`;

// ════════════════════════════════════════════════
// SCENE MANAGEMENT
// ════════════════════════════════════════════════
function showScene(id) {
  // fade out all
  document.querySelectorAll('.scene').forEach(s => {
    s.classList.remove('active');
  });
  // fade in target
  const target = document.getElementById(id);
  // slight delay so transition fires
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      target.classList.add('active');
    });
  });
}

// ════════════════════════════════════════════════
// OPENING – ENVELOPE
// ════════════════════════════════════════════════
function openEnvelope() {
  if (envelopeOpened) return;
  envelopeOpened = true;

  const box = document.getElementById('envelopeBox');
  const hint = document.getElementById('tapHint');
  const riseCard = document.getElementById('riseCard');

  // 0) hint fades, stop floating animation
  hint.classList.add('hidden');
  box.classList.add('opening');

  // 1) Untie ribbon (200ms)
  setTimeout(() => {
    box.classList.add('untied');
  }, 200);

  // 2) Open flap (700ms)
  setTimeout(() => {
    box.classList.add('opened');
  }, 700);

  // 3) Card drops DOWN into open envelope (1400ms)
  setTimeout(() => {
    riseCard.classList.add('rising');
  }, 1400);

  // 4) Fade scene and go to page 1 (3200ms — card lands at ~2300ms, hold briefly)
  setTimeout(() => {
    document.getElementById('s0').style.transition = 'opacity .6s ease';
    showScene('s1');
    initParticles();
    document.getElementById('nameInput').focus();
  }, 3200);
}

// ════════════════════════════════════════════════
// PAGE 1 – NAME CHECK
// ════════════════════════════════════════════════
function checkName() {
  const input = document.getElementById('nameInput');
  const errorBox = document.getElementById('errorBox');
  const name = input.value.trim();

  // clear previous
  errorBox.classList.add('hidden');
  errorBox.innerHTML = '';

  if (!name) {
    showError('이름을 입력해주세요! 🌸');
    return;
  }

  if (GUEST_LIST.includes(name)) {
    guestName = name;
    // Set up page 2
    document.getElementById('inviteName').textContent = `${guestName}님을`;
    showScene('s2');
    spawnParticles();
  } else {
    showError(
      `<span class="error-big">🚨 삐빅!</span><br>` +
      `죄송하지만 초대자 명단에<br>없으십니다 😢<br>` +
      `<em>다음 기회를 노려주세요! 🌸</em>`
    );
    input.classList.add('shake');
    setTimeout(() => input.classList.remove('shake'), 600);
  }
}

function showError(html) {
  const box = document.getElementById('errorBox');
  box.innerHTML = html;
  box.classList.remove('hidden');
  box.classList.add('pop-in');
  setTimeout(() => box.classList.remove('pop-in'), 400);
}

// ════════════════════════════════════════════════
// PAGE 2 – ACCEPT / DECLINE
// ════════════════════════════════════════════════
function handleAccept() {
  // 페이지 3 콘텐츠 세팅
  document.getElementById('letterTitle').innerHTML =
    `${guestName}님, 초대에 응해주셔서<br>정말 감사해요! 🎉`;

  // 개인 편지 내용 채우기
  document.getElementById('letterTo').textContent = `To.${guestName}님 🌸`;
  const rawText = LETTERS[guestName] || DEFAULT_LETTER;
  // 줄바꿈(\n)을 <br>로 변환
  document.getElementById('letterBody').innerHTML =
    rawText.split('\n').map(line => `<span>${line}</span>`).join('<br>');

  showScene('s3');
  createConfetti();

  // ✅ 음악: O 버튼 클릭 직후 즉시 재생 (setTimeout 제거)
  // 모바일에서 setTimeout 안에서는 user gesture가 끊겨 autoplay가 막힘
  if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
    ytPlayer.unMute();       // 혹시 음소거 상태면 해제
    ytPlayer.setVolume(100); // 볼륨 최대로
    ytPlayer.playVideo();
  }
}

function handleDecline() {
  const btnX = document.getElementById('btnX');
  const oxRow = document.getElementById('oxRow');
  const msgEl = document.getElementById('declineMsg');

  // Shake X button
  btnX.classList.remove('shake-it');
  void btnX.offsetWidth; // reflow
  btnX.classList.add('shake-it');
  setTimeout(() => btnX.classList.remove('shake-it'), 600);

  // Show message
  const msg = DECLINE_MSGS[declineCount % DECLINE_MSGS.length];
  declineCount++;
  msgEl.textContent = msg;
  msgEl.classList.remove('pop-in');
  void msgEl.offsetWidth;
  msgEl.classList.add('pop-in');

  // Brief pulse on ox-row to feel alive
  oxRow.style.opacity = '.3';
  setTimeout(() => { oxRow.style.opacity = '1'; }, 350);
}

// ════════════════════════════════════════════════
// PARTICLES
// ════════════════════════════════════════════════
const SYMBOLS = ['⭐', '💖', '✨', '🌸', '💫', '🌟', '🎀', '💕', '💗', '💞', '💟'];

function initParticles() {
  const container = document.getElementById('particles');
  container.innerHTML = '';
  for (let i = 0; i < 18; i++) {
    addParticle(container);
  }
}

function spawnParticles() {
  const container = document.getElementById('particles');
  container.innerHTML = '';
  for (let i = 0; i < 25; i++) {
    addParticle(container);
  }
}

function addParticle(container) {
  const el = document.createElement('span');
  el.className = 'particle';
  el.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
  el.style.left = Math.random() * 100 + 'vw';
  el.style.fontSize = (Math.random() * 14 + 10) + 'px';
  el.style.animationDuration = (Math.random() * 10 + 7) + 's';
  el.style.animationDelay = (Math.random() * 6) + 's';
  container.appendChild(el);
}

// ════════════════════════════════════════════════
// CONFETTI
// ════════════════════════════════════════════════
function createConfetti() {
  const area = document.getElementById('confettiArea');
  const colors = ['#FF69B4', '#FFB6C1', '#FF1493', '#FFD700', '#ff85c0', '#ffffff', '#fb8ec6'];
  area.innerHTML = '';

  for (let i = 0; i < 60; i++) {
    const c = document.createElement('div');
    c.className = 'confetti-piece';
    const size = Math.random() * 9 + 5;
    c.style.left = Math.random() * 100 + '%';
    c.style.width = size + 'px';
    c.style.height = size + 'px';
    c.style.borderRadius = Math.random() > .5 ? '50%' : '3px';
    c.style.background = colors[Math.floor(Math.random() * colors.length)];
    c.style.animationDelay = Math.random() * 2.5 + 's';
    c.style.animationDuration = (Math.random() * 2 + 2) + 's';
    area.appendChild(c);
  }
  // Remove confetti after 6s to avoid clutter
  setTimeout(() => { area.innerHTML = ''; }, 6000);
}

// ════════════════════════════════════════════════
// YOUTUBE IFrame API
// ════════════════════════════════════════════════
function onYouTubeIframeAPIReady() {
  ytPlayer = new YT.Player('ytPlayer', {
    videoId: YT_VIDEO_ID,
    playerVars: {
      autoplay: 0,
      controls: 0,
      showinfo: 0,
      rel: 0,
      iv_load_policy: 3,
      playsinline: 1,
    },
    events: {
      onReady: () => { /* player ready, waiting for user gesture */ },
      onError: (e) => { console.warn('YT error', e.data); },
    },
  });
}

// ════════════════════════════════════════════════
// KEYBOARD SUPPORT
// ════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  initParticles();

  document.getElementById('nameInput').addEventListener('keypress', e => {
    if (e.key === 'Enter') checkName();
  });

  // Also allow clicking anywhere on envelope tap area
  document.getElementById('envelopeBox').addEventListener('click', openEnvelope);
});
