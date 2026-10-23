// Gameplay-purpose experiments: the same brewing problem prepared with and
// without each technique, in the real simulation, on several worlds. The
// numbers are the evidence behind docs/GAMEPLAY_PURPOSE_AUDIT.md.
//
//   node scripts/experiments.mjs [seeds=3] [only=a,b,…]
// Results: docs/experiment-results.json (and a summary on stdout)
//
// Every brew uses campaign ingredients (the starting satchel's herbs, the
// well water, lamp oil and spirit), the shop's own furnace and the tap.
// Each comparison reports the wanted and unwanted effects of a 100 ml
// bottle, its volume, the seconds of brewing it took and the coins its
// ingredients cost.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GameState } from '../src/game/state.js';
import { STARTING_EQUIPMENT, capabilities as capabilitiesOf } from '../src/game/equipment.js';
import { tapSelection, measureParticles } from '../src/game/measure.js';
import { EFFECT_INDEX } from '../src/alchemy/effects.js';
import {
  cauldron, run, pour, hold, settleTo, stirFor, boilDown, distil, tap, band, skimTop, drainBottom, fx, worstUnwanted, bandSpread, condensedCount, meanT, SIM, RETIRED_FIRES,
} from './lib/experiment.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SEEDS = Number(process.argv[2] || 3);
const ONLY = process.argv[3] ? process.argv[3].split(',') : null;
const W = (id) => 'wild-' + id;

/** The equipment of a journeyman shop: the starting kit (hearth, mortar, pestle) and the frost rune. */
const KIT = [...STARTING_EQUIPMENT, 'pestle', 'frostrune'];

/** A bottle's summary for the report. */
function summary(sim, wanted, extra = {}) {
  const m = tap(sim, 20);
  const w = worstUnwanted(m, wanted);
  return {
    wanted: Object.fromEntries(wanted.map((k) => [k, Math.round(m.effects[EFFECT_INDEX[k]] * 10) / 10])),
    worstUnwanted: w,
    effects: fx(m),
    brewMl: condensedCount(sim) * SIM.ML_PER_PARTICLE,
    stability: Math.round(m.stability),
    ...extra,
  };
}

/** Ingredient cost in coins (per 100 ml market price; well water is free). */
const cost = (st, parts) => Math.round(parts.reduce((a, [id, n]) => a + (id === st.world.roles.water ? 0 : (n * SIM.ML_PER_PARTICLE / 100) * st.lookup(id).price), 0) * 10) / 10;

const EXPERIMENTS = {
  /** Whole herbs versus ground in the mortar versus crushed in the pot. */
  grinding(st) {
    const out = {};
    for (const mode of ['whole', 'ground', 'pestle']) {
      const sim = cauldron(st, KIT);
      pour(st, sim, st.world.roles.water, 50);
      pour(st, sim, W('silverleaf'), 16, { ground: mode === 'ground' });
      let t = 0;
      if (mode === 'pestle') {
        // twenty seconds of the pestle on the whole leaves
        const tool = sim.tool;
        tool.type = 'pestle';
        for (let k = 0; k < 20 / SIM.DT; k++) {
          let n = 0, sx = 0, sy = 0;
          for (let i = 0; i < sim.p.count; i++) if (sim.p.phase[i] === 3) { n++; sx += sim.p.x[i]; sy += sim.p.y[i]; }
          if (!n) break;
          const ph = k * SIM.DT * 9;
          tool.setTarget(sx / n + Math.sin(ph * 0.6) * 0.35, sy / n + Math.abs(Math.sin(ph)) * 0.3 - 0.05, true);
          tool.beginFrame(); tool.substep(0, 1); sim.step(); t += SIM.DT;
        }
        tool.setTarget(tool.x, tool.y, false);
      }
      t += hold(sim, 62, 22, 'hand');
      t += settleTo(sim, 22, 60, 'hand');
      stirFor(sim, 6, 'hand');
      out[mode] = summary(sim, ['vitality'], { seconds: Math.round(t + 6) });
    }
    return out;
  },

  /** Extraction temperature: inside the steeping window, below it, and an ice-cold herb steeped warm. */
  temperature(st) {
    const out = {};
    for (const [label, herb, T, n] of [['silverleaf 20°C', 'silverleaf', 20, 16], ['silverleaf 62°C', 'silverleaf', 62, 16], ['silverleaf 95°C (past its threshold)', 'silverleaf', 95, 16],
      ['heavy silverleaf 20°C', 'silverleaf', 20, 34], ['heavy silverleaf 35°C', 'silverleaf', 35, 34], ['heavy silverleaf 62°C', 'silverleaf', 62, 34],
      ['heavy frostcap 5°C', 'frostcap', 5, 34], ['heavy frostcap 40°C', 'frostcap', 40, 34],
      ['heartpetal 50°C', 'heartpetal', 50, 24], ['heartpetal 95°C', 'heartpetal', 95, 24]]) {
      const sim = cauldron(st, KIT);
      pour(st, sim, st.world.roles.water, 50);
      pour(st, sim, W(herb), n, { ground: true });
      let t = T === 20 ? (stirFor(sim, 22, 'hand'), 22) : hold(sim, T, 22, 'hand');
      t += settleTo(sim, 20, 90, 'hand');
      stirFor(sim, 4, 'hand');
      out[label] = summary(sim, [herb === 'frostcap' ? 'frost' : herb === 'heartpetal' ? 'love' : 'vitality'], { seconds: Math.round(t + 4) });
    }
    return out;
  },

  /**
   * Mixing decides neutralisation: effects cancel only where the substances
   * meet in the same matter. Silverleaf's frost against Sunthistle's fire,
   * poured on opposite sides, steeped without stirring, then not stirred,
   * stirred by hand, or by the clockwork paddle for the same time.
   */
  mixing(st) {
    const out = {};
    for (const mode of ['none', 'hand', 'clockwork']) {
      const sim = cauldron(st, KIT);
      pour(st, sim, st.world.roles.water, 50);
      pour(st, sim, W('silverleaf'), 12, { ground: true, x: -0.35 });
      pour(st, sim, W('sunthistle'), 7, { ground: true, x: 0.35 });
      let t = hold(sim, 62, 22, 'none');
      t += settleTo(sim, 24, 90, 'none');
      if (mode !== 'none') stirFor(sim, 8, mode);
      out[mode] = summary(sim, ['vitality'], { seconds: Math.round(t + (mode === 'none' ? 0 : 8)), spreadFrost: bandSpread(sim, 'frost'), spreadFire: bandSpread(sim, 'fire') });
    }
    // a cold brew: Ironroot's strength steeped hot, its frost cancelled by an Emberbark tea poured in once cooled
    for (const mode of ['late, unstirred', 'late, hand 6 s', 'late, clockwork 6 s', 'late, hand 20 s']) {
      const sim = cauldron(st, KIT);
      pour(st, sim, st.world.roles.water, 40);
      pour(st, sim, W('ironroot'), 14, { ground: true });
      hold(sim, 92, 22, 'hand');
      settleTo(sim, 24, 90, 'hand');
      pour(st, sim, W('emberbark'), 6, { ground: true, x: 0.4 });
      pour(st, sim, st.world.roles.water, 15, { x: 0.4 });
      const s2 = mode.includes('20') ? 20 : 6;
      if (!mode.includes('unstirred')) stirFor(sim, s2, mode.includes('clockwork') ? 'clockwork' : 'hand');
      run(sim, 3);
      out[mode] = summary(sim, ['strength'], { spreadFrost: bandSpread(sim, 'frost'), spreadFire: bandSpread(sim, 'fire') });
    }
    return out;
  },

  /** Order of addition: the warming herb steeped with the healer, or added after the steep. */
  order(st) {
    const out = {};
    for (const mode of ['together', 'after the steep']) {
      const sim = cauldron(st, KIT);
      pour(st, sim, st.world.roles.water, 50);
      pour(st, sim, W('silverleaf'), 12, { ground: true });
      if (mode === 'together') pour(st, sim, W('sunthistle'), 7, { ground: true });
      let t = hold(sim, 62, 22, 'hand');
      t += settleTo(sim, 24, 90, 'hand');
      if (mode !== 'together') pour(st, sim, W('sunthistle'), 7, { ground: true });
      stirFor(sim, 8, 'hand');
      out[mode] = summary(sim, ['vitality'], { seconds: Math.round(t + 8) });
    }
    // spirit before the heat (it boils at ~70 °C) or once cooled
    for (const mode of ['spirit before heating', 'spirit after cooling']) {
      const sim = cauldron(st, KIT);
      sim.cauldron.lidClosed = false;
      pour(st, sim, st.world.roles.water, 40);
      pour(st, sim, W('silverleaf'), 12, { ground: true });
      if (mode.includes('before')) pour(st, sim, st.world.roles.spirit, 15);
      hold(sim, 80, 22, 'hand');
      settleTo(sim, 24, 90, 'hand');
      if (mode.includes('after')) pour(st, sim, st.world.roles.spirit, 15);
      stirFor(sim, 6, 'hand');
      const m = tap(sim, 20);
      out[mode] = { ...summary(sim, ['vitality']), spiritShare: Math.round((m.composition[st.world.roles.spirit] || 0) * 100) };
    }
    return out;
  },

  /** Dilution and concentration: the same balanced brew, watered down, or boiled down with the lid off. */
  concentration(st) {
    const base = () => {
      const sim = cauldron(st, KIT);
      pour(st, sim, st.world.roles.water, 60);
      pour(st, sim, W('ironroot'), 14, { ground: true });
      pour(st, sim, W('sunthistle'), 6, { ground: true });
      const t = hold(sim, 92, 22, 'hand');
      return { sim, t };
    };
    const out = {};
    {
      const { sim, t } = base();
      settleTo(sim, 24, 90, 'hand'); stirFor(sim, 6, 'hand');
      out.plain = summary(sim, ['strength'], { seconds: Math.round(t + 6) });
    }
    {
      const { sim, t } = base();
      settleTo(sim, 24, 90, 'hand');
      pour(st, sim, st.world.roles.water, 30);
      stirFor(sim, 8, 'hand');
      out['diluted +50 % water'] = summary(sim, ['strength'], { seconds: Math.round(t + 8) });
    }
    {
      const { sim, t } = base();
      const tb = boilDown(sim, 0.3);
      settleTo(sim, 24, 120, 'hand'); stirFor(sim, 6, 'hand');
      out['boiled down 30 %'] = summary(sim, ['strength'], { seconds: Math.round(t + tb + 6) });
    }
    return out;
  },

  /**
   * Separation: a healing brew in water with a layer of lamp oil on top
   * carrying a fiery oil-extract (Dragon Pepper steeped in the oil). Fully
   * mixed versus left to layer; the upper and lower layers; the bottom tap;
   * the upper layer skimmed off; the lower layer drained off.
   */
  separation(st) {
    const out = {};
    const make = () => {
      const sim = cauldron(st, KIT);
      pour(st, sim, st.world.roles.water, 50);
      pour(st, sim, W('silverleaf'), 12, { ground: true });
      pour(st, sim, st.world.roles.oil, 40);
      pour(st, sim, W('dragonpepper'), 10, { ground: true });
      hold(sim, 62, 24, 'hand');
      settleTo(sim, 24, 90, 'hand');
      return sim;
    };
    {
      // the healer steeped in water, then lamp oil poured on cold
      const sim = cauldron(st, KIT);
      pour(st, sim, st.world.roles.water, 50);
      pour(st, sim, W('silverleaf'), 12, { ground: true });
      hold(sim, 62, 22, 'hand');
      settleTo(sim, 24, 90, 'hand');
      pour(st, sim, st.world.roles.oil, 40);
      stirFor(sim, 10, 'clockwork');
      out['water brew + oil, just stirred'] = summary(sim, ['vitality'], { oilShare: oilShare(st, tap(sim, 20)) });
      run(sim, 15);
      out['water brew + oil, settled: bottom tap'] = summary(sim, ['vitality'], { oilShare: oilShare(st, tap(sim, 20)) });
      const top = band(sim, 0, 0.3);
      out['water brew + oil, settled: upper band'] = { effects: fx(top), oilShare: oilShare(st, top) };
    }
    {
      const sim = make();
      stirFor(sim, 10, 'clockwork');
      out['fully mixed (sampled at once)'] = summary(sim, ['vitality'], { oilShare: oilShare(st, tap(sim, 20)) });
    }
    {
      const sim = make();
      stirFor(sim, 4, 'hand');
      run(sim, 15);
      out['layered: bottom tap'] = summary(sim, ['vitality'], { oilShare: oilShare(st, tap(sim, 20)) });
      const top = band(sim, 0, 0.3), bottom = band(sim, 0.7, 1);
      out['layered: upper band'] = { effects: fx(top), oilShare: oilShare(st, top) };
      out['layered: lower band'] = { effects: fx(bottom), oilShare: oilShare(st, bottom) };
      const skimmed = skimTop(sim, 50);
      out['upper layer skimmed off'] = summary(sim, ['vitality'], { removedMl: skimmed * SIM.ML_PER_PARTICLE, oilShare: oilShare(st, tap(sim, 20)) });
    }
    {
      const sim = make();
      stirFor(sim, 4, 'hand');
      run(sim, 15);
      const drained = drainBottom(sim, 55);
      out['lower layer drained, then tapped'] = summary(sim, ['fire'], { drainedMl: drained * SIM.ML_PER_PARTICLE, oilShare: oilShare(st, tap(sim, 20)) });
    }
    return out;
  },

  /**
   * Distillation against plain boiling: a tincture of healing in water with
   * spirit, reduced by a third with the lid open, or distilled under the
   * closed lid with the alembic.
   */
  distillation(st) {
    const out = {};
    const make = () => {
      const sim = cauldron(st, KIT);
      pour(st, sim, st.world.roles.water, 45);
      pour(st, sim, W('silverleaf'), 12, { ground: true });
      pour(st, sim, W('sunthistle'), 7, { ground: true });
      hold(sim, 62, 22, 'hand');
      settleTo(sim, 30, 90, 'hand');
      pour(st, sim, st.world.roles.spirit, 25);
      stirFor(sim, 6, 'hand');
      return sim;
    };
    {
      const sim = make();
      out['not reduced'] = summary(sim, ['vitality'], { spiritShare: spiritShare(st, tap(sim, 20)) });
    }
    {
      const sim = make();
      const t = boilDown(sim, 0.3);
      settleTo(sim, 24, 120, 'hand'); stirFor(sim, 4, 'hand');
      const lost = Object.entries(sim.vented).map(([id, v]) => `${st.lookup(id)?.name || id} ${Math.round(v * SIM.ML_PER_PARTICLE)} ml`).join(', ');
      out['boiled down, lid open'] = summary(sim, ['vitality'], { seconds: Math.round(t), vented: lost, spiritShare: spiritShare(st, tap(sim, 20)) });
    }
    {
      const sim = make();
      const d = distil(sim, 0.3);
      settleTo(sim, 24, 120, 'hand'); stirFor(sim, 4, 'hand');
      const tot = Object.values(d.receiver).reduce((a, b) => a + b, 0) || 1;
      const rec = Object.entries(d.receiver).map(([id, v]) => `${st.lookup(id)?.name || id} ${Math.round((v / tot) * 100)} %`).join(', ');
      const spiritMl = Math.round(((d.receiver[st.world.roles.spirit] || 0)) * SIM.ML_PER_PARTICLE);
      out['distilled, alembic'] = summary(sim, ['vitality'], { seconds: Math.round(d.seconds), receiverMl: d.count * SIM.ML_PER_PARTICLE, receiver: rec, spiritRecoveredMl: spiritMl, spiritValue: Math.round((spiritMl / 100) * st.lookup(st.world.roles.spirit).price * 10) / 10, spiritShare: spiritShare(st, tap(sim, 20)) });
    }
    return out;
  },
};

/** Bottle three 100 ml bottles one after another from the tap. */
function bottles(sim, k = 3) {
  const out = [];
  for (let b = 0; b < k; b++) {
    const sel = tapSelection(sim, 20);
    out.push(fx(measureParticles(sim, sel)));
    for (const i of sel.sort((a, c) => c - a)) sim.removeParticle(i);
  }
  return out;
}

Object.assign(EXPERIMENTS, {
  /**
   * Stirring after a late addition: Saltpetre poured cold onto a hot-steeped
   * Ironroot brew, then three bottles drawn in a row — unstirred, hand
   * stirring, the clockwork paddle — and a cold brew of two powders.
   */
  consistency(st) {
    const out = {};
    for (const mode of ['none', 'hand', 'clockwork']) {
      const sim = cauldron(st, KIT);
      pour(st, sim, st.world.roles.water, 40);
      pour(st, sim, W('ironroot'), 14, { ground: true });
      hold(sim, 92, 22, 'hand');
      settleTo(sim, 24, 90, 'hand');
      pour(st, sim, W('saltpetre'), 8, { x: 0.4 });
      if (mode !== 'none') stirFor(sim, 6, mode); else run(sim, 6);
      run(sim, 2);
      out['late addition, ' + (mode === 'none' ? 'unstirred' : mode + ' 6 s')] = { bottles: bottles(sim, 3) };
    }
    for (const mode of ['none', 'hand 6', 'hand 20', 'clockwork 6']) {
      const sim = cauldron(st, KIT);
      pour(st, sim, st.world.roles.water, 50);
      pour(st, sim, W('mica'), 10, { x: -0.4 });
      pour(st, sim, W('saltpetre'), 8, { x: 0.4 });
      const secs = Number(mode.split(' ')[1] || 6);
      if (mode !== 'none') stirFor(sim, secs, mode.startsWith('clock') ? 'clockwork' : 'hand'); else run(sim, 6);
      run(sim, 2);
      out['cold powders, ' + (mode === 'none' ? 'unstirred' : mode + ' s')] = { bottles: bottles(sim, 3) };
    }
    return out;
  },

  /** Heating and cooling equipment: what each can reach and how fast, on the same brews. */
  thermal(st) {
    const out = {};
    const base = [...STARTING_EQUIPMENT];
    const reach = (eq, setting, secs, solvent, n = 70, herb, fire) => {
      const sim = cauldron(st, eq, fire);
      pour(st, sim, solvent, n);
      if (herb) pour(st, sim, W(herb), 20, { ground: true });
      let t = 0;
      while (t < secs) { sim.furnace.setting = setting; sim.step(); t += SIM.DT; }
      return { T: Math.round(meanT(sim)), ml: condensedCount(sim) * SIM.ML_PER_PARTICLE };
    };
    const until = (eq, T, fire) => {
      const sim = cauldron(st, eq, fire);
      pour(st, sim, st.world.roles.water, 90);
      let t = 0;
      while (meanT(sim) < T && t < 120) { sim.furnace.setting = 1; sim.step(); t += SIM.DT; }
      return Math.round(t * 10) / 10;
    };
    /** @type {[string, {maxFlame:number, heatPower:number}|undefined][]} */
    const fires = [['hearth', undefined], ['bellows (retired)', RETIRED_FIRES.bellows], ['athanor (retired)', RETIRED_FIRES.athanor]];
    for (const [name, fire] of fires) {
      const sim = cauldron(st, base, fire);
      pour(st, sim, st.world.roles.water, 70);
      pour(st, sim, W('ironroot'), 14, { ground: true });
      hold(sim, 92, 8, 'hand');
      out[name] = { 'water 450 ml to 92°C (s)': until(base, 92, fire), 'boil down 30 % (s)': Math.round(boilDown(sim, 0.3, 600)), 'lamp oil after 60 s at full fire': reach(base, 1, 60, st.world.roles.oil, 60, undefined, fire) };
    }
    /** @type {[string, string[]][]} */
    const colds = [['basin', base], ['frost rune', [...base, 'frostrune']], ['glacial sigil', [...base, 'frostrune', 'glacial']]];
    for (const [name, eq] of colds) {
      out[name] = { 'water + Frostcap after 60 s at full cold': reach(eq, -1, 60, st.world.roles.water, 70, 'frostcap'), 'spirit after 60 s at full cold': reach(eq, -1, 60, st.world.roles.spirit, 60) };
      // a cold steep of Frostcap at the coldest the equipment holds
      const sim = cauldron(st, eq);
      pour(st, sim, st.world.roles.water, 50);
      pour(st, sim, W('frostcap'), 34, { ground: true });
      hold(sim, Math.max(4, capabilitiesOf(eq).minCool + 8), 22, 'hand', 120);
      settleTo(sim, 20, 90, 'hand');
      stirFor(sim, 4, 'hand');
      out[name]['frostcap cold steep'] = summary(sim, ['frost']);
    }
    return out;
  },
});

const oilShare = (st, m) => Math.round(((m.composition[st.world.roles.oil] || 0) + (m.composition['wild-p-dragonfire-oil'] || 0)) * 100);
const spiritShare = (st, m) => Math.round((m.composition[st.world.roles.spirit] || 0) * 100);

const results = {};
for (const [name, fn] of Object.entries(EXPERIMENTS)) {
  if (ONLY && !ONLY.includes(name)) continue;
  results[name] = [];
  for (let k = 0; k < SEEDS; k++) {
    const st = GameState.create(`experiment-${k}`, { tutorial: false });
    const t0 = Date.now();
    const r = fn(st);
    results[name].push({ seed: `experiment-${k}`, ...r });
    console.log(`\n== ${name} · experiment-${k} (${((Date.now() - t0) / 1000).toFixed(1)} s)`);
    for (const [label, v] of Object.entries(r)) console.log(`  ${label.padEnd(34)} ${JSON.stringify(v)}`);
  }
}
void cost; void meanT;
const file = path.join(ROOT, 'docs', 'experiment-results.json');
let prev = {};
try { prev = JSON.parse(fs.readFileSync(file, 'utf8')).results || {}; } catch { /* first run */ }
fs.writeFileSync(file, JSON.stringify({ date: new Date().toISOString(), seeds: SEEDS, results: { ...prev, ...results } }, null, 1) + '\n');
console.log('\nWrote docs/experiment-results.json');
