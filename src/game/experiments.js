// The experimentation room: the Moon Rabbits of the colony are the only
// test subjects. A mixture's effects are hidden; the way to learn them is to
// give a real dose — drawn from the cauldron tap or split off a sealed
// vial — to a rabbit and read what it does. A rabbit shows every effect, but
// no reading is exact: every dose varies (DOSE_NOISE) and each rabbit feels
// each effect a little more or less than the next (colony.js
// rabbitSensitivity, a small hidden lifelong bias). One reading is a rough
// guess; the estimate is the plain mean and standard deviation of every
// trial. Trials on the same rabbit keep the rest of the colony clean, but
// the effect piles up in that rabbit towards a degeneration threshold
// nobody can see, and that rabbit's own bias stays in the mean; trials on
// different rabbits average the biases out.
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
  rabbitSnap, encodeSnap, stageOf, addBoughtRabbit, STAGE_ERR, rabbitSensitivity, RABBIT_BIAS, maxHealthOf,
} from './colony.js';

/**
 * How unsteady a rabbit's readings are (a factor on the dose noise), from
 * what anyone can see: its age (kits and elders read less steadily than
 * adults) and its health — a rabbit below half of its health shakes, up to
 * half as noisy again near death. Its hidden sensitivity is not in it.
 * @param {any} rabbit @param {number} [day]
 */
export function readingSteadiness(rabbit, day) {
  const stage = STAGE_ERR[stageOf(rabbit, day)] || 1;
  const max = Math.max(1, maxHealthOf(rabbit, day ?? 1));
  const frac = Math.max(0, Math.min(1, (rabbit.health ?? max) / max));
  return stage * (frac < 0.5 ? 1 + (0.5 - frac) : 1);
}

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
  const errK = Math.sqrt(10 / Math.max(1, o.ml)) * readingSteadiness(rabbit, o.day);
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

/** @typedef {{v:number, r:string, rec:string, e?:number, u?:number}} Sample one reading: value, rabbit id, record id, noise factor of its dose (√(10 ml / dose), 1 if absent), its own one-reading uncertainty (record err) */

/** Noise factor of a dose of `ml`. @param {number} ml */
export const doseErr = (ml) => Math.round(Math.sqrt(10 / Math.max(1, Number(ml) || 10)) * 1000) / 1000;

/**
 * How much evidence stands behind an estimate, from weakest to strongest:
 *   preliminary  — a single reading (its spread says nothing yet);
 *   repeated     — several readings, all on one rabbit (that rabbit's own
 *                  bias stays in the mean however often it is tested);
 *   corroborated — readings on two or more rabbits;
 *   certified    — corroborated, at least three readings, and the
 *                  uncertainty of the mean is small.
 */
export const EVIDENCE_LEVELS = ['preliminary', 'repeated', 'corroborated', 'certified'];
export const EVIDENCE_TEXT = {
  preliminary: 'one reading — a rough guess',
  repeated: 'repeated on one rabbit — its own bias is still in it',
  corroborated: 'corroborated on several rabbits',
  certified: 'certified: several rabbits, a narrow margin',
};
/** @param {string} level */
export const evidenceRank = (level) => EVIDENCE_LEVELS.indexOf(level);

/** Weight of the noise the guild expects, against the spread actually seen, when pooling few readings. */
const PRIOR_WEIGHT = 2;

/**
 * Pool readings into an estimate per effect: the mean of the readings, the
 * spread actually seen between them (sample standard deviation, n − 1), and
 * — separately — how uncertain the *mean* is (`unc`, the half-width of a
 * ~95 % margin). The margin uses only what the guild knows publicly: how
 * much a dose of that size on a rabbit of that age varies (each reading's
 * own `u`), blended with the spread seen once there are several readings,
 * and how far one rabbit may feel an effect more or less than another
 * (RABBIT_BIAS) — which repeated tests of one rabbit never average out, and
 * other rabbits do. So one reading is never "±0": it carries the full
 * margin of a single dose. `first` still marks a single reading.
 * @param {Record<string, Sample[]>} samples
 */
export function summarize(samples) {
  /** @type {Record<string, number>} */ const values = {};
  /** @type {Record<string, number>} */ const spread = {};
  /** @type {Record<string, number>} */ const unc = {};
  /** @type {Record<string, string>} */ const level = {};
  /** @type {Record<string, number>} */ const n = {};
  /** @type {Record<string, number>} */ const rabbits = {};
  /** @type {Record<string, string>} */ const records = {};
  /** @type {Record<string, boolean>} */ const first = {};
  /** @type {Record<string, boolean>} */ const unseen = {};
  for (const [key, list] of Object.entries(samples || {})) {
    if (!Array.isArray(list) || !list.length) continue;
    const N = list.length;
    const mean = list.reduce((a, s) => a + s.v, 0) / N;
    const sd = N > 1 ? Math.sqrt(list.reduce((a, s) => a + (s.v - mean) ** 2, 0) / (N - 1)) : 0;
    const R = new Set(list.map((s) => s.r)).size;
    const m = Math.round(mean * 10) / 10;
    values[key] = Math.abs(m) < 0.5 ? 0 : m;
    spread[key] = Math.round(sd * 10) / 10;
    n[key] = N;
    rabbits[key] = R;
    records[key] = list[N - 1].rec;
    first[key] = N === 1;
    unseen[key] = list.every((s) => s.v === 0);
    // expected per-dose noise (without the rabbit's bias), from each reading's own margin
    const bias = RABBIT_BIAS * Math.abs(mean);
    let prior2 = 0;
    for (const s of list) {
      const e = s.e ?? 1;
      const u = s.u ?? Math.sqrt((DOSE_NOISE * e * Math.abs(mean)) ** 2 + (READ_NOISE * e) ** 2 + bias ** 2);
      prior2 += Math.max((READ_NOISE * e * 0.5) ** 2, u * u - bias * bias);
    }
    prior2 /= N;
    const s2 = (PRIOR_WEIGHT * prior2 + (N - 1) * sd * sd) / (PRIOR_WEIGHT + N - 1);
    const se = Math.sqrt(s2 / N + (bias * bias) / R);
    unc[key] = Math.round(1.96 * se * 10) / 10;
    level[key] = N === 1 ? 'preliminary' : R === 1 ? 'repeated' : N >= 3 && unc[key] <= Math.max(2.5, 0.2 * Math.abs(mean)) ? 'certified' : 'corroborated';
  }
  return { values, spread, unc, level, n, rabbits, records, first, unseen };
}

/**
 * What the readings of one effect let the alchemist say — never the truth:
 *   untested      no reading yet;
 *   not-detected  every rabbit showed nothing. That is not proof of absence:
 *                 the effect may still be there below the detection margin
 *                 (`bound`, which narrows with more and larger doses);
 *   detected      seen in one reading: a rough estimate;
 *   repeated      several readings on one rabbit (its bias stays in);
 *   corroborated  readings on several rabbits (certified: also narrow).
 * Against a tolerance — what an order asks of this effect — `within` says
 * whether the whole margin lies on the right side of it: true (reliably
 * met), false (reliably missed) or null (the margin straddles it).
 * @param {ReturnType<typeof summarize>} sum @param {string} key
 * @param {{kind:'min'|'max'|'target'|'limit', target:number, tol?:number}} [need]
 * @returns {{state:string, value:number, bound:number, level:string|null, within:boolean|null}}
 */
export function effectEvidence(sum, key, need) {
  if (!sum || sum.values[key] === undefined) return { state: 'untested', value: 0, bound: Infinity, level: null, within: null };
  const v = sum.values[key], u = sum.unc[key] ?? 0, level = sum.level[key];
  const state = sum.unseen && sum.unseen[key] ? 'not-detected' : level === 'preliminary' ? 'detected' : level === 'repeated' ? 'repeated' : 'corroborated';
  let within = null;
  if (need) {
    const lo = v - u, hi = v + u;
    if (need.kind === 'limit') within = Math.max(Math.abs(lo), Math.abs(hi)) <= need.target ? true : Math.min(Math.abs(lo), Math.abs(hi)) > need.target && Math.sign(lo) === Math.sign(hi) ? false : null;
    else if (need.kind === 'min') within = lo >= need.target ? true : hi < need.target ? false : null;
    else if (need.kind === 'max') within = hi <= need.target ? true : lo > need.target ? false : null;
    else { const t = need.tol || 0; within = Math.abs(v - need.target) + u <= t ? true : Math.abs(v - need.target) - u > t ? false : null; }
  }
  return { state, value: v, bound: u, level, within };
}

/**
 * What the trials say about one requirement of an order, in the player's
 * terms (shared by the counter and the trials room): untested, not detected
 * (with how strong it could still be), a value with its margin — and whether
 * that margin lies reliably inside what the customer asked (✓), outside it
 * (✗) or across it (~). A purity rule is judged on every effect it covers.
 * @param {{key:string, kind:string, target:number, tol?:number, exclude?:string[]}} req
 * @param {ReturnType<typeof summarize>} sum the trials that count (a batch's, or a vial's own)
 * @returns {{evidence:string, within:boolean|null, mark:string, text:string, title:string}}
 */
export function requirementEvidence(req, sum) {
  const mark = (w) => (w === true ? '✓' : w === false ? '✗' : '~');
  const pct = (u) => (u < 10 ? u.toFixed(1) : String(Math.round(u)));
  if (req.key === 'purity') {
    const keys = EFFECT_KEYS.filter((k) => !(req.exclude || []).includes(k));
    const ev = keys.map((k) => ({ k, e: effectEvidence(sum, k, { kind: 'limit', target: req.target }) }));
    const open = ev.filter((x) => x.e.state === 'untested').length;
    if (open) return { evidence: 'untested', within: null, mark: '?', text: `${open} untested`, title: 'Test a dose: one trial reads every effect at once.' };
    const bad = ev.filter((x) => x.e.within === false), unsure = ev.filter((x) => x.e.within === null);
    if (bad.length) return { evidence: 'missed', within: false, mark: '✗', text: bad.map((x) => EFFECTS[EFFECT_INDEX[x.k]].label).join(', '), title: 'Reliably above the limit.' };
    if (unsure.length) return { evidence: 'unsure', within: null, mark: '~', text: `${unsure.length} not ruled out`, title: `Not detected is not proof of absence: ${unsure.map((x) => EFFECTS[EFFECT_INDEX[x.k]].label).join(', ')} could still lie above ${req.target}%. More readings, or larger doses, narrow it.` };
    return { evidence: 'within', within: true, mark: '✓', text: `all below ${req.target}%`, title: 'Every other effect is reliably below the limit.' };
  }
  const need = req.kind === 'target' ? { kind: 'target', target: req.target, tol: req.tol } : { kind: req.kind, target: req.target };
  const e = effectEvidence(sum, req.key, /** @type {any} */ (need));
  if (e.state === 'untested') return { evidence: 'untested', within: null, mark: '?', text: 'untested', title: '' };
  if (e.state === 'not-detected') return { evidence: 'not-detected', within: e.within, mark: mark(e.within), text: `not detected (≤${pct(e.bound)})`, title: 'No rabbit showed it. It could still be there, below the reading noise.' };
  return { evidence: e.state, within: e.within, mark: mark(e.within), text: `${Math.round(e.value)} ±${pct(e.bound)}`, title: e.within === null ? 'The margin of the trials straddles what the customer asked: test again to be sure.' : EVIDENCE_STATE_TEXT[e.state] };
}

/** How each evidence state reads to the player. */
export const EVIDENCE_STATE_TEXT = {
  untested: 'untested',
  'not-detected': 'not detected',
  detected: 'detected once — a rough estimate',
  repeated: 'measured repeatedly on one rabbit',
  corroborated: 'corroborated on several rabbits',
};

/** Add one record's readings to a sample set (newest last). @param {Record<string, Sample[]>} samples @param {any} rec */
export function addSamples(samples, rec) {
  for (const key of rec.revealed || []) {
    if (rec.values[key] === undefined) continue;
    (samples[key] ||= []).push({ v: rec.values[key], r: rec.rabbitId || rec.subjectId, rec: rec.id, e: doseErr(rec.ml), ...(rec.err && rec.err[key] !== undefined ? { u: rec.err[key] } : {}) });
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
  // the steadiness the rabbit had when dosed (before this dose acted on it)
  const errK = Math.sqrt(10 / ctx.ml) * readingSteadiness(st, ctx.day);
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
 * @param {{id:string, rev:number, carried?:{samples:Record<string, Sample[]>, ref?:number[]}}} batch
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
      (samples[key] ||= []).push({ v: r.values[key], r: r.rabbitId || r.subjectId, rec: r.id, e: doseErr(r.ml), ...(r.err && r.err[key] !== undefined ? { u: r.err[key] } : {}) });
    }
  }
  // readings a poured-back bottle brought with it (resumeBatch), checked
  // against what that bottle measured when it went in
  const carried = /** @type {any} */ (batch).carried;
  if (carried && carried.samples) {
    const known = new Set(trials.records.map((r) => r.id));
    for (const [key, list] of Object.entries(carried.samples)) {
      const i = EFFECT_INDEX[key], ref = carried.ref ? carried.ref[i] : undefined;
      if (current && ref !== undefined && Math.abs(current[i] - ref) > driftTolerance(ref)) { stale.add(key); continue; }
      for (const x of /** @type {Sample[]} */ (list)) if (!known.has(x.rec) && !(samples[key] || []).some((y) => y.rec === x.rec)) (samples[key] ||= []).push(x);
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

