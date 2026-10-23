// The rabbit colony through the real UI: choosing and dosing individuals,
// the dropper onto a rabbit, replaying a trial without spending anything,
// death, remains on the shelf (kept across a reload), buying until the
// hutch is full, a night in the hutch, and the sandbox's next-day button.
import { test, expect } from '@playwright/test';
import { watchErrors, shot, newGame, lab, drag, pourDose, startSandbox } from './helpers.mjs';

test('choose a rabbit, dose it, replay the trial for free', async ({ page }, info) => {
  const errors = watchErrors(page);
  await newGame(page, { tutorial: false, seed: 'colony-ui-1' });
  const roles = await lab(page, (l) => l.state.world.roles);
  await pourDose(page, roles.water, [100]);
  await pourDose(page, roles.essenceA, [100]);
  await page.click('[data-act=tab-trials]');
  await expect(page.locator('.rabbit-tile[data-rabbit]')).toHaveCount(2);
  await expect(page.locator('canvas.hutch-scene')).toBeVisible();
  await page.click('.rabbit-tile[data-rabbit=r2]');
  await expect(page.locator('.rabbit-tile[data-rabbit=r2]')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('.rabbit-detail .rd-title')).toContainText('Bramble');
  const n0 = await lab(page, (l) => l.sim.p.count);
  await page.click('[data-act=test-rabbit]');
  expect(await lab(page, (l) => l.sim.p.count), 'a real 10 ml dose').toBe(n0 - 2);
  const rec = await lab(page, (l) => l.state.trials.records[0]);
  expect(rec.rabbitId).toBe('r2');
  await expect(page.locator('.trial-report .report').first()).toContainText('Bramble');
  await expect(page.locator('.estimate-card .rv').first()).toContainText('±');
  await shot(page, info, 'colony-dosed');
  // the dropper onto a rabbit in the roster doses that rabbit (a tall
  // window, so the dropper and the roster are both on screen)
  await page.setViewportSize({ width: page.viewportSize().width, height: 1700 });
  await page.locator('.dropper').scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.locator('.view-trials').evaluate((el) => { el.scrollTop = 0; });
  const from = await page.locator('.dropper').boundingBox();
  const to = await page.locator('.rabbit-tile[data-rabbit=r1] canvas').boundingBox();
  if (!from || !to) throw new Error('no boxes');
  const pts = [];
  for (let k = 0; k <= 20; k++) pts.push({ x: from.x + 20 + (to.x + to.width / 2 - from.x - 20) * (k / 20), y: from.y + 20 + (to.y + to.height / 2 - from.y - 20) * (k / 20) });
  await drag(page, pts, 20);
  expect(await lab(page, (l) => l.state.trials.records[0].rabbitId)).toBe('r1');
  // replay: nothing is consumed or changed
  // (the hutch lives in real time — marks fade, health creeps back — so compare what a dose would change)
  const before = await lab(page, (l) => ({ n: l.sim.p.count, recs: l.state.trials.records.length, coins: l.state.coins, colony: JSON.stringify(l.state.colony.rabbits.map((r) => [r.id, r.trials, r.doses.length, r.alive, r.traits])) }));
  await page.click('[data-act=replay-trial]');
  await page.waitForTimeout(900);
  await shot(page, info, 'colony-replay');
  await page.waitForTimeout(2600);
  const after = await lab(page, (l) => ({ n: l.sim.p.count, recs: l.state.trials.records.length, coins: l.state.coins, colony: JSON.stringify(l.state.colony.rabbits.map((r) => [r.id, r.trials, r.doses.length, r.alive, r.traits])) }));
  expect(after).toEqual(before);
  expect(errors).toEqual([]);
});

test('a rabbit dies; its body keeps its look; its remains go to the shelf once and survive a reload', async ({ page }, info) => {
  const errors = watchErrors(page);
  await newGame(page, { tutorial: false, seed: 'colony-ui-2' });
  // a hard life: love and change, then fire
  await lab(page, (l) => {
    const st = l.state, NE = 10;
    const dose = (o) => { const e = new Array(NE).fill(0); for (const [k, v] of Object.entries(o)) e[['vitality', 'strength', 'love', 'arcana', 'transformation', 'fire', 'frost', 'acidity', 'toxicity', 'death'].indexOf(k)] = v; return { effects: e, resonance: [], color: [0.6, 0.2, 0.2], temperature: 20 }; };
    const ctx = { ml: 25, source: 'cauldron', batchId: st.batch.id, rev: st.batch.rev, theory: new Array(NE).fill(0), parts: [], rabbitId: 'r1' };
    st.recordTrial('rabbit', dose({ love: 16, transformation: 12, arcana: 10 }), ctx);
    st.recordTrial('rabbit', dose({ fire: 120 }), ctx);
    l.showView('trials');
    l.views.trials.refresh();
  });
  await expect(page.locator('.rabbit-tile[data-rabbit=r1]')).toHaveClass(/dead/);
  // the body is drawn, in colour, not blanked
  const ink = await page.locator('.rabbit-tile[data-rabbit=r1] canvas').evaluate((cv) => {
    const c = /** @type {HTMLCanvasElement} */ (cv);
    const d = /** @type {CanvasRenderingContext2D} */ (c.getContext('2d')).getImageData(0, 0, c.width, c.height).data;
    let n = 0;
    for (let i = 3; i < d.length; i += 4) n += d[i] > 0 ? 1 : 0;
    return n;
  });
  expect(ink).toBeGreaterThan(200);
  await page.click('.rabbit-tile[data-rabbit=r1]');
  await shot(page, info, 'colony-dead');
  await page.click('[data-act=rabbit-remains]');
  await page.click('.overlay .modal-foot .btn.gold');
  await expect(page.locator('.rabbit-tile[data-rabbit=r1]')).toHaveCount(0);
  const ids = await lab(page, (l) => l.state.colony.memorial[0].parts);
  expect(ids.some((id) => id.endsWith('-bone'))).toBe(true);
  await page.click('[data-act=tab-brew]');
  await expect(page.locator(`.jar[data-id="${ids[0]}"]`)).toBeVisible();
  await shot(page, info, 'colony-remains-shelf');
  await lab(page, (l) => l.save());
  await page.reload();
  await page.click('[data-act=continue]');
  await page.waitForSelector('canvas.view-canvas');
  await expect(page.locator(`.jar[data-id="${ids[0]}"]`)).toBeVisible();
  expect(await lab(page, (l) => l.state.colony.memorial[0].id)).toBe('r1');
  expect(errors).toEqual([]);
});

test('buy until the hutch is full; a night brings kits and a hutch report', async ({ page }, info) => {
  const errors = watchErrors(page);
  await newGame(page, { tutorial: false, seed: 'colony-ui-3' });
  await lab(page, (l) => { l.state.coins = 200; l.refreshHud(true); });
  await page.click('[data-act=tab-trials]');
  await page.click('[data-act=colony-buy]');
  await expect(page.locator('.rabbit-tile[data-rabbit]')).toHaveCount(3);
  await page.click('[data-act=colony-buy]');
  await expect(page.locator('.rabbit-tile[data-rabbit]')).toHaveCount(4);
  await expect(page.locator('[data-act=colony-buy]')).toBeDisabled();
  await page.click('[data-act=colony-feed]');
  await expect(page.locator('[data-act=colony-feed]')).toBeDisabled();
  await shot(page, info, 'colony-hutch');
  // Clover is due today: end the day
  await lab(page, (l) => {
    const st = l.state;
    st.colony.rabbits = st.colony.rabbits.slice(0, 2);
    st.colony.rabbits[0].pregnant = { sire: 'r2', due: st.day + 1 };
    st.current = null; st.customerIndex = st.customersPerDay;
    l.endDay();
  });
  await expect(page.locator('.overlay [data-summary=hutch]')).toContainText('Kits born');
  await shot(page, info, 'colony-night');
  await page.click('[data-act=next-day]');
  await page.click('[data-act=tab-trials]');
  expect(await page.locator('.rabbit-tile[data-rabbit]').count()).toBeGreaterThan(2);
  expect(errors).toEqual([]);
});

test('the sandbox hutch lets a night pass by hand', async ({ page }) => {
  const errors = watchErrors(page);
  await startSandbox(page);
  await page.click('[data-act=tab-trials]');
  const d0 = await lab(page, (l) => l.state.day);
  await page.click('[data-act=colony-day]');
  expect(await lab(page, (l) => l.state.day)).toBe(d0 + 1);
  expect(await lab(page, (l) => l.state.colony.day)).toBe(d0 + 1);
  expect(errors).toEqual([]);
});
