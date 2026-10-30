// The wilds: travel between regions, tap a mature plant in the scene (or use
// the list) to gather raw ingredients into the shop's stores. Each
// ingredient grows as a stand of plants that sprout at random spots, ripen
// and mature with real time; only a mature one can be harvested, it leaves a
// mark on the ground that fades, and new sprouts come up until the region is
// saturated again. Nothing here runs while you brew. What a harvest brings
// depends on the method and tool, the hour (dawn / midday / dusk follow the
// shop's customers), the weather and how thoroughly you dig (game/gathering.js).
// The region is a procedural environment generated from the world seed
// (visual/env) and each plant is its species' procedural sprite at its
// stage (rendering/species-sprites.js), standing on the scene's open ground;
// only plants take taps — the scenery is part of the cached background.
// A finger sliding over the scene pushes what it passes: vines hanging from
// a bough or the cave's roof swing on for seconds and a plant not ready to
// be gathered bends and rings (the trees and bushes behind move with the
// wind alone). A ripe plant shaken hard
// enough lets go of its ingredient, which falls as a ragdoll cut from the
// very pixels it grew as (rendering/ragdoll.js) — tumbling, bouncing, coming
// to rest on the ground or the water, knocked about again by the finger —
// and is gathered with a tap.
// Living plants drink: in watering mode a tap waters the plants round it, a
// finger dragged across the scene waters everything along its path (and a
// card's Water button its whole stand); damp soil shows dark round a plant,
// and a thirsty one carries a little drop until it is watered.
// In the Free Experiment the stores are bottomless, but a harvest still takes
// the plant: its stand sprouts again at random spots and grows back quickly
// (game/gathering.js sandboxWilds).

import { h, btn, clear, toast } from '../dom.js';
import { icon } from '../icons.js';
import { audio } from '../../audio/audio.js';
import { REGIONS, depositStatus, formatWait, gatherPlan, harvestable, dayPart, weatherOn, marksIn, moistureEnv, DAY_PART_NAME } from '../../game/gathering.js';
import { equipmentById } from '../../game/equipment.js';
import { RANKS } from '../../game/equipment.js';
import { sceneCanvas, sceneFrame, animateRegion, PlantGround, hitPlant, windAt, sceneTouch, crosses, SCENE_W, SCENE_H } from '../../rendering/wild-scene.js';
import { Ragdoll } from '../../rendering/ragdoll.js';
import { sceneOf } from '../../visual/env/scene.js';
import { plantCanvas, plantFrameOf, plantGlow, emitColour, silhouetteOf, ingredientSprite, speciesOf, mountsOf, variantOf, MIN_HIT } from '../../rendering/species-sprites.js';
import { EFFECT_BY_KEY } from '../../alchemy/effects.js';
import { hashString } from '../../core/rng.js';

/** The shadow a plant casts on its ground, by region (the crags' is warm and deep, the fens' cold). */
const SHADOW = { forest: 'rgba(8,16,10,0.32)', netherwood: 'rgba(6,4,16,0.4)', meadow: 'rgba(24,30,10,0.26)', river: 'rgba(4,14,16,0.34)', quarry: 'rgba(26,18,10,0.3)', moonfen: 'rgba(2,6,18,0.42)', crags: 'rgba(30,6,4,0.4)' };

/** How far (CSS pixels) a press may wander and still be a tap: a finger rolls further than a mouse. */
const TAP_SLOP = { mouse: 6, pen: 8, touch: 14 };

/** How far apart (scene pixels) a finger dragged in watering mode waters along its path. */
const WATER_STEP = 12;

/** How strongly what glows lights its surroundings in each region: little in the open meadow, fully in the dark fens and caves. */
const GLOW_IN = { forest: 0.85, netherwood: 1.3, meadow: 0.45, river: 0.9, quarry: 0.7, moonfen: 1.4, crags: 0.7 };

/**
 * A four-pointed sparkle on a crystal's edge or a magical glimmer: thin
 * arms (the long ones up and down) that grow out of a white point and draw
 * back in over its life `u` (0..1).
 * @param {CanvasRenderingContext2D} ctx @param {number} x @param {number} y @param {number} u
 */
function sparkle(ctx, x, y, u) {
  const q = 1, L = [0, 1, 2, 3, 2, 1, 0][Math.min(6, Math.floor(u * 7))] * q;
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
    /** what a tap in the scene does: harvest a mature plant, or water the plants round it */
    this.mode = 'harvest';
    /** drops of water and splashes in flight @type {{x:number, y:number, vx:number, vy:number, t:number, life:number, gy:number}[]} */
    this.drops = [];
    /** what a swipe has shaken loose: plant id → the fruit, bloom or piece as a ragdoll cut from the very sprite it grew as (`sp`), falling, then lying there to be tapped (`landed` once it has come to rest) @type {Record<string, {doll:Ragdoll, sp:{cv:HTMLCanvasElement, ax:number, ay:number, w:number, h:number}, landed:boolean, rung:number}>} */
    this.fallen = {};
    /** plant id → the push it was given (signed strength, scene time): it bends and rings for a few seconds @type {Record<string, {a:number, t0:number}>} */
    this.shakes = {};
    /** plant id → how much it has been shaken; a ripe one lets go at 1 @type {Record<string, number>} */
    this.energy = {};
    /** bits of leaf and pulp in flight @type {{x:number, y:number, vx:number, vy:number, t:number, c:string}[]} */
    this.bits = [];
    /** the pointer pressed on the scene: where it is, how far it has gone (CSS px), and in watering mode where it last watered and how many drank @type {{id:number, type:string, x:number, y:number, cx:number, cy:number, dist:number, water:boolean, wx:number, wy:number, drank:number, near:boolean, pours:number}|null} */
    this.drag = null;
  }

  build() {
    const el = clear(this.el);
    this.tabs = h('div', { class: 'region-tabs', role: 'tablist' });
    this.sky = h('div', { class: 'wilds-sky small' });
    // the scene, its plants and their effects share one pixel size
    this.canvas = /** @type {HTMLCanvasElement} */ (h('canvas', { width: String(SCENE_W), height: String(SCENE_H), class: 'scene', 'aria-label': 'Region scene: tap a plant to gather it, or to water it in watering mode' }));
    this.ctx = /** @type {CanvasRenderingContext2D} */ (this.canvas.getContext('2d'));
    this.ctx.imageSmoothingEnabled = false;
    // a finger sliding over the scene shakes what grows in it; a tap picks what has fallen
    this.canvas.style.touchAction = 'none';
    this.canvas.addEventListener('pointerdown', (e) => this.pressScene(e));
    this.canvas.addEventListener('pointermove', (e) => this.moveScene(e));
    this.canvas.addEventListener('pointerup', (e) => this.releaseScene(e));
    // a gesture taken away (the browser's, or capture lost) ends quietly, keeping what was watered
    const drop = (/** @type {PointerEvent} */ e) => { const d = this.drag; if (d && d.id === e.pointerId) { this.drag = null; if (d.water && d.drank) this.lab.save(); } };
    this.canvas.addEventListener('pointercancel', drop);
    this.canvas.addEventListener('lostpointercapture', drop);
    this.canvas.addEventListener('pointerleave', () => { this.setHover(null); });
    // a long press is not a menu or a text selection
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    this.info = h('div', { class: 'region-info small' });
    this.list = h('div', { class: 'deposits' });
    this.foot = h('div', { class: 'small muted wilds-foot' });
    // the scene and its caption form one column, so a landscape phone can
    // keep the scene in view beside the deposit list
    el.append(this.tabs, h('div', { class: 'wilds-scene' }, h('div', { class: 'scene-wrap' }, this.canvas), this.info), h('div', { class: 'wilds-list' }, this.sky, this.list, this.foot));
    // the last moment the player touched this room (pre-generation waits for a pause)
    this.lastInput = 0;
    this.warmTimer = 0;
    for (const ev of ['pointerdown', 'pointermove', 'wheel', 'keydown']) el.addEventListener(ev, () => { this.lastInput = performance.now(); }, { passive: true });
    this.refresh();
  }

  /**
   * Generate the other regions the player can travel to, and their plants'
   * sprites, while the Wilds room is open and the player has paused — one
   * region per idle moment, never during input or in another room — so
   * travelling to them later only draws what is already made.
   */
  prewarm() {
    if (this.warmTimer) return;
    const st = this.lab.state, seed = st.seed;
    const todo = REGIONS.filter((r) => this.unlocked(r) && r.id !== this.region).map((r) => r.id);
    const idle = typeof requestIdleCallback === 'function' ? (fn) => requestIdleCallback(fn) : (fn) => setTimeout(fn, 50);
    const tick = () => {
      this.warmTimer = 0;
      if (this.lab.state !== st || !todo.length) return;
      // only while this room is shown and nobody is touching it
      if (this.lab.view !== 'wilds' || performance.now() - this.lastInput < 1500) { this.warmTimer = setTimeout(tick, 1500); return; }
      idle(() => {
        if (this.lab.view !== 'wilds' || performance.now() - this.lastInput < 1500) { this.warmTimer = setTimeout(tick, 1500); return; }
        const region = /** @type {string} */ (todo.shift());
        sceneCanvas(region, seed);
        for (const d of st.deposits.filter((x) => x.region === region)) silhouetteOf(st.lookup(d.materialId));
        if (todo.length) this.warmTimer = setTimeout(tick, 400);
      });
    };
    this.warmTimer = setTimeout(tick, 1500);
  }

  unlocked(r) {
    return this.lab.sandbox || r.rank <= this.lab.state.rank;
  }

  refresh() {
    const lab = this.lab, st = lab.state;
    if (!this.tabs) return;
    const tabs = clear(this.tabs);
    for (const r of REGIONS) {
      const ok = this.unlocked(r);
      tabs.appendChild(btn(r.name, () => {
        if (!ok) { toast(r.name, `The guild grants passage at the rank of ${RANKS[r.rank].name}.`, 'lock'); return; }
        this.region = r.id; this.bgKey = ''; this.fallen = {}; this.shakes = {}; this.energy = {}; this.drag = null; audio.play('page'); this.refresh();
      }, { cls: (this.region === r.id ? 'active ' : '') + (ok ? '' : 'locked'), icon: ok ? (r.magical ? 'wisp' : r.id === 'quarry' ? 'pick' : r.id === 'river' ? 'drop' : r.id === 'meadow' ? 'rose' : r.id === 'netherwood' ? 'shroom' : 'tree') : 'lock', act: 'region-' + r.id }));
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
      h('div', { class: 'row wrap seg tap-mode' }, h('span', { text: 'Tap to:' }),
        btn('Harvest', () => { this.mode = 'harvest'; audio.play('click'); this.refresh(); }, { cls: 'small' + (this.mode === 'harvest' ? ' active' : ''), icon: 'rose', act: 'mode-harvest' }),
        btn('Water', () => { this.mode = 'water'; audio.play('click'); this.refresh(); }, { cls: 'small' + (this.mode === 'water' ? ' active' : ''), icon: 'drop', act: 'mode-water' }),
        this.mode === 'water' ? h('span', { class: 'muted', text: 'tap or drag across the scene to water the plants there' }) : null),
      // (the Free Experiment's bottomless stores have no use for digging plants out whole)
      this.mode === 'harvest' && !lab.sandbox ? h('div', { class: 'row wrap seg harvest-mode' }, h('span', { text: 'Harvest:' }), mode('Careful', false, 'harvest-careful'), mode('Thorough ×2', true, 'harvest-thorough'),
        this.thorough ? h('span', { class: 'muted', text: 'digs the plant out whole: its kind sprouts at half pace' }) : null) : null].filter(Boolean));
    this.rows = {};
    for (const d of this.deposits()) {
      const m = st.lookup(d.materialId);
      const s = depositStatus(st.gathering, d, now);
      const locked = !lab.sandbox && d.rank > st.rank;
      const plan = gatherPlan(st, d, m, { thorough: this.thorough });
      // (the Free Experiment's plants give their full yield whatever the hour or the weather)
      const can = harvestable(st.gathering, d, lab.sandbox ? d : plan, now);
      const take = lab.sandbox ? d.take : can || plan.take;
      const fx = Object.entries(m.effects || {}).filter(([, v]) => Math.abs(v) >= 5).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1])).slice(0, 3);
      const stock = this.stockText(d, s);
      const when = this.when(s, can, d);
      this.can[d.id] = locked || can >= 5;
      this.closed[d.id] = !lab.sandbox && !plan.open;
      // an ingredient is listed once it has been gathered for the first time (its plants still grow in the scene)
      if (!lab.sandbox && !st.found[d.materialId]) continue;
      const g = btn(locked ? RANKS[d.rank].name : `${plan.method.verb} +${take} ml`, () => this.gather(d), { cls: 'gold', icon: locked ? 'lock' : plan.method.icon, disabled: locked || can < 5, act: 'gather-' + d.id });
      const barI = h('i', { style: { width: Math.round(s.fraction * 100) + '%' } });
      const meta = h('div', { class: 'meta', text: `${stock} · ${when}` });
      const soil = d.botanical ? h('div', { class: 'meta soil', text: this.soilText(d, s) }) : null;
      const wbtn = d.botanical && !locked ? btn('Water', () => this.waterStand(d), { cls: 'small water', icon: 'drop', disabled: s.plants.every((p) => p.stage === 'mature'), act: 'water-' + d.id, title: 'Water every growing plant of this stand' }) : null;
      this.rows[d.id] = { barI, meta, g, locked, take, soil, wbtn, card: /** @type {HTMLElement | null} */ (null) };
      const notes = lab.sandbox ? [] : plan.factors.filter((f) => f.why !== 'satchel' && !f.why.startsWith('thorough')).map((f) => f.why);
      const tool = plan.method.tool ? equipmentById(plan.method.tool) : null;
      const card = h('div', { class: 'deposit parch' + (locked ? ' locked' : '') + (s.scarred ? ' scarred' : '') + (this.can[d.id] ? '' : ' spent'), 'data-deposit': d.id },
        // the same picture of the ingredient as on the shelf, in the shop and in the book
        ingredientSprite(m, s.fraction),
        h('div', { class: 'dep-info' },
          h('div', { class: 'title' }, m.name, d.rare ? h('span', { class: 'tag rare', text: 'rare' }) : null, plan.hour ? h('span', { class: 'tag hour', text: plan.hour }) : null),
          d.place ? h('div', { class: 'meta place', text: d.place }) : null,
          h('div', { class: 'bar' }, barI),
          meta,
          soil,
          notes.length ? h('div', { class: 'meta note', text: notes.join(' · ') }) : null,
          !lab.sandbox && tool && !plan.hasTool ? h('div', { class: 'meta muted', text: `${tool.name}: ${tool.price} coins at the shop` }) : null,
          h('div', { class: 'meta fx' }, ...fx.map(([k, v]) => h('span', { class: 'fx-chip', title: EFFECT_BY_KEY[k].label }, icon(EFFECT_BY_KEY[k].icon, 'sm'), ` ${Math.round(v)}`)),
            h('span', { class: 'muted', text: ` · in stores: ${Number.isFinite(st.stock(m.id)) ? Math.round(st.stock(m.id)) + ' ml' : '∞'}` }))),
        wbtn ? h('div', { class: 'dep-acts' }, wbtn, g) : g);
      this.rows[d.id].card = card;
      // pointing at a card picks out its deposit in the scene
      card.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') this.setHover(d.id); });
      card.addEventListener('pointerleave', () => { if (this.hover === d.id) this.setHover(null); });
      list.appendChild(card);
    }
    if (!list.childElementCount) list.appendChild(h('div', { class: 'muted small empty-list', text: 'Nothing gathered here yet. Slide a finger across a ripe plant to shake its fruit loose, then tap what falls. Each ingredient is listed here once you have gathered it for the first time.' }));
    clear(this.foot).append(lab.sandbox ? 'The Free Experiment’s stores are bottomless, but every harvest takes its plant: new sprouts come up at random spots and grow back within a minute or two — faster when watered. Stones, crystals and shells turn up again whole.' : `Room for ${st.cap.storage} ml of each ingredient. ${st.has('satchel') ? 'Your satchel carries half as much again. ' : ''}Only mature plants can be harvested. New sprouts come up at random spots until the ground is full again, even while the game is closed, and each new day brings every plant on. Living plants grow faster in damp soil: water them (rain does it for you), and they drink it up over a few hours — a riverbank or a bog stays damp far longer than a meadow or the crags. Stones, crystals and shells do not grow: they turn up again whole, with time and the weather.`);
    this.paintBg();
    this.grow();
    this.prewarm();
  }

  /** What a stand holds, in words. @param {any} d @param {any} s status */
  stockText(d, s) {
    if (!d.botanical) return `${s.mature} of ${d.slots} found · ${d.take} ml each`;
    return `${s.mature} of ${d.slots} mature${s.plants.length > s.mature ? ` · ${s.plants.length - s.mature} growing` : ''} · ${d.take} ml each`;
  }

  /** How damp a stand's soil is, in words. @param {any} d @param {any} s status */
  soilText(d, s) {
    // a stand with nothing growing has nothing to say about its soil
    if (s.moisture === null) return '';
    const e = moistureEnv(d, this.lab.state.gathering.sky);
    const w = s.moisture, word = w < e.lo ? 'dry — growing slowly' : w < e.hi ? 'damp' : 'well watered — growing fast';
    return `soil ${word}${s.thirsty ? ` · ${s.thirsty} thirsty` : ''}`;
  }

  deposits() {
    return this.lab.state.deposits.filter((d) => d.region === this.region);
  }

  paintBg() {
    const key = this.region + ':' + this.lab.state.seed;
    if (key === this.bgKey) return;
    this.bgKey = key;
    this.bg = sceneCanvas(this.region, this.lab.state.seed);
    this.ground = new PlantGround(this.region, this.lab.state.seed);
    this.field = [];
  }

  /** The deposits whose plants grow in the scene: one beyond the guild rank is left out (its card says so). */
  shown() {
    const lab = this.lab;
    return this.deposits().filter((d) => lab.sandbox || d.rank <= lab.state.rank);
  }

  /** The silhouette a plant grows into (every stage of it) on a mount. @param {{id:string, m:any}} p @param {string} [mount] @param {boolean} [flip] */
  shapeOf(p, mount = 'ground', flip = false) {
    return p.m && p.m.wild ? silhouetteOf(p.m, { mount, variant: variantOf(p.id), flip }) : null;
  }

  /** The plants of the region now: each at its spot in the scene and its stage. */
  grow() {
    if (!this.ground) return;
    const lab = this.lab, st = lab.state, now = Date.now();
    /** @type {any[]} */
    const plants = [];
    for (const d of this.shown()) {
      const m = st.lookup(d.materialId);
      const key = m && m.wild ? m.wild.key : null;
      const s = depositStatus(st.gathering, d, now);
      // a stone, crystal or shell does not grow: it is simply there once it has formed again
      for (const p of s.plants) if (d.botanical || p.stage === 'mature') plants.push({ ...p, dep: d, m, key });
    }
    plants.sort((a, b) => a.born - b.born || (a.id < b.id ? -1 : 1));
    // each plant on the ground, hanging from a bough or the rock, or jutting from a rock face or a trunk, as its species is found
    const spots = this.ground.place(plants, (p, mount, flip) => this.shapeOf(p, mount, flip), (p) => mountsOf(p.m));
    /** @type {Record<string, number>} */
    const grewAt = {};
    for (const p of plants) {
      Object.assign(p, spots[p.id], { variant: variantOf(p.id) });
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

  /** How a plant is drawn now: its mount and variant, closed out of its hour, rimmed under the pointer. @param {any} p */
  look(p) {
    return { closed: p.stage === 'mature' && !!this.closed[p.dep.id], hover: this.hover === p.id || this.hover === p.dep.id, mount: p.mount, variant: p.variant, flip: p.flip, light: p.light };
  }

  /** The frame a plant shows now, as a box for hit testing. @param {any} p */
  frameOf(p) {
    const f = p.key ? plantFrameOf(p.m, p.stage, this.look(p)) : null;
    return f ? { w: f.pix.w, h: f.pix.h, ax: f.ax, ay: f.ay } : null;
  }

  /** The plant under a pointer event, if any. @param {PointerEvent} e */
  plantAt(e) {
    const r = this.canvas.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * SCENE_W, y = ((e.clientY - r.top) / r.height) * SCENE_H;
    // a mature plant before a growing one in front of it
    const here = this.field.filter((p) => !this.fallen[p.id]), ripe = here.filter((p) => p.stage === 'mature');
    return hitPlant(ripe, (p) => this.frameOf(p), x, y) || hitPlant(here, (p) => this.frameOf(p), x, y);
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
    // the Free Experiment takes the plant too (its stand grows back), but stores nothing
    const r = st.gather(d.id, { thorough: this.thorough && !lab.sandbox, ...(lab.sandbox ? { free: true } : {}), ...(plant ? { plant: plant.id } : {}) });
    if (!r.ok) {
      audio.play('error');
      const why = r.reason === 'full' ? `Your shelves are full of ${m.name}.` : r.reason === 'locked' ? 'You may not gather here yet.'
        : r.reason === 'growing' ? `Still growing — only a mature plant can be harvested. This one matures in ${formatWait(r.nextIn || 60000)}.`
        : d.botanical ? `Nothing is mature yet. The next plant matures in ${formatWait(r.nextIn || 60000)}.`
        : `Nothing to be found here yet. The next one turns up in ${formatWait(r.nextIn || 60000)}.`;
      toast(r.reason === 'growing' ? 'Not ripe yet' : 'Nothing to gather', why, 'satchel');
      return false;
    }
    audio.play(plan.method.sound);
    setTimeout(() => audio.play('select'), 140);
    const at = this.field.find((p) => p.id === r.plant) || { x: d.x, y: d.y, key: null, stage: 'mature' };
    // the mark it leaves lies where the plant was drawn (the scene moved it onto open ground)
    const mark = st.gathering.marks[st.gathering.marks.length - 1];
    if (mark && r.plant && at.key) { mark.x = at.x; mark.y = at.y; if (at.mount && at.mount !== 'ground') mark.mount = at.mount; }
    const f = at.key ? plantFrameOf(m, 'mature', { mount: at.mount, variant: at.variant, flip: at.flip }) : null;
    // the count rises from the middle of what was picked
    const fy = f ? at.y * SCENE_H - f.ay + f.pix.h * 0.5 : at.y * SCENE_H;
    this.floaters.push({ x: at.x * SCENE_W, y: Math.max(20, fy), t: 0, text: `+${r.amount}`, color: m.look || m.color });
    for (const e of r.events || []) lab.announce(e);
    if (lab.tutorial) lab.tutorial.notify('gather', d.materialId);
    // a first find gets its own place on the shelf
    if (!lab.jarEls[d.materialId]) lab.buildShelf(); else lab.updateShelf();
    if (r.plant) { delete this.fallen[r.plant]; delete this.shakes[r.plant]; delete this.energy[r.plant]; }
    lab.save();
    this.refresh();
    return true;
  }

  /** The scene position of a pointer event. @param {{clientX:number, clientY:number}} e */
  scenePoint(e) {
    const r = this.canvas.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * SCENE_W, y: ((e.clientY - r.top) / r.height) * SCENE_H };
  }

  /**
   * The fallen thing under a point, if any: the box of its sprite, grown to
   * a fingertip's size (it is small), the nearest one where boxes overlap.
   * @param {number} x @param {number} y
   */
  itemAt(x, y) {
    let best = null, bestD = Infinity;
    for (const [id, it] of Object.entries(this.fallen)) {
      const b = it.doll.box(2), c = it.doll.centre();
      // (grown to a fingertip round its middle where it is small)
      const hw = Math.max((b.x1 - b.x0) / 2, MIN_HIT * 0.4), hh = Math.max((b.y1 - b.y0) / 2, MIN_HIT * 0.4);
      const cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2;
      if (Math.abs(x - cx) > hw || Math.abs(y - cy) > hh) continue;
      const dd = (x - c.x) ** 2 + (y - c.y) ** 2;
      if (dd < bestD) { bestD = dd; best = id; }
    }
    return best ? this.field.find((p) => p.id === best) || null : null;
  }

  /** Where a fallen thing lies now (its middle, scene pixels), or null. @param {string} id */
  itemCentre(id) {
    const it = this.fallen[id];
    return it ? it.doll.centre() : null;
  }

  /** @param {PointerEvent} e */
  pressScene(e) {
    // one finger at a time: a second one resting on the scene does nothing
    // (a first finger always starts afresh, should a gesture's end have been lost)
    if (this.drag && this.drag.id !== e.pointerId && !e.isPrimary) return;
    if (e.cancelable) e.preventDefault();
    const q = this.scenePoint(e);
    this.drag = { id: e.pointerId, type: e.pointerType || 'mouse', x: q.x, y: q.y, cx: e.clientX, cy: e.clientY, dist: 0, water: this.mode === 'water', wx: q.x, wy: q.y, drank: 0, near: false, pours: 0 };
    try { this.canvas.setPointerCapture(e.pointerId); } catch { /* a synthetic pointer */ }
    // the watering can pours at once where the finger comes down
    if (this.drag.water) this.pourAt(q.x, q.y, this.drag);
  }

  /** @param {PointerEvent} e */
  moveScene(e) {
    const d = this.drag;
    if (d) {
      if (e.pointerId !== d.id) return;
      // every point the finger passed through since the last frame, not just the last (a fast swipe skips over a plant otherwise)
      const pts = typeof e.getCoalescedEvents === 'function' ? e.getCoalescedEvents() : [];
      for (const c of pts.length ? pts : [e]) {
        const q = this.scenePoint(c);
        d.dist += Math.hypot(c.clientX - d.cx, c.clientY - d.cy);
        d.cx = c.clientX; d.cy = c.clientY;
        if (d.water) {
          // pour along the path, a splash every few pixels
          if (Math.hypot(q.x - d.wx, q.y - d.wy) >= WATER_STEP) this.pourAt(q.x, q.y, d);
        } else if (Math.hypot(q.x - d.x, q.y - d.y) > 0.8) this.sweep(d.x, d.y, q.x, q.y);
        d.x = q.x; d.y = q.y;
      }
      return;
    }
    if (e.pointerType === 'mouse') {
      const q = this.scenePoint(e);
      this.setHover(this.depositAt(e));
      if (this.itemAt(q.x, q.y)) this.canvas.style.cursor = 'pointer';
    }
  }

  /** @param {PointerEvent} e */
  releaseScene(e) {
    const d = this.drag;
    if (!d || e.pointerId !== d.id) return;
    this.drag = null;
    if (d.water) { this.endPour(d); return; }
    if (d.dist <= (TAP_SLOP[d.type] ?? TAP_SLOP.mouse)) this.tapScene(e);
  }

  /**
   * A finger slid from (x0, y0) to (x1, y1), pushing what it passes: the
   * scenery's hanging strands are knocked its way and swing, every plant it brushes bends and rings
   * (further the faster the slide), what lies fallen is flicked along, and
   * a ripe plant shaken hard enough lets go of what it bears.
   */
  sweep(x0, y0, x1, y1) {
    const dx = x1 - x0, speed = Math.hypot(dx, y1 - y0), dir = dx === 0 ? (this.time * 7 % 2 < 1 ? 1 : -1) : Math.sign(dx);
    const a = dir * Math.min(3.2, 0.5 + speed * 0.45);
    const touch = sceneTouch(this.region, this.lab.state.seed);
    if (touch) touch.push(x0, y0, x1, y1);
    for (const it of Object.values(this.fallen)) it.doll.kick(x0, y0, x1, y1, 3);
    for (const p of this.field) {
      if (this.fallen[p.id]) continue;
      const f = this.frameOf(p);
      if (!f) continue;
      const left = p.x * SCENE_W - f.ax - 5, top = p.y * SCENE_H - f.ay - 5, right = left + f.w + 10, bottom = top + f.h + 10;
      if (!crosses(x0, y0, x1, y1, left, top, right, bottom)) continue;
      const cur = this.shakes[p.id];
      if (!cur || Math.abs(a) >= Math.abs(cur.a) * Math.exp(-(this.time - cur.t0) * 1.5)) this.shakes[p.id] = { a, t0: this.time };
      // (a slow drag shakes too, only it takes longer)
      this.energy[p.id] = (this.energy[p.id] || 0) + Math.max(0.08, speed / 7);
      if (p.stage === 'mature' && !this.closed[p.dep.id] && this.energy[p.id] >= 1) this.detach(p, dx, y1 - y0);
    }
  }

  /**
   * A plant's sprite cut down to what shows of it (its frame keeps room
   * round it): the body a ragdoll is made of, so it rests on its own
   * pixels. Cached with the sprite's canvas.
   * @param {{cv:HTMLCanvasElement, ax:number, ay:number, w:number, h:number}} sp
   */
  static trimmed(sp) {
    const any = /** @type {any} */ (sp.cv);
    if (any.trim) return { ...any.trim };
    const data = /** @type {CanvasRenderingContext2D} */ (sp.cv.getContext('2d')).getImageData(0, 0, sp.w, sp.h).data;
    let x0 = sp.w, y0 = sp.h, x1 = -1, y1 = -1;
    for (let y = 0; y < sp.h; y++) for (let x = 0; x < sp.w; x++) if (data[(y * sp.w + x) * 4 + 3]) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    if (x1 < 0 || (x0 === 0 && y0 === 0 && x1 === sp.w - 1 && y1 === sp.h - 1)) { any.trim = sp; return { ...sp }; }
    const cv = document.createElement('canvas');
    cv.width = x1 - x0 + 1; cv.height = y1 - y0 + 1;
    /** @type {CanvasRenderingContext2D} */ (cv.getContext('2d')).drawImage(sp.cv, -x0, -y0);
    any.trim = { cv, w: cv.width, h: cv.height, ax: sp.ax - x0, ay: sp.ay - y0 };
    return { ...any.trim };
  }

  /** Whether a scene pixel is something a fallen thing rests on: the ground, rock, or the surface of water or lava. @param {number} x @param {number} y */
  solidAt(x, y) {
    if (x < 0 || x >= SCENE_W || y < 0) return false;
    if (y >= SCENE_H) return true;
    const sc = sceneOf(this.region, this.lab.state.seed), k = y * SCENE_W + x;
    return !!(sc.solid[k] || sc.rock[k] || sc.liquid[k]);
  }

  /**
   * A ripe plant lets go of what it bears: a ragdoll cut from the very
   * sprite it grew as — the same pixels, lit as they were where it grew —
   * thrown the way the finger went (dx, dy: its last stroke, scene pixels),
   * a ground plant pulled up, a hanging one dropping from its hold.
   * @param {any} p @param {number} [dx] @param {number} [dy]
   */
  detach(p, dx = 0, dy = 0) {
    if (this.fallen[p.id]) return;
    const whole = plantCanvas(p.m, p.stage, { ...this.look(p), hover: false });
    if (!whole) return;
    const sp = WildsView.trimmed(whole);
    const hangs = p.mount === 'hang' || p.mount === 'bough' || p.mount === 'ceiling', juts = p.mount === 'wall' || p.mount === 'trunk';
    const x = Math.round(p.x * SCENE_W), y = Math.round(p.y * SCENE_H);
    const fling = Math.max(-1, Math.min(1, dx / 10)), up = Math.max(-1, Math.min(1, dy / 10));
    const away = juts ? (p.flip ? -1 : 1) : 0;
    const doll = new Ragdoll(sp, x, y, {
      W: SCENE_W, H: SCENE_H,
      vx: fling * 72 + away * 28 + (Math.random() - 0.5) * 16,
      // (a fruit snaps off its hold and drops at once; a ground plant is pulled up with a jerk)
      vy: hangs ? 45 + up * 30 : juts ? -20 + up * 30 : -75 + Math.min(0, up) * 45,
      // (the top flies out further than the foot: it tumbles)
      spin: hangs ? fling * 45 : fling * 90 + (Math.random() - 0.5) * 30,
    });
    // clear of the face or the ground it grew from
    for (let k = 0; k < 8 && !doll.clear((xx, yy) => this.solidAt(xx, yy)); k++) doll.shift(away, -1);
    this.fallen[p.id] = { doll, sp, landed: false, rung: 0 };
    this.shakes[p.id] = { a: (this.shakes[p.id] ? Math.sign(this.shakes[p.id].a) : 1) * 3.4, t0: this.time };
    const m = p.m, c = m ? `rgb(${Math.round((m.look || m.color)[0] * 255)},${Math.round((m.look || m.color)[1] * 255)},${Math.round((m.look || m.color)[2] * 255)})` : '#8c8';
    const bx = x - sp.ax + sp.w / 2, by = y - sp.ay + sp.h * (hangs ? 0.2 : 0.8);
    for (let i = 0; i < 7; i++) this.bits.push({ x: bx + (Math.random() - 0.5) * 8, y: by + (Math.random() - 0.5) * 6, vx: (Math.random() - 0.5) * 30, vy: -10 + Math.random() * 14, t: 0, c: i % 2 ? c : '#6fa84a' });
    audio.play('click');
  }

  /** @param {PointerEvent} e */
  tapScene(e) {
    const q = this.scenePoint(e);
    // what lies fallen on the ground (or is still falling) is gathered by tapping it
    const fallenAt = this.itemAt(q.x, q.y);
    if (fallenAt) { this.gather(fallenAt.dep, fallenAt); return; }
    const p = this.plantAt(e);
    if (!p) return;
    // a ripe plant tapped is shaken: what it bears falls, and is tapped in turn
    if (p.stage === 'mature' && !this.closed[p.dep.id]) { const side = q.x < p.x * SCENE_W ? 1 : -1; this.shakes[p.id] = { a: 2.6 * side, t0: this.time }; this.energy[p.id] = 1; this.detach(p, side * 3, 0); return; }
    this.gather(p.dep, p);
  }

  /**
   * The growing living plants a splash at (x, y) reaches: any whose sprite
   * the point falls on (a finger lands on the plant, not its foot), or whose
   * foot is close by. By deposit.
   * @param {number} x @param {number} y
   */
  wateredBy(x, y) {
    const reach = 22;
    /** @type {Map<any, string[]>} */
    const by = new Map();
    let near = false;
    for (const p of this.field) {
      const px = p.x * SCENE_W, py = p.y * SCENE_H, f = this.frameOf(p);
      const on = !!f && x >= px - f.ax - 4 && x <= px - f.ax + f.w + 4 && y >= py - f.ay - 4 && y <= py - f.ay + f.h + 4;
      if (!on && Math.hypot(px - x, (py - y) * 1.4) > reach) continue;
      near = true;
      if (!p.dep.botanical || p.stage === 'mature') continue;
      if (!by.has(p.dep)) by.set(p.dep, []);
      by.get(p.dep).push(p.id);
    }
    return { by, near };
  }

  /**
   * Pour water at a scene point (a tap, or a step of a drag in watering
   * mode): drops fall and splash, and every growing plant there drinks.
   * @param {number} x @param {number} y @param {{wx:number, wy:number, drank:number, near:boolean, pours:number}} d the gesture
   */
  pourAt(x, y, d) {
    d.wx = x; d.wy = y; d.pours++;
    this.splash(x, y, 10);
    const { by, near } = this.wateredBy(x, y);
    d.near = d.near || near;
    let n = 0;
    for (const [dep, ids] of by) n += this.lab.state.water(dep.id, ids);
    // (a sound as the can tips, then for each splash that waters something)
    if (n || d.pours === 1) audio.play('pour');
    if (n) { d.drank += n; this.tick(); }
    return n;
  }

  /** The watering gesture is over: keep what drank, or say why nothing did. @param {{drank:number, near:boolean}} d */
  endPour(d) {
    if (d.drank) { this.lab.save(); this.tick(); return; }
    toast('Nothing to water here', d.near ? 'Only growing plants drink — mature ones are ready to harvest, stones, crystals and shells need no water, and soil already soaked takes no more.' : 'Tap or drag close to a growing plant to water it.', 'drop');
  }

  /** Splash water at a pointer event: every growing plant within reach drinks. @param {{clientX:number, clientY:number}} e */
  waterAt(e) {
    const q = this.scenePoint(e), d = { wx: q.x, wy: q.y, drank: 0, near: false, pours: 0 };
    this.pourAt(q.x, q.y, d);
    this.endPour(d);
    return d.drank;
  }

  /** Water every growing plant of a stand (its card's button). @param {any} d */
  waterStand(d) {
    const lab = this.lab;
    const n = lab.state.water(d.id, null);
    for (const p of this.field) if (p.dep === d && p.stage !== 'mature') this.splash(p.x * SCENE_W, p.y * SCENE_H, 6);
    audio.play(n ? 'pour' : 'error');
    if (!n) { toast('Already watered', 'Its soil is as wet as it gets — more water would not make it grow any faster.', 'drop'); return; }
    lab.save();
    this.refresh();
  }

  /** Drops of water falling onto (x, y) and splashing. */
  splash(x, y, n) {
    for (let i = 0; i < n; i++) this.drops.push({ x: x + (Math.random() - 0.5) * 16, y: y - 18 - Math.random() * 10, vx: (Math.random() - 0.5) * 6, vy: 30 + Math.random() * 20, t: 0, life: 0.5 + Math.random() * 0.2, gy: y + (Math.random() - 0.5) * 6 });
  }

  /** @param {number} dt */
  frame(dt) {
    if (!this.ctx || !this.bg) return;
    this.time += dt;
    const ctx = this.ctx, st = this.lab.state, now = Date.now();
    // the painting, its leaves swaying in the wind
    const touch = sceneTouch(this.region, st.seed);
    if (touch) touch.step(dt);
    ctx.drawImage(sceneFrame(this.region, st.seed, this.time), 0, 0);
    animateRegion(ctx, this.region, this.time, st.seed);
    // the marks of past harvests, fading into the ground, then the plants, the far ones first
    for (const k of marksIn(st.gathering, this.region, now)) this.drawMark(ctx, k);
    for (const p of this.field.slice().sort((a, b) => a.y - b.y)) if (p.key && !this.fallen[p.id]) this.drawPlant(ctx, p);
    this.drawFallen(ctx, dt);
    this.paintSky(ctx, dt);
    this.drawDrops(ctx, dt);
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
   * A plant at its stage: damp soil darkening round its foot when it has
   * been watered, a ground shadow, a slight glow of its own colour, then
   * its sprite, springing up a pixel as
   * it reaches a new stage; a thirsty growing plant carries a little drop
   * (always in watering mode, now and then otherwise); a mature crystal or
   * a magical plant glimmers now and then at its bright spots.
   * @param {CanvasRenderingContext2D} ctx @param {any} p
   */
  drawPlant(ctx, p) {
    const look = this.look(p), { closed, hover } = look;
    const sp = plantCanvas(p.m, p.stage, look);
    if (!sp) return;
    const x = Math.round(p.x * SCENE_W), y = Math.round(p.y * SCENE_H), onGround = !p.mount || p.mount === 'ground';
    const since = this.time - (this.grewAt[p.id + ':' + p.stage] ?? -9);
    const sw = Math.max(4, Math.round(sp.w * (p.stage === 'sprout' ? 0.5 : 0.6)));
    if (onGround && p.moisture !== null && p.moisture !== undefined) {
      // damp earth: a dark patch, wider and darker the wetter it is above the habitat's own level
      const e = moistureEnv(p.dep, this.lab.state.gathering.sky), wet = Math.max(0, Math.min(1, (p.moisture - e.base) / Math.max(0.05, 1 - e.base)));
      if (wet > 0.05) {
        ctx.fillStyle = `rgba(20,14,30,${(0.12 + wet * 0.25).toFixed(3)})`;
        const ww = Math.round(sw * (1 + wet * 0.8));
        ctx.fillRect(x - (ww >> 1), y - 1, ww, 3);
        ctx.fillRect(x - (ww >> 1) + 2, y + 2, Math.max(2, ww - 4), 1);
      }
    }
    if (onGround) {
      // the shadow it casts: the light comes from the upper left, so it lies to the right, as wide as the plant
      // is (a sprout casts a small one), darkest under its foot, dimmer where it is thin
      const hw = Math.max(3, Math.round(sp.w * 0.34)), ox = Math.round(hw * 0.3) + 1;
      ctx.fillStyle = SHADOW[this.region] || SHADOW.forest;
      ctx.fillRect(x - hw + ox, y - 1, hw * 2, 1);
      ctx.fillRect(x - hw + ox + 1, y, hw * 2 - 2, 1);
      ctx.fillRect(x - Math.floor(hw / 2) + ox, y + 1, hw, 1);
      ctx.fillRect(x - Math.floor(hw / 2), y - 2, hw, 1);
    }
    // a slight glow of its own colour about it, breathing, so it reads in the scene without standing out of it
    const tint = plantGlow(p.m), lift = since < 0.3 ? 1 : 0;
    if (tint && !hover) {
      const cx = x - sp.ax + sp.w / 2, cy = y - sp.ay + sp.h * 0.5, r = Math.max(sp.w, sp.h) * 0.6 + 2;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, tint); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.13 + 0.04 * Math.sin(this.time * 1.6 + p.x * 17);
      ctx.fillStyle = g; ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    }
    // a vine hangs and sways; the rest stands, juts or lies still
    const dxAt = this.drawBent(ctx, p, sp, x, y, lift);
    if (!dxAt) ctx.drawImage(sp.cv, x - sp.ax, y - sp.ay - lift);
    // what glows lights its surroundings, breathing, the more so the darker the region
    const emit = emitColour(p.m);
    if (emit && !closed && sp.glows.length) {
      const dark = GLOW_IN[this.region] ?? 0.6, shown = sp.glows.length > 8 ? sp.glows.filter((_, i) => i % Math.ceil(sp.glows.length / 8) === 0) : sp.glows;
      ctx.globalCompositeOperation = 'lighter';
      shown.forEach(([gx, gy], i) => {
        const r = 4 + Math.min(4, sp.glows.length * 0.5), cx = x - sp.ax + gx + (dxAt ? dxAt(gy) : 0), cy = y - sp.ay + gy - lift;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, emit); g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.globalAlpha = Math.min(0.4, 0.13 * dark * (0.75 + 0.25 * Math.sin(this.time * 1.4 + i * 1.9 + p.x * 11)) * (p.stage === 'sprout' ? 0.6 : 1));
        ctx.fillStyle = g; ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      });
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    }
    if (p.thirsty && (this.mode === 'water' || Math.sin(this.time * 2 + p.x * 9) > 0.6)) {
      // a drop over its head asks for water
      const dx = x + Math.round(sp.w / 2 - sp.ax) - 1, dy = y - sp.ay - 5 + Math.round(Math.sin(this.time * 4 + p.x * 5));
      ctx.fillStyle = '#1a2a48'; ctx.fillRect(dx - 1, dy, 4, 4); ctx.fillRect(dx, dy - 1, 2, 1);
      ctx.fillStyle = '#6ab8f0'; ctx.fillRect(dx, dy, 2, 3); ctx.fillStyle = '#d8f0ff'; ctx.fillRect(dx, dy, 1, 1);
    }
    const d = speciesOf(p.m);
    if (p.stage === 'mature' && d && sp.glints.length && (d.family === 'crystal' || d.family === 'mineral' || d.tr.glow > 0.3) && !hover && !closed) {
      const cycle = this.time * 0.6 + p.x * 7.3 + p.y * 3.1, phase = cycle % 2;
      if (phase < 0.5) {
        const [gx, gy] = sp.glints[Math.floor(cycle / 2) % sp.glints.length];
        sparkle(ctx, x - sp.ax + gx, y - sp.ay + gy, phase / 0.5);
      }
    }
  }

  /**
   * A plant moved by wind and by fingers. Something hanging (from a bough, a
   * ledge or the roof) swings about where it holds on, each row of it moved
   * sideways the further the lower it hangs, so it bends rather than slides;
   * something standing bends from its foot, its top furthest. A swipe's push
   * rings in it for a few seconds. A plant on rock or a trunk stays rigid.
   * Returns how far each row of the sprite was moved, or null if it was not
   * (and so has still to be drawn).
   * @param {CanvasRenderingContext2D} ctx @param {any} p @param {{cv:HTMLCanvasElement, ax:number, ay:number, w:number, h:number}} sp @param {number} x @param {number} y @param {number} lift
   * @returns {((row:number)=>number)|null}
   */
  drawBent(ctx, p, sp, x, y, lift) {
    const hangs = p.mount === 'hang' || p.mount === 'bough' || p.mount === 'ceiling';
    if (!hangs && p.mount && p.mount !== 'ground') return null;
    let ring = 0;
    const sh = this.shakes[p.id];
    if (sh) {
      const u = this.time - sh.t0;
      if (u > 3.2) delete this.shakes[p.id]; else ring = sh.a * Math.exp(-u * 1.5) * Math.sin(u * 11) * 1.7;
    }
    if (!hangs) {
      if (Math.abs(ring) < 0.3) return null;
      const dxAt = (/** @type {number} */ r) => (r > sp.ay ? 0 : Math.round(ring * 2.2 * ((sp.ay - r) / Math.max(1, sp.ay)) ** 2));
      for (let r = 0; r < sp.h; r++) ctx.drawImage(sp.cv, 0, r, sp.w, 1, x - sp.ax + dxAt(r), y - sp.ay + r - lift, sp.w, 1);
      return dxAt;
    }
    const st = this.lab.state, wind = windAt(x, this.time, (hashString(st.seed) % 1000) / 100) * 0.8;
    const swing = wind + 0.35 * Math.sin(this.time * 1.7 + p.x * 23) + ring, below = sp.h - sp.ay;
    const dxAt = (/** @type {number} */ r) => Math.round(swing * 2.2 * (Math.max(0, r - sp.ay) / Math.max(1, below)) ** 2);
    for (let r = 0; r < sp.h; r++) ctx.drawImage(sp.cv, 0, r, sp.w, 1, x - sp.ax + dxAt(r), y - sp.ay + r, sp.w, 1);
    return dxAt;
  }

  /**
   * What has been shaken loose: ragdolls tumbling down, knocking against the
   * ground, then lying there with a glint, waiting to be tapped. Bits of
   * leaf and pulp fly from where it let go.
   * @param {CanvasRenderingContext2D} ctx @param {number} dt
   */
  drawFallen(ctx, dt) {
    for (const id of Object.keys(this.fallen)) if (!this.field.some((p) => p.id === id)) delete this.fallen[id];
    const solid = (/** @type {number} */ x, /** @type {number} */ y) => this.solidAt(x, y);
    for (const [id, it] of Object.entries(this.fallen)) {
      const p = this.field.find((q) => q.id === id);
      if (!p) continue;
      const { doll, sp } = it;
      doll.step(dt, solid);
      // a knock against the ground is heard (not every little one)
      if (doll.knock > 110 && this.time - it.rung > 0.18) { audio.play('click'); it.rung = this.time; }
      doll.knock = 0;
      it.landed = doll.asleep;
      // its shadow on the ground below it
      const c = doll.centre(), b = doll.box();
      let gy = Math.round(b.y1);
      while (gy < SCENE_H - 1 && !this.solidAt(Math.round(c.x), gy + 1)) gy++;
      const sh = Math.max(3, Math.round((b.x1 - b.x0) * 0.7) - Math.round((gy - b.y1) / 5));
      ctx.fillStyle = 'rgba(0,0,0,0.28)';
      ctx.fillRect(Math.round(c.x - sh / 2), gy, sh, 1);
      // the same pixels it grew as, each piece turned as it lies, never smoothed: its texture stays as it was on the plant
      doll.draw(ctx, sp.cv);
      if (it.landed) {
        const u = (this.time * 0.9 + p.x * 5) % 2;
        if (u < 0.6) sparkle(ctx, b.x1 - 3, b.y0 + 2, u / 0.6);
      }
    }
    for (const b of this.bits) {
      b.t += dt; b.vy += 120 * dt; b.x += b.vx * dt; b.y += b.vy * dt;
      ctx.fillStyle = b.c; ctx.fillRect(Math.round(b.x), Math.round(b.y), 1, 1);
    }
    this.bits = this.bits.filter((b) => b.t < 0.9);
  }

  /** The water drops in flight: falling, then a little splash where each lands. @param {CanvasRenderingContext2D} ctx @param {number} dt */
  drawDrops(ctx, dt) {
    for (const d of this.drops) {
      d.t += dt;
      if (d.y < d.gy) { d.vy += 120 * dt; d.x += d.vx * dt; d.y += d.vy * dt; ctx.fillStyle = '#9ad4ff'; ctx.fillRect(Math.round(d.x), Math.round(d.y), 1, 2); }
      else {
        const k = Math.min(3, Math.floor((d.t - 0.3) * 12));
        ctx.fillStyle = 'rgba(200,236,255,0.85)';
        ctx.fillRect(Math.round(d.x) - k, Math.round(d.gy) - 1, 1, 1); ctx.fillRect(Math.round(d.x) + k, Math.round(d.gy) - 1, 1, 1);
        ctx.fillRect(Math.round(d.x), Math.round(d.gy) - 1 - Math.max(0, 2 - k), 1, 1);
      }
    }
    this.drops = this.drops.filter((d) => d.t < d.life + 0.3);
  }

  /**
   * The mark a harvest leaves: a patch of turned earth (rubble on stone
   * ground) as wide as the plant was, with a cut stem — or, dug out whole, a
   * dark hole ringed with clods — fading back into the ground in steps.
   * @param {CanvasRenderingContext2D} ctx @param {any} k a mark (gathering.js marksIn)
   */
  drawMark(ctx, k) {
    // what hung or jutted from a hold leaves no turned earth
    if (k.mount && k.mount !== 'ground') return;
    const sil = k.key ? silhouetteOf(this.lab.state.lookup('wild-' + k.key)) : null;
    const x = Math.round(k.x * SCENE_W), y = Math.round(k.y * SCENE_H);
    const w = Math.max(8, Math.round((sil ? sil.w : 16) * 0.6)), hw = Math.floor(w / 2);
    const stone = this.region === 'quarry' || this.region === 'crags';
    const [soil, dark, clod] = stone ? ['#6e6258', '#3a322c', '#a09280'] : this.region === 'moonfen' || this.region === 'netherwood' ? ['#3a3228', '#16120e', '#5a5040'] : ['#7a5230', '#3a2412', '#a07a4a'];
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

  /** How a deposit is doing, in words (stones, crystals and shells turn up again rather than grow). @param {any} s status @param {number} can @param {any} d */
  when(s, can, d) {
    const living = d.botanical;
    if (s.fullIn <= 0) return living ? 'fully grown' : 'all found';
    const growing = `${living ? 'growing back' : 'turning up again'}${s.scarred ? ' slowly' : ''} · full in ${formatWait(s.fullIn)}`;
    if (can >= 5) return growing;
    return `next ${living ? 'ripe' : 'one'} in ${formatWait(s.nextIn)} · ${growing}`;
  }

  tick() {
    const lab = this.lab, st = lab.state;
    if (!this.rows) return;
    const now = Date.now();
    for (const d of this.deposits()) {
      const row = this.rows[d.id];
      const plan = gatherPlan(st, d, st.lookup(d.materialId), { thorough: this.thorough });
      if (!row) { this.closed[d.id] = !lab.sandbox && !plan.open; continue; }
      const s = depositStatus(st.gathering, d, now);
      const can = harvestable(st.gathering, d, lab.sandbox ? d : plan, now);
      row.barI.style.width = Math.round(s.fraction * 100) + '%';
      row.meta.textContent = `${this.stockText(d, s)} · ${this.when(s, can, d)}`;
      if (row.soil) row.soil.textContent = this.soilText(d, s);
      if (row.wbtn) row.wbtn.disabled = s.plants.every((p) => p.stage === 'mature');
      row.g.disabled = row.locked || can < 5;
      this.can[d.id] = row.locked || can >= 5;
      if (row.card) row.card.classList.toggle('spent', !this.can[d.id]);
      this.closed[d.id] = !lab.sandbox && !plan.open;
    }
    this.grow();
  }
}
