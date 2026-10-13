// Layout on every viewport: nothing overflows, the cauldron dominates, all
// controls are on screen and large enough to touch.
import { test, expect } from '@playwright/test';
import { watchErrors, shot, openGame, newGame, startSandbox, horizontalOverflow } from './helpers.mjs';

test('main menu fits the screen', async ({ page }, info) => {
  const errors = watchErrors(page);
  await openGame(page);
  await page.waitForTimeout(800);
  expect(await horizontalOverflow(page)).toBe(0);
  for (const act of ['new-game', 'sandbox', 'help', 'menu-settings']) await expect(page.locator(`[data-act=${act}]`)).toBeInViewport();
  await shot(page, info, 'menu');
  expect(errors).toEqual([]);
});

test('shop screen: cauldron, order, shelf and tools are all on screen', async ({ page }, info) => {
  const errors = watchErrors(page);
  await newGame(page, { tutorial: false });
  const vw = page.viewportSize();
  if (!vw) throw new Error('no viewport');
  expect(await horizontalOverflow(page)).toBe(0);
  // core regions visible inside the viewport
  for (const sel of ['canvas.view', '.customer', '[data-act=tool-spoon]', '[data-act=tool-pour]', '[data-act=bottle]', 'input[aria-label="Fire and frost control"]']) {
    await expect(page.locator(sel).first(), sel).toBeInViewport();
  }
  const jars = page.locator('.jar');
  expect(await jars.count()).toBeGreaterThanOrEqual(8);
  await expect(jars.first()).toBeInViewport();
  // the cauldron is the centre of the screen
  const cv = await page.locator('canvas.view').boundingBox();
  if (!cv) throw new Error('no canvas');
  const share = (cv.width * cv.height) / (vw.width * vw.height);
  expect(share, `cauldron view covers ${(share * 100).toFixed(0)}% of the screen`).toBeGreaterThan(0.22);
  // touch targets
  if (info.project.use.hasTouch) {
    const small = await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll('button, .jar, input[type=range]')) {
        const r = el.getBoundingClientRect();
        const st = getComputedStyle(el);
        if (r.width === 0 || r.height === 0 || st.visibility === 'hidden' || st.display === 'none') continue;
        if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) continue;
        if (Math.min(r.width, r.height) < 30) out.push(`${el.getAttribute('data-act') || el.className} ${Math.round(r.width)}×${Math.round(r.height)}`);
      }
      return out;
    });
    expect(small, 'controls smaller than 30 CSS px').toEqual([]);
  }
  await shot(page, info, 'shop');
  expect(errors).toEqual([]);
});

test('free experiment layout', async ({ page }, info) => {
  const errors = watchErrors(page);
  await startSandbox(page);
  expect(await horizontalOverflow(page)).toBe(0);
  await expect(page.locator('canvas.view')).toBeInViewport();
  await expect(page.locator('[data-act=tool-pestle]')).toBeInViewport();
  await shot(page, info, 'sandbox');
  expect(errors).toEqual([]);
});

test('panels open, fit and close', async ({ page }, info) => {
  const errors = watchErrors(page);
  await newGame(page, { tutorial: false });
  for (const [act, name] of [['shop', 'shop-panel'], ['recipes', 'recipes-panel'], ['journal', 'journal-panel'], ['menu', 'pause-panel']]) {
    await page.click(`[data-act=${act}]`);
    const modal = page.locator('.overlay .modal');
    await expect(modal).toBeVisible();
    const b = await modal.boundingBox();
    const vw = page.viewportSize();
    if (!b || !vw) throw new Error('no box');
    expect(b.x).toBeGreaterThanOrEqual(-1);
    expect(b.x + b.width).toBeLessThanOrEqual(vw.width + 1);
    expect(b.y + b.height).toBeLessThanOrEqual(vw.height + 1);
    await shot(page, info, name);
    await page.locator('.overlay .modal-head .btn').first().click();
    await expect(page.locator('.overlay')).toHaveCount(0);
  }
  expect(errors).toEqual([]);
});
