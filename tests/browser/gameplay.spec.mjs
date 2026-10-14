// The core loop played through the real UI: the guided first order (garden,
// dose buttons, stirring with a pointer — touch events on phone projects —,
// a creature test, the Potion ID sliders, bottling, haggling), the label
// gate, certification, returning customers, tools, dragging a jar and the
// mortar.
import { test, expect } from '@playwright/test';
import { watchErrors, shot, newGame, lab, drag, stirPath, pourDose, coveredControls } from './helpers.mjs';

test('the guided first order: harvest, brew, test on a creature, write the ID, bottle and haggle', async ({ page }, info) => {
  const errors = watchErrors(page);
  await newGame(page, { tutorial: true, seed: 'guided-1' });
  const roles = await lab(page, (l) => l.state.world.roles);
  const coach = page.locator('.coach-text');
  const step = async (sel) => {
    expect(await coveredControls(page, '.coach'), 'the coach bar covers a control').toEqual([]);
    await page.locator(sel).first().click();
    await page.waitForTimeout(200);
  };
  await expect(coach).toContainText('healing');
  await step('[data-act=tutorial-next]');
  await expect(coach).toContainText('garden');
  await step('[data-act=tab-garden]');
  await step('[data-act=harvest-well]');
  await step('[data-act=harvest-dew-a]');
  expect(await lab(page, (l, id) => l.state.stock(id), roles.dew)).toBeGreaterThan(50);
  await shot(page, info, 'guided-garden');
  await step('[data-act=tab-brew]');
  await step(`.jar[data-id="${roles.water}"]`);
  await step('[data-act=dose-50]');
  await page.waitForFunction(() => !window.__alchemist.screen.sim.emitter.pouring);
  await step(`.jar[data-id="${roles.dew}"]`);
  await step('[data-act=dose-50]');
  await page.waitForFunction(() => !window.__alchemist.screen.sim.emitter.pouring);
  expect(await lab(page, (l) => l.sim.p.count * 5)).toBe(100);
  await expect(coach).toContainText('Stir');
  await step('[data-act=tool-spoon]');
  await drag(page, await stirPath(page, 5, 200));
  await expect(coach).toContainText('testing room', { timeout: 10_000 });
  await step('[data-act=tab-testing]');
  const n0 = await lab(page, (l) => l.sim.p.count);
  await step('[data-act=dose-toad]');
  expect(await lab(page, (l) => l.sim.p.count), 'a real 10 ml dose left the cauldron').toBe(n0 - 2);
  const rec = await lab(page, (l) => l.state.lab.records[0]);
  expect(rec.creature).toBe('toad');
  expect(Object.keys(rec.levels).sort()).toEqual(['bane', 'charm', 'vitality']);
  // the creatures show, they never tell: no numbers on the cages
  const cageText = await page.locator('.creature').allInnerTexts();
  for (const t of cageText) expect(t, 'no readings written on a creature card').not.toMatch(/\d/);
  await page.waitForTimeout(1800);
  await shot(page, info, 'guided-toad');
  // write the ID with the sliders, from what the toad showed
  const set = async (key, v) => {
    await page.locator(`input[data-prop=${key}]`).evaluate((el, x) => { /** @type {HTMLInputElement} */ (el).value = String(x); el.dispatchEvent(new Event('input')); el.dispatchEvent(new Event('change')); }, v);
  };
  await set('vitality', Math.round(rec.levels.vitality / 5) * 5);
  await set('charm', Math.round(rec.levels.charm / 5) * 5);
  // everything the toad did not show is 0: one real tap on the coach's target
  await expect(coach).toContainText('0');
  await step('[data-act=id-rest-zero]');
  expect(await lab(page, (l) => Object.values(l.state.idCard.values).every((v) => Number.isFinite(v)))).toBe(true);
  await expect(coach).toContainText('Bottle');
  await step('[data-act=tab-brew]');
  await step('[data-act=bottle]');
  await expect(page.locator('[data-act=sell]')).toBeVisible({ timeout: 20_000 });
  const vial = await lab(page, (l) => l.state.vial);
  expect(vial.label.values.vitality).toBe(Math.round(rec.levels.vitality / 5) * 5);
  await shot(page, info, 'guided-vial');
  const before = await lab(page, (l) => ({ coins: l.state.coins, rep: l.state.reputation }));
  await step('[data-act=sell]');
  await expect(page.locator('.haggle')).toBeVisible();
  await shot(page, info, 'guided-haggle');
  // ask for more, then take what they offer
  await step('[data-act=ask-p5]');
  await step('[data-act=ask]');
  await step('[data-act=take-offer]');
  await page.waitForTimeout(500);
  const after = await lab(page, (l) => ({ coins: l.state.coins, rep: l.state.reputation, served: l.state.stats.served, vial: l.state.vial, sale: l.state.sales[0] }));
  expect(after.served).toBe(1);
  expect(after.vial).toBeNull();
  expect(after.coins).toBeGreaterThan(before.coins);
  expect(after.rep).toBeGreaterThan(before.rep);
  expect(after.sale.complaint, 'a genuine healing draught does not come back').toBeNull();
  await expect(coach).toContainText('refund');
  // the customer leaves happy; what they paid stays on the counter
  await expect(page.locator('.parting .outcome.ok')).toContainText(String(after.sale.price));
  await shot(page, info, 'guided-sold');
  await step('[data-act=tutorial-next]');
  await expect(page.locator('.coach')).toBeHidden();
  // the player lets the next customer in
  await step('[data-act=next-customer]');
  await page.waitForFunction(() => { const s = window.__alchemist.screen.state; return !!s.current && !s.current.tutorial; }, null, { timeout: 10_000 });
  expect(errors).toEqual([]);
});

test('a customer only haggles over a label that promises what they need; an expert certifies the truth', async ({ page }, info) => {
  const errors = watchErrors(page);
  await newGame(page, { tutorial: false, seed: 'label-gate-1' });
  const roles = await lab(page, (l) => l.state.world.roles);
  await lab(page, (l) => {
    const st = l.state;
    st.current = { ...st.current, requirements: [{ key: 'vitality', min: 10, max: 100, kind: 'want' }, { key: 'bane', min: 0, max: 10, kind: 'limit' }], bottleMl: 50, bottleN: 10, haggle: null };
    st.inventory[st.world.roles.dew] = 200;
    st.coins = 300;
    l.buildShelf();
    l.refreshCustomer();
    l.views.counter.refresh();
  });
  await pourDose(page, roles.dew, [50, 25]);
  await page.click('[data-act=bottle]');
  await expect(page.locator('[data-act=sell]')).toBeVisible({ timeout: 20_000 });
  // no ID yet: the counter says so, in words, and the customer will not haggle
  await expect(page.locator('.vial-hint')).toContainText('Potion ID');
  await page.click('[data-act=sell]');
  await expect(page.locator('.haggle')).toHaveCount(0);
  await expect(page.locator('.customer-card .speech')).toContainText('label');
  // a label promising too little: the customer says what is missing
  await lab(page, (l) => { l.state.writeId('vial', { vitality: 5, ardor: 0, frost: 0, levity: 0, charm: 0, bane: 0 }); l.views.counter.refresh(); });
  await expect(page.locator('.vial-hint.bad')).toBeVisible();
  await page.click('[data-act=sell]');
  await expect(page.locator('.haggle')).toHaveCount(0);
  await expect(page.locator('.customer-card .speech')).toContainText('Vitality');
  // the expert measures it exactly
  await page.click('[data-act=certify]');
  await page.locator('.overlay .modal-foot .btn', { hasText: 'Certify' }).click();
  const v = await lab(page, (l) => l.state.vial);
  expect(v.certified).toBeTruthy();
  expect(v.label.values.vitality).toBe(Math.round(v.m.magic[0]));
  await expect(page.locator('.vial-card .seal')).toBeVisible();
  await expect(page.locator('.vial-hint.ok')).toBeVisible();
  // the refusal answered the old label: it does not linger under the new one
  await expect(page.locator('.customer-card .speech')).not.toContainText('Vitality');
  await shot(page, info, 'certified-vial');
  await page.click('[data-act=sell]');
  // the haggle: their offer, my price, their patience — in words, and the customer speaks
  const hg = page.locator('.haggle');
  await expect(hg).toBeVisible();
  await expect(hg).toContainText('They offer');
  await expect(hg).toContainText('You ask');
  await expect(hg).toContainText('Patience');
  await expect(page.locator('.customer-card .speech')).toContainText('coins');
  const offer0 = await lab(page, (l) => l.state.current.haggle.offer);
  // the price can never go below their own offer
  for (let k = 0; k < 12; k++) if (await page.locator('[data-act=ask-m5]').isEnabled()) await page.click('[data-act=ask-m5]');
  await expect(page.locator('[data-act=ask-m5]')).toBeDisabled();
  await expect(page.locator('[data-act=ask]')).toContainText(String(offer0 + 1));
  // ask a little more than their offer: they come up, or shake on it
  await page.click('[data-act=ask-p5]');
  await page.click('[data-act=ask]');
  await page.waitForTimeout(300);
  const after = await lab(page, (l) => ({ h: l.state.current && l.state.current.haggle, sold: l.state.sales.length }));
  if (!after.sold) {
    expect(after.h.offer, 'they came up part of the way').toBeGreaterThan(offer0);
    await shot(page, info, 'haggle-counter');
    await page.click('[data-act=take-offer]');
  }
  await expect(page.locator('.parting')).toBeVisible();
  await expect(page.locator('[data-act=next-customer], [data-act=end-day]')).toBeVisible();
  const sale = await lab(page, (l) => l.state.sales[0]);
  expect(sale.price).toBeGreaterThanOrEqual(offer0);
  expect(sale.certified.vitality).toBe(v.label.values.vitality);
  expect(errors).toEqual([]);
});

test('returning customers: the refund cannot be avoided, but a certificate unmasks a bluff', async ({ page }, info) => {
  const errors = watchErrors(page);
  await newGame(page, { tutorial: false, seed: 'complaints-1' });
  // two past sales, both due: one uncertified that failed, one certified bluff
  await lab(page, (l) => {
    const st = l.state;
    const base = { day: 1, customer: st.current.customer, potion: 'Healing Draught', requirements: [{ key: 'vitality', min: 20, max: 100, kind: 'want' }], tier: 0, label: {}, truth: [5, 0, 0, 0, 0, 0], color: [0.5, 0.6, 0.4], ml: 100 };
    st.sales.push({ ...base, id: 's-fail', price: 40, certified: null, complaint: { kind: 'genuine', key: 'vitality', how: 'weak', due: 0 }, resolved: null });
    st.sales.push({ ...base, id: 's-bluff', price: 55, truth: [30, 0, 0, 0, 0, 0], certified: { vitality: 30, ardor: 0, frost: 0, levity: 0, charm: 0, bane: 0 }, complaint: { kind: 'bluff', key: 'vitality', how: 'weak', due: 0 }, resolved: null });
    st.current = null;
    st.coins = 100;
    l.bringCustomer(false);
    l.showView('counter');
  });
  await expect(page.locator('.customer-card.complaint')).toBeVisible();
  await expect(page.locator('[data-act=show-certificate]')).toHaveCount(0);
  await shot(page, info, 'complaint');
  await page.click('[data-act=refund]');
  expect(await lab(page, (l) => l.state.coins)).toBe(60);
  await expect(page.locator('.parting .outcome.bad')).toContainText('40');
  // the bluffer comes next — and is shown the certificate
  await page.click('[data-act=next-customer]');
  await page.waitForFunction(() => { const c = window.__alchemist.screen.state.current; return c && c.type === 'complaint'; }, null, { timeout: 10_000 });
  await expect(page.locator('[data-act=show-certificate]')).toBeVisible();
  await page.click('[data-act=show-certificate]');
  await expect(page.locator('.parting')).toContainText('Bluff caught');
  const st = await lab(page, (l) => ({ coins: l.state.coins, bluff: l.state.sales.find((s) => s.id === 's-bluff').resolved }));
  expect(st.bluff).toBe('caught');
  expect(st.coins, 'no refund (an award may be earned)').toBeGreaterThanOrEqual(60);
  expect(errors).toEqual([]);
});

test('tools switch and act on the brew', async ({ page }) => {
  const errors = watchErrors(page);
  await newGame(page, { tutorial: false });
  const roles = await lab(page, (l) => l.state.world.roles);
  await pourDose(page, roles.water, [50]);
  await page.locator('[data-act=tool-spoon]').click();
  expect(await lab(page, (l) => l.tool)).toBe('spoon');
  await expect(page.locator('[data-act=tool-probe]'), 'there is no inspection tool').toHaveCount(0);
  // pouring by holding inside the cauldron
  await page.click(`.jar[data-id="${roles.water}"]`);
  expect(await lab(page, (l) => l.tool)).toBe('pour');
  const n0 = await lab(page, (l) => l.sim.p.count);
  const box = await page.locator('canvas.view-canvas').boundingBox();
  if (!box) throw new Error('no canvas');
  const touch = !!(await page.evaluate(() => navigator.maxTouchPoints));
  if (touch) {
    const cdp = await page.context().newCDPSession(page);
    const pt = [{ x: box.x + box.width * 0.5, y: box.y + box.height * 0.4, id: 1 }];
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: pt });
    await page.waitForTimeout(700);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  } else {
    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.4);
    await page.mouse.down();
    await page.waitForTimeout(700);
    await page.mouse.up();
  }
  await page.waitForTimeout(1200);
  expect(await lab(page, (l) => l.sim.p.count), 'holding in the cauldron pours').toBeGreaterThan(n0);
  // what went in: names and millilitres only
  await page.click('[data-act=brew-info]');
  await expect(page.locator('.brew-panel')).toContainText(await lab(page, (l, id) => l.state.lookup(id).name, roles.water));
  await expect(page.locator('.brew-panel')).not.toContainText('g/ml');
  // the lid toggles
  const lid0 = await lab(page, (l) => l.sim.cauldron.lidClosed);
  await page.locator('[data-act=lid]:visible').first().click();
  expect(await lab(page, (l) => l.sim.cauldron.lidClosed)).toBe(!lid0);
  expect(errors).toEqual([]);
});

test('drag a jar onto the cauldron to pour; smash a stone in the mortar', async ({ page }) => {
  const errors = watchErrors(page);
  await newGame(page, { tutorial: false, seed: 'drag-pour-3' });
  const roles = await lab(page, (l) => l.state.world.roles);
  const jar = await page.locator(`.jar[data-id="${roles.water}"]`).boundingBox();
  const cv = await page.locator('canvas.view-canvas').boundingBox();
  if (!jar || !cv) throw new Error('no boxes');
  const pts = [{ x: jar.x + jar.width / 2, y: jar.y + jar.height / 2 }];
  for (let k = 1; k <= 30; k++) pts.push({ x: jar.x + jar.width / 2 + (cv.x + cv.width / 2 - jar.x - jar.width / 2) * (k / 30), y: jar.y + jar.height / 2 + (cv.y + cv.height * 0.4 - jar.y - jar.height / 2) * (k / 30) });
  for (let k = 0; k < 16; k++) pts.push({ x: cv.x + cv.width / 2 + Math.sin(k / 6) * 10, y: cv.y + cv.height * 0.4 });
  await drag(page, pts, 20);
  await page.waitForTimeout(800);
  expect(await lab(page, (l) => l.sim.p.count), 'dragging the jar onto the cauldron poured it').toBeGreaterThan(3);
  // a stone, smashed in the mortar, pours as powder
  const stone = roles.sunstone;
  await page.click(`.jar[data-id="${stone}"]`);
  await expect(page.locator('[data-act=ground]')).toBeVisible();
  await expect(page.locator('[data-act=ground]')).toHaveClass(/active/);
  await page.click('[data-act=dose-25]');
  await page.waitForFunction(() => !window.__alchemist.screen.sim.emitter.pouring);
  const grains = await lab(page, (l, id) => { const sp = l.sim.species, s = sp.slotOf.get(id); let g = 0, solid = 0; for (let i = 0; i < l.sim.p.count; i++) if (l.sim.p.comp[i * 16 + s] > 0.5) { if (l.sim.p.phase[i] === 1) g++; if (l.sim.p.phase[i] === 3) solid++; } return { g, solid }; }, stone);
  expect(grains.g, 'smashed stone arrives as powder').toBe(5);
  expect(grains.solid).toBe(0);
  expect(await lab(page, (l, id) => l.state.brewLog.some((e) => e.type === 'pour' && e.id === id && e.ground), stone)).toBe(true);
  expect(errors).toEqual([]);
});

test('No deal: the customer leaves with a word, and each pour is paid for once even when bottling empties the cauldron', async ({ page }) => {
  const errors = watchErrors(page);
  await newGame(page, { tutorial: false, seed: 'no-deal-1' });
  const roles = await lab(page, (l) => l.state.world.roles);
  await lab(page, (l) => {
    const st = l.state;
    st.current = { ...st.current, requirements: [{ key: 'vitality', min: 10, max: 100, kind: 'want' }], bottleMl: 200, bottleN: 40, haggle: null };
    st.inventory[st.world.roles.dew] = 200;
    l.buildShelf(); l.refreshCustomer(); l.views.counter.refresh();
  });
  await pourDose(page, roles.dew, [50]);
  await pourDose(page, roles.water, [50]);
  const stock0 = await lab(page, (l, r) => ({ dew: l.state.stock(r.dew), water: l.state.stock(r.water) }), roles);
  // the order is bigger than the brew: bottling takes everything
  await page.click('[data-act=bottle]');
  await expect(page.locator('[data-act=sell]')).toBeVisible({ timeout: 20_000 });
  await page.waitForTimeout(800);
  const after = await lab(page, (l, r) => ({ n: l.sim.p.count, dew: l.state.stock(r.dew), water: l.state.stock(r.water), pours: l.state.brewLog.filter((e) => e.type === 'pour').length }), roles);
  expect(after.n).toBe(0);
  expect({ dew: after.dew, water: after.water }, 'nothing is charged again after the cauldron empties').toEqual(stock0);
  expect(after.pours, 'the new batch starts with no pours').toBe(0);
  // label it to match, offer, then turn the customer down
  await lab(page, (l) => { l.state.writeId('vial', { vitality: 40, ardor: 0, frost: 0, levity: 0, charm: 0, bane: 0 }); l.views.counter.refresh(); });
  await page.click('[data-act=sell]');
  await expect(page.locator('.haggle')).toBeVisible();
  await page.click('[data-act=refuse]');
  await expect(page.locator('.parting')).toContainText('Suit yourself');
  await expect(page.locator('[data-act=next-customer], [data-act=end-day]')).toBeVisible();
  expect(await lab(page, (l) => !!l.state.vial), 'the vial stays unsold on the counter').toBe(true);
  expect(errors).toEqual([]);
});

test('the guided order started from the menu mid-haggle waits for its own customer', async ({ page }) => {
  const errors = watchErrors(page);
  await newGame(page, { tutorial: false, seed: 'guided-late-1' });
  const roles = await lab(page, (l) => l.state.world.roles);
  await lab(page, (l) => {
    const st = l.state;
    st.stats.served = 5;
    st.current = { ...st.current, requirements: [{ key: 'vitality', min: 10, max: 100, kind: 'want' }], bottleMl: 50, bottleN: 10, haggle: null };
    st.inventory[st.world.roles.dew] = 200;
    l.buildShelf(); l.refreshCustomer(); l.views.counter.refresh();
  });
  await pourDose(page, roles.dew, [50]);
  await page.click('[data-act=bottle]');
  await expect(page.locator('[data-act=sell]')).toBeVisible({ timeout: 20_000 });
  await lab(page, (l) => { l.state.writeId('vial', { vitality: 40, ardor: 0, frost: 0, levity: 0, charm: 0, bane: 0 }); l.views.counter.refresh(); });
  await page.click('[data-act=sell]');
  await expect(page.locator('.haggle')).toBeVisible();
  // the regular customer is mid-haggle when the player asks for the guided order
  await page.click('[data-act=menu]');
  await page.click('[data-act=guided-order]');
  const coach = page.locator('.coach-text');
  await expect(coach).toContainText('healing');
  await page.waitForTimeout(400);
  await expect(coach, 'the coach does not jump ahead on someone else’s haggle').toContainText('healing');
  await page.click('[data-act=take-offer]');
  await page.waitForTimeout(400);
  await expect(coach, 'nor finish on someone else’s sale').not.toContainText('Sold!');
  // the tutorial's own customer is the next to come in
  await page.click('[data-act=next-customer]');
  expect(await lab(page, (l) => !!(l.state.current && l.state.current.tutorial))).toBe(true);
  expect(errors).toEqual([]);
});
