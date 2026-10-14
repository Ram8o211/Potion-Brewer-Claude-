// Free Experiment: the physics as the player sees it — smashed stones pile,
// liquids that refuse to mix layer, frozen blocks are crushed with the
// pestle, witch oil burns — and a long run stays stable.
import { test, expect } from '@playwright/test';
import { watchErrors, shot, startSandbox, lab, pourRole, drag, viewPoint } from './helpers.mjs';

test('layers, powders and stirring', async ({ page }, info) => {
  const errors = watchErrors(page);
  await startSandbox(page);
  await pourRole(page, 'water', 500, -0.5);
  await pourRole(page, 'witchoil', 200, 0);
  await page.waitForTimeout(2500);
  // cold witch oil keeps apart from water and floats on top
  const layers = await lab(page, (l) => {
    const p = l.sim.p, R = l.state.world.roles, sp = l.sim.species;
    const mean = (id) => { const s = sp.slotOf.get(id); let y = 0, n = 0; for (let i = 0; i < p.count; i++) if (p.comp[i * 16 + s] > 0.6) { y += p.y[i]; n++; } return y / n; };
    return { oil: mean(R.witchoil), water: mean(R.water) };
  });
  expect(layers.oil).toBeLessThan(layers.water);
  await shot(page, info, 'layers');
  await pourRole(page, 'sunstone', 150, 0.9);
  await page.waitForTimeout(1500);
  await shot(page, info, 'powder');
  await page.click('[data-act=tool-spoon]');
  const c = await viewPoint(page, 0.5, 0.75);
  const pts = [];
  for (let k = 0; k <= 160; k++) { const a = k * 0.2; pts.push({ x: c.x + Math.cos(a) * c.box.width * 0.22, y: c.y + Math.sin(a) * c.box.height * 0.06 }); }
  await drag(page, pts);
  await shot(page, info, 'stirred');
  expect(errors).toEqual([]);
});

test('freeze a liquid into a block, then crush it with the pestle', async ({ page }, info) => {
  const errors = watchErrors(page);
  await startSandbox(page);
  await pourRole(page, 'dew', 300, 0);
  await lab(page, (l) => { l.setFurnace(-1); l.speed = 4; });
  await page.waitForFunction(() => {
    const p = window.__alchemist.screen.sim.p;
    let s = 0;
    for (let i = 0; i < p.count; i++) if (p.phase[i] === 3) s++;
    return s > p.count * 0.6;
  }, null, { timeout: 60_000, polling: 300 });
  // keep the frost plate on while crushing so the ice does not melt back
  await lab(page, (l) => { l.setFurnace(-0.6); l.speed = 1; });
  await shot(page, info, 'frozen');
  const solid0 = await lab(page, (l) => { let s = 0; for (let i = 0; i < l.sim.p.count; i++) if (l.sim.p.phase[i] === 3) s++; return s; });
  await page.click('[data-act=tool-pestle]');
  const c = await viewPoint(page, 0.5, 0.78);
  const pts = [];
  for (let k = 0; k <= 200; k++) pts.push({ x: c.x + Math.sin(k / 8) * c.box.width * 0.2, y: c.y - c.box.height * 0.08 + Math.abs(Math.sin(k / 3)) * c.box.height * 0.1 });
  await drag(page, pts);
  await page.waitForTimeout(600);
  const after = await lab(page, (l) => { let s = 0, g = 0; for (let i = 0; i < l.sim.p.count; i++) { if (l.sim.p.phase[i] === 3) s++; if (l.sim.p.phase[i] === 1) g++; } return { s, g }; });
  expect(after.g, 'crushed into grains').toBeGreaterThan(10);
  expect(after.s).toBeLessThan(solid0);
  await shot(page, info, 'crushed');
  expect(errors).toEqual([]);
});

test('witch oil catches fire on a strong furnace and the lid smothers it', async ({ page }, info) => {
  const errors = watchErrors(page);
  await startSandbox(page);
  await lab(page, (l) => { l.sim.cauldron.lidClosed = false; });
  await pourRole(page, 'witchoil', 300, 0);
  await lab(page, (l) => { l.setFurnace(1); l.speed = 4; });
  const burning = () => window.__alchemist.screen.sim.p.burn.slice(0, window.__alchemist.screen.sim.p.count).filter((b) => b > 0.2).length;
  await page.waitForFunction(burning, null, { timeout: 60_000, polling: 200 });
  await lab(page, (l) => { l.speed = 1; });
  await page.waitForTimeout(400);
  await shot(page, info, 'fire');
  await lab(page, (l) => { l.setFurnace(0); });
  await page.locator('[data-act=lid]:visible').first().click();
  await page.waitForFunction(() => window.__alchemist.screen.sim.p.burn.slice(0, window.__alchemist.screen.sim.p.count).every((b) => b <= 0.2), null, { timeout: 30_000, polling: 300 });
  expect(errors).toEqual([]);
});

test('a long boiling session stays stable and conserves matter', async ({ page }, info) => {
  test.setTimeout(240_000);
  const errors = watchErrors(page);
  await startSandbox(page);
  await pourRole(page, 'water', 600, -0.5);
  await pourRole(page, 'sunstone', 200, 0.5);
  await pourRole(page, 'dew', 100, 0);
  const total0 = await lab(page, (l) => { const inv = l.sim.inventory(); return Object.values(inv).reduce((a, b) => a + b, 0); });
  await lab(page, (l) => { l.sim.cauldron.lidClosed = true; l.setFurnace(0.8); l.speed = 4; l.autoStir = true; });
  // ~3 simulated minutes of heating under the lid
  await page.waitForTimeout(45_000);
  const st = await lab(page, (l) => {
    const p = l.sim.p;
    let bad = 0, out = 0;
    for (let i = 0; i < p.count; i++) {
      if (!Number.isFinite(p.x[i]) || !Number.isFinite(p.y[i]) || !Number.isFinite(p.temp[i])) bad++;
      if (l.sim.cauldron.sample(p.x[i], p.y[i]) > 0.02) out++;
    }
    const inv = l.sim.inventory();
    const vented = Object.values(l.sim.vented).reduce((a, b) => a + b, 0);
    return { bad, out, total: Object.values(inv).reduce((a, b) => a + b, 0), vented, count: p.count, perf: l.perfReport() };
  });
  expect(st.bad, 'no NaN particles').toBe(0);
  expect(st.out, 'nothing escapes the vessel').toBe(0);
  expect(Math.abs(st.total + st.vented - total0), 'matter is conserved (in pot + vented)').toBeLessThan(1);
  await shot(page, info, 'long-run');
  info.annotations.push({ type: 'perf', description: JSON.stringify(st.perf) });
  expect(errors).toEqual([]);
});
