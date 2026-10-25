// The Wilds and the Trials room through real input: harvesting a mature
// plant fills the stores and leaves a mark where it stood, a dragged
// dropper doses a subject, a spent subject is replaced for coins, and all
// of it survives a reload.
import { test, expect } from '@playwright/test';
import { watchErrors, shot, newGame, lab, drag, pourDose, crushInPot } from './helpers.mjs';

test('harvesting a mature plant fills the stores and leaves a mark; growing ones cannot be taken', async ({ page }, info) => {
  const errors = watchErrors(page);
  await newGame(page, { tutorial: false, seed: 'gather-seed-1' });
  await page.click('[data-act=tab-wilds]');
  await expect(page.locator('.view-wilds canvas.scene')).toBeVisible();
  const dep = await lab(page, (l) => l.state.deposits.find((d) => d.region === 'forest' && d.rank === 0));
  const before = await lab(page, (l, id) => l.state.stock(id), dep.materialId);
  // the button names the method and the yield (which depends on tool, hour and weather)
  const label = await page.locator(`[data-act="gather-${dep.id}"]`).innerText();
  const promised = Number(/\+(\d+) ml/.exec(label)?.[1]);
  expect(promised).toBeGreaterThan(0);
  await page.click(`[data-act="gather-${dep.id}"]`);
  const after = await lab(page, (l, id) => l.state.stock(id), dep.materialId);
  expect(after, 'gathered what the button promised').toBe(before + promised);
  const node = await lab(page, (l, id) => l.state.gathering.nodes[id], dep.id);
  expect(node.plants.length, 'one plant was taken').toBe(dep.slots - 1);
  expect(node.due, 'and the stand is sprouting again').toBeGreaterThan(Date.now() - 1000);
  expect(await lab(page, (l) => l.state.gathering.marks.length), 'it left a mark on the ground').toBe(1);
  // buying the Forager's Kit raises the yield of everything that is not simply picked
  const tool = await lab(page, (l, id) => { const m = l.state.lookup(id); return m.wild.gather; }, dep.materialId);
  if (tool !== 'pick') {
    await lab(page, (l) => { l.state.coins += 80; l.state.buyEquipment('kit'); l.views.wilds.refresh(); });
    const label2 = await page.locator(`[data-act="gather-${dep.id}"]`).innerText();
    expect(Number(/\+(\d+) ml/.exec(label2)?.[1])).toBe(promised * 2);
  }
  // careful or thorough
  await page.click('[data-act=harvest-thorough]');
  await expect(page.locator('[data-act=harvest-thorough]')).toHaveClass(/active/);
  await page.click('[data-act=harvest-careful]');
  // tapping a mature plant in the scene harvests it
  await page.locator('.view-wilds canvas.scene').scrollIntoViewIfNeeded();
  const cv = await page.locator('.view-wilds canvas.scene').boundingBox();
  if (!cv) throw new Error('no scene');
  // (each plant stands where the scene's ground put it, clear of the scenery)
  await page.waitForFunction(() => window.__alchemist.screen.views.wilds.bgKey.endsWith(':true:true'));
  await lab(page, (l) => l.views.wilds.grow());
  const field = await lab(page, (l) => l.views.wilds.field.map((p) => ({ id: p.id, dep: p.dep.id, materialId: p.dep.materialId, x: p.x, y: p.y, stage: p.stage })));
  const tapAt = (p) => ({ x: cv.x + p.x * cv.width, y: cv.y + (p.y * 144 - 6) / 144 * cv.height });
  const ripe = field.find((p) => p.stage === 'mature' && p.dep !== dep.id);
  const s0 = await lab(page, (l, id) => l.state.stock(id), ripe.materialId);
  await drag(page, [tapAt(ripe), tapAt(ripe)], 30);
  expect(await lab(page, (l, id) => l.state.stock(id), ripe.materialId), 'tapping the mature plant gathered').toBeGreaterThan(s0);
  expect(await lab(page, (l, id) => l.views.wilds.field.some((p) => p.id === id), ripe.id), 'and it is gone from the ground').toBe(false);
  await shot(page, info, 'wilds-gathered');
  // a plant still growing cannot be taken
  // (the youngest plant, a fresh sprout where there is one)
  await page.evaluate(() => document.querySelectorAll('.toast').forEach((t) => t.remove()));
  const total = await lab(page, (l) => l.state.gathering.total);
  const young = await lab(page, (l) => {
    const w = l.views.wilds;
    w.grow();
    const p = w.field.filter((q) => q.stage !== 'mature').sort((a, b) => b.born - a.born)[0];
    if (p) w.gather(p.dep, p);
    return !!p;
  });
  if (young) {
    await expect(page.locator('.toast', { hasText: 'Not ripe yet' })).toBeVisible();
    expect(await lab(page, (l) => l.state.gathering.total)).toBe(total);
  }
  // Whisperwood is drawn from its sprite atlas; only plants take taps — a
  // tap on the sky or canopy gathers nothing
  const scenery = await lab(page, (l) => JSON.stringify(l.state.gathering.nodes));
  for (const fx of [0.1, 0.5, 0.9]) await page.mouse.click(cv.x + cv.width * fx, cv.y + cv.height * 0.06);
  expect(await lab(page, (l) => JSON.stringify(l.state.gathering.nodes)), 'scenery is not gatherable').toBe(scenery);
  // a deposit beyond the guild rank grows nothing in the scene (its card says what opens it)
  const far = await lab(page, (l) => l.state.deposits.find((d) => d.region === 'forest' && d.rank > 0));
  if (far) expect(await lab(page, (l, id) => l.views.wilds.field.some((p) => p.dep.id === id), far.id)).toBe(false);
  // pointing at a mature plant highlights it
  if (info.project.name === 'desktop') {
    const p3 = await lab(page, (l) => { const p = l.views.wilds.field.find((q) => q.stage === 'mature'); return p && { id: p.id, x: p.x, y: p.y }; });
    if (p3) {
      await page.mouse.move(tapAt(p3).x, tapAt(p3).y);
      await expect.poll(() => lab(page, (l) => l.views.wilds.hover)).toBe(p3.id);
    }
  }
  // the Sunlit Meadow grows its own plants, tapped the same way; their cards show the plant's icon
  await page.click('[data-act=region-meadow]');
  await page.waitForFunction(() => { const w = window.__alchemist.screen.views.wilds; return w.region === 'meadow' && w.bgKey.endsWith(':true:true'); });
  await lab(page, (l) => l.views.wilds.grow());
  const m0 = await lab(page, (l) => { const p = l.views.wilds.field.find((q) => q.stage === 'mature'); return { id: p.id, materialId: p.dep.materialId, x: p.x, y: p.y }; });
  const ms0 = await lab(page, (l, id) => l.state.stock(id), m0.materialId);
  await drag(page, [tapAt(m0), tapAt(m0)], 30);
  expect(await lab(page, (l, id) => l.state.stock(id), m0.materialId), 'tapping a meadow plant gathered').toBeGreaterThan(ms0);
  expect(await page.evaluate(() => [...document.querySelectorAll('.view-wilds .deposit canvas')].some((c) => /** @type {HTMLCanvasElement} */ (c).width === 24)), 'a card shows its plant icon').toBe(true);
  // (the screenshot without the toasts of the first gathering over the scene)
  await page.evaluate(() => document.querySelectorAll('.toast').forEach((t) => t.remove()));
  await shot(page, info, 'wilds-meadow');
  // a magical region is closed to an apprentice
  await page.click('[data-act=region-moonfen]');
  await expect(page.locator('.toast', { hasText: 'Moonfen' })).toBeVisible();
  // the gathered herb is on the shelf
  await page.click('[data-act=tab-brew]');
  await expect(page.locator(`.jar[data-id="${dep.materialId}"]`)).toBeVisible();
  // and the plants survive a reload
  await lab(page, (l) => l.save());
  await page.reload();
  await page.click('[data-act=continue]');
  await page.waitForSelector('canvas.view-canvas');
  const back = await lab(page, (l, id) => l.state.gathering.nodes[id], dep.id);
  expect(back.plants).toEqual(node.plants);
  expect(errors).toEqual([]);
});

test('the dropper doses a rabbit on the farm; a dead one is replaced for coins; trials persist', async ({ page }, info) => {
  const errors = watchErrors(page);
  await newGame(page, { tutorial: false, seed: 'trial-room-1' });
  const roles = await lab(page, (l) => l.state.world.roles);
  await pourDose(page, roles.water, [100]);
  await pourDose(page, 'wild-emberbark', [100]);
  await crushInPot(page);
  // steep the bark (it gives up its fire only when warm), so one reading plainly shows it
  await lab(page, (l) => { l.setAutoStir(true); l.setFurnace(0.8); l.speed = 4; });
  await page.waitForFunction(() => { const p = window.__alchemist.screen.sim.p; let t = 0; for (let i = 0; i < p.count; i++) t += p.temp[i]; return t / p.count > 62; }, null, { timeout: 60_000, polling: 250 });
  await page.waitForTimeout(3000);
  await lab(page, (l) => { l.setFurnace(0); l.setAutoStir(false); l.speed = 1; });
  await page.click('[data-act=tab-trials]');
  await expect(page.locator('[data-subject=beetle]')).toHaveCount(0);
  await expect(page.locator('.status-bars .sb')).toHaveCount(11);
  // drag the dropper onto Bramble's tile (the dose bar sits right above the roster)
  await page.locator('.dose-bar').evaluate((el) => el.scrollIntoView({ block: 'start' }));
  const from = await page.locator('.dropper').boundingBox();
  const to = await page.locator('.rabbit-tile[data-rabbit=r2] canvas').boundingBox();
  if (!from || !to) throw new Error('no boxes');
  const pts = [];
  for (let k = 0; k <= 20; k++) pts.push({ x: from.x + 20 + (to.x + to.width / 2 - from.x - 20) * (k / 20), y: from.y + 20 + (to.y + to.height / 2 - from.y - 20) * (k / 20) });
  await drag(page, pts, 20);
  await expect(page.locator('.trial-report .report').first()).toContainText('Bramble');
  const rec = await lab(page, (l) => l.state.trials.records[0]);
  expect(rec.subjectId).toBe('rabbit');
  expect(rec.revealed.length, 'a rabbit shows every effect').toBe(10);
  expect(rec.values.fire, 'the rabbit shows fire (a single reading is noisy)').toBeGreaterThan(0);
  // the room's batch estimate updates at once
  await expect(page.locator('.view-trials')).not.toContainText('nothing tested yet');
  await expect(page.locator('.estimate-card .reading-rows')).toBeVisible();
  await shot(page, info, 'trial-farm');
  // a dead rabbit is replaced for its price
  await lab(page, (l) => { l.state.trials.subjects.rabbit.alive = false; l.state.trials.subjects.rabbit.health = 0; l.views.trials.refresh(); });
  await expect(page.locator('[data-act=test-rabbit]')).toHaveCount(0);
  const c0 = await lab(page, (l) => l.state.coins);
  await page.click('[data-act=replace-rabbit]');
  expect(await lab(page, (l) => l.state.coins)).toBe(c0 - 6);
  await expect(page.locator('[data-act=test-rabbit]')).toBeEnabled();
  // the trial log is in the book and survives a reload
  await lab(page, (l) => l.save());
  await page.reload();
  await page.click('[data-act=continue]');
  await page.waitForSelector('canvas.view-canvas');
  await page.click('[data-act=tab-book]');
  await page.click('[data-act=book-trials]');
  await expect(page.locator('.view-book .item', { hasText: 'Bramble' })).toBeVisible();
  expect(errors).toEqual([]);
});
