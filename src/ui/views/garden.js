// The personal garden: a painted plot of ground behind the shop, its beds,
// the seeds in hand and the upgrades.
//
// Tap a plot to select it. With a seed chosen, an empty plot is sown at
// once; a growing crop is watered with a tap (one tap per plot, or "Water
// all"); a mature one is harvested. No confirmation dialogs: everything a
// tap does is shown on the plot it is about to do it to.
//
// Crops are drawn from the ingredient atlases' growth stages (seed in its
// bed, sprout, young, developing, mature), the same sprites the species
// has in the wilds and on the shelf; the garden's ground is painted
// procedurally in the wilds' pixel style.

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

/** The garden scene (art pixels: twice the wilds' scene pixel, the atlas sprites' native size). */
const GW = 384, GH = 176;

/** Plot colours by bed kind: rim stones, soil dry → wet, and the bed's own detail. */
const BED_LOOK = {
  soil: { rim: ['#6a6460', '#8a847c', '#4a4440'], dry: [0.42, 0.29, 0.18], wet: [0.2, 0.13, 0.08], speck: '#8a6a44' },
  fungal: { rim: ['#5a3a22', '#7a5232', '#3a2416'], dry: [0.24, 0.2, 0.17], wet: [0.12, 0.1, 0.09], speck: '#d8c8a8' },
  crystal: { rim: ['#5a5a66', '#8a8a96', '#3a3a44'], dry: [0.5, 0.5, 0.55], wet: [0.34, 0.34, 0.4], speck: '#c8c8d8' },
  tide: { rim: ['#b09a6a', '#e0cc96', '#7a6a4a'], dry: [0.25, 0.48, 0.62], wet: [0.14, 0.32, 0.5], speck: '#d8f0ff' },
};

/** A growing time, in hours or minutes. @param {number} hours */
const growText = (hours) => hours >= 1 ? `${Math.round(hours * 10) / 10} h` : `${Math.max(1, Math.round(hours * 60))} min`;

const hex = (rgb) => '#' + rgb.map((v) => Math.round(Math.max(0, Math.min(1, v)) * 255).toString(16).padStart(2, '0')).join('');
const mixc = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);

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
  }

  build() {
    const el = clear(this.el);
    this.hintEl = null;
    this.canvas = /** @type {HTMLCanvasElement} */ (h('canvas', { width: String(GW), height: String(GH), class: 'garden-scene', 'aria-label': 'Your garden: tap a plot' }));
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

  /** Where the plots lie in the scene (up to six per row, two rows). */
  layout() {
    const plots = this.lab.state.garden.plots, n = plots.length, per = Math.min(6, Math.max(3, Math.ceil(n / 2))), pw = Math.floor((GW - 24) / per);
    return plots.map((p, i) => {
      const row = Math.floor(i / per), col = i % per;
      return { p, x: 12 + col * pw + 4, y: row === 0 ? 150 : 110, w: pw - 8, h: 18 };
    });
  }

  /** @param {PointerEvent} e */
  tapScene(e) {
    const r = this.canvas.getBoundingClientRect(), x = ((e.clientX - r.left) / r.width) * GW, y = ((e.clientY - r.top) / r.height) * GH;
    const hit = this.layout().find((q) => x >= q.x - 2 && x <= q.x + q.w + 2 && y >= q.y - 44 && y <= q.y + q.h);
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
    clear(this.status).append(
      h('span', { class: 'gstat', title: 'Plots' }, icon('grid', 'sm'), ` ${g.plots.length}`),
      h('span', { class: 'gstat', title: 'Growing' }, icon('seedling', 'sm'), ` ${growing}`),
      h('span', { class: 'gstat', title: 'Ready to harvest' }, icon('check', 'sm'), ` ${ready}`),
      thirsty ? h('span', { class: 'gstat warn', title: 'Thirsty' }, icon('drop', 'sm'), ` ${thirsty}`) : '');
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
      const cv = this.spriteCanvas(asset, 64);
      const what = !p.crop ? `Empty ${BEDS[p.bed].name.toLowerCase()}` : `${p.crop.arcane ? 'Arcane ' : ''}${sp ? sp.name : p.crop.species}`;
      const state = !p.crop ? '' : p.state.stage === 'mature' ? `ready · ${cropYield(p.crop.species)} ml` : `${p.state.stage} · ${formatWait(p.state.readyIn)}${p.state.thirsty ? ' · thirsty' : ''}`;
      const el = h('button', { class: `plot g${p.grade}${this.plot === p.id ? ' selected' : ''}${p.crop && p.state.stage === 'mature' ? ' ripe' : ''}`, 'data-bed': p.bed, 'data-act': 'plot-' + p.id, role: 'option', 'aria-label': `${what}${state ? ': ' + state : ''}`, title: `${BEDS[p.bed].name} · ${GRADES[p.grade]}` },
        h('span', { class: 'plot-thumb', 'data-bed': p.bed }, p.crop ? cv : null),
        h('span', { class: 'plot-text' }, h('span', { class: 'pname', text: what }), state ? h('span', { class: 'pstate', text: state }) : null),
        p.crop && p.state.g < 1 ? h('span', { class: 'moist', title: 'Soil moisture' }, h('i', { style: { width: Math.round(p.state.w * 100) + '%' } })) : null);
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

  /** Paint the garden: sky, hedge, fence, the plots with their crops, the well and the can. */
  paint() {
    const cv = this.canvas;
    if (!cv) return;
    const ctx = /** @type {CanvasRenderingContext2D} */ (cv.getContext('2d'));
    ctx.imageSmoothingEnabled = false;
    if (!this.bg) this.bg = this.paintGround();
    ctx.drawImage(this.bg, 0, 0);
    const st = this.lab.state, view = st.gardenView(Date.now()), lay = this.layout();
    for (const q of lay) {
      const pv = view.find((x) => x.id === q.p.id);
      this.paintPlot(ctx, q, pv);
    }
  }

  /** The ground behind the plots, painted once. */
  paintGround() {
    const c = /** @type {HTMLCanvasElement} */ (document.createElement('canvas'));
    c.width = GW; c.height = GH;
    const g = /** @type {CanvasRenderingContext2D} */ (c.getContext('2d'));
    const rng = new Rng(hashString('garden:' + this.lab.state.seed));
    // sky: a warm morning in flat bands
    const sky = ['#9ad0e8', '#a8d8e8', '#b8e0e4', '#c8e4dc', '#d8e8d0'];
    sky.forEach((col, i) => { g.fillStyle = col; g.fillRect(0, i * 12, GW, 12); });
    // the far treeline: clumps of dark and mid green, lit from the upper left
    for (let x = -10; x < GW + 10; x += rng.int(10, 18)) {
      const r = rng.int(10, 18), cy = 64 - rng.int(0, 12);
      for (let y = -r; y <= r; y++) for (let dx = -r; dx <= r; dx++) {
        if (dx * dx + y * y > r * r) continue;
        g.fillStyle = dx + y < -r * 0.4 ? '#4a8a4a' : dx + y > r * 0.5 ? '#1e4a2a' : '#2e6a3a';
        g.fillRect(x + dx, cy + y, 1, 1);
      }
    }
    g.fillStyle = '#2e6a3a'; g.fillRect(0, 64, GW, 18);
    // the lawn, with darker tufts and a few flowers
    for (let y = 80; y < GH; y++) { g.fillStyle = y < 84 ? '#5aa04a' : (y & 1) ? '#4a8a3c' : '#4e9040'; g.fillRect(0, y, GW, 1); }
    for (let i = 0; i < 260; i++) { const x = rng.int(0, GW - 1), y = rng.int(84, GH - 1); g.fillStyle = rng.chance(0.5) ? '#3a7030' : '#6ab45a'; g.fillRect(x, y, 1, 2); }
    for (let i = 0; i < 18; i++) { const x = rng.int(0, GW - 1), y = rng.int(86, GH - 4); g.fillStyle = rng.pick(['#f0e0f0', '#ffe070', '#f08aa8']); g.fillRect(x, y, 1, 1); }
    // the wooden fence along the back
    g.fillStyle = '#5a3a22'; g.fillRect(0, 72, GW, 2); g.fillRect(0, 79, GW, 2);
    g.fillStyle = '#8a5a32'; g.fillRect(0, 72, GW, 1); g.fillRect(0, 79, GW, 1);
    for (let x = 4; x < GW; x += 16) { g.fillStyle = '#3a2416'; g.fillRect(x, 66, 4, 20); g.fillStyle = '#7a5232'; g.fillRect(x + 1, 66, 2, 19); g.fillStyle = '#a8784a'; g.fillRect(x + 1, 66, 1, 1); }
    // a water barrel and a watering can by the fence
    g.fillStyle = '#3a2416'; g.fillRect(GW - 30, 70, 18, 22); g.fillStyle = '#7a5232'; g.fillRect(GW - 29, 71, 16, 20);
    g.fillStyle = '#4a4440'; g.fillRect(GW - 30, 75, 18, 2); g.fillRect(GW - 30, 86, 18, 2); g.fillStyle = '#5ab0f0'; g.fillRect(GW - 28, 71, 12, 2);
    g.fillStyle = '#5a6a7a'; g.fillRect(GW - 46, 84, 10, 7); g.fillStyle = '#8a9aaa'; g.fillRect(GW - 46, 84, 10, 1); g.fillRect(GW - 52, 82, 6, 1); g.fillRect(GW - 36, 85, 3, 1);
    return c;
  }

  /**
   * One plot: its stone (or wood, gravel, sand) rim, its bed darkening as
   * it is watered, its grade (a greenhouse frame, an Arcane chamber's
   * runes), and its crop at its stage.
   * @param {CanvasRenderingContext2D} g @param {{p:any, x:number, y:number, w:number, h:number}} q @param {any} pv
   */
  paintPlot(g, q, pv) {
    const L = BED_LOOK[/** @type {'soil'} */ (q.p.bed)] || BED_LOOK.soil;
    const w = pv && pv.state ? pv.state.w : 0.25, wet = Math.max(0, Math.min(1, (w - 0.25) / 0.6));
    const rng = new Rng(hashString('plot:' + q.p.id));
    // the rim: a ring of small stones (or boards), lit from the upper left
    for (let x = q.x - 2; x < q.x + q.w + 2; x += 3) for (const y of [q.y - 2, q.y + q.h]) {
      g.fillStyle = L.rim[2]; g.fillRect(x, y, 3, 2); g.fillStyle = L.rim[rng.int(0, 1)]; g.fillRect(x, y, 2, 1);
    }
    for (let y = q.y; y < q.y + q.h; y += 3) for (const x of [q.x - 2, q.x + q.w]) {
      g.fillStyle = L.rim[2]; g.fillRect(x, y, 2, 3); g.fillStyle = L.rim[0]; g.fillRect(x, y, 1, 2);
    }
    // the bed itself: its colour between dry and wet, speckled
    g.fillStyle = hex(mixc(L.dry, L.wet, wet)); g.fillRect(q.x, q.y, q.w, q.h);
    for (let i = 0; i < q.w * q.h * 0.06; i++) { g.fillStyle = L.speck; g.fillRect(q.x + rng.int(0, q.w - 1), q.y + rng.int(0, q.h - 1), 1, 1); }
    for (let x = q.x; x < q.x + q.w; x += 4) { g.fillStyle = hex(mixc(L.dry, [0, 0, 0], 0.25 + wet * 0.2)); g.fillRect(x, q.y + 4 + ((x >> 2) & 1) * 6, 3, 1); }
    // its grade: a greenhouse's glass panes, an Arcane chamber's violet runes
    if (q.p.grade >= 1) {
      g.fillStyle = 'rgba(210,240,255,0.18)'; g.fillRect(q.x - 2, q.y - 46, q.w + 4, 44);
      g.fillStyle = '#8a9aa8'; for (const x of [q.x - 2, q.x + q.w + 1, q.x + (q.w >> 1)]) g.fillRect(x, q.y - 46, 1, 46);
      g.fillRect(q.x - 2, q.y - 46, q.w + 4, 1); g.fillRect(q.x - 2, q.y - 24, q.w + 4, 1);
    }
    if (q.p.grade >= 2) {
      const t = Date.now() / 600;
      for (let i = 0; i < 4; i++) { g.fillStyle = Math.sin(t + i) > 0 ? '#c8a4ff' : '#8e5cf0'; g.fillRect(q.x + 3 + i * Math.floor((q.w - 6) / 3), q.y + q.h + 3, 2, 1); }
    }
    if (this.plot === q.p.id) { g.fillStyle = '#ffe070'; g.fillRect(q.x - 3, q.y + q.h + 3, q.w + 6, 1); }
    // the crop
    if (!pv || !pv.crop) return;
    const f = atlasFrame(stageAsset(pv.crop.species, pv.crop.arcane, pv.state.stageIx));
    if (!f) return;
    g.drawImage(f.pix.toCanvas(), Math.round(q.x + q.w / 2 - f.ax), Math.round(q.y + q.h * 0.75 - f.ay));
    if (pv.state.stage === 'mature' && Math.sin(Date.now() / 300 + q.x) > 0.6) { g.fillStyle = '#fff6c0'; g.fillRect(Math.round(q.x + q.w / 2 + 6), q.y - 18, 1, 1); }
    if (pv.state.thirsty) { g.fillStyle = '#1a2a48'; g.fillRect(q.x + q.w - 6, q.y - 10, 4, 5); g.fillStyle = '#6ab8f0'; g.fillRect(q.x + q.w - 5, q.y - 9, 2, 3); }
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
