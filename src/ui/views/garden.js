// The personal garden: a painted plot of ground behind the shop, its beds,
// the seeds in hand and the upgrades.
//
// Tap a plot to select it. With a seed chosen, an empty plot is sown at
// once; a growing crop is watered with a tap (one tap per plot, or "Water
// all"); a mature one is harvested. No confirmation dialogs: everything a
// tap does is shown on the plot it is about to do it to.
//
// The scene and the beds are drawn from the garden sprite sheets
// (art/ui/source/garden1.png, garden2.png): sky, treeline, fence, lawn, and
// a bed per plot in its state (plain, dry, watered, greenhouse, Arcane
// chamber). The crops on them are the ingredient atlases' growth stages
// (seed in its bed, sprout, young, developing, mature), the same sprites
// the species has in the wilds and on the shelf.

import { h, btn, clear, toast, roomHead } from '../dom.js';
import { icon } from '../icons.js';
import { audio } from '../../audio/audio.js';
import { BEDS, GRADES, GARDEN_UPGRADES, seedList, gradeNeeded, bedOf, boughtCount, cropYield, growHours, seedId } from '../../game/garden.js';
import { SPECIES_BY_KEY, materialIdOf } from '../../materials/catalog.js';
import { RARITY } from '../../materials/rarity.js';
import { atlasFrame, seedAsset, stageAsset, loadAtlases, onAtlasLoaded } from '../../visual/atlas.js';
import { formatWait } from '../../game/gathering.js';
import { rarityTag } from '../rarity-ui.js';
import { hashString, Rng } from '../../core/rng.js';

/**
 * The garden's art, sliced from the garden sprite sheets (art/ui/source,
 * scripts/slice-ui-sheets.py). The paths are written out in full: the
 * slicer ships only the sprites the code names.
 */
const ART = {
  sky: 'assets/ui/garden/sky.png', treeline: 'assets/ui/garden/treeline.png',
  fence: 'assets/ui/garden/fence.png', fenceVine: 'assets/ui/garden/fence-vine.png',
  grass: 'assets/ui/garden/grass.png', grassFlowers: 'assets/ui/garden/grass-flowers.png', grassFlower: 'assets/ui/garden/grass-flower.png', grassTufts: 'assets/ui/garden/grass-tufts.png',
  bushPink: 'assets/ui/garden/bush-pink.png', bushWhite: 'assets/ui/garden/bush-white.png', bush: 'assets/ui/garden/bush.png', fern: 'assets/ui/garden/fern.png',
  barrel: 'assets/ui/garden/barrel.png', pump: 'assets/ui/garden/pump.png', bucket: 'assets/ui/garden/bucket.png', sacks: 'assets/ui/garden/sacks.png',
  tuft: 'assets/ui/garden/tuft.png', tuft2: 'assets/ui/garden/tuft-2.png', flowersPink: 'assets/ui/garden/flowers-pink.png', flowersWhite: 'assets/ui/garden/flowers-white.png',
  flowersYellow: 'assets/ui/garden/flowers-yellow.png', lavender: 'assets/ui/garden/lavender.png', clover: 'assets/ui/garden/clover.png', pebble: 'assets/ui/garden/pebble.png', rock: 'assets/ui/garden/rock-moss.png',
  shadow: 'assets/ui/garden/shadow.png', markSelect: 'assets/ui/garden/mark-select.png', markRipe: 'assets/ui/garden/mark-ripe.png',
  plus: 'assets/ui/garden/plus.png', drop: 'assets/ui/garden/drop.png', sparkle: 'assets/ui/garden/sparkle.png',
};
/** Beds by kind, in the sheet's columns: plain, dry, watered, greenhouse, Arcane chamber (and ripe, unused). */
const BED_ART = {
  soil: ['assets/ui/garden/bed-soil-0.png', 'assets/ui/garden/bed-soil-1.png', 'assets/ui/garden/bed-soil-2.png', 'assets/ui/garden/bed-soil-3.png', 'assets/ui/garden/bed-soil-4.png'],
  fungal: ['assets/ui/garden/bed-fungal-0.png', 'assets/ui/garden/bed-fungal-1.png', 'assets/ui/garden/bed-fungal-2.png', 'assets/ui/garden/bed-fungal-3.png', 'assets/ui/garden/bed-fungal-4.png'],
  crystal: ['assets/ui/garden/bed-crystal-0.png', 'assets/ui/garden/bed-crystal-1.png', 'assets/ui/garden/bed-crystal-2.png', 'assets/ui/garden/bed-crystal-3.png', 'assets/ui/garden/bed-crystal-4.png'],
  tide: ['assets/ui/garden/bed-tide-0.png', 'assets/ui/garden/bed-tide-1.png', 'assets/ui/garden/bed-tide-2.png', 'assets/ui/garden/bed-tide-3.png', 'assets/ui/garden/bed-tide-4.png'],
};
/** Soil moisture, as the sheet's four-cell gauge (empty → full). */
const MOIST_ART = ['assets/ui/garden/moist-0.png', 'assets/ui/garden/moist-1.png', 'assets/ui/garden/moist-2.png', 'assets/ui/garden/moist-3.png'];
/** The counts' icons. */
const STAT_ART = { plots: 'assets/ui/garden/icon-grid.png', growing: 'assets/ui/garden/icon-potted.png', ready: 'assets/ui/garden/icon-check.png', thirsty: 'assets/ui/garden/drop.png' };

/** @type {Map<string, HTMLImageElement>} */
const IMAGES = new Map();
/** called when any garden sprite finishes loading @type {Set<() => void>} */
const ON_IMAGE = new Set();
/** A garden sprite, loaded once (null until it has loaded). @param {string} src */
function art(src) {
  let im = IMAGES.get(src);
  if (!im) {
    im = new Image();
    im.onload = () => { for (const f of ON_IMAGE) f(); };
    im.src = src;
    IMAGES.set(src, im);
  }
  return im.complete && im.naturalWidth ? im : null;
}

/**
 * The scene's geometry, in the sheet's own pixels: beds are drawn at their
 * size in the sheet, four to a row (six once there are more than eight),
 * and the crops at three times the atlas sprites' size (less for a wide one).
 */
const BW = 124, BH = 94, GAP = 22, MARGIN = 46, TOP = 214, PITCH = 154, CROP_SCALE = 3;

/** The bed's column in the sheet for a plot: its grade's frame, else how wet it is. @param {any} p plot @param {any} pv its view */
function bedColumn(p, pv) {
  if (p.grade >= 2) return 4;
  if (p.grade >= 1) return 3;
  if (!pv || !pv.state) return 0;
  return pv.state.w < 0.35 ? 1 : pv.state.w > 0.7 ? 2 : 0;
}

/** The moisture gauge cell count for a soil moisture (0..1). @param {number} w */
const moistCells = (w) => w < 0.3 ? 0 : w < 0.55 ? 1 : w < 0.8 ? 2 : 3;

/** A growing time, in hours or minutes. @param {number} hours */
const growText = (hours) => hours >= 1 ? `${Math.round(hours * 10) / 10} h` : `${Math.max(1, Math.round(hours * 60))} min`;

export class GardenView {
  /** @param {import('../lab.js').LabScreen} lab */
  constructor(lab) {
    this.lab = lab;
    this.el = h('section', { class: 'view view-garden', 'data-view': 'garden' });
    /** the plot under the finger @type {string|null} */
    this.plot = null;
    /** the seed chosen to sow @type {string|null} */
    this.seed = null;
    this.t = 0;
    this.redrawIn = 0;
    onAtlasLoaded((a) => { if (a.startsWith('growth') || a === 'seeds') this.refresh(); });
    // the sheet's sprites arrive one by one: repaint the ground and the plots as they do
    ON_IMAGE.add(() => { this.bg = null; this.paint(); });
  }

  build() {
    const el = clear(this.el);
    this.hintEl = null;
    this.canvas = /** @type {HTMLCanvasElement} */ (h('canvas', { width: '1', height: '1', class: 'garden-scene', 'aria-label': 'Your garden: tap a plot' }));
    this.canvas.addEventListener('pointerdown', (e) => this.tapScene(e));
    this.status = h('div', { class: 'small garden-status' });
    this.plotsEl = h('div', { class: 'plots', role: 'listbox', 'aria-label': 'Garden plots' });
    this.seedsEl = h('div', { class: 'seeds', role: 'listbox', 'aria-label': 'Seeds in hand' });
    this.actsEl = h('div', { class: 'row wrap' });
    this.upsEl = h('div', { class: 'garden-ups' });
    el.append(roomHead('Garden', 'seedling'), h('div', { class: 'garden' },
      this.canvas, h('div', { class: 'row garden-bar' }, this.status, this.actsEl),
      this.plotsEl,
      this.seedBar = h('div', { class: 'seed-bar' }), this.seedsEl,
      h('details', { class: 'card parch' }, h('summary', { text: 'Garden upgrades' }), this.upsEl)));
    // the growth stages load with the garden (they are not needed before)
    loadAtlases((a) => a.id.startsWith('growth') || a.id === 'seeds').then(() => this.refresh());
    this.refresh();
  }

  /** The scene's size and where the plots lie in it: rows of four (six past eight plots), each row centred. */
  layout() {
    const plots = this.lab.state.garden.plots, n = plots.length, per = n > 8 ? 6 : 4, rows = Math.max(1, Math.ceil(n / per));
    const w = MARGIN * 2 + per * BW + (per - 1) * GAP, hgt = TOP + rows * PITCH - (PITCH - BH) + 34;
    const cells = plots.map((p, i) => {
      const row = Math.floor(i / per), col = i % per, inRow = Math.min(per, n - row * per);
      const x0 = (w - (inRow * BW + (inRow - 1) * GAP)) / 2;
      return { p, x: Math.round(x0 + col * (BW + GAP)), y: TOP + row * PITCH, w: BW, h: BH };
    });
    return { w, h: hgt, per, rows, cells };
  }

  /** @param {PointerEvent} e */
  tapScene(e) {
    const lay = this.layout(), r = this.canvas.getBoundingClientRect(), x = ((e.clientX - r.left) / r.width) * lay.w, y = ((e.clientY - r.top) / r.height) * lay.h;
    // the bed, or the crop standing on it
    const hit = lay.cells.find((q) => x >= q.x - 6 && x <= q.x + q.w + 6 && y >= q.y - 40 && y <= q.y + q.h + 6);
    if (hit) this.act(hit.p.id);
  }

  /** What a tap on a plot does: sow, water or harvest (or just select it). @param {string} id */
  act(id) {
    const st = this.lab.state, g = st.garden, now = Date.now();
    const p = g.plots.find((x) => x.id === id);
    if (!p) return;
    this.plot = id;
    if (!p.crop) {
      if (!this.seed) { audio.play('click'); this.refresh(); return; }
      const r = st.sow(id, this.seed, now);
      if (!r.ok) { toast('Garden', r.reason || 'It will not grow there.', 'seedling'); this.refresh(); return; }
      audio.play('dig');
      if (!g.seeds[this.seed]) this.seed = null;
    } else {
      const s = st.gardenView(now).find((x) => x.id === id).state;
      if (s && s.stage === 'mature') {
        const r = st.harvestGarden(id, now);
        if (!r.ok) { toast('Garden', r.reason || 'It cannot be harvested yet.', 'seedling'); this.refresh(); return; }
        audio.play('snip');
        const m = st.lookup(/** @type {string} */ (r.material));
        toast('Harvest', `+${r.amount} ml ${m ? m.name : ''}${r.seed ? ' — and a seed fell from it' : ''}.`, 'seedling');
        this.lab.refreshHud && this.lab.refreshHud(true);
        if (this.lab.buildShelf) this.lab.buildShelf();
      } else if (st.waterGarden(id, now)) audio.play('pour');
      else audio.play('click');
    }
    this.lab.save();
    this.refresh();
  }

  refresh() {
    if (!this.plotsEl) return;
    const st = this.lab.state, g = st.garden, now = Date.now();
    g.seen = true;
    const view = st.gardenView(now);
    // ---- status and actions
    const growing = view.filter((p) => p.crop).length, ready = view.filter((p) => p.state && p.state.stage === 'mature').length, thirsty = view.filter((p) => p.state && p.state.thirsty).length;
    const stat = (/** @type {keyof STAT_ART} */ k, title, n, cls = '') => h('span', { class: 'gstat' + cls, title }, h('img', { src: STAT_ART[k], alt: '', draggable: 'false' }), h('span', { text: String(n) }));
    clear(this.status).append(stat('plots', 'Plots', g.plots.length), stat('growing', 'Growing', growing), stat('ready', 'Ready to harvest', ready),
      thirsty ? stat('thirsty', 'Thirsty', thirsty, ' warn') : '');
    // (a null child would be appended as the text "null")
    const hint = this.seed ? h('div', { class: 'muted small garden-hint', text: `Sowing ${this.seedName(this.seed)}: tap an empty ${BEDS[bedOf(this.seed.replace(/\+arcane$/, ''))].name.toLowerCase()}.` }) : h('div', { class: 'muted small garden-hint', text: 'Choose a seed, then tap an empty plot to sow it.' });
    clear(this.actsEl).append(...[
      btn('Water all', () => { const n = st.waterGarden(null, Date.now()); audio.play(n ? 'pour' : 'click'); if (n) this.lab.save(); this.refresh(); }, { cls: 'small', icon: 'drop', act: 'garden-water', disabled: !thirsty && !view.some((p) => p.state && p.state.g < 1 && p.state.w < 0.9) }),
      ready ? btn(`Harvest ${ready}`, () => { for (const p of view.filter((q) => q.state && q.state.stage === 'mature')) this.act(p.id); }, { cls: 'small gold', icon: 'seedling', act: 'garden-harvest' }) : null,
    ].filter(Boolean));
    if (this.hintEl) this.hintEl.replaceWith(hint); else this.status.parentElement.after(hint);
    this.hintEl = hint;
    // ---- plots
    const plots = clear(this.plotsEl);
    for (const p of view) {
      const sp = p.crop ? SPECIES_BY_KEY[p.crop.species] : null;
      const stageIx = p.state ? p.state.stageIx : -1;
      const asset = sp && p.crop ? stageAsset(sp.key, p.crop.arcane, stageIx) : null;
      const cv = this.spriteCanvas(asset, 36);
      const what = !p.crop ? `Empty ${BEDS[p.bed].name.toLowerCase()}` : `${p.crop.arcane ? 'Arcane ' : ''}${sp ? sp.name : p.crop.species}`;
      const state = !p.crop ? '' : p.state.stage === 'mature' ? `ready · ${cropYield(p.crop.species)} ml` : `${p.state.stage} · ${formatWait(p.state.readyIn)}${p.state.thirsty ? ' · thirsty' : ''}`;
      const el = h('button', { class: `plot g${p.grade}${this.plot === p.id ? ' selected' : ''}${p.crop && p.state.stage === 'mature' ? ' ripe' : ''}`, 'data-bed': p.bed, 'data-act': 'plot-' + p.id, role: 'option', 'aria-label': `${what}${state ? ': ' + state : ''}`, title: `${BEDS[p.bed].name} · ${GRADES[p.grade]}` },
        h('span', { class: 'plot-thumb', 'data-bed': p.bed }, p.crop ? cv : null),
        h('span', { class: 'plot-text' }, h('span', { class: 'pname', text: what }), state ? h('span', { class: 'pstate', text: state }) : null,
          p.crop && p.state.g < 1 ? h('img', { class: 'moist', src: MOIST_ART[moistCells(p.state.w)], alt: '', title: `Soil moisture ${Math.round(p.state.w * 100)} %`, draggable: 'false' }) : null));
      el.addEventListener('click', () => this.act(p.id));
      plots.appendChild(el);
    }
    // ---- seeds
    const seeds = clear(this.seedsEl);
    const all = seedList(g);
    const FILTERS = [['all', 'All seeds', 'grid'], ['soil', 'Herbs, flowers and fruit', 'leaf'], ['fungal', 'Mushrooms and mosses', 'mushroom'], ['crystal', 'Crystals and stones', 'crystal'], ['arcane', 'Arcane seeds', 'star']];
    if (!this.seedFilter) this.seedFilter = 'all';
    clear(this.seedBar).append(h('div', { class: 'seed-chip' }, icon('seedling', 'sm'), h('span', { text: 'Seeds' })),
      h('div', { class: 'seed-filters', role: 'tablist' }, ...FILTERS.map(([k, label, spr]) => {
        const b = h('button', { class: 'seed-filter' + (this.seedFilter === k ? ' active' : ''), 'data-act': 'seed-filter-' + k, 'data-sprite': spr, title: label, 'aria-label': label, role: 'tab', 'aria-selected': String(this.seedFilter === k) });
        b.addEventListener('click', () => { this.seedFilter = k; audio.play('click'); this.refresh(); });
        return b;
      })));
    const f = this.seedFilter;
    const list = all.filter((x) => f === 'all' || (f === 'arcane' ? x.arcane : bedOf(x.key) === f));
    if (!list.length) seeds.appendChild(h('div', { class: 'muted small', text: all.length ? 'None of these.' : 'No seeds yet.' }));
    const sel = this.plot ? g.plots.find((x) => x.id === this.plot) : null;
    for (const s of list) {
      const fits = !sel || (!sel.crop && sel.bed === bedOf(s.key) && sel.grade >= gradeNeeded(s.key, s.arcane));
      const el = h('button', { class: 'seed' + (this.seed === s.id ? ' selected' : ''), 'data-act': 'seed-' + s.id, role: 'option', title: `${this.seedName(s.id)} ×${s.n} — needs a ${BEDS[bedOf(s.key)].name.toLowerCase()}${gradeNeeded(s.key, s.arcane) ? ` of ${GRADES[gradeNeeded(s.key, s.arcane)].toLowerCase()} grade` : ''}; about ${growText(growHours(s.key, s.arcane) / (g.pace > 1 ? g.pace : 1))} to grow (watered)`, disabled: !fits },
        this.spriteCanvas(seedAsset(s.key, s.arcane), 28), h('span', { class: 'sn', text: `${Number.isFinite(s.n) ? s.n + '× ' : ''}${s.species.name}` }), rarityTag(/** @type {any} */ ({ wild: { rarity: s.species.rarity, arcane: s.arcane } }), { short: true }));
      el.addEventListener('click', () => {
        this.seed = this.seed === s.id ? null : s.id;
        audio.play('click');
        // a plot already chosen and empty: sow at once
        if (this.seed && sel && !sel.crop) { this.act(sel.id); return; }
        this.refresh();
      });
      seeds.appendChild(el);
    }
    // ---- upgrades
    const ups = clear(this.upsEl);
    // the Free Experiment's garden has every bed at the highest grade and the copper can already
    if (this.lab.sandbox) ups.appendChild(h('div', { class: 'small', text: `Arcane chambers, endless seeds, ×${g.pace || 1} growth.` }));
    else for (const u of GARDEN_UPGRADES) {
      const maxed = u.max !== undefined && boughtCount(g, u.id) >= u.max;
      ups.appendChild(h('div', { class: 'card' },
        h('div', { class: 'title', text: `${u.name}${u.max !== undefined ? ` (${boughtCount(g, u.id)}/${u.max})` : ''}` }), h('div', { class: 'small', text: u.desc }),
        btn(maxed ? 'Owned' : `${u.price} coins`, () => {
          const r = st.buyGardenUpgrade(u.id);
          if (!r.ok) { toast(u.name, r.reason || 'Not now.', 'lock'); return; }
          audio.play('coin'); this.lab.save(); this.lab.refreshHud && this.lab.refreshHud(true); this.refresh();
        }, { cls: 'small', icon: st.rank < u.rank ? 'lock' : 'coin', disabled: maxed || st.rank < u.rank || st.coins < u.price, act: 'garden-up-' + u.id })));
    }
    this.paint();
  }

  /** @param {string} id seed id */
  seedName(id) {
    const arcane = id.endsWith('+arcane'), sp = SPECIES_BY_KEY[arcane ? id.slice(0, -7) : id];
    return `${arcane ? 'Arcane ' : ''}${sp ? sp.name : id} seed`;
  }

  /** A canvas with an atlas sprite, bottom-centred in a square (blank while its atlas loads). @param {string|null} asset @param {number} size */
  spriteCanvas(asset, size) {
    const f = atlasFrame(asset);
    const S = f ? Math.max(f.pix.w, f.pix.h, 16) + 2 : 16;
    const cv = /** @type {HTMLCanvasElement} */ (h('canvas', { width: String(S), height: String(S), style: { width: size + 'px', height: size + 'px' } }));
    if (f) /** @type {CanvasRenderingContext2D} */ (cv.getContext('2d')).drawImage(f.pix.toCanvas(), Math.round((S - f.pix.w) / 2), S - 1 - f.pix.h);
    return cv;
  }

  /** Paint the garden: the ground (once), then each plot's bed, crop and markers. */
  paint() {
    const cv = this.canvas;
    if (!cv) return;
    const lay = this.layout();
    if (cv.width !== lay.w || cv.height !== lay.h) { cv.width = lay.w; cv.height = lay.h; this.bg = null; }
    const ctx = /** @type {CanvasRenderingContext2D} */ (cv.getContext('2d'));
    ctx.imageSmoothingEnabled = false;
    if (!this.bg || this.bgKey !== `${lay.w}x${lay.h}`) { this.bg = this.paintGround(lay); this.bgKey = `${lay.w}x${lay.h}`; }
    ctx.drawImage(this.bg, 0, 0);
    const st = this.lab.state, view = st.gardenView(Date.now());
    const sel = this.seed;
    for (const q of lay.cells) this.paintPlot(ctx, q, view.find((x) => x.id === q.p.id), sel);
  }

  /**
   * The ground behind the plots, painted once per size: sky, the far
   * treeline, the fence, the lawn with its flowers, the water barrel and
   * pump, and a shadow under every bed.
   * @param {{w:number, h:number, cells:{x:number, y:number, w:number, h:number}[]}} lay
   */
  paintGround(lay) {
    const W = lay.w, H = lay.h;
    const c = /** @type {HTMLCanvasElement} */ (document.createElement('canvas'));
    c.width = W; c.height = H;
    const g = /** @type {CanvasRenderingContext2D} */ (c.getContext('2d'));
    g.imageSmoothingEnabled = false;
    const rng = new Rng(hashString('garden:' + this.lab.state.seed));
    /** @param {string} src @param {number} x @param {number} y (bottom-centre anchor when anchor is set) @param {number} [s] @param {boolean} [anchor] @param {boolean} [flip] */
    const put = (src, x, y, s = 1, anchor = true, flip = false) => {
      const im = art(src);
      if (!im) return;
      const w = Math.round(im.naturalWidth * s), h = Math.round(im.naturalHeight * s);
      const dx = anchor ? Math.round(x - w / 2) : x, dy = anchor ? Math.round(y - h) : y;
      if (!flip) { g.drawImage(im, dx, dy, w, h); return; }
      g.save(); g.translate(dx + w, dy); g.scale(-1, 1); g.drawImage(im, 0, 0, w, h); g.restore();
    };
    // the sky (a fallback colour first, in case the sheet is still loading)
    g.fillStyle = '#7cc0ec'; g.fillRect(0, 0, W, 140);
    const sky = art(ART.sky);
    if (sky) { const s = W / sky.naturalWidth; g.drawImage(sky, 0, 0, W, Math.round(sky.naturalHeight * s)); const sh = Math.round(sky.naturalHeight * s); if (sh < 140) g.drawImage(sky, 0, sky.naturalHeight - 2, sky.naturalWidth, 2, 0, sh, W, 140 - sh); }
    // the far treeline, across the whole width
    const tl = art(ART.treeline);
    if (tl) { const s = Math.max(1, W / tl.naturalWidth); g.drawImage(tl, 0, 150 - Math.round(tl.naturalHeight * s), Math.round(tl.naturalWidth * s), Math.round(tl.naturalHeight * s)); }
    // the lawn: grass tiles, a few with flowers or tufts
    g.fillStyle = '#5c9a34'; g.fillRect(0, 140, W, H - 140);
    const tiles = [ART.grass, ART.grass, ART.grass, ART.grass, ART.grassTufts, ART.grassFlower, ART.grassFlowers];
    const t0 = art(ART.grass);
    if (t0) {
      // the tiles' shaded rims would draw a grid: lay only their middles, some mirrored
      const I = 9, tw = t0.naturalWidth - 2 * I, th = t0.naturalHeight - 2 * I;
      for (let y = 140; y < H; y += th) for (let x = 0; x < W; x += tw) {
        const im = art(rng.pick(tiles)) || t0, fx = rng.chance(0.5), fy = rng.chance(0.3);
        g.save(); g.translate(x + (fx ? tw : 0), y + (fy ? th : 0)); g.scale(fx ? -1 : 1, fy ? -1 : 1);
        g.drawImage(im, I, I, tw, th, 0, 0, tw, th);
        g.restore();
      }
    }
    // the fence along the back, with vines here and there
    const fe = art(ART.fence), fv = art(ART.fenceVine);
    if (fe) for (let x = -8, i = 0; x < W; x += fe.naturalWidth - 6, i++) g.drawImage(fv && i % 3 === 1 ? fv : fe, x, 178 - fe.naturalHeight);
    // bushes at the fence's ends, the barrel and the pump by the water
    put(ART.bushPink, 30, 194, 0.9);
    put(ART.fern, 80, 192, 0.7);
    put(ART.bushWhite, W - 150, 190, 0.8);
    put(ART.pump, W - 96, 196, 0.85);
    put(ART.barrel, W - 40, 198, 0.9);
    // flowers and tufts on the lawn, clear of the beds
    const deco = [ART.tuft, ART.tuft2, ART.flowersPink, ART.flowersWhite, ART.flowersYellow, ART.lavender, ART.clover, ART.pebble, ART.tuft];
    const free = (x, y) => lay.cells.every((q) => x < q.x - 26 || x > q.x + q.w + 26 || y < q.y - 4 || y > q.y + q.h + 34);
    for (let i = 0, placed = 0; i < 400 && placed < Math.round(W * H / 14000); i++) {
      const x = rng.int(14, W - 14), y = rng.int(214, H - 4);
      if (!free(x, y)) continue;
      put(rng.pick(deco), x, y, 0.75, true, rng.chance(0.5));
      placed++;
    }
    // a soft shadow under every bed
    const sh = art(ART.shadow);
    if (sh) for (const q of lay.cells) { g.globalAlpha = 0.7; g.drawImage(sh, q.x - 4, q.y + q.h - 14, q.w + 8, 26); g.globalAlpha = 1; }
    return c;
  }

  /**
   * One plot: its bed in its state (dry, watered, its grade's frame), its
   * crop at its stage, and its markers (chosen, ripe, thirsty, sowable).
   * @param {CanvasRenderingContext2D} g @param {{p:any, x:number, y:number, w:number, h:number}} q @param {any} pv @param {string|null} seed the seed in hand
   */
  paintPlot(g, q, pv, seed) {
    const now = Date.now();
    const bed = art((BED_ART[/** @type {'soil'} */ (q.p.bed)] || BED_ART.soil)[bedColumn(q.p, pv)]);
    if (bed) g.drawImage(bed, q.x + Math.round((q.w - bed.naturalWidth) / 2), q.y + Math.round((q.h - bed.naturalHeight) / 2));
    const ripe = pv && pv.crop && pv.state.stage === 'mature';
    // the markers' frame around the bed
    const mark = (src) => { const m = art(src); if (m) g.drawImage(m, q.x - 10, q.y - 12, q.w + 20, q.h + 22); };
    if (this.plot === q.p.id) mark(ART.markSelect);
    else if (ripe) mark(ART.markRipe);
    // the crop, standing on the bed's soil
    if (pv && pv.crop) {
      const f = atlasFrame(stageAsset(pv.crop.species, pv.crop.arcane, pv.state.stageIx));
      if (f) {
        const base = q.y + Math.round(q.h * 0.74), k = Math.max(1, Math.min(CROP_SCALE, Math.floor((q.w + 12) / f.pix.w)));
        g.drawImage(f.pix.toCanvas(), Math.round(q.x + q.w / 2 - f.ax * k), Math.round(base - f.ay * k), f.pix.w * k, f.pix.h * k);
      }
      if (ripe) {
        const sp = art(ART.sparkle);
        if (sp && Math.sin(now / 300 + q.x) > 0.2) g.drawImage(sp, q.x + q.w - 30, q.y - 22, 26, 30);
      }
      if (pv.state.thirsty) { const d = art(ART.drop); if (d) g.drawImage(d, q.x + q.w - 22, q.y - 8 + Math.round(Math.sin(now / 250) * 2), 22, 28); }
    } else if (seed && q.p.bed === bedOf(seed.replace(/\+arcane$/, '')) && q.p.grade >= gradeNeeded(seed.replace(/\+arcane$/, ''), seed.endsWith('+arcane'))) {
      // the seed in hand would grow here
      const pl = art(ART.plus);
      if (pl) g.drawImage(pl, q.x + Math.round(q.w / 2 - 18), q.y + Math.round(q.h / 2 - 18) + Math.round(Math.sin(now / 300) * 2), 36, 36);
    }
  }

  /** Called every frame while the garden is shown: a gentle redraw (growth, sparkles) about twice a second. @param {number} dt */
  frame(dt) {
    this.redrawIn -= dt;
    if (this.redrawIn > 0) return;
    this.redrawIn = 0.5;
    this.paint();
    this.t += 0.5;
    // the plot cards follow the growth now and then
    if (this.t % 5 < 0.5) this.refresh();
  }
}

export { materialIdOf, RARITY, seedId, icon };
