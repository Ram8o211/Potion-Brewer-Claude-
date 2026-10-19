// The Wilds and the Trials room through real input: gathering fills the
// stores and depletes a deposit, a dragged dropper doses a subject, a spent
// subject is replaced for coins, and all of it survives a reload.
import { test, expect } from '@playwright/test';
import { watchErrors, shot, newGame, lab, drag, pourDose } from './helpers.mjs';

test('gathering in the wilds fills the stores and depletes the deposit', async ({ page }, info) => {
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
  expect(node.stock).toBeCloseTo(dep.capacity - promised, 0);
  // buying the right tool raises the yield
  const tool = await lab(page, (l, id) => { const m = l.state.lookup(id); return m.wild.gather; }, dep.materialId);
  if (tool === 'dig') {
    await lab(page, (l) => { l.state.coins += 50; l.state.buyEquipment('trowel'); l.views.wilds.refresh(); });
    const label2 = await page.locator(`[data-act="gather-${dep.id}"]`).innerText();
    expect(Number(/\+(\d+) ml/.exec(label2)?.[1])).toBe(promised * 2);
  }
  // careful or thorough
  await page.click('[data-act=harvest-thorough]');
  await expect(page.locator('[data-act=harvest-thorough]')).toHaveClass(/active/);
  await page.click('[data-act=harvest-careful]');
  // tapping a deposit in the scene gathers too
  await page.locator('.view-wilds canvas.scene').scrollIntoViewIfNeeded();
  const cv = await page.locator('.view-wilds canvas.scene').boundingBox();
  if (!cv) throw new Error('no scene');
  const deps = await lab(page, (l) => l.state.deposits.filter((d) => d.region === 'forest'));
  const d2 = deps[1];
  const s0 = await lab(page, (l, id) => l.state.stock(id), d2.materialId);
  const pt = { x: cv.x + d2.x * cv.width, y: cv.y + (d2.y * 108 - 6) / 108 * cv.height };
  await drag(page, [pt, pt], 30);
  expect(await lab(page, (l, id) => l.state.stock(id), d2.materialId), 'tapping the deposit gathered').toBeGreaterThan(s0);
  await shot(page, info, 'wilds-gathered');
  // a magical region is closed to an apprentice
  await page.click('[data-act=region-moonfen]');
  await expect(page.locator('.toast', { hasText: 'Moonfen' })).toBeVisible();
  // the gathered herb is on the shelf
  await page.click('[data-act=tab-brew]');
  await expect(page.locator(`.jar[data-id="${dep.materialId}"]`)).toBeVisible();
  // and the deposit state survives a reload
  await lab(page, (l) => l.save());
  await page.reload();
  await page.click('[data-act=continue]');
  await page.waitForSelector('canvas.view-canvas');
  const back = await lab(page, (l, id) => l.state.gathering.nodes[id], dep.id);
  expect(back.stock).toBeCloseTo(node.stock, 0);
  expect(errors).toEqual([]);
});

test('the dropper doses a subject; a spent subject is replaced for coins; trials persist', async ({ page }, info) => {
  const errors = watchErrors(page);
  await newGame(page, { tutorial: false, seed: 'trial-room-1' });
  const roles = await lab(page, (l) => l.state.world.roles);
  await pourDose(page, roles.water, [100]);
  await pourDose(page, roles.essenceB, [100]);
  await page.click('[data-act=tab-trials]');
  await expect(page.locator('[data-subject=beetle]')).toBeVisible();
  // drag the dropper onto the beetle
  const from = await page.locator('.dropper').boundingBox();
  const to = await page.locator('[data-subject=beetle] canvas').boundingBox();
  if (!from || !to) throw new Error('no boxes');
  const pts = [];
  for (let k = 0; k <= 20; k++) pts.push({ x: from.x + 20 + (to.x + to.width / 2 - from.x - 20) * (k / 20), y: from.y + 20 + (to.y + to.height / 2 - from.y - 20) * (k / 20) });
  await drag(page, pts, 20);
  await expect(page.locator('.trial-report .report')).toContainText('Copper Beetle');
  const rec = await lab(page, (l) => l.state.trials.records[0]);
  expect(rec.subjectId).toBe('beetle');
  expect(rec.values.fire, 'the beetle shows fire').toBeGreaterThan(2);
  // the room's batch summary updates at once
  await expect(page.locator('.view-trials')).not.toContainText('nothing tested yet');
  await shot(page, info, 'trial-beetle');
  // a spent rabbit is replaced for its price
  await lab(page, (l) => { l.state.trials.subjects.rabbit.alive = false; l.state.trials.subjects.rabbit.health = 0; l.views.trials.refresh(); });
  await expect(page.locator('[data-act=test-rabbit]')).toBeDisabled();
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
  await expect(page.locator('.view-book .item', { hasText: 'Copper Beetle' })).toBeVisible();
  expect(errors).toEqual([]);
});
