// Free Experiment: the physics as the player sees it — powders pile,
// liquids layer, frozen blocks are crushed with the pestle, oil burns —
// and a long run stays stable.
import { test, expect } from '@playwright/test';
import { watchErrors, shot, startSandbox, lab, pourRole, drag, viewPoint, crushInPot, steepWarm, stir } from './helpers.mjs';

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

test('hot oil never burns, but the herbs left undissolved in it char', async ({ page }, info) => {
  const errors = watchErrors(page);
  await startSandbox(page);
  await lab(page, (l) => { l.sim.cauldron.lidClosed = false; });
  await pourRole(page, 'oil', 250, 0);
  // an oil-soluble bark, poured whole: most of it stays undissolved
  await lab(page, (l) => { l.sim.emitter.start(l.state.lookup('wild-sp-mossback-bark'), { x: 0, amount: 12 }); });
  await page.waitForFunction(() => !window.__alchemist.screen.sim.emitter.pouring, null, { timeout: 20_000 });
  const oil0 = await lab(page, (l) => l.sim.inventory()[l.state.world.roles.oil]);
  await lab(page, (l) => { l.setFurnace(1); l.speed = 4; });
  const burning = () => window.__alchemist.screen.sim.p.burn.slice(0, window.__alchemist.screen.sim.p.count).filter((b) => b > 0.2).length;
  await page.waitForFunction(burning, null, { timeout: 90_000, polling: 200 });
  await lab(page, (l) => { l.speed = 1; });
  await page.waitForTimeout(400);
  await shot(page, info, 'fire');
  await lab(page, (l) => { l.setFurnace(0); });
  const after = await lab(page, (l) => ({ oil: l.sim.inventory()[l.state.world.roles.oil], charred: l.sim.extraction.charred, ext: l.sim.inventory()['wild-p-sp-mossback-bark'] || 0 }));
  expect(after.charred, 'the undissolved bark charred').toBeGreaterThan(0.1);
  expect(Math.abs(after.oil - oil0), 'the oil itself did not burn').toBeLessThan(0.01);
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

test('the campaign’s rooms and stores are here too: shelves, aging on them, and the garden', async ({ page }, info) => {
  const errors = watchErrors(page);
  await startSandbox(page);
  // bottle onto the potion shelves, as in the shop
  await pourRole(page, 'water', 200, 0);
  await page.waitForTimeout(800);
  await page.click('[data-act=bottle]');
  await page.click('[data-act=bottle-dest-shelf]');
  await page.click('[data-act=bottle-50]');
  await page.waitForFunction(() => /** @type {any} */ (window).__alchemist.screen.state.bottles.length === 1);
  const aged = await lab(page, (l) => l.state.bottles[0].id);
  await lab(page, (l) => { l.sim.clear(); l.state.newBatch(); });
  // brew a Fire potion: a fiery herb, crushed and steeped warm, stirred, bottled onto the shelves
  const fiery = await lab(page, (l) => {
    const ms = l.state.world.ingredients.map((id) => l.state.lookup(id)).filter((m) => m && m.extraction && m.wild && !m.wild.arcane && m.form === 'solid');
    ms.sort((a, b) => ((b.effects.fire || 0) - (b.effects.frost || 0)) - ((a.effects.fire || 0) - (a.effects.frost || 0)));
    return { id: ms[0].id, solvent: ms[0].extraction.cls === 'lipo' ? 'oil' : 'water' };
  });
  await pourRole(page, fiery.solvent, 300, 0);
  await pourRole(page, fiery.id, 150, 0);
  await crushInPot(page);
  await steepWarm(page, 60, 40);
  await stir(page, true);
  await page.waitForTimeout(1200);
  await page.click('[data-act=bottle]');
  await page.click('[data-act=bottle-dest-shelf]');
  await page.click('[data-act=bottle-100]');
  await page.waitForFunction(() => window.__alchemist.screen.state.bottles.length >= 2);
  await stir(page, false);
  const fire = await lab(page, (l) => { const b = l.state.bottles[l.state.bottles.length - 1]; return { id: b.id, net: b.m.effects[5] - b.m.effects[6], ml: b.ml }; });
  expect(fire.net, 'a Fire potion on the shelf').toBeGreaterThan(3);
  // the counter: select the water bottle; its Fire/Frost slot takes 20 ml of the Fire potion
  await page.click('[data-act=tab-counter]');
  await page.click(`[data-act=bottle-slot][data-id="${aged}"]`);
  await expect(page.locator('[data-act=age-slot-charge]')).toBeVisible();
  await page.click('[data-act=age-slot-charge]');
  await page.fill('[data-act=age-ml]', '20');
  await page.click(`[data-act="age-load-${fire.id}"]`);
  const ch = await lab(page, (l, id) => l.state.bottles.find((b) => b.id === id).aging.charge, aged);
  expect(ch && ch.ml, 'charged with 20 ml').toBe(20);
  expect(await lab(page, (l, id) => l.state.bottles.find((b) => b.id === id).ml, fire.id), 'taken from the Fire bottle').toBe(fire.ml - 20);
  // the rune slot: hold it on the way (as many runes as wanted here; moving it uses none)
  const goal = await lab(page, (l, id) => Math.round((12 + 12 + l.state.bottles.find((b) => b.id === id).aging.charge.net * 4) / 2), aged);
  await page.click('[data-act=age-slot-rune]');
  await page.fill('[data-act=age-target]', String(goal));
  await page.click('[data-act=age-rune]');
  expect(await lab(page, (l, id) => l.state.cellar.runes === Infinity && l.state.bottles.find((b) => b.id === id).aging.rune.target, aged)).toBe(goal);
  // the detail follows it live: the temperature rises, then the rune locks it
  const t0 = Number(await page.locator('.aging [data-temp]').getAttribute('data-temp'));
  await page.waitForFunction(([id, g]) => { const b = /** @type {any} */ (window).__alchemist.screen.state.bottles.find((x) => x.id === id); return Math.abs(b.aging.T - g) < 0.05; }, [aged, goal], { timeout: 90_000, polling: 500 });
  await page.waitForTimeout(1500);
  const t1 = Number(await page.locator('.aging [data-temp]').getAttribute('data-temp'));
  expect(t1, 'shown rising without a click').toBeGreaterThan(t0 + 3);
  await expect(page.locator('[data-act=age-slot-rune]')).toContainText('locked');
  await shot(page, info, 'sandbox-aging');
  // drag the Fire bottle from the shelves onto the slot: 20 ml more
  const tile = await page.locator(`[data-act=bottle-slot][data-id="${fire.id}"]`).boundingBox();
  const slot = await page.locator('[data-act=age-slot-charge]').boundingBox();
  if (!tile || !slot) throw new Error('no boxes');
  const before = await lab(page, (l, id) => l.state.bottles.find((b) => b.id === id).aging.charge.ml, aged);
  await page.mouse.move(tile.x + tile.width / 2, tile.y + tile.height / 2);
  await page.mouse.down();
  for (let k = 1; k <= 12; k++) await page.mouse.move(tile.x + (slot.x + 40 - tile.x) * (k / 12), tile.y + (slot.y + slot.height / 2 - tile.y) * (k / 12));
  await page.mouse.up();
  const after = await lab(page, (l, id) => l.state.bottles.find((b) => b.id === id).aging.charge.ml, aged);
  expect(after, 'dragged onto the slot: 20 ml more').toBeGreaterThan(before + 15);
  expect(await page.locator('.bottle-ghost').count(), 'no dragged picture left behind').toBe(0);
  // unsealed: a fresh bottle in its place
  await page.click('[data-act=age-unseal]');
  expect(await lab(page, (l) => l.state.bottles.filter((b) => b.aging).length)).toBe(0);
  expect(await lab(page, (l) => l.state.bottles.length)).toBe(2);
  // the garden: every bed, every seed
  await page.click('[data-act=tab-garden]');
  const seeds = page.locator('.seeds .seed');
  expect(await seeds.count()).toBeGreaterThan(100);
  // choose a plot, then any seed that grows there: it is sown at once and the seed is not used up
  await page.click('[data-act=plot-soil1]');
  await page.locator('.seeds .seed:not([disabled])').first().click();
  expect(await lab(page, (l) => !!l.state.garden.plots.find((p) => p.id === 'soil1').crop)).toBe(true);
  expect(await seeds.count()).toBeGreaterThan(100);
  await shot(page, info, 'sandbox-garden');
  expect(errors).toEqual([]);
});
