/* Robotų ringas: piešimas ir bendri UI gabalai (planšetė ir ekranas). Reikia engine.js. */
const $ = (s, r = document) => r.querySelector(s);
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function seeded(seed) { return () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
/* ---------- ikonos ---------- */
const SVG = {
  arti: (c) => `<path d="M10.5 12 L3 6 V18 Z M13.5 12 L21 6 V18 Z" fill="${c}"/>`,
  toli: (c) => `<path d="M1 12 L8 6 V18 Z M23 12 L16 6 V18 Z" fill="${c}"/><rect x="10" y="11" width="4" height="2.5" fill="${c}"/>`,
  puola: (c) => `<path d="M12 1 L15 8 L23 9 L17 14 L19 22 L12 18 L5 22 L7 14 L1 9 L9 8 Z" fill="${c}"/><rect x="10.8" y="6" width="2.6" height="7.5" fill="#1a1a22"/><rect x="10.8" y="15" width="2.6" height="2.6" fill="#1a1a22"/>`,
  energ: (c) => `<rect x="2" y="6" width="18" height="12" fill="none" stroke="${c}" stroke-width="2.5"/><rect x="20" y="9.5" width="3" height="5" fill="${c}"/><rect x="4.5" y="8.5" width="4" height="7" fill="#ff5a3a"/>`,
  gyvyb: (c) => `<path d="M12 21 L3 12 C-1 7 5 1 9.5 5 L12 7.5 L14.5 5 C19 1 25 7 21 12 Z" fill="none" stroke="${c}" stroke-width="2.4"/><path d="M6.5 15.5 H17.5 L12 21 Z" fill="#ff5a6a"/>`,
  virves: (c) => `<rect x="2" y="2" width="4" height="21" fill="${c}"/><rect x="6" y="6" width="17" height="2.4" fill="${c}"/><rect x="6" y="11" width="17" height="2.4" fill="${c}"/><rect x="6" y="16" width="17" height="2.4" fill="${c}"/>`,
  visada: (c) => `<path d="M6.5 7.5 C1.5 7.5 1.5 16.5 6.5 16.5 C10 16.5 14 7.5 17.5 7.5 C22.5 7.5 22.5 16.5 17.5 16.5 C14 16.5 10 7.5 6.5 7.5 Z" fill="none" stroke="${c}" stroke-width="3"/>`,
  pirmyn: (c) => `<path d="M23 12 L13 3 V8.5 H2 V15.5 H13 V21 Z" fill="${c}"/>`,
  atgal: (c) => `<path d="M1 12 L11 3 V8.5 H22 V15.5 H11 V21 Z" fill="${c}"/>`,
  smugis: (c) => `<path d="M4 7 H17 a3 3 0 0 1 3 3 V16 a3 3 0 0 1 -3 3 H7 a3 3 0 0 1 -3 -3 Z" fill="${c}"/><path d="M8.5 7 V11.5 M12.5 7 V11.5 M16.5 7 V11.5" stroke="#1a1a22" stroke-width="1.6"/><path d="M0 4 H3 M0 22 H3" stroke="${c}" stroke-width="2"/>`,
  suvis: (c) => `<circle cx="17" cy="12" r="5.5" fill="${c}"/><circle cx="18.5" cy="10.5" r="1.8" fill="#fff"/><path d="M1 9 H10 M3 15 H10 M5 12 H11" stroke="${c}" stroke-width="2.2"/>`,
  blokas: (c) => `<path d="M12 1 L21 5 V11 C21 17 17 21 12 23 C7 21 3 17 3 11 V5 Z" fill="${c}"/><path d="M12 5 L17 7.5 V11 C17 14.5 15 17 12 18.5 Z" fill="rgba(255,255,255,.35)"/>`,
  suolis: (c) => `<path d="M3 21 Q10 -3 19 15" fill="none" stroke="${c}" stroke-width="3"/><path d="M14.5 13 L20.5 19.5 L22.5 11 Z" fill="${c}"/><rect x="1" y="21" width="22" height="2" fill="${c}"/>`,
  ilsetis: (c) => `<path d="M3 4 H11 L3 12 H11" fill="none" stroke="${c}" stroke-width="2.6"/><path d="M13 12 H21 L13 20 H21" fill="none" stroke="${c}" stroke-width="2.6"/>`,
};
const svg = (k, c = '#fff') => `<svg viewBox="0 0 24 24" aria-hidden="true">${SVG[k](c)}</svg>`;
const COND = { arti: 'Priešas arti', toli: 'Priešas toli', puola: 'Priešas puola', energ: 'Mažai energijos', gyvyb: 'Mažai gyvybių', virves: 'Prie virvių', visada: 'Visada' };
const ACT = { pirmyn: 'Pirmyn', atgal: 'Atgal', smugis: 'Smūgis', suvis: 'Šūvis', blokas: 'Blokas', suolis: 'Šuolis', ilsetis: 'Ilsėkis' };
const ACLS = { pirmyn: 'a-move', atgal: 'a-move', smugis: 'a-hit', suvis: 'a-shot', blokas: 'a-block', suolis: 'a-jump', ilsetis: 'a-rest' };
const ACOL = { pirmyn: '#3f7fd8', atgal: '#3f7fd8', smugis: '#e0402e', suvis: '#e0782a', blokas: '#c9962a', suolis: '#4aa02c', ilsetis: '#8a5fd0' };
const TRAIT = {
  null: { n: 'Paprastas', d: '', s: [1, 1, 1] },
  greitas: { n: 'Greitas', d: 'žengia 1,5 karto toliau', s: [3, 1, 2] },
  stiprus: { n: 'Stiprus', d: '+40% smūgio jėgos', s: [1, 3, 2] },
  tvirtas: { n: 'Tvirtas', d: '120 gyvybių vietoj 100', s: [1, 2, 3] },
};
const IMG = {};
Object.keys(ACT).forEach((k) => { const im = new Image(); im.src = 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${SVG[k](ACOL[k])}</svg>`); IMG[k] = im; });
IMG.kerta = IMG.smugis; IMG.sauna = IMG.suvis;

/* ---------- pikselių robotas iš šono ---------- */
function makeCanvas(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d')); return c; }
function shade(hex, k) { const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255; const f = (v) => Math.max(0, Math.min(255, Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k))); return `rgb(${f(r)},${f(g)},${f(b)})`; }
const lerp = (a, b, f) => a + (b - a) * f;
const ease = (f) => (f < .5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2);
// x, y = pėdų vidurys; h = aukštis; face 1 = žiūri į dešinę
function drawFighter(g, x, y, h, col, pose, face, t, o = {}) {
  const u = h / 32, dark = shade(col, -.38), lite = shade(col, .3);
  g.save(); g.translate(x, y); g.scale(face, 1); g.imageSmoothingEnabled = false;
  if (pose === 'ko') { g.rotate(-Math.PI / 2 * .96); g.translate(-u * 4, u * 14); }
  const R = (gx, gy, gw, gh, c) => { g.fillStyle = c; g.fillRect((gx - 15) * u, (gy - 32) * u, gw * u, gh * u); };
  let by = 0, lean = 0;
  if (pose === 'rest') by = 5; if (pose === 'tired') by = 2; if (pose === 'windup' || pose === 'aim') lean = -1; if (pose === 'punch') lean = 1.5; if (pose === 'hurt') lean = -1.5;
  if (o.hurt) lean = -1.5;
  g.save(); g.translate(lean * u, 0);
  if (o.boss) { R(6, 13 + by, 4, 16, '#5a0f0c'); R(5, 15 + by, 2, 14, '#7a1a14'); }
  // kojos
  const wk = pose === 'walk' ? Math.sin(t * 14) * 1.6 : 0;
  if (pose === 'rest') { R(12, 28, 13, 4, '#2a2a30'); R(23, 28, 4, 4, '#4a4a55'); }
  else if (pose === 'jump') { R(10, 22, 4, 5, '#2a2a30'); R(17, 23, 4, 5, '#4a4a55'); }
  else { R(10 + wk, 24 + by, 4, 8 - by, '#2a2a30'); R(17 - wk, 24 + by, 4, 8 - by, '#4a4a55'); R(9 + wk, 30, 6, 2, '#1a1a20'); R(16 - wk, 30, 6, 2, '#1a1a20'); }
  // galinė ranka
  if (pose === 'block') R(19, 9 + by, 3, 12, dark); else R(6, 14 + by, 3, 9, dark);
  // korpusas ir galva
  R(8, 12 + by, 15, 13, col); R(8, 12 + by, 15, 2, lite); R(8, 23 + by, 15, 2, dark);
  R(11, 15 + by, 9, 7, '#8a8f9c'); R(14, 17 + by, 3, 3, pose === 'aim' ? '#ff8a3a' : '#4de8d6');
  const hd = pose === 'tired' ? 2 : pose === 'rest' ? 1 : 0;
  R(9, 2 + by + hd, 13, 10, col); R(9, 2 + by + hd, 13, 2, lite);
  R(15, 5 + by + hd, 7, 4, '#1a1a22');
  const blink = pose === 'rest' ? 1 : (Math.sin(t * 2.3 + x) > .97 ? 1 : 3);
  R(16, 6 + by + hd, 5, blink, o.boss ? '#ff5a3a' : '#7ff3ff');
  R(13, 0 + by + hd, 2, 2, '#c3c8d2'); R(12, -1 + by + hd, 4, 1, o.boss ? '#ffcc33' : '#ff5a8a');
  if (o.boss) { R(9, -2 + by, 2, 4, '#ffcc33'); R(13, -3 + by, 2, 3, '#ffcc33'); R(17, -2 + by, 2, 4, '#ffcc33'); R(9, 1 + by, 13, 1, '#ffcc33'); }
  // priekinė ranka pagal pozą
  const M = '#8a8f9c', MD = '#4a4a55';
  if (pose === 'windup') { R(3, 13 + by, 9, 4, col); R(-1, 12 + by, 5, 6, M); }
  else if (pose === 'punch') { R(19, 14 + by, 12, 4, col); R(30, 12 + by, 6, 7, M); g.globalAlpha = .5; R(22, 11 + by, 6, 1, '#fff'); R(20, 20 + by, 8, 1, '#fff'); g.globalAlpha = 1; }
  else if (pose === 'aim' || pose === 'shoot') {
    R(18, 14 + by, 12, 5, MD); R(29, 13 + by, 3, 7, M);
    const glow = pose === 'aim' ? .5 + .5 * Math.sin(t * 30) : 1;
    g.globalAlpha = glow; g.fillStyle = pose === 'shoot' ? '#fff3a0' : '#ff8a3a'; g.beginPath(); g.arc((33 - 15) * u, (16.5 + by - 32) * u, u * (pose === 'shoot' ? 3.2 : 2), 0, 7); g.fill(); g.globalAlpha = 1;
  }
  else if (pose === 'block') { R(22, 4 + by, 5, 18, M); R(22, 4 + by, 5, 2, '#c3c8d2'); }
  else if (pose === 'jump') { R(19, 6, 4, 9, col); R(19, 3, 5, 4, M); }
  else if (pose === 'rest') { R(17, 20 + by, 9, 3, col); }
  else if (pose === 'tired') { R(19, 16 + by, 4, 10, col); R(19, 25 + by, 4, 3, M); }
  else { R(18, 14 + by, 4, 9, col); R(18, 22 + by, 5, 4, M); }
  g.restore();
  if (pose === 'tired') { g.fillStyle = '#7ff3ff'; const d = (t * 2) % 1; g.fillRect((24 - 15) * u, (4 + d * 6 - 32) * u, u * 1.5, u * 2.5); }
  g.restore();
  if (pose === 'rest') { g.save(); g.font = `900 ${h * .2}px Nunito`; g.fillStyle = '#c0a0ff'; g.textAlign = 'center'; const k = (t * .8) % 1; g.globalAlpha = 1 - k; g.fillText('Z', x + face * h * .25, y - h * (1.05 + k * .3)); g.restore(); }
}
const portrait = (d, n = 64, pose = 'idle') => makeCanvas(n, n, (g) => drawFighter(g, n / 2, n * .97, n * .9, d.col, pose, 1, 0, { boss: d.boss }));

/* ---------- ringas ---------- */
const bgCache = {};
function ringBg(W, H) {
  const k = W + 'x' + H; if (bgCache[k]) return bgCache[k];
  const rnd = seeded(5);
  return (bgCache[k] = makeCanvas(W * 2, H * 2, (g) => {
    g.scale(2, 2);
    const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#0a0818'); gr.addColorStop(1, '#1c1636'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    const skins = ['#f1c9a5', '#d9a07a', '#a8714f', '#f5d7bd'], shirts = ['#2f5fa8', '#a8302a', '#3a7a22', '#9a7420', '#6a4aa0', '#1f6f66', '#9a3a6a'];
    for (let r = 0; r < 5; r++) {
      const yy = H * (.1 + r * .075), s = H * (.032 + r * .005), dim = .18 + r * .07;
      for (let x = -s; x < W + s; x += s * 1.7) {
        const xx = x + (r % 2) * s * .8 + rnd() * s * .4;
        g.globalAlpha = dim; g.fillStyle = shirts[(rnd() * shirts.length) | 0]; g.fillRect(xx - s * .7, yy + s * .55, s * 1.4, s * 1.2);
        g.fillStyle = skins[(rnd() * skins.length) | 0]; g.fillRect(xx - s * .45, yy - s * .2, s * .9, s * .85);
        g.fillStyle = rnd() > .5 ? '#3a2a1c' : '#1a1410'; g.fillRect(xx - s * .5, yy - s * .3, s, s * .3);
      }
    }
    g.globalAlpha = 1;
    const fy = H * .8, x0 = W * .05, x1 = W * .95;
    g.fillStyle = '#2a2734'; g.fillRect(x0 - W * .02, fy, x1 - x0 + W * .04, H * .13);
    for (let x = x0 - W * .02; x < x1 + W * .02; x += H * .045) { g.fillStyle = (x / (H * .045) | 0) % 2 ? '#3b3846' : '#33303e'; g.fillRect(x, fy + H * .02, H * .045, H * .11); }
    g.fillStyle = '#d9d2c4'; g.fillRect(x0, fy - H * .012, x1 - x0, H * .022);
    g.fillStyle = '#b8b0a2'; g.fillRect(x0, fy + H * .006, x1 - x0, H * .006);
    g.fillStyle = '#e0402e'; g.fillRect(x0 - W * .02, fy + H * .012, x1 - x0 + W * .04, H * .012);
  }));
}
const RX = (W, x) => W * .07 + (x / 10) * W * .86;
function drawRing(g, W, H, w, frac, t, opts = {}) {
  g.drawImage(ringBg(W, H), 0, 0, W, H);
  const fy = H * .8, e = ease(Math.min(1, frac)), fh = Math.min(H * (opts.fh || .36), W * .086 * 1.9);
  // prožektoriai
  g.save(); g.globalCompositeOperation = 'lighter';
  [.3, .7].forEach((p, i) => { const cx = W * p + Math.sin(t * .7 + i * 2) * W * .05; const gr = g.createLinearGradient(0, 0, 0, fy); gr.addColorStop(0, 'rgba(255,240,200,.0)'); gr.addColorStop(1, 'rgba(255,240,200,.09)'); g.fillStyle = gr; g.beginPath(); g.moveTo(W * p, 0); g.lineTo(cx - W * .13, fy); g.lineTo(cx + W * .13, fy); g.fill(); });
  g.restore();
  // virvės už kovotojų
  const ropeY = [.5, .62, .72].map((k) => fy - H * (k - .38) * 1.05);
  ['#e0402e', '#f3f0f7', '#3f7fd8'].forEach((c, i) => { g.fillStyle = '#000'; g.fillRect(W * .05, ropeY[i] - H * .004 + 2, W * .9, H * .01); g.fillStyle = c; g.fillRect(W * .05, ropeY[i] - H * .004, W * .9, H * .008); });
  // šešėliai ir kovotojai
  w.f.forEach((f, i) => {
    const X = RX(W, lerp(f.px, f.x, e));
    g.fillStyle = 'rgba(0,0,0,.4)'; g.beginPath(); g.ellipse(X, fy + H * .004, fh * .3, fh * .05, 0, 0, 7); g.fill();
  });
  w.f.forEach((f, i) => {
    const X = RX(W, lerp(f.px, f.x, e)), face = f.x < w.f[1 - i].x ? 1 : -1;
    let pose = poseOf(f), jy = 0;
    if (pose === 'jump') { const arc = f.jumpT === 1 ? frac * .5 : .5 + Math.min(1, frac) * .5; jy = -Math.sin(arc * Math.PI) * fh * .5; }
    const hurt = f.hurt && frac < .35;
    drawFighter(g, X, fy + jy, fh * (f.boss ? 1.12 : 1), f.col, pose, face, t, { boss: f.boss });
    if (hurt) { g.save(); g.globalAlpha = .5 * (1 - frac / .35); g.fillStyle = '#fff'; g.fillRect(X - fh * .35, fy + jy - fh, fh * .7, fh); g.restore(); }
    if (f.block) { const a0 = face > 0 ? 0 : Math.PI, k = Math.PI / 2.6; g.save(); g.strokeStyle = '#ffe08a'; g.lineWidth = fh * .03; g.globalAlpha = .7 + .3 * Math.sin(t * 14); g.beginPath(); g.arc(X, fy + jy - fh * .5, fh * .5, a0 - k, a0 + k); g.stroke(); g.restore(); }
    // veiksmo burbulas
    if (opts.bubbles !== false && f.act && f.hp > 0) {
      const bw = fh * .26, bx = X - bw / 2, byy = fy + jy - fh * 1.32;
      g.fillStyle = '#fff'; g.strokeStyle = '#000'; g.lineWidth = 2;
      g.beginPath(); g.rect(bx, byy, bw, bw); g.moveTo(X - bw * .12, byy + bw); g.lineTo(X, byy + bw * 1.2); g.lineTo(X + bw * .12, byy + bw); g.fill(); g.stroke();
      if (f.act === 'atsigauna' || f.act === 'stovi') return; const im = IMG[f.act];
      if (im) g.drawImage(im, bx + bw * .14, byy + bw * .14, bw * .72, bw * .72);
      else { g.font = `900 ${bw * .42}px Nunito`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#777'; g.fillText(f.act === 'pavargo' ? '...' : f.act === 'atsigauna' ? '~' : '?', X, byy + bw / 2); g.textBaseline = 'alphabetic'; }
    }
  });
  // šūviai
  w.shots.forEach((s) => {
    const X = RX(W, lerp(s.px, s.x, e)), Y = fy - fh * .5, r = fh * .07;
    g.save(); g.globalCompositeOperation = 'lighter';
    for (let k = 1; k <= 4; k++) { g.globalAlpha = .25 / k; g.fillStyle = s.col; g.beginPath(); g.arc(X - s.dir * r * k * 1.4, Y, r * (1.1 - k * .15), 0, 7); g.fill(); }
    g.globalAlpha = 1; g.fillStyle = '#fff'; g.beginPath(); g.arc(X, Y, r * .6, 0, 7); g.fill(); g.fillStyle = s.col; g.beginPath(); g.arc(X, Y, r, 0, 7); g.globalAlpha = .6; g.fill(); g.restore();
  });
  // efektai
  w.fx.forEach((f) => {
    const X = RX(W, f.x);
    if (f.k === 'spark' && f.t < .35) { g.save(); g.globalAlpha = 1 - f.t / .35; g.fillStyle = f.col; for (let i = 0; i < 8; i++) { const a = i * .785 + .3, r = fh * (.06 + f.t * .6); g.fillRect(X + Math.cos(a) * r - fh * .02, fy - fh * .55 + Math.sin(a) * r - fh * .02, fh * .04, fh * .04); } g.restore(); }
    if ((f.k === 'dmg' || f.k === 'txt') && f.t < .95) {
      g.save(); g.globalAlpha = Math.min(1, (.95 - f.t) * 3); const yy = fy - fh * (1.05 + f.t * .5) - (f.k === 'txt' ? fh * .18 : 0);
      g.font = `900 ${fh * (f.k === 'dmg' ? .2 : .13)}px Nunito`; g.textAlign = 'center';
      g.fillStyle = '#000'; g.fillText(f.s, X + 3, yy + 3); g.fillStyle = f.k === 'dmg' ? '#ff5a3a' : f.col; g.fillText(f.s, X, yy); g.restore();
    }
  });
  // stulpai priekyje
  [W * .05, W * .95].forEach((x) => { g.fillStyle = '#000'; g.fillRect(x - H * .018, fy - H * .38, H * .036, H * .38); g.fillStyle = '#8a8f9c'; g.fillRect(x - H * .013, fy - H * .375, H * .026, H * .37); g.fillStyle = '#c9962a'; g.fillRect(x - H * .02, fy - H * .4, H * .04, H * .03); });
}
function poseOf(f) {
  if (f.hp <= 0) return 'ko';
  if (f.wind) return f.wind === 'smugis' ? 'windup' : 'aim';
  return { kerta: 'punch', sauna: 'shoot', blokas: 'block', suolis: 'jump', ilsetis: 'rest', pavargo: 'tired', pirmyn: 'walk', atgal: 'walk' }[f.act] || 'idle';
}

/* ---------- HUD ---------- */
function fpHTML(id, side) {
  return `<div class="fp ${side}" id="${id}"><div class="who"><span class="pt"></span><b class="nm"></b><small class="kd"></small></div>
    <div class="bar"><i class="hp"></i><span class="hpt"></span></div><div class="ebar"><i class="en"></i></div><div class="strip"></div></div>`;
}
function fpInit(el, f, d) {
  el.querySelector('.pt').append(portrait(d, 40)); el.querySelector('.nm').textContent = d.name; el.querySelector('.nm').style.color = d.col;
  el.querySelector('.kd').textContent = d.kid === 'Kompiuteris' ? '(kompiuteris)' : d.kid ? '· ' + d.kid : '';
  el.querySelector('.strip').innerHTML = d.rules.map((r, i) => `<span class="rc" data-i="${i}"><em>${i + 1}</em><i class="c-cond">${svg(r.c)}</i><i class="${ACLS[r.a]}">${svg(r.a)}</i></span>`).join('');
}
function fpUpdate(el, f) {
  const p = Math.max(0, f.hp / f.max * 100), hp = el.querySelector('.hp');
  hp.style.width = p + '%'; hp.classList.toggle('half', p < 60 && p >= 30); hp.classList.toggle('low', p < 30);
  el.querySelector('.hpt').textContent = `${f.hp} / ${f.max}`;
  const en = el.querySelector('.en'); en.style.width = Math.max(0, f.en) + '%'; en.classList.toggle("low", f.en < RR.R.LOWE);
  el.querySelectorAll('.rc').forEach((c) => c.classList.toggle('on', +c.dataset.i === f.fired));
}
function fitCanvas(cv) {
  const r = cv.parentElement.getBoundingClientRect(), W = Math.max(50, Math.floor(r.width)), H = Math.max(50, Math.floor(r.height));
  cv.width = W * 2; cv.height = H * 2; cv.style.width = W + 'px'; cv.style.height = H + 'px'; return [W, H];
}
// paleidžia raundą: grąžina tiko funkciją kadrui
function runner(w, onEnd, opts = {}) {
  const st = { acc: 0, frac: 1, t: 0, speed: 1, running: false, endAt: 0 };
  st.step = () => { w.tick(); st.frac = 0; opts.onTick && opts.onTick(); };
  st.frame = (dt) => {
    st.t += dt; const d = dt * st.speed; st.frac += d / .4;
    w.fx.forEach((f) => { f.t += d; }); w.fx = w.fx.filter((f) => f.t < 1);
    if (st.running && !w.over) { st.acc += d; if (st.acc >= .5) { st.acc -= .5; st.step(); } }
    if (w.over && !st.endAt) st.endAt = st.t + 1.8;
    if (st.endAt && st.t > st.endAt && onEnd) { const f = onEnd; onEnd = null; f(); }
  };
  return st;
}
/* ---------- taisyklių redaktorius ---------- */
function ruleEditor(box, ovHost, rules, onChange, compact) {
  function render() {
    box.classList.toggle('compact', !!compact);
    box.innerHTML = rules.map((r, i) => `<div class="rule"><span class="num">${i + 1}</span><span class="kw">JEI</span>
      <button class="btn pick c-cond" data-i="${i}" data-p="c">${svg(r.c)}${COND[r.c]}</button><span class="kw">TAI</span>
      <button class="btn pick ${ACLS[r.a]}" data-i="${i}" data-p="a">${svg(r.a)}${ACT[r.a]}</button>
      <div class="ord"><button class="btn" data-up="${i}" ${i ? '' : 'disabled'} aria-label="Aukštyn">▲</button><button class="btn" data-dn="${i}" ${i < rules.length - 1 ? '' : 'disabled'} aria-label="Žemyn">▼</button></div>
      <button class="btn del" data-x="${i}" aria-label="Ištrinti">✕</button></div>`).join('') +
      (rules.length < 5 ? '<button class="btn addrule" data-add="1">+ Nauja taisyklė</button>' : '');
    onChange && onChange();
  }
  function picker(i, part) {
    const opts = part === 'c' ? COND : ACT;
    ovHost.innerHTML = `<div class="ov"><div class="panel"><h2>${part === 'c' ? 'Kada?' : 'Ką daryti?'}</h2>
      <div class="choices">${Object.keys(opts).map((k) => `<button class="btn choice ${part === 'c' ? 'c-cond' : ACLS[k]}" data-k="${k}">${svg(k)}${opts[k]}</button>`).join('')}</div></div></div>`;
    ovHost.onclick = (e) => { const b = e.target.closest('[data-k]'); if (b) rules[i][part] = b.dataset.k; ovHost.innerHTML = ''; ovHost.onclick = null; render(); };
  }
  box.onclick = (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.add) { rules.push({ c: 'visada', a: 'pirmyn' }); render(); return; }
    if (b.dataset.p) { picker(+b.dataset.i, b.dataset.p); return; }
    if (b.dataset.up) { const i = +b.dataset.up; [rules[i - 1], rules[i]] = [rules[i], rules[i - 1]]; }
    if (b.dataset.dn) { const i = +b.dataset.dn; [rules[i + 1], rules[i]] = [rules[i], rules[i + 1]]; }
    if (b.dataset.x) rules.splice(+b.dataset.x, 1);
    render();
  };
  render();
}
function truleHTML(rules, f) {
  return rules.map((x, i) => {
    const st = !f || f.checked.length === 0 ? '' : i === f.fired ? 'fire' : i < f.checked.length ? 'no' : 'skip';
    return `<div class="trule ${st}"><span class="kw">${i + 1}</span><span class="tag c-cond">${svg(x.c)}${COND[x.c]}</span><span class="kw">→</span><span class="tag ${ACLS[x.a]}">${svg(x.a)}${ACT[x.a]}</span><span class="mark">${st === 'fire' ? '✓' : st === 'no' ? '✗' : ''}</span></div>`;
  }).join('');
}
