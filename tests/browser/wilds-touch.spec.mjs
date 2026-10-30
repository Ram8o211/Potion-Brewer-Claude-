// The wilds by touch, in the Free Experiment: a swipe shakes a ripe plant's
// ingredient loose, which falls as the very pixels it grew as; a tap (even a
// wobbly fingertip's) gathers it; the plant is gone and its stand sprouts
// again at random spots; and a finger dragged in watering mode waters every
// growing plant along its path.
import { test, expect } from '@playwright/test';
import { watchErrors, shot, startSandbox, lab, drag } from './helpers.mjs';

test('sandbox wilds: shake, gather by tap, regrow at random spots, water by dragging', async ({ page }, info) => {
  const errors = watchErrors(page);
  await startSandbox(page);
  await page.click('[data-act=tab-wilds]');
  await page.click('[data-act=region-meadow]');
  await page.waitForFunction(() => { const w = window.__alchemist.screen.views.wilds; return w.region === 'meadow' && !!w.bg; });
  await lab(page, (l) => l.views.wilds.grow());
  // every plant of the Free Experiment's wilds stands grown
  const field = await lab(page, (l) => l.views.wilds.field.map((p) => ({ id: p.id, dep: p.dep.id, x: p.x, y: p.y, stage: p.stage, mount: p.mount || 'ground' })));
  expect(field.length).toBeGreaterThan(2);
  expect(field.every((p) => p.stage === 'mature'), 'every plant is grown').toBe(true);
  await page.locator('.view-wilds canvas.scene').scrollIntoViewIfNeeded();
  const cv = await page.locator('.view-wilds canvas.scene').boundingBox();
  if (!cv) throw new Error('no scene');
  const H = 216, W = await page.evaluate(() => /** @type {HTMLCanvasElement} */ (document.querySelector('.view-wilds canvas.scene')).width);
  const at = (x, y) => ({ x: cv.x + x / W * cv.width, y: cv.y + y / H * cv.height });
  // a ripe plant on the ground, shaken by a single fast swipe across it
  const ripe = field.find((p) => p.mount === 'ground') || field[0];
  const mid = await lab(page, (l, id) => { const w = l.views.wilds, p = w.field.find((q) => q.id === id), f = w.frameOf(p); return { x: p.x * 384 - f.ax + f.w / 2, y: p.y * 216 - f.ay + f.h / 2 }; }, ripe.id);
  const pts = [];
  for (let k = 0; k <= 8; k++) pts.push(at(mid.x - 30 + k * 7.5, mid.y));
  for (let k = 0; k <= 8; k++) pts.push(at(mid.x + 30 - k * 7.5, mid.y));
  await drag(page, pts, 12);
  await page.waitForFunction((id) => { const it = window.__alchemist.screen.views.wilds.fallen[id]; return it && it.landed; }, ripe.id);
  // it falls as the very sprite it grew as: what lies on the ground shows its pixels unscaled
  await page.waitForTimeout(1000);
  const same = await lab(page, (l, id) => {
    const w = l.views.wilds, it = w.fallen[id], sp = it.sp;
    const src = sp.cv.getContext('2d').getImageData(0, 0, sp.w, sp.h).data;
    const ix = Math.round(it.x - sp.ax), iy = Math.round(it.y - sp.ay);
    const dst = w.ctx.getImageData(ix, iy, sp.w, sp.h).data;
    let n = 0, ok = 0;
    for (let i = 0; i < src.length; i += 4) {
      if (src[i + 3] < 255) continue;
      n++;
      if (Math.abs(src[i] - dst[i]) + Math.abs(src[i + 1] - dst[i + 1]) + Math.abs(src[i + 2] - dst[i + 2]) < 6) ok++;
    }
    const f = w.frameOf(w.field.find((q) => q.id === id));
    return { n, share: ok / Math.max(1, n), w: sp.w, h: sp.h, fw: f.w, fh: f.h };
  }, ripe.id);
  expect(same.n).toBeGreaterThan(10);
  expect([same.w, same.h], 'the fallen piece is the plant’s own sprite, not a shrunken icon').toEqual([same.fw, same.fh]);
  expect(same.share, 'and its pixels are drawn as they were').toBeGreaterThan(0.85);
  await shot(page, info, 'sandbox-wilds-fallen');
  // a fingertip that rolls a little is still a tap: it gathers what fell
  const it = await lab(page, (l, id) => { const q = l.views.wilds.fallen[id]; return { x: q.x - q.sp.ax + q.sp.w / 2, y: q.y - q.sp.ay + q.sp.h / 2 }; }, ripe.id);
  const t = at(it.x, it.y), touch = !!info.project.use.hasTouch, wob = touch ? 4 : 1.5;
  await drag(page, [t, { x: t.x + wob, y: t.y + wob * 0.75 }, { x: t.x + wob * 1.8, y: t.y + wob * 0.5 }], 30);
  await expect.poll(() => lab(page, (l, id) => l.views.wilds.field.some((p) => p.id === id), ripe.id), { message: 'gathered: the plant is gone' }).toBe(false);
  // the stand sprouts again, at a spot of its own, and grows back within minutes
  const regrow = await page.evaluate(async ([depId, gone]) => {
    const G = await import(new URL('src/game/gathering.js', document.baseURI).href);
    const st = window.__alchemist.screen.state, d = st.deposits.find((x) => x.id === depId), now = Date.now();
    const s0 = G.depositStatus(st.gathering, d, now), s1 = G.depositStatus(st.gathering, d, now + d.spawnMs + 1);
    const s2 = G.depositStatus(st.gathering, d, now + d.spawnMs + d.growMs * 6);
    const fresh = s1.plants.find((p) => !s0.plants.some((q) => q.id === p.id));
    return { slots: d.slots, n0: s0.plants.length, n1: s1.plants.length, fresh: fresh && { stage: fresh.stage, id: fresh.id }, grown: s2.mature, gone: s1.plants.some((p) => p.id === gone), minutes: (d.spawnMs + d.growMs) / 60000 };
  }, [ripe.dep, ripe.id]);
  expect(regrow.n0).toBe(regrow.slots - 1);
  expect(regrow.n1, 'a new sprout came up').toBe(regrow.slots);
  expect(regrow.fresh && regrow.fresh.stage).toBe('sprout');
  expect(regrow.gone).toBe(false);
  expect(regrow.grown).toBe(regrow.slots);
  expect(regrow.minutes).toBeLessThan(6);
  // watering: a finger dragged across the scene waters every growing plant on its path
  const dep = await lab(page, (l) => {
    const st = l.state, d = st.deposits.find((x) => x.region === 'meadow' && x.botanical), now = Date.now();
    st.gathering.nodes[d.id] = { plants: [0, 1, 2].map((k) => ({ id: `${d.id}#t${k}`, x: 0.25 + k * 0.22, y: 0.8, born: now, g: 0.1, t: now, w: 0.2 })), due: null, seq: 60 };
    l.views.wilds.refresh();
    l.views.wilds.grow();
    return d;
  });
  await page.click('[data-act=mode-water]');
  await page.locator('.view-wilds canvas.scene').scrollIntoViewIfNeeded();
  Object.assign(cv, await page.locator('.view-wilds canvas.scene').boundingBox());
  const spots = await lab(page, (l, id) => l.views.wilds.field.filter((p) => p.dep.id === id).map((p) => ({ x: p.x * 384, y: p.y * 216 })), dep.id);
  spots.sort((a, b) => a.x - b.x);
  const path = [];
  for (let k = 0; k <= 30; k++) { const u = k / 30, x = spots[0].x - 6 + (spots[spots.length - 1].x + 6 - spots[0].x + 6) * u, y = spots[0].y + (spots[spots.length - 1].y - spots[0].y) * u - 4; path.push(at(x, y)); }
  await drag(page, path, 16);
  const ws = await lab(page, (l, id) => l.state.gathering.nodes[id].plants.map((q) => q.w), dep.id);
  expect(ws.length).toBe(3);
  expect(Math.min(...ws), 'each plant along the drag drank').toBeGreaterThan(0.6);
  await expect(page.locator('.toast', { hasText: 'Nothing to water here' })).toHaveCount(0);
  await expect(page.locator(`[data-deposit="${dep.id}"] .soil`)).toBeVisible();
  // a tap far from any plant says so
  await drag(page, [at(4, 6), at(4, 6)], 30);
  await expect(page.locator('.toast', { hasText: 'Nothing to water here' })).toBeVisible();
  await shot(page, info, 'sandbox-wilds-watered');
  expect(errors).toEqual([]);
});
