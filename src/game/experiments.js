// The experimentation room: the Moon Rabbits of the colony are the only
// test subjects. A mixture's effects are hidden; the way to learn them is to
// give a real dose — drawn from the cauldron tap or split off a sealed
// vial — to a rabbit and read what it does. A rabbit shows every effect, but
// no reading is exact: every dose varies (DOSE_NOISE) and each rabbit feels
// each effect a little more or less than the next (colony.js
// rabbitSensitivity, a small hidden lifelong bias). One reading is a rough
// guess; the estimate narrows with every trial. Trials on the same rabbit
// keep the rest of the colony clean and still narrow it (down to that
// rabbit's own small bias), but the effect piles up in that rabbit towards
// a degeneration threshold nobody can see; trials on different rabbits
// narrow it fastest.
//
// Certification: a batch (one filling of the cauldron) is known for an
// effect once trials of *this batch, unchanged since* read it; the estimate
// is the mean of those readings with its uncertainty. Pouring anything new
// invalidates every earlier trial of the batch; so does drift from
// reactions, settling or heat (checked silently against the brew that would
// actually be bottled).

import { EFFECTS, EFFECT_KEYS, EFFECT_INDEX, NE, potencyWord } from '../alchemy/effects.js';
import { Rng, hashString } from '../core/rng.js';
import {
  createColony, normalizeColony, installRabbitAlias, rabbitResponse, findRabbit, focusRabbit, recordDose,
  rabbitSnap, encodeSnap, stageOf, addBoughtRabbit, STAGE_ERR, rabbitSensitivity, RABBIT_BIAS,
} from './colony.js';

/**
 * @typedef {Object} SubjectDef
 * @property {string} id
 * @property {string} name
 * @property {'animal'|'plant'|'mineral'|'spirit'} kind
 * @property {string[]} reveals  effect keys this subject visibly responds to
 * @property {number} cost       coins for a replacement
 * @property {string} desc
 * @property {boolean} [legacy]  retired subject (only old trial records name it)
 */

/** @type {SubjectDef[]} */
export const SUBJECTS = [
  { id: 'rabbit', name: 'Moon Rabbit', kind: 'animal', reveals: EFFECT_KEYS.slice(), cost: 6,
    desc: 'A Moon Rabbit of your colony. It shows every effect — each one a little differently.' },
];
/** Subjects of older saves: their records stay readable. @type {SubjectDef[]} */
const RETIRED = [
  { id: 'beetle', name: 'Copper Beetle', kind: 'animal', reveals: ['strength', 'transformation', 'fire', 'frost', 'toxicity'], cost: 3, desc: '', legacy: true },
  { id: 'seedling', name: 'Bean Seedling', kind: 'plant', reveals: ['vitality', 'love', 'fire', 'frost', 'acidity', 'toxicity'], cost: 2, desc: '', legacy: true },
  { id: 'stone', name: 'Limestone', kind: 'mineral', reveals: ['acidity', 'strength', 'fire', 'frost', 'arcana', 'transformation'], cost: 1, desc: '', legacy: true },
  { id: 'wisp', name: 'Will-o’-Wisp', kind: 'spirit', reveals: ['arcana', 'transformation', 'love', 'death', 'vitality'], cost: 14, desc: '', legacy: true },
];
/** @type {Record<string, SubjectDef>} */
export const SUBJECT_BY_ID = Object.fromEntries([...SUBJECTS, ...RETIRED].map((s) => [s.id, s]));
export const RECORD_LIMIT = 160;
export const DOSES = [5, 10, 25];
/** Per-dose variation of a reading (relative, one sigma, for an adult and 10 ml). */
export const DOSE_NOISE = 0.3;
/** Absolute per-dose variation of a reading (one sigma, for an adult and 10 ml). */
export const READ_NOISE = 1.5;

/** Absolute/relative tolerance for "the brew still matches the trial". */
export function driftTolerance(v) {
  return Math.max(3, 0.15 * Math.abs(v));
}

/**
 * Fresh trials state. The Moon Rabbits live in `colony` (colony.js);
 * `subjects.rabbit` is a non-enumerable handle on the selected rabbit, so
 * code written for one rabbit keeps working and saves never hold it twice.
 */
export function createTrials() {
  /** @type {Record<string, any>} */
  const subjects = {};
  const t = { subjects, records: /** @type {TrialRecord[]} */ ([]), serial: 0, laws: /** @type {Record<string, {evidence:number, found:number|null}>} */ ({}), colony: createColony() };
  installRabbitAlias(t);
  return t;
}

/**
 * Bring a saved trials object up to date (retired subjects are dropped,
 * their records kept).
 * @param {any} t
 */
export function normalizeTrials(t) {
  const out = createTrials();
  if (!t || typeof t !== 'object') return out;
  if (Array.isArray(t.records)) out.records = t.records.filter((r) => r && typeof r === 'object' && typeof r.subjectId === 'string' && r.values).slice(0, RECORD_LIMIT);
  out.serial = Math.max(t.serial | 0, ...out.records.map((r) => r.serial | 0), 0);
  if (t.laws && typeof t.laws === 'object') for (const [k, v] of Object.entries(t.laws)) if (v && typeof v === 'object') out.laws[k] = { evidence: v.evidence | 0, found: v.found ?? null };
  // the colony (an old save's single rabbit becomes its founder, by shape)
  out.colony = normalizeColony(t.colony, t.subjects && t.subjects.rabbit, out.records);
  installRabbitAlias(out);
  return out;
}

/**
 * What one rabbit reads for one dose: the real effects, scaled by the
 * rabbit's own sensitivity and by this dose's variation. Effects that are
 * absent read as absent. Pure.
 * @param {any} rabbit @param {ArrayLike<number>} effects @param {{ml:number, day?:number, salt:string}} o
 * @returns {number[]}
 */
export function rabbitReading(rabbit, effects, o) {
  const rng = new Rng(hashString(`reading:${o.salt}:${rabbit.id}`));
  const errK = Math.sqrt(10 / Math.max(1, o.ml)) * (STAGE_ERR[stageOf(rabbit, o.day)] || 1);
  const out = new Array(NE).fill(0);
  for (let k = 0; k < NE; k++) {
    const v = Number(effects[k]) || 0;
    const g1 = rng.gauss(), g2 = rng.gauss();
    if (Math.abs(v) < 0.3) continue;
    const f = rabbitSensitivity(rabbit, EFFECT_KEYS[k]) * Math.max(0.3, 1 + DOSE_NOISE * errK * g1);
    out[k] = v * f + READ_NOISE * errK * g2;
    if (Math.sign(out[k]) !== Math.sign(v)) out[k] = 0;
  }
  return out;
}

/** @typedef {{v:number, r:string, rec:string, e?:number}} Sample one reading: value, rabbit id, record id, noise factor of its dose (√(10 ml / dose), 1 if absent) */

/** Noise factor of a dose of `ml`. @param {number} ml */
export const doseErr = (ml) => Math.round(Math.sqrt(10 / Math.max(1, Number(ml) || 10)) * 1000) / 1000;

/**
 * Pool readings into an estimate per effect: the mean, how sure it is (±,
 * one sigma), the number of readings and of rabbits, and the newest record
 * behind it. The ± shrinks with every reading: the dose-to-dose noise
 * averages out over all of them, the rabbits' own biases only over
 * different rabbits — so readings piled on one rabbit level off at that
 * rabbit's bias, and spreading them over the colony narrows it fastest.
 * @param {Record<string, Sample[]>} samples
 */
export function summarize(samples) {
  /** @type {Record<string, number>} */ const values = {};
  /** @type {Record<string, number>} */ const spread = {};
  /** @type {Record<string, number>} */ const n = {};
  /** @type {Record<string, number>} */ const rabbits = {};
  /** @type {Record<string, string>} */ const records = {};
  for (const [key, list] of Object.entries(samples || {})) {
    if (!Array.isArray(list) || !list.length) continue;
    const mean = list.reduce((a, s) => a + s.v, 0) / list.length;
    const N = list.length;
    /** @type {Record<string, number>} */
    const per = {};
    for (const s of list) per[s.r] = (per[s.r] || 0) + 1;
    const nr = Object.keys(per).length;
    const sd = N > 1 ? Math.sqrt(list.reduce((a, s) => a + (s.v - mean) ** 2, 0) / (N - 1)) : 0;
    const am = Math.abs(mean);
    const bias = RABBIT_BIAS * am * Math.sqrt(Object.values(per).reduce((a, c) => a + c * c, 0)) / N;
    const noise = Math.sqrt(list.reduce((a, s) => { const e = s.e || 1; return a + (DOSE_NOISE * e * am) ** 2 + (READ_NOISE * e + 0.3) ** 2; }, 0)) / N;
    const model = Math.sqrt(bias * bias + noise * noise);
    const m = Math.round(mean * 10) / 10;
    values[key] = Math.abs(m) < 0.5 ? 0 : m;
    spread[key] = Math.round(Math.max(0.5, model, sd / Math.sqrt(N)) * 10) / 10;
    n[key] = list.length;
    rabbits[key] = nr;
    records[key] = list[list.length - 1].rec;
  }
  return { values, spread, n, rabbits, records };
}

/** Add one record's readings to a sample set (newest last). @param {Record<string, Sample[]>} samples @param {any} rec */
export function addSamples(samples, rec) {
  for (const key of rec.revealed || []) {
    if (rec.values[key] === undefined) continue;
    (samples[key] ||= []).push({ v: rec.values[key], r: rec.rabbitId || rec.subjectId, rec: rec.id, e: doseErr(rec.ml) });
  }
  return samples;
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
 * @property {Record<string, number>} [tv]   the dose's real effects (hidden: only the drift check reads them)
 * @property {string[]} [degen]   channels that started degenerating with this dose
 */

/**
 * Give a dose to a rabbit and record what it revealed.
 * @param {ReturnType<typeof createTrials>} trials
 * @param {string} subjectId always 'rabbit'
 * @param {{effects:ArrayLike<number>, resonance?:ArrayLike<number>, color?:number[], temperature?:number}} dose measured dose
 * @param {{ml:number, source:'cauldron'|'vial', batchId:string, rev:number, day:number, now?:number,
 *          theory:ArrayLike<number>, laws:import('../alchemy/effects.js').Resonance[], parts?:{id:string, ml:number}[], rabbitId?:string}} ctx
 */
export function runTrial(trials, subjectId, dose, ctx) {
  const def = SUBJECT_BY_ID[subjectId];
  if (!def || def.legacy) throw new Error('Only the rabbits of the colony can be tested.');
  const st = ctx.rabbitId ? findRabbit(trials.colony, ctx.rabbitId) : focusRabbit(trials.colony);
  if (!st) throw new Error('Choose a rabbit.');
  if (!st.alive) throw new Error(`${st.name} is dead — choose or buy another rabbit.`);
  if (!(ctx.ml > 0)) throw new Error('Choose a positive dose.');
  // what this rabbit actually feels (and shows) of this dose
  const felt = rabbitReading(st, dose.effects, { ml: ctx.ml, day: ctx.day, salt: `${trials.serial + 1}:${ctx.batchId}:${ctx.rev}` });
  const rr = rabbitResponse(st, felt, ctx.ml, { day: ctx.day });
  const errK = Math.sqrt(10 / ctx.ml) * (STAGE_ERR[stageOf(st, ctx.day)] || 1);
  /** @type {Record<string, number>} */ const err = {};
  /** @type {Record<string, number>} */ const values = {};
  /** @type {Record<string, number>} */ const theory = {};
  /** @type {Record<string, number>} */ const tv = {};
  const anomalies = [];
  for (const key of def.reveals) {
    const k = EFFECT_INDEX[key];
    const val = Math.round(felt[k] * 10) / 10;
    values[key] = Math.abs(val) < 0.5 ? 0 : val;
    tv[key] = Math.round((Number(dose.effects[k]) || 0) * 10) / 10;
    err[key] = Math.round(Math.sqrt((RABBIT_BIAS * Math.abs(values[key])) ** 2 + (DOSE_NOISE * errK * Math.abs(values[key])) ** 2 + (READ_NOISE * errK) ** 2) * 10) / 10;
    theory[key] = Math.round((ctx.theory?.[k] ?? 0) * 10) / 10;
    if (Math.abs(values[key] - theory[key]) > Math.max(4, 0.35 * Math.abs(theory[key]))) anomalies.push(key);
  }
  // resonance laws at work in this dose (a rabbit shows every channel)
  const lawsFound = [];
  const laws = ctx.laws || [];
  for (let r = 0; r < laws.length; r++) {
    const amt = dose.resonance ? dose.resonance[r] || 0 : 0;
    if (amt < 1.5) continue;
    const L = laws[r];
    const rec = (trials.laws[L.id] ||= { evidence: 0, found: null });
    rec.evidence++;
    if (rec.found === null && rec.evidence >= 2) { rec.found = ctx.day; lawsFound.push(L.id); }
  }
  trials.serial++;
  const after = rr.after;
  /** @type {TrialRecord} */
  const record = {
    id: 't' + trials.serial, serial: trials.serial, at: ctx.now ?? Date.now(), day: ctx.day, subjectId: 'rabbit', ml: ctx.ml, source: ctx.source,
    batchId: ctx.batchId, rev: ctx.rev, revealed: def.reveals.slice(), values, theory, tv,
    observations: rr.observations, anomalies, lawsFound,
    look: { color: (dose.color || [0.5, 0.5, 0.5]).map((c) => Math.round(c * 1000) / 1000), temperature: Math.round(dose.temperature ?? 20) },
    parts: (ctx.parts || []).map((p) => ({ id: p.id, ml: Math.round(p.ml) })), died: !after.alive, err,
    rabbitId: st.id, rabbitName: st.name,
    replay: { b: encodeSnap(rabbitSnap(st, ctx.day)), a: encodeSnap(rabbitSnap(after, ctx.day)), rx: rr.react.join(',') },
    degen: rr.degen,
  };
  recordDose(after, { rec: record.id, day: ctx.day, ml: ctx.ml, src: ctx.source === 'vial' ? 'vial' : 'cauldron',
    obs: rr.observations.filter((o) => o.key).map((o) => o.key + (o.tone === 'good' ? '+' : o.tone === 'bad' ? '-' : '')).join(','), ...(after.alive ? {} : { died: 1 }) });
  const i = trials.colony.rabbits.indexOf(st);
  if (i >= 0) trials.colony.rabbits[i] = after;
  trials.records.unshift(record);
  if (trials.records.length > RECORD_LIMIT) trials.records.length = RECORD_LIMIT;
  return record;
}

/** @param {ReturnType<typeof createTrials>} trials @param {string} id */
export function resetSubject(trials, id) {
  if (id !== 'rabbit') throw new Error('Unknown subject.');
  // a rabbit is not reset: a new one joins the hutch and is selected
  const r = addBoughtRabbit(trials.colony, { day: trials.colony.day || 1 });
  trials.colony.focus = r.id;
  return r;
}

/**
 * What the trials of the current batch say: every trial of this batch and
 * revision that still agrees with the brew as it would be bottled now,
 * pooled into an estimate per effect (summarize).
 * @param {ReturnType<typeof createTrials>} trials
 * @param {{id:string, rev:number}} batch
 * @param {ArrayLike<number>|null} current effects of what would be bottled (hidden truth)
 */
export function certification(trials, batch, current) {
  /** @type {Record<string, Sample[]>} */
  const samples = {};
  const stale = new Set();
  let changed = false;
  for (const r of trials.records.slice().reverse()) {
    if (r.batchId !== batch.id) continue;
    if (r.rev !== batch.rev) { changed = true; continue; }
    for (const key of r.revealed) {
      if (r.values[key] === undefined) continue;
      const ref = r.tv && r.tv[key] !== undefined ? r.tv[key] : r.values[key];
      if (current && Math.abs(current[EFFECT_INDEX[key]] - ref) > driftTolerance(ref)) { stale.add(key); continue; }
      (samples[key] ||= []).push({ v: r.values[key], r: r.rabbitId || r.subjectId, rec: r.id, e: doseErr(r.ml) });
    }
  }
  for (const k of Object.keys(samples)) stale.delete(k);
  return { ...summarize(samples), samples, stale: [...stale], changed };
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

/** Which subjects cover a set of effects: a rabbit shows them all. @param {string[]} keys */
export function suggestSubjects(keys) {
  return keys.length ? ['rabbit'] : [];
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

