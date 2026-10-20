// Snake Tik · web: dos juegos reales (héroe y demo) con el mismo código que el programa.
'use strict';
const $ = (s) => document.querySelector(s);
const noStats = { onStats() {} };
I18N.set('es');

// el de arriba juega solo y recibe "regalos" de vez en cuando
const hero = SnakeRender.create($('#heroCanvas'), { i18n: I18N, ...noStats });
hero.applySettings({ grid: 16, speed: 14, board: 'grass', animal: 'snake', discord: 'discord.gg/K6TCjKAyds', toasts: true, countdown: 6 }, true);
const nicks = ['ana_live', 'pepe.gg', 'luna22', 'gamerx', 'sofi_tk', 'mike_07'];
setInterval(() => {
  const r = Math.random(), nick = nicks[(Math.random() * nicks.length) | 0];
  if (r < 0.6) hero.gift('apples', 5, nick, 'Rose x5');
  else if (r < 0.85) hero.gift('bombs', 3, nick, 'TikTok x3');
  else hero.gift('airdrop', 120, nick, 'Galaxy');
}, 4500);

// la demo: la controlas tú (con sonido)
const demo = SnakeRender.create($('#demoCanvas'), { sfx: SFX, i18n: I18N, ...noStats });
const S = { grid: 14, speed: 12, board: 'mines', animal: 'croc', discord: 'discord.gg/K6TCjKAyds', toasts: true, countdown: 6,
  sound: { master: 0.7, keys: { pack: 'cherrymx-blue-abs', vol: 0.7, on: true }, events: {} } };
demo.applySettings(S, true);
document.querySelectorAll('[data-gift]').forEach((b) => b.onclick = () => {
  SFX.unlock();
  const [what, n] = b.dataset.gift.split(',');
  demo.gift(what, +n, 'Tú', b.textContent.trim());
});
$('#dLose').onclick = () => { SFX.unlock(); demo.fail(); };

const BOARDS = { grass: '🟩 Pasto', dirt: '🟫 Tierra', mines: '💣 Buscaminas', sand: '🏖️ Arena', snow: '❄️ Nieve', night: '🌃 Neón', candy: '🍬 Caramelo' };
const ANIMALS = { snake: '🐍 Serpiente', croc: '🐊 Cocodrilo', dragon: '🐉 Dragón', neon: '⚡ Neón', worm: '🪱 Gusano', caterpillar: '🐛 Oruga' };
const KEYS = { 'cherrymx-blue-abs': 'Cherry MX Blue', 'cherrymx-black-abs': 'Cherry MX Black', 'cherrymx-brown-pbt': 'Cherry MX Brown', 'holy-pandas': 'Holy Pandas', 'topre-purple-hybrid-pbt': 'Topre', 'nk-cream': 'NK Cream' };
function chips(el, map, key, apply) {
  el.innerHTML = Object.entries(map).map(([k, v]) => `<button class="chip ${S[key] === k ? 'on' : ''}" data-k="${k}">${v}</button>`).join('');
  el.onclick = (e) => { const b = e.target.closest('[data-k]'); if (!b) return; apply(b.dataset.k); chips(el, map, key, apply); };
}
chips($('#dBoards'), BOARDS, 'board', (k) => { S.board = k; demo.applySettings({ board: k }); });
chips($('#dAnimals'), ANIMALS, 'animal', (k) => { S.animal = k; demo.applySettings({ animal: k }); });
S.keyPack = S.sound.keys.pack;
chips($('#dKeys'), KEYS, 'keyPack', (k) => { S.keyPack = k; S.sound.keys.pack = k; SFX.unlock(); demo.applySettings({ sound: S.sound }); SFX.previewKey(k, 0.8); });

// botones gelatinosos
document.addEventListener('click', (e) => {
  const b = e.target.closest('.btn'); if (!b) return;
  b.classList.remove('wobble'); void b.offsetWidth; b.classList.add('wobble');
  const r = b.getBoundingClientRect(), g = document.createElement('span');
  g.className = 'goo'; g.style.left = (e.clientX - r.left) + 'px'; g.style.top = (e.clientY - r.top) + 'px';
  b.append(g); setTimeout(() => g.remove(), 700);
});
// aparición al hacer scroll
const io = new IntersectionObserver((es) => es.forEach((x) => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
// versión publicada
fetch('https://raw.githubusercontent.com/cristiancordova1207/Snake-Tik---Releases/main/latest.json').then((r) => r.json()).then((d) => { $('#ver').textContent = 'v' + d.version; }).catch(() => {});
