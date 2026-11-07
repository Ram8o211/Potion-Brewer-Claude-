// Aging on the potion shelves: a selected bottle shows three slots — a Fire
// or Frost potion (another shelved bottle) that warms or chills it, a
// temperature rune that holds it on the way, and a biome rune that hastens
// the extraction of what carries its effect — and how its aging goes. The
// cellar engine is game/cellar.js; the bottle's state is state.js
// (startAging, chargeBottle, runeBottle, finishAging).
//
// A Fire/Frost bottle is loaded by tapping the slot and choosing one, or by
// dragging a bottle from the shelves onto the slot (counter.js).

import { h, btn, toast } from './dom.js';
import { icon } from './icons.js';
import { drawBottle } from '../rendering/renderer.js';
import { potionNet, vesselReport, chargeLimit, CELLAR_T, BIOME_RUNES, WARD_BOOST } from '../game/cellar.js';
import { audio } from '../audio/audio.js';

/** An sRGB 0..1 colour as CSS. @param {number[]} c */
const rgb = (c) => `rgb(${Math.round(c[0] * 255)},${Math.round(c[1] * 255)},${Math.round(c[2] * 255)})`;

/** @param {number} net */
const potName = (net) => (net > 0 ? 'Fire' : 'Frost');

/** A little bottle picture. @param {any} b */
export function bottleArt(b) {
  const cv = /** @type {HTMLCanvasElement} */ (h('canvas', { width: '16', height: '22', class: 'vial-art' }));
  drawBottle(/** @type {CanvasRenderingContext2D} */ (cv.getContext('2d')), 2, 2, 12, 19, b.m ? b.m.color : [0.5, 0.5, 0.5], Math.min(1, b.ml / Math.max(1, b.bottledMl || b.ml)));
  return cv;
}

/** The shelved bottles that can load a bottle's Fire/Frost slot. @param {any} st @param {any} b */
export function chargers(st, b) {
  return st.bottles.filter((x) => x !== b && !x.aging && x.m && potionNet(x.m.effects));
}

/**
 * Load a bottle's Fire/Frost slot with `ml` of another bottle; tells the player how it went.
 * @param {any} lab @param {string} bottleId @param {string} chargeId @param {number} ml
 */
export function loadCharge(lab, bottleId, chargeId, ml) {
  const st = lab.state;
  const cb = st.bottles.find((x) => x.id === chargeId);
  const net = cb && cb.m ? potionNet(cb.m.effects) : 0;
  const r = st.chargeBottle(bottleId, chargeId, ml);
  if (!r.ok) { toast('Cannot', r.reason, 'lock'); audio.play('error'); return r; }
  toast(`${potName(net)} potion loaded`, `${Math.round(r.ml)} ml in the slot: it can take the bottle to ${r.limit}°C.`, net > 0 ? 'flame' : 'snow', 3200);
  audio.play('glass');
  lab.save();
  return r;
}

/**
 * The aging part of a selected bottle's detail.
 * @param {any} view the counter view (keeps the slot being edited, the ml and the rune's target)
 * @param {any} b the selected bottle
 * @param {()=>void} rerender
 */
export function agingBlock(view, b, rerender) {
  const lab = view.lab, st = lab.state;
  const box = h('div', { class: 'aging', 'data-aging': b.aging ? 'on' : 'off' });
  const head = h('div', { class: 'row aging-head' }, icon('shelf2', 'sm'), h('b', { text: 'Aging' }), h('span', { class: 'spacer' }),
    h('span', { class: 'small muted', text: st.agingSlots > 0 ? `${st.agingCount}/${st.agingSlots} aging · runes in hand: ${Number.isFinite(st.cellar.runes) ? st.cellar.runes : '∞'}` : '' }));
  box.append(head);
  if (st.agingSlots <= 0) {
    box.append(h('div', { class: 'small muted', text: 'A bottle can age on the shelf — it goes on extracting for hours, even while the shop is closed — once you own the Aging Cellar (the guild sells it in the Shop).' }));
    return box;
  }
  const v = b.aging;
  const rep = v ? vesselReport(v, st.lookup) : null;
  // ---- the two slots
  const c = rep && rep.charge;
  const chargeSlot = h('button', { class: 'age-slot charge' + (c ? ' full ' + (c.net > 0 ? 'fire' : 'frost') : '') + (view.agePick === 'charge' ? ' open' : ''), 'data-slot': 'charge', 'data-act': 'age-slot-charge',
    title: 'The Fire or Frost slot: tap to choose a potion from the shelves, or drag a bottle here' },
  c ? icon(c.net > 0 ? 'flame' : 'snow') : h('span', { class: 'age-plus', text: '+' }),
  h('span', { class: 'age-slot-txt' },
    h('b', { text: c ? `${potName(c.net)} ${Math.abs(c.net)}%` : 'Fire / Frost' }),
    h('span', { class: 'small', text: c ? `${c.ml.toFixed(0)} ml left · to ${c.limit}°C` : 'a potion to warm or chill it' })));
  chargeSlot.addEventListener('click', () => { view.agePick = view.agePick === 'charge' ? null : 'charge'; audio.play('click'); rerender(); });
  const r = rep && rep.rune;
  const runeSlot = h('button', { class: 'age-slot rune' + (r ? ' full' : '') + (view.agePick === 'rune' ? ' open' : ''), 'data-slot': 'rune', 'data-act': 'age-slot-rune',
    title: 'The rune slot: a temperature rune holds the bottle where you choose, on the way to its potion’s limit' },
  r ? icon('rune') : h('span', { class: 'age-plus', text: '+' }),
  h('span', { class: 'age-slot-txt' },
    h('b', { text: r ? `Rune ${r.target}°C` : 'Rune' }),
    h('span', { class: 'small', text: r ? `${r.locked ? 'locked' : r.holds ? 'will lock' : 'cannot lock'} · ${Math.round((1 - r.wear) * 100)}% left` : 'hold a temperature' })));
  runeSlot.addEventListener('click', () => { view.agePick = view.agePick === 'rune' ? null : 'rune'; audio.play('click'); rerender(); });
  const w = rep && rep.ward;
  const wardSlot = h('button', { class: 'age-slot ward' + (w ? ' full' : '') + (view.agePick === 'ward' ? ' open' : ''), 'data-slot': 'ward', 'data-act': 'age-slot-ward',
    style: w ? { '--rune': rgb(w.color) } : {},
    title: 'The biome-rune slot: a rune dug out of a biome’s earth hastens the extraction of what carries its effect, even in the cold, without lowering how much can come out' },
  w ? icon(w.icon) : h('span', { class: 'age-plus', text: '+' }),
  h('span', { class: 'age-slot-txt' },
    h('b', { text: w ? w.name : 'Biome rune' }),
    h('span', { class: 'small', text: w ? `×${WARD_BOOST} · ${Math.round((1 - w.wear) * 100)}% left` : 'hasten extraction' })));
  wardSlot.addEventListener('click', () => { view.agePick = view.agePick === 'ward' ? null : 'ward'; audio.play('click'); rerender(); });
  box.append(h('div', { class: 'age-slots' }, chargeSlot, runeSlot, wardSlot));
  // ---- choosing what goes in a slot
  if (view.agePick === 'charge') {
    const list = chargers(st, b);
    const ml = /** @type {HTMLInputElement} */ (h('input', { type: 'number', value: String(view.ageMl || 50), min: '5', max: '1000', step: '5', style: { width: '4.5em' }, 'aria-label': 'Potion to load (ml)', 'data-act': 'age-ml' }));
    ml.addEventListener('input', () => { view.ageMl = Math.max(5, Number(ml.value) || 5); });
    const pick = h('div', { class: 'age-pick' }, h('div', { class: 'row small' }, h('span', { text: 'Load' }), ml, h('span', { text: 'ml of:' })));
    if (!list.length) pick.append(h('div', { class: 'small muted', text: 'No Fire or Frost potion on the shelves. Brew one, bottle it onto the shelves, then load it here.' }));
    const row = h('div', { class: 'age-pick-list' });
    for (const x of list) {
      const net = potionNet(x.m.effects);
      const o = h('button', { class: 'age-pick-bottle ' + (net > 0 ? 'fire' : 'frost'), 'data-act': 'age-load-' + x.id, title: `${potName(net)} ${Math.abs(net)}% · ${Math.round(x.ml)} ml · can take a bottle to ${chargeLimit(net)}°C` },
        bottleArt(x), icon(net > 0 ? 'flame' : 'snow', 'sm'), h('span', { class: 'small', text: `${Math.abs(net)}% · ${Math.round(x.ml)} ml` }));
      o.addEventListener('click', () => { if (loadCharge(lab, b.id, x.id, view.ageMl || 50).ok) view.agePick = null; rerender(); });
      row.append(o);
    }
    pick.append(row);
    box.append(pick);
  } else if (view.agePick === 'rune') {
    const has = !!(v && v.rune && v.rune.life > 0);
    const target = view.ageTarget ?? (v && v.rune ? v.rune.target : c ? Math.round((c.limit + CELLAR_T) / 2) : 40);
    const input = /** @type {HTMLInputElement} */ (h('input', { type: 'number', value: String(target), min: '-60', max: '300', step: '1', style: { width: '4.5em' }, 'aria-label': 'Rune temperature (°C)', 'data-act': 'age-target' }));
    input.addEventListener('input', () => { view.ageTarget = Number(input.value); });
    box.append(h('div', { class: 'age-pick' }, h('div', { class: 'row small' }, h('span', { text: 'Hold at' }), input, h('span', { text: '°C' }),
      btn(has ? 'Move the rune' : 'Set a rune', () => {
        const res = st.runeBottle(b.id, Number(input.value));
        if (!res.ok) { toast('Cannot', res.reason, 'lock'); audio.play('error'); } else { audio.play('select'); view.agePick = null; lab.save(); }
        rerender();
      }, { icon: 'rune', cls: 'small', act: 'age-rune', disabled: !has && st.cellar.runes <= 0 })),
    h('div', { class: 'small muted', text: has ? 'Moving the rune uses no new one.' : st.cellar.runes > 0 ? 'A rune wears out with the hours it holds the bottle.' : 'No rune in hand: buy one at the market, or find one underground in the Wilds.' })));
  }
  else if (view.agePick === 'ward') {
    const pick = h('div', { class: 'age-pick' },
      h('div', { class: 'small', text: `A biome rune draws out ×${WARD_BOOST} quicker every ingredient that carries its effect — as quickly in the cold as at room temperature — and never lowers how much can come out. It wears out with the hours it works.` }));
    const row = h('div', { class: 'age-pick-list ward-list' });
    for (const r of BIOME_RUNES) {
      const n = st.wardsOf(r.effect);
      const o = h('button', { class: 'age-pick-ward', 'data-act': 'age-ward-' + r.effect, disabled: !(n > 0), style: { '--rune': rgb(r.color) }, title: n > 0 ? `${r.name}: hastens what carries ${r.effect}` : `No ${r.name} in hand: it lies underground in the ${r.biomeName}` },
        icon(r.icon, 'sm'), h('span', { class: 'small', text: `${r.name} · ${Number.isFinite(n) ? n : '∞'}` }));
      o.addEventListener('click', () => {
        const res = st.wardBottle(b.id, r.effect);
        if (!res.ok) { toast('Cannot', res.reason, 'lock'); audio.play('error'); } else { audio.play('select'); view.agePick = null; toast(`${r.name} set`, `What carries ${r.effect} is drawn out ×${WARD_BOOST} quicker, even in the cold.`, r.icon, 3200); lab.save(); }
        rerender();
      });
      row.append(o);
    }
    pick.append(row);
    if (!BIOME_RUNES.some((r) => st.wardsOf(r.effect) > 0)) pick.append(h('div', { class: 'small muted', text: 'No biome rune in hand. Each biome keeps one underground every day: look for its glow in the earth of the Wilds and tap it a few times.' }));
    box.append(pick);
  }
  // ---- how it goes
  if (rep) {
    const where = c ? `${rep.T.toFixed(1)}°C, heading for ${r && r.holds ? r.target : c.limit}°C` : Math.abs(rep.T - CELLAR_T) > 0.5 ? `${rep.T.toFixed(1)}°C, returning to the cellar's ${CELLAR_T}°C` : `${rep.T.toFixed(1)}°C (the cellar's own)`;
    box.append(h('div', { class: 'small know', 'data-temp': String(Math.round(rep.T * 10) / 10), text: `Aging: ${where}` }));
    if (rep.frozen || rep.char > 0.5 || rep.alcohol > 0.5) box.append(h('div', { class: 'small ' + (rep.frozen ? 'warn' : 'muted'), text: [rep.frozen ? 'frozen: extraction stopped' : '', rep.char > 0.5 ? `${Math.round(rep.char)} ml burnt to char` : '', rep.alcohol > 0.5 ? `${rep.alcohol.toFixed(0)}% spirit` : ''].filter(Boolean).join(' · ') }));
    for (const it of rep.items) {
      const k2 = st.knowledge[it.id] || {};
      box.append(h('div', { class: 'row small extract-row' }, h('span', { text: it.name }), h('span', { class: 'spacer' }),
        h('span', { class: 'xbar' }, h('i', { class: 'xbar-fill', style: { width: (it.share * 100).toFixed(1) + '%' } }), h('i', { class: 'xbar-cap', style: { left: Math.round(it.ceiling * 100) + '%' } })),
        h('span', { class: 'muted', text: ` ${(it.share * 100).toFixed(1)}% / ${Math.round(it.ceiling * 100)}%${it.fast ? ` · ×${WARD_BOOST}` : ''}${k2.burnsAt !== undefined ? ` · burns by ${Math.round(k2.burnsAt)}°C` : ''}` })));
    }
    box.append(h('div', { class: 'row wrap' },
      btn('Unseal', () => {
        const res = st.finishAging(b.id);
        if (res.ok && res.vial) { view.sel = res.vial.id; toast('Unsealed', `${Math.round(res.vial.ml)} ml of what it has become — a new batch: test it before you sell it.`, 'bottle', 3600); audio.play('glass'); }
        view.agePick = null; lab.save(); rerender();
      }, { icon: 'bottle', cls: 'gold', act: 'age-unseal', title: 'Stop aging: it becomes a fresh, untested bottle of what it has turned into' })));
  } else {
    const full = st.agingCount >= st.agingSlots;
    box.append(h('div', { class: 'small muted', text: full ? `Every aging place is taken (${st.agingSlots}): unseal a bottle first.` : 'Load a Fire or Frost potion (and a rune) to age it warm or cold — or age it as it is, at the cellar’s own temperature.' }),
      h('div', { class: 'row wrap' }, btn(`Age at ${CELLAR_T}°C`, () => {
        const res = st.startAging(b.id);
        if (!res.ok) { toast('Cannot', res.reason, 'lock'); audio.play('error'); } else { audio.play('select'); lab.save(); }
        rerender();
      }, { icon: 'shelf2', act: 'age-start', disabled: full })));
  }
  return box;
}
