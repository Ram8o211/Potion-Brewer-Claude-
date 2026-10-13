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
  await page.waitForSelector('canvas.view');
  await page.waitForTimeout(500);
}

/** @param {import('@playwright/test').Page} page */
export async function startSandbox(page) {
  await openGame(page);
  await page.click('[data-act=sandbox]');
  await page.waitForSelector('canvas.view');
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

/** Pour a reagent by role through the game's own pour API and wait until it lands. */
export async function pourRole(page, role, ml, x = 0) {
  await lab(page, (l, a) => { const id = l.state.world.roles[a.role]; l.selectIngredient(id); l.startPour(a.x, Math.round(a.ml / 5)); }, { role, ml, x });
  await page.waitForFunction(() => !(/** @type {any} */ (window).__alchemist.screen.sim.emitter.pouring), null, { timeout: 30_000 });
}

/** Canvas-space point (fractions of the cauldron view) → page coordinates. @param {import('@playwright/test').Page} page */
export async function viewPoint(page, fx, fy) {
  const box = await page.locator('canvas.view').boundingBox();
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
