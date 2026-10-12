/* Žaidimų dirbtuvės: pavyzdiniai piešiniai, žaidimų šablonai, žaidimo variklis ir išsaugojimas.
   Bendras planšetei (index.html) ir klasės arkadai (ekranas.html). */
(function (root) {
const TAU = Math.PI * 2;
const INK = '#16183a';
const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
function rng(seed) { seed = (seed % 2147483646) + 1; return () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }; }

/* ---------- mokytojo pavyzdžiai: ranka pieštos figūros ---------- */
function wob(g, pts, close, r) {
  g.beginPath();
  pts.forEach(([x, y], i) => { const jx = x + (r() - .5) * 3, jy = y + (r() - .5) * 3; i ? g.lineTo(jx, jy) : g.moveTo(jx, jy); });
  if (close) g.closePath();
}
const circ = (cx, cy, rx, ry, n = 28) => Array.from({ length: n }, (_, i) => [cx + Math.cos(i / n * TAU) * rx, cy + Math.sin(i / n * TAU) * ry]);
function shape(g, pts, fill, r, lw = 9) { wob(g, pts, true, r); if (fill) { g.fillStyle = fill; g.fill(); } g.lineWidth = lw; g.strokeStyle = INK; g.lineJoin = g.lineCap = 'round'; g.stroke(); }
function line(g, pts, r, col = INK, lw = 9) { wob(g, pts, false, r); g.lineWidth = lw; g.strokeStyle = col; g.lineJoin = g.lineCap = 'round'; g.stroke(); }
function face(g, x, y, s, r) { g.fillStyle = INK; [-1, 1].forEach((d) => { g.beginPath(); g.arc(x + d * s * .32, y - s * .1, s * .09, 0, TAU); g.fill(); }); line(g, [[x - s * .25, y + s * .18], [x, y + s * .3], [x + s * .25, y + s * .18]], r, INK, 7); }
const DEF = {
  blob: (g, c, r) => { line(g, [[50, 140], [20, 110]], r); line(g, [[206, 140], [236, 110]], r); shape(g, circ(128, 140, 82, 78), c, r); face(g, 128, 140, 120, r); line(g, [[95, 216], [90, 246]], r); line(g, [[161, 216], [166, 246]], r); },
  apple: (g, c, r) => { shape(g, circ(128, 146, 86, 80), c, r); line(g, [[128, 70], [136, 34]], r, '#7a4a1c', 11); shape(g, [[138, 50], [190, 30], [176, 66]], '#3fbf5f', r, 7); g.fillStyle = 'rgba(255,255,255,.6)'; g.beginPath(); g.ellipse(92, 116, 14, 22, -.5, 0, TAU); g.fill(); },
  spike: (g, c, r) => { const p = []; for (let i = 0; i < 18; i++) { const a = i / 18 * TAU, rr = i % 2 ? 62 : 104; p.push([128 + Math.cos(a) * rr, 128 + Math.sin(a) * rr]); } shape(g, p, c, r); g.fillStyle = '#fff'; [-1, 1].forEach((d) => { g.beginPath(); g.arc(128 + d * 26, 118, 16, 0, TAU); g.fill(); }); g.fillStyle = INK; [-1, 1].forEach((d) => { g.beginPath(); g.arc(128 + d * 24, 122, 8, 0, TAU); g.fill(); }); line(g, [[100, 160], [118, 150], [138, 162], [156, 150]], r, INK, 7); },
  star: (g, c, r) => { const p = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i / 10 * TAU, rr = i % 2 ? 46 : 108; p.push([128 + Math.cos(a) * rr, 136 + Math.sin(a) * rr]); } shape(g, p, c, r); },
  ghost: (g, c, r) => { const p = [[52, 230], [52, 120]]; for (let i = 0; i <= 12; i++) { const a = Math.PI + i / 12 * Math.PI; p.push([128 + Math.cos(a) * 76, 120 + Math.sin(a) * 86]); } p.push([204, 230], [178, 206], [154, 232], [128, 206], [102, 232], [78, 206]); shape(g, p, c, r); face(g, 128, 120, 110, r); },
  cat: (g, c, r) => { shape(g, [[70, 90], [84, 28], [118, 70]], c, r); shape(g, [[186, 90], [172, 28], [138, 70]], c, r); shape(g, circ(128, 134, 88, 82), c, r); face(g, 128, 134, 120, r); shape(g, [[30, 150], [6, 112], [58, 128]], '#fff', r, 7); shape(g, [[226, 150], [250, 112], [198, 128]], '#fff', r, 7); },
  pipe: (g, c, r) => { shape(g, [[70, 4], [186, 4], [186, 252], [70, 252]], c, r); for (let y = 30; y < 250; y += 46) line(g, [[80, y], [176, y + 10]], r, 'rgba(22,24,58,.35)', 6); },
  bgMeadow: (g, c, r, w, h) => { g.fillStyle = c; g.fillRect(0, 0, w, h); g.fillStyle = '#8fd694'; wob(g, [[0, h * .72], [w * .25, h * .62], [w * .5, h * .7], [w * .75, h * .6], [w, h * .7], [w, h], [0, h]], true, r); g.fill(); g.lineWidth = 6; g.strokeStyle = INK; g.stroke(); shape(g, circ(w * .86, h * .2, 26, 26), '#ffd23f', r, 6); },
  bgNight: (g, c, r, w, h) => { g.fillStyle = c; g.fillRect(0, 0, w, h); const q = rng(9); for (let i = 0; i < 40; i++) { g.fillStyle = '#fff'; g.fillRect(q() * w, q() * h * .8, 4, 4); } shape(g, circ(w * .14, h * .2, 24, 24), '#fff6c2', r, 6); },
  bgSky: (g, c, r, w, h) => { g.fillStyle = c; g.fillRect(0, 0, w, h); [[.2, .25], [.6, .18], [.85, .4]].forEach(([x, y]) => shape(g, circ(w * x, h * y, 34, 17, 16), '#fff', r, 5)); },
};
const SIZE = { bg: [1024, 512], hero: [256, 256], good: [256, 256], bad: [256, 256] };
// Pavyzdiniai paveikslėliai: molio stiliaus Blender piešiniai (assets/). Jei neužsikrauna, piešiama paprasta figūra.
const BASE = (document.currentScript && document.currentScript.src || location.href).replace(/[^/]*$/, '');
const ART = { blob: 'hero-blob', mint: 'hero-blob', cat: 'hero-bird', apple: 'apple', spike: 'spike', star: 'star', ghost: 'ghost', pipe: 'pillar', bgMeadow: 'bg-meadow', bgNight: 'bg-night', bgSky: 'bg-sky' };
const PICS = {};
const ready = Promise.all([...new Set(Object.values(ART))].map((n) => new Promise((ok) => {
  const i = new Image(); i.onload = () => { PICS[n] = i; ok(); }; i.onerror = () => ok(); i.src = BASE + 'assets/' + n + (n.startsWith('bg-') ? '.webp' : '.png');
})));
function makeDef(kind, col, seed) {
  const isBg = kind.startsWith('bg'), [w, h] = isBg ? SIZE.bg : SIZE.hero;
  const c = mk(w, h), g = c.getContext('2d'), pic = PICS[ART[kind]];
  if (pic) {
    if (kind === 'mint') g.filter = 'hue-rotate(115deg) saturate(1.1)';
    const k = isBg ? Math.max(w / pic.width, h / pic.height) : Math.min(w / pic.width, h / pic.height) * (kind === 'pipe' ? 1 : .94);
    g.drawImage(pic, (w - pic.width * k) / 2, (h - pic.height * k) / 2, pic.width * k, pic.height * k);
    return c;
  }
  DEF[kind === 'mint' ? 'blob' : kind](g, col, rng(seed || 7), w, h);
  return c;
}

/* ---------- šablonai ir taisyklės ---------- */
const TPL = {
  gaudyk: { name: 'Gaudyk', about: 'Daiktai krenta iš viršaus. Gaudyk gerus, venk blogų.', ctrl: 'Vesk pirštu į šonus',
    slots: [['hero', 'Herojus', 'Tu jį valdai'], ['good', 'Gaudyk', 'Krenta iš viršaus'], ['bad', 'Venk', 'Irgi krenta'], ['bg', 'Fonas', 'Už visko']],
    def: { hero: ['blob', '#ffd23f'], good: ['apple', '#ff5a5f'], bad: ['spike', '#8a5cf6'], bg: ['bgMeadow', '#bfe3ff'] } },
  bek: { name: 'Bėk', about: 'Rink daiktus visame lauke, o priešai lakstys aplink.', ctrl: 'Vesk pirštu, herojus seka',
    slots: [['hero', 'Herojus', 'Tu jį valdai'], ['good', 'Rink', 'Atsiranda bet kur'], ['bad', 'Priešas', 'Laksto aplink'], ['bg', 'Fonas', 'Už visko']],
    def: { hero: ['mint', '#7be0c8'], good: ['star', '#ffd23f'], bad: ['ghost', '#ffffff'], bg: ['bgNight', '#2a2f6b'] } },
  skrisk: { name: 'Skrisk', about: 'Bakstelk ir herojus pakyla. Praskrisk pro kliūtis.', ctrl: 'Bakstelk, kad pakiltum',
    slots: [['hero', 'Herojus', 'Tu jį valdai'], ['good', 'Rink', 'Tarp kliūčių'], ['bad', 'Kliūtis', 'Stulpai iš šono'], ['bg', 'Fonas', 'Už visko']],
    def: { hero: ['cat', '#ff9f43'], good: ['star', '#ffd23f'], bad: ['pipe', '#3fbf5f'], bg: ['bgSky', '#bfe3ff'] } },
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
function toStore(g) { const o = meta(g); o.spr = {}; Object.keys(SIZE).forEach((k) => { let u = k === 'bg' ? g.spr[k].toDataURL('image/webp', .92) : ''; if (!u.startsWith('data:image/webp')) u = g.spr[k].toDataURL('image/png'); o.spr[k] = u; }); return o; }
// į tinklą: sumažinti ir suspausti, kad žinutė būtų maža
function toWire(g) {
  const o = meta(g); o.spr = {};
  Object.keys(SIZE).forEach((k) => {
    const [w, h] = SIZE[k], c = mk(w * .625, h * .625), x = c.getContext('2d');
    if (k === 'bg') { x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); }
    x.drawImage(g.spr[k], 0, 0, c.width, c.height);
    let u = c.toDataURL('image/webp', .82);
    if (!u.startsWith('data:image/webp')) u = c.toDataURL('image/png');
    o.spr[k] = u;
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
    if (s) c.getContext('2d').drawImage(s, 0, 0, w, h); else { const [kind, col] = TPL[g.tpl].def[k]; c.getContext('2d').drawImage(makeDef(kind, col, 3), 0, 0); }
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
    if (T === 'gaudyk') st.items.push({ ...base, x: s + Math.random() * (W - s * 2), y: -s, vx: 0, vy: U * (2.6 + Math.random()) * sp, spin: (Math.random() - .5) * 1.6 });
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
    x.drawImage(bgc, (o.width - bgc.width * k) / 2, (o.height - bgc.height * k) / 2, bgc.width * k, bgc.height * k);
    return (bgFit = o);
  }
  function sizedFor(c, s) {
    const key = c, want = Math.max(8, Math.round(s * 1.15 * dpr / 4) * 4), m = sized.get(key) || {};
    if (!m[want]) { const k = Math.min(want / c.width, want / c.height), o = mk(Math.max(1, Math.round(c.width * k)), Math.max(1, Math.round(c.height * k))); o.getContext('2d').drawImage(c, 0, 0, o.width, o.height); m[want] = o; sized.set(key, m); }
    return m[want];
  }
  const backOut = (x) => 1 + 2.7 * Math.pow(x - 1, 3) + 1.7 * Math.pow(x - 1, 2);
  function drawSpr(c0, x, y, s, rot, sx = 1, sy = 1) { const c = sizedFor(c0, s), k = Math.min(s / c.width, s / c.height) * 1.12; g.save(); g.translate(x, y); if (rot) g.rotate(rot); g.scale(sx, sy); g.drawImage(c, -c.width * k / 2, -c.height * k / 2, c.width * k, c.height * k); g.restore(); }
  function draw() {
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
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
    st.parts.forEach((p) => { g.globalAlpha = Math.max(0, 1 - p.t / p.life); g.fillStyle = p.col; g.beginPath(); g.arc(p.x, p.y, p.r * (1 - p.t / p.life * .5), 0, TAU); g.fill(); });
    g.globalAlpha = 1;
    // skaičius skrenda į skaitiklį viršuje kairėje
    st.chips.forEach((c) => {
      const f = Math.min(1, c.t / .6), e = f * f * (3 - 2 * f), tx = c.good ? U * .9 : U * 2.4, ty = U * .55;
      const x = c.x + (tx - c.x) * e, y = c.y + (ty - c.y) * e - Math.sin(f * Math.PI) * U * 1.2, s = 1 - e * .45;
      g.save(); g.translate(x, y); g.scale(s, s); g.globalAlpha = f > .85 ? (1 - f) / .15 : 1;
      g.font = `800 ${U * .62}px "Baloo 2", sans-serif`; const w = g.measureText(c.txt).width + U * .5, h = U * .78;
      g.fillStyle = c.good ? '#2bb673' : '#ff5a5f'; g.beginPath(); g.roundRect(-w / 2, -h / 2, w, h, h / 2); g.fill();
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
// Lipdukas: balti iškirpto lipduko kraštai ir švelnus šešėlis aplink vaiko piešinį
function silhouette(c, col) { const o = mk(c.width, c.height), x = o.getContext('2d'); x.drawImage(c, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = col; x.fillRect(0, 0, o.width, o.height); return o; }
function sticker(c) {
  const sz = Math.max(c.width, c.height), sc = Math.min(1, 220 / sz), w = Math.round(c.width * sc), h = Math.round(c.height * sc);
  const src = mk(w, h); src.getContext('2d').drawImage(c, 0, 0, w, h);
  const p = Math.max(5, Math.round(Math.max(w, h) * .045)), pad = p * 3;
  const o = mk(w + pad * 2, h + pad * 2), x = o.getContext('2d');
  const white = silhouette(src, '#ffffff');
  const ring = mk(o.width, o.height), r = ring.getContext('2d');
  for (let i = 0; i < 24; i++) { const a = i / 24 * TAU; r.drawImage(white, pad + Math.cos(a) * p, pad + Math.sin(a) * p); }
  r.drawImage(white, pad, pad);
  x.save(); x.filter = `blur(${p * .8}px)`; x.globalAlpha = .35; x.drawImage(silhouette(ring, '#16183a'), 0, p * .9); x.restore();
  x.drawImage(ring, 0, 0); x.drawImage(src, pad, pad);
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
