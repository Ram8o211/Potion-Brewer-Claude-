// A plain RGBA pixel buffer: the procedural pipeline paints into these in pure
// JavaScript (so Node renders exactly the pixels a browser does) and only the
// sprite cache turns them into canvases. Colours are packed little-endian
// RGBA words (visual/color.js `pack`).

export class Pixels {
  /** @param {number} w @param {number} h */
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.data = new Uint8ClampedArray(w * h * 4);
    this.px = new Uint32Array(this.data.buffer);
  }

  /** @param {number} x @param {number} y */
  get(x, y) {
    return x < 0 || y < 0 || x >= this.w || y >= this.h ? 0 : this.px[y * this.w + x];
  }

  /** @param {number} x @param {number} y @param {number} c packed colour */
  set(x, y, c) {
    x |= 0; y |= 0;
    if (x >= 0 && y >= 0 && x < this.w && y < this.h) this.px[y * this.w + x] = c;
  }

  /** Blend a colour over a pixel at opacity `a` (0..1); the result keeps the pixel's alpha (or becomes opaque). */
  blend(x, y, c, a) {
    x |= 0; y |= 0;
    if (x < 0 || y < 0 || x >= this.w || y >= this.h || a <= 0) return;
    const k = y * this.w + x, o = this.px[k];
    if (a >= 1 || !(o >>> 24)) { if (a >= 1) this.px[k] = c; else if (!(o >>> 24)) this.px[k] = (c & 0xffffff) | (Math.round(a * 255) << 24) >>> 0; return; }
    const r = (o & 255) + ((c & 255) - (o & 255)) * a, g = ((o >>> 8) & 255) + (((c >>> 8) & 255) - ((o >>> 8) & 255)) * a, b = ((o >>> 16) & 255) + (((c >>> 16) & 255) - ((o >>> 16) & 255)) * a;
    this.px[k] = ((o & 0xff000000) | (Math.round(b) << 16) | (Math.round(g) << 8) | Math.round(r)) >>> 0;
  }

  /** Fill a rectangle. */
  rect(x, y, w, h, c) {
    for (let j = Math.max(0, y | 0); j < Math.min(this.h, (y + h) | 0); j++) for (let i = Math.max(0, x | 0); i < Math.min(this.w, (x + w) | 0); i++) this.px[j * this.w + i] = c;
  }

  /** Draw another buffer's opaque pixels with its top-left at (x, y); `flip` mirrors it. @param {Pixels} src */
  draw(src, x, y, flip = false) {
    for (let j = 0; j < src.h; j++) {
      const yy = y + j;
      if (yy < 0 || yy >= this.h) continue;
      for (let i = 0; i < src.w; i++) {
        const c = src.px[j * src.w + (flip ? src.w - 1 - i : i)];
        const a = c >>> 24;
        if (!a) continue;
        const xx = x + i;
        if (xx < 0 || xx >= this.w) continue;
        if (a === 255) this.px[yy * this.w + xx] = c; else this.blend(xx, yy, c | 0xff000000, a / 255);
      }
    }
  }

  /** 1 where a pixel is opaque. */
  mask() {
    const m = new Uint8Array(this.w * this.h);
    for (let k = 0; k < m.length; k++) m[k] = this.px[k] >>> 24 ? 1 : 0;
    return m;
  }

  /** A stable 32-bit hash of the pixels (for tests: identical seeds paint identical pixels). */
  hash() {
    let h = 2166136261 >>> 0;
    for (let k = 0; k < this.px.length; k++) { h ^= this.px[k]; h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  /** A canvas with these pixels (browser only). */
  toCanvas() {
    const cv = document.createElement('canvas');
    cv.width = this.w; cv.height = this.h;
    const ctx = /** @type {CanvasRenderingContext2D} */ (cv.getContext('2d'));
    if (this.w && this.h) ctx.putImageData(new ImageData(new Uint8ClampedArray(this.data), this.w, this.h), 0, 0);
    return cv;
  }
}
