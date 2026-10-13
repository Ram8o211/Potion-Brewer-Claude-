// Developer physics lab: runs named scenarios headlessly and writes PNG
// snapshots + metrics. Usage: node scripts/lab.mjs <scenario> [outDir]
import fs from 'node:fs';
import path from 'node:path';
import { Simulation } from '../src/simulation/world.js';
import { PHASE } from '../src/simulation/constants.js';
import { REF, refLookup } from '../src/materials/reference.js';
import { snapshot } from './lib/snapshot.mjs';

const name = process.argv[2] || 'water';
const out = process.argv[3] || 'lab-out';
fs.mkdirSync(out, { recursive: true });

/** @param {'small'|'medium'|'large'} [size] */
function mk(size = 'small') {
  return new Simulation({ size, lookup: refLookup });
}
function pour(sim, id, amount, x = 0, secondsAfter = 0) {
  sim.emitter.start(REF[id], { x, amount });
  let guard = 0;
  while (sim.emitter.pouring && guard++ < 6000) sim.step();
  run(sim, secondsAfter);
}
function run(sim, seconds) {
  const n = Math.round(seconds * 120);
  for (let k = 0; k < n; k++) sim.step();
}
function stats(sim) {
  const p = sim.p;
  let maxV = 0, meanV = 0, minY = 1e9, maxY = -1e9;
  const byPhase = [0, 0, 0, 0, 0];
  for (let i = 0; i < p.count; i++) {
    const v = Math.hypot(p.vx[i], p.vy[i]);
    maxV = Math.max(maxV, v); meanV += v;
    minY = Math.min(minY, p.y[i]); maxY = Math.max(maxY, p.y[i]);
    byPhase[p.phase[i]]++;
  }
  return { n: p.count, meanV: +(meanV / Math.max(1, p.count)).toFixed(4), maxV: +maxV.toFixed(3), minY: +minY.toFixed(3), maxY: +maxY.toFixed(3), byPhase, bodies: sim.rigid.bodyCount(), stepMs: sim.stats.stepMs };
}
const shot = (sim, tag, mode) => snapshot(sim, path.join(out, `${name}-${tag}.png`), { mode });

const scenarios = {
  water() {
    const sim = mk();
    pour(sim, 'water', 500, 0, 3);
    shot(sim, 'a'); console.log(stats(sim));
    run(sim, 3); shot(sim, 'b'); console.log(stats(sim));
  },
  layers() {
    const sim = mk();
    pour(sim, 'quick', 150, 0, 0.5);
    pour(sim, 'water', 300, 0, 0.5);
    pour(sim, 'oil', 250, 0, 4);
    shot(sim, 'a'); console.log(stats(sim));
    run(sim, 12); shot(sim, 'b'); console.log(stats(sim));
  },
  sand() {
    const sim = mk();
    pour(sim, 'sand', 450, -0.6, 4);
    shot(sim, 'a', 'phase'); console.log(stats(sim));
    run(sim, 4); shot(sim, 'b', 'phase'); console.log(stats(sim));
  },
  dye() {
    const sim = mk();
    pour(sim, 'water', 450, 0, 2);
    pour(sim, 'red', 60, -0.8, 0);
    shot(sim, 'a');
    run(sim, 5); shot(sim, 'b');
    run(sim, 10); shot(sim, 'c');
  },
  sandwater() {
    const sim = mk();
    pour(sim, 'water', 400, 0, 1);
    pour(sim, 'sand', 250, 0.5, 4);
    shot(sim, 'a', 'phase'); console.log(stats(sim));
  },
  dough() {
    const sim = mk();
    pour(sim, 'flour', 260, 0, 0.5);
    pour(sim, 'water', 220, 0.6, 3);
    shot(sim, 'a'); shot(sim, 'a-phase', 'phase'); console.log('before stir', stats(sim));
    // stir in circles for 10 s
    const t = sim.tool; t.type = 'spoon';
    for (let k = 0; k < 1200; k++) {
      const a = k / 120 * 2.4;
      t.setTarget(Math.cos(a) * 0.8, 2.55 + Math.sin(a) * 0.35, true);
      sim.advance(1 / 120, 1, 2);
    }
    t.setTarget(0, 1, false);
    run(sim, 3);
    shot(sim, 'b'); shot(sim, 'b-phase', 'phase'); console.log('after stir', stats(sim));
    run(sim, 6); shot(sim, 'c-phase', 'phase'); console.log('rest', stats(sim));
  },
  freeze() {
    const sim = mk();
    pour(sim, 'water', 450, 0, 1);
    sim.furnace.setting = -1; sim.furnace.minCool = -40; sim.furnace.coolPower = 70;
    for (let s = 0; s < 10; s++) {
      run(sim, 2);
      const st = stats(sim);
      let tmin = 99, tmax = -99, tm = 0; for (let i = 0; i < sim.p.count; i++) { tmin = Math.min(tmin, sim.p.temp[i]); tmax = Math.max(tmax, sim.p.temp[i]); tm += sim.p.temp[i]; }
      console.log('t', (s+1)*2, 'solid', st.byPhase[3], 'bodies', st.bodies, 'T', tmin.toFixed(1), (tm/sim.p.count).toFixed(1), tmax.toFixed(1), 'bottomT', sim.cauldron.bottomTemperature().toFixed(1));
      if (s === 2) { shot(sim, 'mid', 'phase'); shot(sim, 'mid-temp', 'temp'); }
    }
    shot(sim, 'a', 'phase'); shot(sim, 'a-temp', 'temp');
  },
  boil() {
    const sim = mk();
    pour(sim, 'water', 400, 0, 1);
    sim.furnace.setting = 1; sim.furnace.maxFlame = Number(process.env.FLAME || 450);
    const line = (tag) => {
      const st = stats(sim);
      let tm = 0, tg = 0, ng = 0, tl = 0, nl = 0;
      for (let i = 0; i < sim.p.count; i++) { tm += sim.p.temp[i]; if (sim.p.phase[i] === 4) { tg += sim.p.temp[i]; ng++; } else { tl += sim.p.temp[i]; nl++; } }
      console.log(tag, 'liq', st.byPhase[0], 'gas', st.byPhase[4], 'Tliq', (tl / Math.max(1, nl)).toFixed(1), 'Tgas', (tg / Math.max(1, ng)).toFixed(1), 'bottom', sim.cauldron.bottomTemperature().toFixed(0), 'lid', sim.cauldron.lidTemperature().toFixed(1));
    };
    for (let s = 0; s < 12; s++) { run(sim, 5); line('heat t=' + (s + 1) * 5); if (s === 5) { shot(sim, 'heat', 'phase'); shot(sim, 'heat-temp', 'temp'); } }
    sim.furnace.setting = 0;
    for (let s = 0; s < 12; s++) { run(sim, 5); line('off  t=' + (s + 1) * 5); }
    shot(sim, 'b', 'phase');
  },
  timing() {
    const sim = mk('large');
    pour(sim, 'water', 1200, 0, 0);
    pour(sim, 'sand', 400, 0.5, 1);
    const t0 = performance.now();
    run(sim, 2);
    const ms = (performance.now() - t0) / 240;
    console.log('ms/step', ms.toFixed(3), stats(sim));
  },
};
if (!scenarios[name]) { console.error('unknown', Object.keys(scenarios)); process.exit(1); }
scenarios[name]();
