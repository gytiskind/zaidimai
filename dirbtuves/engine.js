/* Žaidimų dirbtuvės: pavyzdiniai piešiniai, žaidimų šablonai, žaidimo variklis ir išsaugojimas.
   Bendras planšetei (index.html) ir klasės arkadai (ekranas.html). */
(function (root) {
const TAU = Math.PI * 2;
const INK = '#16183a';
const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
function rng(seed) { seed = (seed % 2147483646) + 1; return () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }; }

// roundRect yra ne visose senesnėse planšečių naršyklėse
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); this.moveTo(x + r, y); this.arcTo(x + w, y, x + w, y + h, r); this.arcTo(x + w, y + h, x, y + h, r); this.arcTo(x, y + h, x, y, r); this.arcTo(x, y, x + w, y, r); this.closePath(); };
}
// Paveikslėlis į duomenis: WebP, o kur jo nėra (Safari), JPEG fonui ir PNG veikėjams
function enc(c, opaque, q) {
  const u = c.toDataURL('image/webp', q);
  if (u.startsWith('data:image/webp')) return u;
  return opaque ? c.toDataURL('image/jpeg', q) : c.toDataURL('image/png');
}
/* ---------- mokytojo pavyzdžiai: pikselių piešiniai 16x16, tas pats blokų stilius kaip Robot Miner ---------- */
// Kiekvienas pavyzdys piešiamas 16x16 tinklelyje ir padidinamas iki 256x256 (vienas taškas = 2x2 vaiko teptuko kvadratėliai).
const PX = {
  robot(r) {
    r(7, 0, 2, 1, '#ff5a8a'); r(7, 1, 2, 1, '#c3c8d2');
    r(3, 2, 10, 6, '#f2c230'); r(3, 2, 10, 1, '#ffe08a'); r(3, 7, 10, 1, '#c99a1a');
    r(4, 3, 8, 3, '#1a1a22'); r(5, 4, 2, 1, '#7ff3ff'); r(9, 4, 2, 1, '#7ff3ff');
    r(4, 8, 8, 5, '#8a8f9c'); r(4, 8, 8, 1, '#b4b9c4'); r(6, 9, 4, 3, '#4de8d6'); r(7, 10, 2, 1, '#b8fff6');
    r(2, 8, 2, 4, '#f2c230'); r(12, 8, 2, 4, '#f2c230'); r(2, 11, 2, 1, '#8a8f9c'); r(12, 11, 2, 1, '#8a8f9c');
    r(5, 13, 2, 3, '#2a2a30'); r(9, 13, 2, 3, '#2a2a30');
  },
  slime(r) {
    r(2, 3, 12, 12, '#5cbf3a'); r(2, 3, 12, 1, '#8ee35f'); r(2, 3, 1, 12, '#8ee35f'); r(2, 14, 12, 1, '#2f7a1c'); r(13, 3, 1, 12, '#2f7a1c');
    r(4, 5, 8, 8, '#4aa02c');
    r(4, 6, 2, 2, '#14361a'); r(10, 6, 2, 2, '#14361a'); r(4, 6, 1, 1, '#ffffff'); r(10, 6, 1, 1, '#ffffff');
    r(7, 10, 2, 1, '#14361a');
  },
  bird(r) {
    r(6, 2, 2, 2, '#e0402e'); r(2, 6, 2, 3, '#e5641f');
    r(4, 4, 8, 9, '#ff8a3d'); r(3, 6, 10, 5, '#ff8a3d'); r(4, 4, 8, 1, '#ffb27a');
    r(6, 8, 5, 4, '#ffe1b8'); r(3, 8, 4, 3, '#e5641f');
    r(9, 6, 2, 2, '#16183a'); r(10, 6, 1, 1, '#ffffff');
    r(12, 8, 3, 2, '#ffcc33'); r(12, 9, 2, 1, '#e0a51c');
    r(6, 13, 1, 2, '#ffcc33'); r(9, 13, 1, 2, '#ffcc33');
  },
  apple(r) {
    r(7, 1, 2, 3, '#7a4a1c'); r(9, 2, 3, 2, '#5cbf3a'); r(10, 1, 2, 1, '#8ee35f');
    r(4, 4, 8, 10, '#e0402e'); r(3, 6, 10, 6, '#e0402e'); r(5, 4, 2, 1, '#e0402e');
    r(5, 5, 2, 2, '#ff8a7a'); r(4, 7, 1, 2, '#ff8a7a');
    r(4, 13, 8, 1, '#a8302a'); r(12, 8, 1, 4, '#a8302a'); r(7, 4, 2, 1, '#a8302a');
  },
  tnt(r) {
    r(1, 1, 14, 14, '#e0402e'); r(1, 1, 14, 1, '#ff8a7a');
    [3, 6, 9, 12].forEach((x) => r(x, 2, 1, 12, '#a8302a'));
    r(1, 6, 14, 4, '#f3f0f7'); r(1, 6, 14, 1, '#ffffff');
    r(2, 7, 3, 1, '#16183a'); r(3, 8, 1, 2, '#16183a');
    r(6, 7, 1, 3, '#16183a'); r(7, 7, 1, 1, '#16183a'); r(8, 8, 1, 1, '#16183a'); r(9, 7, 1, 3, '#16183a');
    r(11, 7, 3, 1, '#16183a'); r(12, 8, 1, 2, '#16183a');
    r(1, 14, 14, 1, '#7a1a10');
  },
  diamond(r) {
    [[3, 5, 6], [4, 4, 8], [5, 3, 10], [6, 3, 10], [7, 4, 8], [8, 5, 6], [9, 6, 4], [10, 7, 2]].forEach(([y, x, w]) => r(x, y + 1, w, 1, '#4de8d6'));
    r(5, 4, 3, 1, '#b8fff6'); r(4, 5, 2, 1, '#b8fff6'); r(4, 6, 1, 1, '#ffffff');
    r(11, 5, 1, 2, '#1fa898'); r(10, 7, 1, 2, '#1fa898'); r(9, 9, 1, 1, '#1fa898'); r(8, 10, 1, 1, '#1fa898');
  },
  ghost(r) {
    r(4, 2, 8, 1, '#e8ecff'); r(3, 3, 10, 10, '#e8ecff'); r(3, 3, 10, 1, '#ffffff');
    [3, 7, 11].forEach((x) => r(x, 13, 2, 2, '#e8ecff')); [5, 9].forEach((x) => r(x, 13, 2, 1, '#e8ecff'));
    r(12, 4, 1, 9, '#b9bfe0');
    r(5, 6, 2, 3, '#16183a'); r(9, 6, 2, 3, '#16183a'); r(5, 6, 1, 1, '#ffffff'); r(9, 6, 1, 1, '#ffffff');
    r(7, 10, 2, 1, '#16183a');
  },
  coin(r) {
    r(5, 2, 6, 1, '#ffcc33'); r(3, 3, 10, 10, '#ffcc33'); r(2, 5, 12, 6, '#ffcc33'); r(5, 13, 6, 1, '#ffcc33');
    r(5, 2, 6, 1, '#fff0a8'); r(3, 3, 3, 1, '#fff0a8'); r(2, 5, 1, 3, '#fff0a8');
    r(4, 4, 8, 8, '#e0a51c'); r(5, 5, 6, 6, '#ffcc33');
    r(7, 5, 2, 6, '#c9962a'); r(13, 6, 1, 5, '#c9962a'); r(5, 13, 6, 1, '#b8861a');
  },
  pillar(r) {
    // akmens plytos: kartojasi aukštyn ir žemyn be siūlės
    r(0, 0, 16, 16, '#8b8b95');
    for (let y = 0; y < 16; y += 4) { r(0, y + 3, 16, 1, '#5c5c66'); const o = (y / 4) % 2 ? 4 : 0; r(o, y, 1, 3, '#5c5c66'); r(o + 8, y, 1, 3, '#5c5c66'); r(o + 1, y, 6, 1, '#a5a5ae'); r((o + 9) % 16, y, 6, 1, '#a5a5ae'); }
    r(0, 0, 1, 16, '#6e6e78'); r(15, 0, 1, 16, '#5c5c66'); r(5, 9, 2, 1, '#3fa34d'); r(11, 13, 2, 1, '#3fa34d');
  },
};
function pixelSprite(kind) {
  const c = mk(256, 256), g = c.getContext('2d');
  PX[kind]((x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x * 16, y * 16, w * 16, h * 16); });
  return c;
}
// Fonai: piešiami mažu 128x64 tinkleliu ir padidinami 8 kartus, kad būtų aiškūs blokai
function pixelBg(kind) {
  const W = 128, H = 64, s = mk(W, H), g = s.getContext('2d'), q = rng(kind.length * 977);
  const r = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
  if (kind === 'bgMeadow') {
    ['#5fb2ff', '#6cbcff', '#7ac6ff', '#8ad0ff', '#9ad9ff', '#acE2ff'].forEach((col, i) => r(0, i * 8, W, 8, col));
    r(104, 6, 10, 10, '#fff3a0'); r(105, 7, 8, 8, '#ffe066');
    [[12, 10, 14], [52, 6, 18], [84, 16, 12]].forEach(([x, y, w]) => { r(x, y, w, 3, '#ffffff'); r(x + 2, y - 2, w - 6, 2, '#ffffff'); r(x, y + 3, w, 1, '#dfeaff'); });
    [[18, 40], [70, 38], [112, 41]].forEach(([x, y]) => { r(x + 2, y, 2, 8, '#7a4a1c'); r(x - 2, y - 7, 10, 7, '#3fa34d'); r(x, y - 9, 6, 2, '#3fa34d'); r(x - 2, y - 7, 10, 1, '#5cbf3a'); });
    r(0, 48, W, 16, '#8a5a2b');
    for (let i = 0; i < 160; i++) r((q() * W) | 0, 50 + ((q() * 14) | 0), 1, 1, q() < .5 ? '#6e4520' : '#9c6a36');
    r(0, 46, W, 3, '#5cbf3a'); for (let x = 0; x < W; x += 2) r(x, 49, 1, (q() * 2 + 1) | 0, '#5cbf3a');
    for (let x = 0; x < W; x += 3) r(x, 46, 1, 1, '#8ee35f');
  } else if (kind === 'bgCave') {
    r(0, 0, W, H, '#2e2b38');
    for (let i = 0; i < 900; i++) r((q() * W) | 0, (q() * H) | 0, 2, 1, ['#26232f', '#35323f', '#2a2734', '#3a3646'][(q() * 4) | 0]);
    for (let i = 0; i < 14; i++) { const x = (q() * (W - 4)) | 0, y = (q() * (H - 4)) | 0, col = ['#4de8d6', '#ffcc33', '#1a1a22', '#e0402e'][(q() * 4) | 0]; r(x, y, 2, 1, col); r(x + 1, y + 1, 2, 1, col); }
    [[20, 22], [64, 14], [106, 26]].forEach(([x, y]) => { g.globalAlpha = .18; r(x - 6, y - 6, 13, 13, '#ff9a2e'); g.globalAlpha = .3; r(x - 3, y - 3, 7, 7, '#ffb347'); g.globalAlpha = 1; r(x, y, 1, 4, '#7a4a1c'); r(x, y - 1, 1, 1, '#ffcc33'); });
    r(0, 58, W, 6, '#24212c');
  } else {
    ['#2a1d5c', '#3b2470', '#5a2d7a', '#8a3a7a', '#c4527a', '#f07a5e', '#ffb05c', '#ffd27a'].forEach((col, i) => r(0, i * 6, W, 6, col));
    for (let i = 0; i < 40; i++) r((q() * W) | 0, (q() * 18) | 0, 1, 1, '#ffffff');
    r(22, 6, 8, 8, '#fff3c4'); r(24, 7, 3, 2, '#ffffff');
    const ridge = (base, amp, col) => { let y = base; for (let x = 0; x < W; x += 2) { y = Math.max(base - amp, Math.min(base + 4, y + ((q() * 5) | 0) - 2)); r(x, y, 2, H - y, col); } };
    ridge(44, 10, '#5a2d6a'); ridge(52, 6, '#3b1f52'); r(0, 60, W, 4, '#2a1640');
  }
  const c = mk(SIZE.bg[0], SIZE.bg[1]), x = c.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(s, 0, 0, c.width, c.height);
  return c;
}
const SIZE = { bg: [1024, 512], hero: [256, 256], good: [256, 256], bad: [256, 256] };
const ready = Promise.resolve();
function makeDef(kind) { return kind.startsWith('bg') ? pixelBg(kind) : pixelSprite(kind); }

/* ---------- šablonai ir taisyklės ---------- */
const TPL = {
  gaudyk: { name: 'Gaudyk', about: 'Daiktai krenta iš viršaus. Gaudyk gerus, venk blogų.', ctrl: 'Vesk pirštu į šonus',
    slots: [['hero', 'Herojus', 'Tu jį valdai'], ['good', 'Gaudyk', 'Krenta iš viršaus'], ['bad', 'Venk', 'Irgi krenta'], ['bg', 'Fonas', 'Už visko']],
    def: { hero: ['robot'], good: ['apple'], bad: ['tnt'], bg: ['bgMeadow'] } },
  bek: { name: 'Bėk', about: 'Rink daiktus visame lauke, o priešai lakstys aplink.', ctrl: 'Vesk pirštu, herojus seka',
    slots: [['hero', 'Herojus', 'Tu jį valdai'], ['good', 'Rink', 'Atsiranda bet kur'], ['bad', 'Priešas', 'Laksto aplink'], ['bg', 'Fonas', 'Už visko']],
    def: { hero: ['slime'], good: ['diamond'], bad: ['ghost'], bg: ['bgCave'] } },
  skrisk: { name: 'Skrisk', about: 'Bakstelk ir herojus pakyla. Praskrisk pro kliūtis.', ctrl: 'Bakstelk, kad pakiltum',
    slots: [['hero', 'Herojus', 'Tu jį valdai'], ['good', 'Rink', 'Tarp kliūčių'], ['bad', 'Kliūtis', 'Stulpai iš šono'], ['bg', 'Fonas', 'Už visko']],
    def: { hero: ['bird'], good: ['coin'], bad: ['pillar'], bg: ['bgDusk'] } },
};
const EFFECTS = [['+1', '+1 taškas', 'good'], ['+5', '+5 taškai', 'good'], ['-1', '-1 gyvybė', 'bad'], ['win', 'Laimėjai!', 'win'], ['lose', 'Pralaimėjai', 'bad'], ['none', 'Nieko', '']];
const AFTER = [['vanish', 'dingsta'], ['stay', 'lieka']];
const EVERY = [0.5, 1, 2, 3];
const GOALS = [5, 10, 20, 50];
const W1 = ['Obuolių', 'Vaiduoklių', 'Žvaigždžių', 'Pyragų', 'Katino', 'Drakono', 'Slaptas', 'Greitas', 'Linksmas'];
const W2 = ['lietus', 'namas', 'medžioklė', 'kelionė', 'nuotykis', 'fabrikas', 'kosmosas', 'miškas', 'lobis'];
// Idėjų kauliukas: tema visam žaidimui. wall = aukštas daiktas Skrisk kliūčiai, nes ji kartojasi stulpu.
const THEMES = [
  { n: 'Jūra', hero: 'žuvytę', good: 'perlą', bad: 'medūzą', wall: 'koralą', bg: 'jūros dugną' },
  { n: 'Kosmosas', hero: 'astronautą', good: 'žvaigždę', bad: 'meteoritą', wall: 'raketą', bg: 'kosmosą su planetomis' },
  { n: 'Saldainių šalis', hero: 'meškiuką', good: 'saldainį', bad: 'dantų šepetėlį', wall: 'ledinuko lazdelę', bg: 'saldainių kalnus' },
  { n: 'Dinozaurai', hero: 'dinozauriuką', good: 'kiaušinį', bad: 'ugnikalnio akmenį', wall: 'palmę', bg: 'džiungles' },
  { n: 'Ūkis', hero: 'kiaulytę', good: 'morką', bad: 'lapę', wall: 'tvorą', bg: 'ūkį su tvartu' },
  { n: 'Pilis', hero: 'riterį', good: 'karūną', bad: 'drakoną', wall: 'pilies bokštą', bg: 'pilį' },
  { n: 'Futbolas', hero: 'futbolininką', good: 'kamuolį', bad: 'raudoną kortelę', wall: 'vartų stulpą', bg: 'stadioną' },
  { n: 'Žiema', hero: 'sniego senį', good: 'snaigę', bad: 'varveklį', wall: 'eglę', bg: 'žiemos mišką' },
  { n: 'Robotai', hero: 'robotą', good: 'varžtą', bad: 'virusą', wall: 'laidų stulpą', bg: 'robotų fabriką' },
  { n: 'Miškas', hero: 'ežiuką', good: 'grybą', bad: 'vilką', wall: 'medį', bg: 'mišką' },
  { n: 'Picerija', hero: 'virėją', good: 'picą', bad: 'musę', wall: 'picų dėžių bokštą', bg: 'piceriją' },
  { n: 'Piratai', hero: 'piratą', good: 'auksinę monetą', bad: 'ryklį', wall: 'laivo stiebą', bg: 'lobių salą' },
  { n: 'Vaiduoklių namas', hero: 'vaiduokliuką', good: 'moliūgą', bad: 'šikšnosparnį', wall: 'seną bokštą', bg: 'naktinį namą' },
  { n: 'Gyvūnų parkas', hero: 'beždžionėlę', good: 'bananą', bad: 'krokodilą', wall: 'žirafą', bg: 'zoologijos sodą' },
];
const newId = () => 'g' + Math.random().toString(36).slice(2, 9);
function freshGame(tpl, seed) {
  const T = TPL[tpl], spr = {};
  Object.entries(T.def).forEach(([k, [kind, col]]) => { spr[k] = makeDef(kind, col, (seed || 3) + k.length); });
  return { id: newId(), v: 1, tpl, spr, words: [W1[(Math.random() * W1.length) | 0], W2[(Math.random() * W2.length) | 0]], author: '',
    rules: [{ a: 'hero', b: 'good', e: '+1', f: 'vanish' }, { a: 'hero', b: 'bad', e: '-1', f: 'vanish' }],
    every: [{ who: 'good', s: 1 }, { who: 'bad', s: 2 }], goal: 10, lives: 3, speed: 1 };
}
// savas pavadinimas (name) laimi prieš žodžių korteles
const title = (g) => (g.name || g.words.join(' ')).trim();

/* ---------- piešinių pagalbininkai ---------- */
// apkarpo piešinį iki jo ribų, kad mažas piešinys kampe žaidime nebūtų tuščias
function cropped(c) {
  const g = c.getContext('2d'), d = g.getImageData(0, 0, c.width, c.height).data;
  let x0 = c.width, y0 = c.height, x1 = -1, y1 = -1;
  for (let y = 0; y < c.height; y += 2) for (let x = 0; x < c.width; x += 2) if (d[(y * c.width + x) * 4 + 3] > 20) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  if (x1 < 0) return null;
  x0 = Math.max(0, x0 - 2); y0 = Math.max(0, y0 - 2); x1 = Math.min(c.width - 1, x1 + 2); y1 = Math.min(c.height - 1, y1 + 2);
  const o = mk(x1 - x0 + 1, y1 - y0 + 1); o.getContext('2d').drawImage(c, x0, y0, o.width, o.height, 0, 0, o.width, o.height); return o;
}
function thumb(c, w, h) {
  const isBg = c.width > c.height, t = mk(w * 2, h * 2), g = t.getContext('2d'), k = (isBg ? c : cropped(c)) || c;
  const s = isBg ? Math.max(t.width / k.width, t.height / k.height) : Math.min(t.width / k.width, t.height / k.height) * .9;
  g.imageSmoothingEnabled = false;
  g.drawImage(k, (t.width - k.width * s) / 2, (t.height - k.height * s) / 2, k.width * s, k.height * s);
  t.style.width = w + 'px'; t.style.height = h + 'px'; return t;
}
function fitCanvas(cv, maxDpr = 1.5) {
  const r = cv.getBoundingClientRect(), dpr = Math.min(maxDpr, window.devicePixelRatio || 1);
  const W = Math.max(40, Math.round(r.width)), H = Math.max(40, Math.round(r.height));
  cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); return [W, H, dpr];
}

/* ---------- išsaugojimas ir siuntimas ---------- */
const META = ['id', 'v', 'tpl', 'words', 'name', 'author', 'rules', 'every', 'goal', 'lives', 'speed', 'theme'];
const meta = (g) => { const o = {}; META.forEach((k) => { o[k] = g[k]; }); return JSON.parse(JSON.stringify(o)); };
// planšetės atmintyje: pilnas PNG, kad būtų galima toliau piešti
function toStore(g) { const o = meta(g); o.spr = {}; Object.keys(SIZE).forEach((k) => { o.spr[k] = g.spr[k].toDataURL('image/png'); }); return o; }
// į tinklą: sumažinti ir suspausti, kad žinutė būtų maža
function toWire(g) {
  const o = meta(g); o.spr = {};
  Object.keys(SIZE).forEach((k) => {
    const [w, h] = SIZE[k], c = mk(w / 2, h / 2), x = c.getContext('2d');
    if (k === 'bg') { x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); }
    x.imageSmoothingEnabled = false; x.drawImage(g.spr[k], 0, 0, c.width, c.height);
    o.spr[k] = c.toDataURL('image/png');
  });
  return o;
}
const img = (src) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = src; });
// iš duomenų atgal į žaidimą su drobėmis; neteisingus duomenis atmeta
const okRule = (r) => r && ['good', 'bad'].includes(r.b) && EFFECTS.some((e) => e[0] === r.e) && AFTER.some((a) => a[0] === r.f);
async function fromData(d) {
  if (!d || !TPL[d.tpl] || !d.spr) return null;
  const g = { id: String(d.id || newId()).slice(0, 16), v: +d.v || 1, tpl: d.tpl,
    words: (Array.isArray(d.words) ? d.words : ['Mano', 'žaidimas']).slice(0, 2).map((w) => String(w).slice(0, 20)),
    name: String(d.name || '').replace(/\s+/g, ' ').trim().slice(0, 28),
    author: String(d.author || '').replace(/\s+/g, ' ').trim().slice(0, 20),
    theme: Number.isInteger(d.theme) && d.theme >= 0 && d.theme < THEMES.length ? d.theme : null,
    rules: (Array.isArray(d.rules) ? d.rules : []).filter(okRule).slice(0, 2).map((r) => ({ a: 'hero', b: r.b, e: r.e, f: r.f })),
    every: (Array.isArray(d.every) ? d.every : []).filter((e) => e && ['good', 'bad'].includes(e.who) && EVERY.includes(+e.s)).slice(0, 2).map((e) => ({ who: e.who, s: +e.s })),
    goal: GOALS.includes(+d.goal) ? +d.goal : 10, lives: [1, 3, 5].includes(+d.lives) ? +d.lives : 3, speed: [.7, 1, 1.5].includes(+d.speed) ? +d.speed : 1, spr: {} };
  if (g.rules.length < 2) g.rules = freshGame(g.tpl).rules;
  if (g.every.length < 2) g.every = freshGame(g.tpl).every;
  for (const k of Object.keys(SIZE)) {
    const [w, h] = SIZE[k], c = mk(w, h), s = typeof d.spr[k] === 'string' && d.spr[k].startsWith('data:image/') ? await img(d.spr[k]) : null;
    const cx = c.getContext('2d'); cx.imageSmoothingEnabled = false;
    if (s) cx.drawImage(s, 0, 0, w, h); else cx.drawImage(makeDef(TPL[g.tpl].def[k][0]), 0, 0);
    g.spr[k] = c;
  }
  return g;
}

/* ---------- žaidimo variklis ---------- */
/* game: žaidimas, cv: drobė. hooks.onOver(win|lose), hooks.onInput(). auto: true = žaidžia pats (peržiūra kortelėje). */
function Game(game, cv, hooks = {}) {
  const T = game.tpl, spr = {}, tint = {}, colr = {};
  ['hero', 'good', 'bad'].forEach((k) => {
    const c = cropped(game.spr[k]) || game.spr[k];
    const pipe = T === 'skrisk' && k === 'bad';
    spr[k] = pipe ? c : sticker(c); colr[k] = mainColor(c);
    if (k === 'hero') tint[k] = silhouette(spr[k], 'rgba(255,70,80,.55)');
  });
  const st = { score: 0, lives: game.lives, items: [], parts: [], chips: [], t: 0, over: null, started: T !== 'skrisk', tx: null, ty: null, timers: {}, gapY: null, shake: 0 };
  let W = 600, H = 300, U = 30, dpr = 1, bgFit = null;
  const sized = new Map();
  const g = cv.getContext('2d');
  const hero = { x: 0, y: 0, vy: 0, s: 0, sq: 0, hurt: 0 };
  function resize() {
    [W, H, dpr] = fitCanvas(cv, hooks.auto ? 1 : 1.5); U = H / (H < 300 ? 6.5 : 9);
    bgFit = null; sized.clear();
    hero.s = U * (T === 'gaudyk' ? 1.9 : 1.6);
    hero.y = T === 'gaudyk' ? H - U * 1.2 : hero.y || H / 2;
    hero.x = hero.x || (T === 'skrisk' ? W * .25 : W / 2);
  }
  resize();
  const sp = game.speed;
  function spawn(who) {
    const s = U * (who === 'bad' && T === 'skrisk' ? 1.6 : 1.4), base = { who, s, born: st.t, rot: 0, spin: 0 };
    if (T === 'gaudyk') st.items.push({ ...base, x: s + Math.random() * (W - s * 2), y: -s, vx: 0, vy: U * (2.6 + Math.random()) * sp });
    else if (T === 'bek') {
      if (who === 'good') st.items.push({ ...base, x: s + Math.random() * (W - s * 2), y: s + Math.random() * (H - s * 2), vx: 0, vy: 0, life: 6 });
      else { const a = Math.random() * TAU; st.items.push({ ...base, x: Math.random() < .5 ? s : W - s, y: s + Math.random() * (H - s * 2), vx: Math.cos(a) * U * 3 * sp, vy: Math.sin(a) * U * 3 * sp }); }
    } else if (who === 'bad') {
      const gap = H * .42, gy = H * .2 + Math.random() * (H * .6 - gap * .5); st.gapY = gy;
      [['top', gy - gap / 2], ['bot', gy + gap / 2]].forEach(([col, y]) => st.items.push({ ...base, x: W + s, y, col, vx: -U * 3.2 * sp, vy: 0, w: s * 1.1 }));
    } else st.items.push({ ...base, x: W + s * 2.2, y: st.gapY ?? H / 2, vx: -U * 3.2 * sp, vy: 0 });
  }
  // spalvotas pliūpsnis ir skaičius, skrendantis į taškų skaitiklį
  function burst(x, y, col, n) {
    for (let i = 0; i < n; i++) { const a = Math.random() * TAU, v = U * (2.5 + Math.random() * 4); st.parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - U * 2, r: U * (.08 + Math.random() * .1), col: i % 3 ? col : '#ffffff', t: 0, life: .45 + Math.random() * .3 }); }
  }
  function apply(rule, it) {
    const e = rule.e;
    if (e === '+1' || e === '+5') { st.score += e === '+5' ? 5 : 1; hero.sq = 1; st.chips.push({ x: it.x, y: it.y, txt: e, t: 0, good: true }); burst(it.x, it.y, colr[it.who], 14); }
    else if (e === '-1') { st.lives -= 1; hero.hurt = 1; st.shake = 1; st.chips.push({ x: it.x, y: it.y, txt: '-1', t: 0, good: false }); burst(it.x, it.y, colr[it.who], 10); }
    else if (e === 'win') { st.over = 'win'; burst(hero.x, hero.y, '#ffd23f', 40); }
    else if (e === 'lose') { st.over = 'lose'; hero.hurt = 1; st.shake = 1; }
    if (rule.f === 'vanish') it.dead = true; else it.hitCd = .8;
    if (!st.over && st.score >= game.goal) { st.over = 'win'; burst(hero.x, hero.y, '#ffd23f', 40); }
    if (!st.over && st.lives <= 0) st.over = 'lose';
  }
  function hit(it) {
    if (it.col) { const top = it.col === 'top'; return Math.abs(hero.x - it.x) < it.w / 2 + hero.s * .3 && (top ? hero.y - hero.s * .3 < it.y : hero.y + hero.s * .3 > it.y); }
    return Math.hypot(hero.x - it.x, hero.y - it.y) < (hero.s + it.s) * .36;
  }
  let ended = false;
  function step(dt) {
    hero.sq = Math.max(0, hero.sq - dt / .28); hero.hurt = Math.max(0, hero.hurt - dt / .5); st.shake = Math.max(0, st.shake - dt / .3);
    st.parts.forEach((p) => { p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += U * 14 * dt; p.vx *= .97; });
    st.parts = st.parts.filter((p) => p.t < p.life);
    st.chips.forEach((c) => { c.t += dt; }); st.chips = st.chips.filter((c) => c.t < .7);
    if (st.over || !st.started) return;
    st.t += dt;
    game.every.forEach((ev, i) => { st.timers[i] = (st.timers[i] ?? ev.s * .5) - dt; if (st.timers[i] <= 0) { st.timers[i] += ev.s; spawn(ev.who); } });
    if (T === 'gaudyk' && st.tx != null) hero.x += (st.tx - hero.x) * Math.min(1, dt * 24);
    if (T === 'bek' && st.tx != null) { hero.x += (st.tx - hero.x) * Math.min(1, dt * 13); hero.y += (st.ty - hero.y) * Math.min(1, dt * 13); }
    if (T === 'skrisk') { hero.vy += U * 22 * dt; hero.y += hero.vy * dt; if (hero.y > H - hero.s * .4) { hero.y = H - hero.s * .4; hero.vy = 0; } if (hero.y < hero.s * .4) { hero.y = hero.s * .4; hero.vy = 0; } }
    hero.x = Math.max(hero.s * .4, Math.min(W - hero.s * .4, hero.x));
    if (T === 'bek') hero.y = Math.max(hero.s * .4, Math.min(H - hero.s * .4, hero.y));
    st.items.forEach((it) => {
      it.x += it.vx * dt; it.y += it.vy * dt; it.rot += it.spin * dt;
      if (T === 'bek' && it.who === 'bad') { if (it.x < it.s / 2 || it.x > W - it.s / 2) it.vx *= -1; if (it.y < it.s / 2 || it.y > H - it.s / 2) it.vy *= -1; }
      if (it.life != null) { it.life -= dt; if (it.life <= 0) it.dead = true; }
      if (it.hitCd) it.hitCd = Math.max(0, it.hitCd - dt);
      if (it.y > H + it.s * 2 || it.x < -it.s * 3) it.dead = true;
      if (!it.dead && !it.hitCd && !st.over && hit(it)) { const r = game.rules.find((x) => x.b === it.who); if (r) apply(r, it); }
    });
    st.items = st.items.filter((it) => !it.dead);
    if (st.over && !ended) { ended = true; hooks.onOver && hooks.onOver(st.over, st); }
  }
  const bgc = game.spr.bg;
  // fonas ir lipdukai paruošiami tikru ekrano dydžiu, kad kiekviename kadre nereikėtų mažinti didelių paveikslėlių
  function bgCanvas() {
    if (bgFit) return bgFit;
    const o = mk(Math.round(W * dpr), Math.round(H * dpr)), x = o.getContext('2d'), k = Math.max(o.width / bgc.width, o.height / bgc.height);
    x.imageSmoothingEnabled = false; x.drawImage(bgc, (o.width - bgc.width * k) / 2, (o.height - bgc.height * k) / 2, bgc.width * k, bgc.height * k);
    return (bgFit = o);
  }
  function sizedFor(c, s) {
    const key = c, want = Math.max(8, Math.round(s * 1.15 * dpr / 4) * 4), m = sized.get(key) || {};
    if (!m[want]) { const k = Math.min(want / c.width, want / c.height), o = mk(Math.max(1, Math.round(c.width * k)), Math.max(1, Math.round(c.height * k))); const ox = o.getContext('2d'); ox.imageSmoothingEnabled = false; ox.drawImage(c, 0, 0, o.width, o.height); m[want] = o; sized.set(key, m); }
    return m[want];
  }
  const backOut = (x) => 1 + 2.7 * Math.pow(x - 1, 3) + 1.7 * Math.pow(x - 1, 2);
  function drawSpr(c0, x, y, s, rot, sx = 1, sy = 1) { const c = sizedFor(c0, s), k = Math.min(s / c.width, s / c.height) * 1.12; g.save(); g.translate(x, y); if (rot) g.rotate(rot); g.scale(sx, sy); g.drawImage(c, -c.width * k / 2, -c.height * k / 2, c.width * k, c.height * k); g.restore(); }
  function draw() {
    g.setTransform(dpr, 0, 0, dpr, 0, 0); g.imageSmoothingEnabled = false;
    const sh = st.shake * st.shake * U * .12; if (sh) g.translate((Math.random() - .5) * sh * 2, (Math.random() - .5) * sh * 2);
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); if (sh) g.translate((Math.random() - .5) * sh * 2 * dpr, (Math.random() - .5) * sh * 2 * dpr); g.drawImage(bgCanvas(), 0, 0); g.restore();
    st.items.forEach((it) => {
      const c = spr[it.who];
      if (it.col) { // stulpas iš pasikartojančio piešinio
        const k2 = it.w / c.width, th = Math.max(8, c.height * k2), top = it.col === 'top';
        g.save(); g.beginPath(); if (top) g.rect(it.x - it.w / 2, 0, it.w, it.y); else g.rect(it.x - it.w / 2, it.y, it.w, H - it.y); g.clip();
        if (top) for (let y = it.y - th; y > -th; y -= th) g.drawImage(c, it.x - it.w / 2, y, it.w, th);
        else for (let y = it.y; y < H; y += th) g.drawImage(c, it.x - it.w / 2, y, it.w, th);
        g.restore();
      } else { const pop = Math.max(.01, backOut(Math.min(1, (st.t - it.born) / .3))); drawSpr(c, it.x, it.y, it.s, it.rot, pop, pop); }
    });
    // herojus: susispaudžia pagavęs, mažai alsuoja, paraudonuoja gavęs smūgį
    const tilt = T === 'skrisk' ? Math.max(-.4, Math.min(.5, hero.vy / (U * 20))) : 0;
    const q = Math.sin(hero.sq * Math.PI) * .18, br = Math.sin(st.t * 3) * .02;
    drawSpr(spr.hero, hero.x, hero.y, hero.s, tilt, 1 + q, 1 - q + br);
    if (hero.hurt) { g.globalAlpha = hero.hurt; drawSpr(tint.hero, hero.x, hero.y, hero.s, tilt, 1 + q, 1 - q + br); g.globalAlpha = 1; }
    st.parts.forEach((p) => { g.globalAlpha = Math.max(0, 1 - p.t / p.life); g.fillStyle = p.col; const z = p.r * 2 * (1 - p.t / p.life * .5); g.fillRect(p.x - z / 2, p.y - z / 2, z, z); });
    g.globalAlpha = 1;
    // skaičius skrenda į skaitiklį viršuje kairėje
    st.chips.forEach((c) => {
      const f = Math.min(1, c.t / .6), e = f * f * (3 - 2 * f), tx = c.good ? U * .9 : U * 2.4, ty = U * .55;
      const x = c.x + (tx - c.x) * e, y = c.y + (ty - c.y) * e - Math.sin(f * Math.PI) * U * 1.2, s = 1 - e * .45;
      g.save(); g.translate(x, y); g.scale(s, s); g.globalAlpha = f > .85 ? (1 - f) / .15 : 1;
      g.font = `700 ${U * .58}px "ZM Digits", "Pixelify Sans", monospace`; const w = g.measureText(c.txt).width + U * .5, h = U * .78, b = Math.max(2, U * .07);
      g.fillStyle = '#000'; g.fillRect(-w / 2 - b, -h / 2 - b, w + b * 2, h + b * 2);
      g.fillStyle = c.good ? '#5cbf3a' : '#e0402e'; g.fillRect(-w / 2, -h / 2, w, h);
      g.fillStyle = c.good ? '#8ee35f' : '#ff8a7a'; g.fillRect(-w / 2, -h / 2, w, b);
      g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(c.txt, 0, U * .04); g.restore();
    });
  }
  if (!hooks.auto) {
    const pt = (e) => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H]; };
    cv.onpointerdown = (e) => { cv.setPointerCapture(e.pointerId); const [x, y] = pt(e); if (T === 'skrisk') { st.started = true; hero.vy = -U * 7.5; hero.sq = .6; } else { st.tx = x; st.ty = y; } hooks.onInput && hooks.onInput(); };
    cv.onpointermove = (e) => { if (T === 'skrisk' || (e.pointerType === 'mouse' && !e.buttons)) return; const [x, y] = pt(e); st.tx = x; st.ty = y; };
  }
  // peržiūra: herojus juda pats, žaidimas niekada nesibaigia
  let at = Math.random() * 9;
  function autoplay(dt) {
    at += dt; st.started = true;
    if (T === 'skrisk') { if (Math.sin(at * 3.3) > .93) hero.vy = -hero.s * 3; }
    else { st.tx = hero.s + (Math.sin(at * .9) * .5 + .5) * (W - hero.s * 2); st.ty = H * (.5 + Math.sin(at * 1.3) * .3); }
    st.over = null; ended = false; st.lives = game.lives; if (st.score >= game.goal) st.score = 0;
  }
  let acc = 0;
  return { st, hero, resize, tick(dt) {
    if (hooks.auto) { acc += dt; if (acc < 1 / 30) return; dt = acc; acc = 0; autoplay(dt); }
    step(dt); draw();
  } };
}
// Kontūras: tamsus pikselinis kraštas ir kietas šešėlis aplink kiekvieną piešinį, kaip žaidimų daiktai
function silhouette(c, col) { const o = mk(c.width, c.height), x = o.getContext('2d'); x.drawImage(c, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = col; x.fillRect(0, 0, o.width, o.height); return o; }
function sticker(c) {
  const sz = Math.max(c.width, c.height), sc = Math.min(1, 256 / sz), w = Math.round(c.width * sc), h = Math.round(c.height * sc);
  const src = mk(w, h), sx = src.getContext('2d'); sx.imageSmoothingEnabled = false; sx.drawImage(c, 0, 0, w, h);
  const p = Math.max(4, Math.round(Math.max(w, h) / 32)), pad = p * 3;
  const o = mk(w + pad * 2, h + pad * 2), x = o.getContext('2d');
  const dark = silhouette(src, '#0e0c14');
  x.globalAlpha = .35; x.drawImage(dark, pad + p, pad + p * 2); x.globalAlpha = 1;
  for (const [dx, dy] of [[-p, 0], [p, 0], [0, -p], [0, p]]) x.drawImage(dark, pad + dx, pad + dy);
  x.drawImage(src, pad, pad);
  return o;
}
function mainColor(c) {
  const s = mk(24, 24), x = s.getContext('2d'); x.drawImage(c, 0, 0, 24, 24);
  const d = x.getImageData(0, 0, 24, 24).data; let r = 0, gg = 0, b = 0, n = 0;
  for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 200) { const sat = Math.max(d[i], d[i + 1], d[i + 2]) - Math.min(d[i], d[i + 1], d[i + 2]); const w = 1 + sat; r += d[i] * w; gg += d[i + 1] * w; b += d[i + 2] * w; n += w; }
  return n ? `rgb(${r / n | 0},${gg / n | 0},${b / n | 0})` : '#ffd23f';
}

root.ZD = { ready, THEMES, TPL, EFFECTS, AFTER, EVERY, GOALS, W1, W2, SIZE, freshGame, makeDef, title, cropped, thumb, fitCanvas, toStore, toWire, fromData, Game, newId, mk };
})(window);
