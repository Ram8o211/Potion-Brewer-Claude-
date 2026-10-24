// Recipes as procedures. A brew's result depends on what was done to it —
// which ingredients were in the pot for which steep, whether they were
// ground, how hot it was held and how long, how much was boiled away, how it
// was served — not only on what went in. While the player brews, the lab
// keeps a coarse trace (one sample a second: mean temperature, stirring,
// crushing, the lid, the volume) beside the pour events; when a recipe is
// saved the trace is compressed into ordered operations:
//
//   pour    an ingredient, its millilitres, whole or ground
//   stir    seconds of stirring (or kneading) between other steps
//   crush   seconds with the pestle
//   temp    bring the brew to a temperature and hold it there (s); `loss`
//           the share of the brew boiled away meanwhile (lid open)
//   lid     put the lid on or take it off
//   serve   the temperature at bottling
//   skim, distil   only in recipes saved before v6 (retired tools)
//
// Three questions are kept apart (compareRecipe):
//   formulation  the same ingredients in the same amounts;
//   procedure    prepared the same way where it changes the potion: each
//                ingredient in the pot for the same heat stages and prepared
//                (ground or crushed) the same, the same stages (temperature,
//                hold, boil-down), stirred in after the last addition,
//                served at the same temperature. The order of pours between
//                two stages, the exact seconds and the lid outside a boil do
//                not matter — they do not change the brew;
//   reproduction brewed again and the trials of the new batch agreed with
//                what the recipe recorded (recipeConfidence).
//
// The Brass Homunculus replays these steps in the real cauldron
// (autobrew.js) and says which it cannot do.

/** @typedef {{op:'pour', id:string, ml:number, ground?:boolean} | {op:'stir', s:number} | {op:'crush', s:number} | {op:'temp', T:number, hold:number, stir?:number, loss?:number} | {op:'lid', closed:boolean} | {op:'skim', ml:number} | {op:'distil', ml:number} | {op:'serve', T:number}} Step */

/** Seconds between trace samples. */
export const TRACE_DT = 1;
/** Most samples kept (older halves are thinned out beyond it). */
export const TRACE_MAX = 1200;
/** A hold is a stretch this long (s) within ±HOLD_BAND °C of one level away from room temperature. */
const HOLD_MIN = 6, HOLD_BAND = 4, ROOM = 20;
/** A hold counts as a stage of the procedure from this long (s). */
const STAGE_MIN = 8;
/** Below this share of the brew boiled away, a hold is not a boil-down. */
const LOSS_MIN = 0.04;
/** How far two procedures may differ and still be the same procedure. */
export const SAME = { T: 8, holdRatio: 0.5, loss: 0.08, ml: 5, mlShare: 0.15, serve: 6 };

/**
 * Add one trace sample to a brew log.
 * @param {any[]} log @param {{t:number, T:number, stir:boolean, crush:boolean, lid:boolean, ml?:number}} s
 */
export function traceSample(log, s) {
  let tr = log.find((e) => e.type === 'trace');
  if (!tr) { tr = { type: 'trace', dt: TRACE_DT, s: [] }; log.push(tr); }
  tr.s.push([Math.round(s.t), Math.round(s.T * 10) / 10, s.stir ? 1 : 0, s.crush ? 1 : 0, s.lid ? 1 : 0, ...(s.ml !== undefined ? [Math.round(s.ml)] : [])]);
  if (tr.s.length > TRACE_MAX) {
    // keep every other sample of the older half: long brews stay small
    const half = tr.s.length >> 1;
    tr.s = tr.s.slice(0, half).filter((_, k) => k % 2 === 0).concat(tr.s.slice(half));
  }
  return tr;
}

/**
 * Compress a brew log into ordered steps.
 * @param {any[]} log brew log (lab.js): pour, lid, vial and trace events
 * @param {number} [serveT] temperature at bottling
 * @returns {Step[]}
 */
export function buildProcedure(log, serveT) {
  const tr = log.find((e) => e.type === 'trace');
  const samples = tr ? tr.s : [];
  const dt = tr ? tr.dt : 1;
  /** @type {{t:number, step:Step}[]} */
  const events = [];
  for (const e of log) {
    if (e.type === 'pour') events.push({ t: e.t || 0, step: { op: 'pour', id: e.id, ml: round1(e.ml), ...(e.ground ? { ground: true } : {}) } });
    else if (e.type === 'lid') events.push({ t: e.t || 0, step: { op: 'lid', closed: !!e.closed } });
    else if (e.type === 'skim') events.push({ t: e.t || 0, step: { op: 'skim', ml: round1(e.ml || 0) } });
    else if (e.type === 'distil') events.push({ t: e.t || 0, step: { op: 'distil', ml: round1(e.ml || 0) } });
  }
  // temperature holds (and how much boiled away during each)
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
    const dur = n > 1 ? samples[j - 1][0] - samples[k][0] + dt : 0;
    if (dur >= HOLD_MIN && Math.abs(level - ROOM) >= 6) {
      /** @type {Step} */
      const step = { op: 'temp', T: Math.round(level), hold: Math.round(dur), stir: Math.round((stir / n) * 100) / 100 };
      // volume before the hold (or at its start) against its end, if the trace has it
      const v0 = volumeAt(samples, k), v1 = volumeAt(samples, j - 1);
      if (v0 > 0 && v1 >= 0 && (v0 - v1) / v0 >= LOSS_MIN) /** @type {any} */ (step).loss = Math.round(((v0 - v1) / v0) * 100) / 100;
      events.push({ t: samples[k][0] + 0.5, step });
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
      stir += samples[si][2] * dt;
      crush += samples[si][3] * dt;
      si++;
    }
    // any crushing counts (a few strokes break a whole herb); the replay
    // stops as soon as nothing whole is left, so give it time enough
    if (crush > 0) steps.push({ op: 'crush', s: Math.max(10, Math.round(crush)) });
    if (stir >= 3) steps.push({ op: 'stir', s: Math.round(stir) });
  };
  for (const ev of events) {
    work(ev.t);
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

/** The volume a trace sample recorded (ml), or -1 for samples without one. */
function volumeAt(samples, i) {
  const s = samples[i];
  return s && s.length > 5 ? s[5] : -1;
}

/**
 * What the homunculus cannot do itself in a procedure: it pours, grinds,
 * stirs, crushes, heats, cools, holds, boils down and lifts the lid — but
 * the skimming and distilling of recipes saved before those tools were
 * retired are beyond it.
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

/**
 * Bring a saved recipe up to the current format. Recipes saved before
 * procedures were kept get approximate steps; procedures that skimmed or
 * distilled (retired tools), or boiled with the lid open before the volume
 * was traced, cannot be replayed exactly and are marked approximate too.
 * Ingredients, trial results and counters are kept.
 * @param {any} r
 */
export function migrateRecipe(r) {
  if (!r || typeof r !== 'object') return r;
  if (!Array.isArray(r.steps)) return { ...r, steps: approximateSteps(r), approx: true, approxWhy: 'saved before procedures were kept', brews: r.brews | 0, reproduced: r.reproduced | 0, mismatched: r.mismatched | 0 };
  if (r.approx) return r;
  if (r.steps.some((s) => s.op === 'skim' || s.op === 'distil')) return { ...r, approx: true, approxWhy: 'it skims or distils with tools the guild has retired' };
  let open = false;
  for (const s of r.steps) {
    if (s.op === 'lid') open = !s.closed;
    if (s.op === 'temp' && open && s.T >= 90 && s.loss === undefined) return { ...r, approx: true, approxWhy: 'it boils with the lid open, and how much boiled away was not recorded' };
  }
  return r;
}

/**
 * The hot and cold holds of a procedure.
 * @param {Step[]} steps
 */
export function holds(steps) {
  return steps.filter((s) => s.op === 'temp').map((s) => /** @type {{T:number, hold:number, loss?:number}} */ (s));
}

/**
 * The consequential structure of a procedure: its heat stages in order, and
 * for every ingredient how much went in before each stage (or after the
 * last), whether it was prepared (ground at the pour, or crushed in the pot
 * before the next stage), whether the brew was stirred after its last
 * addition, and the serving temperature.
 * @param {Step[]} steps @param {(id:string)=>boolean} [solid] can it be ground (liquids cannot)
 */
export function procedureShape(steps, solid = () => true) {
  /** @type {{T:number, hold:number, loss:number}[]} */
  const stages = [];
  /** @type {Map<string, {byStage:number[], ground:boolean}>} */
  const ing = new Map();
  /** ingredients poured whole and not yet crushed */
  const whole = new Set();
  let stirredSinceAdd = true, serve = null;
  for (const s of steps) {
    switch (s.op) {
      case 'pour': {
        const e = ing.get(s.id) || { byStage: [], ground: false };
        const k = stages.length;
        e.byStage[k] = (e.byStage[k] || 0) + s.ml;
        if (s.ground) e.ground = true; else if (solid(s.id)) whole.add(s.id);
        ing.set(s.id, e);
        stirredSinceAdd = false;
        break;
      }
      case 'crush':
        for (const id of whole) { const e = ing.get(id); if (e) e.ground = true; }
        whole.clear();
        break;
      case 'stir':
        if (s.s >= 3) stirredSinceAdd = true;
        break;
      case 'temp':
        if (s.hold < STAGE_MIN && !(s.loss >= LOSS_MIN)) break;
        stages.push({ T: s.T, hold: s.hold, loss: s.loss || 0 });
        // a stage held with stirring mixes what went in before it
        if ((s.stir ?? 0.5) >= 0.2) stirredSinceAdd = true;
        break;
      case 'serve':
        serve = s.T;
        break;
    }
  }
  return { stages, ing, stirred: stirredSinceAdd, serve };
}

/**
 * Compare a brew (its parts and procedure so far) with a recipe.
 * @param {any} recipe @param {{id:string, ml:number}[]} parts @param {Step[]} steps
 * @returns {{formulation:boolean, procedure:boolean|null, differences:string[]}}
 *   procedure is null when the recipe's own procedure is only approximate
 */
export function compareRecipe(recipe, parts, steps, lookup = (/** @type {string} */ id) => /** @type {any} */ ({ name: id })) {
  const out = { formulation: false, procedure: /** @type {boolean|null} */ (false), differences: /** @type {string[]} */ ([]) };
  if (!recipe.ingredients || !parts.length) return out;
  const want = new Map();
  for (const i of recipe.ingredients) want.set(i.id, (want.get(i.id) || 0) + i.ml);
  out.formulation = want.size === parts.length && parts.every((x) => want.has(x.id) && Math.abs(/** @type {number} */ (want.get(x.id)) - x.ml) <= SAME.ml);
  if (!out.formulation) return out;
  if (recipe.approx || !Array.isArray(recipe.steps)) { out.procedure = null; return out; }
  const solid = (id) => { const m = lookup(id); return !m || !m.form || m.form === 'solid'; };
  const a = procedureShape(recipe.steps, solid), b = procedureShape(steps, solid);
  const name = (id) => { const m = lookup(id); return m ? m.name : id; };
  const diff = out.differences;
  // the heat stages, one for one
  if (a.stages.length !== b.stages.length) diff.push(`${b.stages.length} heat stage${b.stages.length === 1 ? '' : 's'} instead of ${a.stages.length}`);
  else a.stages.forEach((x, k) => {
    const y = b.stages[k];
    if (Math.abs(x.T - y.T) > SAME.T) diff.push(`stage ${k + 1} at ${y.T}°C instead of ${x.T}°C`);
    else if (y.hold < x.hold * SAME.holdRatio && !(x.loss || y.loss)) diff.push(`stage ${k + 1} held ${y.hold} s instead of ${x.hold} s`);
    if (Math.abs(x.loss - y.loss) > SAME.loss) diff.push(`stage ${k + 1} boiled away ${Math.round(y.loss * 100)} % instead of ${Math.round(x.loss * 100)} %`);
  });
  // each ingredient in the pot for the same stages, prepared the same way
  for (const [id, x] of a.ing) {
    const y = b.ing.get(id);
    if (!y) continue;
    if (x.ground !== y.ground) diff.push(`${name(id)} ${y.ground ? 'ground' : 'left whole'} (the recipe ${x.ground ? 'grinds it' : 'leaves it whole'})`);
    const n = Math.max(x.byStage.length, y.byStage.length);
    for (let k = 0; k < n; k++) {
      const ma = x.byStage[k] || 0, mb = y.byStage[k] || 0;
      if (Math.abs(ma - mb) > Math.max(SAME.ml, SAME.mlShare * Math.max(ma, mb))) {
        diff.push(`${name(id)}: ${Math.round(mb)} ml ${k < a.stages.length ? `before stage ${k + 1}` : 'after the last stage'} instead of ${Math.round(ma)} ml`);
        break;
      }
    }
  }
  if (a.stirred && !b.stirred) diff.push('not stirred after the last addition');
  if (a.serve !== null && b.serve !== null && Math.abs(a.serve - b.serve) > SAME.serve) diff.push(`bottled at ${b.serve}°C instead of ${a.serve}°C`);
  out.procedure = diff.length === 0;
  return out;
}

/**
 * Was a brew prepared the way a recipe says? 'procedure' — the same
 * formulation prepared the same way; 'formulation' — the same ingredients,
 * but a different (or, for an approximate recipe, unknown) preparation;
 * null — different ingredients.
 * @param {any} recipe @param {{id:string, ml:number}[]} parts @param {Step[]} steps @param {(id:string)=>any} [lookup]
 * @returns {'procedure'|'formulation'|null}
 */
export function matchRecipe(recipe, parts, steps, lookup) {
  const c = compareRecipe(recipe, parts, steps, lookup);
  return !c.formulation ? null : c.procedure ? 'procedure' : 'formulation';
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
  tested: 'Tested once, when it was saved. Brew it again the same way and test it to prove it repeats.',
  reproduced: 'Brewed again the same way and the trials agreed: a reliable recipe.',
  unreliable: 'Brewed again the same way and the trials disagreed: something matters that the recipe does not hold.',
};

/**
 * Compare a fresh certification of a batch that follows a recipe's
 * procedure with what the recipe recorded: agree when every verified effect
 * lies within the combined uncertainty (or 3 points). Updates the recipe's
 * counters once per batch. Returns 'agree' | 'differ' | null (nothing to
 * compare yet).
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
    case 'pour': { const m = lookup(s.id); return `Add ${Math.round(s.ml)} ml ${m ? m.name : s.id}${s.ground ? ', then crush it' : ''}`; }
    case 'stir': return `Stir ${s.s} s`;
    case 'crush': return `Crush with the pestle ${s.s} s`;
    case 'temp': return `${s.T > ROOM ? 'Heat' : 'Cool'} to ${s.T}°C and hold ${s.hold} s${s.loss ? `, lid open, until ${Math.round(s.loss * 100)} % has boiled away` : ''}${s.stir && s.stir > 0.4 ? ', stirring' : ''}`;
    case 'lid': return s.closed ? 'Close the lid' : 'Open the lid';
    case 'skim': return `Skim off ${Math.round(s.ml)} ml (a retired tool)`;
    case 'distil': return `Distil off ${Math.round(s.ml)} ml (a retired tool)`;
    case 'serve': return `Bottle at ${s.T}°C`;
  }
  return '';
}

/** @param {number} v */
function round1(v) {
  return Math.round(v * 10) / 10;
}
