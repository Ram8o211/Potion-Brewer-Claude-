// The production build installs a service worker and keeps working with the
// network really gone: the test runs its own server and stops it before the
// offline phase (setOffline alone does not stop a worker's requests).
import { test, expect } from '@playwright/test';
import { watchErrors, startServer, precacheReport } from './helpers.mjs';

test('the built game loads and plays offline after the first visit', async ({ page }) => {
  const errors = watchErrors(page);
  const server = await startServer(['--root', 'dist'], 4177);
  try {
    await page.goto(server.url + 'index.html');
    await page.locator('[data-act=new-game]').waitFor();
    await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 30_000 }).catch(() => page.reload());
    await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 30_000 });
    const pre = await precacheReport(page, 'sw.js');
    expect(pre.cacheNames.length, 'exactly one cache for this scope').toBe(1);
    expect(pre.missing, 'every precache file is cached').toEqual([]);
    expect(pre.htmlUsesBundle, 'cached index.html matches the current bundle').toBe(true);
  } finally {
    await server.stop();
  }
  // the server is gone: everything must come from the service worker's cache
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Network.clearBrowserCache');
  await page.reload();
  await page.locator('[data-act=new-game]').waitFor();
  await page.click('[data-act=sandbox]');
  await page.locator('canvas.view').waitFor();
  await page.evaluate(() => { const l = window.__alchemist.screen; l.selectIngredient(l.state.world.roles.water); l.startPour(0, 20); });
  await page.waitForFunction(() => window.__alchemist.screen.sim.p.count > 0, null, { timeout: 15_000 });
  expect(errors.filter((e) => !/ERR_CONNECTION_REFUSED|Failed to fetch|net::/.test(e))).toEqual([]);
});
