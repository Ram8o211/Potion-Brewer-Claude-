// Performance benchmarks — measured, not estimated.
//
//   node scripts/bench.mjs            physics (Node) + browser frame timing
//   node scripts/bench.mjs --physics  physics only
//   node scripts/bench.mjs --browser  browser only (builds dist/ if needed)
//
// Physics: mean wall-clock time of one 1/120 s simulation step for typical
// cauldron contents. Browser: frame intervals and per-frame work (physics +
// rendering) read from the game's own instrumentation, in headless Chromium
// at desktop size and in phone emulation with 4× CPU throttling (a stand-in
// for a mid-range phone — not a measurement on a physical device).
// Results are written to docs/perf-results.json.

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { Simulation } from '../src/simulation/world.js';
import { REF, refLookup } from '../src/materials/reference.js';
import { generateWorld, makeLookup } from '../src/materials/generator.js';
import { generateCommission } from '../src/game/commissions.js';
import { capabilities, EQUIPMENT } from '../src/game/equipment.js';
import { runPlanHeadless } from '../src/game/autobrew.js';
import { Rng } from '../src/core/rng.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = new Set(process.argv.slice(2));
const doPhysics = !args.has('--browser') || args.has('--physics');
const doBrowser = !args.has('--physics') || args.has('--browser');
const out = { date: new Date().toISOString(), machine: { cpus: os.cpus()[0]?.model, cores: os.cpus().length, node: process.version, platform: `${os.platform()} ${os.arch()}` } };

// ------------------------------------------------------------------ physics
function pourAll(sim, id, n, x = 0) {
  sim.emitter.start(REF[id], { x, amount: n, rate: 600 });
  let g = 0;
  while (sim.emitter.pouring && g++ < 20000) sim.step();
}
function timeSteps(sim, seconds) {
  const n = Math.round(seconds * 120);
  const t0 = performance.now();
  for (let k = 0; k < n; k++) sim.step();
  return (performance.now() - t0) / n;
}

function physicsBench() {
  /** @type {[string, (sim: Simulation) => void, 'small'|'medium'|'large'][]} */
  const scenarios = [
    ['water 300', (s) => pourAll(s, 'water', 300), 'small'],
    ['water 900', (s) => pourAll(s, 'water', 900), 'medium'],
    ['water 1400', (s) => pourAll(s, 'water', 1400), 'large'],
    ['3 liquid layers 900', (s) => { pourAll(s, 'honey', 300, -0.5); pourAll(s, 'water', 300); pourAll(s, 'oil', 300, 0.5); }, 'medium'],
    ['sand pile 600', (s) => pourAll(s, 'sand', 600), 'medium'],
    ['dough 600 (stirred)', (s) => { pourAll(s, 'flour', 300); pourAll(s, 'water', 300); s.tool.auto = true; }, 'medium'],
    ['boiling water 600 (lid on)', (s) => { pourAll(s, 'water', 600); s.furnace.setting = 1; s.furnace.maxFlame = 520; for (let k = 0; k < 120 * 40; k++) s.step(); }, 'medium'],
    ['frozen block 500', (s) => { pourAll(s, 'red', 500); s.furnace.setting = -1; s.furnace.minCool = -40; for (let k = 0; k < 120 * 30; k++) s.step(); }, 'medium'],
  ];
  const rows = [];
  for (const [name, setup, size] of scenarios) {
    const sim = new Simulation({ size, lookup: refLookup });
    setup(sim);
    for (let k = 0; k < 240; k++) sim.step();
    const ms = timeSteps(sim, 3);
    const gas = Array.from(sim.p.phase.slice(0, sim.p.count)).filter((p) => p === 4).length;
    rows.push({ scenario: name, particles: sim.p.count, gas, msPerStep: +ms.toFixed(3), msPerFrame60: +(ms * 2).toFixed(3) });
    console.log(`  ${name.padEnd(28)} ${String(sim.p.count).padStart(5)} particles  ${ms.toFixed(2).padStart(6)} ms/step  (${(ms * 2).toFixed(2)} ms per 60 fps frame)`);
  }
  // full commissions brewed by the homunculus (wall clock per brew)
  const brews = [];
  for (let k = 0; k < 6; k++) {
    const world = generateWorld('bench-' + k);
    const lookup = makeLookup(world);
    const cap = capabilities(EQUIPMENT.map((e) => e.id));
    cap.size = 'small';
    const com = generateCommission({ world, lookup, available: new Set(world.ingredients), cap, rank: 4, priceOf: (id) => lookup(id).price || 1 }, new Rng('bench-c' + k), { tier: k % 5 });
    if (!com) continue;
    const sim = new Simulation({ size: 'small', lookup, reactions: world.reactions });
    Object.assign(sim.furnace, { maxFlame: cap.maxFlame, heatPower: cap.heatPower, minCool: cap.minCool, coolPower: cap.coolPower });
    const t0 = performance.now();
    runPlanHeadless(sim, com.reference, lookup);
    brews.push({ style: com.style, simSeconds: +sim.time.toFixed(1), wallSeconds: +((performance.now() - t0) / 1000).toFixed(2) });
  }
  console.log('  homunculus brews:', brews.map((b) => `${b.style} ${b.simSeconds}s sim in ${b.wallSeconds}s`).join(', '));
  return { steps: rows, brews };
}

// ------------------------------------------------------------------ browser
async function browserBench() {
  let chromium;
  try {
    ({ chromium } = await import('playwright'));
  } catch {
    console.log('  playwright is not installed — skipping browser benchmark (npm install)');
    return null;
  }
  if (!fs.existsSync(path.join(ROOT, 'dist', 'index.html'))) execFileSync(process.execPath, [path.join(ROOT, 'scripts', 'build.mjs'), '--no-zip'], { stdio: 'inherit' });
  const port = 4199;
  const server = spawn(process.execPath, [path.join(ROOT, 'scripts', 'serve.mjs'), '--root', path.join(ROOT, 'dist'), '--port', String(port)], { stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 600));
  const browser = await chromium.launch();
  const results = [];
  let memory = null;
  const profiles = [
    { name: 'desktop 1440×900', viewport: { width: 1440, height: 900 }, dpr: 1, throttle: 1 },
    { name: 'phone 390×844 @2x, CPU ×4 throttle', viewport: { width: 390, height: 844 }, dpr: 2, throttle: 4, mobile: true },
  ];
  try {
    for (const prof of profiles) {
      for (const n of [60, 300, 800, 1300]) {
        const ctx = await browser.newContext({ viewport: prof.viewport, deviceScaleFactor: prof.dpr, isMobile: !!prof.mobile, hasTouch: !!prof.mobile });
        const page = await ctx.newPage();
        if (prof.throttle > 1) {
          const cdp = await ctx.newCDPSession(page);
          await cdp.send('Emulation.setCPUThrottlingRate', { rate: prof.throttle });
        }
        await page.goto(`http://localhost:${port}/index.html?nosw`);
        await page.waitForSelector('[data-act=sandbox]');
        await page.click('[data-act=sandbox]');
        await page.waitForSelector('canvas.view');
        // fill the cauldron directly (pouring at throttled speed would take minutes)
        await page.evaluate((count) => {
          const l = window.__alchemist.screen, sim = l.sim, R = l.state.world.roles;
          const defs = [R.water, R.essenceA, R.oil].map((id) => l.state.lookup(id));
          for (let k = 0; k < count; k++) {
            const d = defs[k % 3 === 2 && k < count * 0.85 ? 0 : k % 3];
            const x = (Math.random() - 0.5) * 2.4, y = sim.cauldron.depth - 0.2 - Math.random() * Math.min(2.2, count / 500);
            sim.addParticle(d, x, y);
          }
        }, n);
        await page.waitForTimeout(3000);
        await page.evaluate(() => { const l = window.__alchemist.screen; l.autoStir = true; l.setFurnace(0.4); l.perf.n = 0; l._bench = { sim: l.sim.time, wall: performance.now() }; });
        await page.waitForTimeout(prof.throttle > 1 ? 8000 : 6000);
        const rep = await page.evaluate(() => {
          const l = window.__alchemist.screen;
          // simulated seconds per wall-clock second (1 = real time; less = slow motion)
          const simRate = (l.sim.time - l._bench.sim) / ((performance.now() - l._bench.wall) / 1000);
          return { ...l.perfReport(), simRate, quality: l.effectiveQuality() };
        });
        results.push({ profile: prof.name, target: n, ...Object.fromEntries(Object.entries(rep).map(([k, v]) => [k, typeof v === 'number' ? +v.toFixed(2) : v])) });
        console.log(`  ${prof.name.padEnd(36)} ${String(rep.particles).padStart(5)} particles  ${rep.fps.toFixed(1).padStart(5)} fps  frame p50 ${rep.intervalP50.toFixed(1)} / p95 ${rep.intervalP95.toFixed(1)} ms  work p50 ${rep.workP50.toFixed(1)} ms (physics ${rep.physMs.toFixed(1)}, render ${rep.renderMs.toFixed(1)})  sim speed ×${rep.simRate.toFixed(2)}  quality ${rep.quality}`);
        await ctx.close();
      }
    }
    memory = await memorySoak(browser, port);
  } finally {
    await browser.close();
    server.kill();
  }
  return { frames: results, memory };
}

/**
 * Long-session memory check: 90 s of boiling and stirring at 4× speed, then
 * ten trips between the menu and the shop. The JS heap is sampled after a
 * forced garbage collection (DevTools protocol).
 */
async function memorySoak(browser, port) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  const heap = async () => {
    await cdp.send('HeapProfiler.collectGarbage');
    const u = await cdp.send('Runtime.getHeapUsage');
    return +(u.usedSize / 1048576).toFixed(2);
  };
  await page.goto(`http://localhost:${port}/index.html?nosw`);
  await page.click('[data-act=sandbox]');
  await page.waitForSelector('canvas.view');
  await page.evaluate(() => {
    const l = window.__alchemist.screen, sim = l.sim, R = l.state.world.roles;
    for (let k = 0; k < 600; k++) sim.addParticle(l.state.lookup(k % 4 ? R.water : R.binder), (Math.random() - 0.5) * 2.4, sim.cauldron.depth - 0.2 - Math.random() * 1.2);
  });
  await page.waitForTimeout(2000);
  const samples = [{ t: 0, mb: await heap() }];
  await page.evaluate(() => { const l = window.__alchemist.screen; l.sim.cauldron.lidClosed = true; l.setFurnace(0.9); l.autoStir = true; l.speed = 4; });
  for (const t of [30, 60, 90]) {
    await page.waitForTimeout(30_000);
    samples.push({ t, mb: await heap() });
  }
  const particles = await page.evaluate(() => window.__alchemist.screen.sim.p.count);
  const trips = [];
  for (let k = 0; k < 10; k++) {
    await page.evaluate(() => window.__alchemist.showMenu());
    await page.waitForSelector('[data-act=sandbox]');
    await page.click('[data-act=sandbox]');
    await page.waitForSelector('canvas.view');
    await page.waitForTimeout(400);
    if (k === 0 || k === 9) trips.push({ trip: k + 1, mb: await heap() });
  }
  await ctx.close();
  console.log(`  memory: heap ${samples.map((x) => `${x.mb} MB @${x.t}s`).join(', ')} (boiling, ${particles} particles left); after menu↔shop trips ${trips.map((x) => `${x.mb} MB (#${x.trip})`).join(', ')}`);
  return { soak: samples, particlesAtEnd: particles, screenTrips: trips };
}

console.log(`Machine: ${out.machine.cpus} × ${out.machine.cores}, Node ${out.machine.node}`);
if (doPhysics) {
  console.log('Physics (Node, single thread):');
  out.physics = physicsBench();
}
if (doBrowser) {
  console.log('Browser (headless Chromium, software rendering):');
  out.browser = await browserBench();
}
const file = path.join(ROOT, 'docs', 'perf-results.json');
fs.mkdirSync(path.dirname(file), { recursive: true });
let prev = {};
try { prev = JSON.parse(fs.readFileSync(file, 'utf8')); } catch { /* first run */ }
fs.writeFileSync(file, JSON.stringify({ ...prev, ...out }, null, 2) + '\n');
console.log('Wrote docs/perf-results.json');
