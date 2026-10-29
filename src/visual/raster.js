// Pixel-art rasterization of procedural geometry (geometry.js Model).
//
// Every part is filled at pixel centres into a material/lightness buffer:
// filled outlines are shaded as rounded bodies, folded blades or flat facets
// lit from the upper left, strokes as cylinders. Lightness is then quantised
// onto the material's ramp, with a little clustered surface texture and a
// faint ordered dither where it changes, so shading reads as hand-placed
// clusters rather than gradients. Finally the silhouette is inked with the
// ramp's own darkest colours (lighter along the lit edges — a selective
// outline) and a part lying behind another gets a one-pixel shadow line
// where they meet, so overlapping petals and leaves read apart.

import { Pixels } from './pixels.js';
import { noise2, bayer } from './noise.js';
import { mixPacked } from './color.js';

/** Direction toward the light: from the upper left and in front. */
const L = (() => { const v = [-0.55, -0.72, 0.62], n = Math.hypot(...v); return v.map((x) => x / n); })();
const INK = 0xff1c1218;

/** @param {number} x @param {number} y @param {import('./geometry.js').Pt[]} pts */
function inside(x, y, pts) {
  let c = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const xi = pts[i][0], yi = pts[i][1], xj = pts[j][0], yj = pts[j][1];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lit = (nx, ny, nz) => clamp01(0.47 + 0.6 * (nx * L[0] + ny * L[1] + nz * L[2]));

/**
 * @typedef {Object} Raster
 * @property {Pixels} pix
 * @property {Int16Array} part     index of the part drawn at each pixel (−1: empty)
 * @property {number[][]} glints   [x, y] pixels that may glimmer
 */

/**
 * Rasterize a model into a w × h buffer.
 * @param {import('./geometry.js').Model} model
 * @param {number} w @param {number} h
 * @param {Record<string, number[]>} pal  material → ramp (packed colours, darkest first)
 * @param {{seed?:number, outline?:boolean, dither?:number, texture?:number}} [o]
 * @returns {Raster}
 */
export function rasterize(model, w, h, pal, o = {}) {
  const N = w * h, seed = o.seed ?? 1, texAmp = o.texture ?? 0.2, dith = o.dither ?? 0.16;
  const mat = new Int16Array(N).fill(-1), part = new Int16Array(N).fill(-1), lum = new Float32Array(N), tex = new Float32Array(N);
  /** @type {string[]} */
  const mats = [];
  const matId = (/** @type {string} */ m) => { let k = mats.indexOf(m); if (k < 0) { k = mats.length; mats.push(m); } return k; };
  /** @type {number[][]} */
  const glow = [];
  const parts = model.parts;
  for (let pi = 0; pi < parts.length; pi++) {
    const p = parts[pi], mi = matId(p.mat), tone = p.tone || 0, tx = p.tex ?? 1;
    const put = (/** @type {number} */ k, /** @type {number} */ l) => { mat[k] = mi; part[k] = pi; lum[k] = clamp01(l + tone); tex[k] = tx; };
    if (p.t === 'poly') {
      const pts = /** @type {import('./geometry.js').Pt[]} */ (p.pts);
      if (!pts || pts.length < 3) continue;
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (const [x, y] of pts) { if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y; }
      const cov = [];
      for (let y = Math.max(0, Math.floor(y0)); y <= Math.min(h - 1, Math.ceil(y1)); y++) for (let x = Math.max(0, Math.floor(x0)); x <= Math.min(w - 1, Math.ceil(x1)); x++) if (inside(x + 0.5, y + 0.5, pts)) cov.push(x, y);
      // a sliver too thin to cover a pixel centre still shows as its nearest pixel
      if (!cov.length) {
        const cx = Math.floor((x0 + x1) / 2), cy = Math.floor((y0 + y1) / 2);
        if (cx >= 0 && cy >= 0 && cx < w && cy < h) cov.push(cx, cy); else continue;
      }
      const n = cov.length / 2;
      let mx = 0, my = 0;
      for (let i = 0; i < cov.length; i += 2) { mx += cov[i] + 0.5; my += cov[i + 1] + 0.5; }
      mx /= n; my /= n;
      let sxx = 0, syy = 0, sxy = 0;
      for (let i = 0; i < cov.length; i += 2) { const dx = cov[i] + 0.5 - mx, dy = cov[i + 1] + 0.5 - my; sxx += dx * dx; syy += dy * dy; sxy += dx * dy; }
      sxx = sxx / n + 0.08; syy = syy / n + 0.08; sxy /= n;
      // principal axes of the shape: its own frame for the shading
      const th = 0.5 * Math.atan2(2 * sxy, sxx - syy), c = Math.cos(th), s = Math.sin(th);
      const l1 = Math.max(0.1, sxx * c * c + 2 * sxy * c * s + syy * s * s), l2 = Math.max(0.1, sxx * s * s - 2 * sxy * c * s + syy * c * c);
      const r1 = 2 * Math.sqrt(l1) + 0.3, r2 = 2 * Math.sqrt(l2) + 0.3;
      const shade = p.shade || 'round';
      // which side of a folded blade faces the light
      const foldLit = Math.sign(-s * L[0] + c * L[1]) || 1;
      for (let i = 0; i < cov.length; i += 2) {
        const x = cov[i], y = cov[i + 1], k = y * w + x;
        const dx = x + 0.5 - mx, dy = y + 0.5 - my, u = (dx * c + dy * s) / r1, v = (-dx * s + dy * c) / r2;
        let l;
        if (shade === 'flat') l = 0.55;
        else if (shade === 'facet') l = p.lum ?? 0.55;
        else if (shade === 'fold') l = (Math.sign(v) === foldLit ? 0.36 : 0.64) - u * 0.08 * (c * L[0] + s * L[1] < 0 ? -1 : 1) + (Math.abs(v) > 0.75 ? -0.05 : 0);
        else {
          const d2 = Math.min(0.98, u * u + v * v), nz = Math.sqrt(1 - d2);
          const nx = u * c - v * s, ny = u * s + v * c;
          l = lit(nx, ny, nz);
        }
        put(k, l);
        if (p.glow) glow.push([x, y]);
      }
    } else if (p.t === 'stroke') {
      const pts = /** @type {import('./geometry.js').Pt[]} */ (p.pts);
      if (!pts || !pts.length) continue;
      const ws = Array.isArray(p.w) ? p.w : pts.map(() => /** @type {number} */ (p.w || 1));
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity, wm = 0;
      for (let i = 0; i < pts.length; i++) { const [x, y] = pts[i]; x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); wm = Math.max(wm, ws[i] ?? ws[ws.length - 1]); }
      const R = wm / 2 + 1;
      for (let y = Math.max(0, Math.floor(y0 - R)); y <= Math.min(h - 1, Math.ceil(y1 + R)); y++) {
        for (let x = Math.max(0, Math.floor(x0 - R)); x <= Math.min(w - 1, Math.ceil(x1 + R)); x++) {
          const px = x + 0.5, py = y + 0.5;
          let best = Infinity, side = 0, ang = 0;
          for (let i = 0; i < Math.max(1, pts.length - 1); i++) {
            const a = pts[i], b = pts[Math.min(pts.length - 1, i + 1)];
            const vx = b[0] - a[0], vy = b[1] - a[1], ll = vx * vx + vy * vy;
            const t = ll > 0 ? clamp01(((px - a[0]) * vx + (py - a[1]) * vy) / ll) : 0;
            const qx = a[0] + vx * t - px, qy = a[1] + vy * t - py;
            const hw = Math.max(0.5, ((ws[i] ?? ws[ws.length - 1]) * (1 - t) + (ws[Math.min(ws.length - 1, i + 1)] ?? ws[ws.length - 1]) * t) / 2);
            const d = Math.hypot(qx, qy) / hw;
            if (d < best) { best = d; side = (vx * -qy - vy * -qx) >= 0 ? 1 : -1; ang = Math.atan2(vy, vx); }
          }
          if (best > 1) continue;
          const sN = Math.min(0.95, best) * side, nx = -Math.sin(ang) * sN, ny = Math.cos(ang) * sN;
          put(y * w + x, p.shade === 'flat' ? 0.55 : lit(nx, ny, Math.sqrt(1 - sN * sN)));
          if (p.glow) glow.push([x, y]);
        }
      }
    } else if (p.t === 'line') {
      const pts = /** @type {import('./geometry.js').Pt[]} */ (p.pts);
      for (let i = 0; i < pts.length - 1 || (pts.length === 1 && i === 0); i++) {
        const a = pts[i], b = pts[Math.min(pts.length - 1, i + 1)];
        let x = Math.floor(a[0]), y = Math.floor(a[1]);
        const xe = Math.floor(b[0]), ye = Math.floor(b[1]), dx = Math.abs(xe - x), dy = -Math.abs(ye - y), sx = x < xe ? 1 : -1, sy = y < ye ? 1 : -1;
        let err = dx + dy;
        for (let guard = 0; guard < 400; guard++) {
          if (x >= 0 && y >= 0 && x < w && y < h) {
            const k = y * w + x;
            if (!p.clip || mat[k] >= 0) { mat[k] = mi; part[k] = pi; lum[k] = clamp01((p.lum ?? (mat[k] >= 0 ? lum[k] : 0.5)) + tone); tex[k] = 0; if (p.glow) glow.push([x, y]); }
          }
          if (x === xe && y === ye) break;
          const e2 = 2 * err;
          if (e2 >= dy) { err += dy; x += sx; }
          if (e2 <= dx) { err += dx; y += sy; }
        }
        if (pts.length === 1) break;
      }
    } else if (p.t === 'dot') {
      const x = Math.floor(/** @type {number} */ (p.x)), y = Math.floor(/** @type {number} */ (p.y));
      if (x < 0 || y < 0 || x >= w || y >= h) continue;
      const k = y * w + x;
      if (p.clip && mat[k] < 0) continue;
      mat[k] = mi; part[k] = pi; lum[k] = clamp01((p.lum ?? (lum[k] || 0.5)) + tone); tex[k] = 0;
      if (p.glow) glow.push([x, y]);
    }
  }

  // ---- lightness onto the ramps, with clustered texture and a soft dither
  const idx = new Int8Array(N).fill(-1);
  const ramps = mats.map((m) => pal[m] || pal.default || [0xff808080]);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const k = y * w + x, mi = mat[k];
      if (mi < 0) continue;
      const n = ramps[mi].length;
      const t = lum[k] + (noise2(x / 2.3, y / 2.3, seed + mi * 977) - 0.5) * texAmp * 2 * tex[k] + (bayer(x, y) - 0.5) * dith;
      idx[k] = Math.max(0, Math.min(n - 1, Math.floor(t * n)));
    }
  }
  // a part lying behind another darkens a step where they meet
  const flat = (/** @type {number} */ pi) => parts[pi].t === 'line' || parts[pi].t === 'dot';
  const sep = new Uint8Array(N);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const k = y * w + x, a = part[k];
      if (a < 0 || flat(a)) continue;
      for (const [dx, dy] of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
        const xx = x + dx, yy = y + dy;
        if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue;
        const b = part[yy * w + xx];
        if (b > a && !flat(b) && !parts[b].noOutline) { sep[k] = 1; break; }
      }
    }
  }
  const pix = new Pixels(w, h);
  const outline = o.outline !== false;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const k = y * w + x, mi = mat[k];
      if (mi < 0) continue;
      const r = ramps[mi];
      let i = idx[k];
      if (sep[k]) i = Math.max(0, i - 2);
      let c = r[i];
      const pp = parts[part[k]];
      if (outline && !pp.noOutline && !flat(part[k])) {
        const up = y === 0 || mat[k - w] < 0, left = x === 0 || mat[k - 1] < 0, down = y === h - 1 || mat[k + w] < 0, right = x === w - 1 || mat[k + 1] < 0;
        if (down || right) c = mixPacked(r[0], INK, 0.45);
        else if (up || left) c = mixPacked(r[Math.min(1, r.length - 1)], INK, 0.25);
      }
      pix.px[k] = c;
    }
  }
  const glints = model.glints.map(([x, y]) => [Math.floor(x), Math.floor(y)]).filter(([x, y]) => x >= 0 && y >= 0 && x < w && y < h && mat[y * w + x] >= 0);
  return { pix, part, glints: glints.concat(glow.filter((_, i) => i % 3 === 0)) };
}
