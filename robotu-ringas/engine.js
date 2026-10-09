/* Robotų ringas: kovos taisyklės. Vienas failas planšetei, ekranui ir node testams. */
(function (root) {
// ENGINE START
/* Robotų ringas: 1D ringas 0..10, tikas 0,5 s. Kiekvieną tiką robotas tikrina taisykles iš viršaus, suveikia pirma tinkama.
   Smūgis ir šūvis turi 1 tiko užsimojimą, todėl priešas gali pamatyti "Priešas puola" ir blokuoti ar pašokti. */
const R = { TICKS: 40, ARTI: 1.5, TOLI: 4, REGEN: 4, LOWE: 25, LOWHP: 30, PUNCH: 10, PUNCH_E: 12, SHOT: 7, SHOT_E: 20, SHOT_V: 2,
  BLOCK_E: 4, JUMP_E: 10, REST: 20, MOVE: 1, FAST: 1.5, STRONG: 1.4, TOUGH: 120, REST_HURT: 1.5, MISS: 0.12, RECOVER: 1, JUMP_MOVE: 1, BLOCK_SHOT: 1 };
const COST = { pirmyn: 0, atgal: 0, smugis: R.PUNCH_E, suvis: R.SHOT_E, blokas: R.BLOCK_E, suolis: R.JUMP_E, ilsetis: 0 };
function seeded(seed) { return () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const ROBOTS = [
  { kid: 'Ema', name: 'Geležinis Kumštis', col: '#f2c230', trait: 'stiprus',
    rules: [{ c: 'arti', a: 'smugis' }, { c: 'energ', a: 'ilsetis' }, { c: 'visada', a: 'pirmyn' }] },
  { kid: 'Jonas', name: 'Snaiperis', col: '#4de8d6', trait: 'greitas',
    rules: [{ c: 'arti', a: 'smugis' }, { c: 'energ', a: 'ilsetis' }, { c: 'toli', a: 'suvis' }, { c: 'visada', a: 'atgal' }] },
  { kid: 'Ugnė', name: 'Siena', col: '#ff6fa8', trait: 'tvirtas',
    rules: [{ c: 'puola', a: 'blokas' }, { c: 'arti', a: 'smugis' }, { c: 'visada', a: 'pirmyn' }] },
  { kid: 'Matas', name: 'Kengūra', col: '#8ee35f', trait: 'greitas',
    rules: [{ c: 'puola', a: 'suolis' }, { c: 'arti', a: 'smugis' }, { c: 'visada', a: 'pirmyn' }] },
  { kid: 'Lukas', name: 'Miegalius', col: '#b58cff', trait: 'tvirtas',
    rules: [{ c: 'arti', a: 'smugis' }, { c: 'visada', a: 'ilsetis' }] },
];
function Round(A, B, seed) {
  const rnd = seeded(seed || 1);
  const mk = (d, x) => ({ name: d.name, kid: d.kid, col: d.col, boss: !!d.boss, rules: d.rules, trait: d.trait, x, px: x, max: d.trait === 'tvirtas' ? R.TOUGH : 100,
    hp: d.trait === 'tvirtas' ? R.TOUGH : 100, en: 100, wind: null, strike: null, rec: 0, blockT: 0, jumpT: 0, act: null, fired: -1, checked: [], block: false, jump: false, rest: false, hurt: 0,
    st: { dealt: 0, taken: 0, blocked: 0, dodged: 0, gotBlocked: 0, gotDodged: 0, tired: 0, lowHit: 0, restHit: 0, missed: 0, stunned: 0, used: new Set() } });
  const f = [mk(A, 2), mk(B, 8)];
  const w = { f, shots: [], fx: [], t: 0, over: false, winner: -1, ko: false };
  const dist = () => Math.abs(f[0].x - f[1].x);
  const face = (i) => (f[1 - i].x > f[i].x ? 1 : -1);
  // priešas užsimojo arba šūvis atskris šį tiką
  const threat = (i) => !!f[1 - i].wind || w.shots.some((s) => s.owner !== i && Math.abs(s.x - f[i].x) <= R.SHOT_V + .4);
  function cond(i, c) {
    const me = f[i];
    if (c === 'arti') return dist() <= R.ARTI;
    if (c === 'toli') return dist() >= R.TOLI;
    if (c === 'puola') return threat(i);
    if (c === 'energ') return me.en < R.LOWE;
    if (c === 'gyvyb') return me.hp < R.LOWHP;
    if (c === 'virves') return face(i) > 0 ? me.x <= 1.01 : me.x >= 8.99;
    return true;
  }
  function hit(i, base, kind) {
    const me = f[i], o = f[1 - i], X = (o.x + me.x) / 2;
    if (o.jump) { o.st.dodged++; me.st.gotDodged++; w.fx.push({ k: 'txt', x: o.x, s: 'Išvengė!', col: '#8ee35f', t: 0 }); return; }
    let d = base * (me.trait === 'stiprus' ? R.STRONG : 1) * (o.rest ? R.REST_HURT : 1);
    if (o.block) {
      o.st.blocked++; me.st.gotBlocked++;
      w.fx.push({ k: 'txt', x: o.x, s: 'Blokas!', col: '#ffe08a', t: 0 }, { k: 'spark', x: o.x - face(i) * .4, col: '#ffe08a', t: 0 });
      if (kind !== 'shot') return;
      d *= R.BLOCK_SHOT;
    }
    d = Math.max(1, Math.round(d + (rnd() * 3 - 1.5)));
    o.hp = Math.max(0, o.hp - d); me.st.dealt += d; o.st.taken += d;
    if (o.en < R.LOWE) o.st.lowHit += d;
    if (o.rest) o.st.restHit += d;
    o.hurt = 1;
    if (o.wind) { o.wind = null; o.st.stunned++; w.fx.push({ k: 'txt', x: o.x, s: 'Numušė!', col: '#ff8a7a', t: 0 }); }
    w.fx.push({ k: 'dmg', x: o.x, s: '-' + d, t: 0 }, { k: 'spark', x: kind === 'shot' ? o.x - face(i) * .3 : X, col: '#fff3a0', t: 0 });
  }
  function decide(i) {
    const me = f[i];
    me.px = me.x; me.block = me.jump = me.rest = false; me.act = null; me.fired = -1; me.checked = []; me.hurt = 0; me.strike = null;
    if (me.wind) { me.strike = me.wind; me.wind = null; me.act = me.strike === 'smugis' ? 'kerta' : 'sauna'; return; }
    if (me.rec > 0) { me.rec--; me.act = 'atsigauna'; return; }
    if (me.blockT > 0) { me.blockT--; me.block = true; me.act = 'blokas'; return; }
    if (me.jumpT > 0) { me.jumpT--; me.jump = true; me.act = 'suolis'; return; }
    let a = null;
    for (let k = 0; k < me.rules.length; k++) {
      const ok = cond(i, me.rules[k].c); me.checked.push(ok);
      if (ok) { me.fired = k; me.st.used.add(k); a = me.rules[k].a; break; }
    }
    if (!a) { me.act = 'stovi'; return; }
    if (me.en < COST[a]) { me.act = 'pavargo'; me.st.tired++; return; }
    me.en -= COST[a]; me.act = a;
    const step = me.trait === 'greitas' ? R.FAST : R.MOVE, fc = face(i);
    if (a === 'pirmyn') me.x += fc * Math.max(0, Math.min(step, dist() - 1));
    else if (a === 'atgal') me.x = Math.max(0.5, Math.min(9.5, me.x - fc * step));
    else if (a === 'smugis' || a === 'suvis') me.wind = a;
    else if (a === 'blokas') { me.block = true; me.blockT = 1; }
    else if (a === 'suolis') { me.jump = true; me.jumpT = 1; me.x += fc * Math.max(0, Math.min(R.JUMP_MOVE, dist() - 1)); }
    else if (a === 'ilsetis') { me.rest = true; me.en = Math.min(100, me.en + R.REST); }
  }
  w.tick = () => {
    if (w.over) return;
    w.t++;
    // sprendžia paeiliui, eilė keičiasi kas tiką: antrasis mato, ką ką tik pradėjo pirmasis
    (w.t % 2 ? [0, 1] : [1, 0]).forEach(decide);
    f.forEach((me, i) => {
      if (!me.strike) return;
      me.rec = R.RECOVER;
      if (me.strike === 'smugis') {
        if (dist() <= R.ARTI + 0.01 && rnd() > R.MISS) hit(i, R.PUNCH, 'punch');
        else { me.st.missed++; w.fx.push({ k: 'txt', x: me.x + face(i) * .8, s: 'Pro šalį', col: '#b7b1c2', t: 0 }); }
      } else w.shots.push({ owner: i, x: me.x + face(i) * .5, px: me.x + face(i) * .5, dir: face(i), col: me.col, fresh: true });
    });
    w.shots.forEach((s) => {
      s.px = s.x; s.x += s.dir * R.SHOT_V;
      const o = f[1 - s.owner];
      if ((s.dir > 0 && s.x >= o.x - .3) || (s.dir < 0 && s.x <= o.x + .3)) { s.x = o.x - s.dir * .3; hit(s.owner, R.SHOT, 'shot'); s.dead = true; }
      if (s.x < -1 || s.x > 11) s.dead = true;
    });
    w.shots = w.shots.filter((s) => !s.dead);
    f.forEach((me) => { me.en = Math.min(100, me.en + R.REGEN); });
    if (f[0].hp <= 0 || f[1].hp <= 0) { w.over = true; w.ko = true; w.winner = f[0].hp > 0 ? 0 : f[1].hp > 0 ? 1 : -1; }
    else if (w.t >= R.TICKS) { w.over = true; const a = f[0].hp / f[0].max, b = f[1].hp / f[1].max; w.winner = Math.abs(a - b) < 0.005 ? -1 : a > b ? 0 : 1; }
  };
  return w;
}
// Patarimas pralaimėjusiam programuotojui
function hintFor(me, opp) {
  const ri = (c) => me.rules.findIndex((x) => x.c === c), ai = me.rules.findIndex((x) => x.a === 'ilsetis');
  const vi = ri('visada');
  if (vi >= 0 && vi < me.rules.length - 1) return 'Taisyklės po VISADA niekada nesuveikia. Nuleisk VISADA į apačią.';
  if (me.st.lowHit >= 12 && ri('energ') > 0) return 'Priešas tave mušė, kai neturėjai energijos: kelk „Mažai energijos“ aukščiau.';
  if (me.st.tired >= 4 && ri('energ') < 0) return `Robotas pavargo ${me.st.tired} kartus. Pridėk: JEI mažai energijos TAI ilsėkis.`;
  if (me.st.restHit >= 15) return 'Ilsėdamasis gavai daug smūgių. Ilsėkis tik kai priešas toli.';
  if (me.st.gotBlocked >= 3) return `Priešas blokavo ${me.st.gotBlocked} tavo smūgius. Gal pabandyk šūvį iš toli?`;
  if (me.st.gotDodged >= 3) return `Priešas peršoko ${me.st.gotDodged} tavo smūgius. Pulk, kai jis nepuola.`;
  if (opp && opp.st.dealt > 25 && ri('puola') < 0) return 'Priešas tave daužė be atsako. Pridėk: JEI priešas puola TAI blokas.';
  if (me.rules.some((x) => x.c === 'puola' && (x.a === 'smugis' || x.a === 'pirmyn' || x.a === 'ilsetis'))) return 'Kai priešas puola, tavo robotas nesigina. Pabandyk: JEI priešas puola TAI blokas arba šuolis.';
  if (!me.st.dealt) return 'Tavo robotas nė karto nepataikė. Ar jis prieina arti?';
  if (opp && me.st.dealt < opp.st.dealt) return `Priešas padarė ${opp.st.dealt} žalos, tu ${me.st.dealt}. Žiūrėk sparinge, kuri taisyklė dega, kai tave muša.`;
  return 'Geros smegenys! Pabandyk pakeisti vieną taisyklę ir žiūrėk, kas bus.';
}
// ENGINE END
const P = (s) => s.split(',').map((x) => { const [c, a] = x.split('>'); return { c, a }; });
// Kompiuterio kopėčios: nuo lengvo iki boso. Čempionas pralaimi tik gerai apgalvotoms smegenims.
const CPU = [
  { kid: 'Kompiuteris', name: 'Treniruoklis', acc: 'Treniruoklį', col: '#a5a5ae', trait: null, lvl: 'Lengvas', rules: P('arti>smugis,toli>suvis,visada>pirmyn') },
  { ...ROBOTS[1], acc: 'Snaiperį', kid: 'Kompiuteris', lvl: 'Vidutinis' },
  { ...ROBOTS[2], acc: 'Sieną', kid: 'Kompiuteris', lvl: 'Sunkus' },
  { kid: 'Kompiuteris', name: 'Čempionas', acc: 'Čempioną', col: '#c8322a', trait: 'stiprus', boss: true, lvl: 'Bosas', rules: P('puola>suolis,arti>smugis,energ>ilsetis,toli>suvis,visada>pirmyn') },
];
const CONDS = ['arti', 'toli', 'puola', 'energ', 'gyvyb', 'virves', 'visada'];
const ACTS = ['pirmyn', 'atgal', 'smugis', 'suvis', 'blokas', 'suolis', 'ilsetis'];
const TRAITS = ['greitas', 'stiprus', 'tvirtas'];
const MAX_RULES = 5;
// Robotas iš tinklo: paliekam tik žinomas reikšmes, kad svetima žinutė nesugadintų kovos
function cleanRobot(d) {
  if (!d || typeof d !== 'object') return null;
  const rules = (Array.isArray(d.rules) ? d.rules : []).filter((r) => r && CONDS.includes(r.c) && ACTS.includes(r.a))
    .slice(0, MAX_RULES).map((r) => ({ c: r.c, a: r.a }));
  return {
    name: String(d.name || 'Robotas').slice(0, 24), kid: String(d.kid || '').slice(0, 14),
    col: /^#[0-9a-f]{6}$/i.test(d.col) ? d.col : '#f2c230', trait: TRAITS.includes(d.trait) ? d.trait : 'stiprus', rules,
  };
}
// Tas pats mačas ir raundas visada duoda tą pačią kovą
function seedFor(mid, round) { let h = 2166136261; const s = String(mid) + ':' + round; for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); return h >>> 0; }
const api = { R, ROBOTS, CPU, Round, hintFor, cleanRobot, seedFor, CONDS, ACTS, TRAITS, MAX_RULES, P };
if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.RR = api;
})(typeof window !== 'undefined' ? window : globalThis);
