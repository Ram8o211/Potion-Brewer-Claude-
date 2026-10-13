// The first commission played through the real UI: dose buttons, stirring
// with a pointer (touch events on phone projects), the fire control and
// bottling — then the customer pays.
import { test, expect } from '@playwright/test';
import { watchErrors, shot, newGame, lab, drag, stirPath } from './helpers.mjs';

test('tutorial commission from first pour to payment', async ({ page }, info) => {
  const errors = watchErrors(page);
  await newGame(page, { tutorial: true });
  await page.click('[data-act=tutorial-next]');
  await page.waitForTimeout(200);
  await page.click('[data-act=tutorial-next]').catch(() => {});
  const roles = await lab(page, (l) => l.state.world.roles);
  const before = await lab(page, (l, id) => ({ coins: l.state.coins, rep: l.state.reputation, essence: l.state.stock(id) }), roles.essenceA);
  // 150 ml of water
  await page.click(`.jar[data-id="${roles.water}"]`);
  await page.click('[data-act=dose-100]');
  await page.waitForFunction(() => !window.__alchemist.screen.sim.emitter.pouring);
  await page.click('[data-act=dose-50]');
  await page.waitForFunction(() => !window.__alchemist.screen.sim.emitter.pouring);
  // 75 ml of the essence
  await page.click(`.jar[data-id="${roles.essenceA}"]`);
  await page.click('[data-act=dose-50]');
  await page.waitForFunction(() => !window.__alchemist.screen.sim.emitter.pouring);
  await page.click('[data-act=dose-25]');
  await page.waitForFunction(() => !window.__alchemist.screen.sim.emitter.pouring);
  const ml = await lab(page, (l) => l.sim.p.count * 5);
  expect(ml).toBe(225);
  const essenceLeft = await lab(page, (l, id) => l.state.stock(id), roles.essenceA);
  expect(essenceLeft, 'poured reagents are charged to the inventory').toBe(before.essence - 75);
  await shot(page, info, 'tutorial-poured');
  // stir with the spoon until the colour is even
  await page.click('[data-act=tool-spoon]');
  await drag(page, await stirPath(page, 4, 160));
  const spread = await lab(page, (l) => {
    const p = l.sim.p, sp = l.sim.species, s = sp.slotOf.get(l.state.world.roles.essenceA);
    let mn = 1, mx = 0;
    for (let i = 0; i < p.count; i++) { const f = p.comp[i * 16 + s]; mn = Math.min(mn, f); mx = Math.max(mx, f); }
    return mx - mn;
  });
  expect(spread, 'stirring evens out the essence').toBeLessThan(0.35);
  await shot(page, info, 'tutorial-stirred');
  // heat to the requested temperature with the fire control, then ease off
  await page.locator('input[aria-label="Fire and frost control"]').fill('90');
  await page.waitForFunction(() => {
    const p = window.__alchemist.screen.sim.p;
    let t = 0;
    for (let i = 0; i < p.count; i++) t += p.temp[i];
    return t / p.count > 44;
  }, null, { timeout: 60_000, polling: 250 });
  await page.locator('input[aria-label="Fire and frost control"]').fill('15');
  await shot(page, info, 'tutorial-heated');
  // bottle and get paid
  await page.click('[data-act=bottle]');
  await expect(page.locator('[data-act=result-continue]')).toBeVisible({ timeout: 20_000 });
  await shot(page, info, 'tutorial-result');
  await page.fill('.overlay input[aria-label="Recipe name"]', 'Mabry\'s tonic');
  await page.click('[data-act=save-recipe]');
  await page.click('[data-act=result-continue]');
  await page.waitForTimeout(800);
  const result = await lab(page, (l) => ({ coins: l.state.coins, rep: l.state.reputation, served: l.state.stats.served, last: l.state.history[0] }));
  expect(result.served).toBe(1);
  expect(result.last.stars).toBeGreaterThanOrEqual(3);
  expect(result.coins).toBeGreaterThan(before.coins);
  expect(result.rep).toBeGreaterThan(before.rep);
  // the shop door opens for the next customer
  await page.click('[data-act=next-customer]');
  await page.waitForTimeout(500);
  const next = await lab(page, (l) => !!l.state.current && !l.state.current.tutorial);
  expect(next, 'the next customer arrives').toBe(true);
  // the saved recipe is in the book and can be prepared again (charging stock)
  await lab(page, (l) => l.sim.clear());
  const stock0 = await lab(page, (l, id) => l.state.stock(id), roles.essenceA);
  await page.click('[data-act=recipes]');
  await expect(page.locator('.overlay .modal', { hasText: 'Mabry' })).toBeVisible();
  await page.locator('.overlay [data-act=prepare]').first().click();
  await page.waitForFunction(() => window.__alchemist.screen.sim.p.count >= 45 && !window.__alchemist.screen.sim.emitter.pouring, null, { timeout: 30_000 });
  expect(await lab(page, (l) => l.sim.p.count * 5)).toBe(225);
  expect(await lab(page, (l, id) => l.state.stock(id), roles.essenceA)).toBe(stock0 - 75);
  expect(errors).toEqual([]);
});

test('tools switch and act on the brew', async ({ page }) => {
  const errors = watchErrors(page);
  await newGame(page, { tutorial: false });
  const roles = await lab(page, (l) => l.state.world.roles);
  await page.click(`.jar[data-id="${roles.water}"]`);
  await page.click('[data-act=dose-100]');
  await page.waitForFunction(() => !window.__alchemist.screen.sim.emitter.pouring);
  for (const t of ['spoon', 'probe', 'pour']) {
    const btn = page.locator(`[data-act=tool-${t}]`);
    if (!(await btn.count())) continue;
    await btn.click();
    expect(await lab(page, (l) => l.tool)).toBe(t);
  }
  // pouring by holding inside the cauldron
  await page.click(`.jar[data-id="${roles.oil}"]`);
  const n0 = await lab(page, (l) => l.sim.p.count);
  const box = await page.locator('canvas.view').boundingBox();
  if (!box) throw new Error('no canvas');
  const touch = !!(await page.evaluate(() => navigator.maxTouchPoints));
  if (touch) {
    const cdp = await page.context().newCDPSession(page);
    const pt = [{ x: box.x + box.width * 0.5, y: box.y + box.height * 0.4, id: 1 }];
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: pt });
    await page.waitForTimeout(900);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  } else {
    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.4);
    await page.mouse.down();
    await page.waitForTimeout(900);
    await page.mouse.up();
  }
  await page.waitForTimeout(1500);
  const n1 = await lab(page, (l) => l.sim.p.count);
  expect(n1, 'holding in the cauldron pours').toBeGreaterThan(n0);
  // the measuring vial shows what the tap would draw
  await page.locator('[data-act=sample]:visible').first().click();
  await expect(page.locator('.overlay .modal', { hasText: 'Test vial' })).toBeVisible();
  await page.locator('.overlay .modal-head .btn').first().click();
  // the lid toggles
  const lid0 = await lab(page, (l) => l.sim.cauldron.lidClosed);
  await page.locator('[data-act=lid]:visible').first().click();
  expect(await lab(page, (l) => l.sim.cauldron.lidClosed)).toBe(!lid0);
  expect(errors).toEqual([]);
});
