// The potion shelves and the natural ingredients: bottle the cauldron onto
// the shelves at any time while there is room, take a bottle down to the
// counter (swapping with the vial there), pour one back; every wild
// ingredient has its own sprite and its own surface in the cauldron.
import { test, expect } from '@playwright/test';
import { watchErrors, shot, newGame, lab, pourRole, crushInPot, steepWarm } from './helpers.mjs';

test('bottles go onto the potion shelves while there is room, and come down to the counter', async ({ page }, info) => {
  const errors = watchErrors(page);
  await newGame(page, { tutorial: false, seed: 'shelves-ui-1' });
  await pourRole(page, 'water', 150);
  await pourRole(page, 'wild-sp-silverleaf', 100);
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
  await pourRole(page, 'wild-sp-silverleaf', 100);
  await crushInPot(page);
  // a warm steep, then let it settle back (extraction is slow at room temperature)
  await steepWarm(page, 60, 30);
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

test('the inventory: sections by effect, a grid of tiles, dragged onto the quick shelf', async ({ page }, info) => {
  const errors = watchErrors(page);
  await newGame(page, { tutorial: false, seed: 'inventory-1' });
  const silver = 'wild-sp-silverleaf';
  // a few more herbs in the storeroom, not on the shelf
  const extra = await lab(page, (l) => {
    const ids = l.state.world.wild.filter((id) => !l.state.stock(id)).slice(0, 12);
    for (const id of ids) { l.state.inventory[id] = 80; l.state.bench.seen[id] = 1; }
    l.buildShelf();
    return ids;
  });
  await expect(page.locator(`.jar[data-id="${silver}"]`)).toBeVisible();
  await expect(page.locator(`.jar[data-id="${extra[0]}"]`)).toHaveCount(0);
  await page.click('[data-act=inventory]');
  const drawer = page.locator('.inv-drawer');
  await expect(drawer).toBeVisible();
  // the drawer fits the screen, and the shelf stays in view beside or below it
  const vw = page.viewportSize(), db = await drawer.boundingBox();
  if (!vw || !db) throw new Error('no box');
  expect(db.x + db.width).toBeLessThanOrEqual(vw.width + 1);
  expect(db.y + db.height).toBeLessThanOrEqual(vw.height + 1);
  await expect(page.locator('.shelf-wrap')).toBeInViewport();
  // a grid: tiles side by side, each with a rarity label and a stripe of its effects
  const boxes = await page.locator('.inv-tile').evaluateAll((els) => els.slice(0, 6).map((e) => e.getBoundingClientRect().top));
  expect(new Set(boxes.map(Math.round)).size, 'several tiles on one row').toBeLessThan(boxes.length);
  const tile = page.locator(`.inv-tile[data-id="${silver}"]`);
  await expect(tile.locator('.inv-rar')).toHaveText('COM');
  expect(await tile.locator('.inv-stripe i').count()).toBeGreaterThan(0);
  // a section shows its effect only
  await page.click('[data-act=inv-sec-vitality]');
  const groups = await page.locator('.inv-tile').evaluateAll((els) => [...new Set(els.map((e) => e.getAttribute('data-group')))]);
  expect(groups).toEqual(['vitality']);
  await shot(page, info, 'inventory-drawer');
  await page.click('[data-act=inv-sec-all]');
  // tap: off the shelf (and it stays off after a reload)
  await tile.click();
  await expect(page.locator(`.jar[data-id="${silver}"]`)).toHaveCount(0);
  // drag a tile onto the shelf, before its second jar
  const id = extra[0];
  const t = await page.locator(`.inv-tile[data-id="${id}"]`).boundingBox();
  const jar = await page.locator('.shelf .jar').nth(1).boundingBox();
  if (!t || !jar) throw new Error('no boxes');
  if (info.project.use.hasTouch) {
    const cdp = await page.context().newCDPSession(page);
    const touch = (type, x, y) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] });
    await touch('touchStart', t.x + t.width / 2, t.y + t.height / 2);
    await page.waitForTimeout(320);
    for (let k = 1; k <= 20; k++) { await touch('touchMove', t.x + t.width / 2 + (jar.x + 4 - t.x - t.width / 2) * k / 20, t.y + t.height / 2 + (jar.y + jar.height / 2 - t.y - t.height / 2) * k / 20); await page.waitForTimeout(16); }
    await touch('touchEnd');
  } else {
    await page.mouse.move(t.x + t.width / 2, t.y + t.height / 2);
    await page.mouse.down();
    for (let k = 1; k <= 20; k++) await page.mouse.move(t.x + t.width / 2 + (jar.x + 4 - t.x - t.width / 2) * k / 20, t.y + t.height / 2 + (jar.y + jar.height / 2 - t.y - t.height / 2) * k / 20);
    await page.mouse.up();
  }
  await expect(page.locator(`.shelf .jar`).nth(1)).toHaveAttribute('data-id', id);
  await page.click('[data-act=inv-close]');
  await expect(drawer).toBeHidden();
  await lab(page, (l) => l.save());
  await page.reload();
  await page.click('[data-act=continue]');
  await page.waitForSelector('canvas.view-canvas');
  await expect(page.locator(`.jar[data-id="${silver}"]`)).toHaveCount(0);
  await expect(page.locator(`.shelf .jar`).nth(1)).toHaveAttribute('data-id', id);
  expect(errors).toEqual([]);
});
