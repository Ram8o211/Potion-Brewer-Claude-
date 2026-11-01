// Pixel art shown at any size, evenly: "sharp bilinear" scaling.
//
// A pixel-art canvas stretched by CSS to a size that is not a whole multiple
// of its pixels, with nearest-neighbour sampling, shows some of its pixels a
// screen pixel wider than others: one-pixel details (a stem, a glint, a
// stone's rim, an outline) swell, thin or vanish depending on where they
// fall, and fine texture shimmers as it moves. Plain smoothing blurs it all.
//
// The cure the emulators use: scale the art up by a whole number with
// nearest-neighbour (every pixel the same size, edges sharp), to just past
// the size it is shown at, then down the last fraction with bilinear
// filtering. Every art pixel comes out the same size; only the one screen
// pixel along its edge is blended with its neighbour — anti-aliased —
// so every detail is drawn whole and none is lost.
//
// CrispCanvas does this for a canvas already in the page, which stays the
// target of the pointer and keeps its art-resolution drawing: a second
// canvas, laid over the part of it in view and blind to the pointer, is
// painted from it each time present() is called. Where nearest-neighbour is
// already even (a whole-number scale) or the pixels are big enough that a
// screen pixel more or less is not seen, it steps aside.

/** From this many screen pixels per art pixel, plain nearest-neighbour is even enough. */
const MAX_SCALE = 7;

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
    this.out = /** @type {HTMLCanvasElement} */ (document.createElement('canvas'));
    this.out.className = 'crisp-overlay';
    this.out.setAttribute('aria-hidden', 'true');
    Object.assign(this.out.style, { position: 'absolute', pointerEvents: 'none', display: 'none', imageRendering: 'auto', left: '0', top: '0' });
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    host.appendChild(this.out);
    /** the art scaled up by a whole number @type {HTMLCanvasElement} */
    this.mid = document.createElement('canvas');
    // a scrolled window shows another part: paint it at once
    this.onScroll = () => this.present();
    if (this.viewport !== src) this.viewport.addEventListener('scroll', this.onScroll, { passive: true });
  }

  /** Stop and remove the overlay. */
  dispose() {
    this.off();
    this.out.remove();
    if (this.viewport !== this.src) this.viewport.removeEventListener('scroll', this.onScroll);
  }

  /** Show the art canvas itself. */
  off() {
    if (!this.on) return;
    this.on = false;
    this.out.style.display = 'none';
    this.src.style.opacity = '';
  }

  /** Paint the overlay from the art canvas as it is now. */
  present() {
    const src = this.src;
    if (!this.enabled || !src.isConnected || !src.width) { this.off(); return; }
    const dpr = window.devicePixelRatio || 1;
    const sr = src.getBoundingClientRect();
    if (!sr.width || !sr.height) { this.off(); return; }
    // screen pixels per art pixel
    const s = (sr.width / src.width) * dpr;
    if (s < 1 || s >= MAX_SCALE || Math.abs(s - Math.round(s)) < 0.04) { this.off(); return; }
    // the part in view: the window's inner box, or the canvas
    const vp = this.viewport, own = vp === src;
    const vr = own ? sr : vp.getBoundingClientRect();
    const left = own ? sr.left : vr.left + vp.clientLeft, top = own ? sr.top : vr.top + vp.clientTop;
    const cw = own ? sr.width : vp.clientWidth, ch = own ? sr.height : vp.clientHeight;
    if (cw <= 0 || ch <= 0) { this.off(); return; }
    const ux = src.width / sr.width, uy = src.height / sr.height;
    const ax0 = Math.max(0, Math.floor((left - sr.left) * ux)), ay0 = Math.max(0, Math.floor((top - sr.top) * uy));
    const ax1 = Math.min(src.width, Math.ceil((left + cw - sr.left) * ux)), ay1 = Math.min(src.height, Math.ceil((top + ch - sr.top) * uy));
    const aw = ax1 - ax0, ah = ay1 - ay0;
    if (aw <= 0 || ah <= 0) { this.off(); return; }
    // nearest-neighbour up by a whole number, to just past the size shown
    const k = Math.ceil(s), mid = this.mid;
    if (mid.width < aw * k || mid.height < ah * k) { mid.width = Math.max(mid.width, aw * k); mid.height = Math.max(mid.height, ah * k); }
    const m = /** @type {CanvasRenderingContext2D} */ (mid.getContext('2d'));
    m.imageSmoothingEnabled = false;
    m.clearRect(0, 0, aw * k, ah * k);
    m.drawImage(src, ax0, ay0, aw, ah, 0, 0, aw * k, ah * k);
    // then down the last fraction, filtered, onto the overlay laid over the view
    const hr = this.host.getBoundingClientRect();
    const W = Math.max(1, Math.round(cw * dpr)), H = Math.max(1, Math.round(ch * dpr)), out = this.out;
    if (out.width !== W || out.height !== H) { out.width = W; out.height = H; }
    const st = out.style, L = `${left - hr.left - this.host.clientLeft}px`, T = `${top - hr.top - this.host.clientTop}px`;
    if (st.left !== L) st.left = L;
    if (st.top !== T) st.top = T;
    const wcss = `${cw}px`, hcss = `${ch}px`;
    if (st.width !== wcss) st.width = wcss;
    if (st.height !== hcss) st.height = hcss;
    const o = /** @type {CanvasRenderingContext2D} */ (out.getContext('2d'));
    o.imageSmoothingEnabled = true;
    o.imageSmoothingQuality = 'low';
    o.clearRect(0, 0, W, H);
    const dx = (sr.left + ax0 / ux - left) * dpr, dy = (sr.top + ay0 / uy - top) * dpr;
    o.drawImage(mid, 0, 0, aw * k, ah * k, dx, dy, (aw / ux) * dpr, (ah / uy) * dpr);
    if (!this.on) {
      this.on = true;
      st.display = 'block';
      // the art canvas stays, unseen, under the pointer
      this.src.style.opacity = '0';
    }
  }
}
