// Pixel art shown at a higher resolution: the wilds' and the enclosures'
// scenes, upscaled on the GPU by the pixel-art rules of the Scale2x family.
//
// A pixel-art canvas stretched by CSS to a size that is not a whole multiple
// of its pixels, with nearest-neighbour sampling, shows some of its pixels a
// screen pixel wider than others, and every diagonal edge as a staircase of
// whole art pixels. Smoothing (bilinear filtering) hides that by blurring
// it, which softens every boundary. Neither is wanted.
//
// The Scale2x rules (EPX, AdvMAME2x; Scale3x for ×3, Scale2x twice for ×4)
// look at each art pixel's neighbours and, where two of them that meet at a
// corner are the same colour and the other two differ, extend that colour
// into the corner's sub-pixel: a staircase becomes a cleaner, finer edge,
// round shapes rounder, and nothing is ever blended — every output pixel is
// one of the art's own colours, so textures and outlines stay hard. Flat
// areas and noisy textures are left exactly as they were.
//
// UpscaledCanvas does this for a canvas already in the page, which stays the
// target of the pointer and keeps its art-resolution drawing: a WebGL
// canvas laid over the part of it in view, blind to the pointer, draws it
// at the device's resolution each time present() is called — the art
// uploaded as a texture (one GPU copy), each device pixel finding its art
// pixel and its sub-pixel there and choosing its colour by the rules. At
// factor 1 (or without WebGL) it steps aside and the art canvas is shown
// as it is, nearest-neighbour.
//
// The GPU may take the overlay's context away (a phone short of graphics
// memory, the browser restarting its GPU process): the overlay then steps
// aside at once, so the art canvas shows, and comes back when the context is
// restored; after a third loss it stays aside for the session.
//
// It is cheap per frame: the layout (where the art is, how big, what part is
// in view) is measured only when something moves or resizes, never in the
// frame; a frame is one texture upload and one quad.

/** The resolutions offered: the scene's pixels multiplied by this. */
export const RESOLUTIONS = /** @type {const} */ ([1, 2, 3, 4]);

/**
 * @typedef {Object} Geo
 * @property {boolean} on
 * @property {number} ax0 @property {number} ay0 @property {number} ux @property {number} uy  art pixels per device pixel, and the art at the overlay's corner
 * @property {number} W @property {number} H  the overlay's size (device px)
 */

const VERT = `#version 300 es
in vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
precision highp int;
uniform sampler2D art;
uniform sampler2D detail; // drawn at twice the art's resolution over it (the animals), or none
uniform int hasDetail;
uniform ivec2 size;      // the art canvas
uniform vec2 a0;         // art coordinate of the overlay's top-left corner
uniform vec2 u;          // art pixels per device pixel
uniform float H;         // overlay height (device px)
uniform int k;           // 1, 2, 3 or 4
out vec4 o;
vec4 px(ivec2 q) { return texelFetch(art, clamp(q, ivec2(0), size - 1), 0); }
bool eq(vec4 a, vec4 b) { return all(lessThan(abs(a - b), vec4(0.5 / 255.0))); }
// Scale2x: the colour of the 2x image's pixel q
vec4 s2(ivec2 q) {
  ivec2 c = q / 2, s = q - c * 2;
  vec4 P = px(c), A = px(c + ivec2(0, -1)), B = px(c + ivec2(1, 0)), C = px(c + ivec2(-1, 0)), D = px(c + ivec2(0, 1));
  if (s.x == 0 && s.y == 0) return (eq(C, A) && !eq(C, D) && !eq(A, B)) ? A : P;
  if (s.x == 1 && s.y == 0) return (eq(A, B) && !eq(A, C) && !eq(B, D)) ? B : P;
  if (s.x == 0) return (eq(D, C) && !eq(D, B) && !eq(C, A)) ? C : P;
  return (eq(B, D) && !eq(B, A) && !eq(D, C)) ? D : P;
}
// Scale2x of the 2x image: the 4x image's pixel r
vec4 s4(ivec2 r) {
  ivec2 c = r / 2, s = r - c * 2;
  vec4 P = s2(c), A = s2(c + ivec2(0, -1)), B = s2(c + ivec2(1, 0)), C = s2(c + ivec2(-1, 0)), D = s2(c + ivec2(0, 1));
  if (s.x == 0 && s.y == 0) return (eq(C, A) && !eq(C, D) && !eq(A, B)) ? A : P;
  if (s.x == 1 && s.y == 0) return (eq(A, B) && !eq(A, C) && !eq(B, D)) ? B : P;
  if (s.x == 0) return (eq(D, C) && !eq(D, B) && !eq(C, A)) ? C : P;
  return (eq(B, D) && !eq(B, A) && !eq(D, C)) ? D : P;
}
// Scale3x (AdvMAME3x): sub-pixel s of art pixel c
vec4 s3(ivec2 c, ivec2 s) {
  vec4 A = px(c + ivec2(-1, -1)), B = px(c + ivec2(0, -1)), C = px(c + ivec2(1, -1));
  vec4 D = px(c + ivec2(-1, 0)), E = px(c), F = px(c + ivec2(1, 0));
  vec4 G = px(c + ivec2(-1, 1)), Hh = px(c + ivec2(0, 1)), I = px(c + ivec2(1, 1));
  bool db = eq(D, B), bf = eq(B, F), dh = eq(D, Hh), hf = eq(Hh, F);
  int i = s.y * 3 + s.x;
  if (i == 0) return (db && !bf && !dh) ? D : E;
  if (i == 1) return ((db && !bf && !dh && !eq(E, C)) || (bf && !db && !hf && !eq(E, A))) ? B : E;
  if (i == 2) return (bf && !db && !hf) ? F : E;
  if (i == 3) return ((db && !bf && !dh && !eq(E, G)) || (dh && !db && !hf && !eq(E, A))) ? D : E;
  if (i == 5) return ((bf && !db && !hf && !eq(E, I)) || (hf && !dh && !bf && !eq(E, C))) ? F : E;
  if (i == 6) return (dh && !db && !hf) ? D : E;
  if (i == 7) return ((dh && !db && !hf && !eq(E, I)) || (hf && !dh && !bf && !eq(E, G))) ? Hh : E;
  if (i == 8) return (hf && !dh && !bf) ? F : E;
  return E;
}
void main() {
  vec2 a = a0 + vec2(gl_FragCoord.x, H - gl_FragCoord.y) * u;
  if (a.x < 0.0 || a.y < 0.0 || a.x >= float(size.x) || a.y >= float(size.y)) { o = vec4(0.0, 0.0, 0.0, 1.0); return; }
  if (k == 2) o = s2(ivec2(floor(a * 2.0)));
  else if (k == 4) o = s4(ivec2(floor(a * 4.0)));
  else if (k == 3) { ivec2 q = ivec2(floor(a * 3.0)), c = q / 3; o = s3(c, q - c * 3); }
  else o = px(ivec2(floor(a)));
  if (hasDetail == 1) {
    vec4 d = texelFetch(detail, clamp(ivec2(floor(a * 2.0)), ivec2(0), size * 2 - 1), 0);
    o.rgb = mix(o.rgb, d.rgb, d.a);
  }
  o.a = 1.0;
}`;

export class UpscaledCanvas {
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
    /** the resolution: the art's pixels multiplied by this (1: the art canvas shown as it is) */
    this.factor = 1;
    /** @type {Geo|null} the layout, measured when it changes (null: measure before the next frame) */
    this.geo = null;
    this.out = /** @type {HTMLCanvasElement} */ (document.createElement('canvas'));
    this.out.className = 'crisp-overlay';
    this.out.setAttribute('aria-hidden', 'true');
    Object.assign(this.out.style, { position: 'absolute', pointerEvents: 'none', display: 'none', left: '0', top: '0' });
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    host.appendChild(this.out);
    /** @type {any} */
    this.gl = null;
    /**
     * A canvas twice the art's size, transparent but for what is drawn on it,
     * laid over the art at its own resolution (the wilds draw their animals
     * there at full size); null for none
     * @type {HTMLCanvasElement|null}
     */
    this.detail = null;
    this.failed = false;
    /** how many times the GPU took the context away */
    this.lost = 0;
    this.out.addEventListener('webglcontextlost', (e) => {
      e.preventDefault(); // (so that it can be restored)
      this.lost++;
      this.gl = null;
      this.off();
    });
    this.out.addEventListener('webglcontextrestored', () => {
      // set up again on the next frame, unless it keeps being lost
      if (this.lost >= 3) this.failed = true;
    });
    // measure again only when something moves: a scroll, a resize, a change of zoom or screen
    this.dirty = () => { this.geo = null; };
    this.onScroll = () => { this.geo = null; this.present(); };
    if (this.viewport !== src) this.viewport.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.dirty);
    this.ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(this.dirty) : null;
    if (this.ro) for (const el of new Set([src, host, this.viewport])) this.ro.observe(el);
  }

  /** Set up WebGL on the overlay (once); false where it is not to be had. */
  init() {
    if (this.gl) return true;
    if (this.failed) return false;
    const gl = /** @type {WebGL2RenderingContext|null} */ (this.out.getContext('webgl2', { alpha: false, antialias: false, depth: false, preserveDrawingBuffer: false }));
    if (!gl) { this.failed = true; return false; }
    // lost and not yet restored: wait (the art canvas shows meanwhile)
    if (gl.isContextLost()) return false;
    const sh = (/** @type {number} */ t, /** @type {string} */ s) => { const x = /** @type {WebGLShader} */ (gl.createShader(t)); gl.shaderSource(x, s); gl.compileShader(x); return x; };
    const prog = /** @type {WebGLProgram} */ (gl.createProgram());
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { if (!gl.isContextLost()) this.failed = true; return false; }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const texture = (/** @type {number} */ unit) => {
      const t = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, t);
      for (const [p, v] of [[gl.TEXTURE_MIN_FILTER, gl.NEAREST], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, p, v);
      return t;
    };
    this.texDetail = texture(1);
    this.texArt = texture(0);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    const U = (/** @type {string} */ n) => gl.getUniformLocation(prog, n);
    this.u = { size: U('size'), a0: U('a0'), u: U('u'), H: U('H'), k: U('k'), art: U('art'), detail: U('detail'), hasDetail: U('hasDetail') };
    gl.uniform1i(this.u.art, 0);
    gl.uniform1i(this.u.detail, 1);
    this.gl = gl;
    return true;
  }

  /** Whether present() will draw the overlay (a resolution above ×1, WebGL to be had, the art in view). */
  ready() {
    if (this.factor <= 1 || !this.init()) return false;
    return (this.geo || (this.geo = this.measure())).on;
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
    // the part in view: the window's inner box, or the canvas
    const vp = this.viewport, own = vp === src;
    const vr = own ? sr : vp.getBoundingClientRect();
    const left = own ? sr.left : vr.left + vp.clientLeft, top = own ? sr.top : vr.top + vp.clientTop;
    const cw = Math.min(own ? sr.width : vp.clientWidth, sr.right - left), ch = Math.min(own ? sr.height : vp.clientHeight, sr.bottom - top);
    if (cw <= 0 || ch <= 0) return no;
    // the overlay laid over the view, a device pixel to a pixel
    const hr = this.host.getBoundingClientRect(), out = this.out, st = out.style;
    const W = Math.max(1, Math.round(cw * dpr)), H = Math.max(1, Math.round(ch * dpr));
    if (out.width !== W || out.height !== H) { out.width = W; out.height = H; }
    st.left = `${left - hr.left - this.host.clientLeft}px`; st.top = `${top - hr.top - this.host.clientTop}px`;
    st.width = `${cw}px`; st.height = `${ch}px`;
    const ux = src.width / sr.width / dpr * (cw * dpr / W), uy = src.height / sr.height / dpr * (ch * dpr / H);
    return { on: true, ax0: (left - sr.left) * src.width / sr.width, ay0: (top - sr.top) * src.height / sr.height, ux, uy, W, H };
  }

  /** Paint the overlay from the art canvas as it is now (call after drawing it). */
  present() {
    if (this.factor <= 1 || !this.init()) { this.off(); return; }
    const g = this.geo || (this.geo = this.measure());
    if (!g.on) { this.off(); return; }
    const gl = this.gl, u = this.u;
    if (gl.isContextLost()) { this.gl = null; this.off(); return; }
    gl.viewport(0, 0, g.W, g.H);
    gl.activeTexture(gl.TEXTURE0);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.src);
    const det = this.detail && this.detail.width === this.src.width * 2 ? this.detail : null;
    if (det) { gl.activeTexture(gl.TEXTURE1); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, det); gl.activeTexture(gl.TEXTURE0); }
    gl.uniform1i(u.hasDetail, det ? 1 : 0);
    gl.uniform2i(u.size, this.src.width, this.src.height);
    gl.uniform2f(u.a0, g.ax0, g.ay0);
    gl.uniform2f(u.u, g.ux, g.uy);
    gl.uniform1f(u.H, g.H);
    gl.uniform1i(u.k, this.factor);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    if (!this.on) {
      this.on = true;
      this.out.style.display = 'block';
      // the art canvas stays, unseen, under the pointer
      this.src.style.opacity = '0';
    }
  }
}
