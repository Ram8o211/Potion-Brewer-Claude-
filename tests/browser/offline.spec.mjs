// The production build installs a service worker and keeps working with
// the network cut off.
import { test, expect } from '@playwright/test';
import { watchErrors } from './helpers.mjs';

test('the built game loads and plays offline after the first visit', async ({ page, context }) => {
  const errors = watchErrors(page);
  await page.goto('/index.html');
  await page.waitForSelector('[data-act=new-game]');
  // wait until the service worker controls the page and has precached the build
  await page.waitForFunction(async () => {
    const reg = await navigator.serviceWorker.ready;
    return !!reg.active && !!navigator.serviceWorker.controller;
  }, null, { timeout: 30_000, polling: 300 }).catch(async () => { await page.reload(); });
  await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 30_000 });
  const cached = await page.evaluate(async () => {
    const keys = await caches.keys();
    const c = await caches.open(keys.find((k) => k.startsWith('alchemist-shop-')) || '');
    return (await c.keys()).map((r) => new URL(r.url).pathname);
  });
  expect(cached.some((p) => /app\.[0-9a-f]+\.js$/.test(p)), 'bundle precached').toBe(true);
  expect(cached.some((p) => p.endsWith('.ttf')), 'font precached').toBe(true);
  await context.setOffline(true);
  await page.reload();
  await page.waitForSelector('[data-act=new-game]');
  await page.click('[data-act=sandbox]');
  await page.waitForSelector('canvas.view');
  await page.evaluate(() => { const l = window.__alchemist.screen; l.selectIngredient(l.state.world.roles.water); l.startPour(0, 20); });
  await page.waitForTimeout(1500);
  expect(await page.evaluate(() => window.__alchemist.screen.sim.p.count)).toBeGreaterThan(0);
  await context.setOffline(false);
  expect(errors).toEqual([]);
});
