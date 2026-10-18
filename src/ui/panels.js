// Modal panels: shop & guild, recipe book, journal, ingredient inspector,
// guild advice, potion result, day summary, analysis, pause menu, settings.

import { h, btn, modal, toast, coins, starsText, confirmDialog, clear } from './dom.js';
import { icon } from './icons.js';
import { drawPortrait } from '../rendering/portraits.js';
import { drawJar } from '../rendering/art.js';
import { EQUIPMENT, RANKS } from '../game/equipment.js';
import { ACHIEVEMENTS } from '../game/state.js';
import { PROPERTY_LABELS } from '../game/evaluate.js';
import { viscosityClass } from '../game/measure.js';
import { EFFECTS, EFFECT_BY_KEY, EFFECT_KEYS, dominantEffect } from '../alchemy/effects.js';
import { rawSprite } from '../rendering/scenes.js';
import { compatFactor } from '../reactions/compatibility.js';
import { describeColor, rgbToHex } from '../core/color.js';
import { SIM } from '../simulation/constants.js';
import { exportSave, parseImport, saveGame } from '../game/persistence.js';
import { audio } from '../audio/audio.js';
import { archetypeOf } from '../game/customers.js';

const CAT_LABEL = { heat: 'Heating', cold: 'Cooling', vessel: 'Cauldrons', tool: 'Tools', instrument: 'Instruments', trials: 'Trials room', storage: 'Storage & foraging', guild: 'Guild' };

function jarCanvas(m, w = 22, hh = 30) {
  if (m.wild && m.form === 'solid') {
    const cv = rawSprite(m.wild.shape, m.look || m.color);
    cv.style.width = w * 2 + 'px';
    cv.style.height = w * 2 + 'px';
    return cv;
  }
  const cv = /** @type {HTMLCanvasElement} */ (h('canvas', { width: String(w), height: String(hh), style: { width: w * 2 + 'px', height: hh * 2 + 'px' } }));
  drawJar(cv.getContext('2d'), 2, 0, w - 4, hh, m.look || m.color, m.form);
  return cv;
}

/** Effect chips for a known effect record. @param {Record<string, number>} fx */
export function fxChips(fx, min = 1) {
  const list = EFFECT_KEYS.map((k) => /** @type {[string, number]} */ ([k, (fx && fx[k]) || 0])).filter(([, v]) => Math.abs(v) >= min).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
  if (!list.length) return [h('span', { class: 'muted', text: 'none' })];
  return list.map(([k, v]) => h('span', { class: 'fx-chip', title: EFFECT_BY_KEY[k].label }, icon(EFFECT_BY_KEY[k].icon, 'sm'), ` ${Math.round(v)}`));
}

function swatch(rgb) {
  return h('span', { class: 'swatch', style: { background: rgbToHex(rgb), display: 'inline-block', width: '18px', height: '12px', boxShadow: '0 0 0 1px #2b1d14', verticalAlign: 'middle' } });
}

// ------------------------------------------------------------------ shop
export function openShop(lab, tab = 'reagents') {
  const st = lab.state;
  const body = h('div');
  const tabs = h('div', { class: 'tabs' });
  let current = tab;
  const m = modal({ title: 'Market & Guild', body: [tabs, body], wide: true, onClose: () => lab.refreshHud(true) });
  m.el.insertBefore(tabs, m.body);
  const coinLine = h('div', { class: 'row', style: { justifyContent: 'flex-end', padding: '0 12px' } });
  m.el.insertBefore(coinLine, m.body);
  const renderTabs = () => {
    clear(tabs);
    for (const [k, label] of [['reagents', 'Reagents'], ['equipment', 'Equipment'], ['sell', 'Sell surplus']]) {
      tabs.appendChild(btn(label, () => { current = k; render(); }, { cls: current === k ? 'active' : '', act: 'shop-tab-' + k }));
    }
  };
  const render = () => {
    renderTabs();
    clear(coinLine).append(icon('coin'), h('span', { text: coins(st.coins) + ' coins' }), h('span', { class: 'muted small', text: ` · ${st.marketEvent.name}` }));
    clear(m.body);
    if (current === 'reagents') renderReagents(lab, m.body, render);
    else if (current === 'equipment') renderEquipment(lab, m.body, render);
    else renderSell(lab, m.body, render);
  };
  render();
  audio.play('page');
  return m;
}

function renderReagents(lab, body, rerender) {
  const st = lab.state;
  body.appendChild(h('div', { class: 'muted small', text: `Prices per 100 ml. Shelf space: ${st.cap.storage} ml per reagent. Water from the well is free. Wild herbs and minerals are free to gather in the Wilds; the herbalist sells the common ones at a premium.` }));
  const list = h('div', { class: 'list' });
  for (const id of st.world.ingredients) {
    const mt = st.lookup(id);
    if (mt.wild && mt.wild.gatherOnly) continue; // only found in the wilds
    const locked = mt.tier > st.rank;
    const price = st.priceOf(id);
    const stock = st.stock(id);
    const buyRow = h('div', { class: 'row buy-row', style: { flexWrap: 'wrap', justifyContent: 'flex-end' } });
    if (!locked && id !== st.world.roles.water) {
      for (const ml of [100, 250, 500]) {
        const cost = Math.round((ml / 100) * price * 10) / 10;
        const b = btn(`+${ml} ml`, () => {
          const r = st.buy(id, ml);
          if (r.ok) { audio.play('purchase'); lab.updateShelf(); } else { audio.play('error'); toast('Cannot buy', r.reason, 'lock'); }
          rerender();
        }, { cls: 'small', disabled: st.coins < cost || stock >= st.cap.storage, act: `buy-${id}-${ml}`, title: `Buy ${ml} ml for ${coins(cost)} coins` });
        b.appendChild(h('span', { class: 'price' }, icon('coin'), coins(cost)));
        buyRow.appendChild(b);
      }
    }
    list.appendChild(h('div', { class: 'item parch' + (locked ? ' locked' : '') },
      jarCanvas(mt, 18, 24),
      h('div', {},
        h('div', { class: 'title', text: mt.name }),
        h('div', { class: 'meta', text: locked ? `${mt.wild ? 'The herbalist sells it' : 'Unlocks'} at the rank of ${(RANKS[mt.tier] || RANKS[RANKS.length - 1]).name}.${mt.wild ? ' Until then, gather it in the wilds.' : ''}` : mt.description }),
        h('div', { class: 'meta', text: locked ? '' : `${mt.form} · ${coins(price)} per 100 ml · in stock: ${isFinite(stock) ? Math.round(stock) + ' ml' : 'unlimited'}` }),
      ),
      locked ? icon('lock') : buyRow,
    ));
  }
  body.appendChild(list);
}

function renderEquipment(lab, body, rerender) {
  const st = lab.state;
  for (const cat of Object.keys(CAT_LABEL)) {
    const items = EQUIPMENT.filter((e) => e.category === cat);
    body.appendChild(h('h3', { class: 'muted', style: { margin: '10px 0 2px', fontWeight: 'normal' }, text: CAT_LABEL[cat] }));
    const list = h('div', { class: 'list' });
    for (const e of items) {
      const owned = st.has(e.id);
      const rankOk = e.rank <= st.rank;
      const reqOk = !e.requires || e.requires.every((r) => st.has(r));
      let action;
      if (owned) action = h('span', { class: 'row' }, icon('check'), h('span', { class: 'small', text: 'Owned' }));
      else if (!rankOk) action = h('span', { class: 'small muted', text: RANKS[e.rank].name });
      else action = btn(`${coins(e.price)}`, async () => {
        const ok = await confirmDialog(`Buy ${e.name}?`, `${e.desc}\n\nCost: ${e.price} coins.`, 'Buy');
        if (!ok) return;
        const r = st.buyEquipment(e.id);
        if (r.ok) {
          audio.play('purchase');
          toast(`${e.name} installed`, e.desc, e.icon);
          lab.buildActions();
          lab.refreshCapabilities();
          lab.save();
        } else { audio.play('error'); toast('Cannot buy', r.reason, 'lock'); }
        rerender();
      }, { icon: 'coin', cls: 'gold', disabled: st.coins < e.price || !reqOk, act: 'equip-' + e.id });
      list.appendChild(h('div', { class: 'item parch' + (owned || rankOk ? '' : ' locked') },
        h('img', { src: icon(e.icon).src, class: 'ico lg', alt: '' }),
        h('div', {}, h('div', { class: 'title', text: e.name }), h('div', { class: 'meta', text: e.desc + (!reqOk && !owned ? ' (requires the previous upgrade)' : '') })),
        action,
      ));
    }
    body.appendChild(list);
  }
}

function renderSell(lab, body, rerender) {
  const st = lab.state;
  body.appendChild(h('div', { class: 'muted small', text: 'The merchant buys back reagents at 40% of today’s price.' }));
  const list = h('div', { class: 'list' });
  for (const id of st.world.ingredients) {
    const s = st.stock(id);
    if (!isFinite(s) || s < 100) continue;
    const mt = st.lookup(id);
    const val = Math.round(st.priceOf(id) * 0.4 * 10) / 10;
    list.appendChild(h('div', { class: 'item parch' }, jarCanvas(mt, 18, 24),
      h('div', {}, h('div', { class: 'title', text: mt.name }), h('div', { class: 'meta', text: `${Math.round(s)} ml in stock · ${coins(val)} per 100 ml` })),
      btn('Sell 100 ml', () => { const r = st.sellBack(id, 100); if (r.ok) { audio.play('coin'); lab.updateShelf(); } rerender(); }, { act: 'sell-' + id }),
    ));
  }
  if (!list.children.length) list.appendChild(h('div', { class: 'card parch', text: 'Nothing worth selling right now.' }));
  body.appendChild(list);
}

// ------------------------------------------------------------------ ingredient inspector
export function openIngredient(lab, id) {
  const st = lab.state;
  const m = st.lookup(id);
  if (!m) return;
  const k = st.knowledge[id] || {};
  const has = (e) => lab.sandbox || st.has(e);
  const tags = [];
  tags.push(m.form);
  if (m.form === 'powder') tags.push(m.friction > 0.68 ? 'piles steeply' : 'pours like sand');
  else if (m.form === 'liquid') tags.push(m.viscosity < 3 ? 'thin' : m.viscosity < 300 ? 'syrupy' : 'very thick');
  if (m.binder > 0.3) tags.push('forms dough');
  if (m.solubility > 0.05) tags.push('soluble');
  if (k.flammable || m.flammability > 0.3) tags.push(k.flammable ? 'flammable (seen)' : 'smells flammable');
  if (m.glow > 0.2) tags.push('glows');
  const water = st.lookup(st.world.roles.water);
  const mixWater = compatFactor(m.compat[0], m.compat[1], water.compat[0], water.compat[1]) > 0.5;
  tags.push(mixWater ? 'mixes with water' : 'does not mix with water');
  const facts = h('div', { class: 'kv' },
    h('span', { class: 'k', text: 'Colour' }), h('span', {}, swatch(m.look || m.color), ' ' + describeColor(m.look || m.color)),
    h('span', { class: 'k', text: 'Density' }), h('span', { text: has('hydrometer') ? `${m.density.toFixed(2)} g/ml` : m.density > 1.3 ? 'heavy' : m.density < 0.9 ? 'light' : 'like water' }),
    h('span', { class: 'k', text: m.form === 'powder' ? 'Grains' : 'Viscosity' }), h('span', { text: m.form === 'powder' ? `piles at ≈${Math.round(Math.atan(m.friction) * 180 / Math.PI)}°` + (m.solubility > 0.05 ? ', dissolves in water' : '') : has('viscometer') ? `${m.viscosity} cP` : viscosityClass(m.viscosity) }),
    h('span', { class: 'k', text: 'Melts' }), h('span', { text: k.melt !== undefined ? `≈${k.melt}°C (observed)` : m.form === 'liquid' ? 'unknown (freeze it to find out)' : 'unknown' }),
    h('span', { class: 'k', text: 'Boils' }), h('span', { text: k.boil !== undefined ? `≈${k.boil}°C (observed)` : isFinite(m.boil) ? 'unknown (heat it to find out)' : 'does not boil' }),
    h('span', { class: 'k', text: 'Price' }), h('span', { text: `${coins(st.priceOf(id))} / 100 ml` }),
  );
  const asp = h('div', { class: 'aspect-bars' });
  for (const e of EFFECTS) {
    const v = (m.effects && m.effects[e.key]) || 0;
    if (Math.abs(v) < 1) continue;
    asp.append(h('span', {}, icon(e.icon, 'sm'), ' ' + e.label), h('div', { class: 'bar' }, h('i', { style: { width: Math.min(100, Math.abs(v)) + '%', background: `rgb(${e.color.map((c) => Math.round(c * 255)).join(',')})` } })), h('span', { text: e.key === 'acidity' && v < 0 ? `${Math.round(v)} (alkaline)` : String(Math.round(v)) }));
  }
  if (!asp.children.length) asp.append(h('span', { class: 'muted', text: 'No magical or chemical effect.' }));
  const reactions = st.world.reactions.filter((r) => (r.a === id || r.b === id) && st.journal['reaction:' + r.id]);
  modal({
    title: m.name,
    body: [
      h('div', { class: 'card parch ing-card' }, jarCanvas(m, 22, 30), h('div', {}, h('div', { text: m.description }), h('div', {}, ...tags.map((t) => h('span', { class: 'tag', text: t }))))),
      h('div', { class: 'card parch' }, facts),
      h('div', { class: 'card parch' }, h('div', { class: 'small muted', text: m.product ? 'Effects of this pure substance (as the guild knows it)' : 'Known effects of the pure ingredient (mixtures must be tested)' }), asp,
        m.wild && m.form === 'solid' ? h('div', { class: 'small', text: 'Supplied whole: crush it in the pot with the pestle, or switch on “Ground” to grind it in the mortar first. Only what dissolves takes effect.' }) : null),
      reactions.length ? h('div', { class: 'card parch' }, h('div', { class: 'small muted', text: 'Known reactions' }), ...reactions.map((r) => h('div', { class: 'small', text: `• ${r.name}: ${r.hint || ''}` }))) : null,
    ],
  });
}

// ------------------------------------------------------------------ advice / hint
export function openHint(lab) {
  const st = lab.state;
  const com = st.current;
  if (!com) return;
  const show = () => {
    const ref = com.reference;
    if (com.effectOrder) {
      // effect orders: a clue, never the recipe — the player must experiment
      const main = ref.ingredients.slice().sort((a, b) => b.n - a.n).map((i) => st.lookup(i.id)).find((x) => x && x.effects && Object.values(x.effects).some((v) => Math.abs(v) >= 12));
      const tips = [];
      if (main) tips.push(`A guild alchemist would start from ${main.name}${main.wild ? ` (it grows in the ${main.wild.region === 'forest' ? 'Whisperwood' : main.wild.region === 'meadow' ? 'Sunlit Meadow' : main.wild.region === 'river' ? 'Willow Bank' : main.wild.region === 'quarry' ? 'Ironstone Quarry' : main.wild.region === 'moonfen' ? 'Moonfen' : 'Ember Crags'})` : ''}.`);
      if (ref.ingredients.some((i) => i.ground)) tips.push('Grind what is whole — only what dissolves takes effect.');
      if ((ref.heatTo ?? 20) > 40) tips.push('Patience and gentle heat draw out more than stirring alone.');
      tips.push('How much, and with what? That you must find out. Test small doses before you bottle.');
      modal({ title: 'Guild advice', body: [h('div', { class: 'card parch' }, ...tips.map((t) => h('div', { class: 'small', text: '• ' + t })))] });
      return;
    }
    const total = ref.ingredients.reduce((a, b) => a + b.n, 0);
    const rows = ref.ingredients.map((i) => h('div', { class: 'row' }, jarCanvas(st.lookup(i.id), 12, 16), h('span', { text: `${Math.round((i.n / total) * 100)}%  ${st.lookup(i.id).name}` })));
    const steps = [];
    if (ref.crush) steps.push('Crush the solid chunks with the pestle.');
    if (ref.knead) steps.push('Stir and knead thoroughly.');
    else steps.push('Stir until the colour is even.');
    if ((ref.heatTo ?? 20) > 30) steps.push(`Heat to about ${Math.round(ref.heatTo)}°C and hold it there a while.`);
    if ((ref.coolTo ?? 20) < 12) steps.push(`Chill it to about ${Math.round(ref.coolTo)}°C.`);
    steps.push(`Serve at about ${Math.round(ref.serveTemp ?? 20)}°C; bottle at least ${com.bottleMl} ml.`);
    modal({
      title: 'Guild advice',
      body: [
        h('div', { class: 'card parch' }, h('div', { class: 'small muted', text: 'A guild alchemist would try roughly:' }), ...rows),
        h('div', { class: 'card parch' }, ...steps.map((s) => h('div', { class: 'small', text: '• ' + s }))),
        h('div', { class: 'small muted', text: 'Other approaches can work too — the customer only cares about the result.' }),
      ],
    });
  };
  if (com.hintBought || !com.hintCost) { com.hintBought = true; show(); return; }
  confirmDialog('Ask the guild?', `A guild alchemist will suggest an approach for ${com.hintCost} coins.`, 'Pay').then((ok) => {
    if (!ok) return;
    if (st.coins < com.hintCost) { toast('Not enough coins', '', 'coin'); return; }
    st.coins = Math.round((st.coins - com.hintCost) * 10) / 10;
    com.hintBought = true;
    audio.play('coin');
    lab.refreshHud();
    show();
  });
}

// ------------------------------------------------------------------ bottling
/**
 * Choose a measured quantity to bottle into a sealed vial.
 * @param {any} lab @param {number} avail particles at the tap @param {(n:number)=>void} onPick
 */
export function openBottleSize(lab, avail, onPick) {
  const st = lab.state;
  const com = lab.sandbox ? null : st.current;
  const per = SIM.ML_PER_PARTICLE;
  const sizes = new Set([25, 50, 100, 150, 200, 300]);
  if (com) sizes.add(com.bottleMl);
  const list = [...sizes].sort((a, b) => a - b);
  let m;
  const pick = (ml) => { m.close(); onPick(Math.max(1, Math.round(ml / per))); };
  const btns = list.map((ml) => btn(`${ml} ml${com && ml === com.bottleMl ? ' · the order' : ''}`, () => pick(ml), {
    cls: com && ml === com.bottleMl ? 'primary' : '', disabled: ml / per > avail, act: 'bottle-' + ml,
  }));
  btns.push(btn(`All at the tap · ${avail * per} ml`, () => pick(avail * per), { act: 'bottle-all' }));
  m = modal({
    title: 'Bottle a measured quantity',
    body: [h('div', { class: 'card parch' },
      h('div', { class: 'small', text: `The vial takes what runs out of the tap — the lowest layer first. ${avail * per} ml can be drawn now.` }),
      h('div', { class: 'small muted', text: 'A sealed vial keeps its exact contents. You can test doses from it, pour it back to keep working, or serve it.' }),
      h('div', { class: 'row wrap bottle-sizes' }, ...btns))],
  });
  return m;
}

// ------------------------------------------------------------------ results
export function showResult(lab, com, meas, ev, recipe, onDone) {
  const st = lab.state;
  const mood = ev.quality >= 0.7 ? 'happy' : ev.quality >= 0.4 ? 'neutral' : 'unhappy';
  const portrait = /** @type {HTMLCanvasElement} */ (h('canvas'));
  drawPortrait(portrait, com.customer.portrait, mood);
  const arch = com.customer.title;
  const quote = ev.quality >= 0.7 ? pick(com, 'pleased') : pick(com, 'displeased');
  const table = h('table', { class: 'result-rows' });
  for (const r of ev.rows) {
    const label = PROPERTY_LABELS[r.req.key] || r.req.key;
    const target = r.req.key === 'color' ? h('span', {}, swatch(r.req.rgb), ' ' + r.req.label) : h('span', { text: r.req.label });
    // the customer reports how an effect felt — not a laboratory reading
    const fxWord = EFFECT_BY_KEY[r.req.key] ? (r.score >= 0.999 ? 'as wanted' : r.req.kind === 'max' ? 'too much!' : r.req.kind === 'min' ? 'too weak' : r.value > r.req.target ? 'too strong' : 'too weak') : null;
    const got = r.req.key === 'color' ? h('span', {}, swatch(meas.color), ' ' + r.text) : h('span', { text: fxWord || r.text });
    table.appendChild(h('tr', {}, h('td', {}, icon(r.score >= 0.999 ? 'check' : r.score > 0.5 ? 'star' : 'close', 'sm'), ' ' + label), h('td', {}, target), h('td', {}, got), h('td', { class: 'sc', text: Math.round(r.score * 100) + '%' })));
  }
  const nameInput = /** @type {HTMLInputElement} */ (h('input', { type: 'text', value: recipe.name, maxlength: '40', 'aria-label': 'Recipe name' }));
  let saved = false;
  const saveBtn = btn('Save recipe', () => {
    if (saved) return;
    saved = true;
    const evs = st.addRecipe({ ...recipe, name: nameInput.value.trim() || recipe.name });
    for (const e of evs) lab.announce(e);
    toast('Recipe saved', nameInput.value, 'book');
    saveBtn.disabled = true;
  }, { icon: 'book', act: 'save-recipe' });
  let m;
  const done = btn('Continue', () => m.close(), { cls: 'primary', act: 'result-continue' });
  m = modal({
    title: ev.perfect ? 'A perfect potion!' : ev.quality >= 0.7 ? 'Sold!' : ev.quality >= 0.4 ? 'Sold — grudgingly' : 'Disappointing…',
    closable: true,
    onClose: onDone,
    body: [
      h('div', { class: 'card parch' },
        h('div', { class: 'result-head' }, portrait, h('div', {},
          h('div', { class: 'small muted', text: `${com.customer.name} · ${arch}` }),
          h('div', { text: '“' + quote + '”' }),
          h('div', { class: 'stars', text: starsText(ev.stars) }))),
        h('div', { class: 'pay', text: `+${coins(ev.payment)} coins` }),
        h('div', { class: 'small', style: { textAlign: 'center' }, text: `Reputation ${ev.repDelta >= 0 ? '+' : ''}${ev.repDelta} · quality ${Math.round(ev.quality * 100)}%` }),
        h('div', { class: 'quality-bar' }, h('i', { style: { width: Math.round(ev.quality * 100) + '%' } })),
        table),
      h('div', { class: 'card parch' }, h('div', { class: 'small muted', text: 'Save this preparation to your recipe book:' }), h('div', { class: 'row' }, nameInput, saveBtn)),
    ],
    foot: [done],
  });
  if (ev.perfect) audio.play('fanfare');
}

function pick(com, key) {
  const lines = archetypeOf(com.customer.archetype)[key] || ['Hmm.'];
  return lines[Math.floor(Math.random() * lines.length)];
}

export function showDaySummary(lab, summary, onDone) {
  const st = lab.state;
  const net = summary.earned - summary.spent;
  modal({
    title: `Day ${summary.day} is over`,
    onClose: onDone,
    body: [
      h('div', { class: 'card parch' },
        h('div', { class: 'kv' },
          h('span', { class: 'k', text: 'Customers served' }), h('span', { text: String(summary.served) }),
          h('span', { class: 'k', text: 'Earned' }), h('span', { text: coins(summary.earned) }),
          h('span', { class: 'k', text: 'Spent' }), h('span', { text: coins(summary.spent) }),
          h('span', { class: 'k', text: 'Net' }), h('span', { text: (net >= 0 ? '+' : '') + coins(net) }),
          h('span', { class: 'k', text: 'Rank' }), h('span', { text: `${st.rankName} (${st.reputation} rep)` }),
        )),
      h('div', { class: 'card parch' }, h('b', { text: `Tomorrow: ${st.marketEvent.name}` }), h('div', { class: 'small', text: st.marketEvent.text })),
      st.nextRank() ? h('div', { class: 'small muted', text: `Next rank: ${st.nextRank().name} at ${st.nextRank().rep} reputation.` }) : null,
    ],
    foot: [btn('Open the shop', () => document.querySelector('.overlay .modal-head .btn').dispatchEvent(new MouseEvent('click')), { cls: 'primary', act: 'next-day' })],
  });
}

export function showAnalysis(lab, m, recipe, title = 'Analysis of the brew') {
  const st = lab.state;
  const comp = Object.entries(m.composition).sort((a, b) => b[1] - a[1]);
  // readings are only as precise as the instruments on the bench
  const has = (e) => lab.sandbox || st.has(e);
  const level = (v) => (v >= 66 ? 'high' : v >= 33 ? 'moderate' : 'low');
  const density = has('hydrometer') ? `${m.density.toFixed(3)} g/ml` : `${m.density > 1.3 ? 'heavy' : m.density < 0.9 ? 'light' : 'like water'} (hydrometer for exact)`;
  const visc = has('viscometer') ? `${viscosityClass(m.viscosity)} (${m.viscosity < 100 ? m.viscosity.toFixed(1) : Math.round(m.viscosity)} cP)` : viscosityClass(m.viscosity);
  const assay = (v) => (has('assay') ? String(Math.round(v)) : `${level(v)} (assay kit for exact)`);
  const aura = has('lens') ? EFFECTS.filter((e, k) => Math.abs(m.effects[k]) >= 3).map((e) => e.label).join(', ') || 'no aura' : null;
  modal({
    title,
    body: [
      h('div', { class: 'card parch' }, h('div', { class: 'kv' },
        h('span', { class: 'k', text: 'Colour' }), h('span', {}, swatch(m.color), ' ' + describeColor(m.color)),
        h('span', { class: 'k', text: 'Volume' }), h('span', { text: `${m.ml} ml` }),
        h('span', { class: 'k', text: 'Temperature' }), h('span', { text: `${Math.round(m.temperature)}°C` }),
        h('span', { class: 'k', text: 'Density' }), h('span', { text: density }),
        h('span', { class: 'k', text: 'Viscosity' }), h('span', { text: visc }),
        h('span', { class: 'k', text: 'Stability' }), h('span', { text: assay(m.stability) }),
        h('span', { class: 'k', text: 'Volatility' }), h('span', { text: assay(m.volatility) }),
        has('galvanometer') ? h('span', { class: 'k', text: 'Charge' }) : null, has('galvanometer') ? h('span', { text: `${m.charge >= 0 ? '+' : ''}${m.charge.toFixed(2)}` }) : null,
        h('span', { class: 'k', text: 'Effects' }), h('span', { text: 'unknown — test a dose in the Trials room' }),
        aura ? h('span', { class: 'k', text: 'Aether aura' }) : null, aura ? h('span', { text: aura }) : null,
      )),
      h('div', { class: 'card parch' }, h('div', { class: 'small muted', text: 'Composition' }), ...comp.map(([id, f]) => h('div', { class: 'small', text: `${(f * 100).toFixed(1)}%  ${st.lookup(id) ? st.lookup(id).name : id}` }))),
      lab.sandbox ? null : h('div', { class: 'row' }, btn('Save as recipe', () => { const ev = st.addRecipe({ ...recipe, name: 'Experiment ' + (st.recipes.length + 1) }); for (const e of ev) lab.announce(e); toast('Recipe saved', '', 'book'); }, { icon: 'book' })),
    ],
  });
}

// ------------------------------------------------------------------ recipes
export function openRecipes(lab) {
  if (lab.showView) { lab.showView('book'); lab.views.book.open('recipes'); return; }
}

/** Render the recipe book into a container. */
export function renderRecipes(lab, container, rerender) {
  const st = lab.state;
  const m = { body: container, close: () => {} };
  const render = () => {
    clear(m.body);
    if (!st.recipes.length) {
      m.body.appendChild(h('div', { class: 'card parch', text: 'Your recipe book is empty. After bottling a potion you can save how you made it here, then prepare it again later.' }));
      return;
    }
    for (const r of st.recipes) {
      const ing = r.ingredients.map((i) => `${i.ml} ml ${st.lookup(i.id) ? st.lookup(i.id).name : '?'}`).join(', ');
      const steps = [];
      if (r.crushed) steps.push('crush solids');
      if (r.stirSeconds) steps.push(`stir ~${r.stirSeconds}s`);
      if (r.maxTemp > 30) steps.push(`heat to ${r.maxTemp}°C`);
      if (r.minTemp < 12) steps.push(`chill to ${r.minTemp}°C`);
      steps.push(`serve at ${r.serveTemp}°C`);
      const canAfford = r.ingredients.every((i) => lab.sandbox || st.stock(i.id) >= i.ml);
      const actions = h('div', { class: 'row', style: { flexWrap: 'wrap' } },
        btn('Prepare', () => { prepareRecipe(lab, r); if (lab.showView) lab.showView('brew'); }, { icon: 'pour', disabled: !canAfford, title: canAfford ? 'Pour all ingredients' : 'Not enough stock', act: 'prepare' }),
        st.has('homunculus') ? btn('Homunculus', () => { lab.startHomunculus(r); if (lab.showView) lab.showView('brew'); }, { icon: 'homunculus', disabled: !canAfford, act: 'homunculus' }) : null,
        btn('', async () => { const name = prompt('Rename recipe', r.name); if (name) { r.name = name.slice(0, 40); render(); } }, { icon: 'scroll', cls: 'icon', title: 'Rename' }),
        btn('', async () => { if (await confirmDialog('Delete recipe?', r.name, 'Delete', 'danger')) { st.recipes.splice(st.recipes.indexOf(r), 1); render(); } }, { icon: 'trash', cls: 'icon danger', title: 'Delete' }),
      );
      const verified = r.verified && Object.keys(r.verified).length;
      m.body.appendChild(h('div', { class: 'item parch' },
        swatch(r.result.color),
        h('div', {},
          h('div', { class: 'title', text: r.name }),
          h('div', { class: 'meta', text: ing }),
          h('div', { class: 'meta', text: steps.join(' · ') }),
          h('div', { class: 'meta', text: `Result: ${describeColor(r.result.color)}, ${viscosityClass(r.result.viscosity)}, ${r.result.density.toFixed(2)} g/ml${r.quality !== null && r.quality !== undefined ? ` · sold at ${Math.round(r.quality * 100)}% quality` : ''}` }),
          h('div', { class: 'meta' }, h('span', { class: verified ? 'ok' : 'muted', text: verified ? 'Tested: ' : 'Untested formula — effects unknown' }), ...(verified ? fxChips(r.verified, 0.5) : [])),
        ),
        actions,
      ));
    }
  };
  render();
  void rerender;
}

/** Pour a recipe's ingredients in order (the player still stirs and heats). */
function prepareRecipe(lab, r) {
  const queue = r.ingredients.slice();
  const next = () => {
    if (!queue.length) {
      toast('Ingredients poured', `Now ${r.stirSeconds ? 'stir' : 'mix'}${r.maxTemp > 30 ? `, heat to ${r.maxTemp}°C` : ''}${r.minTemp < 12 ? `, chill to ${r.minTemp}°C` : ''} and serve at ${r.serveTemp}°C.`, 'book', 6000);
      return;
    }
    if (lab.sim.emitter.pouring) { setTimeout(next, 200); return; }
    const i = queue.shift();
    lab.selectIngredient(i.id);
    lab.startPour(lab.pourX, Math.round(i.ml / SIM.ML_PER_PARTICLE), i.ground);
    setTimeout(next, 250);
  };
  next();
}

// ------------------------------------------------------------------ journal
export function openJournal(lab, tab = 'journal') {
  if (lab.showView) { lab.showView('book'); lab.views.book.open(tab === 'discoveries' ? 'journal' : tab); }
}

/** Render a journal tab (journal | achievements | history) into a container. */
export function renderJournal(lab, container, tab = 'journal') {
  const st = lab.state;
  const m = { body: container };
  const current = tab === 'journal' ? 'discoveries' : tab;
  const render = () => {
    clear(m.body);
    if (current === 'discoveries') {
      const entries = Object.values(st.journal).filter((e) => e.kind !== 'ingredient').sort((a, b) => b.day - a.day);
      const total = st.world.reactions.length;
      m.body.appendChild(h('div', { class: 'small muted', text: `Reactions discovered: ${st.reactionsDiscovered()} of ${total}. Keep experimenting — heat, cold, stirring and new combinations all reveal secrets.` }));
      if (!entries.length) m.body.appendChild(h('div', { class: 'card parch', text: 'Nothing recorded yet. Watch closely as you brew: boiling, freezing, dough, dissolving and reactions are all noted here.' }));
      for (const e of entries) {
        m.body.appendChild(h('div', { class: 'card parch' }, h('div', { class: 'row' }, icon(e.kind === 'reaction' ? 'eye' : e.kind === 'fire' ? 'flame' : e.kind === 'phase' ? 'thermo' : 'scroll'), h('b', { text: e.title }), h('span', { class: 'spacer' }), h('span', { class: 'small muted', text: `Day ${e.day}` })), h('div', { class: 'small', text: e.text })));
      }
    } else if (current === 'ingredients') {
      const list = h('div', { class: 'list' });
      const ids = st.world.ingredients.concat(st.world.materials.filter((x) => x.product && (st.knowledge[x.id] || {}).seen).map((x) => x.id));
      for (const id of ids) {
        const mt = st.lookup(id);
        const known = mt.tier <= st.rank || (st.knowledge[id] || {}).seen;
        list.appendChild(h('div', { class: 'item parch' + (known ? '' : ' locked') }, jarCanvas(mt, 14, 18),
          h('div', {}, h('div', { class: 'title', text: known ? mt.name : '???' }), h('div', { class: 'meta', text: known ? mt.description : 'Not yet available.' })),
          known ? btn('', () => openIngredient(lab, id), { icon: 'lens', cls: 'icon', title: 'Inspect' }) : icon('lock'),
        ));
      }
      m.body.appendChild(list);
    } else if (current === 'achievements') {
      const list = h('div', { class: 'list' });
      for (const a of ACHIEVEMENTS) {
        const got = !!st.achievements[a.id];
        list.appendChild(h('div', { class: 'item parch' + (got ? '' : ' locked') }, icon(got ? 'star' : 'lock'), h('div', {}, h('div', { class: 'title', text: a.name }), h('div', { class: 'meta', text: a.desc })), h('span', { class: 'price' }, icon('coin', 'sm'), String(a.reward))));
      }
      m.body.appendChild(list);
    } else {
      if (!st.history.length) m.body.appendChild(h('div', { class: 'card parch', text: 'No sales yet.' }));
      for (const s of st.history) {
        m.body.appendChild(h('div', { class: 'item parch' }, s.color ? swatch(s.color) : icon('flask'), h('div', {}, h('div', { class: 'title', text: s.potion }), h('div', { class: 'meta', text: `Day ${s.day} · ${s.customer} (${s.title}) · ${Math.round(s.quality * 100)}%` })), h('span', {}, h('span', { class: 'stars', text: starsText(s.stars) }), h('div', { class: 'small', text: `+${coins(s.paid)}` }))));
      }
    }
  };
  render();
}

// ------------------------------------------------------------------ pause / settings
export function openPause(lab) {
  const app = lab.app;
  let m;
  const items = [
    btn('Resume', () => m.close(), { cls: 'primary', icon: 'speed', act: 'resume' }),
    btn('How to play', () => { m.close(); openHelp(); }, { icon: 'help', act: 'help' }),
    btn('Settings & saves', () => { m.close(); openSettings(app, lab); }, { icon: 'gear', act: 'settings' }),
  ];
  if (lab.state.receiver && lab.state.receiver.count) items.push(btn('Pour back distillate', () => { lab.pourReceiver(); m.close(); }, { icon: 'alembic' }));
  if (!lab.sandbox) items.push(btn('Restart tutorial', () => { m.close(); lab.tutorial && lab.tutorial.start(true); }, { icon: 'bulb' }));
  items.push(btn(lab.sandbox ? 'Leave experiment' : 'Save & quit to menu', () => { m.close(); app.showMenu(); }, { icon: 'door', act: 'quit' }));
  m = modal({ title: lab.sandbox ? 'Free Experiment' : 'Paused', body: h('div', { class: 'list' }, items) });
}

export function openHelp() {
  const sec = (title, lines) => h('div', { class: 'card parch' }, h('h3', { text: title }), ...lines.map((l) => h('div', { class: 'small', text: '• ' + l })));
  modal({
    title: 'How to play',
    wide: true,
    body: [
      sec('Your shop', ['Customers ask for potions with particular effects (healing, strength, love, fire…) and physical qualities (colour, thickness, temperature). The order strip shows each requirement and a live meter for what your instruments can measure.', 'You know what each plain ingredient does. You do NOT know what a mixture does: mixing, heat, reactions and hidden laws change things. Test doses in the Trials room to find out — a customer only accepts a potion whose effects you have verified.', 'Bottle when you are happy — the potion is drawn from the tap at the bottom of the cauldron, so the lowest layer comes out first. Then serve it at the Counter.', 'Better matches earn more coins and reputation. Reputation unlocks ranks, regions of the wilds, reagents and equipment.']),
      sec('Wilds and trials', ['Gather roots, leaves, flowers, mushrooms and minerals in the Wilds. Deposits are finite and regrow over time, even while the game is closed.', 'Whole roots and stones do nothing until crushed (pestle) or ground (mortar, the “Ground” switch on the shelf). Only what dissolves takes effect; hot water dissolves more, and some herbs steep into strong extracts when held warm.', 'Each subject responds to some effects only: a stone shows acid but not love. Choose subjects that cover what the customer cares about.', 'When a trial surprises you, a hidden law may be at work. Confirm it twice and your theory learns it.']),
      sec('Brewing', ['Tap a jar on the shelf, then hold your finger (or the mouse) inside the cauldron to pour. Dose buttons pour exact amounts.', 'Stir with the spoon: drag through the brew. Mixing starts where liquids touch and spreads; stirring speeds it up dramatically.', 'Powders pile up like sand. Knead a binding powder with a watery liquid to make dough; add more liquid to thin it.', 'Slide the fire control right to heat from below, left to cool. Heat spreads through the brew gradually.', 'Keep the lid on to trap vapour; let things cool and the vapour condenses back. Open the lid to let it escape.', 'Freeze liquids into blocks, then crush them with the pestle. Some reagents react when mixed, heated or chilled — discoveries go into your journal.']),
      sec('Controls', ['Keys: 1 pour · 2 spoon · 3 pestle · 4 skimmer · 5 inspect · L lid · B bottle · F time speed · A auto-stir · arrows fire · S shop · R recipes · J journal · Esc menu.', 'Long-press (or right-click) a jar to inspect a reagent.', 'Use the time-speed button to skip waiting while things heat, cool or react.']),
      sec('Tips', ['Ask the guild for advice on a difficult order — it costs a few coins.', 'Instruments like the hydrometer, viscometer, assay kit and aether lens turn rough guesses into exact readings.', 'If you run out of money, the guild will help a struggling apprentice once a day — and water from the well is always free.']),
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
    h('div', { class: 'small', text: 'The game saves automatically on this device. Export a file to back it up or move it to another device.' }),
    h('div', { class: 'row', style: { flexWrap: 'wrap', marginTop: '6px' } },
      btn('Export save', () => { lab.save(); exportSave(lab.state); }, { icon: 'scroll', act: 'export' }),
      btn('Import save', () => fileIn.click(), { icon: 'plus', act: 'import' }),
      fileIn,
    )) : h('div', { class: 'card parch' }, h('h3', { text: 'Saves' }), h('div', { class: 'row', style: { flexWrap: 'wrap' } }, btn('Import save', () => fileIn.click(), { icon: 'plus', act: 'import' }), fileIn));
  modal({
    title: 'Settings',
    onClose: () => app.saveSettings(),
    body: [
      h('div', { class: 'card parch' }, h('h3', { text: 'Sound' }), vol('master', 'Master volume'), vol('sfx', 'Effects'), vol('music', 'Music'), check('musicOn', 'Play music', () => audio.music(s.musicOn)), check('muted', 'Mute everything')),
      h('div', { class: 'card parch' }, h('h3', { text: 'Display' }), h('div', { class: 'toggle-row' }, h('span', { text: 'Graphics' }), quality),
        h('div', { class: 'small muted', text: 'High quality uses the finest pixels and every glow. Balanced keeps the lighting and full frame rate with coarser pixels on large screens. Battery saver draws at 30 frames per second with coarser pixels and no lighting. Automatic steps down when frames run slow. The physics, quantities and scores are identical in every mode.' }),
        check('showFps', 'Show performance stats')),
      saveSection,
      h('div', { class: 'card parch small' }, 'The Alchemist’s Shop — all art, sound, font and code made for this game. Runs fully offline.'),
    ],
  });
}
