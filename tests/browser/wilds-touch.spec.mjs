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
  // (a stroke across it and back, kept within the scene where it grows by an edge)
  const sx = Math.max(32, Math.min(W - 32, mid.x)), pts = [];
  for (let k = 0; k <= 8; k++) pts.push(at(sx - 30 + k * 7.5, mid.y));
  for (let k = 0; k <= 8; k++) pts.push(at(sx + 30 - k * 7.5, mid.y));
  await drag(page, pts, 12);
  await page.waitForFunction((id) => { const it = window.__alchemist.screen.views.wilds.fallen[id]; return it && it.landed; }, ripe.id);
  // it falls as a ragdoll cut from the very sprite it grew as: what lies on the ground shows its own pixels, turned but never resampled
  await page.waitForTimeout(400);
  const same = await page.evaluate(async (id) => {
    const S = await import(new URL('src/rendering/species-sprites.js', document.baseURI).href);
    const w = window.__alchemist.screen.views.wilds, it = w.fallen[id], sp = it.sp, p = w.field.find((q) => q.id === id);
    const opaque = (cv) => { const d = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data, out = []; for (let i = 0; i < d.length; i += 4) if (d[i + 3] === 255) out.push((d[i] << 16) | (d[i + 1] << 8) | d[i + 2]); return out; };
    // the body is the plant's own sprite, cut down to what shows of it
    const grown = S.plantCanvas(p.m, p.stage, { ...w.look(p), hover: false });
    const mine = opaque(sp.cv), theirs = opaque(grown.cv);
    const own = new Set(mine);
    const b = it.doll.box(1), x0 = Math.max(0, Math.floor(b.x0)), y0 = Math.max(0, Math.floor(b.y0));
    const dst = w.ctx.getImageData(x0, y0, Math.max(1, Math.ceil(b.x1) - x0), Math.max(1, Math.ceil(b.y1) - y0)).data;
    let found = 0;
    for (let i = 0; i < dst.length; i += 4) if (own.has((dst[i] << 16) | (dst[i + 1] << 8) | dst[i + 2])) found++;
    // (fallen bodies pass in front of one another: another lying over this one would hide it)
    const covered = Object.entries(w.fallen).some(([k, o]) => { if (k === id) return false; const c = o.doll.box(1); return c.x0 < b.x1 && c.x1 > b.x0 && c.y0 < b.y1 && c.y1 > b.y0; });
    return { n: mine.length, grown: theirs.length, same: mine.join() === theirs.join(), found, covered, pieces: it.doll.len.length };
  }, ripe.id);
  expect(same.n).toBeGreaterThan(10);
  expect(same.same, 'the fallen body is the plant’s own sprite, pixel for pixel, not a shrunken icon').toBe(true);
  // (turned to any angle, a piece shows each of its pixels once, a few twice or not at all; resampled, its exact colours would be all but gone)
  if (!same.covered) expect(same.found / same.n, 'and it is drawn with its own colours as it lies').toBeGreaterThan(0.55);
  // the finger sets the scenery's hanging strands swinging (the trees and bushes behind stay put)
  const leaves = await page.evaluate(async () => {
    const S = await import(new URL('src/rendering/wild-scene.js', document.baseURI).href);
    const st = window.__alchemist.screen.state, t = S.sceneTouch('meadow', st.seed);
    if (!t) return null;
    const ys = [];
    for (let g = 0; g < t.G; g++) if (t.hang[g] > 0) ys.push((t.box[g * 4 + 1] + t.box[g * 4 + 3]) / 2);
    return ys.length ? ys[Math.floor(ys.length / 2)] : null;
  });
  if (leaves !== null) {
    const row = [];
    for (let k = 0; k <= 24; k++) row.push(at(4 + k * (W - 8) / 24, leaves));
    await drag(page, row, 12);
    const moving = await page.evaluate(async () => {
      const S = await import(new URL('src/rendering/wild-scene.js', document.baseURI).href);
      const t = S.sceneTouch('meadow', window.__alchemist.screen.state.seed);
      let n = 0;
      for (let g = 0; g < t.G; g++) if (t.moving(g)) n++;
      return n;
    });
    expect(moving, 'the strands the finger went through are swinging').toBeGreaterThan(0);
    expect(await page.evaluate(async () => {
      const S = await import(new URL('src/rendering/wild-scene.js', document.baseURI).href);
      const t = S.sceneTouch('meadow', window.__alchemist.screen.state.seed);
      let n = 0;
      for (let g = 0; g < t.G; g++) if (!(t.hang[g] > 0) && t.moving(g)) n++;
      return n;
    }), 'no tree or bush was moved').toBe(0);
  }
  // (and whatever it knocked along has come to rest again)
  await page.waitForFunction((id) => { const it = window.__alchemist.screen.views.wilds.fallen[id]; return it && it.landed; }, ripe.id);
  // nothing that fell is anywhere in the terrain
  expect(await lab(page, (l) => { const w = l.views.wilds; return Object.values(w.fallen).filter((it) => it.doll.overlaps((x, y) => w.solidAt(x, y))).length; }), 'no fallen body overlaps the terrain').toBe(0);
  await shot(page, info, 'sandbox-wilds-fallen');
  // a fingertip that rolls a little is still a tap: it gathers what fell
  const it = await lab(page, (l, id) => l.views.wilds.itemCentre(id), ripe.id);
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
  // (a finger wandering from one plant to the next, a little above each one's foot)
  const path = [];
  for (let i = 0; i < spots.length - 1; i++) for (let k = 0; k < 12; k++) { const u = k / 12; path.push(at(spots[i].x + (spots[i + 1].x - spots[i].x) * u, spots[i].y - 4 + (spots[i + 1].y - spots[i].y) * u)); }
  path.push(at(spots[spots.length - 1].x, spots[spots.length - 1].y - 4));
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
