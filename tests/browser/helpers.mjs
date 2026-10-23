// Shared browser-test helpers.
import fs from 'node:fs';
import path from 'node:path';

export const SHOT_DIR = path.resolve('test-results', 'screenshots');

/** Collect page errors and console errors for a test. @param {import('@playwright/test').Page} page */
export function watchErrors(page) {
  /** @type {string[]} */
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  return errors;
}

/** @param {import('@playwright/test').Page} page @param {import('@playwright/test').TestInfo} info @param {string} name */
export async function shot(page, info, name) {
  fs.mkdirSync(SHOT_DIR, { recursive: true });
  // let opening sheets and pop-ins finish (never wait on looping animations)
  await page.evaluate(() => Promise.race([
    Promise.all(document.getAnimations().filter((a) => a.effect && a.effect.getTiming().iterations !== Infinity).map((a) => a.finished.catch(() => {}))),
    new Promise((r) => setTimeout(r, 1500)),
  ])).catch(() => {});
  const file = path.join(SHOT_DIR, `${info.project.name}-${name}.png`);
  await page.screenshot({ path: file });
  await info.attach(name, { path: file, contentType: 'image/png' });
  return file;
}

/** Open the game with the service worker disabled (fresh code every run). @param {import('@playwright/test').Page} page */
export async function openGame(page) {
  await page.goto('/index.html?nosw');
  await page.waitForSelector('[data-act=new-game]');
}

/** @param {import('@playwright/test').Page} page @param {{tutorial?: boolean, seed?: string}} [o] */
export async function newGame(page, o = {}) {
  await openGame(page);
  await page.click('[data-act=new-game]');
  if (o.seed) await page.fill('.modal input[type=text]', o.seed);
  if (o.tutorial === false) {
    const box = page.locator('.modal input[type=checkbox]');
    if (await box.isChecked()) await box.uncheck();
  }
  await page.click('[data-act=start-game]');
  await page.waitForSelector('canvas.view-canvas');
  await page.waitForTimeout(500);
  // the day dawns with the shop closed: open the door (as a player does) unless asked not to
  if (o.open !== false) await lab(page, (l) => { if (!l.state.current && !l.state.dayOver) l.bringCustomer(false); });
}

/** @param {import('@playwright/test').Page} page */
export async function startSandbox(page) {
  await openGame(page);
  await page.click('[data-act=sandbox]');
  await page.waitForSelector('canvas.view-canvas');
  await page.waitForTimeout(500);
}

/** Evaluate against the live lab screen. @param {import('@playwright/test').Page} page @param {(lab:any, arg:any)=>any} fn @param {any} [arg] */
export function lab(page, fn, arg) {
  return page.evaluate(([src, a]) => {
    // eslint-disable-next-line no-new-func
    const f = new Function('lab', 'arg', `return (${src})(lab, arg);`);
    return f(/** @type {any} */ (window).__alchemist.screen, a);
  }, [fn.toString(), arg]);
}

/** Pour a reagent by role (or a wild ingredient by id) through the game's own pour API and wait until it lands. */
export async function pourRole(page, role, ml, x = 0) {
  await lab(page, (l, a) => { const id = l.state.world.roles[a.role] || a.role; l.selectIngredient(id); l.startPour(a.x, Math.round(a.ml / 5)); }, { role, ml, x });
  await page.waitForFunction(() => !(/** @type {any} */ (window).__alchemist.screen.sim.emitter.pouring), null, { timeout: 30_000 });
}

/** Canvas-space point (fractions of the cauldron view) → page coordinates. @param {import('@playwright/test').Page} page */
export async function viewPoint(page, fx, fy) {
  const box = await page.locator('canvas.view-canvas').boundingBox();
  if (!box) throw new Error('no canvas');
  return { x: box.x + box.width * fx, y: box.y + box.height * fy, box };
}

/**
 * Drag along a path with a real pointer: mouse on desktop projects, touch
 * events (via the DevTools protocol) on touch projects.
 * @param {import('@playwright/test').Page} page @param {{x:number,y:number}[]} pts @param {number} [stepMs]
 */
export async function drag(page, pts, stepMs = 16) {
  const touch = await page.evaluate(() => matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0);
  if (!touch) {
    await page.mouse.move(pts[0].x, pts[0].y);
    await page.mouse.down();
    for (const p of pts.slice(1)) { await page.mouse.move(p.x, p.y); await page.waitForTimeout(stepMs); }
    await page.mouse.up();
    return;
  }
  const cdp = await page.context().newCDPSession(page);
  const tp = (p) => [{ x: p.x, y: p.y, id: 1, radiusX: 6, radiusY: 6, force: 1 }];
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: tp(pts[0]) });
  for (const p of pts.slice(1)) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: tp(p) });
    await page.waitForTimeout(stepMs);
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await cdp.detach();
}

/** Circular stirring path inside the lower cauldron. */
export async function stirPath(page, turns = 3, steps = 120) {
  const c = await viewPoint(page, 0.5, 0.72);
  const pts = [];
  for (let k = 0; k <= steps; k++) {
    const a = (k / steps) * Math.PI * 2 * turns;
    pts.push({ x: c.x + Math.cos(a) * c.box.width * 0.2, y: c.y + Math.sin(a) * c.box.height * 0.06 });
  }
  return pts;
}

/** Fraction of the document that overflows horizontally (0 = none). @param {import('@playwright/test').Page} page */
export function horizontalOverflow(page) {
  return page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - window.innerWidth));
}

/**
 * Start a private static server for one test, so the test can really cut the
 * network by stopping it (Playwright's setOffline does not stop a service
 * worker's own requests, and the HTTP cache can mask a broken offline cache).
 * @param {string[]} args extra serve.mjs arguments, e.g. ['--root', 'dist']
 * @param {number} port
 */
export async function startServer(args, port) {
  const { spawn } = await import('node:child_process');
  const proc = spawn(process.execPath, ['scripts/serve.mjs', '--port', String(port), ...args], { stdio: 'ignore' });
  const base = args.includes('--base') ? args[args.indexOf('--base') + 1] : '/';
  const url = `http://localhost:${port}${base}`;
  for (let k = 0; k < 50; k++) {
    try { if ((await fetch(url + 'index.html')).ok) break; } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 100));
  }
  return {
    url,
    stop: () => new Promise((resolve) => { proc.once('exit', resolve); proc.kill(); }),
  };
}

/**
 * Every file the build's service worker lists must be in its cache, and the
 * cached index.html must point at the current bundle.
 * @param {import('@playwright/test').Page} page @param {string} swUrl
 */
export function precacheReport(page, swUrl) {
  return page.evaluate(async (sw) => {
    const text = await (await fetch(sw, { cache: 'no-store' })).text();
    const assets = JSON.parse(/const ASSETS = (\[.*?\]);/.exec(text)[1]);
    const base = new URL('.', new URL(sw, location.href)).href;
    const names = (await caches.keys()).filter((k) => k.includes(base));
    const cache = await caches.open(names[0]);
    const missing = [];
    for (const a of assets) if (!(await cache.match(new URL(a, base).href, { ignoreSearch: true }))) missing.push(a);
    const html = await (await cache.match(new URL('index.html', base).href)).text();
    const bundle = assets.find((a) => /^app\..*\.js$/.test(a));
    return { cacheNames: names, assets: assets.length, missing, htmlUsesBundle: html.includes(bundle) };
  }, swUrl);
}

/**
 * Pick a jar on the shelf and pour exact doses with the dose buttons,
 * waiting for each to land.
 * @param {import('@playwright/test').Page} page @param {string} id @param {number[]} doses
 */
export async function pourDose(page, id, doses) {
  await page.click(`.jar[data-id="${id}"]`);
  for (const ml of doses) {
    await page.click(`[data-act=dose-${ml}]`);
    await page.waitForFunction(() => !(/** @type {any} */ (window).__alchemist.screen.sim.emitter.pouring), null, { timeout: 30_000 });
  }
}
