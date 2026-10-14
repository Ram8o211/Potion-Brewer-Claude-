// Modal panels: the guild shop, the ingredient card (magic only), guild
// advice, the day summary, the recipe book, the journal, pause, help and
// settings.

import { h, btn, modal, toast, coins, confirmDialog, clear } from './dom.js';
import { icon } from './icons.js';
import { drawJar } from '../rendering/art.js';
import { EQUIPMENT, RANKS } from '../game/equipment.js';
import { ACHIEVEMENTS } from '../game/state.js';
import { PROPS, PROP_BY_KEY } from '../alchemy/magic.js';
import { reqText } from '../game/commissions.js';
import { rawSprite } from '../rendering/scenes.js';
import { rgbToHex } from '../core/color.js';
import { SIM } from '../simulation/constants.js';
import { exportSave, parseImport, saveGame } from '../game/persistence.js';
import { audio } from '../audio/audio.js';

const CAT_LABEL = { heat: 'Fire', cold: 'Frost', vessel: 'Cauldrons', tool: 'Tools', instrument: 'Instruments', trials: 'Testing room', garden: 'Garden', storage: 'Shelves', guild: 'Guild' };

function jarCanvas(m, w = 22, hh = 30) {
  if (m.form === 'solid') {
    const cv = rawSprite(m.shape || 'stone', m.look || m.color);
    cv.style.width = w * 2 + 'px';
    cv.style.height = w * 2 + 'px';
    return cv;
  }
  const cv = /** @type {HTMLCanvasElement} */ (h('canvas', { width: String(w), height: String(hh), style: { width: w * 2 + 'px', height: hh * 2 + 'px' } }));
  drawJar(cv.getContext('2d'), 2, 0, w - 4, hh, m.look || m.color, m.form);
  return cv;
}

/** Magic chips of an ingredient (icon + value). @param {Record<string, number>|undefined} magic */
export function magicChips(magic, min = 1) {
  const list = PROPS.filter((p) => ((magic && magic[p.key]) || 0) >= min);
  if (!list.length) return [h('span', { class: 'muted', text: '—' })];
  return list.map((p) => h('span', { class: 'fx-chip', title: p.label }, icon(p.icon, 'sm'), ` ${Math.round(magic[p.key])}`));
}

/** An ingredient's two temperatures: where its magic fades, and where it would transmute. @param {any} m */
export function thresholdChips(m) {
  const out = [];
  if (Number.isFinite(m.fadeT)) out.push(h('span', { class: 'fx-chip dim', title: `Its magic fades above ${m.fadeT}°C` }, icon('flame', 'sm'), ` >${m.fadeT}°`));
  if (Number.isFinite(m.superT)) out.push(h('span', { class: 'fx-chip dim', title: `Super transition at ${m.superT}°C: all its magic becomes ${PROP_BY_KEY[m.superKey].label}` }, icon('spark', 'sm'), ` ${m.superT}° `, icon(PROP_BY_KEY[m.superKey].icon, 'sm')));
  return out;
}

function swatch(rgb) {
  return h('span', { class: 'swatch', style: { background: rgbToHex(rgb) } });
}

// ------------------------------------------------------------------ the guild shop (equipment)
export function openShop(lab) {
  const st = lab.state;
  const body = h('div');
  const coinLine = h('div', { class: 'row shop-coins' });
  const m = modal({ title: 'Guild Shop', body: [body], wide: true, onClose: () => lab.refreshHud(true) });
  m.el.insertBefore(coinLine, m.body);
  const render = () => {
    clear(coinLine).append(icon('coin'), h('b', { text: coins(st.coins) }));
    clear(body);
    for (const cat of Object.keys(CAT_LABEL)) {
      const items = EQUIPMENT.filter((e) => e.category === cat && e.price > 0);
      if (!items.length) continue;
      body.appendChild(h('h3', { class: 'shop-cat', text: CAT_LABEL[cat] }));
      const list = h('div', { class: 'list' });
      for (const e of items) {
        const owned = st.has(e.id);
        const rankOk = e.rank <= st.rank;
        const reqOk = !e.requires || e.requires.every((r) => st.has(r));
        let action;
        if (owned) action = icon('check');
        else if (!rankOk) action = h('span', { class: 'small muted' }, icon('lock', 'sm'), ` ${RANKS[e.rank].name}`);
        else action = btn(`${coins(e.price)}`, async () => {
          const ok = await confirmDialog(`Buy ${e.name}?`, `${e.desc}\n${e.price} coins.`, 'Buy');
          if (!ok) return;
          const r = st.buyEquipment(e.id);
          if (r.ok) {
            audio.play('purchase');
            toast(e.name, '', e.icon);
            lab.buildActions();
            lab.refreshCapabilities();
            lab.save();
          } else { audio.play('error'); toast('Cannot buy', r.reason, 'lock'); }
          render();
        }, { icon: 'coin', cls: 'gold', disabled: st.coins < e.price || !reqOk, act: 'equip-' + e.id });
        list.appendChild(h('div', { class: 'item parch' + (owned || rankOk ? '' : ' locked') },
          h('img', { src: icon(e.icon).src, class: 'ico lg', alt: '' }),
          h('div', {}, h('div', { class: 'title', text: e.name }), h('div', { class: 'meta', text: e.desc })),
          action));
      }
      body.appendChild(list);
    }
  };
  render();
  audio.play('page');
  return m;
}

// ------------------------------------------------------------------ the ingredient card: magic only
export function openIngredient(lab, id) {
  const st = lab.state;
  const m = st.lookup(id);
  if (!m) return;
  const bars = h('div', { class: 'aspect-bars' });
  for (const p of PROPS) {
    const v = (m.magic && m.magic[p.key]) || 0;
    bars.append(h('span', { title: p.label }, icon(p.icon, 'sm')), h('div', { class: 'bar' }, h('i', { style: { width: Math.min(100, v) + '%', background: `rgb(${p.color.map((c) => Math.round(c * 255)).join(',')})` } })), h('b', { text: String(Math.round(v)) }));
  }
  const stock = lab.sandbox ? '∞' : `${Math.round(st.stock(id))}`;
  modal({
    title: m.name,
    body: [
      h('div', { class: 'card parch ing-card' }, jarCanvas(m, 22, 30), h('div', {},
        h('div', { class: 'small', text: m.description }),
        h('div', { class: 'row small' }, icon('jar', 'sm'), ` ${stock} ml`, m.form === 'solid' ? h('span', { class: 'tag', title: 'Smash it first: mortar or pestle' }, icon('mortar', 'sm')) : null))),
      h('div', { class: 'card parch' }, bars),
      h('div', { class: 'card parch row wrap' }, ...thresholdChips(m)),
    ],
  });
}

// ------------------------------------------------------------------ guild advice
export function openHint(lab) {
  const st = lab.state;
  const com = st.current;
  if (!com || com.type !== 'order') return;
  const show = () => {
    const ref = com.reference;
    const main = ref.ingredients.slice().sort((a, b) => b.n - a.n).map((i) => st.lookup(i.id)).find((x) => x && x.kind !== 'water');
    const total = ref.ingredients.reduce((a, b) => a + b.n, 0);
    const rows = ref.ingredients.map((i) => {
      const m = st.lookup(i.id);
      // a rough share, never the exact recipe
      const share = Math.round((i.n / total) * 10) * 10;
      return h('div', { class: 'row' }, jarCanvas(m, 12, 16), h('span', { text: `~${share}%  ${m.name}` }), i.ground ? icon('mortar', 'sm') : null);
    });
    const tips = [];
    if ((ref.heatTo ?? 20) > 30) tips.push(h('div', { class: 'row small' }, icon('flame', 'sm'), ` ~${Math.round(ref.heatTo / 5) * 5}°`));
    if ((ref.coolTo ?? 20) < 12) tips.push(h('div', { class: 'row small' }, icon('snow', 'sm'), ` ~${Math.round(ref.coolTo / 5) * 5}°`));
    if (ref.knead) tips.push(h('div', { class: 'row small' }, icon('spoon', 'sm'), ' stir well'));
    void main;
    modal({ title: 'Guild advice', body: [h('div', { class: 'card parch' }, ...rows, ...tips)] });
  };
  if (com.hintBought || !com.hintCost) { com.hintBought = true; show(); return; }
  confirmDialog('Ask the guild?', `${com.hintCost} coins.`, 'Pay').then((ok) => {
    if (!ok) return;
    if (st.coins < com.hintCost) { toast('Not enough coins', '', 'coin'); return; }
    st.spend(com.hintCost);
    com.hintBought = true;
    audio.play('coin');
    lab.refreshHud();
    show();
  });
}

// ------------------------------------------------------------------ day summary
export function showDaySummary(lab, summary, onDone) {
  const st = lab.state;
  const net = summary.earned - summary.spent - summary.refunds;
  modal({
    title: `Day ${summary.day}`,
    onClose: onDone,
    body: [
      h('div', { class: 'card parch' },
        h('div', { class: 'kv' },
          icon('deal'), h('span', { text: String(summary.served) }),
          icon('coin'), h('span', { text: `+${coins(summary.earned)}` }),
          icon('bag'), h('span', { text: `−${coins(summary.spent)}` }),
          icon('refund'), h('span', { text: `−${coins(summary.refunds)}` }),
          icon('scales'), h('b', { text: (net >= 0 ? '+' : '') + coins(net) }),
          icon('star'), h('span', { text: `${st.rankName} · ${st.reputation}` }),
        )),
      h('div', { class: 'card parch row' }, icon(st.marketEvent.icon), h('b', { text: st.marketEvent.name })),
    ],
    foot: [btn('Open the shop', () => document.querySelector('.overlay .modal-head .btn').dispatchEvent(new MouseEvent('click')), { cls: 'primary', icon: 'door', act: 'next-day' })],
  });
}

// ------------------------------------------------------------------ recipes
/** Render the recipe book into a container. */
export function renderRecipes(lab, container) {
  const st = lab.state;
  const render = () => {
    clear(container);
    const save = btn('Save the brew', () => {
      const parts = lab.batchParts();
      if (!parts.length) { toast('The cauldron is empty', '', 'cauldron'); return; }
      const p = lab.sim.p;
      let T = 0, n = 0;
      for (let i = 0; i < p.count; i++) { T += p.temp[i]; n++; }
      const draft = lab.recipeDraft({ temperature: n ? T / n : 20, color: [0.5, 0.5, 0.5] });
      const evs = st.addRecipe({ ...draft, name: `Recipe ${st.recipes.length + 1}`, id: st.idStale ? null : { ...st.idCard.values } });
      for (const e of evs) lab.announce(e);
      toast('Recipe saved', '', 'book');
      render();
    }, { icon: 'book', act: 'save-recipe' });
    container.appendChild(h('div', { class: 'row' }, save));
    if (!st.recipes.length) {
      container.appendChild(h('div', { class: 'card parch small muted', text: '—' }));
      return;
    }
    for (const r of st.recipes) {
      const total = r.ingredients.reduce((a, i) => a + i.ml, 0) || 1;
      const parts = h('div', { class: 'meta' }, ...r.ingredients.map((i) => {
        const m = st.lookup(i.id);
        return h('span', { class: 'fx-chip' }, swatch(m ? m.look || m.color : [0.5, 0.5, 0.5]), ` ${Math.round(i.ml)}`, i.ground ? icon('mortar', 'sm') : null);
      }));
      const steps = h('div', { class: 'meta' },
        r.maxTemp > 30 ? h('span', { class: 'fx-chip' }, icon('flame', 'sm'), ` ${r.maxTemp}°`) : null,
        r.minTemp < 12 ? h('span', { class: 'fx-chip' }, icon('snow', 'sm'), ` ${r.minTemp}°`) : null,
        r.stirSeconds ? h('span', { class: 'fx-chip' }, icon('spoon', 'sm'), ` ${r.stirSeconds}s`) : null,
        h('span', { class: 'fx-chip dim' }, icon('flask', 'sm'), ` ${Math.round(total)}`));
      const idChips = r.id ? h('div', { class: 'meta' }, icon('scroll', 'sm'), ...PROPS.filter((p) => Number.isFinite(r.id[p.key])).map((p) => h('span', { class: 'fx-chip dim' }, icon(p.icon, 'sm'), ` ${r.id[p.key]}`))) : null;
      const canAfford = r.ingredients.every((i) => lab.sandbox || st.stock(i.id) >= i.ml);
      const actions = h('div', { class: 'row wrap' },
        btn('', () => { prepareRecipe(lab, r); lab.showView('brew'); }, { icon: 'pour', cls: 'icon', disabled: !canAfford, title: canAfford ? 'Pour it all in' : 'Not enough in store', act: 'prepare' }),
        st.has('homunculus') ? btn('', () => { lab.startHomunculus(r); lab.showView('brew'); }, { icon: 'homunculus', cls: 'icon', disabled: !canAfford, title: 'Let the homunculus brew it', act: 'homunculus' }) : null,
        btn('', () => { const name = prompt('Rename recipe', r.name); if (name) { r.name = name.slice(0, 40); render(); } }, { icon: 'scroll', cls: 'icon', title: 'Rename' }),
        btn('', async () => { if (await confirmDialog('Delete recipe?', r.name, 'Delete', 'danger')) { st.recipes.splice(st.recipes.indexOf(r), 1); render(); } }, { icon: 'trash', cls: 'icon danger', title: 'Delete' }));
      container.appendChild(h('div', { class: 'item parch' },
        swatch(r.color || [0.5, 0.5, 0.5]),
        h('div', {}, h('div', { class: 'title', text: r.name }), parts, steps, idChips),
        actions));
    }
  };
  render();
}

/** Pour a recipe's ingredients in order (the player still stirs and heats). */
function prepareRecipe(lab, r) {
  const queue = r.ingredients.slice();
  const next = () => {
    if (!queue.length) { toast('All poured', '', 'book', 2200); return; }
    if (lab.sim.emitter.pouring) { setTimeout(next, 200); return; }
    const i = queue.shift();
    lab.selectIngredient(i.id);
    lab.startPour(lab.pourX, Math.round(i.ml / SIM.ML_PER_PARTICLE), i.ground);
    setTimeout(next, 250);
  };
  next();
}

// ------------------------------------------------------------------ journal
/** Render a journal tab (journal | achievements) into a container. */
export function renderJournal(lab, container, tab = 'journal') {
  const st = lab.state;
  clear(container);
  if (tab === 'achievements') {
    const list = h('div', { class: 'list' });
    for (const a of ACHIEVEMENTS) {
      const got = !!st.achievements[a.id];
      list.appendChild(h('div', { class: 'item parch' + (got ? '' : ' locked') }, icon(got ? 'trophy' : 'lock'), h('div', {}, h('div', { class: 'title', text: a.name }), h('div', { class: 'meta', text: a.desc })), h('span', { class: 'price' }, icon('coin', 'sm'), String(a.reward))));
    }
    container.appendChild(list);
    return;
  }
  const entries = Object.values(st.journal).sort((a, b) => b.day - a.day);
  if (!entries.length) container.appendChild(h('div', { class: 'card parch small muted', text: '—' }));
  for (const e of entries) {
    container.appendChild(h('div', { class: 'card parch' }, h('div', { class: 'row' }, icon(e.kind === 'magic' ? 'spark' : e.kind === 'fire' ? 'flame' : e.kind === 'phase' ? 'thermo' : 'scroll'), h('b', { text: e.title }), h('span', { class: 'spacer' }), h('span', { class: 'small muted', text: `${e.day}` })), h('div', { class: 'small', text: e.text })));
  }
}

// ------------------------------------------------------------------ pause / help / settings
export function openPause(lab) {
  const app = lab.app;
  let m;
  const items = [
    btn('Resume', () => m.close(), { cls: 'primary', icon: 'speed', act: 'resume' }),
    btn('How to play', () => { m.close(); openHelp(); }, { icon: 'help', act: 'help' }),
    btn('Settings & saves', () => { m.close(); openSettings(app, lab); }, { icon: 'gear', act: 'settings' }),
  ];
  if (!lab.sandbox) items.push(btn('Restart tutorial', () => { m.close(); lab.tutorial && lab.tutorial.start(true); }, { icon: 'bulb' }));
  items.push(btn(lab.sandbox ? 'Leave experiment' : 'Save & quit', () => { m.close(); app.showMenu(); }, { icon: 'door', act: 'quit' }));
  m = modal({ title: lab.sandbox ? 'Free Experiment' : 'Paused', body: h('div', { class: 'list' }, items) });
}

export function openHelp() {
  const sec = (ic, title, lines) => h('div', { class: 'card parch' }, h('h3', {}, icon(ic), ' ' + title), ...lines.map((l) => h('div', { class: 'small', text: '• ' + l })));
  modal({
    title: 'How to play',
    wide: true,
    body: [
      sec('stall', 'Customers', ['They bring a problem and ask for magic: ranges on six properties (Vitality, Ardor, Frost, Levity, Charm, Bane).', 'They buy on your label — the Potion ID — and haggle: name a price, they counter, until you agree or they lose patience.', 'If what they drink misses their range, they come back for a refund. Some bluff. Only an expert’s certificate (costly) proves a potion was right.']),
      sec('seedling', 'Garden', ['Everything grows in your garden: water from the well, liquids from plant beds, stones from crystal beds.', 'Plant beds grow only while moist: water them. Harvest takes what has grown; the bed starts again.']),
      sec('cauldron', 'Brewing', ['A potion’s magic is the proportion-weighted blend of its ingredients’ magic. Water dilutes.', 'Smash stones (mortar or pestle): only powder dissolves, and hot water draws out far more of its magic.', 'Heat helps liquids that keep apart when cold to blend.', 'Too hot and magic fades. Every ingredient also has a super-transition temperature, mostly far out of reach — but blends average them (weighted by magic). Cross it and all the magic pours into one property.']),
      sec('toad', 'Testing', ['Give 10 ml to a creature and watch: leaves, flames, ice, floating, hearts and bubbles — measured against the notched post in the cage (one notch = 10), or counted (one = 10).', 'Each creature shows only some properties. Set the Potion ID sliders by what you saw, then bottle.']),
      sec('help', 'Keys', ['C V G T J rooms · 1 pour · 2 spoon · 3 pestle · 4 skimmer · L lid · B bottle · F speed · A auto-stir · M mortar · arrows fire · S shop · Esc menu.']),
    ],
  });
}

export function openSettings(app, lab) {
  const s = app.settings;
  const vol = (key, label) => {
    const inp = /** @type {HTMLInputElement} */ (h('input', { type: 'range', class: 'vol', min: '0', max: '100', value: String(Math.round(s[key] * 100)), 'aria-label': label }));
    inp.addEventListener('input', () => { s[key] = Number(inp.value) / 100; app.applySettings(); });
    return h('div', { class: 'toggle-row' }, h('span', { text: label }), inp);
  };
  const check = (key, label, after) => {
    const inp = /** @type {HTMLInputElement} */ (h('input', { type: 'checkbox', 'aria-label': label }));
    inp.checked = !!s[key];
    inp.addEventListener('change', () => { s[key] = inp.checked; app.applySettings(); after && after(); });
    return h('div', { class: 'toggle-row' }, h('span', { text: label }), inp);
  };
  const quality = /** @type {HTMLSelectElement} */ (h('select', { 'aria-label': 'Graphics quality', style: { width: '50%' } }, ...[['auto', 'Automatic'], ['high', 'High quality'], ['medium', 'Balanced'], ['low', 'Battery saver']].map(([q, t]) => h('option', { value: q, text: t }))));
  quality.value = s.quality;
  quality.addEventListener('change', () => { s.quality = /** @type {any} */ (quality.value); app.applySettings(); if (lab) lab.resize(true); });
  const fileIn = /** @type {HTMLInputElement} */ (h('input', { type: 'file', accept: '.json,application/json', class: 'hidden' }));
  fileIn.addEventListener('change', async () => {
    const f = fileIn.files && fileIn.files[0];
    if (!f) return;
    try {
      const st = parseImport(await f.text());
      if (await confirmDialog('Import this save?', `World "${st.seed}", day ${st.day}, ${coins(st.coins)} coins. Your current game will be replaced.`, 'Import')) {
        saveGame(st);
        toast('Save imported', '', 'check');
        app.startGame(st);
      }
    } catch (e) {
      toast('Import failed', e.message, 'close', 5000);
    }
  });
  const saveSection = lab && !lab.sandbox ? h('div', { class: 'card parch' },
    h('h3', { text: 'Saves' }),
    h('div', { class: 'small', text: 'The game saves on this device. Export a file to back it up or move it.' }),
    h('div', { class: 'row wrap' },
      btn('Export save', () => { lab.save(); exportSave(lab.state); }, { icon: 'scroll', act: 'export' }),
      btn('Import save', () => fileIn.click(), { icon: 'plus', act: 'import' }),
      fileIn)) : h('div', { class: 'card parch' }, h('h3', { text: 'Saves' }), h('div', { class: 'row wrap' }, btn('Import save', () => fileIn.click(), { icon: 'plus', act: 'import' }), fileIn));
  modal({
    title: 'Settings',
    onClose: () => app.saveSettings(),
    body: [
      h('div', { class: 'card parch' }, h('h3', { text: 'Sound' }), vol('master', 'Master volume'), vol('sfx', 'Effects'), vol('music', 'Music'), check('musicOn', 'Play music', () => audio.music(s.musicOn)), check('muted', 'Mute everything')),
      h('div', { class: 'card parch' }, h('h3', { text: 'Display' }), h('div', { class: 'toggle-row' }, h('span', { text: 'Graphics' }), quality),
        h('div', { class: 'small muted', text: 'Automatic steps down when frames run slow. The physics and magic are identical in every mode.' }),
        check('showFps', 'Show performance stats')),
      saveSection,
      h('div', { class: 'card parch small' }, 'The Alchemist’s Shop — all art, sound, font and code made for this game. Runs fully offline.'),
    ],
  });
}

/** Request chips: an icon and a range per requirement. @param {any[]} reqs */
export function reqChips(reqs, cls = '') {
  return h('div', { class: 'req-chips ' + cls }, ...reqs.map((r) => h('span', { class: 'req-chip' + (r.kind === 'limit' ? ' limit' : ''), title: `${PROP_BY_KEY[r.key].label} ${reqText(r)}`, 'data-key': r.key }, icon(PROP_BY_KEY[r.key].icon, 'sm'), h('span', { class: 'tgt', text: reqText(r) }))));
}
