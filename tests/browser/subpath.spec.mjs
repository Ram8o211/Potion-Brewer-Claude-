// GitHub Pages serves a project site under a sub-path
// (https://<owner>.github.io/<repo>/) on an origin shared with the owner's
// other Pages sites. A branch deploy of this repository exposes two copies of
// the game: the source version at the root and the production build at
// /dist/. These tests serve the repository the same way (see the
// 'pages-subpath' project in playwright.config.mjs) and play both copies.
import { test, expect } from '@playwright/test';
import { watchErrors, startServer, precacheReport } from './helpers.mjs';

/** Collect failed requests (4xx/5xx) for a page. @param {import('@playwright/test').Page} page */
function watchFailures(page) {
  /** @type {string[]} */
  const bad = [];
  page.on('response', (r) => { if (r.status() >= 400) bad.push(`${r.status()} ${r.url()}`); });
  return bad;
}

/** @param {import('@playwright/test').Page} page */
async function playSandbox(page) {
  await page.locator('[data-act=sandbox]').click();
  await page.locator('canvas.view-canvas').waitFor();
  await page.evaluate(() => { const l = window.__alchemist.screen; l.selectIngredient(l.state.world.roles.water); l.startPour(0, 20); });
  await page.waitForFunction(() => window.__alchemist.screen.sim.p.count > 0, null, { timeout: 15_000 });
}

/** @param {import('@playwright/test').Page} page */
async function waitForController(page) {
  await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 30_000 }).catch(async () => {
    // the first visit installs the worker; it controls the page from the next load
    await page.reload();
    await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 30_000 });
  });
}

test('the source copy runs from the repository root under the sub-path', async ({ page }) => {
  const errors = watchErrors(page);
  const bad = watchFailures(page);
  await page.goto('index.html?nosw');
  await page.locator('[data-act=new-game]').waitFor();
  await playSandbox(page);
  // the manifest's start URL and scope stay inside the project site
  const man = await page.evaluate(async () => {
    const href = /** @type {HTMLLinkElement} */ (document.querySelector('link[rel=manifest]')).href;
    const m = await (await fetch(href)).json();
    return { start: new URL(m.start_url, href).pathname, scope: new URL(m.scope, href).pathname, icons: m.icons.map((i) => new URL(i.src, href).pathname) };
  });
  expect(man.start).toBe('/Potion-Brewer-Claude-/index.html');
  expect(man.scope).toBe('/Potion-Brewer-Claude-/');
  for (const icon of man.icons) expect(icon.startsWith('/Potion-Brewer-Claude-/')).toBe(true);
  expect(bad).toEqual([]);
  expect(errors).toEqual([]);
});

test('the production build runs from /dist/, installs its worker there and plays with the server gone', async ({ page }) => {
  const errors = watchErrors(page);
  const bad = watchFailures(page);
  const server = await startServer(['--root', '.', '--base', '/Potion-Brewer-Claude-/'], 4178);
  try {
    await page.goto(server.url + 'dist/index.html');
    await page.locator('[data-act=new-game]').waitFor();
    await waitForController(page);
    const scope = await page.evaluate(async () => (await navigator.serviceWorker.ready).scope);
    expect(new URL(scope).pathname).toBe('/Potion-Brewer-Claude-/dist/');
    const pre = await precacheReport(page, 'sw.js');
    expect(pre.missing).toEqual([]);
    expect(pre.htmlUsesBundle).toBe(true);
    expect(bad).toEqual([]);
  } finally {
    await server.stop();
  }
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Network.clearBrowserCache');
  await page.reload();
  await page.locator('[data-act=new-game]').waitFor();
  await playSandbox(page);
  expect(errors.filter((e) => !/ERR_CONNECTION_REFUSED|Failed to fetch|net::/.test(e))).toEqual([]);
});

test('the two copies keep their own offline caches on the shared origin', async ({ page }) => {
  // install the build's worker, then the source copy's, then return to the build
  await page.goto('dist/index.html');
  await page.locator('[data-act=new-game]').waitFor();
  await waitForController(page);
  await page.goto('index.html');
  await page.locator('[data-act=new-game]').waitFor();
  await waitForController(page);
  await page.waitForTimeout(500);
  const names = await page.evaluate(async () => globalThis.caches.keys());
  const build = names.filter((k) => k.includes('/Potion-Brewer-Claude-/dist/'));
  const source = names.filter((k) => !k.includes('/dist/'));
  expect(build.length, `build cache survives the source copy's worker (${names.join(', ')})`).toBe(1);
  expect(source.length, `source copy has its own cache (${names.join(', ')})`).toBe(1);
  await page.goto('dist/index.html');
  await page.locator('[data-act=new-game]').waitFor();
  const pre = await precacheReport(page, 'sw.js');
  expect(pre.missing, 'the build is still fully cached').toEqual([]);
});

test('a second tab saving the shop makes a stale tab step back instead of overwriting it', async ({ page, context }) => {
  await page.goto('dist/index.html?nosw');
  await page.locator('[data-act=new-game]').click();
  await page.locator('.modal input[type=checkbox]').uncheck();
  await page.click('[data-act=start-game]');
  await page.locator('canvas.view-canvas').waitFor();
  await page.evaluate(() => { const l = window.__alchemist.screen; l.state.coins = 10; l.save(); });
  // the same shop opened in the other copy, played further and saved
  const other = await context.newPage();
  await other.goto('index.html?nosw');
  await other.locator('[data-act=continue]').click();
  await other.locator('canvas.view-canvas').waitFor();
  await other.evaluate(() => { const l = window.__alchemist.screen; l.state.coins = 99; l.save(); });
  // the stale tab notices, goes back to the menu and does not save over it
  await expect(page.locator('.toast', { hasText: 'opened elsewhere' })).toBeVisible();
  await expect(page.locator('[data-act=continue]')).toBeVisible();
  await page.close({ runBeforeUnload: true });
  const coins = await other.evaluate(() => JSON.parse(localStorage.getItem('alchemist-shop.save') || '{}').coins);
  expect(coins).toBe(99);
});

test('a redeploy reaches returning players even with Pages-style caching (max-age=600)', async ({ page }) => {
  // two deployments of the build: v2 has a different bundle and title
  const fs = await import('node:fs');
  const path = await import('node:path');
  const os = await import('node:os');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pages-deploy-'));
  const v1 = path.join(tmp, 'v1'), v2 = path.join(tmp, 'v2');
  fs.cpSync('dist', v1, { recursive: true });
  fs.cpSync('dist', v2, { recursive: true });
  const bundle = fs.readdirSync(v2).find((f) => /^app\..*\.js$/.test(f));
  fs.renameSync(path.join(v2, bundle), path.join(v2, 'app.v2redeploy.js'));
  for (const f of ['index.html', 'sw.js']) {
    let s = fs.readFileSync(path.join(v2, f), 'utf8').split(bundle).join('app.v2redeploy.js');
    if (f === 'index.html') s = s.replace('<title>The Alchemist\'s Shop</title>', '<title>The Alchemist\'s Shop v2</title>');
    if (f === 'sw.js') s = s.replace(/const VERSION = '([^']+)';/, "const VERSION = '$1-v2';");
    fs.writeFileSync(path.join(v2, f), s);
  }
  const visit = async (url) => { await page.goto('about:blank'); await page.goto(url + 'index.html'); await page.locator('[data-act=new-game]').waitFor(); };
  let server = await startServer(['--root', v1, '--max-age', '600'], 4179);
  try {
    await visit(server.url);
    await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 30_000 }).catch(() => visit(server.url));
    await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 30_000 });
    await visit(server.url);
    expect(await page.title()).toBe("The Alchemist's Shop");
    await server.stop();
    server = await startServer(['--root', v2, '--max-age', '600'], 4179); // the redeploy
    // the first visit is served by the old worker while the new one installs;
    // once it takes over, it moves the open page onto the new version by itself
    await visit(server.url);
    await page.waitForFunction(() => document.title === "The Alchemist's Shop v2", null, { timeout: 15_000 });
    await page.locator('[data-act=new-game]').waitFor();
    await visit(server.url);
    expect(await page.title(), 'the next visit stays on the new version').toBe("The Alchemist's Shop v2");
    const pre = await precacheReport(page, 'sw.js');
    expect(pre.missing).toEqual([]);
    expect(pre.htmlUsesBundle).toBe(true);
  } finally {
    await server.stop();
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
