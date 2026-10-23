// The integrated systems as a player meets them, through the real UI: the
// day dawning with the shop closed, an order that names its techniques and
// what to gather, brewing advice read off the cauldron, a trial's margin and
// evidence level, the recipe book's recorded steps, what a customer weighs
// in bargaining, and the alembic's receiver going back into its jar.
import { test, expect } from '@playwright/test';
import { watchErrors, shot, newGame, lab, pourDose } from './helpers.mjs';

/** Clear the toasts so a screenshot shows the room itself. @param {import('@playwright/test').Page} page */
const clean = (page) => page.evaluate(() => document.querySelectorAll('.toast').forEach((t) => t.remove()));

test('a day dawns closed; the order card says what it takes and where to find it', async ({ page }, info) => {
  const errors = watchErrors(page);
  await newGame(page, { tutorial: false, seed: 'integration-1', open: false });
  await page.click('[data-act=tab-counter]');
  await expect(page.locator('.counter-empty')).toContainText('still closed');
  await page.click('[data-act=tab-wilds]');
  await expect(page.locator('.wilds-sky')).toContainText('Dawn');
  await expect(page.locator('.wilds-sky')).toContainText('until you open the shop');
  // open the door: a customer, an order with a technique, and a plan of supplies
  await page.click('[data-act=tab-counter]');
  await lab(page, (l) => {
    const st = l.state;
    st.reputation = 70; // a journeyman's orders
  });
  await page.click('[data-act=next-customer]');
  await expect(page.locator('.customer-card')).toBeVisible();
  expect(await lab(page, (l) => l.state.opened)).toBe(true);
  await page.click('[data-act=tab-wilds]');
  await expect(page.locator('.wilds-sky')).toContainText('Midday');
  await page.click('[data-act=tab-counter]');
  // an order with a technique, generated with the game's own context
  await lab(page, async (l) => {
    // the dev server serves the source modules (browser-side imports, not resolved by the type checker)
    const src = '/src/game/';
    const mod = await import(/* @vite-ignore */ src + 'commissions.js');
    const rng = await import(/* @vite-ignore */ '/src/core/' + 'rng.js');
    const st = l.state;
    st.current = mod.generateCommission(st.commissionContext(), new rng.Rng('ui-tech'), { tier: 1, techniques: ['stable'] });
    l.refreshCustomer();
    l.views.counter.refresh();
  });
  await expect(page.locator('.tech-card')).toContainText('Well mixed');
  await expect(page.locator('.supply-card summary')).toContainText('ml of brew');
  await page.click('.supply-card summary');
  await expect(page.locator('.supply-card')).toContainText('Every one of them brings side effects');
  await clean(page);
  await page.locator('.tech-card').scrollIntoViewIfNeeded();
  await shot(page, info, 'order-techniques');
  // the order strip shows the stability requirement without a meter: no assay kit yet
  await page.click('[data-act=tab-brew]');
  await pourDose(page, await lab(page, (l) => l.state.world.roles.water), [100]);
  await expect(page.locator('.req-chip.unknown').first()).toBeVisible();
  expect(errors).toEqual([]);
});

test('advice read off the cauldron, a trial’s margin and level, and a recipe that keeps its steps', async ({ page }, info) => {
  const errors = watchErrors(page);
  await newGame(page, { tutorial: false, seed: 'integration-2' });
  const water = await lab(page, (l) => l.state.world.roles.water);
  // whole leaves (the mortar switched off): the advice chip says to crush them
  await lab(page, (l) => { l.pourGround = false; if (l.groundBtn) l.syncActions(); });
  await pourDose(page, water, [100]);
  await lab(page, (l) => { l.pourGround = false; });
  await pourDose(page, 'wild-silverleaf', [25]);
  const whole = await lab(page, (l) => { const p = l.sim.p; let n = 0; for (let i = 0; i < p.count; i++) if (p.phase[i] === 3) n++; return n; });
  if (whole >= 3) await expect(page.locator('[data-act=advice-chip]')).toBeVisible({ timeout: 5000 });
  // a proper brew: ground leaves and warmth
  await lab(page, (l) => { l.sim.clear(); l.state.brewLog = []; l.state.newBatch(); l.pourGround = true; });
  await pourDose(page, water, [100]);
  await pourDose(page, 'wild-silverleaf', [50]);
  await pourDose(page, 'wild-sunthistle', [25]);
  await lab(page, (l) => { l.setAutoStir(true); l.setFurnace(0.8); l.speed = 4; });
  await page.waitForFunction(() => { const p = window.__alchemist.screen.sim.p; let t = 0; for (let i = 0; i < p.count; i++) t += p.temp[i]; return t / p.count > 60; }, null, { timeout: 60_000, polling: 250 });
  await lab(page, (l) => l.setFurnace(0.15));
  await page.waitForTimeout(6000);
  await lab(page, (l) => { l.setFurnace(0); l.setAutoStir(false); l.speed = 1; });
  // one trial: a margin, never ±0, and the level "1 reading"
  await page.click('[data-act=tab-trials]');
  await page.click('[data-act=test-rabbit]');
  const row = page.locator('.reading').first();
  await expect(row).toHaveAttribute('data-level', 'preliminary');
  await expect(row.locator('.rv')).toContainText('1 reading');
  await expect(row.locator('.rv')).not.toContainText('±0 ');
  // a second rabbit corroborates it
  await lab(page, (l) => { const st = l.state; const other = st.colony.rabbits.find((r) => r.alive && r.id !== st.colony.focus); st.selectRabbit(other.id); l.views.trials.refresh(); });
  await page.click('[data-act=test-rabbit]');
  await expect(page.locator('.reading').first()).toHaveAttribute('data-level', /corroborated|certified/);
  await clean(page);
  await page.locator('.reading-rows').scrollIntoViewIfNeeded();
  await shot(page, info, 'trial-evidence');
  // save the brew as a recipe straight from its draft: its procedure has the steep
  const steps = await lab(page, (l) => { const m = l.assay; const r = l.recipeDraft(m, null, null); l.state.addRecipe({ ...r, name: 'Leaf tea' }); return r.steps.map((s) => s.op); });
  expect(steps[0]).toBe('pour');
  expect(steps).toContain('temp');
  await page.click('[data-act=tab-book]');
  await page.click('[data-act=book-recipes]');
  const card = page.locator('.view-book .item.recipe', { hasText: 'Leaf tea' });
  await expect(card).toBeVisible();
  await card.locator('details.steps summary').click();
  await expect(card.locator('.recipe-steps li', { hasText: 'Heat to' }).first()).toBeVisible();
  await expect(card).toHaveAttribute('data-confidence', 'tested');
  await clean(page);
  await card.scrollIntoViewIfNeeded();
  await shot(page, info, 'recipe-steps');
  expect(errors).toEqual([]);
});

test('bargaining shows what the customer weighs; the alembic’s distillate goes back into its jar', async ({ page }, info) => {
  const errors = watchErrors(page);
  await newGame(page, { tutorial: false, seed: 'integration-3' });
  const water = await lab(page, (l) => l.state.world.roles.water);
  await pourDose(page, water, [100]);
  await pourDose(page, 'wild-silverleaf', [50]);
  await page.click('[data-act=bottle]');
  const ml = await lab(page, (l) => l.state.current.bottleMl);
  await page.click(`[data-act=bottle-${ml}]`).catch(async () => { await page.locator('[data-act^=bottle-]').first().click(); });
  await expect(page.locator('[data-act=serve]')).toBeVisible({ timeout: 20_000 });
  await lab(page, (l) => { l.state.current.customer.persona.proof = 0.2; });
  await page.click('[data-act=serve]');
  await page.click('[data-act=label-seal]');
  await expect(page.locator('.haggle-why')).toContainText('Trust');
  await expect(page.locator('.haggle-why')).toContainText('Fit');
  await clean(page);
  await shot(page, info, 'bargain-reasons');
  await page.click('[data-act=walk-away]');
  // the alembic: a receiver of clean spirit (boiled off a tincture) goes back into its jar
  const spirit = await lab(page, (l) => l.state.world.roles.spirit);
  const s0 = await lab(page, (l, sp) => { const st = l.state; if (!st.has('alembic')) st.equipment.push('alembic'); st.receiver = { count: 10, comp: { [sp]: 10 }, color: [0.7, 0.8, 0.9] }; l.showView('brew'); l.updateChips(); return st.stock(sp); }, spirit);
  await page.click('[data-act=receiver]');
  await page.click('[data-act=receiver-jar]');
  expect(await lab(page, (l, sp) => l.state.stock(sp), spirit)).toBe(s0 + 50);
  expect(await lab(page, (l) => l.state.receiver)).toBeNull();
  expect(errors).toEqual([]);
});
