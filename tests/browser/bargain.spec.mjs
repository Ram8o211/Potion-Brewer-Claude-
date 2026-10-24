// Bargaining over the same bottle is one conversation: stepping away keeps
// the rounds and costs the customer's patience, offering it again resumes
// the talks, and a new label re-prices the bottle without a fresh start.
import { test, expect } from '@playwright/test';
import { watchErrors, newGame, lab, pourRole, crushInPot } from './helpers.mjs';

/** Set the asking price to about `f` × what the customer would really pay, and ask. */
async function askAbout(page, f) {
  const want = await lab(page, (l, k) => l.state.current.haggle.reservation * k, f);
  const now = Number((await page.locator('.haggle .ask').innerText()).replace(/[^\d.]/g, ''));
  const steps = Math.round((want - now) / 5);
  for (let k = 0; k < Math.abs(steps); k++) await page.click(steps > 0 ? '[data-act=ask-up]' : '[data-act=ask-down]');
  await page.click('[data-act=ask-price]');
}

test('walking away keeps the talks; the same bottle resumes them; a new label remembers them', async ({ page }) => {
  const errors = watchErrors(page);
  await newGame(page, { tutorial: false, seed: 'bargain-resume' });
  await lab(page, (l) => {
    const st = l.state;
    st.current = { ...st.current, budget: 80, requirements: [{ key: 'vitality', kind: 'min', target: 6, tol: 0, zero: 8, label: 'at least 6%', effect: true }], effectOrder: true, bottleMl: 50, bottleN: 10, potionName: 'Healing Draught',
      customer: { ...st.current.customer, persona: { haggle: 0.75, patience: 5, honesty: 1, proof: 0 } } };
    l.refreshCustomer();
    l.views.counter.refresh();
  });
  await pourRole(page, 'water', 50);
  await pourRole(page, 'water', 50);
  await pourRole(page, 'wild-silverleaf', 50);
  await crushInPot(page);
  await page.click('[data-act=bottle]');
  await page.click('[data-act=bottle-50]');
  await expect(page.locator('[data-act=serve]')).toBeVisible({ timeout: 20_000 });
  await page.click('[data-act=label]');
  await page.click('[data-act=label-seal]');
  await page.click('[data-act=serve]');
  await expect(page.locator('.haggle-log')).toBeVisible();
  // one round above what they would pay: a counter-offer, the talks stay open
  await askAbout(page, 1.2);
  const after1 = await lab(page, (l) => { const n = l.state.current.haggle; return { state: n.state, round: n.round, patience: n.patience, offer: n.offer }; });
  expect(after1.state).toBe('open');
  expect(after1.round).toBe(1);
  // "Not today": the bottle stays, the customer remembers, and loses patience
  await page.click('[data-act=walk-away]');
  await expect(page.locator('.haggle-log')).toHaveCount(0);
  const away = await lab(page, (l) => { const n = l.state.current.haggle; return { state: n.state, round: n.round, patience: n.patience, offer: n.offer }; });
  expect(away).toEqual({ ...after1, patience: after1.patience - 1 });
  expect(await lab(page, (l) => !!l.state.vial)).toBe(true);
  // offering the same bottle again picks up where it was left
  await page.click('[data-act=serve]');
  await expect(page.locator('.haggle-log .line.you')).toHaveCount(1);
  expect(await lab(page, (l) => l.state.current.haggle.round)).toBe(1);
  // every time open talks are left hanging, their patience wears thinner
  await page.click('[data-act=walk-away]');
  expect(await lab(page, (l) => l.state.current.haggle.patience)).toBe(away.patience - 1);
  // a new label re-prices the bottle, but the haggling so far is not forgotten
  await page.click('[data-act=label]');
  await page.click('.label-row[data-claim=vitality]');
  await page.click('[data-act=claim-up-vitality]');
  await page.click('[data-act=label-seal]');
  await page.click('[data-act=serve]');
  await expect(page.locator('.haggle-log')).toContainText('with a new label');
  const relabelled = await lab(page, (l) => { const n = l.state.current.haggle; return { round: n.round, patience: n.patience }; });
  expect(relabelled).toEqual({ round: 1, patience: away.patience - 1 });
  expect(errors).toEqual([]);
});
