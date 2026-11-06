// Temperature runes set in the rock underground in the wilds: struck a few
// times, like a crystal, a rune stone breaks out and its rune goes to the
// cellar's stock.
import { test, expect } from '@playwright/test';
import { newGame, lab, watchErrors, shot } from './helpers.mjs';

test('a rune stone in the rock breaks out after a few blows', async ({ page }, info) => {
  const errors = watchErrors(page);
  await newGame(page, { tutorial: false });
  await page.click('[data-act=tab-wilds]');
  await page.waitForFunction(() => { const w = /** @type {any} */ (window).__alchemist.screen.views.wilds; return !!w.bg && w.caches().length > 0; });
  // (no wild animal standing over the stone: a tap on one strikes it instead)
  await lab(page, (l) => { l.views.wilds.wildlife = false; });
  const c = await lab(page, (l) => l.views.wilds.caches()[0]);
  const need = await lab(page, (l, id) => l.views.wilds.runeStrikes({ id }), c.id);
  expect(need, 'more than one blow').toBeGreaterThan(1);
  // it lies under the ground: rock above it, not open air
  expect(await lab(page, (l, k) => l.views.wilds.solidAt(k.x, k.y - 7), c)).toBe(true);
  await expect(page.locator('.rune-chip')).toContainText('runes underground');
  const r0 = await lab(page, (l) => l.state.cellar.runes);
  const hit = async () => {
    const box = await lab(page, () => { const r = window.__alchemist.screen.views.wilds.canvas.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; });
    await page.mouse.click(box.x + ((c.x + 0.5) / 384) * box.w, box.y + ((c.y + 0.5) / 216) * box.h);
    await page.waitForTimeout(300);
  };
  for (let k = 1; k < need; k++) await hit();
  expect(await lab(page, (l) => l.state.cellar.runes), 'still in the rock').toBe(r0);
  expect(await lab(page, (l, id) => l.views.wilds.runeHits[id].n, c.id)).toBe(need - 1);
  await hit();
  expect(await lab(page, (l) => l.state.cellar.runes), 'broken out: a rune for the cellar').toBe(r0 + 1);
  expect(await lab(page, (l, id) => l.views.wilds.caches().find((x) => x.id === id).dug, c.id)).toBe(true);
  await shot(page, info, 'rune-broken-out');
  expect(errors).toEqual([]);
});
