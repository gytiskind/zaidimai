/* Shared player profiles for the games site.
   Everything lives in this tablet's localStorage; nothing is sent anywhere.
   Games call ZM.ns(key) for their progress keys and ZM.report(game, result) when a round ends. */
(function () {
  var KEY = 'zm-data';
  var RANKS = [
    { name: 'Anglis', min: 0, color: '#a8a8b8' },
    { name: 'Geležis', min: 250, color: '#d9a98a' },
    { name: 'Auksas', min: 800, color: '#f8d838' },
    { name: 'Deimantas', min: 2000, color: '#4de8d6' },
    { name: 'Legenda', min: 4000, color: '#c39bff' },
  ];
  var COLORS = ['#e0402e', '#2f7de1', '#5cbf3a', '#f2a23c', '#9b5de5', '#e85d9a', '#1fa597', '#c4921a'];

  function load() {
    try {
      var d = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (d && Array.isArray(d.players)) return d;
    } catch (e) {}
    return { cur: null, players: [] };
  }
  function save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} }

  function rankFor(xp) {
    var r = RANKS[0];
    for (var i = 0; i < RANKS.length; i++) if (xp >= RANKS[i].min) r = RANKS[i];
    var next = RANKS[RANKS.indexOf(r) + 1] || null;
    return { name: r.name, color: r.color, min: r.min, next: next };
  }

  function current() {
    var d = load();
    for (var i = 0; i < d.players.length; i++) if (d.players[i].id === d.cur) return d.players[i];
    return null;
  }

  var ZM = {
    RANKS: RANKS,
    rankFor: rankFor,
    data: load,
    player: current,
    // per-player storage key; without a player the game keeps its old shared key
    ns: function (k) { var p = current(); return p ? k + '@' + p.id : k; },
    addPlayer: function (name) {
      name = String(name || '').trim().slice(0, 14);
      if (!name) return null;
      var d = load();
      for (var i = 0; i < d.players.length; i++) {
        if (d.players[i].name.toLowerCase() === name.toLowerCase()) { d.cur = d.players[i].id; save(d); return d.players[i]; }
      }
      var p = { id: 'p' + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36), name: name,
                color: COLORS[d.players.length % COLORS.length], xp: 0, games: {} };
      d.players.push(p); d.cur = p.id; save(d);
      return p;
    },
    choose: function (id) { var d = load(); d.cur = id; save(d); },
    signOut: function () { var d = load(); d.cur = null; save(d); },
    remove: function (id) {
      var d = load();
      d.players = d.players.filter(function (p) { return p.id !== id; });
      if (d.cur === id) d.cur = null;
      save(d);
      try {
        for (var i = localStorage.length - 1; i >= 0; i--) {
          var k = localStorage.key(i);
          if (k && k.slice(-(id.length + 1)) === '@' + id) localStorage.removeItem(k);
        }
      } catch (e) {}
    },
    classXp: function () { return load().players.reduce(function (s, p) { return s + (p.xp || 0); }, 0); },
    // result: { score: number for the record (higher is better), xp: points toward rank }
    report: function (game, result) {
      var d = load(), p = null;
      for (var i = 0; i < d.players.length; i++) if (d.players[i].id === d.cur) p = d.players[i];
      if (!p) { toast('Pasirink vardą meniu, ir taškai bus išsaugoti.', null); return null; }
      var before = rankFor(p.xp || 0).name;
      var g = p.games[game] || (p.games[game] = { best: 0, plays: 0, xp: 0 });
      var xp = Math.max(0, Math.round(result.xp || 0));
      var record = typeof result.score === 'number' && result.score > (g.best || 0);
      if (record) g.best = result.score;
      g.plays = (g.plays || 0) + (result.countPlay === false ? 0 : 1);
      g.xp = (g.xp || 0) + xp;
      p.xp = (p.xp || 0) + xp;
      save(d);
      var after = rankFor(p.xp);
      if (xp > 0) toast('+' + xp + ' XP · ' + p.name, after.name !== before ? 'Naujas rangas: ' + after.name + '!' : null);
      if (after.name !== before) refreshChips();
      return { xp: xp, record: record, rank: after.name, rankUp: after.name !== before };
    },
  };
  window.ZM = ZM;

  /* ---------- small UI used inside games ---------- */
  var css = '' +
    '.zm-chip{display:inline-flex;align-items:center;gap:6px;justify-self:center;align-self:center;font:800 0.9rem "Nunito","Arial Rounded MT Bold",system-ui,sans-serif;color:#f3f0f7;' +
      'background:rgba(31,28,39,0.9);border:2px solid #000;padding:3px 10px 3px 4px;white-space:nowrap;text-decoration:none}' +
    '.zm-chip i{display:inline-grid;place-items:center;width:22px;height:22px;font-style:normal;font-weight:900;color:#fff;box-shadow:inset -3px -3px 0 rgba(0,0,0,.3)}' +
    '.zm-chip b{font-weight:900}.zm-chip small{font-size:.75rem;font-weight:800;opacity:.85}' +
    '.zm-toast{position:fixed;left:50%;top:calc(env(safe-area-inset-top,0px) + 70px);transform:translateX(-50%);z-index:9999;pointer-events:none;display:grid;gap:4px;justify-items:center;' +
      'font:900 1.25rem "Nunito","Arial Rounded MT Bold",system-ui,sans-serif;color:#2a1d00;animation:zmIn 2.8s ease-out forwards}' +
    '.zm-toast span{background:#ffcc33;padding:6px 16px;border:3px solid #000;box-shadow:4px 4px 0 #000}' +
    '.zm-toast span.up{background:#4de8d6;color:#0d2a27}' +
    '.zm-toast span.info{background:#f3f0f7;font-size:1rem}' +
    '@keyframes zmIn{0%{opacity:0;margin-top:-12px}10%{opacity:1;margin-top:0}80%{opacity:1}100%{opacity:0}}' +
    '@media (prefers-reduced-motion: reduce){.zm-toast{animation-duration:3s;animation-timing-function:steps(1,end)}}';

  function addStyle() {
    if (document.getElementById('zm-style')) return;
    var s = document.createElement('style');
    s.id = 'zm-style'; s.textContent = css;
    (document.head || document.documentElement).appendChild(s);
  }

  function toast(main, extra) {
    addStyle();
    var t = document.createElement('div');
    t.className = 'zm-toast'; t.setAttribute('role', 'status');
    var a = document.createElement('span');
    a.textContent = main;
    if (main.indexOf('XP') < 0) a.className = 'info';
    t.appendChild(a);
    if (extra) { var b = document.createElement('span'); b.className = 'up'; b.textContent = extra; t.appendChild(b); }
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 3000);
  }
  ZM.toast = toast;

  function chipHTML(p) {
    if (!p) return 'Pasirink vardą';
    var r = rankFor(p.xp || 0);
    var initial = (p.name[0] || '?').toUpperCase();
    return '<i style="background:' + p.color + '">' + initial.replace(/[<>&]/g, '') + '</i><b></b><small style="color:' + r.color + '">' + r.name + '</small>';
  }
  // put a "who is playing" chip next to every back-to-menu link
  function decorate() {
    addStyle();
    var p = current();
    var links = document.querySelectorAll('a.zm-back');
    for (var i = 0; i < links.length; i++) {
      var l = links[i];
      if (l.nextElementSibling && l.nextElementSibling.classList.contains('zm-chip')) continue;
      var c = document.createElement('a');
      c.className = 'zm-chip'; c.href = '../';
      c.innerHTML = chipHTML(p);
      if (p) c.querySelector('b').textContent = p.name;
      c.setAttribute('aria-label', p ? 'Žaidžia ' + p.name : 'Pasirink vardą meniu');
      l.insertAdjacentElement('afterend', c);
    }
  }
  // redraw existing chips, e.g. after a rank-up mid-game
  function refreshChips() {
    var p = current(), chips = document.querySelectorAll('.zm-chip');
    for (var i = 0; i < chips.length; i++) {
      chips[i].innerHTML = chipHTML(p);
      if (p) chips[i].querySelector('b').textContent = p.name;
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', decorate);
  else decorate();
})();
