// Free Experiment: the physics as the player sees it — powders pile,
// liquids layer, frozen blocks are crushed with the pestle, oil burns —
// and a long run stays stable.
import { test, expect } from '@playwright/test';
import { watchErrors, shot, startSandbox, lab, pourRole, drag, viewPoint } from './helpers.mjs';

test('layers, powders and stirring', async ({ page }, info) => {
  const errors = watchErrors(page);
  await startSandbox(page);
  await pourRole(page, 'water', 500, -0.5);
  await pourRole(page, 'syrup', 200, 0.6);
  await pourRole(page, 'oil', 200, 0);
  await page.waitForTimeout(2500);
  // syrup sinks below water, oil floats on top
  const layers = await lab(page, (l) => {
    const p = l.sim.p, R = l.state.world.roles, sp = l.sim.species;
    const mean = (id) => { const s = sp.slotOf.get(id); let y = 0, n = 0; for (let i = 0; i < p.count; i++) if (p.comp[i * p.S + s] > 0.6) { y += p.y[i]; n++; } return y / n; };
    return { oil: mean(R.oil), water: mean(R.water), syrup: mean(R.syrup) };
  });
  expect(layers.oil).toBeLessThan(layers.water);
  expect(layers.water).toBeLessThan(layers.syrup);
  await shot(page, info, 'layers');
  await pourRole(page, 'salt', 150, 0.9);
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
  await pourRole(page, 'essenceB', 300, 0);
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

test('the physics demonstrations live here: skimmer, alembic, heat map and exact readings', async ({ page }) => {
  const errors = watchErrors(page);
  await startSandbox(page);
  for (const act of ['alembic', 'thermal', 'tool-skimmer']) await expect(page.locator(`[data-act=${act}]`).first()).toBeAttached();
  await pourRole(page, 'water', 200, 0);
  await page.click('[data-act=sample]');
  await expect(page.locator('.overlay')).toContainText('g/ml');
  await expect(page.locator('.overlay')).toContainText('Charge');
  expect(errors).toEqual([]);
});

test('oil catches fire on a strong furnace and the lid smothers it', async ({ page }, info) => {
  const errors = watchErrors(page);
  await startSandbox(page);
  await lab(page, (l) => { l.sim.cauldron.lidClosed = false; });
  await pourRole(page, 'oil', 300, 0);
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
  await pourRole(page, 'binder', 200, 0.5);
  await pourRole(page, 'essenceA', 100, 0);
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

test('swiping the tool row over Auto scrolls it without starting the stirrer', async ({ page }) => {
  const errors = watchErrors(page);
  await startSandbox(page);
  const box = await page.locator('[data-act=autostir]').boundingBox();
  if (!box) throw new Error('no Auto button');
  const x = box.x + box.width / 2, y = box.y + box.height / 2;
  /** @param {string} type @param {number} px */
  const fire = (type, px) => page.locator('[data-act=autostir]').dispatchEvent(type, { pointerId: 7, pointerType: 'touch', isPrimary: true, button: 0, clientX: px, clientY: y, bubbles: true });
  const stirring = () => lab(page, (l) => l.autoStir);
  const upgraded = await lab(page, (l) => l.state.has('stirrer'));
  // a swipe that starts on Auto
  await fire('pointerdown', x);
  for (let k = 1; k <= 6; k++) { await fire('pointermove', x - k * 8); await page.waitForTimeout(16); }
  await page.waitForTimeout(300);
  expect(await stirring(), 'a swipe leaves it off').toBe(false);
  await fire('pointerup', x - 48);
  expect(await stirring(), 'and lifting the finger too').toBe(false);
  // a deliberate press still works
  await fire('pointerdown', x);
  await page.waitForTimeout(300);
  if (upgraded) {
    await fire('pointerup', x);
    expect(await stirring(), 'a tap turns the clockwork stirrer on').toBe(true);
  } else {
    expect(await stirring(), 'holding stirs').toBe(true);
    await fire('pointerup', x);
    expect(await stirring(), 'letting go stops').toBe(false);
  }
  expect(errors).toEqual([]);
});
