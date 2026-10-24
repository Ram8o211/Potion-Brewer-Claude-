// Reversible bottling through the real UI: bottle a measured amount, test a
// dose of the sealed vial, pour the rest back from the counter. Matter is
// conserved, the dose is gone for good, the cauldron learns only its share
// of what the batch was made of, and — poured back into the unchanged batch
// it came from — its trials still describe it.
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
  expect(back.rev, 'the unchanged batch it came from: still the same tested brew').toBe(dosed.rev);
  // provenance: the share of the batch that came back, not the whole batch
  const ml = dosed.n * 5;
  expect(back.log.type).toBe('vial');
  expect(back.log.ml).toBe(ml);
  const sum = back.log.parts.reduce((a, p) => a + p.ml, 0);
  expect(Math.abs(sum - ml)).toBeLessThan(0.5 * back.log.parts.length);
  expect(sum).toBeLessThan(bottled.batch);
  expect(errors).toEqual([]);
});

test('a tested bottle keeps its label through the shelf, a pour back into the empty cauldron and bottling again', async ({ page }) => {
  const errors = watchErrors(page);
  await newGame(page, { tutorial: false, seed: 'pour-back-label' });
  await pourRole(page, 'water', 150);
  await pourRole(page, 'wild-silverleaf', 100);
  // two trials of the batch (its label is drafted from them), then the whole cauldron onto the shelves
  await page.click('[data-act=tab-trials]');
  for (let k = 0; k < 2; k++) {
    await page.click('[data-act=test-rabbit]');
    await expect(page.locator('.trial-report .report')).toBeVisible();
  }
  await page.click('[data-act=tab-brew]');
  await page.click('[data-act=bottle]');
  await page.click('[data-act=bottle-dest-shelf]');
  await page.click('[data-act=bottle-all]');
  await page.waitForFunction(() => !(/** @type {any} */ (window)).__alchemist.screen.bottling, null, { timeout: 20_000 });
  // the player writes a claim of their own on it, which must survive too
  const mine = await lab(page, (l) => { const c = l.state.bottles[0].label.claims.vitality; c.value = Math.round(((c.value || 0) + 1.5) * 10) / 10; c.source = 'player'; return c.value; });
  const shelved = await lab(page, (l) => { const b = l.state.bottles[0]; return { id: b.id, n: l.sim.p.count, claims: b.label && Object.fromEntries(Object.entries(b.label.claims).map(([k, c]) => [k, [c.kind, c.source, c.value ?? null]])) }; });
  expect(shelved.n, 'the cauldron is empty').toBe(0);
  // poured back into the empty cauldron, then bottled again: the same tested label
  await page.click('[data-act=tab-counter]');
  await page.locator('[data-act=bottle-slot]').first().click();
  await page.click('[data-act=pour-back-bottle]');
  await page.click('[data-act=tab-brew]');
  await page.click('[data-act=bottle]');
  await page.click('[data-act=bottle-all]');
  await expect(page.locator('[data-act=serve]')).toBeVisible({ timeout: 20_000 });
  const again = await lab(page, (l) => { const v = l.state.vial; return v.label && Object.fromEntries(Object.entries(v.label.claims).map(([k, c]) => [k, [c.kind, c.source, c.value ?? null]])); });
  expect(again).toEqual(shelved.claims);
  expect(again && again.vitality).toEqual(['value', 'player', mine]);
  expect(errors).toEqual([]);
});
