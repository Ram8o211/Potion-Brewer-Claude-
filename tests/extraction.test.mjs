// Continuous extraction, combustion, frozen solvents, distillation,
// emulsification and the aging cellar (alchemy/extraction.js,
// reactions/extraction.js, game/cellar.js), in the pure model and in the
// real simulation.
import test from 'node:test';
import assert from 'node:assert/strict';
import { generateWorld, makeLookup } from '../src/materials/generator.js';
import { Simulation } from '../src/simulation/world.js';
import { PHASE } from '../src/simulation/constants.js';
import { MAX_SPECIES } from '../src/reactions/species.js';
import { AutoBrewer, spiritShare } from '../src/game/autobrew.js';
import { extractionReport } from '../src/reactions/extraction.js';
import { speciesProfile, yieldAt, rateAt, extractOver, emulsionStability, extractedParts, SOLVENT_CAPACITY, COMBUST_RANGE } from '../src/alchemy/extraction.js';
import { SPECIES } from '../src/materials/catalog.js';
import { measureParticles, tapSelection } from '../src/game/measure.js';
import { predictPlan } from '../src/game/predict.js';
import { GameState, SAVE_VERSION, runeFind } from '../src/game/state.js';
import { advanceVessel, chargeVessel, chargeLimit, potionNet, vesselReport, RUNE_LIFE, CELLAR_STEP, CELLAR_T, DEG_PER_POINT } from '../src/game/cellar.js';
import { EFFECT_INDEX, theoryOf } from '../src/alchemy/effects.js';
import { generateCommission, ALCOHOL_FREE_LIMIT } from '../src/game/commissions.js';
import { evaluatePotion } from '../src/game/evaluate.js';
import { Rng } from '../src/core/rng.js';
import { makeVialFromComposition } from '../src/game/vial.js';

const world = generateWorld('extract-tests');
const lookup = makeLookup(world);
const R = world.roles;
const HYDRO = 'wild-sp-silverleaf', LIPO = 'wild-sp-mossback-bark';

function sim() {
  const s = new Simulation({ size: 'small', lookup, reactions: world.reactions, laws: [] });
  Object.assign(s.furnace, { maxFlame: 340, heatPower: 3.5, minCool: -70, coolPower: 9 });
  return s;
}
/** Pour, crush and stir like the homunculus, then hand back a brewer to keep controlling the furnace. */
function brew(s, ingredients, { crush = true } = {}) {
  const ab = new AutoBrewer(s, { ingredients, heatTo: 20, coolTo: 20, serveTemp: 20, crush, knead: true, hold: 1 }, lookup);
  let g = 0;
  while (!['steep', 'heat', 'hold', 'serve', 'done'].includes(ab.stage) && g++ < 120 * 120) { ab.tick(); s.step(); }
  return ab;
}
function holdAt(s, ab, T, sec) { for (let k = 0; k < Math.round(sec * 120); k++) { ab.control(T); s.step(); } }
function stirAt(s, ab, T, sec) { for (let k = 0; k < Math.round(sec * 120); k++) { ab.control(T); if (k % 360 < 200) ab.stir(0.8); else ab.release(); s.step(); } ab.release(); }
const share = (s, id) => (extractionReport(s).items.find((x) => x.id === id) || { share: 0 }).share;
/** volume of every species in the cauldron, by id */
const totals = (s) => s.inventory();

test('every species has a solvent class, a rate, a ceiling falling with heat, and a combustion threshold above water’s boil', () => {
  const water = lookup(R.water), oil = lookup(R.oil), spirit = lookup(R.spirit);
  assert.ok(spirit.melt < oil.melt && oil.melt < water.melt, 'spirit melts below oil, oil below water');
  let lipo = 0, belowOil = 0;
  for (const s of SPECIES) {
    const p = speciesProfile(s.key);
    assert.ok(p && (p.cls === 'hydro' || p.cls === 'lipo'), `${s.key} has a class`);
    if (p.cls === 'lipo') lipo++;
    assert.ok(rateAt(p, 60) > rateAt(p, 20) * 2 && rateAt(p, 20) > rateAt(p, -10), `${s.key}: hotter is faster`);
    assert.ok(yieldAt(p, 90) < yieldAt(p, 20) && yieldAt(p, 20) < yieldAt(p, 0), `${s.key}: hotter, less can come out`);
    // full extraction only below water's freezing point (hydro: in spirit) / in chilled oil (lipo), never below the solvent's melting point
    assert.ok(yieldAt(p, water.melt + 1) < 0.999, `${s.key}: water never draws everything out`);
    const full = p.Tfull;
    if (p.cls === 'hydro') assert.ok(full < water.melt && full > spirit.melt, `${s.key}: full extraction only in spirit`);
    else assert.ok(full > oil.melt && full < 9, `${s.key}: full extraction in chilled oil, below the basin's reach`);
    assert.ok(p.combust > water.boil && p.combust >= COMBUST_RANGE[0] && p.combust <= COMBUST_RANGE[1], `${s.key}: burns above water's boil`);
    if (p.combust < oil.boil) belowOil++;
  }
  assert.ok(lipo >= 20 && lipo <= 70, `a fair share is oil-soluble (${lipo})`);
  assert.ok(belowOil >= 20, `many herbs burn below oil's boiling point (${belowOil})`);
  for (const id of [R.water, R.oil, R.spirit]) assert.equal(lookup(id).flammability, 0, `${lookup(id).name} never burns`);
});

test('the pure model: progress toward the ceiling, never back; cooling extracts more', () => {
  const p = speciesProfile('silverleaf');
  const hot = extractOver(p, 90, 600);
  assert.ok(Math.abs(hot - yieldAt(p, 90)) < 1e-3, 'given time, the hot ceiling is reached');
  assert.equal(extractOver(p, 95, 600, hot), hot, 'heating never takes extracted magic back');
  const cooled = extractOver(p, 20, 600, hot);
  assert.ok(cooled > hot + 0.1, `cooling lets more come out (${hot.toFixed(2)} → ${cooled.toFixed(2)})`);
  assert.ok(extractOver(p, 20, 5) < extractOver(p, 60, 5), 'in a short time, heat gets more out');
  assert.ok(extractOver(p, -12, 30000) > 0.95, 'cold spirit draws out (nearly) everything, given hours');
});

test('calibration: about 60 % at room temperature, slowly; heat is quicker but caps lower', () => {
  const ys = SPECIES.map((s) => yieldAt(speciesProfile(s.key), 20));
  const mean = ys.reduce((a, b) => a + b, 0) / ys.length;
  assert.ok(Math.abs(mean - 0.6) < 0.04, `the room-temperature ceiling averages about 60 % (${mean.toFixed(2)})`);
  assert.ok(Math.min(...ys) >= 0.45 && Math.max(...ys) <= 0.72, 'each species its own, within reason');
  assert.ok(new Set(ys.map((y) => y.toFixed(2))).size > 10, 'it varies from species to species');
  for (const s of SPECIES) {
    const p = speciesProfile(s.key);
    // at room temperature a ground, stirred herb needs over a minute per e-fold
    assert.ok(1 / rateAt(p, 20) > 60, `${s.key}: slow at room temperature`);
    // a minute's steep: warm gets more out than room temperature, but less than a long room-temperature steep
    assert.ok(extractOver(p, 60, 60) > extractOver(p, 20, 60) + 0.05, `${s.key}: warmth speeds it up`);
    assert.ok(yieldAt(p, 60) < yieldAt(p, 20) - 0.04 && yieldAt(p, 90) < yieldAt(p, 20) - 0.1, `${s.key}: and lowers the ceiling`);
  }
});

test('in the cauldron: matter and magic are conserved; extract appears volume for volume, within the solvent’s capacity', () => {
  const s = sim();
  const ab = brew(s, [{ id: R.water, n: 40 }, { id: HYDRO, n: 14 }]);
  stirAt(s, ab, 60, 60);
  const inv = totals(s);
  const raw = inv[HYDRO] || 0, ext = inv['wild-p-sp-silverleaf'] || 0, water = inv[R.water] || 0;
  assert.ok(Math.abs(raw + ext - 14) < 1e-3, `ingredient volume conserved (${(raw + ext).toFixed(4)})`);
  assert.ok(Math.abs(water - 40) < 0.5, 'the solvent is untouched (a little steam aside)');
  assert.ok(ext > 0.7 * 14 * yieldAt(speciesProfile('silverleaf'), 60), `most of it is extracted (${ext.toFixed(2)})`);
  // the extract carries exactly the ingredient's effects per volume: the potion is ingredient × extracted share, diluted
  const m = measureParticles(s, tapSelection(s, 40));
  const expect = (ext / (raw + ext + water)) * lookup(HYDRO).effects.vitality;
  assert.ok(Math.abs(m.effects[EFFECT_INDEX.vitality] - expect) < expect * 0.25, `no artificial potency (${m.effects[EFFECT_INDEX.vitality].toFixed(1)} ≈ ${expect.toFixed(1)})`);
  // too little solvent: at most its own volume of extract
  const t = sim();
  const ab2 = brew(t, [{ id: R.water, n: 8 }, { id: HYDRO, n: 30 }]);
  stirAt(t, ab2, 60, 60);
  const e2 = totals(t)['wild-p-sp-silverleaf'] || 0;
  assert.ok(e2 <= 8 * (SOLVENT_CAPACITY / (1 - SOLVENT_CAPACITY)) + 0.05, `a solvent holds at most its own volume of extract (${e2.toFixed(2)} ≤ 8)`);
});

test('the wrong solvent extracts nothing; oil-soluble magic needs oil', () => {
  const a = sim();
  const ab = brew(a, [{ id: R.water, n: 40 }, { id: LIPO, n: 12 }]);
  stirAt(a, ab, 60, 40);
  assert.ok(share(a, LIPO) < 0.01, 'water takes no oil-soluble magic');
  const b = sim();
  const ab2 = brew(b, [{ id: R.oil, n: 40 }, { id: LIPO, n: 12 }]);
  stirAt(b, ab2, 60, 40);
  assert.ok(share(b, LIPO) > 0.3, `oil does (${share(b, LIPO).toFixed(2)})`);
  const c = sim();
  const ab3 = brew(c, [{ id: R.oil, n: 40 }, { id: HYDRO, n: 12 }]);
  stirAt(c, ab3, 60, 40);
  assert.ok(share(c, HYDRO) < 0.01, 'oil takes no water-soluble magic');
});

test('grinding and stirring speed extraction; heat is quick but caps lower', () => {
  const whole = sim(); const ab = brew(whole, [{ id: R.water, n: 40 }, { id: HYDRO, n: 12 }], { crush: false }); stirAt(whole, ab, 20, 30);
  const ground = sim(); const ab2 = brew(ground, [{ id: R.water, n: 40 }, { id: HYDRO, n: 12 }]); stirAt(ground, ab2, 20, 30);
  assert.ok(share(whole, HYDRO) < share(ground, HYDRO) * 0.5, `whole ${share(whole, HYDRO).toFixed(2)} vs ground ${share(ground, HYDRO).toFixed(2)}`);
  // hot steep: capped at the hot ceiling; then cooling recovers more
  const hot = sim(); const ab3 = brew(hot, [{ id: R.water, n: 40 }]);
  holdAt(hot, ab3, 90, 25);
  hot.emitter.start(lookup(HYDRO), { x: 0, amount: 12, ground: true });
  let g = 0; while (hot.emitter.pouring && g++ < 9000) hot.step();
  stirAt(hot, ab3, 90, 20);
  const atHot = share(hot, HYDRO), cap = yieldAt(speciesProfile('silverleaf'), 90);
  // (the herbs go in cold and take a moment to come up to heat, so a little more than the hot ceiling comes out)
  assert.ok(atHot <= cap + 0.06 && atHot < yieldAt(speciesProfile('silverleaf'), 20) - 0.08, `hot extraction stops near its ceiling (${atHot.toFixed(2)} ≈ ${cap.toFixed(2)})`);
  stirAt(hot, ab3, 20, 150);
  assert.ok(share(hot, HYDRO) > atHot + 0.06, `cooling draws more out, slowly (${atHot.toFixed(2)} → ${share(hot, HYDRO).toFixed(2)})`);
});

test('a frozen solvent extracts nothing; cold spirit extracts the most', () => {
  const ice = sim(); const ab = brew(ice, [{ id: R.water, n: 45 }]);
  holdAt(ice, ab, -25, 80);
  let solid = 0; for (let i = 0; i < ice.p.count; i++) if (ice.p.phase[i] === PHASE.SOLID) solid++;
  assert.ok(solid > ice.p.count * 0.6, 'the water froze');
  ice.emitter.start(lookup(HYDRO), { x: 0, amount: 10, ground: true });
  let g = 0; while (ice.emitter.pouring && g++ < 9000) { ab.control(-25); ice.step(); }
  holdAt(ice, ab, -25, 25);
  assert.ok(share(ice, HYDRO) < 0.02, `frozen water: nothing (${share(ice, HYDRO).toFixed(3)})`);
  const cold = sim(); const ab2 = brew(cold, [{ id: R.spirit, n: 40 }, { id: HYDRO, n: 12 }]);
  stirAt(cold, ab2, -12, 600);
  const warm = sim(); const ab3 = brew(warm, [{ id: R.water, n: 40 }, { id: HYDRO, n: 12 }]);
  stirAt(warm, ab3, 20, 600);
  assert.ok(share(cold, HYDRO) > share(warm, HYDRO) + 0.08, `cold spirit ${share(cold, HYDRO).toFixed(2)} beats room-temperature water ${share(warm, HYDRO).toFixed(2)}`);
});

test('combustion: only unextracted matter burns, above its own threshold; dissolved magic survives', () => {
  const s = sim();
  const ab = brew(s, [{ id: R.oil, n: 45 }, { id: LIPO, n: 12 }], { crush: false });
  const thr = lookup(LIPO).extraction.combust;
  holdAt(s, ab, thr - 30, 25);
  assert.equal(s.extraction.charred, 0, 'below its threshold nothing burns');
  const before = totals(s)['wild-p-sp-mossback-bark'] || 0;
  assert.ok(before > 0.5, 'some was extracted');
  holdAt(s, ab, Math.min(thr + 40, 300), 60);
  const inv = totals(s);
  assert.ok(s.extraction.charred > 1 || (inv['char-inert'] || 0) > 1, 'the rest burnt to char');
  assert.ok((inv[LIPO] || 0) < 0.2, 'no unextracted matter is left');
  assert.ok((inv['wild-p-sp-mossback-bark'] || 0) >= before - 1e-6, 'the extract is thermally stable');
  assert.ok(s.extraction.charSeen[LIPO] >= thr - 1 && s.extraction.charSeen[LIPO] <= thr + 20, 'the burning temperature is observed near the threshold');
  assert.ok((inv[R.oil] || 0) > 44.5, 'the oil itself never burns');
  // the shop learns it only by seeing it
  const st = GameState.create('burn-learn', { tutorial: false });
  assert.equal((st.knowledge[LIPO] || {}).burnsAt, undefined, 'unknown at first');
  const ev = st.noteBurning(s.extraction.safeSeen, s.extraction.charSeen);
  assert.ok(ev.some((e) => e.id === LIPO) && st.knowledge[LIPO].burnsAt >= thr - 1, 'seen burning, it is in the journal');
});

test('distillation: the still head draws spirit off first, the magic stays, the spirit can be jarred again', () => {
  const s = sim();
  const ab = brew(s, [{ id: R.spirit, n: 40 }, { id: HYDRO, n: 12 }]);
  stirAt(s, ab, 20, 15);
  s.emitter.start(lookup(R.water), { x: 0.3, amount: 45 });
  let g = 0; while (s.emitter.pouring && g++ < 9000) s.step();
  const ext0 = totals(s)['wild-p-sp-silverleaf'];
  s.condenser.on = true; s.cauldron.lidClosed = true;
  const wb = lookup(R.water).boil;
  holdAt(s, ab, wb - 9, 70);
  holdAt(s, ab, wb - 2, 50);
  const rec = s.condenser.receiver;
  assert.ok((rec[R.spirit] || 0) > 30, `most spirit went to the receiver (${(rec[R.spirit] || 0).toFixed(1)} of 40)`);
  assert.ok((rec[R.water] || 0) < (rec[R.spirit] || 0) * 0.4, `spirit before water (${(rec[R.water] || 0).toFixed(1)} water)`);
  assert.ok((rec['wild-p-sp-silverleaf'] || 0) < 0.12 && (rec[HYDRO] || 0) < 0.12, `no magic boils over, beyond a trace carried by the vapour (${(rec['wild-p-sp-silverleaf'] || 0).toFixed(3)} extract, ${(rec[HYDRO] || 0).toFixed(3)} herb)`);
  assert.ok(totals(s)['wild-p-sp-silverleaf'] >= ext0 - 0.05, 'the extract stays in the pot');
  assert.ok(spiritShare(s) < 0.03, `the potion is nearly alcohol-free (${(spiritShare(s) * 100).toFixed(1)}%)`);
  const m = measureParticles(s, tapSelection(s, 30));
  assert.ok(m.alcohol < 3, `measured spirit ${m.alcohol}%`);
  const st = GameState.create('jar-it', { tutorial: false });
  const s0 = st.stock(R.spirit);
  const got = st.collectDistillate(rec);
  assert.ok(got[R.spirit] > 100 && st.stock(R.spirit) === s0 + got[R.spirit], 'the recovered spirit goes back on the shelf');
});

test('emulsification: an emulsifier in the right proportion binds oil and water extracts; extraction in an emulsion is slow', () => {
  const st = (n) => {
    const s = sim();
    const ab = brew(s, [{ id: R.water, n: 50 }, { id: HYDRO, n: 10 }]);
    stirAt(s, ab, 20, 20);
    s.emitter.start(lookup(R.oil), { x: -0.3, amount: 22 });
    let g = 0; while (s.emitter.pouring && g++ < 9000) s.step();
    if (n) { s.emitter.start(lookup(R.emulsifier), { x: 0.3, amount: n }); g = 0; while (s.emitter.pouring && g++ < 9000) s.step(); }
    stirAt(s, ab, 20, 30);
    // let it stand
    holdAt(s, ab, 20, 15);
    return s;
  };
  // the pure rule
  assert.ok(emulsionStability(60, 25, 2) > 0.9, 'enough emulsifier, the oil under two fifths: stable');
  assert.equal(emulsionStability(60, 25, 0.3), 0, 'too little emulsifier: it separates');
  assert.equal(emulsionStability(50, 50, 10), 0, 'equal parts break the emulsion');
  const plain = st(0), bound = st(3);
  const mixed = (s) => { let k = 0, n = 0; const sp = s.species; for (let i = 0; i < s.p.count; i++) { if (s.p.phase[i] === PHASE.GAS) continue; n++; let h = 0, l = 0; for (let q = 0; q < sp.count; q++) { const f = s.p.comp[i * MAX_SPECIES + q]; if (sp.solvCls[q] === 1 || sp.extCls[q] === 1) h += f; if (sp.solvCls[q] === 2 || sp.extCls[q] === 2) l += f; } if (h > 0.1 && l > 0.1) k++; } return k / n; };
  assert.ok(mixed(plain) < 0.1, `without emulsifier oil and water stand apart (${mixed(plain).toFixed(2)})`);
  assert.ok(mixed(bound) > 0.4, `with it they are one potion (${mixed(bound).toFixed(2)})`);
  // a herb extracted in an emulsion: much slower than in plain water
  const fresh = (emul) => {
    const s = sim();
    const ab = brew(s, emul ? [{ id: R.water, n: 45 }, { id: R.oil, n: 18 }, { id: R.emulsifier, n: 3 }] : [{ id: R.water, n: 45 }]);
    stirAt(s, ab, 20, emul ? 30 : 2);
    s.emitter.start(lookup(HYDRO), { x: 0, amount: 8, ground: true });
    let g = 0; while (s.emitter.pouring && g++ < 9000) s.step();
    stirAt(s, ab, 20, 8);
    return share(s, HYDRO);
  };
  const inWater = fresh(false), inEmulsion = fresh(true);
  assert.ok(inEmulsion < inWater * 0.6, `extraction in an emulsion is severely reduced (${inEmulsion.toFixed(2)} vs ${inWater.toFixed(2)})`);
});

test('the predictor follows the simulation’s extraction', () => {
  const plan = { ingredients: [{ id: R.water, n: 40 }, { id: HYDRO, n: 12 }], heatTo: 20, coolTo: 20, serveTemp: 20, crush: true, knead: true, steep: { T: 20, hold: 30 }, hold: 1 };
  const pred = predictPlan(world, lookup, plan);
  const s = sim();
  const ab = new AutoBrewer(s, plan, lookup);
  let g = 0; while (!ab.done && g++ < 120 * 400) { ab.tick(); s.step(); }
  assert.ok(Math.abs(share(s, HYDRO) - pred.extracted[HYDRO]) < 0.08, `simulated ${share(s, HYDRO).toFixed(2)} ≈ predicted ${pred.extracted[HYDRO].toFixed(2)}`);
});

// ------------------------------------------------------------------ aging on the potion shelves

function cellarShop(seed) {
  const st = GameState.create(seed, { tutorial: false });
  st.equipment.push('cellar');
  return st;
}
const T0 = 1_700_000_000_000, HOUR = 3600_000;

/** A shelved bottle of this composition, set aging where it stands (it may overfill the shelves). */
function ageBottle(st, comp, T, now) {
  const v = makeVialFromComposition(comp, T, { batchId: 'test-' + st.bottles.length, day: st.day }, st.lookup, st.world.laws || []);
  st.bottles.push(v);
  const r = st.startAging(v.id, now);
  assert.ok(r.ok, r.reason);
  return v;
}
/** @param {any} v */
const total = (v) => Object.values(v.comp).reduce((a, b) => a + Number(b), 0);

test('an aging bottle goes on extracting, conserves matter, and freezes or burns when its charge takes it too far', () => {
  const st = cellarShop('cellar-1');
  st.tickCellar(T0);
  assert.equal(st.agingSlots, 2, 'the cellar ages two bottles at once');
  const b0 = ageBottle(st, { [R.spirit]: 150, [HYDRO]: 50 }, 20, T0);
  const v = b0.aging;
  const tot0 = total(v);
  assert.ok(Math.abs(tot0 - 200) < 0.01, 'the whole bottle ages');
  st.tickCellar(T0 + 4 * HOUR);
  const rep = vesselReport(v, st.lookup);
  const it = rep.items.find((x) => x.id === HYDRO);
  assert.equal(Math.round(rep.T), CELLAR_T, 'uncharged, it settles at cellar temperature');
  assert.ok(it.share > it.ceiling - 0.03, `four hours reach the cellar's ceiling (${it.share.toFixed(2)} of ${it.ceiling.toFixed(2)})`);
  assert.ok(Math.abs(total(v) - tot0) < 1e-6, 'matter is conserved');
  // a very strong Frost charge takes it below the spirit's freezing point: extraction stops there
  const frost = new Array(15).fill(0); frost[EFFECT_INDEX.frost] = 40;
  assert.ok(chargeVessel(v, frost, 400, T0 + 4 * HOUR).ok);
  st.tickCellar(T0 + 9 * HOUR);
  const r2 = vesselReport(v, st.lookup);
  assert.ok(r2.T <= r2.freezing + 1e-6 && r2.frozen, `it cooled until it froze (${Math.round(r2.T)}°C, freezes at ${Math.round(r2.freezing)})`);
  const frozenShare = r2.items.find((x) => x.id === HYDRO).share;
  st.tickCellar(T0 + 10 * HOUR);
  assert.equal(vesselReport(v, st.lookup).items.find((x) => x.id === HYDRO).share, frozenShare, 'frozen, nothing more comes out');
  // a strong Fire charge takes an oil bottle up until its herbs burn
  const w = ageBottle(st, { [R.oil]: 120, [LIPO]: 40 }, 20, T0).aging;
  const fire = new Array(15).fill(0); fire[EFFECT_INDEX.fire] = 60;
  assert.ok(chargeVessel(w, fire, 500, T0).ok);
  assert.ok(chargeLimit(w.charge.net) > lookup(LIPO).extraction.combust, 'the charge can take it past the burning point');
  st.tickCellar(T0 + 6 * HOUR);
  const r3 = vesselReport(w, st.lookup);
  assert.ok(r3.char > 1, `the unextracted matter burnt (${r3.char.toFixed(1)} ml of char)`);
  assert.ok(r3.items[0].ext > 1, 'what was extracted survived the heat');
  // every aging place is taken: a third bottle waits
  const third = makeVialFromComposition({ [R.water]: 50 }, 20, { batchId: 'x', day: 1 }, st.lookup, []);
  st.bottles.push(third);
  assert.equal(st.startAging(third.id, T0).ok, false, 'two places, two bottles');
});

test('charges: the potion’s strength sets the limit, it is used up as it works, then the bottle returns', () => {
  const st = cellarShop('cellar-2');
  st.tickCellar(T0);
  const v = ageBottle(st, { [R.spirit]: 160, [HYDRO]: 40 }, 20, T0).aging;
  const fx = (fire, frost, other = 0) => { const e = new Array(15).fill(0); e[EFFECT_INDEX.fire] = fire; e[EFFECT_INDEX.frost] = frost; e[EFFECT_INDEX.vitality] = other; return e; };
  assert.equal(potionNet(fx(0, 0, 30)), 0, 'a potion of neither does nothing');
  assert.equal(chargeVessel(v, fx(0, 0, 30), 50, T0).ok, false);
  assert.equal(potionNet(fx(10, 8.5)), 0, 'Fire and Frost cancel; too little left');
  // other effects do not matter; the stronger the Frost, the colder it can go
  assert.ok(chargeLimit(potionNet(fx(0, 12, 25))) < chargeLimit(potionNet(fx(0, 6))) && chargeLimit(potionNet(fx(0, 6))) < CELLAR_T);
  assert.ok(chargeLimit(potionNet(fx(20, 0))) > chargeLimit(potionNet(fx(8, 0))) && chargeLimit(potionNet(fx(8, 0))) > CELLAR_T);
  assert.ok(chargeVessel(v, fx(0, 6, 25), 60, T0).ok, 'a Frost potion, with other effects, charges it');
  const lim = chargeLimit(v.charge.net);
  assert.equal(lim, CELLAR_T - 6 * DEG_PER_POINT);
  // the temperature falls by itself toward the limit, and the charge is used up as it works
  st.tickCellar(T0 + 0.5 * HOUR);
  const mid = v.T, ml1 = v.charge.ml;
  assert.ok(mid < CELLAR_T - 3 && mid > lim, `falling (${mid.toFixed(1)}°C)`);
  assert.ok(ml1 < 60, `the potion is being used up (${ml1.toFixed(1)} ml left)`);
  st.tickCellar(T0 + 1.5 * HOUR);
  assert.ok(v.T < mid && v.T >= lim - 1e-6, `colder still, never past the limit (${v.T.toFixed(1)})`);
  assert.ok(!v.charge || v.charge.ml < ml1, 'still being used up');
  // until it is spent: then the bottle returns to cellar temperature
  st.tickCellar(T0 + 30 * HOUR);
  assert.equal(v.charge, null, 'the charge is spent');
  assert.ok(Math.abs(v.T - CELLAR_T) < 0.5, `back at cellar temperature (${v.T.toFixed(1)})`);
  // a stronger potion holds the same temperature on less of it
  const use = (frost) => { const s2 = cellarShop('cellar-2b'); s2.tickCellar(T0); const b = ageBottle(s2, { [R.water]: 200 }, 12, T0); const w = b.aging; chargeVessel(w, fx(0, frost), 100, T0); s2.cellar.runes = 5; assert.ok(s2.runeBottle(b.id, CELLAR_T - 20, T0).ok); return w; };
  const weak = use(6), strong = use(12);
  for (const sv of [weak, strong]) advanceVessel(sv, lookup, T0 + 3 * HOUR);
  assert.ok(strong.charge.ml > weak.charge.ml, `stronger lasts longer (${strong.charge.ml.toFixed(1)} vs ${weak.charge.ml.toFixed(1)} ml)`);
});

test('runes lock the temperature on the way to the limit, and wear out with use', () => {
  const st = cellarShop('cellar-3r');
  st.reputation = 60;
  st.tickCellar(T0);
  const b = ageBottle(st, { [R.water]: 150, [HYDRO]: 40 }, CELLAR_T, T0);
  const v = b.aging;
  const fire = new Array(15).fill(0); fire[EFFECT_INDEX.fire] = 20;
  assert.equal(st.runeBottle(b.id, 50, T0).ok, false, 'no rune in hand');
  st.coins = 100;
  assert.ok(st.buyRune().ok && st.cellar.runes === 1, 'a rune bought at the market');
  assert.ok(st.runeBottle(b.id, 50, T0).ok && st.cellar.runes === 0);
  st.tickCellar(T0 + HOUR);
  assert.ok(Math.abs(v.T - CELLAR_T) < 0.5, 'without a charge the rune does nothing');
  assert.ok(chargeVessel(v, fire, 300, T0 + HOUR).ok);
  assert.ok(chargeLimit(v.charge.net) > 50);
  st.tickCellar(T0 + 4 * HOUR);
  assert.ok(Math.abs(v.T - 50) < 1e-6, `locked at 50°C (${v.T.toFixed(2)})`);
  assert.ok(vesselReport(v, st.lookup).rune.locked);
  // moving the target uses no new rune
  assert.ok(st.runeBottle(b.id, 45, T0 + 4 * HOUR).ok && st.cellar.runes === 0, 'moved without a new rune');
  st.tickCellar(T0 + 6 * HOUR);
  assert.ok(Math.abs(v.T - 45) < 1e-6, `back down to 45°C and held (${v.T.toFixed(2)})`);
  // a target beyond the charge's reach never locks
  st.cellar.runes = 1;
  assert.ok(st.runeBottle(b.id, 200, T0 + 6 * HOUR).ok);
  assert.equal(vesselReport(v, st.lookup).rune.holds, false, 'beyond the limit: it cannot lock');
  // it wears out with the time it is set on the bottle
  assert.ok(st.runeBottle(b.id, 45, T0 + 6 * HOUR).ok);
  const left = v.rune.life;
  st.tickCellar(T0 + 7 * HOUR);
  assert.ok(Math.abs(left - v.rune.life - 3600) < CELLAR_STEP + 1, 'an hour of use, an hour of wear');
  st.tickCellar(T0 + 6 * HOUR + RUNE_LIFE * 1000 + HOUR);
  assert.equal(v.rune, null, 'the rune has worn out');
  // runes turn up underground: about as often as their chance, and a reload never rerolls one
  let hits = 0;
  for (let n = 0; n < 3000; n++) if (runeFind('rune-dig', 'netherwood-3', n * 10, 0.14)) hits++;
  assert.ok(hits > 300 && hits < 560, `about one harvest in seven under the Netherwood (${hits}/3000)`);
  assert.equal(runeFind('rune-dig', 'd1', 120, 0.5), runeFind('rune-dig', 'd1', 120, 0.5), 'deterministic');
});

test('the Fire/Frost slot takes only the chosen amount of another shelved bottle, and starts the aging', () => {
  const st = cellarShop('cellar-bottle-charge');
  st.tickCellar(T0);
  const aged = makeVialFromComposition({ [R.water]: 100, [HYDRO]: 20 }, 20, { batchId: 'aged', day: 1 }, st.lookup, []);
  st.bottles.push(aged);
  // a Fire potion on the shelf
  const fireHerb = SPECIES.find((s) => s.fx && s.fx.fire >= 20 && !(s.fx.frost > 0));
  assert.ok(fireHerb, 'a fiery herb exists');
  const id = 'wild-p-sp-' + fireHerb.key;
  assert.ok(st.lookup(id), 'its extract');
  const b = makeVialFromComposition({ [R.water]: 40, [id]: 60 }, 20, { batchId: 'fire', day: 1 }, st.lookup, []);
  st.bottles.push(b);
  assert.ok(potionNet(b.m.effects) > 0, 'a Fire potion');
  assert.equal(st.chargeBottle(aged.id, aged.id, 20, T0).ok, false, 'not with itself');
  const ml0 = b.ml;
  const r = st.chargeBottle(aged.id, b.id, 20, T0);
  assert.ok(r.ok, r.reason);
  assert.equal(r.ml, 20);
  assert.equal(st.bottles.find((x) => x.id === b.id).ml, ml0 - 20, 'the rest stays in the bottle');
  assert.ok(aged.aging, 'loading the slot set the bottle aging');
  assert.equal(aged.aging.charge.ml, 20);
  // an aging bottle cannot warm another
  assert.equal(st.chargeBottle(b.id, aged.id, 10, T0).ok, false);
  // the whole rest of the Fire bottle: the emptied bottle leaves the shelf
  assert.ok(st.chargeBottle(aged.id, b.id, undefined, T0).ok);
  assert.ok(!st.bottles.some((x) => x.id === b.id), 'emptied, it leaves the shelf');
});

test('aging is deterministic and persists offline: one jump equals many ticks, and a save carries it', () => {
  const mk = () => {
    const st = cellarShop('cellar-3'); st.tickCellar(T0);
    const b = ageBottle(st, { [R.water]: 100, [R.oil]: 30, [HYDRO]: 30, [LIPO]: 15 }, 15, T0);
    const fire = new Array(15).fill(0); fire[EFFECT_INDEX.fire] = 9;
    chargeVessel(b.aging, fire, 80, T0);
    st.cellar.runes = 1; st.runeBottle(b.id, 35, T0);
    return st;
  };
  const a = mk(), b = mk();
  a.tickCellar(T0 + 9 * HOUR + 1234);
  for (let t = T0; t <= T0 + 9 * HOUR + 1234; t += 7_777) b.tickCellar(t);
  b.tickCellar(T0 + 9 * HOUR + 1234);
  const va = a.bottles[0].aging, vb = b.bottles[0].aging;
  assert.ok(Math.abs(va.T - vb.T) < 1e-9, 'same temperature');
  assert.ok(Math.abs((va.charge ? va.charge.ml : 0) - (vb.charge ? vb.charge.ml : 0)) < 1e-6, 'same charge left');
  for (const id of Object.keys(va.comp)) assert.ok(Math.abs(va.comp[id] - vb.comp[id]) < 1e-9, `same ${id}`);
  // a save closed for a day comes back advanced by that day
  const save = JSON.parse(JSON.stringify(a.toJSON()));
  const back = GameState.fromJSON(save);
  back.tickCellar(T0 + 33 * HOUR + 1234);
  a.tickCellar(T0 + 33 * HOUR + 1234);
  assert.ok(Math.abs(back.bottles[0].aging.T - a.bottles[0].aging.T) < 1e-9, 'the saved bottle ages offline exactly as the live one');
  // fixed steps: advancing by less than one step changes nothing but the carry
  const v = mk().bottles[0].aging;
  const before = JSON.stringify(v.comp);
  advanceVessel(v, lookup, T0 + (CELLAR_STEP - 1) * 1000);
  assert.equal(JSON.stringify(v.comp), before);
});

test('an aging bottle is unsealed in its place, as a fresh bottle of what it has become', () => {
  const st = cellarShop('cellar-4');
  st.tickCellar(T0);
  const b = ageBottle(st, { [R.water]: 120, [HYDRO]: 40 }, 20, T0);
  const before = b.m.effects[EFFECT_INDEX.vitality];
  st.tickCellar(T0 + HOUR);
  const n0 = st.bottles.length;
  const r = st.finishAging(b.id, T0 + HOUR);
  assert.ok(r.ok && st.bottles.length === n0, 'unsealed in place');
  assert.equal(st.bottles[0], r.vial);
  assert.equal(r.vial.ml, 160);
  assert.ok(!r.vial.aging, 'no longer aging');
  assert.notEqual(r.vial.batchId, b.batchId, 'a new, untested batch');
  assert.ok(r.vial.m.effects[EFFECT_INDEX.vitality] > before + 1, `it carries the magic drawn out while it aged (${before.toFixed(1)} → ${r.vial.m.effects[EFFECT_INDEX.vitality].toFixed(1)})`);
  // taken down to the counter, an aging bottle is unsealed first
  const c = ageBottle(st, { [R.water]: 60, [HYDRO]: 20 }, 20, T0 + HOUR);
  const t = st.takeBottle(c.id);
  assert.ok(t.ok && st.vial && !st.vial.aging, 'the counter gets what it has become');
});

test('save migration to v9: an old cellar vessel’s brew comes back as an aging bottle, its rune in hand', () => {
  const st = cellarShop('migrate-9');
  const raw = JSON.parse(JSON.stringify(st.toJSON()));
  raw.version = 8;
  raw.cellar = { runes: 1, vessels: [
    { id: 0, comp: { [R.water]: 100, [HYDRO]: 30 }, T: 30, charge: { ml: 40, net: 6 }, rune: { target: 35, life: 1000 }, t: T0, carry: 0, log: [], name: 'old brew' },
    { id: 1, comp: {}, T: 12, charge: null, rune: { target: 20, life: 500 }, t: T0, carry: 0, log: [] },
  ] };
  raw.equipment = [...raw.equipment, 'stirrer'];
  const coins = raw.coins;
  const back = GameState.fromJSON(raw);
  assert.equal(back.version, SAVE_VERSION);
  const aged = back.bottles.find((b) => b.aging);
  assert.ok(aged, 'the brew is on the potion shelves, aging');
  assert.ok(Math.abs(total(aged.aging) - 130) < 0.01, 'with its matter');
  assert.equal(aged.aging.charge.net, 6, 'and its charge');
  assert.equal(aged.aging.rune.target, 35, 'and its rune');
  assert.equal(back.cellar.vessels.length, 0, 'no vessels any more');
  assert.equal(back.cellar.runes, 2, 'the empty vessel’s rune is back in hand');
  assert.ok(!back.has('stirrer') && back.coins >= coins + 110 - 1e-6, 'the Clockwork Stirrer is refunded');
});

test('save migration to v8: an older save gains a cellar, keeps its matter, and its world gains the new materials', () => {
  const st = GameState.create('migrate-8', { tutorial: false });
  const raw = JSON.parse(JSON.stringify(st.toJSON()));
  raw.version = 7;
  delete raw.cellar;
  // an older world: the old fixed-window extraction reactions, no emulsifier
  raw.world.reactions.push({ id: 'rw_extract_sp_silverleaf', name: 'old', kind: 'decompose', a: HYDRO, b: null, ra: 1, rb: 0, products: [{ id: 'wild-p-sp-silverleaf', frac: 1 }], minT: 40, maxT: 80, rate: 0.1, heat: 0, stir: 0 });
  raw.world.materials = raw.world.materials.filter((m) => m.id !== raw.world.roles.emulsifier);
  delete raw.world.roles.emulsifier;
  for (const m of raw.world.materials) if (m.id.startsWith('wild-sp-')) { delete m.extraction; m.fxv = 5; }
  const back = GameState.fromJSON(raw);
  assert.equal(back.version, SAVE_VERSION);
  assert.ok(back.cellar && Number.isFinite(back.cellar.runes), 'a cellar (its runes)');
  assert.ok(!back.world.reactions.some((r) => /^rw_extract_sp_/.test(r.id)), 'the fixed-window steeping reactions are retired');
  assert.ok(back.lookup(HYDRO).extraction, 'its herbs have extraction profiles');
  assert.ok(back.world.roles.emulsifier && back.canBuy(back.world.roles.emulsifier).ok, 'the neutral emulsifier is for sale');
  assert.ok(back.journal['note:extraction'], 'the journal explains the change');
});

test('the whole loop for an alcohol-free order: cold spirit steep, distillation, bottle, sale, the spirit jarred, the rest laid down', () => {
  let st = null, com = null;
  for (let k = 0; k < 12 && !com; k++) {
    st = GameState.create(`sober-loop-${k}`, { tutorial: false });
    st.reputation = 60;
    st.coins = 300;
    st.stats.served = 10;
    st.equipment.push('kit', 'frostrune', 'condenser', 'cellar');
    for (const id of st.gatherableSet()) if (['common', 'uncommon'].includes(st.lookup(id).wild.rarity)) st.inventory[id] = st.cap.storage;
    const c = generateCommission(st.commissionContext(), new Rng(`sl${k}`), { tier: 1, techniques: ['sober'] });
    if (c && c.techniques.includes('sober')) com = c;
  }
  assert.ok(st && com, 'an alcohol-free order');
  st.current = com;
  const cap = st.cap;
  const s = new Simulation({ size: cap.size, lookup: st.lookup, reactions: st.world.reactions, laws: st.world.laws });
  Object.assign(s.furnace, { maxFlame: cap.maxFlame, heatPower: cap.heatPower, minCool: cap.minCool, coolPower: cap.coolPower });
  const ab = new AutoBrewer(s, com.reference, st.lookup);
  let g = 0;
  while (!ab.done && g++ < 120 * 1500) { ab.tick(); s.step(); }
  assert.ok(!ab.failed, 'the homunculus finished the plan');
  const sel = tapSelection(s, com.bottleN);
  const m = measureParticles(s, sel);
  const ev = evaluatePotion(com, m);
  assert.ok(m.alcohol <= ALCOHOL_FREE_LIMIT, `alcohol-free (${m.alcohol}% spirit)`);
  assert.ok(ev.quality >= 0.9, `the order is met (quality ${ev.quality.toFixed(2)})`);
  const coins0 = st.coins;
  st.completeSale(ev, m);
  assert.ok(st.coins > coins0, 'paid');
  // the receiver's spirit goes back on the shelf
  const sp0 = st.stock(st.world.roles.spirit);
  const got = st.collectDistillate(s.condenser.receiver);
  assert.ok((got[st.world.roles.spirit] || 0) > 50 && st.stock(st.world.roles.spirit) > sp0, `spirit recovered (${got[st.world.roles.spirit]} ml)`);
  // what is left in the cauldron is laid down in the cellar
  for (const i of sel.slice().sort((a, b) => b - a)) s.removeParticle(i);
  /** @type {Record<string, number>} */
  const rest = {};
  for (const [id, v] of Object.entries(s.inventory())) rest[id] = v * 5;
  if (Object.keys(rest).length) assert.ok(ageBottle(st, rest, 20, T0).aging, 'the rest is set aging');
});

test('the guild theory counts only what is already dissolved', () => {
  const parts = [{ id: R.water, ml: 100 }, { id: HYDRO, ml: 50 }];
  const none = theoryOf(extractedParts(parts, { [R.water]: 20, [HYDRO]: 10 }, lookup), lookup);
  const half = theoryOf(extractedParts(parts, { [R.water]: 20, [HYDRO]: 5, 'wild-p-sp-silverleaf': 5 }, lookup), lookup);
  const all = theoryOf(parts, lookup);
  const v = EFFECT_INDEX.vitality;
  assert.equal(none[v], 0, 'nothing dissolved, nothing expected');
  assert.ok(Math.abs(half[v] - all[v] / 2) < 0.2, `half dissolved, half the effect (${half[v].toFixed(1)} of ${all[v].toFixed(1)})`);
});

test('old runes lie buried underground in the wilds: each cache is dug once, and a new generation buries new ones', () => {
  const st = GameState.create('rune-caches', { tutorial: false });
  const caches = st.runeCaches('netherwood');
  assert.equal(caches.length, 2, 'two in the Netherwood');
  assert.equal(st.runeCaches('meadow').length, 0, 'none in the meadow');
  assert.deepEqual(st.runeCaches('netherwood'), caches, 'the same every time');
  const n0 = st.cellar.runes;
  assert.ok(st.digRune(caches[0].id).ok);
  assert.equal(st.cellar.runes, n0 + 1, 'a rune for the cellar');
  assert.equal(st.digRune(caches[0].id).ok, false, 'dug once only');
  assert.equal(st.digRune('netherwood:nowhere:9').ok, false, 'nothing where nothing was buried');
  // it is saved
  const back = GameState.fromJSON(JSON.parse(JSON.stringify(st.toJSON())));
  assert.ok(back.runeCaches('netherwood').find((c) => c.id === caches[0].id).dug);
  // regenerating the biome buries new caches
  st.regen.coins = 5;
  if (!st.regen.unlocked.includes('netherwood')) st.regen.unlocked.push('netherwood');
  const r = st.regenerate('netherwood');
  assert.ok(r.ok, r.reason);
  assert.ok(st.runeCaches('netherwood').every((c) => !c.dug && !caches.some((o) => o.id === c.id)), 'new caches, none dug');
});
