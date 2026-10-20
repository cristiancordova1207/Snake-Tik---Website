// Snake Tik · web: dos juegos reales (héroe y demo) con el mismo código que el programa.
'use strict';
const $ = (s) => document.querySelector(s);
const store = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch { /* nada */ } } };
const NAMES = { en: 'English', es: 'Español', pt: 'Português', fr: 'Français', de: 'Deutsch', it: 'Italiano' };
let lang = store.get('st-lang') || 'en';
let muted = store.get('st-muted') === '1';

function applyLang() {
  const T = WEB_T[lang] || WEB_T.en;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-t]').forEach((el) => { el.textContent = T[el.dataset.t] ?? el.textContent; });
  document.querySelectorAll('[data-t-html]').forEach((el) => { el.innerHTML = T[el.dataset.tHtml]; });
  I18N.set(lang);
  renderMute();
}
$('#lang').innerHTML = Object.entries(NAMES).map(([k, n]) => `<option value="${k}">${n}</option>`).join('');
$('#lang').value = lang;
$('#lang').onchange = (e) => { lang = e.target.value; store.set('st-lang', lang); applyLang(); };

// ---------- sonido: silenciable ----------
function renderMute() {
  const T = WEB_T[lang] || WEB_T.en;
  $('#mute').textContent = muted ? '🔇' : '🔊';
  $('#mute').title = muted ? T.unmute : T.mute;
}
function soundCfg() { return { ...S.sound, master: muted ? 0 : 0.7 }; }
$('#mute').onclick = () => { muted = !muted; store.set('st-muted', muted ? '1' : '0'); SFX.unlock(); demo.applySettings({ sound: soundCfg() }); renderMute(); };

// ---------- el de arriba: juega solo, sin sonido ----------
const quiet = { play() {}, key() {}, configure() {}, unlock() {} };
const hero = SnakeRender.create($('#heroCanvas'), { sfx: quiet, i18n: I18N, onStats() {} });
hero.applySettings({ grid: 16, speed: 14, board: 'grass', animal: 'snake', discord: 'discord.gg/K6TCjKAyds', toasts: true, countdown: 6 }, true);
const nicks = ['ana_live', 'pepe.gg', 'luna22', 'gamerx', 'sofi_tk', 'mike_07'];
setInterval(() => {
  const r = Math.random(), nick = nicks[(Math.random() * nicks.length) | 0];
  if (r < 0.6) hero.gift('apples', 5, nick, 'Rose x5');
  else if (r < 0.85) hero.gift('bombs', 3, nick, 'TikTok x3');
  else hero.gift('airdrop', 120, nick, 'Galaxy');
}, 4500);

// ---------- la demo: parada hasta pulsar "Start" ----------
const S = { grid: 14, speed: 12, board: 'mines', animal: 'croc', discord: 'discord.gg/K6TCjKAyds', toasts: true, countdown: 6,
  sound: { master: 0.7, keys: { pack: 'cherrymx-blue-abs', vol: 0.7, on: true }, events: {} } };
const demo = SnakeRender.create($('#demoCanvas'), { sfx: SFX, i18n: I18N, onStats() {} });
demo.applySettings({ ...S, sound: { ...S.sound, master: 0 } }, true);
demo.setPaused(true);               // congelada hasta pulsar Start
$('#demoPanel').classList.add('off');
$('#start').onclick = () => {
  SFX.unlock();
  demo.applySettings({ sound: soundCfg() });
  demo.reset(); demo.setPaused(false);
  $('#startOverlay').classList.add('gone');
  $('#demoPanel').classList.remove('off');
};
document.querySelectorAll('[data-gift]').forEach((b) => b.onclick = () => {
  const [what, n] = b.dataset.gift.split(',');
  demo.gift(what, +n, 'You', b.textContent.trim());
});
$('#dLose').onclick = () => demo.fail();

const BOARDS = { grass: '🟩', dirt: '🟫', mines: '💣', sand: '🏖️', snow: '❄️', night: '🌃', candy: '🍬' };
const ANIMALS = { snake: '🐍', croc: '🐊', dragon: '🐉', neon: '⚡', worm: '🪱', caterpillar: '🐛' };
const KEYS = { 'cherrymx-blue-abs': 'Cherry MX Blue', 'cherrymx-black-abs': 'Cherry MX Black', 'cherrymx-brown-pbt': 'Cherry MX Brown', 'holy-pandas': 'Holy Pandas', 'topre-purple-hybrid-pbt': 'Topre', 'nk-cream': 'NK Cream' };
S.keyPack = S.sound.keys.pack;
function chips(el, map, key, apply) {
  el.innerHTML = Object.entries(map).map(([k, v]) => `<button class="chip ${S[key] === k ? 'on' : ''}" data-k="${k}" title="${k}">${v}</button>`).join('');
  el.onclick = (e) => { const b = e.target.closest('[data-k]'); if (!b) return; apply(b.dataset.k); chips(el, map, key, apply); };
}
chips($('#dBoards'), BOARDS, 'board', (k) => { S.board = k; demo.applySettings({ board: k }); });
chips($('#dAnimals'), ANIMALS, 'animal', (k) => { S.animal = k; demo.applySettings({ animal: k }); });
chips($('#dKeys'), KEYS, 'keyPack', (k) => { S.keyPack = k; S.sound.keys.pack = k; demo.applySettings({ sound: soundCfg() }); if (!muted) SFX.previewKey(k, 0.8); });

// ---------- botones gelatinosos ----------
document.addEventListener('click', (e) => {
  const b = e.target.closest('.btn'); if (!b) return;
  b.classList.remove('wobble'); void b.offsetWidth; b.classList.add('wobble');
  const r = b.getBoundingClientRect(), g = document.createElement('span');
  g.className = 'goo'; g.style.left = (e.clientX - r.left) + 'px'; g.style.top = (e.clientY - r.top) + 'px';
  b.append(g); setTimeout(() => g.remove(), 700);
});
const io = new IntersectionObserver((es) => es.forEach((x) => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
fetch('https://raw.githubusercontent.com/cristiancordova1207/Snake-Tik---Releases/main/latest.json').then((r) => r.json()).then((d) => { $('#ver').textContent = 'v' + d.version; }).catch(() => {});
applyLang();
