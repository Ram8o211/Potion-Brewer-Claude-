// The garden and the testing room through real input: harvesting fills the
// stores and empties the bed, watering costs well water, a dragged dropper
// doses a creature, a dead creature is replaced for coins, the Potion ID
// sliders persist — and all of it survives a reload.
import { test, expect } from '@playwright/test';
import { watchErrors, shot, newGame, lab, drag, pourDose } from './helpers.mjs';

test('the garden: harvest by button and by tapping the bed, water, plant, and keep it all after a reload', async ({ page }, info) => {
  const errors = watchErrors(page);
  await newGame(page, { tutorial: false, seed: 'garden-ui-1' });
  await page.click('[data-act=tab-garden]');
  await expect(page.locator('.view-garden canvas.scene')).toBeVisible();
  const roles = await lab(page, (l) => l.state.world.roles);
  const before = await lab(page, (l, id) => l.state.stock(id), roles.dew);
  await page.click('[data-act="harvest-dew-a"]');
  const after = await lab(page, (l, id) => l.state.stock(id), roles.dew);
  expect(after, 'harvested into the stores').toBeGreaterThan(before + 50);
  expect(await lab(page, (l) => l.state.bed('dew-a').growth)).toBeLessThan(0.05);
  await expect(page.locator('[data-act="harvest-dew-a"]')).toBeDisabled();
  // tapping a ripe bed in the scene harvests it
  const cv = await page.locator('.view-garden canvas.scene').boundingBox();
  if (!cv) throw new Error('no scene');
  const rect = await page.evaluate(async () => {
    const url = '/src/rendering/garden.js';
    const { bedRect, GARDEN_W, GARDEN_H } = await import(url);
    const r = bedRect('sap-a');
    return { x: (r.x + r.w / 2) / GARDEN_W, y: (r.y + r.h - 8) / GARDEN_H };
  });
  const s0 = await lab(page, (l, id) => l.state.stock(id), roles.sap);
  const pt = { x: cv.x + rect.x * cv.width, y: cv.y + rect.y * cv.height };
  await drag(page, [pt, pt], 30);
  expect(await lab(page, (l, id) => l.state.stock(id), roles.sap), 'tapping the bed harvested it').toBeGreaterThan(s0);
  await shot(page, info, 'garden-harvested');
  // a dry plant bed is watered with well water
  await lab(page, (l) => { l.state.garden.beds['dew-a'].wetUntil = Date.now() - 1000; l.views.garden.refresh(); });
  const w0 = await lab(page, (l, id) => l.state.stock(id), roles.water);
  await page.click('[data-act="water-dew-a"]');
  expect(await lab(page, (l, id) => l.state.stock(id), roles.water)).toBe(w0 - 40);
  expect(await lab(page, (l) => l.state.bed('dew-a').moist)).toBe(true);
  // plant a new bed for coins
  await lab(page, (l) => { l.state.coins = 200; l.views.garden.refresh(); });
  await page.click('[data-act="plant-glacite-a"]');
  await page.locator('.overlay .modal-foot .btn', { hasText: 'Plant' }).click();
  expect(await lab(page, (l) => l.state.garden.beds['glacite-a'] && l.state.garden.beds['glacite-a'].owned)).toBe(true);
  // the new ingredient has its place on the shelf
  await page.click('[data-act=tab-brew]');
  await expect(page.locator(`.jar[data-id="${roles.glacite}"]`)).toBeVisible();
  // and the garden survives a reload
  await lab(page, (l) => l.save());
  await page.reload();
  await page.click('[data-act=continue]');
  await page.waitForSelector('canvas.view-canvas');
  expect(await lab(page, (l) => l.state.garden.beds['glacite-a'].owned)).toBe(true);
  expect(await lab(page, (l) => l.state.bed('dew-a').growth)).toBeLessThan(0.2);
  expect(errors).toEqual([]);
});

test('the testing room: the dropper doses a creature, it reacts without words, the ID sticks, a dead one is replaced', async ({ page }, info) => {
  const errors = watchErrors(page);
  await newGame(page, { tutorial: false, seed: 'test-room-1' });
  const roles = await lab(page, (l) => l.state.world.roles);
  await lab(page, (l) => { l.state.inventory[l.state.world.roles.sap] = 200; l.updateShelf(); });
  await pourDose(page, roles.water, [50]);
  await pourDose(page, roles.sap, [50]);
  await page.click('[data-act=tab-testing]');
  await expect(page.locator('[data-creature=salamander]')).toBeVisible();
  // drag the dropper onto the salamander
  const from = await page.locator('.dropper').boundingBox();
  const to = await page.locator('[data-creature=salamander] canvas').boundingBox();
  if (!from || !to) throw new Error('no boxes');
  const pts = [];
  for (let k = 0; k <= 20; k++) pts.push({ x: from.x + 20 + (to.x + to.width / 2 - from.x - 20) * (k / 20), y: from.y + 20 + (to.y + to.height / 2 - from.y - 20) * (k / 20) });
  await drag(page, pts, 20);
  const rec = await lab(page, (l) => l.state.lab.records[0]);
  expect(rec.creature).toBe('salamander');
  expect(rec.levels.ardor, 'its flame rises with the sap’s ardor').toBeGreaterThan(10);
  await page.waitForTimeout(2000);
  await shot(page, info, 'salamander-flame');
  // the reaction is drawn, not written: the cage shows flame colours above the salamander
  const flame = await page.locator('[data-creature=salamander] canvas').evaluate((el) => {
    const cv = /** @type {HTMLCanvasElement} */ (el);
    const ctx = cv.getContext('2d');
    const d = ctx.getImageData(0, 0, cv.width, 60).data;
    let n = 0;
    for (let i = 0; i < d.length; i += 4) if (d[i] > 230 && d[i + 1] > 100 && d[i + 1] < 200 && d[i + 2] < 90) n++;
    return n;
  });
  expect(flame, 'flame pixels in the cage').toBeGreaterThan(10);
  // a real tap on an unset slider resting at 0 writes 0 (no 'change' event fires for it)
  const frost = page.locator('input[data-prop=frost]');
  await frost.scrollIntoViewIfNeeded();
  const fb = await frost.boundingBox();
  if (!fb) throw new Error('no slider');
  const zero = { x: fb.x + 6, y: fb.y + fb.height / 2 };
  await drag(page, [zero, zero], 30);
  expect(await lab(page, (l) => l.state.idCard.values.frost), 'tapped at 0 means 0').toBe(0);
  await expect(page.locator('.id-row', { has: frost })).toContainText('0');
  // a swipe that starts on a slider and scrolls the room writes nothing (touch only)
  if (info.project.use.hasTouch) {
    const bane = page.locator('input[data-prop=bane]');
    const bb = await bane.boundingBox();
    if (!bb) throw new Error('no slider');
    const from = { x: bb.x + bb.width * 0.7, y: bb.y + bb.height / 2 };
    const pts = [];
    for (let k = 0; k <= 12; k++) pts.push({ x: from.x + k * 0.3, y: from.y - k * 10 });
    await drag(page, pts, 16);
    expect(await lab(page, (l) => l.state.idCard.values.bane), 'a scroll is not an edit').toBeNull();
    await expect(page.locator('.id-row', { has: bane })).toContainText('?');
  }
  // the keyboard keeps its slider between steps (rows update in place)
  const lev = page.locator('input[data-prop=levity]');
  await lev.focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  expect(await lab(page, (l) => l.state.idCard.values.levity)).toBe(2);
  // set the ID with the sliders; it persists
  await page.locator('input[data-prop=ardor]').evaluate((el) => { /** @type {HTMLInputElement} */ (el).value = '30'; el.dispatchEvent(new Event('input')); el.dispatchEvent(new Event('change')); });
  expect(await lab(page, (l) => l.state.idCard.values.ardor)).toBe(30);
  await expect(page.locator('.id-row', { has: page.locator('input[data-prop=ardor]') })).toContainText('30');
  // a recipe saved now keeps the Potion ID written for the brew
  await page.click('[data-act=tab-book]');
  await page.click('[data-act=book-recipes]');
  await page.click('[data-act=save-recipe]');
  expect(await lab(page, (l) => l.state.recipes[0].potionId && l.state.recipes[0].potionId.ardor)).toBe(30);
  await expect(page.locator('.book-body .item').first()).toContainText('30');
  await page.click('[data-act=tab-testing]');
  // a dead toad is replaced for its price
  await lab(page, (l) => { l.state.lab.creatures.toad.alive = false; l.state.lab.creatures.toad.health = 0; l.views.testing.refresh(); });
  await expect(page.locator('[data-act=dose-toad]')).toBeHidden();
  const c0 = await lab(page, (l) => l.state.coins);
  await page.click('[data-act=replace-toad]');
  expect(await lab(page, (l) => l.state.coins)).toBe(c0 - 6);
  await expect(page.locator('[data-act=dose-toad]')).toBeVisible();
  await lab(page, (l) => l.save());
  await page.reload();
  await page.click('[data-act=continue]');
  await page.waitForSelector('canvas.view-canvas');
  expect(await lab(page, (l) => ({ id: l.state.idCard.values.ardor, n: l.state.lab.records.length }))).toEqual({ id: 30, n: 1 });
  expect(errors).toEqual([]);
});
