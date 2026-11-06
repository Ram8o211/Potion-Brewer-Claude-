// The cellar: one set of shelves where every potion is kept. Sealed bottles
// stand on them; a bottle set aging stands there too, in a heating jacket
// (one of the Aging Cellar's vessels), and goes on extracting for hours —
// even while the game is closed. Tapping a place on the shelves opens its
// menu: a sealed bottle can go to the counter, back into the pot, away, or
// be set aging (and a Fire or Frost bottle can charge a jacket); an aging
// bottle shows its temperature and extraction and takes a Fire or Frost
// charge, a temperature rune, or is sealed again; an empty place can take
// the cauldron's whole brew to age.
//
// The same shelves are shown on the Counter and in the Cellar panel opened
// from the Brew room.

import { h, btn, modal, toast, clear, confirmDialog, starsText } from './dom.js';
import { icon } from './icons.js';
import { drawBottle } from '../rendering/renderer.js';
import { audio } from '../audio/audio.js';
import { describeColor, rgbToHex } from '../core/color.js';
import { EFFECT_BY_KEY } from '../alchemy/effects.js';
import { labelStars, MAX_STARS } from '../game/commerce.js';
import { vesselReport, vesselVolume, potionNet, CELLAR_T } from '../game/cellar.js';
import * as trade from './trade.js';

const PER_ROW = 6;
const potName = (net) => (net > 0 ? 'Fire' : 'Frost');

/**
 * What the trials of a bottle found: the effects seen, and how many were
 * tested but not detected (not proof of absence — the label says how sure).
 * @param {Record<string, number>|undefined} cert
 */
export function verifiedLine(cert) {
  const all = Object.entries(cert || {});
  if (!all.length) return h('div', { class: 'small' }, 'Tested: ', h('span', { class: 'muted', text: 'nothing — effects unknown' }));
  const seen = all.filter(([, x]) => Math.abs(x) >= 0.5), unseen = all.length - seen.length;
  return h('div', { class: 'small' }, 'Tested: ', ...seen.map(([k, x]) => h('span', { class: 'fx-chip' }, icon(EFFECT_BY_KEY[k].icon, 'sm'), ` ${Math.round(x)}`)),
    unseen ? h('span', { class: 'muted', text: ` ${seen.length ? '· ' : ''}${unseen} not detected` }) : null);
}

/** The colour an aging brew shows through its glass: its ingredients' colours, by volume and tint. @param {any} v @param {(id:string)=>any} lookup */
function brewColour(v, lookup) {
  let w = 0;
  const c = [0, 0, 0];
  for (const [id, ml] of Object.entries(v.comp || {})) {
    const d = lookup(id);
    if (!d || !Array.isArray(d.color) || !(ml > 0)) continue;
    const k = ml * (0.15 + (Number(d.tint) || 0.5));
    for (let i = 0; i < 3; i++) c[i] += d.color[i] * k;
    w += k;
  }
  return w > 0 ? c.map((x) => x / w) : [0.5, 0.45, 0.4];
}

/** The jackets (aging vessels) with no bottle in them. @param {any} st */
function freeJackets(st) {
  return st.cellar.vessels.filter((v) => vesselVolume(v) <= 0).map((v) => v.id);
}

/** A jacket's charge and rune in a few words. @param {any} st @param {number} k */
function jacketWords(st, k) {
  const rep = vesselReport(st.cellar.vessels[k], st.lookup);
  const bits = [];
  if (rep.charge) bits.push(`${potName(rep.charge.net)} ${rep.charge.ml.toFixed(0)} ml → ${rep.charge.limit}°C`);
  if (rep.rune) bits.push(`rune ${rep.rune.target}°C`);
  return bits.length ? bits.join(', ') : 'no charge';
}

/**
 * The cellar's shelves: aging bottles, sealed bottles and the free places,
 * six to a plank. Tapping one opens its menu.
 * @param {any} lab @param {{onChange:() => void, title?:boolean}} o
 */
export function cellarShelves(lab, o) {
  const st = lab.state;
  lab.freshBottles();
  lab.tickCellar();
  const cap = st.cap.bottles;
  const aging = st.cellar.vessels.filter((v) => vesselVolume(v) > 0);
  const used = aging.length + st.bottles.length;
  const grid = h('div', { class: 'bottle-shelf', role: 'listbox', 'aria-label': 'Cellar shelves' });
  const rows = Math.max(1, Math.ceil(Math.max(cap, used) / PER_ROW));
  let i = 0;
  // the aging bottles, each in its jacket
  for (const v of aging) {
    const rep = vesselReport(v, st.lookup);
    const cv = /** @type {HTMLCanvasElement} */ (h('canvas', { width: '16', height: '22', class: 'vial-art' }));
    drawBottle(/** @type {CanvasRenderingContext2D} */ (cv.getContext('2d')), 2, 2, 12, 19, brewColour(v, st.lookup), 0.9);
    const heat = rep.T > CELLAR_T + 1.5 ? 'warm' : rep.T < CELLAR_T - 1.5 ? 'cold' : 'still';
    const slot = h('button', { class: `bottle-slot aging ${heat}`, role: 'option', 'data-act': 'aging-slot', 'data-vessel': String(v.id),
      'aria-label': `${v.name || 'A laid-down brew'}, aging: ${Math.round(rep.ml)} ml at ${rep.T.toFixed(1)}°C`, title: `${v.name || 'A laid-down brew'} — aging at ${rep.T.toFixed(1)}°C. Tap for the aging options.` },
    cv, h('span', { class: 'btemp', 'data-temp': String(Math.round(rep.T * 10) / 10), text: `${Math.round(rep.T)}°` }),
    rep.rune ? h('span', { class: 'brune' + (rep.rune.locked ? ' locked' : '') }, icon('rune', 'sm')) : null,
    rep.charge ? h('span', { class: 'bcharge' }, icon(rep.charge.net > 0 ? 'flame' : 'snow', 'sm')) : null);
    slot.addEventListener('click', () => openAgingMenu(lab, v.id, o.onChange));
    grid.appendChild(slot);
    i++;
  }
  // the sealed bottles
  for (const b of st.bottles) {
    const cv = /** @type {HTMLCanvasElement} */ (h('canvas', { width: '16', height: '22', class: 'vial-art' }));
    drawBottle(/** @type {CanvasRenderingContext2D} */ (cv.getContext('2d')), 2, 2, 12, 19, b.m ? b.m.color : [0.5, 0.5, 0.5], Math.min(1, b.ml / Math.max(1, b.bottledMl || b.ml)));
    // a labelled bottle tells what it does without opening it
    const fxText = b.label ? trade.labelLine(b.label) : '';
    const acc = b.label ? labelStars(b.label) : null;
    const net = b.m ? potionNet(b.m.effects) : 0;
    const slot = h('button', { class: 'bottle-slot' + (b.label ? ' labelled' : '') + (net ? ' charger' : ''), role: 'option', 'aria-label': `${b.label && b.label.name ? b.label.name : 'Bottle'}, ${Math.round(b.ml)} ml${fxText ? `: ${fxText}` : ''}`, ...(fxText ? { title: fxText } : {}), 'data-act': 'bottle-slot', 'data-id': b.id },
      cv, h('span', { class: 'bml', text: `${Math.round(b.ml)}` }), b.label ? h('span', { class: 'btag' }, icon('tag', 'sm')) : null,
      acc === null ? null : h('span', { class: 'bstars', 'data-stars': String(acc), text: starsText(acc, MAX_STARS) }));
    slot.addEventListener('click', () => openBottleMenu(lab, b.id, o.onChange));
    grid.appendChild(slot);
    i++;
  }
  // the free places (an empty one takes the cauldron's brew to age), then the planks not yet bought
  for (; i < rows * PER_ROW; i++) {
    if (i >= cap) { grid.appendChild(h('div', { class: 'bottle-slot locked', 'aria-hidden': 'true' })); continue; }
    const slot = h('button', { class: 'bottle-slot empty', 'data-act': 'empty-slot', 'aria-label': 'An empty place on the shelves', title: 'An empty place: tap to lay the cauldron’s brew down here to age' });
    slot.addEventListener('click', () => openEmptyMenu(lab, o.onChange));
    grid.appendChild(slot);
  }
  const jackets = st.cap.vessels;
  const runes = Number.isFinite(st.cellar.runes) ? st.cellar.runes : '∞';
  return h('div', { class: 'card parch shelf-card cellar-card' },
    h('div', { class: 'row' }, icon('shelf2'), h('b', { text: `Cellar · ${used}/${cap}` }), h('span', { class: 'spacer' }),
      jackets ? h('span', { class: 'small muted', 'data-jackets': String(aging.length), text: `aging ${aging.length}/${jackets}` }) : null,
      jackets ? h('span', { class: 'small muted' }, icon('rune', 'sm'), ` ${runes}`) : null),
    used ? null : h('div', { class: 'small muted', text: 'Empty. When you bottle a brew, choose “To the cellar shelves” to keep it for a later customer. Tap a bottle here for what it can do — sell, pour back, or age it. More shelving is sold in the Shop.' }),
    grid,
    used ? h('div', { class: 'small muted', text: jackets ? 'Tap a bottle: take it to the counter, pour it back, or set it aging.' : 'Tap a bottle to take it to the counter or pour it back. The guild’s Aging Cellar lets bottles go on extracting here.' }) : null);
}

/** Refresh the views showing the shelves and the badges. @param {any} lab */
function touched(lab) {
  lab.save();
  if (lab.views && lab.views.counter) lab.views.counter.refresh();
  if (lab.updateBadges) lab.updateBadges();
}

/**
 * A sealed bottle's menu: what it is, and what can be done with it — to the
 * counter, back into the pot, away; set aging in a free jacket; or, a Fire
 * or Frost potion, poured into a jacket's charge.
 * @param {any} lab @param {string} id @param {() => void} onChange
 */
export function openBottleMenu(lab, id, onChange) {
  const st = lab.state;
  /** @type {any} */
  let m = null;
  let ml = 50;
  const done = (closeIt) => { touched(lab); onChange(); if (closeIt) m.close(); else rerender(); };
  const rerender = () => { if (!m) return; const b = st.bottles.find((x) => x.id === id); if (!b) { m.close(); return; } clear(m.body); m.body.append(...render(b)); };
  const render = (b) => {
    const mm = b.m || {};
    const out = [h('div', { class: 'card parch bottle-detail' },
      h('div', { class: 'small' }, h('span', { class: 'swatch', style: { background: rgbToHex(mm.color || [0.5, 0.5, 0.5]) } }), ` ${describeColor(mm.color || [0.5, 0.5, 0.5])} · ${Math.round(b.ml)} ml · ${Math.round(mm.temperature ?? 20)}°C · bottled on day ${b.day || st.day}`),
      verifiedLine(b.cert),
      b.label ? h('div', { class: 'small label-line' }, icon('tag', 'sm'), ` ${trade.labelLine(b.label)}`) : null,
      h('div', { class: 'row wrap' },
        btn(st.vial ? 'Swap with the vial' : 'To the counter', () => { lab.takeBottle(b.id); onChange(); m.close(); }, { icon: 'deal', cls: 'primary', act: 'take-bottle', title: 'Put this bottle on the counter to sell or test it' }),
        btn('Pour back', () => { m.close(); lab.pourBackBottle(b.id); onChange(); }, { icon: 'pour', act: 'pour-back-bottle', title: 'Pour it into the cauldron to keep working on it' }),
        btn('Discard', async () => { if (await confirmDialog('Discard the bottle?', 'The potion is poured away. Ingredients are not refunded.', 'Discard', 'danger')) { lab.discardBottle(b.id); onChange(); m.close(); } }, { icon: 'trash', cls: 'danger', act: 'discard-bottle' })))];
    // ---- aging
    const age = h('div', { class: 'card parch' }, h('div', { class: 'row' }, icon('shelf2', 'sm'), h('b', { text: ' Age it' })));
    if (st.cap.vessels <= 0) age.append(h('div', { class: 'small muted', text: 'A bottle set aging goes on extracting for hours, warmed or chilled as you choose. The guild’s Aging Cellar (from Journeyman) puts heating jackets on these shelves.' }));
    else {
      age.append(h('div', { class: 'small muted', text: 'Unsealed in a heating jacket, it goes on extracting for hours, even while the shop is closed. Seal it again when it is ready: it is a new batch then, to be tested.' }));
      const free = freeJackets(st);
      if (!free.length) age.append(h('div', { class: 'small warn', text: `Every jacket is in use (${st.cap.vessels}). Seal or pour back an aging bottle first.` }));
      const row = h('div', { class: 'row wrap' });
      for (const k of free) row.append(btn(free.length > 1 || st.cellar.vessels[k].charge || st.cellar.vessels[k].rune ? `Jacket ${k + 1} · ${jacketWords(st, k)}` : 'Set it aging', () => {
        const r = st.layDown(k, { bottleId: b.id });
        if (!r.ok) { toast('Cannot', r.reason, 'lock'); audio.play('error'); return; }
        audio.play('glass');
        toast('Aging', `${b.label && b.label.name ? b.label.name : 'The bottle'} is unsealed in jacket ${k + 1}. Tap it on the shelves to warm, chill or lock it.`, 'shelf2', 3600);
        done(true);
        openAgingMenu(lab, k, onChange);
      }, { icon: 'shelf2', cls: 'small gold', act: `age-bottle-${k}` }));
      age.append(row);
    }
    out.push(age);
    // ---- a Fire or Frost potion heats or chills a jacket
    const net = b.m ? potionNet(b.m.effects) : 0;
    if (net && st.cap.vessels > 0) {
      const mlIn = /** @type {HTMLInputElement} */ (h('input', { type: 'number', value: String(ml), min: '5', max: '1000', step: '5', style: { width: '4.5em' }, 'aria-label': 'Potion to load (ml)', 'data-act': 'charge-ml' }));
      mlIn.addEventListener('input', () => { ml = Math.max(5, Number(mlIn.value) || 5); });
      const card = h('div', { class: 'card parch' },
        h('div', { class: 'row' }, icon(net > 0 ? 'flame' : 'snow', 'sm'), h('b', { text: ` ${potName(net)} ${Math.abs(net)}%: charge a jacket` })),
        h('div', { class: 'small muted', text: `Poured into a jacket it ${net > 0 ? 'warms' : 'chills'} the bottle aging there, and is used up as it works.` }),
        h('div', { class: 'row wrap', style: { alignItems: 'center', gap: '6px' } }, h('span', { class: 'small', text: 'Load' }), mlIn, h('span', { class: 'small', text: 'ml into' })));
      const row = h('div', { class: 'row wrap' });
      st.cellar.vessels.forEach((v, k) => {
        const what = vesselVolume(v) > 0 ? (v.name || 'a laid-down brew') : 'empty';
        row.append(btn(`Jacket ${k + 1} · ${what}`, () => {
          const r = st.activateVessel(k, b.id, ml);
          if (!r.ok) { toast('Cannot', r.reason, 'lock'); audio.play('error'); return; }
          audio.play('glass');
          toast(`Jacket ${k + 1} charged`, `${Math.round(r.ml)} ml of the ${potName(net)} potion loaded: it can take the bottle there to ${r.limit}°C.`, net > 0 ? 'flame' : 'snow', 3200);
          done(!st.bottles.some((x) => x.id === b.id));
        }, { icon: net > 0 ? 'flame' : 'snow', cls: 'small', act: `charge-jacket-${k}` }));
      });
      card.append(row);
      out.push(card);
    }
    return out;
  };
  const b = st.bottles.find((x) => x.id === id);
  if (!b) return;
  m = modal({ title: b.label && b.label.name ? b.label.name : `Bottle · ${Math.round(b.ml)} ml`, body: render(b), cls: 'cellar-menu' });
}

/**
 * An aging bottle's menu, live: its temperature, charge, rune and
 * extraction; load a Fire or Frost potion (from the pot or a bottle on the
 * shelves), lock it with a rune, seal it again or pour it into the pot.
 * @param {any} lab @param {number} k the jacket (vessel) @param {() => void} onChange
 */
export function openAgingMenu(lab, k, onChange) {
  const st = lab.state;
  /** @type {any} */
  let m = null;
  const v0 = st.cellar.vessels[k];
  if (!v0) return;
  const rep0 = vesselReport(v0, st.lookup);
  const val = { ml: 50, target: v0.rune ? v0.rune.target : rep0.charge ? Math.round((rep0.charge.limit + CELLAR_T) / 2) : 40 };
  const after = (closeIt) => { touched(lab); onChange(); if (closeIt) m.close(); else rerender(); };
  const rerender = () => {
    if (!m) return;
    if (vesselVolume(st.cellar.vessels[k]) <= 0) { m.close(); return; }
    const keep = m.body.scrollTop;
    clear(m.body); m.body.append(...render());
    m.body.scrollTop = keep;
  };
  const render = () => {
    lab.tickCellar();
    const v = st.cellar.vessels[k];
    const rep = vesselReport(v, st.lookup);
    const card = h('div', { class: 'card parch cellar-vessel', 'data-vessel': String(k) },
      h('div', { class: 'row' }, icon('shelf2'), h('b', { text: v.name || 'A laid-down brew' }), h('span', { class: 'spacer' }), h('span', { class: 'small muted', 'data-temp': String(Math.round(rep.T * 10) / 10), text: `${Math.round(rep.ml)} ml · ${rep.T.toFixed(1)}°C` })));
    const c = rep.charge;
    const heat = c
      ? `${potName(c.net)} charge: ${c.ml.toFixed(1)} ml left (${potName(c.net)} ${Math.abs(c.net)}%) — can take it to ${c.limit}°C`
      : Math.abs(rep.T - CELLAR_T) > 0.5 ? `no charge: returning to cellar temperature (${CELLAR_T}°C)` : `no charge: at cellar temperature (${CELLAR_T}°C)`;
    card.append(h('div', { class: 'small ' + (c ? 'know' : 'muted'), 'data-charge': c ? String(c.ml) : '0', text: heat }));
    if (rep.rune) {
      const r = rep.rune, left = `${Math.round((1 - r.wear) * 100)}% left`;
      const state = r.locked ? `locked at ${r.target}°C` : r.holds ? `will lock at ${r.target}°C` : c ? `set at ${r.target}°C, beyond this charge's reach (${c.limit}°C): it cannot lock` : `set at ${r.target}°C: it holds only while the jacket is charged`;
      card.append(h('div', { class: 'small ' + (r.holds ? 'know' : 'warn'), text: `Rune ${state} (${left})` }));
    }
    if (rep.frozen || rep.char > 0.5 || rep.alcohol > 0.5) card.append(h('div', { class: 'small ' + (rep.frozen ? 'warn' : 'muted'), text: [rep.frozen ? 'frozen: extraction stopped' : '', rep.char > 0.5 ? `${Math.round(rep.char)} ml burnt to char` : '', rep.alcohol > 0.5 ? `${rep.alcohol.toFixed(0)}% spirit` : ''].filter(Boolean).join(' · ') }));
    for (const it of rep.items) {
      const k2 = st.knowledge[it.id] || {};
      card.append(h('div', { class: 'row small extract-row' }, h('span', { text: it.name }), h('span', { class: 'spacer' }),
        h('span', { class: 'xbar' }, h('i', { class: 'xbar-fill', style: { width: (it.share * 100).toFixed(1) + '%' } }), h('i', { class: 'xbar-cap', style: { left: Math.round(it.ceiling * 100) + '%' } })),
        h('span', { class: 'muted', text: ` ${(it.share * 100).toFixed(1)}% / ${Math.round(it.ceiling * 100)}%${k2.burnsAt !== undefined ? ` · burns by ${Math.round(k2.burnsAt)}°C` : ''}` })));
    }
    // ---- warm or chill it: a Fire or Frost potion from the pot or the shelves
    const mlIn = /** @type {HTMLInputElement} */ (h('input', { type: 'number', value: String(val.ml), min: '5', max: '1000', step: '5', style: { width: '4.5em' }, 'aria-label': 'Potion to load (ml)', 'data-act': `cellar-ml-${k}` }));
    mlIn.addEventListener('input', () => { val.ml = Math.max(5, Number(mlIn.value) || 5); });
    const heatCard = h('div', { class: 'card parch' },
      h('div', { class: 'row' }, icon('flame', 'sm'), h('b', { text: ' Warm or chill it' })),
      h('div', { class: 'small muted', text: 'Load a Fire or Frost potion you brewed into the jacket: the stronger its Fire (or Frost), the hotter (or colder) the bottle goes, and the potion is used up as it works.' }),
      h('div', { class: 'row wrap', style: { alignItems: 'center', gap: '6px' } }, h('span', { class: 'small', text: 'Load' }), mlIn, h('span', { class: 'small', text: 'ml' }),
        btn('From the pot', () => { const r = lab.chargeFromCauldron(k, val.ml); if (r && r.ok) { audio.play('pour'); after(false); } }, { icon: 'cauldron', cls: 'small', act: `cellar-charge-pot-${k}`, disabled: lab.tapAvailable() < 5, title: 'Draw this much potion from the cauldron’s tap into the jacket' })));
    const chargers = st.bottles.filter((b) => b.m && potionNet(b.m.effects));
    if (chargers.length) {
      const row = h('div', { class: 'row wrap' });
      for (const b of chargers) {
        const net = potionNet(b.m.effects);
        row.append(btn(`${potName(net)} ${Math.abs(net)}% · ${Math.round(b.ml)} ml`, () => {
          const r = st.activateVessel(k, b.id, val.ml);
          if (!r.ok) { toast('Cannot', r.reason, 'lock'); audio.play('error'); return; }
          audio.play('glass');
          toast('Charged', `${Math.round(r.ml)} ml of the ${potName(net)} potion loaded: it can take the bottle to ${r.limit}°C.`, net > 0 ? 'flame' : 'snow', 3200);
          after(false);
        }, { icon: net > 0 ? 'flame' : 'snow', cls: 'small', act: `cellar-charge-bottle-${k}`, title: `From the shelved bottle${b.label && b.label.name ? ` “${b.label.name}”` : ''}` }));
      }
      heatCard.append(h('div', { class: 'small', text: 'or from a bottle on the shelves:' }), row);
    } else heatCard.append(h('div', { class: 'small muted', text: 'No Fire or Frost potion on the shelves: bottle one onto them to load it from there.' }));
    // ---- the rune
    const input = /** @type {HTMLInputElement} */ (h('input', { type: 'number', value: String(val.target), min: '-60', max: '300', step: '1', style: { width: '4.5em' }, 'aria-label': 'Rune temperature (°C)', 'data-act': `cellar-target-${k}` }));
    input.addEventListener('input', () => { val.target = Number(input.value); });
    const has = !!(v.rune && v.rune.life > 0);
    const runes = Number.isFinite(st.cellar.runes) ? st.cellar.runes : 'unlimited';
    const runeCard = h('div', { class: 'card parch' },
      h('div', { class: 'row' }, icon('rune', 'sm'), h('b', { text: ' Lock the temperature' }), h('span', { class: 'spacer' }), h('span', { class: 'small muted', text: `${runes} in hand` })),
      h('div', { class: 'small muted', text: 'A temperature rune holds the bottle where you choose on the way to its charge’s limit, and wears out with use. Runes are sold at the market and lie in the rock underground in the Wilds.' }),
      h('div', { class: 'row wrap', style: { alignItems: 'center', gap: '6px' } }, h('span', { class: 'small', text: 'Lock at' }), input, h('span', { class: 'small', text: '°C' }),
        btn(has ? 'Move the rune' : 'Set a rune', () => { const r = st.runeVessel(k, Number(val.target)); if (!r.ok) { toast('Cannot', r.reason, 'lock'); return; } audio.play('select'); after(false); }, { icon: 'rune', cls: 'small', act: `cellar-rune-${k}`, disabled: !has && st.cellar.runes <= 0 })));
    // ---- done with it
    const finish = h('div', { class: 'row wrap' },
      btn('Seal it', () => { const r = st.bottleVessel(k); if (!r.ok) { toast('Cannot', r.reason, 'lock'); return; } toast('Sealed', `${Math.round(r.vial.ml)} ml sealed on the cellar shelves. Test it before you sell it.`, 'bottle'); audio.play('glass'); after(true); }, { icon: 'bottle', cls: 'small primary', act: `cellar-bottle-out-${k}`, title: 'Stop aging: seal it again as a bottle (a new batch, to be tested)' }),
      btn('Pour into the pot', () => { const r = lab.pourVesselBack(k); if (r && r.ok) after(true); }, { icon: 'pour', cls: 'small', act: `cellar-pour-back-${k}`, title: 'Pour this brew back into the cauldron to keep working on it' }));
    const pace = lab.sandbox ? [h('div', { class: 'small muted', text: `In the Free Experiment the cellar runs ${st.cellar.pace || 1} times faster.` })] : [];
    return [...pace, card, heatCard, runeCard, finish];
  };
  // it goes on while it is watched: refreshed every second (not while a number is typed)
  const timer = setInterval(() => {
    if (!m || !document.body.contains(m.el)) { clearInterval(timer); return; }
    const a = document.activeElement;
    if (a && a.tagName === 'INPUT' && m.el.contains(a)) return;
    rerender();
  }, 1000);
  m = modal({ title: `Aging · jacket ${k + 1}`, body: render(), cls: 'cellar-menu', onClose: () => { clearInterval(timer); onChange(); } });
}

/**
 * An empty place on the shelves: lay the cauldron's brew down there to age
 * (in a free jacket), or what it takes to.
 * @param {any} lab @param {() => void} onChange
 */
export function openEmptyMenu(lab, onChange) {
  const st = lab.state;
  /** @type {any} */
  let m = null;
  const body = [h('div', { class: 'small muted', text: 'An empty place on the cellar shelves. Bottle a brew (Bottle → To the cellar shelves) to keep it here — or lay the cauldron’s whole brew down here to age.' })];
  if (st.cap.vessels <= 0) body.push(h('div', { class: 'small', text: 'Aging needs the guild’s Aging Cellar: heating jackets in which a brew goes on extracting for hours, even while the shop is closed.' }));
  else {
    const free = freeJackets(st);
    if (!lab.sim.p.count) body.push(h('div', { class: 'small', text: 'The cauldron is empty: brew something first.' }));
    if (!free.length) body.push(h('div', { class: 'small warn', text: `Every jacket is in use (${st.cap.vessels}).` }));
    const row = h('div', { class: 'row wrap' });
    for (const k of free) row.append(btn(free.length > 1 || st.cellar.vessels[k].charge || st.cellar.vessels[k].rune ? `Lay down the brew · jacket ${k + 1} (${jacketWords(st, k)})` : 'Lay down the brew', () => {
      lab.layDownCauldron(k);
      touched(lab); onChange(); m.close();
      if (vesselVolume(st.cellar.vessels[k]) > 0) openAgingMenu(lab, k, onChange);
    }, { icon: 'cauldron', cls: 'gold', act: `cellar-fill-${k}`, disabled: !lab.sim.p.count, title: 'Pour everything in the cauldron into this place to age' }));
    body.push(row);
  }
  m = modal({ title: 'Cellar shelves', body: h('div', { class: 'card parch' }, body), cls: 'cellar-menu' });
}

/**
 * The cellar as a panel (from the Brew room): its shelves, kept live.
 * @param {any} lab
 */
export function openCellar(lab) {
  /** @type {any} */
  let m = null;
  const rerender = () => { if (!m) return; clear(m.body); m.body.append(render()); };
  const render = () => cellarShelves(lab, { onChange: rerender });
  const timer = setInterval(() => {
    if (!m || !document.body.contains(m.el)) { clearInterval(timer); return; }
    // (not under an open menu: the menu refreshes itself)
    if (document.querySelector('.cellar-menu')) return;
    rerender();
  }, 1000);
  m = modal({ title: 'Cellar', wide: true, body: render(), onClose: () => clearInterval(timer) });
}
