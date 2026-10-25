// The wilds: travel between regions, tap a mature plant in the scene (or use
// the list) to gather raw ingredients into the shop's stores. Each
// ingredient grows as a stand of plants that sprout at random spots, ripen
// and mature with real time; only a mature one can be harvested, it leaves a
// mark on the ground that fades, and new sprouts come up until the region is
// saturated again. Nothing here runs while you brew. What a harvest brings
// depends on the method and tool, the hour (dawn / midday / dusk follow the
// shop's customers), the weather and how thoroughly you dig (game/gathering.js).
// The plants are drawn from the growth atlas (rendering/wild-sprites.js) at
// their stage on the open ground of the region's painted backdrop; only
// plants take taps — the scenery is part of the cached background.

import { h, btn, clear, toast } from '../dom.js';
import { icon } from '../icons.js';
import { audio } from '../../audio/audio.js';
import { REGIONS, depositStatus, formatWait, gatherPlan, harvestable, dayPart, weatherOn, marksIn, DAY_PART_NAME } from '../../game/gathering.js';
import { equipmentById } from '../../game/equipment.js';
import { RANKS } from '../../game/equipment.js';
import { drawRaw } from '../../rendering/scenes.js';
import { paintRegion, animateRegion, PlantGround, BACKDROPS, SCENE_W, SCENE_H } from '../../rendering/regions.js';
import { GATHERABLES, GROWTH, CRYSTALS, REGION_ATLAS, growthFrame, glintSpots, plantBox, hitPlant, ingredientSprite } from '../../rendering/wild-sprites.js';
import { EFFECT_BY_KEY } from '../../alchemy/effects.js';

/**
 * A four-pointed sparkle on a crystal's edge: thin arms (half an art pixel,
 * the long ones up and down) that grow out of a white point and draw back
 * in over its life `u` (0..1).
 * @param {CanvasRenderingContext2D} ctx @param {number} x @param {number} y @param {number} u
 */
function sparkle(ctx, x, y, u) {
  const q = 0.5, L = [1, 2, 4, 6, 4, 2, 1][Math.min(6, Math.floor(u * 7))] * q;
  const cx = Math.round(x / q) * q, cy = Math.round(y / q) * q;
  ctx.fillStyle = 'rgba(255,250,225,0.75)';
  ctx.fillRect(cx, cy - L * 1.5, q, L * 1.5);
  ctx.fillRect(cx, cy + q, q, L * 1.5);
  ctx.fillRect(cx - L, cy, L, q);
  ctx.fillRect(cx + q, cy, L, q);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(cx, cy, q, q);
}

export class WildsView {
  /** @param {import('../lab.js').LabScreen} lab */
  constructor(lab) {
    this.lab = lab;
    this.el = h('section', { class: 'view view-wilds', 'data-view': 'wilds' });
    this.region = 'forest';
    this.time = 0;
    this.floaters = [];
    this.bg = null;
    this.bgKey = '';
    /** where the plants stand in the painted scene */
    this.ground = null;
    /** the plants of the region now, each at its spot and stage (refreshed about once a second) @type {any[]} */
    this.field = [];
    /** dig plants out for twice the yield (the stand then sprouts at half pace) */
    this.thorough = false;
    this.rain = [];
    /** the plant under the pointer (or the deposit whose card is hovered) */
    this.hover = null;
    /** plant id → scene time it was first seen at its stage (it springs up as it grows) */
    this.grewAt = {};
    /** deposit id → whether it can be harvested now (refreshed with the list) */
    this.can = {};
    /** deposit id → whether it is a dawn or dusk plant out of its hour */
    this.closed = {};
    /** the sprite atlases this view waits on */
    this.waiting = new Set();
  }

  build() {
    const el = clear(this.el);
    this.tabs = h('div', { class: 'region-tabs', role: 'tablist' });
    this.sky = h('div', { class: 'wilds-sky small' });
    // the scene is drawn in art pixels on a canvas of twice the resolution, so
    // the plants (kept at that resolution) and the sparkles are finer than the backdrop
    this.canvas = /** @type {HTMLCanvasElement} */ (h('canvas', { width: String(SCENE_W * GROWTH.res), height: String(SCENE_H * GROWTH.res), class: 'scene', 'aria-label': 'Region scene: tap a deposit to gather' }));
    this.ctx = /** @type {CanvasRenderingContext2D} */ (this.canvas.getContext('2d'));
    this.ctx.setTransform(GROWTH.res, 0, 0, GROWTH.res, 0, 0);
    this.ctx.imageSmoothingEnabled = false;
    this.canvas.addEventListener('pointerdown', (e) => this.tapScene(e));
    this.canvas.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') this.setHover(this.depositAt(e)); });
    this.canvas.addEventListener('pointerleave', () => this.setHover(null));
    this.info = h('div', { class: 'region-info small' });
    this.list = h('div', { class: 'deposits' });
    this.foot = h('div', { class: 'small muted wilds-foot' });
    // the scene and its caption form one column, so a landscape phone can
    // keep the scene in view beside the deposit list
    el.append(this.tabs, h('div', { class: 'wilds-scene' }, h('div', { class: 'scene-wrap' }, this.canvas), this.info), h('div', { class: 'wilds-list' }, this.sky, this.list, this.foot));
    this.refresh();
  }

  /** A region's backdrop, its sprites and the growth atlas arrive in the background; repaint once they have. */
  loadSprites() {
    for (const atlas of [BACKDROPS[this.region], REGION_ATLAS[this.region], GROWTH]) {
      if (!atlas || atlas.ready || this.waiting.has(atlas)) continue;
      this.waiting.add(atlas);
      atlas.load().then((ok) => { if (ok) { this.bgKey = ''; this.refresh(); } });
    }
  }

  unlocked(r) {
    return this.lab.sandbox || r.rank <= this.lab.state.rank;
  }

  refresh() {
    const lab = this.lab, st = lab.state;
    if (!this.tabs) return;
    this.loadSprites();
    const tabs = clear(this.tabs);
    for (const r of REGIONS) {
      const ok = this.unlocked(r);
      tabs.appendChild(btn(r.name, () => {
        if (!ok) { toast(r.name, `The guild grants passage at the rank of ${RANKS[r.rank].name}.`, 'lock'); return; }
        this.region = r.id; this.bgKey = ''; audio.play('page'); this.refresh();
      }, { cls: (this.region === r.id ? 'active ' : '') + (ok ? '' : 'locked'), icon: ok ? (r.magical ? 'wisp' : r.id === 'quarry' ? 'pick' : r.id === 'river' ? 'drop' : r.id === 'meadow' ? 'rose' : 'tree') : 'lock', act: 'region-' + r.id }));
    }
    const region = REGIONS.find((r) => r.id === this.region);
    clear(this.info).append(h('b', { text: region.name }), ' — ' + region.desc);
    const list = clear(this.list);
    const now = Date.now();
    // the hour, the weather and how hard to harvest
    const weather = weatherOn(st.seed, st.day), part = dayPart(st);
    const mode = (t, on, act) => btn(t, () => { this.thorough = on; audio.play('click'); this.refresh(); }, { cls: 'small' + (this.thorough === on ? ' active' : ''), act });
    clear(this.sky).append(...[
      h('div', { class: 'row wrap sky-row' },
        icon(part === 'dawn' ? 'sun' : part === 'dusk' ? 'wisp' : 'sun', 'sm'), h('b', { text: lab.sandbox ? 'Any hour' : DAY_PART_NAME[part] }),
        lab.sandbox ? null : h('span', { class: 'muted', text: part === 'dawn' ? '(until you open the shop)' : part === 'dusk' ? '(after the last customer, until you close)' : '(the shop is open)' }),
        h('span', { class: 'spacer' }), icon(weather.icon, 'sm'), h('b', { text: lab.sandbox ? '' : weather.name })),
      lab.sandbox || weather.id === 'clear' ? null : h('div', { class: 'muted', text: weather.desc }),
      h('div', { class: 'row wrap seg harvest-mode' }, h('span', { text: 'Harvest:' }), mode('Careful', false, 'harvest-careful'), mode('Thorough ×2', true, 'harvest-thorough'),
        this.thorough ? h('span', { class: 'muted', text: 'digs the plant out whole: its kind sprouts at half pace' }) : null)].filter(Boolean));
    this.rows = {};
    for (const d of this.deposits()) {
      const m = st.lookup(d.materialId);
      const s = depositStatus(st.gathering, d, now);
      const locked = !lab.sandbox && d.rank > st.rank;
      const plan = gatherPlan(st, d, m, { thorough: this.thorough });
      const can = lab.sandbox ? d.take : harvestable(st.gathering, d, plan, now);
      const take = lab.sandbox ? d.take : can || plan.take;
      const fx = Object.entries(m.effects || {}).filter(([, v]) => Math.abs(v) >= 5).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1])).slice(0, 3);
      const stock = lab.sandbox ? '∞' : this.stockText(d, s);
      const when = lab.sandbox ? 'never runs out' : this.when(s, can);
      this.can[d.id] = locked || can >= 5;
      this.closed[d.id] = !lab.sandbox && !plan.open;
      const g = btn(locked ? RANKS[d.rank].name : `${plan.method.verb} +${take} ml`, () => this.gather(d), { cls: 'gold', icon: locked ? 'lock' : plan.method.icon, disabled: locked || (!lab.sandbox && can < 5), act: 'gather-' + d.id });
      const barI = h('i', { style: { width: Math.round((lab.sandbox ? 1 : s.fraction) * 100) + '%' } });
      const meta = h('div', { class: 'meta', text: `${stock} · ${when}` });
      this.rows[d.id] = { barI, meta, g, locked, take, card: /** @type {HTMLElement | null} */ (null) };
      const notes = lab.sandbox ? [] : plan.factors.filter((f) => f.why !== 'satchel' && !f.why.startsWith('thorough')).map((f) => f.why);
      const tool = plan.method.tool ? equipmentById(plan.method.tool) : null;
      const card = h('div', { class: 'deposit parch' + (locked ? ' locked' : '') + (s.scarred ? ' scarred' : '') + (this.can[d.id] ? '' : ' spent'), 'data-deposit': d.id },
        // the same picture of the ingredient as on the shelf, in the shop and in the book
        ingredientSprite(m, lab.sandbox ? 1 : s.fraction),
        h('div', { class: 'dep-info' },
          h('div', { class: 'title' }, m.name, d.rare ? h('span', { class: 'tag rare', text: 'rare' }) : null, plan.hour ? h('span', { class: 'tag hour', text: plan.hour }) : null),
          d.place ? h('div', { class: 'meta place', text: d.place }) : null,
          h('div', { class: 'bar' }, barI),
          meta,
          notes.length ? h('div', { class: 'meta note', text: notes.join(' · ') }) : null,
          !lab.sandbox && tool && !plan.hasTool ? h('div', { class: 'meta muted', text: `${tool.name}: ${tool.price} coins at the shop` }) : null,
          h('div', { class: 'meta fx' }, ...fx.map(([k, v]) => h('span', { class: 'fx-chip', title: EFFECT_BY_KEY[k].label }, icon(EFFECT_BY_KEY[k].icon, 'sm'), ` ${Math.round(v)}`)),
            h('span', { class: 'muted', text: ` · in stores: ${Math.round(st.stock(m.id))} ml` }))),
        g);
      this.rows[d.id].card = card;
      // pointing at a card picks out its deposit in the scene
      card.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') this.setHover(d.id); });
      card.addEventListener('pointerleave', () => { if (this.hover === d.id) this.setHover(null); });
      list.appendChild(card);
    }
    clear(this.foot).append(`Room for ${st.cap.storage} ml of each ingredient. ${st.has('satchel') ? 'Your satchel carries half as much again. ' : ''}Only mature plants can be harvested. New sprouts come up at random spots until the ground is full again, even while the game is closed, and each new day brings every plant on.`);
    this.paintBg();
    this.grow();
  }

  /** What a stand holds, in words. @param {any} d @param {any} s status */
  stockText(d, s) {
    return `${s.mature} of ${d.slots} mature${s.plants.length > s.mature ? ` · ${s.plants.length - s.mature} growing` : ''} · ${d.take} ml each`;
  }

  deposits() {
    return this.lab.state.deposits.filter((d) => d.region === this.region);
  }

  paintBg() {
    const backdrop = BACKDROPS[this.region];
    const key = this.region + ':' + this.lab.state.seed + ':' + !!(backdrop && backdrop.ready) + ':' + GROWTH.ready;
    if (key === this.bgKey) return;
    this.bgKey = key;
    this.bg = document.createElement('canvas');
    this.bg.width = SCENE_W; this.bg.height = SCENE_H;
    paintRegion(/** @type {CanvasRenderingContext2D} */ (this.bg.getContext('2d')), this.region, this.lab.state.seed);
    this.ground = new PlantGround(this.region);
    this.field = [];
  }

  /** The deposits whose plants grow in the scene: one beyond the guild rank is left out (its card says so). */
  shown() {
    const lab = this.lab;
    return this.deposits().filter((d) => lab.sandbox || d.rank <= lab.state.rank);
  }

  /** The silhouette a plant grows into (every frame of it), once the growth atlas can be read. @param {{key:string|null}} p */
  shapeOf(p) {
    if (!p.key || !GROWTH.ready) return null;
    const f = GROWTH.frame(p.key + '_mature_hover');
    if (!f) return null;
    const m = new Uint8Array(f[2] * f[3]);
    for (const stage of ['sprout', 'ripe', 'mature', 'mature_hover']) {
      const mm = GROWTH.mask(`${p.key}_${stage}`);
      if (mm && mm.length === m.length) for (let k = 0; k < m.length; k++) m[k] |= mm[k];
    }
    return { w: f[2], h: f[3], m };
  }

  /** The plants of the region now: each at its spot in the scene and its stage. */
  grow() {
    if (!this.ground) return;
    const st = this.lab.state, now = Date.now();
    /** @type {any[]} */
    const plants = [];
    for (const d of this.shown()) {
      const m = st.lookup(d.materialId);
      const key = m && m.wild && GATHERABLES[m.wild.key] ? m.wild.key : null;
      const s = depositStatus(st.gathering, d, now);
      // in the sandbox every plant stands mature
      for (const p of s.plants) plants.push({ ...p, dep: d, m, key, stage: this.lab.sandbox ? 'mature' : p.stage, grown: this.lab.sandbox ? 1 : p.grown });
    }
    plants.sort((a, b) => a.born - b.born || (a.id < b.id ? -1 : 1));
    const spots = this.ground.place(plants, (p) => this.shapeOf(p));
    /** @type {Record<string, number>} */
    const grewAt = {};
    for (const p of plants) {
      Object.assign(p, spots[p.id]);
      // what was already growing when the scene was painted stands still; what sprouts or grows since springs up
      const tag = p.id + ':' + p.stage;
      grewAt[tag] = this.grewAt[tag] ?? (this.field.length ? this.time : -9);
    }
    this.grewAt = grewAt;
    this.field = plants;
  }

  /** @param {string | null} id a plant's id, or a deposit's (its card) */
  setHover(id) {
    if (this.hover === id) return;
    this.hover = id;
    const p = id && this.field.find((q) => q.id === id);
    if (this.canvas) this.canvas.style.cursor = p ? (p.stage === 'mature' ? 'pointer' : 'help') : 'default';
  }

  /** The growth frame a plant shows now, if the art is in. @param {any} p */
  frameOf(p) {
    return p.key && GROWTH.ready ? growthFrame(p.key, p.stage, this.hover === p.id || this.hover === p.dep.id) : null;
  }

  /** The plant under a pointer event, if any. @param {PointerEvent} e */
  plantAt(e) {
    const r = this.canvas.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * SCENE_W, y = ((e.clientY - r.top) / r.height) * SCENE_H;
    // a mature plant before a growing one in front of it
    const ripe = this.field.filter((p) => p.stage === 'mature');
    return hitPlant(ripe, (p) => this.frameOf(p), x, y, SCENE_W, SCENE_H) || hitPlant(this.field, (p) => this.frameOf(p), x, y, SCENE_W, SCENE_H);
  }

  /** @param {PointerEvent} e */
  depositAt(e) {
    const p = this.plantAt(e);
    return p ? p.id : null;
  }

  /** Harvest a deposit: the plant given (tapped in the scene), else its oldest mature one. @param {any} d @param {any} [plant] */
  gather(d, plant = null) {
    const lab = this.lab, st = lab.state;
    const m = st.lookup(d.materialId);
    const plan = gatherPlan(st, d, m, { thorough: this.thorough });
    const r = lab.sandbox ? { ok: true, amount: d.take, events: [], plant: plant ? plant.id : null } : st.gather(d.id, { thorough: this.thorough, ...(plant ? { plant: plant.id } : {}) });
    if (!r.ok) {
      audio.play('error');
      const why = r.reason === 'full' ? `Your shelves are full of ${m.name}.` : r.reason === 'locked' ? 'You may not gather here yet.'
        : r.reason === 'growing' ? `Still growing — only a mature plant can be harvested. This one matures in ${formatWait(r.nextIn || 60000)}.`
        : `Nothing is mature yet. The next plant matures in ${formatWait(r.nextIn || 60000)}.`;
      toast(r.reason === 'growing' ? 'Not ripe yet' : 'Nothing to gather', why, 'satchel');
      return;
    }
    audio.play(plan.method.sound);
    setTimeout(() => audio.play('select'), 140);
    const at = this.field.find((p) => p.id === r.plant) || { x: d.x, y: d.y, key: null, stage: 'mature' };
    // the mark it leaves lies where the plant was drawn (the scene moved it onto open ground)
    const mark = st.gathering.marks[st.gathering.marks.length - 1];
    if (!lab.sandbox && mark && r.plant && at.key) { mark.x = at.x; mark.y = at.y; }
    const f = at.key && GROWTH.ready ? GROWTH.frame(at.key + '_mature') : null;
    this.floaters.push({ x: at.x * SCENE_W, y: at.y * SCENE_H - Math.max(0, (f ? f[3] : 16) - 16), t: 0, text: `+${r.amount}`, color: m.look || m.color, shape: m.wild ? m.wild.shape : 'stone' });
    for (const e of r.events || []) lab.announce(e);
    if (lab.tutorial) lab.tutorial.notify('gather', d.materialId);
    // a first find gets its own place on the shelf
    if (!lab.jarEls[d.materialId]) lab.buildShelf(); else lab.updateShelf();
    lab.save();
    this.refresh();
  }

  /** @param {PointerEvent} e */
  tapScene(e) {
    const p = this.plantAt(e);
    if (p) this.gather(p.dep, p);
  }

  /** @param {number} dt */
  frame(dt) {
    if (!this.ctx || !this.bg) return;
    this.time += dt;
    const ctx = this.ctx, st = this.lab.state, now = Date.now();
    ctx.drawImage(this.bg, 0, 0);
    animateRegion(ctx, this.region, this.time);
    // the marks of past harvests, fading into the ground, then the plants, the far ones first
    for (const k of marksIn(st.gathering, this.region, now)) this.drawMark(ctx, k);
    for (const p of this.field.slice().sort((a, b) => a.y - b.y)) {
      const name = this.frameOf(p);
      if (name) { this.drawPlant(ctx, p, name); continue; }
      const x = Math.round(p.x * SCENE_W) - 8, y = Math.round(p.y * SCENE_H) - 14;
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(x + 3, y + 14, 10, 2);
      drawRaw(ctx, x, y, p.m.wild ? p.m.wild.shape : 'stone', p.m.look || p.m.color, 0.25 + p.grown * 0.75);
      if (p.stage === 'mature' && Math.sin(this.time * 3 + p.x * 20) > 0.92) { ctx.fillStyle = '#fff6e0'; ctx.fillRect(x + 12, y + 1, 1, 1); }
    }
    this.paintSky(ctx, dt);
    for (const f of this.floaters) {
      f.t += dt;
      const a = Math.max(0, 1 - f.t / 1.2);
      ctx.globalAlpha = a;
      for (let k = 0; k < 4; k++) {
        const px = f.x + Math.cos(k * 1.7 + f.t * 3) * f.t * 14, py = f.y - f.t * 18 - k * 2;
        ctx.fillStyle = `rgb(${Math.round(f.color[0] * 255)},${Math.round(f.color[1] * 255)},${Math.round(f.color[2] * 255)})`;
        ctx.fillRect(Math.round(px), Math.round(py), 2, 2);
      }
      ctx.fillStyle = '#ffe39a';
      ctx.font = '8px "Alchemist Pixel", monospace';
      ctx.fillText(f.text, Math.round(f.x - 6), Math.round(f.y - 16 - f.t * 12));
      ctx.globalAlpha = 1;
    }
    this.floaters = this.floaters.filter((f) => f.t < 1.2);
    // live stock and timers, updated in place about once a second
    this._acc = (this._acc || 0) + dt;
    if (this._acc > 1) { this._acc = 0; this.tick(); }
  }

  /**
   * A plant at its stage: a ground shadow, then its growth frame, springing
   * up a pixel as it reaches a new stage; a mature crystal glints now and
   * then at the tips of its facets (the scene's decorative motes stay
   * fainter than this).
   * @param {CanvasRenderingContext2D} ctx @param {any} p @param {string} name
   */
  drawPlant(ctx, p, name) {
    const x = Math.round(p.x * SCENE_W), y = Math.round(p.y * SCENE_H);
    const f = /** @type {number[]} */ (GROWTH.frame(name));
    const body = GROWTH.frame(p.key + '_' + p.stage);
    const since = this.time - (this.grewAt[p.id + ':' + p.stage] ?? -9);
    const sw = Math.max(4, Math.round((body ? body[2] : f[2]) * (p.stage === 'sprout' ? 0.3 : p.stage === 'ripe' ? 0.45 : 0.55)));
    // a soft shadow it stands in: darkest under its foot, fading out to the sides
    ctx.fillStyle = 'rgba(10,30,8,0.2)';
    ctx.fillRect(x - Math.floor(sw / 2), y - 1, sw, 2);
    ctx.fillRect(x - Math.floor(sw / 2) + 2, y, Math.max(2, sw - 4), 1);
    ctx.fillRect(x - Math.floor(sw / 4), y - 1, Math.max(2, Math.floor(sw / 2)), 2);
    GROWTH.draw(ctx, name, x, y - (since < 0.3 ? 1 : 0));
    if (p.stage === 'mature' && CRYSTALS.has(p.key) && this.hover !== p.id && !this.closed[p.dep.id]) {
      const spots = glintSpots(GROWTH, name);
      const cycle = this.time * 0.6 + p.x * 7.3 + p.y * 3.1, phase = cycle % 2;
      if (spots.length && phase < 0.5) {
        const [dx, dy] = spots[Math.floor(cycle / 2) % spots.length];
        sparkle(ctx, x + dx, y + dy, phase / 0.5);
      }
    }
  }

  /**
   * The mark a harvest leaves: a patch of turned earth (rubble on stone
   * ground) as wide as the plant was, with a cut stem — or, dug out whole, a
   * dark hole ringed with clods — fading back into the ground in steps.
   * @param {CanvasRenderingContext2D} ctx @param {any} k a mark (gathering.js marksIn)
   */
  drawMark(ctx, k) {
    const f = k.key && GROWTH.ready ? GROWTH.frame(k.key + '_mature') : null;
    const x = Math.round(k.x * SCENE_W), y = Math.round(k.y * SCENE_H);
    const w = Math.max(8, Math.round((f ? f[2] : 16) * 0.75)), hw = Math.floor(w / 2);
    const stone = this.region === 'quarry' || this.region === 'crags';
    const [soil, dark, clod] = stone ? ['#6e6258', '#3a322c', '#a09280'] : this.region === 'moonfen' ? ['#3a3228', '#16120e', '#5a5040'] : ['#7a5230', '#3a2412', '#a07a4a'];
    ctx.globalAlpha = Math.ceil((1 - k.faded) * 4) / 4;
    // the turned earth: a low mound, darker along its foot
    ctx.fillStyle = soil;
    ctx.fillRect(x - hw, y - 3, w, 4);
    ctx.fillRect(x - hw + 2, y - 4, w - 4, 1);
    ctx.fillStyle = dark;
    ctx.fillRect(x - hw + 1, y + 1, w - 2, 1);
    if (k.deep) {
      // dug out whole: a dark hole in the middle
      ctx.fillRect(x - Math.floor(hw / 2), y - 2, Math.max(3, hw), 2);
    }
    ctx.fillStyle = clod;
    for (let i = 0; i < 4; i++) ctx.fillRect(x - hw + 1 + ((i * 7 + Math.round(k.x * 97)) % Math.max(1, w - 2)), y - 4 + (i % 3) * 2, 1, 1);
    if (!k.deep && !stone) {
      // what is left of the stems
      ctx.fillStyle = '#4a6a22';
      ctx.fillRect(x - 2, y - 6, 1, 3);
      ctx.fillRect(x + 1, y - 5, 1, 2);
    }
    ctx.globalAlpha = 1;
  }

  /** Light of the hour and the day's weather over the scene. @param {CanvasRenderingContext2D} ctx @param {number} dt */
  paintSky(ctx, dt) {
    const st = this.lab.state;
    if (this.lab.sandbox) return;
    const part = dayPart(st), weather = weatherOn(st.seed, st.day);
    if (part !== 'day') {
      ctx.fillStyle = part === 'dawn' ? 'rgba(255,170,190,0.16)' : 'rgba(90,50,120,0.28)';
      ctx.fillRect(0, 0, SCENE_W, SCENE_H);
      if (part === 'dusk') { ctx.fillStyle = 'rgba(255,140,60,0.12)'; ctx.fillRect(0, Math.round(SCENE_H * 0.35), SCENE_W, Math.round(SCENE_H * 0.2)); }
    }
    if (weather.id === 'fog') {
      for (let k = 0; k < 4; k++) {
        ctx.fillStyle = `rgba(225,225,235,${0.12 + 0.04 * k})`;
        const y = Math.round(SCENE_H * (0.45 + 0.12 * k) + Math.sin(this.time * 0.4 + k) * 2);
        ctx.fillRect(0, y, SCENE_W, 5 + k);
      }
    } else if (weather.id === 'rain' || weather.id === 'storm' || weather.id === 'frost') {
      const snow = weather.id === 'frost';
      while (this.rain.length < (snow ? 40 : 70)) this.rain.push({ x: Math.random() * SCENE_W, y: Math.random() * SCENE_H, v: 0.6 + Math.random() * 0.4 });
      ctx.fillStyle = snow ? 'rgba(245,250,255,0.85)' : 'rgba(170,200,235,0.55)';
      for (const r of this.rain) {
        r.y += dt * (snow ? 14 : weather.id === 'storm' ? 150 : 110) * r.v;
        r.x += dt * (snow ? Math.sin(this.time + r.v * 9) * 6 : weather.id === 'storm' ? -40 : -8);
        if (r.y > SCENE_H) { r.y -= SCENE_H; r.x = Math.random() * SCENE_W; }
        if (r.x < 0) r.x += SCENE_W;
        ctx.fillRect(Math.round(r.x), Math.round(r.y), 1, snow ? 1 : 3);
      }
      if (weather.id === 'storm' && Math.sin(this.time * 0.9) > 0.995) { ctx.fillStyle = 'rgba(255,255,240,0.35)'; ctx.fillRect(0, 0, SCENE_W, SCENE_H); }
    } else if (weather.id === 'heat') {
      ctx.fillStyle = 'rgba(255,200,90,0.1)';
      ctx.fillRect(0, 0, SCENE_W, SCENE_H);
    }
  }

  /** How a deposit is doing, in words. @param {any} s status @param {number} can */
  when(s, can) {
    if (s.fullIn <= 0) return 'fully grown';
    const growing = `growing back${s.scarred ? ' slowly' : ''} · full in ${formatWait(s.fullIn)}`;
    if (can >= 5) return growing;
    return `next ripe in ${formatWait(s.nextIn)} · ${growing}`;
  }

  tick() {
    const lab = this.lab, st = lab.state;
    if (lab.sandbox || !this.rows) return;
    const now = Date.now();
    for (const d of this.deposits()) {
      const row = this.rows[d.id];
      if (!row) continue;
      const s = depositStatus(st.gathering, d, now);
      const plan = gatherPlan(st, d, st.lookup(d.materialId), { thorough: this.thorough });
      const can = harvestable(st.gathering, d, plan, now);
      row.barI.style.width = Math.round(s.fraction * 100) + '%';
      row.meta.textContent = `${this.stockText(d, s)} · ${this.when(s, can)}`;
      row.g.disabled = row.locked || can < 5;
      this.can[d.id] = row.locked || can >= 5;
      if (row.card) row.card.classList.toggle('spent', !this.can[d.id]);
      this.closed[d.id] = !plan.open;
    }
    this.grow();
  }
}
