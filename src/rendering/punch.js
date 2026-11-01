// Making a small sprite stand out from a busy painting: the animals of the
// wilds are drawn at half their hutch size into scenes full of leaves, rock
// and shade of the same colours as their coats. This pass, on the sprite's
// own pixels (RGBA, a pixel of margin all round), spreads its tones apart
// and deepens its colours, then rings its silhouette with ink — and, beyond
// the ink, a faint pale halo that keeps it apart from dark ground too.
// The colour part alone (`ink: false`) is how every animal's sprite is
// graded (rendering/rabbit.js), so an animal looks the same in its pen, on
// its card and in the wilds; the wilds then add only the ink and halo.

/** How far tones spread from the sprite's mean, and how much richer its colours get. */
const CONTRAST = 1.4, SATURATE = 1.3;
const INK = [20, 12, 16, 235], HALO = [255, 244, 220, 70];

/**
 * @param {Uint8ClampedArray} d RGBA pixels, w × h, modified in place
 * @param {number} w @param {number} h
 * @param {{contrast?:number, saturate?:number, halo?:boolean, ink?:boolean}} [o]
 */
export function punchSprite(d, w, h, o = {}) {
  const k = o.contrast ?? CONTRAST, sat = o.saturate ?? SATURATE, N = w * h;
  let sum = 0, n = 0;
  for (let i = 0; i < N; i++) if (d[i * 4 + 3] > 127) { sum += 0.3 * d[i * 4] + 0.59 * d[i * 4 + 1] + 0.11 * d[i * 4 + 2]; n++; }
  if (!n) return;
  const mean = sum / n;
  if (k !== 1 || sat !== 1) for (let i = 0; i < N; i++) {
    const p = i * 4;
    if (d[p + 3] <= 127) continue;
    const r = d[p], g = d[p + 1], b = d[p + 2], l = 0.3 * r + 0.59 * g + 0.11 * b;
    // richer colour round its own grey, then the tones spread round the sprite's mean
    const L = mean + (l - mean) * k;
    d[p] = L + (r - l) * sat; d[p + 1] = L + (g - l) * sat; d[p + 2] = L + (b - l) * sat;
    d[p + 3] = 255;
  }
  if (o.ink === false) return;
  // the ink ring, then the halo ring beyond it
  const solid = new Uint8Array(N);
  for (let i = 0; i < N; i++) solid[i] = d[i * 4 + 3] > 127 ? 1 : 0;
  const ring = (src, out) => {
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (src[i]) continue;
      if ((x > 0 && src[i - 1]) || (x < w - 1 && src[i + 1]) || (y > 0 && src[i - w]) || (y < h - 1 && src[i + w])) out.push(i);
    }
  };
  const ink = [];
  ring(solid, ink);
  for (const i of ink) { d.set(INK, i * 4); solid[i] = 2; }
  if (o.halo === false) return;
  const halo = [];
  ring(solid, halo);
  for (const i of halo) d.set(HALO, i * 4);
}
