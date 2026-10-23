// Reversible bottling through the real UI: bottle a measured amount, test a
// dose of the sealed vial, pour the rest back from the counter. Matter is
// conserved, the dose is gone for good, the cauldron learns only its share
// of what the batch was made of, and earlier trials stop describing it.
import { test, expect } from '@playwright/test';
import { watchErrors, newGame, lab, pourRole } from './helpers.mjs';

test('bottle, test a dose of the vial, pour the rest back', async ({ page }) => {
  const errors = watchErrors(page);
  await newGame(page, { tutorial: false, seed: 'pour-back-ui' });
  await pourRole(page, 'water', 150);
  await pourRole(page, 'wild-silverleaf', 50);
  const n0 = await lab(page, (l) => l.sim.p.count);
  await page.click('[data-act=bottle]');
  await page.click('[data-act=bottle-50]');
  await expect(page.locator('[data-act=serve]')).toBeVisible({ timeout: 20_000 });
  const bottled = await lab(page, (l) => ({ n: l.sim.p.count, vial: l.state.vial.particles.length, ml: l.state.vial.ml, batch: l.state.vial.parts.reduce((a, p) => a + p.ml, 0) }));
  expect(bottled.n + bottled.vial, 'bottling moves particles, it does not copy them').toBe(n0);
  // a dose of the sealed vial
  await page.click('[data-act=test-vial]');
  await page.click('[data-act=test-rabbit]');
  const dosed = await lab(page, (l) => ({ ml: l.state.vial.ml, n: l.state.vial.particles.length, rev: l.state.batch.rev }));
  expect(dosed.ml).toBe(bottled.ml - 10);
  // pour the rest back from the trials room
  await page.click('[data-act=trials-pour-back]');
  const back = await lab(page, (l) => ({ n: l.sim.p.count, vial: l.state.vial, log: l.state.brewLog[l.state.brewLog.length - 1], rev: l.state.batch.rev }));
  expect(back.vial).toBeNull();
  expect(back.n, 'exactly what was left in the vial').toBe(bottled.n + dosed.n);
  expect(back.rev).toBeGreaterThan(dosed.rev);
  // provenance: the share of the batch that came back, not the whole batch
  const ml = dosed.n * 5;
  expect(back.log.type).toBe('vial');
  expect(back.log.ml).toBe(ml);
  const sum = back.log.parts.reduce((a, p) => a + p.ml, 0);
  expect(Math.abs(sum - ml)).toBeLessThan(0.5 * back.log.parts.length);
  expect(sum).toBeLessThan(bottled.batch);
  expect(errors).toEqual([]);
});
