// Pixel art shown at any size, evenly: "sharp bilinear" scaling.
//
// A pixel-art canvas stretched by CSS to a size that is not a whole multiple
// of its pixels, with nearest-neighbour sampling, shows some of its pixels a
// screen pixel wider than others: one-pixel details (a stem, a glint, a
// stone's rim, an outline) swell, thin or vanish depending on where they
// fall, and fine texture shimmers as it moves. Plain smoothing blurs it all.
//
// The cure the emulators use: scale the art up by a whole number with
// nearest-neighbour (every pixel the same size, edges sharp), then the last
// fraction with bilinear filtering. Every art pixel comes out the same size;
// only the one screen pixel along its edge is blended with its neighbour —
// anti-aliased — so every detail is drawn whole and none is lost.
//
// CrispCanvas does this for a canvas already in the page, which stays the
// target of the pointer and keeps its art-resolution drawing: a second
// canvas, laid over the part of it in view and blind to the pointer, is
// painted from it each time present() is called. Where nearest-neighbour is
// already even (a whole-number scale) or the pixels are big enough that a
// screen pixel more or less is not seen, it steps aside.
//
// It is cheap per frame: the layout (where the art is, how big, what part
// is in view) is measured only when something moves or resizes, never in
// the frame; the two canvases are opaque and kept at their size; a frame is
// two GPU copies of the part in view and nothing else.

/** From this many screen pixels per art pixel, plain nearest-neighbour is even enough. */
const MAX_SCALE = 6;

/**
 * @typedef {Object} Geo
 * @property {boolean} on
 * @property {number} ax0 @property {number} ay0 @property {number} aw @property {number} ah  the art in view
 * @property {number} k     the whole-number upscale
 * @property {number} dx @property {number} dy @property {number} dw @property {number} dh  where it lands on the overlay (device px)
 * @property {boolean} cover  whether it covers the whole overlay (nothing to clear)
 */

export class CrispCanvas {
  /**
   * @param {HTMLCanvasElement} src the art canvas, sized by CSS
   * @param {HTMLElement} host a positioned ancestor the overlay is laid in
   * @param {HTMLElement} [viewport] what clips the art (a scrolling window), the canvas itself by default
   */
  constructor(src, host, viewport) {
    this.src = src;
    this.host = host;
    this.viewport = viewport || src;
    this.on = false;
    this.enabled = true;
    /** @type {Geo|null} the layout, measured when it changes (null: measure before the next frame) */
    this.geo = null;
    this.out = /** @type {HTMLCanvasElement} */ (document.createElement('canvas'));
    this.out.className = 'crisp-overlay';
    this.out.setAttribute('aria-hidden', 'true');
    Object.assign(this.out.style, { position: 'absolute', pointerEvents: 'none', display: 'none', imageRendering: 'auto', left: '0', top: '0' });
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    host.appendChild(this.out);
    // both opaque (the art always is): cheaper to fill and to composite
    this.octx = /** @type {CanvasRenderingContext2D} */ (this.out.getContext('2d', { alpha: false }));
    /** the art scaled up by a whole number */
    this.mid = document.createElement('canvas');
    this.mctx = /** @type {CanvasRenderingContext2D} */ (this.mid.getContext('2d', { alpha: false }));
    // measure again only when something moves: a scroll, a resize, a change of zoom or screen
    this.dirty = () => { this.geo = null; };
    this.onScroll = () => { this.geo = null; this.present(); };
    if (this.viewport !== src) this.viewport.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.dirty);
    this.ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(this.dirty) : null;
    if (this.ro) for (const el of new Set([src, host, this.viewport])) this.ro.observe(el);
  }

  /** Stop and remove the overlay. */
  dispose() {
    this.off();
    this.out.remove();
    if (this.viewport !== this.src) this.viewport.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.dirty);
    if (this.ro) this.ro.disconnect();
  }

  /** Show the art canvas itself. */
  off() {
    if (!this.on) return;
    this.on = false;
    this.out.style.display = 'none';
    this.src.style.opacity = '';
  }

  /** Measure the layout: what part of the art is in view, at what scale, where. @returns {Geo} */
  measure() {
    const src = this.src, no = /** @type {Geo} */ ({ on: false });
    if (!src.isConnected || !src.width) return no;
    const dpr = window.devicePixelRatio || 1;
    const sr = src.getBoundingClientRect();
    if (!sr.width || !sr.height) return no;
    // screen pixels per art pixel
    const s = (sr.width / src.width) * dpr;
    if (s < 1 || s >= MAX_SCALE || Math.abs(s - Math.round(s)) < 0.04) return no;
    // the part in view: the window's inner box, or the canvas
    const vp = this.viewport, own = vp === src;
    const vr = own ? sr : vp.getBoundingClientRect();
    const left = own ? sr.left : vr.left + vp.clientLeft, top = own ? sr.top : vr.top + vp.clientTop;
    const cw = own ? sr.width : vp.clientWidth, ch = own ? sr.height : vp.clientHeight;
    if (cw <= 0 || ch <= 0) return no;
    const ux = src.width / sr.width, uy = src.height / sr.height;
    const ax0 = Math.max(0, Math.floor((left - sr.left) * ux)), ay0 = Math.max(0, Math.floor((top - sr.top) * uy));
    const ax1 = Math.min(src.width, Math.ceil((left + cw - sr.left) * ux)), ay1 = Math.min(src.height, Math.ceil((top + ch - sr.top) * uy));
    const aw = ax1 - ax0, ah = ay1 - ay0;
    if (aw <= 0 || ah <= 0) return no;
    // up by a whole number: past the size shown while that is small, else just under it (fewer pixels to fill)
    const k = s < 3 ? Math.ceil(s) : Math.floor(s);
    if (this.mid.width < aw * k || this.mid.height < ah * k) { this.mid.width = Math.max(this.mid.width, aw * k); this.mid.height = Math.max(this.mid.height, ah * k); }
    // the overlay laid over the view, a device pixel to a pixel
    const hr = this.host.getBoundingClientRect(), out = this.out, st = out.style;
    const W = Math.max(1, Math.round(cw * dpr)), H = Math.max(1, Math.round(ch * dpr));
    if (out.width !== W || out.height !== H) { out.width = W; out.height = H; }
    st.left = `${left - hr.left - this.host.clientLeft}px`; st.top = `${top - hr.top - this.host.clientTop}px`;
    st.width = `${cw}px`; st.height = `${ch}px`;
    const dx = (sr.left + ax0 / ux - left) * dpr, dy = (sr.top + ay0 / uy - top) * dpr, dw = (aw / ux) * dpr, dh = (ah / uy) * dpr;
    const cover = dx <= 0 && dy <= 0 && dx + dw >= W && dy + dh >= H;
    return { on: true, ax0, ay0, aw, ah, k, dx, dy, dw, dh, cover };
  }

  /** Paint the overlay from the art canvas as it is now (call after drawing it). */
  present() {
    if (!this.enabled) { this.off(); return; }
    const g = this.geo || (this.geo = this.measure());
    if (!g.on) { this.off(); return; }
    const m = this.mctx, o = this.octx, kw = g.aw * g.k, kh = g.ah * g.k;
    m.imageSmoothingEnabled = false;
    m.drawImage(this.src, g.ax0, g.ay0, g.aw, g.ah, 0, 0, kw, kh);
    o.imageSmoothingEnabled = true;
    o.imageSmoothingQuality = 'low';
    if (!g.cover) o.clearRect(0, 0, this.out.width, this.out.height);
    o.drawImage(this.mid, 0, 0, kw, kh, g.dx, g.dy, g.dw, g.dh);
    if (!this.on) {
      this.on = true;
      this.out.style.display = 'block';
      // the art canvas stays, unseen, under the pointer
      this.src.style.opacity = '0';
    }
  }
}
