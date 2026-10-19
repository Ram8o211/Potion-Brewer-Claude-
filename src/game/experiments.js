// The experimentation room: test subjects, measured doses, observations,
// trial records, batch certification and the discovery of resonance laws.
//
// A mixture's effects are hidden. The only way to learn them is to give a
// real dose — drawn from the cauldron tap or split off a sealed vial — to a
// subject and watch what happens. Each subject responds only to some
// effects (a stone does not fall in love), so characterising a potion means
// choosing subjects sensibly. Every trial records exactly what it revealed.
//
// Certification: a batch (one filling of the cauldron) is certified for an
// effect once a trial of *this batch, unchanged since* revealed it, and the
// brew still matches that reading. Pouring anything new invalidates every
// earlier trial of the batch; so does drift from reactions, settling or heat
// (checked silently against the brew that would actually be bottled).

import { EFFECTS, EFFECT_KEYS, EFFECT_INDEX, NE, potencyWord } from '../alchemy/effects.js';
import {
  createColony, normalizeColony, installRabbitAlias, rabbitResponse, findRabbit, focusRabbit, recordDose,
  rabbitSnap, encodeSnap, stageOf, addBoughtRabbit, STAGE_ERR,
} from './colony.js';

/**
 * @typedef {Object} SubjectDef
 * @property {string} id
 * @property {string} name
 * @property {'animal'|'plant'|'mineral'|'spirit'} kind
 * @property {string[]} reveals  effect keys this subject visibly responds to
 * @property {number} cost       coins for a replacement
 * @property {string} desc
 * @property {string} [needs]    equipment id required
 */

/** @type {SubjectDef[]} */
export const SUBJECTS = [
  { id: 'rabbit', name: 'Moon Rabbit', kind: 'animal', reveals: ['vitality', 'strength', 'love', 'toxicity', 'death'], cost: 6,
    desc: 'A gentle animal. Shows healing, strength, affection, poison and death.' },
  { id: 'beetle', name: 'Copper Beetle', kind: 'animal', reveals: ['strength', 'transformation', 'fire', 'frost', 'toxicity'], cost: 3,
    desc: 'A hardy beetle. Shows strength, transformation, fire, frost and poison.' },
  { id: 'seedling', name: 'Bean Seedling', kind: 'plant', reveals: ['vitality', 'love', 'fire', 'frost', 'acidity', 'toxicity'], cost: 2,
    desc: 'A young plant. Shows growth, blooming, heat, cold, acid and poison.' },
  { id: 'stone', name: 'Limestone', kind: 'mineral', reveals: ['acidity', 'strength', 'fire', 'frost', 'arcana', 'transformation'], cost: 1,
    desc: 'An inert stone. Acid etches it; it hardens, glows, frosts or recrystallises.' },
  { id: 'wisp', name: 'Will-o’-Wisp', kind: 'spirit', reveals: ['arcana', 'transformation', 'love', 'death', 'vitality'], cost: 14, needs: 'lantern',
    desc: 'A captive marsh light that feeds on magic. Shows arcana, change, love, life and death.' },
];
/** @type {Record<string, SubjectDef>} */
export const SUBJECT_BY_ID = Object.fromEntries(SUBJECTS.map((s) => [s.id, s]));
export const RECORD_LIMIT = 120;
export const DOSES = [5, 10, 25];

/** Absolute/relative tolerance for "the brew still matches the trial". */
export function driftTolerance(v) {
  return Math.max(3, 0.15 * Math.abs(v));
}

/**
 * @typedef {Object} SubjectState
 * @property {number} health 0..100
 * @property {boolean} alive
 * @property {number} trials
 * @property {Record<string, number>} marks  visible states 0..100: glow, burn, frost, love, change, vigor, growth, etch, sick
 * @property {string} [id]     (the rabbit handle: the selected colony rabbit, colony.js)
 * @property {string} [name]
 */

/** @param {SubjectDef} def @returns {SubjectState} */
function freshSubject(def) {
  return { health: 100, alive: true, trials: 0, marks: { glow: 0, burn: 0, frost: 0, love: 0, change: 0, vigor: 0, growth: def.kind === 'plant' ? 20 : 0, etch: 0, sick: 0 } };
}

/**
 * Fresh trials state. The Moon Rabbits live in `colony` (colony.js);
 * `subjects.rabbit` is a non-enumerable handle on the selected rabbit, so
 * code written for one rabbit keeps working and saves never hold it twice.
 */
export function createTrials() {
  /** @type {Record<string, SubjectState>} */
  const subjects = {};
  for (const d of SUBJECTS) if (d.id !== 'rabbit') subjects[d.id] = freshSubject(d);
  const t = { subjects, records: /** @type {TrialRecord[]} */ ([]), serial: 0, laws: /** @type {Record<string, {evidence:number, found:number|null}>} */ ({}), colony: createColony() };
  installRabbitAlias(t);
  return t;
}

/**
 * Bring a saved trials object up to date (missing subjects, bad numbers).
 * @param {any} t
 */
export function normalizeTrials(t) {
  const out = createTrials();
  if (!t || typeof t !== 'object') return out;
  for (const d of SUBJECTS) {
    if (d.id === 'rabbit') continue;
    const s = t.subjects && t.subjects[d.id];
    if (s && typeof s === 'object') {
      const marks = { ...out.subjects[d.id].marks };
      for (const k of Object.keys(marks)) if (Number.isFinite(s.marks?.[k])) marks[k] = clamp(s.marks[k], 0, 100);
      out.subjects[d.id] = { health: Number.isFinite(s.health) ? clamp(s.health, 0, 100) : 100, alive: s.alive !== false, trials: s.trials | 0, marks };
    }
  }
  if (Array.isArray(t.records)) out.records = t.records.filter((r) => r && typeof r === 'object' && typeof r.subjectId === 'string' && r.values).slice(0, RECORD_LIMIT);
  out.serial = Math.max(t.serial | 0, ...out.records.map((r) => r.serial | 0), 0);
  if (t.laws && typeof t.laws === 'object') for (const [k, v] of Object.entries(t.laws)) if (v && typeof v === 'object') out.laws[k] = { evidence: v.evidence | 0, found: v.found ?? null };
  // the colony (an old save's single rabbit becomes its founder, by shape)
  out.colony = normalizeColony(t.colony, t.subjects && t.subjects.rabbit, out.records);
  installRabbitAlias(out);
  return out;
}

/**
 * How a subject responds to a dose. Pure and deterministic.
 * @param {SubjectDef} def @param {SubjectState} before
 * @param {ArrayLike<number>} effects dose effect vector (NE)
 * @param {number} ml dose
 */
export function subjectResponse(def, before, effects, ml) {
  if (def.id === 'rabbit') {
    // a Moon Rabbit is an individual of the colony: every channel acts on it
    const r = rabbitResponse(before, effects, ml, {});
    return { after: /** @type {any} */ (r.after), observations: r.observations, harm: r.harm };
  }
  const x = Math.min(2.5, Math.max(0, ml) / 10); // exposure relative to a 10 ml dose
  const v = (key) => effects[EFFECT_INDEX[key]] * x;
  const after = { ...before, marks: { ...before.marks } };
  const mk = after.marks;
  /** @type {{text:string, key:string, tone:'good'|'bad'|'neutral'}[]} */
  const obs = [];
  const say = (key, tone, text) => obs.push({ key, tone, text });
  if (!before.alive) return { after, observations: [{ key: '', tone: /** @type {'neutral'} */ ('neutral'), text: 'The subject is spent. Replace it for a fresh trial.' }], harm: 0 };
  const kind = def.kind;
  let harm = 0, heal = 0;
  const vit = v('vitality'), str = v('strength'), love = v('love'), arc = v('arcana'), tr = v('transformation');
  const fire = v('fire'), frost = v('frost'), acid = v('acidity'), tox = v('toxicity'), death = v('death');
  const shows = (k) => def.reveals.includes(k);
  if (shows('vitality') && vit > 1) {
    heal += vit * 0.7;
    if (kind === 'plant') { mk.growth = clamp(mk.growth + vit * 0.9, 0, 100); say('vitality', 'good', vit > 20 ? 'The seedling shoots up, leaves unfurling.' : 'New leaves appear.'); }
    else if (kind === 'spirit') { mk.glow = clamp(mk.glow + vit * 0.4, 0, 100); say('vitality', 'good', 'The wisp brightens to a warm, living gold.'); }
    else { mk.vigor = clamp(mk.vigor + vit * 0.8, 0, 100); say('vitality', 'good', vit > 20 ? 'Its coat gleams; it bounds about full of life.' : 'It looks refreshed.'); }
  }
  if (shows('strength') && str > 1) {
    if (kind === 'mineral') { mk.etch = clamp(mk.etch - str * 0.5, 0, 100); say('strength', 'good', str > 20 ? 'The stone turns hard as iron; a knife skids off it.' : 'The stone seems a little harder.'); }
    else { mk.vigor = clamp(mk.vigor + str, 0, 100); say('strength', 'good', str > 20 ? (kind === 'animal' && def.id === 'beetle' ? 'The beetle lifts a pebble twice its size.' : 'It grows visibly stronger and pushes at the cage.') : 'It moves with new strength.'); }
  }
  if (shows('love') && love > 1) {
    mk.love = clamp(mk.love + love * 1.2, 0, 100);
    say('love', 'good', kind === 'plant' ? 'Pink buds open and lean towards you.' : kind === 'spirit' ? 'The wisp drifts close and circles your hand.' : 'It nuzzles your hand, utterly devoted.');
  }
  if (shows('arcana') && arc > 1) {
    mk.glow = clamp(mk.glow + arc * 1.2, 0, 100);
    say('arcana', 'neutral', kind === 'mineral' ? (arc > 20 ? 'Runes of light crawl across the stone.' : 'The stone glimmers faintly.') : 'It shimmers with arcane light.');
  }
  if (shows('transformation') && tr > 1) {
    mk.change = clamp(mk.change + tr * 1.3, 0, 100);
    say('transformation', 'neutral', kind === 'mineral' ? 'Crystals sprout over the stone’s surface.' : kind === 'spirit' ? 'The wisp twists into new shapes and colours.' : 'Its colours shift and its shape subtly changes.');
  }
  const netFire = fire, netFrost = frost;
  if (shows('fire') && netFire > 1) {
    mk.burn = clamp(mk.burn + netFire * 1.2, 0, 100);
    if (netFire > 18 && kind !== 'mineral') harm += (netFire - 18) * (kind === 'plant' ? 1.4 : 0.8);
    say('fire', netFire > 18 && kind !== 'mineral' ? 'bad' : 'neutral', kind === 'mineral' ? 'The stone glows hot.' : kind === 'plant' ? (netFire > 18 ? 'The leaves scorch.' : 'The leaves warm and redden.') : (netFire > 18 ? 'It yelps; its fur smoulders.' : 'A warm glow surrounds it.'));
  }
  if (shows('frost') && netFrost > 1) {
    mk.frost = clamp(mk.frost + netFrost * 1.2, 0, 100);
    if (netFrost > 18 && kind !== 'mineral') harm += (netFrost - 18) * (kind === 'plant' ? 1.1 : 0.7);
    say('frost', netFrost > 18 && kind !== 'mineral' ? 'bad' : 'neutral', kind === 'mineral' ? 'A crust of rime grows on the stone.' : kind === 'plant' ? 'Frost feathers the leaves.' : 'Frost rimes its whiskers; it shivers.');
  }
  if (shows('acidity') && Math.abs(acid) > 1) {
    if (acid > 1) {
      mk.etch = clamp(mk.etch + acid * (kind === 'mineral' ? 1.5 : 0.8), 0, 100);
      if (kind === 'plant') harm += acid * 0.8;
      say('acidity', 'bad', kind === 'mineral' ? (acid > 15 ? 'The stone fizzes violently and pits deeply.' : 'The stone fizzes where the drops land.') : 'The leaves blister where the drops land.');
    } else {
      say('acidity', 'neutral', kind === 'mineral' ? 'A chalky alkaline film dries on the stone; no fizzing.' : 'The soil turns chalky; the leaves pale slightly.');
      if (kind === 'plant') harm += -acid * 0.3;
    }
  }
  if (shows('toxicity') && tox > 1) {
    const sens = def.id === 'beetle' ? 0.45 : kind === 'plant' ? 0.9 : 1.1;
    harm += tox * sens;
    mk.sick = clamp(mk.sick + tox, 0, 100);
    say('toxicity', 'bad', kind === 'plant' ? 'The leaves yellow and droop.' : tox > 15 ? 'It staggers, sick and trembling.' : 'It looks queasy.');
  }
  if (shows('death') && death > 1) {
    harm += death * (kind === 'spirit' ? 0.8 : 1.8);
    say('death', 'bad', kind === 'spirit' ? 'The wisp dims and gutters.' : death > 15 ? 'A grey pallor creeps over it.' : 'It grows still and cold for a moment.');
  }
  after.health = clamp(before.health + heal * 0.5 - harm, 0, 100);
  if (kind === 'mineral') after.health = clamp(100 - mk.etch, 0, 100);
  after.alive = after.health > 0.5;
  if (!after.alive) say('', 'bad', kind === 'mineral' ? 'The stone crumbles to wet grit.' : kind === 'spirit' ? 'The wisp goes out.' : kind === 'plant' ? 'The seedling withers and dies.' : 'It collapses and does not get up.');
  if (!obs.length) say('', 'neutral', 'No visible change.');
  after.trials = before.trials + 1;
  return { after, observations: obs, harm };
}

/**
 * @typedef {Object} TrialRecord
 * @property {string} id
 * @property {number} serial
 * @property {number} at          wall-clock time
 * @property {number} day
 * @property {string} subjectId
 * @property {number} ml
 * @property {'cauldron'|'vial'} source
 * @property {string} batchId
 * @property {number} rev
 * @property {string[]} revealed
 * @property {Record<string, number>} values   measured value per revealed effect
 * @property {Record<string, number>} theory   naive theory for the batch at the time
 * @property {{text:string, key:string, tone:string}[]} observations
 * @property {string[]} anomalies    effect keys that departed from theory
 * @property {string[]} lawsFound    laws confirmed by this trial
 * @property {{color:number[], temperature:number}} look
 * @property {{id:string, ml:number}[]} parts   what the batch was made of
 * @property {boolean} died
 * @property {string} [rabbitId]      the colony rabbit that was dosed
 * @property {string} [rabbitName]
 * @property {Record<string, number>} [err]  reading uncertainty (±) per revealed effect
 * @property {{b:string, a:string, rx:string}} [replay]  the rabbit's look before and after (encoded snapshots) and the channels that acted
 */

/**
 * Give a dose to a subject and record what it revealed.
 * @param {ReturnType<typeof createTrials>} trials
 * @param {string} subjectId
 * @param {{effects:ArrayLike<number>, resonance?:ArrayLike<number>, color?:number[], temperature?:number}} dose measured dose
 * @param {{ml:number, source:'cauldron'|'vial', batchId:string, rev:number, day:number, now?:number,
 *          theory:ArrayLike<number>, laws:import('../alchemy/effects.js').Resonance[], parts?:{id:string, ml:number}[], rabbitId?:string}} ctx
 */
export function runTrial(trials, subjectId, dose, ctx) {
  const def = SUBJECT_BY_ID[subjectId];
  if (!def) throw new Error('Choose a test subject.');
  const isRabbit = subjectId === 'rabbit';
  /** @type {any} */
  let st;
  if (isRabbit) {
    st = ctx.rabbitId ? findRabbit(trials.colony, ctx.rabbitId) : focusRabbit(trials.colony);
    if (!st) throw new Error('Choose a rabbit.');
    if (!st.alive) throw new Error(`${st.name} is dead — choose or buy another rabbit.`);
  } else {
    st = trials.subjects[subjectId] || (trials.subjects[subjectId] = freshSubject(def));
    if (!st.alive) throw new Error(`The ${def.name.toLowerCase()} is spent — replace it first.`);
  }
  if (!(ctx.ml > 0)) throw new Error('Choose a positive dose.');
  const rr = isRabbit ? rabbitResponse(st, dose.effects, ctx.ml, { day: ctx.day }) : null;
  const res = rr || subjectResponse(def, st, dose.effects, ctx.ml);
  // how sure a reading is: small doses, kits and the old read less precisely
  const errK = Math.sqrt(10 / ctx.ml) * (isRabbit ? STAGE_ERR[stageOf(st, ctx.day)] || 1 : 1);
  /** @type {Record<string, number>} */
  const err = {};
  /** @type {Record<string, number>} */
  const values = {};
  /** @type {Record<string, number>} */
  const theory = {};
  const anomalies = [];
  for (const key of def.reveals) {
    const k = EFFECT_INDEX[key];
    const val = Math.round(dose.effects[k] * 10) / 10;
    values[key] = Math.abs(val) < 0.5 ? 0 : val;
    err[key] = Math.round((0.6 + 0.04 * Math.abs(values[key])) * errK * 10) / 10;
    theory[key] = Math.round((ctx.theory?.[k] ?? 0) * 10) / 10;
    if (Math.abs(values[key] - theory[key]) > Math.max(4, 0.3 * Math.abs(theory[key]))) anomalies.push(key);
  }
  // resonance laws at work in this dose, visible on a channel this subject shows
  const lawsFound = [];
  const laws = ctx.laws || [];
  for (let r = 0; r < laws.length; r++) {
    const amt = dose.resonance ? dose.resonance[r] || 0 : 0;
    if (amt < 1.5) continue;
    const L = laws[r];
    const seen = [L.a, L.c].filter((x) => x >= 0).map((x) => EFFECT_KEYS[x]).some((key) => def.reveals.includes(key));
    if (!seen) continue;
    const rec = (trials.laws[L.id] ||= { evidence: 0, found: null });
    rec.evidence++;
    if (rec.found === null && rec.evidence >= 2) { rec.found = ctx.day; lawsFound.push(L.id); }
  }
  trials.serial++;
  /** @type {TrialRecord} */
  const record = {
    id: 't' + trials.serial, serial: trials.serial, at: ctx.now ?? Date.now(), day: ctx.day, subjectId, ml: ctx.ml, source: ctx.source,
    batchId: ctx.batchId, rev: ctx.rev, revealed: def.reveals.slice(), values, theory,
    observations: res.observations, anomalies, lawsFound,
    look: { color: (dose.color || [0.5, 0.5, 0.5]).map((c) => Math.round(c * 1000) / 1000), temperature: Math.round(dose.temperature ?? 20) },
    parts: (ctx.parts || []).map((p) => ({ id: p.id, ml: Math.round(p.ml) })), died: !res.after.alive, err,
  };
  if (isRabbit) {
    // the dosed individual: its own log, and a replay of how it looked
    const after = rr.after;
    record.rabbitId = st.id;
    record.rabbitName = st.name;
    record.replay = { b: encodeSnap(rabbitSnap(st, ctx.day)), a: encodeSnap(rabbitSnap(after, ctx.day)), rx: rr.react.join(',') };
    recordDose(after, { rec: record.id, day: ctx.day, ml: ctx.ml, src: ctx.source === 'vial' ? 'vial' : 'cauldron',
      obs: rr.observations.filter((o) => o.key).map((o) => o.key + (o.tone === 'good' ? '+' : o.tone === 'bad' ? '-' : '')).join(','), ...(after.alive ? {} : { died: 1 }) });
    const i = trials.colony.rabbits.indexOf(st);
    if (i >= 0) trials.colony.rabbits[i] = after;
  } else trials.subjects[subjectId] = res.after;
  trials.records.unshift(record);
  if (trials.records.length > RECORD_LIMIT) trials.records.length = RECORD_LIMIT;
  return record;
}

/** @param {ReturnType<typeof createTrials>} trials @param {string} id */
export function resetSubject(trials, id) {
  const def = SUBJECT_BY_ID[id];
  if (!def) throw new Error('Unknown subject.');
  if (id === 'rabbit') {
    // a rabbit is not reset: a new one joins the hutch and is selected
    const r = addBoughtRabbit(trials.colony, { day: trials.colony.day || 1 });
    trials.colony.focus = r.id;
    return r;
  }
  trials.subjects[id] = { ...freshSubject(def), trials: trials.subjects[id]?.trials || 0 };
  return trials.subjects[id];
}

/**
 * Verified effect readings for the current batch: the newest trial of this
 * batch and revision that revealed each effect and still agrees with the
 * brew as it would be bottled now.
 * @param {ReturnType<typeof createTrials>} trials
 * @param {{id:string, rev:number}} batch
 * @param {ArrayLike<number>|null} current effects of what would be bottled (hidden truth)
 * @returns {{values: Record<string, number>, records: Record<string, string>, stale: string[], changed: boolean}}
 */
export function certification(trials, batch, current) {
  /** @type {Record<string, number>} */
  const values = {};
  /** @type {Record<string, string>} */
  const records = {};
  const stale = new Set();
  let changed = false;
  for (const r of trials.records) {
    if (r.batchId !== batch.id) continue;
    if (r.rev !== batch.rev) { changed = true; continue; }
    for (const key of r.revealed) {
      if (values[key] !== undefined || stale.has(key)) continue;
      const v = r.values[key];
      if (current && Math.abs(current[EFFECT_INDEX[key]] - v) > driftTolerance(v)) { stale.add(key); continue; }
      values[key] = v;
      records[key] = r.id;
    }
  }
  return { values, records, stale: [...stale], changed };
}

/** Effect keys an order needs verified. @param {any} commission */
export function requiredEffects(commission) {
  if (!commission) return [];
  return commission.requirements.map((r) => r.key).filter((k) => EFFECT_INDEX[k] !== undefined);
}

/** Missing verifications for an order. @param {any} commission @param {Record<string, number>} values */
export function missingEffects(commission, values) {
  return requiredEffects(commission).filter((k) => values[k] === undefined);
}

/** Which subjects together cover a set of effects (greedy). @param {string[]} keys @param {(id:string)=>boolean} [avail] */
export function suggestSubjects(keys, avail = () => true) {
  const left = new Set(keys);
  const out = [];
  while (left.size) {
    let best = null, bc = 0;
    for (const s of SUBJECTS) {
      if (!avail(s.id)) continue;
      const c = s.reveals.filter((k) => left.has(k)).length;
      if (c > bc) { bc = c; best = s; }
    }
    if (!best) break;
    out.push(best.id);
    for (const k of best.reveals) left.delete(k);
  }
  return out;
}

/** Laws the player has confirmed. @param {ReturnType<typeof createTrials>} trials @param {import('../alchemy/effects.js').Resonance[]} laws */
export function knownLaws(trials, laws) {
  return (laws || []).filter((L) => trials.laws[L.id] && trials.laws[L.id].found !== null);
}

/** One-line description of a measured value. @param {string} key @param {number} v */
export function describeReading(key, v) {
  const e = EFFECTS[EFFECT_INDEX[key]];
  return `${e.label} ${Math.round(v)} (${potencyWord(v, key)})`;
}

void NE;

/** @param {number} v @param {number} a @param {number} b */
function clamp(v, a, b) {
  return v < a ? a : v > b ? b : v;
}
