// Aging cellars: sealed vessels in which a brew goes on extracting for
// hours, even while the game is closed.
//
// A vessel holds a brew as bulk matter (millilitres per material id) at one
// temperature — no particles: it is never drawn, only advanced. Its
// extraction is the cauldron's own model (alchemy/extraction.js), at the
// slow pace of an unstirred vessel (CELLAR_FACTOR): every catalog ingredient
// moves toward the ceiling of the vessel's temperature, within its
// solvent's capacity, never back; a frozen solvent extracts nothing; above
// an ingredient's combustion threshold its unextracted matter chars; an
// emulsified vessel extracts badly. Its magic awakens like a brew's when the
// vessel passes the blend's arcane threshold.
//
// Temperature: a vessel sits at cellar temperature until it is *charged*
// with a Fire or Frost potion the player brewed (from the cauldron's tap, or
// a shelved bottle, in the amount chosen). Only the potion's net Fire (or
// Frost) counts — its other effects do not matter — and its strength sets
// how far the vessel can go: CELLAR_T + DEG_PER_POINT °C per percent of net
// Fire (below it for Frost). The vessel moves toward that limit by itself
// (CHARGE_TAU), and the charge is used up as it works: the further from
// cellar temperature it holds the vessel, and the bigger the vessel, the
// faster; a stronger potion lasts longer. When the charge is spent the
// vessel drifts back to cellar temperature.
//
// A temperature rune locks the rise (or the fall) at a chosen temperature on
// the way to the limit: the vessel stops there and stays, as long as the
// charge lasts. A rune wears out with the time it is set on a filled vessel
// (RUNE_LIFE); its target can be moved without a new rune.
//
// Determinism: time advances in fixed steps of CELLAR_STEP seconds from the
// vessel's own clock, so the state after an hour is the same whether it was
// reached in one jump (the game was closed) or in a thousand ticks.
// Offline catch-up is capped at MAX_OFFLINE.

import { rateAt, yieldAt, extractIdOf, SOLVENT_CAPACITY, CELLAR_FACTOR, EMULSION_FACTOR, emulsionStability } from '../alchemy/extraction.js';
import { isMagical, awakenedId, thresholdToCelsius } from '../alchemy/arcane.js';
import { CHAR_ID } from '../materials/catalog.js';
import { EFFECT_INDEX } from '../alchemy/effects.js';

/** seconds of cellar time per step */
export const CELLAR_STEP = 10;
/** the cellar's own temperature (°C) */
export const CELLAR_T = 12;
/** at most this much time is caught up after a break (s) */
export const MAX_OFFLINE = 30 * 86400;
/** how far (°C from cellar temperature) a charge can take a vessel, per percent of net Fire (Frost: below) */
export const DEG_PER_POINT = 4;
/** the least net Fire or Frost (percent) that warms or chills a vessel at all */
export const MIN_POINTS = 3;
/** time constant (s) of the vessel's temperature: toward the charge's limit, or back to cellar temperature */
export const CHARGE_TAU = 1800;
/** charge used up: ml per hour = vessel ml × |T − CELLAR_T| / (HOLD_COST × |net| / 10) */
export const HOLD_COST = 320;
/** seconds of use in a fresh rune */
export const RUNE_LIFE = 8 * 3600;
/** coins for a rune at the market */
export const RUNE_PRICE = 28;
/** char rate (1/s) of unextracted matter just past its threshold */
const CHAR_RATE = 0.002;
/** coldest and hottest a vessel can be driven (°C) */
const T_MIN = -90, T_MAX = 450;

/**
 * @typedef {Object} Vessel
 * @property {number} id
 * @property {Record<string, number>} comp   ml per material id ({} = empty)
 * @property {number} T                      °C
 * @property {{ml:number, net:number}|null} charge  the loaded Fire/Frost potion: ml left and net Fire (percent; negative: Frost)
 * @property {{target:number, life:number}|null} rune
 * @property {number} t                      the vessel's clock (ms since epoch) it has been advanced to
 * @property {number} carry                  seconds not yet worth a step
 * @property {string} [name]                 what the brew was
 * @property {string} [batchId]
 * @property {boolean} [frozen]           frozen at the last step
 * @property {{id:string, ml:number}[]} [parts]
 * @property {{t:number, text:string}[]} log
 */

/** An empty cellar. */
export function createCellar() {
  return { vessels: /** @type {Vessel[]} */ ([]), runes: 0 };
}

/** @param {number} id @param {number} now */
function emptyVessel(id, now) {
  return /** @type {Vessel} */ ({ id, comp: {}, T: CELLAR_T, charge: null, rune: null, t: now, carry: 0, log: [] });
}

/**
 * Repair a saved cellar and give it as many vessels as the shop owns.
 * @param {any} data @param {number} count @param {number} [now]
 */
export function normalizeCellar(data, count, now = Date.now()) {
  const c = data && typeof data === 'object' ? data : createCellar();
  if (!Array.isArray(c.vessels)) c.vessels = [];
  c.runes = Math.max(0, Number(c.runes) | 0);
  // (vessels are repaired in place: the objects others hold stay the live ones)
  c.vessels = c.vessels.filter((v) => v && typeof v === 'object').map((v, k) => (Object.assign(v, {
    ...emptyVessel(k, now), ...v, id: k,
    comp: v.comp && typeof v.comp === 'object' ? Object.fromEntries(Object.entries(v.comp).filter(([, ml]) => Number(ml) > 1e-6).map(([id, ml]) => [id, Number(ml)])) : {},
    T: Number.isFinite(v.T) ? v.T : CELLAR_T,
    // (an old save's endless drive becomes a charge of 100 ml of that strength)
    charge: v.charge && v.charge.ml > 0 && Number.isFinite(v.charge.net) ? { ml: Number(v.charge.ml), net: Number(v.charge.net) }
      : Number.isFinite(v.drive) && Math.abs(v.drive) > 0 ? { ml: 100, net: v.drive / 2.5 } : null,
    rune: v.rune && Number.isFinite(v.rune.target) && v.rune.life > 0 ? { target: v.rune.target, life: Math.min(RUNE_LIFE, v.rune.life) } : null,
    t: Number.isFinite(v.t) ? v.t : now, carry: Number.isFinite(v.carry) ? v.carry : 0, log: Array.isArray(v.log) ? v.log.slice(-20) : [],
  })));
  for (const v of c.vessels) delete /** @type {any} */ (v).drive;
  while (c.vessels.length < count) c.vessels.push(emptyVessel(c.vessels.length, now));
  return c;
}

/** Total ml in a vessel. @param {Vessel} v */
export function vesselVolume(v) {
  let s = 0;
  for (const ml of Object.values(v.comp)) s += ml;
  return s;
}

/** @param {Vessel} v @param {number} now @param {string} text */
function note(v, now, text) {
  v.log.push({ t: now, text });
  if (v.log.length > 20) v.log.splice(0, v.log.length - 20);
}

/**
 * Lay a brew down in an empty vessel.
 * @param {Vessel} v @param {Record<string, number>} comp ml per id @param {number} T
 * @param {number} now @param {{name?:string, batchId?:string, parts?:{id:string, ml:number}[]}} [meta]
 */
export function fillVessel(v, comp, T, now, meta = {}) {
  if (vesselVolume(v) > 0) return { ok: false, reason: 'The vessel is not empty.' };
  const c = Object.fromEntries(Object.entries(comp).filter(([, ml]) => ml > 1e-6));
  if (!Object.keys(c).length) return { ok: false, reason: 'There is nothing to lay down.' };
  Object.assign(v, emptyVessel(v.id, now), { comp: c, T, name: meta.name || 'A laid-down brew', batchId: meta.batchId, parts: meta.parts || [] });
  note(v, now, `Laid down at ${Math.round(T)}°C.`);
  return { ok: true };
}

/** Empty a vessel; returns what it held. @param {Vessel} v @param {number} now */
export function emptyVesselContents(v, now) {
  const out = { comp: { ...v.comp }, T: v.T, name: v.name, parts: v.parts || [] };
  Object.assign(v, emptyVessel(v.id, now));
  return out;
}

/**
 * The net Fire of a potion (percent; negative: Frost), or 0 when it is too
 * weak to warm or chill a vessel. Its other effects do not matter.
 * @param {ArrayLike<number>} effects
 */
export function potionNet(effects) {
  const net = (effects[EFFECT_INDEX.fire] || 0) - (effects[EFFECT_INDEX.frost] || 0);
  return Math.abs(net) < MIN_POINTS ? 0 : Math.round(net * 10) / 10;
}

/** The temperature a charge of this strength takes a vessel to (°C). @param {number} net */
export function chargeLimit(net) {
  return Math.max(T_MIN, Math.min(T_MAX, Math.round(CELLAR_T + net * DEG_PER_POINT)));
}

/** @deprecated the old name: the limit's offset from cellar temperature (°C), signed. @param {ArrayLike<number>} effects */
export function potionDrive(effects) {
  return potionNet(effects) * DEG_PER_POINT;
}

/**
 * Load (or top up) a vessel's charge with `ml` of a potion with these
 * effects. A top-up mixes with what is left (strengths average by volume;
 * Fire and Frost cancel).
 * @param {Vessel} v @param {ArrayLike<number>} effects @param {number} ml @param {number} now
 */
export function chargeVessel(v, effects, ml, now) {
  if (vesselVolume(v) <= 0) return { ok: false, reason: 'Fill the vessel first.' };
  if (!(ml > 0)) return { ok: false, reason: 'Choose how much potion to load.' };
  const net = potionNet(effects);
  if (!net) return { ok: false, reason: `Only a potion with Fire or Frost (at least ${MIN_POINTS} % more of one than the other) warms or chills a vessel.` };
  const old = v.charge && v.charge.ml > 0 ? v.charge : null;
  const tot = (old ? old.ml : 0) + ml;
  const mixed = old ? (old.ml * old.net + ml * net) / tot : net;
  v.charge = Math.abs(mixed) < MIN_POINTS ? null : { ml: Math.round(tot * 10) / 10, net: Math.round(mixed * 10) / 10 };
  note(v, now, v.charge ? `Loaded ${Math.round(ml)} ml of a ${net > 0 ? 'Fire' : 'Frost'} potion: it can take the vessel to ${chargeLimit(v.charge.net)}°C.` : 'The potions cancelled each other out.');
  return { ok: true, charge: v.charge, limit: v.charge ? chargeLimit(v.charge.net) : CELLAR_T };
}

/** @deprecated a whole bottle as a charge (its volume). @param {Vessel} v @param {ArrayLike<number>} effects @param {number} now @param {number} [ml] */
export function activateVessel(v, effects, now, ml = 100) {
  return chargeVessel(v, effects, ml, now);
}

/**
 * Set a temperature rune on a vessel, or move the target of the rune it
 * already has (that uses no new rune: see `fresh`).
 * @param {Vessel} v @param {number} target °C @param {number} now
 */
export function setRune(v, target, now) {
  if (!Number.isFinite(target)) return { ok: false, reason: 'Choose a temperature.' };
  const t = Math.max(-60, Math.min(300, Math.round(target)));
  const fresh = !(v.rune && v.rune.life > 0);
  v.rune = { target: t, life: fresh ? RUNE_LIFE : /** @type {any} */ (v.rune).life };
  note(v, now, `A rune locks it at ${t}°C.`);
  return { ok: true, fresh };
}

/** Can this rune lock this vessel now (charged, and the target on the way to the charge's limit)? @param {Vessel} v */
export function runeHolds(v) {
  if (!v.rune || !(v.rune.life > 0) || !v.charge || !(v.charge.ml > 0)) return false;
  const lim = chargeLimit(v.charge.net), t = v.rune.target;
  return (lim - t) * (t - CELLAR_T) >= 0;
}

/**
 * The material lookups a vessel needs, cached per lookup function.
 * @param {(id:string)=>any} lookup
 */
function infoOf(lookup) {
  return (id) => lookup(id);
}

/**
 * Freezing point of a vessel's liquid (°C): the volume-weighted melting
 * point of its liquids (solvents and extracts), or null without liquid.
 * @param {Vessel} v @param {(id:string)=>any} lookup
 */
export function freezingPoint(v, lookup) {
  let w = 0, s = 0;
  for (const [id, ml] of Object.entries(v.comp)) {
    const d = lookup(id);
    if (!d || d.form !== 'liquid' || ml <= 0) continue;
    w += ml; s += ml * d.melt;
  }
  return w > 0 ? s / w : null;
}

/**
 * Advance one vessel to `now` (fixed steps).
 * @param {Vessel} v @param {(id:string)=>any} lookup @param {number} now ms
 * @param {number} [pace] how many cellar seconds pass per real second (the Free Experiment's cellar is quicker)
 * @returns {string[]} what happened (for notices)
 */
export function advanceVessel(v, lookup, now, pace = 1) {
  const events = [];
  if (!(now > v.t)) return events;
  let dt = Math.min(((now - v.t) / 1000) * (pace > 0 ? pace : 1), MAX_OFFLINE) + (v.carry || 0);
  v.t = now;
  if (vesselVolume(v) <= 0) { v.carry = 0; return events; }
  const get = infoOf(lookup);
  let steps = Math.floor(dt / CELLAR_STEP);
  v.carry = dt - steps * CELLAR_STEP;
  // a vessel that has settled (nothing left to draw out, no drive, no rune) skips ahead
  for (; steps > 0; steps--) {
    const ev = stepVessel(v, get, CELLAR_STEP);
    for (const e of ev) if (!events.includes(e)) events.push(e);
    if (!v.rune && !v.charge && v.T === CELLAR_T && ev.idle) break;
  }
  for (const e of events) note(v, now, e);
  return events;
}

/**
 * Advance every vessel of the cellar to `now` (at the cellar's own `pace`, if it has one).
 * @param {{vessels:Vessel[], pace?:number}} cellar @param {(id:string)=>any} lookup @param {number} [now]
 */
export function advanceCellar(cellar, lookup, now = Date.now()) {
  const out = [];
  for (const v of cellar.vessels) {
    const ev = advanceVessel(v, lookup, now, cellar.pace || 1);
    for (const e of ev) out.push({ vessel: v.id, text: e });
  }
  return out;
}

/**
 * One step of a vessel: its temperature, its rune, extraction, charring and
 * awakening. Returns its events (and `idle` when nothing moved).
 * @param {Vessel} v @param {(id:string)=>any} get @param {number} dt seconds
 */
function stepVessel(v, get, dt) {
  /** @type {string[] & {idle?:boolean}} */
  const events = [];
  const h = dt / 3600;
  // ---- temperature
  const a = 1 - Math.exp(-dt / CHARGE_TAU);
  const c = v.charge && v.charge.ml > 0 ? v.charge : null;
  if (c) {
    const lim = chargeLimit(c.net), dir = Math.sign(lim - CELLAR_T);
    if (runeHolds(v)) {
      const t = /** @type {{target:number}} */ (v.rune).target;
      // toward the limit until the rune's temperature, then held there; from beyond it, back to it
      if (dir * (v.T - t) < 0) { const n = v.T + (lim - v.T) * a; v.T = dir > 0 ? Math.min(t, n) : Math.max(t, n); }
      else { const n = v.T + (CELLAR_T - v.T) * a; v.T = dir > 0 ? Math.max(t, n) : Math.min(t, n); }
    } else v.T += (lim - v.T) * a;
    // the charge is used up holding the vessel away from cellar temperature
    const use = (vesselVolume(v) * Math.abs(v.T - CELLAR_T) * h) / (HOLD_COST * Math.max(0.3, Math.abs(c.net) / 10));
    c.ml = Math.round(Math.max(0, c.ml - use) * 1000) / 1000;
    if (c.ml <= 0.05) { v.charge = null; events.push(`The ${c.net > 0 ? 'Fire' : 'Frost'} potion is spent: the vessel returns to cellar temperature.`); }
  } else {
    v.T += (CELLAR_T - v.T) * a;
    if (Math.abs(v.T - CELLAR_T) < 0.05) v.T = CELLAR_T;
  }
  v.T = Math.max(T_MIN, Math.min(T_MAX, v.T));
  // a rune wears with the time it is set on a filled vessel
  if (v.rune) {
    v.rune.life -= dt;
    if (v.rune.life <= 0) { v.rune = null; events.push('The rune has worn out: the vessel is no longer held.'); }
  }
  const T = v.T;
  // ---- what the vessel holds
  let Lh = 0, Ll = 0, Xh = 0, Xl = 0, em = 0;
  /** @type {{id:string, ml:number, pr:any, x:string, base:string}[]} */
  const raws = [];
  for (const [id, ml] of Object.entries(v.comp)) {
    if (ml <= 0) continue;
    const d = get(id);
    if (!d) continue;
    if (d.solvent === 'hydro') Lh += ml; else if (d.solvent === 'lipo') Ll += ml;
    if (d.extractClass === 'hydro') Xh += ml; else if (d.extractClass === 'lipo') Xl += ml;
    em += ml * (Number(d.emulsifier) || 0);
    if (d.extraction) raws.push({ id, ml, pr: d.extraction, x: extractIdOf(id), base: d.base || d.id });
  }
  const tf = freezingPoint(v, get);
  const frozen = tf !== null && T <= tf;
  const emulsion = Lh + Xh > 0 && Ll + Xl > 0 && emulsionStability(Lh + Xh, Ll + Xl, em) > 0.5;
  const m = CELLAR_FACTOR * (emulsion ? EMULSION_FACTOR : 1);
  let moved = 0;
  // extracted share per ingredient (plain and awakened forms together)
  /** @type {Map<string, {raw:number, ext:number}>} */
  const grp = new Map();
  for (const r of raws) {
    const g = grp.get(r.base) || { raw: 0, ext: 0 };
    g.raw += r.ml;
    g.ext += v.comp[r.x] || 0;
    grp.set(r.base, g);
  }
  let capH = SOLVENT_CAPACITY * (Lh + Xh) - Xh, capL = SOLVENT_CAPACITY * (Ll + Xl) - Xl;
  let charred = false;
  for (const r of raws) {
    // charring: the unextracted matter above its threshold
    if (T > r.pr.combust) {
      const dv = r.ml * (1 - Math.exp(-CHAR_RATE * (1 + (T - r.pr.combust) / 40) * dt));
      v.comp[r.id] -= dv;
      v.comp[CHAR_ID] = (v.comp[CHAR_ID] || 0) + dv;
      grp.get(r.base).raw -= dv;
      r.ml -= dv;
      moved += dv;
      charred = true;
    }
    if (frozen) continue;
    const L = r.pr.cls === 'lipo' ? Ll : Lh;
    const cap = r.pr.cls === 'lipo' ? capL : capH;
    if (L <= 0 || cap <= 1e-9 || r.ml <= 1e-9) continue;
    const g = /** @type {{raw:number, ext:number}} */ (grp.get(r.base));
    const all = g.raw + g.ext;
    const phi = all > 0 ? g.ext / all : 0;
    const drive = yieldAt(r.pr, T) - phi;
    if (drive <= 1e-6) continue;
    let dv = (r.ml * (1 - Math.exp(-rateAt(r.pr, T) * m * dt)) * drive) / Math.max(0.02, 1 - phi);
    dv = Math.min(dv, r.ml, cap, drive * all);
    if (dv <= 1e-9) continue;
    v.comp[r.id] -= dv;
    v.comp[r.x] = (v.comp[r.x] || 0) + dv;
    g.raw -= dv; g.ext += dv;
    if (r.pr.cls === 'lipo') capL -= dv; else capH -= dv;
    moved += dv;
  }
  if (charred) events.push('Herbs are burning in the vessel: what was not yet drawn out is lost.');
  if (frozen && raws.some((r) => r.ml > 1e-6) && !v.frozen) events.push('The vessel has frozen solid: extraction has stopped.');
  v.frozen = frozen;
  // ---- arcane awakening of the blend, as in the cauldron
  let w = 0, tw = 0;
  for (const [id, ml] of Object.entries(v.comp)) {
    const d = get(id);
    if (ml > 1e-6 && isMagical(d)) { w += ml; tw += ml * d.arcane.thr; }
  }
  if (w > 0) {
    const thr = tw / w, Ta = thresholdToCelsius(thr);
    if (thr >= 0 ? T >= Ta : T <= Ta) {
      for (const [id, ml] of Object.entries(v.comp)) {
        const d = get(id);
        if (!(ml > 1e-6) || !isMagical(d) || !get(awakenedId(id))) continue;
        v.comp[awakenedId(id)] = (v.comp[awakenedId(id)] || 0) + ml;
        delete v.comp[id];
        moved += ml;
      }
      if (moved) events.push('Its magic has awakened.');
    }
  }
  for (const [id, ml] of Object.entries(v.comp)) if (!(ml > 1e-9)) delete v.comp[id];
  if (moved < 1e-7) events.idle = true;
  return events;
}

/**
 * What a vessel shows: temperature, drive, rune, freezing point, and per
 * ingredient its extracted share and the ceiling at the present heat. The
 * combustion threshold is never shown here (the journal keeps what was seen).
 * @param {Vessel} v @param {(id:string)=>any} lookup
 */
export function vesselReport(v, lookup) {
  /** @type {Map<string, {id:string, name:string, cls:string, raw:number, ext:number, ceiling:number}>} */
  const by = new Map();
  let alcohol = 0, total = 0, Lh = 0, Ll = 0, em = 0;
  for (const [id, ml] of Object.entries(v.comp)) {
    total += ml;
    const d = lookup(id);
    if (!d) continue;
    if (d.alcohol) alcohol += ml;
    if (d.solvent === 'hydro' || d.extractClass === 'hydro') Lh += ml;
    if (d.solvent === 'lipo' || d.extractClass === 'lipo') Ll += ml;
    em += ml * (Number(d.emulsifier) || 0);
    let key = null, raw = 0, ext = 0, pr = null;
    if (d.extraction) { key = d.base || d.id; raw = ml; pr = d.extraction; } else if (d.extractOf) { key = d.extractOf; ext = ml; pr = lookup(d.extractOf)?.extraction; }
    if (!key) continue;
    const g = by.get(key) || { id: key, name: lookup(key)?.name || key, cls: pr ? pr.cls : 'hydro', raw: 0, ext: 0, ceiling: pr ? yieldAt(pr, v.T) : 1 };
    g.raw += raw; g.ext += ext;
    by.set(key, g);
  }
  const items = [...by.values()].map((g) => ({ ...g, share: g.raw + g.ext > 0 ? g.ext / (g.raw + g.ext) : 0 }));
  const tf = freezingPoint(v, lookup);
  return {
    ml: total, T: v.T, charge: v.charge ? { ml: v.charge.ml, net: v.charge.net, limit: chargeLimit(v.charge.net) } : null,
    rune: v.rune ? { target: v.rune.target, wear: 1 - v.rune.life / RUNE_LIFE, holds: runeHolds(v), locked: runeHolds(v) && Math.abs(v.T - v.rune.target) < 0.5 } : null,
    freezing: tf, frozen: tf !== null && v.T <= tf, items, alcohol: total > 0 ? (alcohol / total) * 100 : 0,
    emulsion: Lh > 0 && Ll > 0 ? emulsionStability(Lh, Ll, em) : null, char: v.comp[CHAR_ID] || 0,
  };
}
