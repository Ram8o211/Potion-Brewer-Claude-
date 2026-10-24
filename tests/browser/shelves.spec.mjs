// The potion shelves and the natural ingredients: bottle the cauldron onto
// the shelves at any time while there is room, take a bottle down to the
// counter (swapping with the vial there), pour one back; every wild
// ingredient has its own sprite and its own surface in the cauldron.
import { test, expect } from '@playwright/test';
import { watchErrors, shot, newGame, lab, pourRole, crushInPot } from './helpers.mjs';

test('bottles go onto the potion shelves while there is room, and come down to the counter', async ({ page }, info) => {
  const errors = watchErrors(page);
  await newGame(page, { tutorial: false, seed: 'shelves-ui-1' });
  await pourRole(page, 'water', 150);
  await pourRole(page, 'wild-silverleaf', 100);
  await crushInPot(page);
  const shelve = async (ml) => {
    await page.click('[data-act=bottle]');
    await page.click('[data-act=bottle-dest-shelf]');
    await page.click(`[data-act=bottle-${ml}]`);
    await page.waitForFunction(() => !(/** @type {any} */ (window)).__alchemist.screen.bottling, null, { timeout: 20_000 });
  };
  for (let k = 0; k < 3; k++) await shelve(25);
  expect(await lab(page, (l) => l.state.bottles.length)).toBe(3);
  expect(await lab(page, (l) => l.state.vial), 'nothing went to the counter').toBeNull();
  // the shelves are full: the next bottle can only go to the counter
  await page.click('[data-act=bottle]');
  await expect(page.locator('[data-act=bottle-dest-shelf]')).toBeDisabled();
  await page.click('[data-act=bottle-25]');
  await expect(page.locator('[data-act=serve]')).toBeVisible({ timeout: 20_000 });
  // the counter shows the shelves; take a bottle down: the counter's vial goes up in its place
  await expect(page.locator('.shelf-card')).toContainText('3/3');
  const counterVial = await lab(page, (l) => l.state.vial.id);
  await page.locator('[data-act=bottle-slot]').first().click();
  await expect(page.locator('.bottle-detail')).toBeVisible();
  await shot(page, info, 'potion-shelves');
  await page.click('[data-act=take-bottle]');
  expect(await lab(page, (l, id) => l.state.bottles.some((b) => b.id === id), counterVial), 'the counter vial is on the shelf').toBe(true);
  expect(await lab(page, (l) => l.state.bottles.length)).toBe(3);
  // pour one shelved bottle back into the cauldron: exactly its matter
  const n0 = await lab(page, (l) => l.sim.p.count);
  await page.locator('[data-act=bottle-slot]').first().click();
  await page.click('[data-act=pour-back-bottle]');
  expect(await lab(page, (l) => l.sim.p.count)).toBe(n0 + 5);
  expect(await lab(page, (l) => l.state.bottles.length)).toBe(2);
  // saved with the shop
  await lab(page, (l) => l.save());
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('alchemist-shop.save') || 'null'));
  expect(saved && saved.bottles.length).toBe(2);
  expect(errors).toEqual([]);
});

test('every natural ingredient has its own look on the shelf and in the cauldron', async ({ page }, info) => {
  const errors = watchErrors(page);
  await newGame(page, { tutorial: false, seed: 'herbs-look-1' });
  const looks = await lab(page, async (l) => {
    const st = l.state;
    st.reputation = 99999;
    for (const id of st.world.wild) st.inventory[id] = 500;
    l.buildShelf();
    // whole (not ground) ingredients side by side in the cauldron
    const keys = ['emberbark', 'owlberry', 'witchear', 'nettle', 'beebalm', 'hemlock', 'riverpearl', 'lodestone', 'stormglass', 'moonlily', 'toadstool', 'sirenreed'];
    for (const [k, key] of keys.entries()) {
      const def = st.lookup('wild-' + key);
      l.sim.emitter.start(def, { x: -0.9 + (k % 6) * 0.36, amount: 8, ground: false });
      for (let g = 0; g < 2000 && l.sim.emitter.pouring; g++) l.sim.step();
    }
    return keys.map((key) => l.sim.species.look[l.sim.species.slotOf.get('wild-' + key)]);
  });
  // whole ingredients of different kinds carry different surfaces
  expect(new Set(looks).size).toBeGreaterThanOrEqual(10);
  await page.waitForTimeout(1500);
  await shot(page, info, 'herbs-in-cauldron');
  await expect(page.locator('.jar.wild')).toHaveCount(await lab(page, (l) => l.state.world.wild.length));
  await page.locator('.shelf-wrap').screenshot({ path: 'test-results/screenshots/' + info.project.name + '-herb-shelf.png' });
  expect(errors).toEqual([]);
});

test('a tested batch labels its bottles by itself: shelved bottles show their effects at once', async ({ page }) => {
  const errors = watchErrors(page);
  await newGame(page, { tutorial: false, seed: 'shelves-label-1' });
  await pourRole(page, 'water', 150);
  await pourRole(page, 'wild-silverleaf', 100);
  await crushInPot(page);
  const shelve = async () => {
    await page.click('[data-act=tab-brew]');
    await page.click('[data-act=bottle]');
    await page.click('[data-act=bottle-dest-shelf]');
    await page.click('[data-act=bottle-25]');
    await page.waitForFunction(() => !(/** @type {any} */ (window)).__alchemist.screen.bottling, null, { timeout: 20_000 });
  };
  // an untested bottle carries no label
  await shelve();
  expect(await lab(page, (l) => l.state.bottles[0].label || null)).toBeNull();
  // one trial of the batch: the bottle already on the shelf labels itself
  await page.click('[data-act=tab-trials]');
  await page.click('[data-act=test-rabbit]');
  await expect(page.locator('.trial-report .report')).toBeVisible();
  const first = await lab(page, (l) => { const b = l.state.bottles[0]; return { auto: !!(b.label && b.label.auto), tested: Object.values(b.label ? b.label.claims : {}).some((c) => c.source === 'trial'), cert: Object.keys(b.cert || {}).length }; });
  if (first.cert) expect(first).toMatchObject({ auto: true, tested: true });
  // a new bottle of the same (tested) batch is labelled the moment it is shelved: no new trial
  const records = await lab(page, (l) => l.state.trials.records.length);
  await shelve();
  const second = await lab(page, (l) => { const b = l.state.bottles[1]; return { auto: !!(b.label && b.label.auto), vitality: b.label && b.label.claims.vitality.source }; });
  expect(second).toEqual({ auto: true, vitality: 'trial' });
  expect(await lab(page, (l) => l.state.trials.records.length)).toBe(records);
  await page.click('[data-act=tab-counter]');
  await page.locator('[data-act=bottle-slot]').nth(1).click();
  await expect(page.locator('.bottle-detail .label-line')).toContainText('(tested');
  await expect(page.locator('[data-act=bottle-slot]').nth(1)).toHaveAttribute('title', /\(tested, σ/);
  // with its standard deviation, and accuracy stars (a single reading earns none yet)
  await expect(page.locator('.bottle-detail .label-line')).toContainText(/σ \d/);
  await expect(page.locator('.bottle-detail .label-line')).toContainText('☆☆☆');
  await expect(page.locator('[data-act=bottle-slot]').nth(1).locator('.bstars')).toHaveAttribute('data-stars', '0');
  expect(errors).toEqual([]);
});
