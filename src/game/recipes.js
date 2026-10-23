// Recipes as procedures. A brew's result depends on what was done to it —
// the order of pouring, grinding, how long it steeped and at what heat, when
// the lid was on — not only on what went in. While the player brews, the
// lab keeps a coarse trace (one sample a second: mean temperature, stirring,
// crushing, the lid) beside the pour events; when a recipe is saved the
// trace is compressed into ordered operations:
//
//   pour    an ingredient, its millilitres, whole or ground
//   stir    seconds of stirring (or kneading) between other steps
//   crush   seconds with the pestle
//   temp    bring the brew to a temperature and hold it there (s)
//   lid     put the lid on or take it off
//   skim    matter skimmed off (the homunculus cannot do this)
//   distil  vapour drawn off with the alembic (likewise)
//   serve   the temperature at bottling
//
// The Brass Homunculus replays exactly these steps in the real cauldron
// (autobrew.js). A recipe also keeps how well it is known: the evidence of
// the trials behind it, and how often it was brewed again and the trials of
// the new batch agreed with it (reproduced) or not.

/** @typedef {{op:'pour', id:string, ml:number, ground?:boolean} | {op:'stir', s:number} | {op:'crush', s:number} | {op:'temp', T:number, hold:number, stir?:number} | {op:'lid', closed:boolean} | {op:'skim', ml:number} | {op:'distil', ml:number} | {op:'serve', T:number}} Step */

/** Seconds between trace samples. */
export const TRACE_DT = 1;
/** Most samples kept (older halves are thinned out beyond it). */
export const TRACE_MAX = 1200;
/** A hold is a stretch this long (s) within ±HOLD_BAND °C of one level away from room temperature. */
const HOLD_MIN = 6, HOLD_BAND = 4, ROOM = 20;

/**
 * Add one trace sample to a brew log.
 * @param {any[]} log @param {{t:number, T:number, stir:boolean, crush:boolean, lid:boolean}} s
 */
export function traceSample(log, s) {
  let tr = log.find((e) => e.type === 'trace');
  if (!tr) { tr = { type: 'trace', dt: TRACE_DT, s: [] }; log.push(tr); }
  tr.s.push([Math.round(s.t), Math.round(s.T * 10) / 10, s.stir ? 1 : 0, s.crush ? 1 : 0, s.lid ? 1 : 0]);
  if (tr.s.length > TRACE_MAX) {
    // keep every other sample of the older half: long brews stay small
    const half = tr.s.length >> 1;
    tr.s = tr.s.slice(0, half).filter((_, k) => k % 2 === 0).concat(tr.s.slice(half));
  }
  return tr;
}

/**
 * Compress a brew log into ordered steps.
 * @param {any[]} log brew log (lab.js): pour, lid, skim, distil, vial and trace events
 * @param {number} [serveT] temperature at bottling
 * @returns {Step[]}
 */
export function buildProcedure(log, serveT) {
  const tr = log.find((e) => e.type === 'trace');
  const samples = tr ? tr.s : [];
  /** @type {{t:number, step:Step}[]} */
  const events = [];
  for (const e of log) {
    if (e.type === 'pour') events.push({ t: e.t || 0, step: { op: 'pour', id: e.id, ml: round1(e.ml), ...(e.ground ? { ground: true } : {}) } });
    else if (e.type === 'lid') events.push({ t: e.t || 0, step: { op: 'lid', closed: !!e.closed } });
    else if (e.type === 'skim') events.push({ t: e.t || 0, step: { op: 'skim', ml: round1(e.ml || 0) } });
    else if (e.type === 'distil') events.push({ t: e.t || 0, step: { op: 'distil', ml: round1(e.ml || 0) } });
  }
  // temperature holds
  let k = 0;
  while (k < samples.length) {
    let j = k, sum = 0, n = 0, stir = 0;
    while (j < samples.length) {
      const mean = n ? sum / n : samples[j][1];
      if (Math.abs(samples[j][1] - mean) > HOLD_BAND) break;
      sum += samples[j][1]; n++; stir += samples[j][2];
      j++;
    }
    const level = n ? sum / n : ROOM;
    const dur = n > 1 ? samples[j - 1][0] - samples[k][0] + (tr ? tr.dt : 1) : 0;
    if (dur >= HOLD_MIN && Math.abs(level - ROOM) >= 6) {
      events.push({ t: samples[k][0] + 0.5, step: { op: 'temp', T: Math.round(level), hold: Math.round(dur), stir: Math.round((stir / n) * 100) / 100 } });
    }
    k = Math.max(j, k + 1);
  }
  events.sort((a, b) => a.t - b.t);
  // stirring and crushing between the steps
  /** @type {Step[]} */
  const steps = [];
  let si = 0;
  const work = (until) => {
    let stir = 0, crush = 0;
    while (si < samples.length && samples[si][0] < until) {
      stir += samples[si][2] * (tr ? tr.dt : 1);
      crush += samples[si][3] * (tr ? tr.dt : 1);
      si++;
    }
    if (crush >= 2) steps.push({ op: 'crush', s: Math.round(crush) });
    if (stir >= 3) steps.push({ op: 'stir', s: Math.round(stir) });
  };
  for (const ev of events) {
    if (ev.step.op === 'temp') work(ev.t);
    else work(ev.t);
    // a hold's own stirring is part of it, not a separate step
    if (ev.step.op === 'temp') {
      const end = ev.t + ev.step.hold;
      while (si < samples.length && samples[si][0] < end) si++;
    }
    const last = steps[steps.length - 1];
    if (ev.step.op === 'pour' && last && last.op === 'pour' && last.id === ev.step.id && !!last.ground === !!ev.step.ground) last.ml = round1(last.ml + ev.step.ml);
    else if (ev.step.op === 'lid' && last && last.op === 'lid') last.closed = ev.step.closed;
    else steps.push(ev.step);
  }
  work(Infinity);
  if (serveT !== undefined) steps.push({ op: 'serve', T: Math.round(serveT) });
  return steps;
}

/**
 * What the homunculus cannot do itself in a procedure (it pours, stirs,
 * crushes, heats, cools and lifts the lid — but neither skims nor distils).
 * @param {Step[]} steps
 */
export function procedureLimits(steps) {
  const out = [];
  if (steps.some((s) => s.op === 'skim')) out.push('skimming');
  if (steps.some((s) => s.op === 'distil')) out.push('distilling');
  return out;
}

/**
 * Approximate steps for a recipe saved before procedures were recorded:
 * pour everything, stir, crush, the hottest and coldest temperatures held
 * briefly, then serve. Marked approximate.
 * @param {any} r
 */
export function approximateSteps(r) {
  /** @type {Step[]} */
  const steps = (r.ingredients || []).map((i) => /** @type {Step} */ ({ op: 'pour', id: i.id, ml: i.ml, ...(i.ground ? { ground: true } : {}) }));
  if (r.crushed) steps.push({ op: 'crush', s: 15 });
  steps.push({ op: 'stir', s: (r.stirSeconds || 0) > 12 ? 14 : 7 });
  if ((r.maxTemp ?? 20) > 26) steps.push({ op: 'temp', T: Math.round(r.maxTemp), hold: 12, stir: 0.5 });
  if ((r.minTemp ?? 20) < 14) steps.push({ op: 'temp', T: Math.round(r.minTemp), hold: 12, stir: 0.5 });
  steps.push({ op: 'serve', T: Math.round(r.serveTemp ?? 20) });
  return steps;
}

/** Bring a saved recipe up to the procedure format. @param {any} r */
export function migrateRecipe(r) {
  if (!r || typeof r !== 'object') return r;
  if (Array.isArray(r.steps)) return r;
  return { ...r, steps: approximateSteps(r), approx: true, brews: r.brews | 0, reproduced: r.reproduced | 0, mismatched: r.mismatched | 0 };
}

/**
 * The hot and cold holds of a procedure (for comparing two brews).
 * @param {Step[]} steps
 */
export function holds(steps) {
  return steps.filter((s) => s.op === 'temp').map((s) => /** @type {{T:number, hold:number}} */ (s));
}

/**
 * Was a brew (its procedure so far) prepared the way a recipe says? The
 * same ingredients within 5 ml each, and every recorded heating or cooling
 * stage matched within 10 °C (an approximate recipe matches on ingredients).
 * @param {any} recipe @param {{id:string, ml:number}[]} parts @param {Step[]} steps
 * @returns {'exact'|'ingredients'|null}
 */
export function matchRecipe(recipe, parts, steps) {
  if (!recipe.ingredients || !parts.length) return null;
  const want = new Map();
  for (const i of recipe.ingredients) want.set(i.id, (want.get(i.id) || 0) + i.ml);
  if (want.size !== parts.length) return null;
  if (!parts.every((x) => want.has(x.id) && Math.abs(/** @type {number} */ (want.get(x.id)) - x.ml) <= 5)) return null;
  if (recipe.approx || !recipe.steps) return 'ingredients';
  const a = holds(recipe.steps).filter((s) => s.hold >= 8), b = holds(steps).filter((s) => s.hold >= 8);
  const hot = (l) => l.filter((s) => s.T > ROOM), cold = (l) => l.filter((s) => s.T < ROOM);
  const close = (x, y) => x.length === y.length && x.every((s, i) => Math.abs(s.T - y[i].T) <= 10);
  return close(hot(a), hot(b)) && close(cold(a), cold(b)) ? 'exact' : 'ingredients';
}

/**
 * How well a recipe is known: 'untested' (no trial behind it), 'tested'
 * (verified once, when it was saved), 'reproduced' (brewed again and the
 * new trials agreed), 'unreliable' (brewed again and they did not).
 * @param {any} r
 */
export function recipeConfidence(r) {
  if (!r.verified || !Object.keys(r.verified).length) return 'untested';
  if ((r.mismatched | 0) > (r.reproduced | 0)) return 'unreliable';
  if ((r.reproduced | 0) >= 1) return 'reproduced';
  return 'tested';
}

export const CONFIDENCE_TEXT = {
  untested: 'Never tested: what it does is only the guild theory.',
  tested: 'Tested once, when it was saved. Brew it again and test it to prove it repeats.',
  reproduced: 'Brewed again and the trials agreed: a reliable recipe.',
  unreliable: 'Brewed again and the trials disagreed: something in the procedure matters that the recipe does not hold.',
};

/**
 * Compare a fresh certification of a batch that follows a recipe with what
 * the recipe recorded: agree when every verified effect lies within the
 * combined uncertainty (or 3 points). Updates the recipe's counters once per
 * batch. Returns 'agree' | 'differ' | null (nothing to compare yet).
 * @param {any} recipe @param {{values:Record<string, number>, unc?:Record<string, number>}} cert @param {string} batchKey
 */
export function checkReproduction(recipe, cert, batchKey) {
  const keys = Object.keys(recipe.verified || {}).filter((k) => cert.values[k] !== undefined);
  if (!keys.length) return null;
  recipe.checked = recipe.checked || [];
  if (recipe.checked.includes(batchKey)) return null;
  const agree = keys.every((k) => {
    const tol = Math.max(3, (cert.unc ? cert.unc[k] || 0 : 0) + ((recipe.evidence && recipe.evidence[k] && recipe.evidence[k].u) || 0));
    return Math.abs(cert.values[k] - recipe.verified[k]) <= tol;
  });
  recipe.checked.push(batchKey);
  if (recipe.checked.length > 12) recipe.checked.shift();
  if (agree) recipe.reproduced = (recipe.reproduced | 0) + 1;
  else recipe.mismatched = (recipe.mismatched | 0) + 1;
  return agree ? 'agree' : 'differ';
}

/** One line per step, for the recipe book. @param {Step} s @param {(id:string)=>any} lookup */
export function describeStep(s, lookup) {
  switch (s.op) {
    case 'pour': { const m = lookup(s.id); return `Add ${Math.round(s.ml)} ml ${m ? m.name : s.id}${s.ground ? ', ground' : ''}`; }
    case 'stir': return `Stir ${s.s} s`;
    case 'crush': return `Crush with the pestle ${s.s} s`;
    case 'temp': return `${s.T > ROOM ? 'Heat' : 'Cool'} to ${s.T}°C and hold ${s.hold} s${s.stir && s.stir > 0.4 ? ', stirring' : ''}`;
    case 'lid': return s.closed ? 'Close the lid' : 'Open the lid';
    case 'skim': return `Skim off ${Math.round(s.ml)} ml`;
    case 'distil': return `Distil off ${Math.round(s.ml)} ml`;
    case 'serve': return `Bottle at ${s.T}°C`;
  }
  return '';
}

/** @param {number} v */
function round1(v) {
  return Math.round(v * 10) / 10;
}
