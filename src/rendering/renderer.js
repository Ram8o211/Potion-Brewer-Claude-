// Scene renderer: composes the workshop, hearth fire, cauldron, materials,
// tools, effects and lighting at a fixed "art pixel" density, upscaled with
// nearest-neighbour filtering for crisp pixel art at any screen size.

import { PAL, paintBackground, renderCauldron, paintHearth, makeCanvas, rgbStr, hex2rgb, drawJar, rect } from './art.js';
import { FluidRenderer } from './fluid.js';
import { Effects } from './effects.js';
import { COLUMN } from '../simulation/cauldron.js';
import { PHASE } from '../simulation/constants.js';
import { compositionEffects, dominantEffect, EFFECTS, NE } from '../alchemy/effects.js';

const auraScratch = new Float64Array(NE);

/** top of the visible scene (sim units): enough headroom for the pouring jar */
const VIEW_TOP = -1.25;

export class Renderer {
  /** @param {HTMLCanvasElement} canvas */
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.fluid = new FluidRenderer();
    this.fx = new Effects();
    this.W = 0;
    this.H = 0;
    this.artPx = 1;
    this.view = { scale: 50, ox: 0, oy: 0 };
    this.bg = null;
    this.cauldronArt = null;
    this.heatCanvas = null;
    this.frame = 0;
    this.jars = [];
    this.quality = 'high';
    this._key = '';
  }

  /**
   * @param {number} cssW @param {number} cssH
   * @param {import('../simulation/cauldron.js').Cauldron} cauldron
   * @param {{color:number[], form:string}[]} jars
   * @param {'high'|'medium'|'low'} quality
   */
  resize(cssW, cssH, cauldron, jars, quality = 'high') {
    // pick an art-pixel size of ~1–2 CSS px so materials read as fine pixels
    const base = Math.min(cssW * 0.85, cssH);
    let artPx = Math.max(1, Math.round(base / 380));
    if (quality === 'low') artPx += 1;
    const W = Math.max(64, Math.round(cssW / artPx));
    const H = Math.max(64, Math.round(cssH / artPx));
    const key = `${W}x${H}:${cauldron.spec.key}:${jars.length}:${quality}`;
    this.cauldron = cauldron;
    if (key === this._key) return;
    this._key = key;
    this.artPx = artPx;
    this.quality = quality;
    this.canvas.width = W;
    this.canvas.height = H;
    this.canvas.style.width = cssW + 'px';
    this.canvas.style.height = cssH + 'px';
    this.W = W;
    this.H = H;
    this.ctx = this.canvas.getContext('2d', { alpha: false });
    this.ctx.imageSmoothingEnabled = false;
    const c = cauldron;
    const viewW = 2 * (c.belly + 0.55);
    const viewTop = VIEW_TOP, viewBot = c.depth + 1.0;
    const viewH = viewBot - viewTop;
    const s = Math.min(W / viewW, H / viewH);
    this.view = { scale: s, ox: Math.round(W / 2), oy: Math.round((H - viewH * s) / 2 - viewTop * s) };
    this.jars = jars;
    this.bg = makeCanvas(W, H);
    const bctx = this.bg.getContext('2d');
    bctx.imageSmoothingEnabled = false;
    const floorY = Math.round(this.view.oy + (c.depth + 0.72) * s);
    paintBackground(bctx, W, H, { cx: this.view.ox, floorY, scale: s, jars });
    paintHearth(bctx, c, this.view);
    this.cauldronArt = renderCauldron(c, this.view);
    this.heatCanvas = makeCanvas(this.cauldronArt.canvas.width, this.cauldronArt.canvas.height);
    this.heatCtx = this.heatCanvas.getContext('2d');
    this.heatImg = this.heatCtx.createImageData(this.heatCanvas.width, this.heatCanvas.height);
  }

  /** Screen (CSS px relative to canvas) → world coordinates. */
  toWorld(cssX, cssY) {
    const X = cssX / this.artPx, Y = cssY / this.artPx;
    return [(X - this.view.ox) / this.view.scale, (Y - this.view.oy) / this.view.scale];
  }
  /** World → art-pixel screen. */
  toScreen(x, y) {
    return [x * this.view.scale + this.view.ox, y * this.view.scale + this.view.oy];
  }

  /**
   * @param {any} st scene state
   *   sim, time, dt, pour:{def,x,active}, tool:{type,x,y,active}, bottling:{progress,color,ml}|null,
   *   probe:{x,y}|null, thermal:boolean, alembic:boolean, receiver:{count,color}|null, stirrer:boolean
   */
  render(st) {
    const { ctx, view } = this;
    const sim = st.sim;
    const c = sim.cauldron;
    const s = view.scale;
    this.frame++;
    ctx.drawImage(this.bg, 0, 0);

    // ---- fire / frost under the cauldron
    const setting = sim.furnace.setting;
    const fireX = view.ox, fireY = Math.round(view.oy + (c.depth + 0.52) * s);
    const fireW = c.belly * 1.15 * s;
    // coal bed
    rect(ctx, fireX - fireW / 2, fireY, fireW, Math.max(2, s * 0.06), setting > 0.02 ? PAL.fire0 : PAL.stone0);
    if (setting > 0.02) {
      this.fx.fire(fireX, fireY, fireW * 0.9, setting * (0.6 + 0.4 * sim.furnace.maxFlame / 520), s, st.dt);
      for (let k = 0; k < fireW; k += 3) {
        const flick = Math.sin(st.time * 9 + k) * 0.5 + 0.5;
        if (flick > 0.5) rect(ctx, fireX - fireW / 2 + k, fireY, 2, 1, PAL.fire2);
      }
    } else if (setting < -0.02) {
      rect(ctx, fireX - fireW / 2, fireY - 1, fireW, Math.max(2, s * 0.05), PAL.frost1);
      rect(ctx, fireX - fireW / 2, fireY - 1, fireW, 1, PAL.frost3);
      this.fx.frost(fireX, fireY, fireW, -setting, s, st.dt);
    }

    // ---- cauldron body
    const ca = this.cauldronArt;
    ctx.drawImage(ca.canvas, ca.x, ca.y);
    if (this.frame % 4 === 0) this._updateHeat(c);
    ctx.drawImage(this.heatCanvas, ca.x, ca.y);

    // ---- materials
    this.fluid.thermal = !!st.thermal;
    const fr = this.fluid.render(sim, view, st.time);
    if (fr) ctx.drawImage(fr.canvas, fr.x, fr.y);

    // ---- lid
    this._drawLid(c, st);

    // ---- alembic & receiver
    if (st.alembic) this._drawAlembic(c, st);

    // ---- tap & bottle
    this._drawTap(c, st);

    // ---- tools
    if (st.pour && st.pour.active) this._drawPour(c, st);
    const tool = st.tool;
    if (tool && (tool.active || st.toolHover) && tool.type !== 'none') this._drawTool(c, tool, st);
    if (st.stirrer) this._drawStirrer(c, st);

    // ---- flames licking up from burning matter
    const p = sim.p;
    for (let i = 0; i < p.count; i++) {
      const b = p.burn[i];
      if (b > 0.2 && this.fx.rand() < b * 0.5) {
        const [fx, fy] = this.toScreen(p.x[i], p.y[i]);
        this.fx.add(0, fx + (this.fx.rand() - 0.5) * s * 0.08, fy - 1, (this.fx.rand() - 0.5) * s * 0.1, -s * (0.4 + this.fx.rand() * 0.6), 0.25 + this.fx.rand() * 0.25, Math.max(1, s * 0.035));
        if (this.fx.rand() < 0.04) this.fx.add(1, fx, fy, (this.fx.rand() - 0.5) * s, -s * (0.8 + this.fx.rand()), 0.6, 1, [255, 220, 120]);
      }
    }

    // ---- Aether Lens: a faint aura shimmer in the colour of the strongest
    // effect where it is present (a clue: which kind, never how strong)
    if (st.aura && this.quality !== 'low' && p.count) {
      const tries = this.quality === 'high' ? 4 : 2;
      for (let k = 0; k < tries; k++) {
        const i = Math.floor(this.fx.rand() * p.count);
        if (p.phase[i] === PHASE.GAS || p.phase[i] === PHASE.SOLID) continue;
        compositionEffects(sim.species, p.comp, i * p.S, p.temp[i], sim.laws || [], auraScratch);
        const d = dominantEffect(auraScratch, 4);
        if (d < 0 || this.fx.rand() > 0.35) continue;
        const [ax, ay] = this.toScreen(p.x[i], p.y[i]);
        const col = EFFECTS[d].color;
        this.fx.add(4, ax, ay - 1, 0, -s * 0.15, 0.6, 1, [col[0] * 255, col[1] * 255, col[2] * 255]);
      }
    }

    // ---- effects
    this.fx.update(st.dt);
    this.fx.draw(ctx);

    // ---- probe
    if (st.probe) {
      const [px, py] = this.toScreen(st.probe.x, st.probe.y);
      const r = Math.round(st.probe.r * s);
      ctx.strokeStyle = PAL.brassHi;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(Math.round(px) + 0.5, Math.round(py) + 0.5, r, 0, Math.PI * 2);
      ctx.stroke();
      rect(ctx, px - 3, py, 7, 1, PAL.brassHi);
      rect(ctx, px, py - 3, 1, 7, PAL.brassHi);
    }

    // ---- lighting (cheap additive glows)
    if (this.quality !== 'low') this._lighting(c, st);
  }

  _updateHeat(c) {
    const ca = this.cauldronArt;
    const img = this.heatImg;
    const d = img.data;
    d.fill(0);
    const wp = ca.wallPix;
    for (let k = 0; k < wp.length; k += 3) {
      const T = c.cellT[wp[k + 2]];
      const o = (wp[k + 1] * img.width + wp[k]) * 4;
      if (T > 140) {
        const a = Math.min(1, (T - 140) / 360);
        d[o] = 255; d[o + 1] = Math.round(60 + 120 * a * a); d[o + 2] = 20; d[o + 3] = Math.round(a * 200);
      } else if (T < 2) {
        const a = Math.min(1, (2 - T) / 40);
        const speck = ((wp[k] * 7 + wp[k + 1] * 13) % 5) === 0 ? 1 : 0.55;
        d[o] = 210; d[o + 1] = 240; d[o + 2] = 255; d[o + 3] = Math.round(a * 190 * speck);
      }
    }
    this.heatCtx.putImageData(img, 0, 0);
  }

  _drawLid(c, st) {
    const { ctx, view } = this;
    const s = view.scale;
    const lw = Math.round((c.mouth + 0.22) * 2 * s);
    if (c.lidClosed) {
      const x = Math.round(view.ox - lw / 2), y = Math.round(view.oy - 0.12 * s);
      const h = Math.max(3, Math.round(0.12 * s));
      rect(ctx, x, y, lw, h, PAL.iron3);
      rect(ctx, x, y, lw, 1, PAL.iron5);
      rect(ctx, x + 2, y - Math.round(0.08 * s), lw - 4, Math.round(0.08 * s), PAL.iron2);
      rect(ctx, x + 2, y - Math.round(0.08 * s), lw - 4, 1, PAL.iron4);
      // knob
      const kw = Math.max(3, Math.round(0.2 * s));
      rect(ctx, view.ox - kw / 2 - Math.round(0.9 * s), y - Math.round(0.2 * s), kw, Math.round(0.12 * s), PAL.wood4);
      // funnel port (brass)
      const px = Math.round(view.ox + (st.pour && st.pour.active ? st.pour.x : 0.6) * s);
      const fw = Math.max(4, Math.round(0.22 * s));
      rect(ctx, px - fw / 2, y - Math.round(0.18 * s), fw, Math.round(0.1 * s), PAL.brass);
      rect(ctx, px - fw / 4, y - Math.round(0.1 * s), fw / 2, Math.round(0.14 * s), PAL.copper2);
      rect(ctx, px - fw / 2, y - Math.round(0.18 * s), fw, 1, PAL.brassHi);
    } else {
      // lid propped against the cauldron's leg, standing on the hearth
      const lh = Math.round(lw * 0.42);
      const x = Math.round(view.ox - (c.belly * 0.62 + 0.2) * s - lh * 0.35), y = Math.round(view.oy + (c.depth + 0.55) * s);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-0.35);
      const th = Math.max(3, Math.round(0.11 * s));
      rect(ctx, -th, -lh, th, lh, PAL.iron3);
      rect(ctx, -th, -lh, 1, lh, PAL.iron5);
      rect(ctx, 0, -lh * 0.6, Math.max(2, Math.round(th * 0.8)), Math.round(lh * 0.2), PAL.wood4);
      ctx.restore();
    }
  }

  _drawTap(c, st) {
    const { ctx, view } = this;
    const s = view.scale;
    const tx = Math.round(view.ox + (c.halfWidth(c.depth - 0.35) + 0.16) * s);
    const ty = Math.round(view.oy + (c.depth - 0.35) * s);
    const tw = Math.max(4, Math.round(0.25 * s)), th = Math.max(2, Math.round(0.07 * s));
    rect(ctx, tx, ty, tw, th, PAL.brass);
    rect(ctx, tx, ty, tw, 1, PAL.brassHi);
    rect(ctx, tx + tw - th, ty + th, th, th * 2, PAL.copper2);
    rect(ctx, tx + Math.round(tw / 3), ty - th, th, th, PAL.copper3); // valve handle
    const b = st.bottling;
    // bottle stands on the hearth below the tap
    const bw = Math.max(6, Math.round(0.34 * s)), bh = Math.max(9, Math.round(0.55 * s));
    const bx = tx + tw - th / 2 - bw / 2, by = Math.round(view.oy + (c.depth + 0.55) * s) - bh;
    if (b) {
      // stream from tap
      const sx = Math.round(tx + tw - th / 2), sy = ty + th * 3;
      if (b.progress < 1) rect(ctx, sx - 1, sy, 2, by + bh * (1 - b.progress * 0.8) - sy, rgbStr(b.color));
      drawBottle(ctx, bx, by, bw, bh, b.color, b.progress);
    } else if (st.showBottle) {
      drawBottle(ctx, bx, by, bw, bh, [0.5, 0.5, 0.5], 0);
    }
  }

  _drawPour(c, st) {
    const { ctx, view } = this;
    const s = view.scale;
    const def = st.pour.def;
    const x = Math.round(view.ox + st.pour.x * s);
    const jarW = Math.max(6, Math.round(0.36 * s)), jarH = Math.max(9, Math.round(0.55 * s));
    const jy = Math.round(view.oy + (VIEW_TOP + 0.04) * s);
    ctx.save();
    ctx.translate(x - jarW * 0.2, jy + jarH * 0.5);
    ctx.rotate(2.0);
    drawJar(ctx, -jarW / 2, -jarH / 2, jarW, jarH, def.look || def.color, def.form);
    ctx.restore();
    // stream to the entry point
    const entry = c.lidClosed ? view.oy - 0.25 * s : view.oy + (-COLUMN * 0.55) * s;
    const col = rgbStr(def.look || def.color);
    if (def.form === 'powder') {
      for (let y = jy + jarH; y < entry; y += 2) {
        if (((y * 7 + this.frame) % 5) < 3) rect(ctx, x + Math.round(Math.sin(y + this.frame) * 1.2), y, 1, 1, col);
      }
    } else if (def.form === 'liquid') {
      rect(ctx, x - 1, jy + jarH, 2, entry - jy - jarH, col);
      rect(ctx, x - 1, jy + jarH, 1, entry - jy - jarH, rgbStr(def.look || def.color, 1.3));
    }
  }

  _drawTool(c, tool, st) {
    const { ctx, view } = this;
    const s = view.scale;
    const [tx, ty] = this.toScreen(tool.x, tool.y);
    // handle leans toward the outside top of the cauldron
    const pivotX = view.ox + (tool.x >= 0 ? 1 : -1) * (c.mouth + 0.7) * s;
    const pivotY = view.oy + (VIEW_TOP - 0.1) * s;
    const ang = Math.atan2(pivotY - ty, pivotX - tx);
    const len = Math.hypot(pivotX - tx, pivotY - ty);
    ctx.save();
    ctx.translate(Math.round(tx), Math.round(ty));
    ctx.rotate(ang);
    if (tool.type === 'spoon') {
      const hw = Math.max(2, Math.round(0.055 * s));
      rect(ctx, 0, -hw / 2, len, hw, PAL.wood4);
      rect(ctx, 0, -hw / 2, len, 1, PAL.wood5);
      const br = Math.max(3, Math.round(0.12 * s));
      ctx.fillStyle = PAL.wood3;
      ctx.beginPath();
      ctx.ellipse(0, 0, br * 1.3, br, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = PAL.wood5;
      ctx.fillRect(-br, -br + 1, br, 1);
    } else if (tool.type === 'pestle') {
      const hw = Math.max(3, Math.round(0.11 * s));
      rect(ctx, 0, -hw / 2, len * 0.75, hw, PAL.stone3);
      rect(ctx, 0, -hw / 2, len * 0.75, 1, PAL.stone4);
      const br = Math.max(4, Math.round(0.17 * s));
      ctx.fillStyle = PAL.stone4;
      ctx.beginPath();
      ctx.arc(0, 0, br, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = PAL.stone2;
      ctx.fillRect(-br + 1, 1, br * 2 - 2, 1);
    } else if (tool.type === 'skimmer') {
      const hw = Math.max(2, Math.round(0.045 * s));
      rect(ctx, 0, -hw / 2, len, hw, PAL.brass);
      const br = Math.max(4, Math.round(0.2 * s));
      ctx.strokeStyle = PAL.brassHi;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, br, 0, Math.PI * 2);
      ctx.stroke();
      for (let k = -br + 2; k < br - 1; k += 2) rect(ctx, k, -br + 2, 1, br * 2 - 4, 'rgba(232,180,92,0.6)');
    }
    ctx.restore();
    if (tool.active && tool.type === 'spoon' && this.quality === 'high') {
      // faint ring showing the stirring reach
      ctx.strokeStyle = 'rgba(255,240,200,0.12)';
      ctx.beginPath();
      ctx.arc(Math.round(tx) + 0.5, Math.round(ty) + 0.5, Math.round(0.42 * s), 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  _drawStirrer(c, st) {
    const { ctx, view } = this;
    const s = view.scale;
    // clockwork box on the rim
    const x = Math.round(view.ox - (c.mouth + 0.45) * s), y = Math.round(view.oy - 0.45 * s);
    const w = Math.round(0.42 * s), h = Math.round(0.32 * s);
    rect(ctx, x, y, w, h, PAL.copper1);
    rect(ctx, x, y, w, 1, PAL.copper3);
    const a = st.time * 4;
    rect(ctx, x + w / 2 + Math.cos(a) * w * 0.25 - 1, y + h / 2 + Math.sin(a) * h * 0.25 - 1, 3, 3, PAL.brassHi);
  }

  _drawAlembic(c, st) {
    const { ctx, view } = this;
    const s = view.scale;
    const x = Math.round(view.ox + (c.mouth - 0.1) * s), y = Math.round(view.oy - 0.4 * s);
    ctx.strokeStyle = PAL.copper2;
    ctx.lineWidth = Math.max(1, Math.round(0.05 * s));
    ctx.beginPath();
    ctx.moveTo(x, y + 0.3 * s);
    ctx.quadraticCurveTo(x + 0.4 * s, y - 0.5 * s, x + 1.0 * s, y + 0.2 * s);
    ctx.stroke();
    // receiver flask
    const fx = Math.round(x + 1.0 * s), fy = Math.round(y + 0.2 * s);
    const r = st.receiver;
    const fw = Math.round(0.4 * s), fh = Math.round(0.5 * s);
    drawBottle(ctx, fx - fw / 2, fy, fw, fh, r && r.color ? r.color : [0.6, 0.7, 0.8], r ? Math.min(1, r.count / 80) : 0);
  }

  _lighting(c, st) {
    const { ctx, view } = this;
    const s = view.scale;
    const setting = st.sim.furnace.setting;
    ctx.globalCompositeOperation = 'lighter';
    if (setting > 0.02) {
      const flick = 0.85 + Math.sin(st.time * 11) * 0.08 + Math.sin(st.time * 17.3) * 0.05;
      const g = ctx.createRadialGradient(view.ox, view.oy + (c.depth + 0.6) * s, 0, view.ox, view.oy + (c.depth + 0.6) * s, s * 2.6);
      g.addColorStop(0, `rgba(255,120,40,${0.32 * setting * flick})`);
      g.addColorStop(1, 'rgba(255,120,40,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, this.W, this.H);
    } else if (setting < -0.02) {
      const g = ctx.createRadialGradient(view.ox, view.oy + (c.depth + 0.6) * s, 0, view.ox, view.oy + (c.depth + 0.6) * s, s * 2.2);
      g.addColorStop(0, `rgba(90,170,255,${0.22 * -setting})`);
      g.addColorStop(1, 'rgba(90,170,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, this.W, this.H);
    }
    // glowing brews light the mouth of the cauldron
    const p = st.sim.p;
    let glow = 0, gr = 0, gg = 0, gb = 0;
    const step = Math.max(1, Math.floor(p.count / 300));
    for (let i = 0; i < p.count; i += step) {
      const e = p.glow[i] + p.burn[i] * 1.5;
      if (e > 0.05) { glow += e; gr += st.sim.colR[i] * e; gg += st.sim.colG[i] * e; gb += st.sim.colB[i] * e; }
    }
    if (glow > 0.5) {
      const a = Math.min(0.35, glow * step * 0.002);
      const col = `${Math.round(gr / glow * 255)},${Math.round(gg / glow * 255)},${Math.round(gb / glow * 255)}`;
      const g = ctx.createRadialGradient(view.ox, view.oy + c.depth * 0.6 * s, 0, view.ox, view.oy + c.depth * 0.6 * s, s * 3);
      g.addColorStop(0, `rgba(${col},${a})`);
      g.addColorStop(1, `rgba(${col},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, this.W, this.H);
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  /** Visual reactions to simulation events. */
  onEvent(e) {
    const [x, y] = this.toScreen(e.x ?? 0, e.y ?? 0);
    const s = this.view.scale;
    switch (e.type) {
      case 'reaction': this.fx.burst(4, x, y, 14, s * 0.6, [255, 230, 140], 1); break;
      case 'crush': this.fx.burst(3, x, y, 4, s * 0.3, [210, 210, 220], 0.6); break;
      case 'ignite': this.fx.burst(1, x, y, 10, s * 0.8, hex2rgb(PAL.fire3), 1); break;
      case 'phase':
        if (e.to === 'solid') this.fx.burst(5, x, y, 3, s * 0.2, hex2rgb(PAL.frost3), 0.3);
        else if (e.to === 'gas' && this.fx.rand() < 0.5) this.fx.add(6, x, y, (this.fx.rand() - 0.5) * s * 0.4, -s * 0.6, 0.35, 1, [235, 240, 250]);
        break;
      case 'paste': if (this.fx.rand() < 0.2) this.fx.burst(4, x, y, 2, s * 0.2, [255, 240, 210], 0.3); break;
      case 'dissolve': this.fx.burst(4, x, y, 2, s * 0.15, [220, 240, 255], 0.3); break;
      case 'spark': this.fx.burst(1, x, y, 5, s * 0.5, [190, 220, 255], 0.8); break;
    }
  }
}

/** @param {CanvasRenderingContext2D} ctx */
export function drawBottle(ctx, x, y, w, h, color, fill) {
  x = Math.round(x); y = Math.round(y);
  const neck = Math.max(2, Math.round(w * 0.35));
  const nh = Math.round(h * 0.3);
  rect(ctx, x + (w - neck) / 2, y, neck, nh, 'rgba(170,220,240,0.35)');
  rect(ctx, x + (w - neck) / 2, y - 2, neck, 2, PAL.wood4);
  rect(ctx, x, y + nh, w, h - nh, 'rgba(170,220,240,0.28)');
  const fh = Math.round((h - nh - 1) * Math.max(0, Math.min(1, fill)));
  if (fh > 0) {
    rect(ctx, x + 1, y + h - 1 - fh, w - 2, fh, rgbStr(color));
    rect(ctx, x + 1, y + h - 1 - fh, w - 2, 1, rgbStr(color, 1.3));
  }
  rect(ctx, x, y + nh, 1, h - nh, 'rgba(255,255,255,0.55)');
  rect(ctx, x + w - 1, y + nh, 1, h - nh, 'rgba(0,0,0,0.35)');
  rect(ctx, x, y + h - 1, w, 1, 'rgba(0,0,0,0.4)');
}

export { PHASE };
