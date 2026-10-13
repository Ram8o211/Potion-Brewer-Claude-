// The alchemy laboratory screen — the heart of the game.
// Owns the live simulation, renderer and input, records the brew log,
// runs bottling and the customer flow, and wires up every HUD control.

import { Simulation } from '../simulation/world.js';
import { PHASE, SIM } from '../simulation/constants.js';
import { snapshotSim, applySnapshot } from '../simulation/snapshot.js';
import { clampToInterior } from '../simulation/tools.js';
import { MAX_SPECIES } from '../reactions/species.js';
import { compatFactor } from '../reactions/compatibility.js';
import { Renderer } from '../rendering/renderer.js';
import { drawPortrait } from '../rendering/portraits.js';
import { drawJar } from '../rendering/art.js';
import { measureParticles, tapSelection, probeSelection, viscosityClass } from '../game/measure.js';
import { evaluatePotion, scoreRequirement, PROPERTY_LABELS, describeValue } from '../game/evaluate.js';
import { processEvent } from '../game/journal.js';
import { saveGame, saveJSON, KEYS } from '../game/persistence.js';
import { AutoBrewer } from '../game/autobrew.js';
import { RANKS } from '../game/equipment.js';
import { describeColor, rgbToHex } from '../core/color.js';
import { h, btn, clear, toast, coins, confirmDialog } from './dom.js';
import { icon, iconUrl } from './icons.js';
import { audio } from '../audio/audio.js';
import * as panels from './panels.js';
import { Tutorial } from './tutorial.js';

const REQ_ICON = { color: 'palette', density: 'weight', viscosity: 'drop', temperature: 'thermo', vitality: 'heart', ardor: 'flame', arcana: 'eye', fortitude: 'shield', stability: 'scales', volatility: 'bubbles', quantity: 'flask' };
const TOOL_DEFS = [
  { id: 'pour', label: 'Pour', icon: 'pour', key: '1' },
  { id: 'spoon', label: 'Spoon', icon: 'spoon', key: '2' },
  { id: 'pestle', label: 'Pestle', icon: 'pestle', key: '3', needs: 'pestle' },
  { id: 'skimmer', label: 'Skimmer', icon: 'ladle', key: '4', needs: 'skimmer' },
  { id: 'probe', label: 'Inspect', icon: 'lens', key: '5' },
];

export class LabScreen {
  /**
   * @param {import('./app.js').App} app
   * @param {import('../game/state.js').GameState} state
   * @param {{sandbox?: boolean}} [opts]
   */
  constructor(app, state, opts = {}) {
    this.app = app;
    this.state = state;
    this.sandbox = !!opts.sandbox;
    this.tool = 'spoon';
    this.selected = null;
    this.speed = 1;
    this.pointer = { down: false, x: 0, y: 0, id: -1, wx: 0, wy: 0 };
    this.pourX = 0.3;
    this.lastPoured = {};
    this.bottling = null;
    this.probe = null;
    this.thermal = false;
    this.autoStir = false;
    this.alembicOpen = false;
    this.autoBrewer = null;
    this.time = 0;
    this.hudTimer = 0;
    this.assayTimer = 0;
    this.saveTimer = 0;
    this.layerTimer = 0;
    this.assay = null;
    this.running = false;
    this.fpsAcc = { t: 0, n: 0, fps: 0 };
    this.stirLevel = 0;
    this.lastBoil = 0;
    this._raf = 0;
    this.pendingCustomer = 0;
  }

  // ------------------------------------------------------------------ setup
  mount(root) {
    this.root = root;
    const st = this.state;
    const cap = st.cap;
    this.cap = cap;
    this.sim = new Simulation({ size: /** @type {any} */ (cap.size), lookup: st.lookup, reactions: st.world.reactions });
    this._applyFurnaceCaps();
    if (st.cauldron) {
      try {
        applySnapshot(this.sim, st.cauldron, { lookup: st.lookup });
      } catch (e) {
        console.warn('Could not restore cauldron', e);
      }
    }
    this.buildDom();
    this.renderer = new Renderer(this.canvas);
    this.renderer.quality = this.app.settings.quality;
    this.onResize = () => this.resize();
    window.addEventListener('resize', this.onResize);
    this.resizeObs = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => this.resize()) : null;
    if (this.resizeObs) this.resizeObs.observe(this.stageEl);
    this.resize();
    this.bindInput();
    this.selectTool('spoon');
    if (!this.sandbox) {
      if (!st.current && !st.dayOver) this.bringCustomer(false);
      this.tutorial = new Tutorial(this);
      if (st.tutorial.active && !st.tutorial.done) this.tutorial.start();
    }
    this.refreshHud(true);
    this.running = true;
    this.lastT = performance.now();
    const loop = (t) => {
      if (!this.running) return;
      this._raf = requestAnimationFrame(loop);
      this.frame(t);
    };
    this._raf = requestAnimationFrame(loop);
    this.onVis = () => {
      if (document.hidden) this.save();
    };
    document.addEventListener('visibilitychange', this.onVis);
    this.onUnload = () => this.save();
    window.addEventListener('pagehide', this.onUnload);
    audio.music(this.app.settings.music > 0 && this.app.settings.musicOn);
  }

  unmount() {
    this.save();
    this.running = false;
    cancelAnimationFrame(this._raf);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('keydown', this.onKey);
    document.removeEventListener('visibilitychange', this.onVis);
    window.removeEventListener('pagehide', this.onUnload);
    if (this.resizeObs) this.resizeObs.disconnect();
    if (this.tutorial) this.tutorial.stop();
    audio.update({ fire: 0, stir: 0, pour: 0, boil: 0, cold: 0 }, 0);
    this.el.remove();
  }

  _applyFurnaceCaps() {
    const cap = this.state.cap;
    Object.assign(this.sim.furnace, { maxFlame: cap.maxFlame, heatPower: cap.heatPower, minCool: cap.minCool, coolPower: cap.coolPower });
  }

  /** Re-read capabilities after a purchase (and install a bigger cauldron). */
  refreshCapabilities() {
    const cap = this.state.cap;
    if (cap.size !== this.cap.size) {
      const snap = snapshotSim(this.sim, this.cap.size);
      snap.size = cap.size;
      const sim = new Simulation({ size: /** @type {any} */ (cap.size), lookup: this.state.lookup, reactions: this.state.world.reactions });
      applySnapshot(sim, snap, { lookup: this.state.lookup });
      this.sim = sim;
      toast('New cauldron installed', `Your ${cap.size === 'medium' ? 'Copper Cauldron' : 'Grand Athanor Vessel'} is ready.`, 'cauldron');
    }
    this.cap = cap;
    this._applyFurnaceCaps();
    this.buildTools();
    this.buildShelf();
    this.resize(true);
    this.refreshHud(true);
  }

  // ------------------------------------------------------------------ DOM
  buildDom() {
    const st = this.state;
    this.el = h('div', { class: 'screen lab', 'data-mode': this.sandbox ? 'sandbox' : 'game' });
    // top bar
    this.coinEl = h('span', { class: 'coins-val' });
    this.rankName = h('div', { class: 'rankname' });
    this.rankBar = h('i');
    this.dayEl = h('div', { class: 'day' });
    const nav = h('div', { class: 'nav-buttons' },
      btn('', () => panels.openShop(this), { icon: 'bag', cls: 'icon', title: 'Shop & Guild (S)', act: 'shop' }),
      btn('', () => panels.openRecipes(this), { icon: 'book', cls: 'icon', title: 'Recipe book (R)', act: 'recipes' }),
      btn('', () => panels.openJournal(this), { icon: 'scroll', cls: 'icon', title: 'Journal (J)', act: 'journal' }),
    );
    if (this.sandbox) nav.firstChild.remove();
    this.topbar = h('header', { class: 'topbar frame' },
      btn('', () => panels.openPause(this), { icon: 'menu', cls: 'icon', title: 'Menu (Esc)', act: 'menu' }),
      this.sandbox
        ? h('div', { class: 'stat' }, icon('flask'), h('span', { text: 'Free Experiment' }))
        : h('div', { class: 'stat' }, icon('coin'), this.coinEl),
      this.sandbox ? null : h('div', { class: 'rankrow' }, icon('star', 'rank-ico'), h('div', { class: 'stat rankbox' }, this.rankName, h('div', { class: 'bar' }, this.rankBar))),
      this.sandbox ? null : this.dayEl,
      h('div', { class: 'spacer' }),
      nav,
    );
    // customer panel
    this.custEl = h('section', { class: 'customer parch', 'aria-live': 'polite' });
    if (this.sandbox) this.custEl.classList.add('hidden');
    // stage
    this.canvas = /** @type {HTMLCanvasElement} */ (h('canvas', { class: 'view', 'aria-label': 'Cauldron' }));
    this.readout = h('div', { class: 'readout parch hidden' });
    this.chips = h('div', { class: 'hud-chips' });
    this.pourHint = h('div', { class: 'pour-hint chip hidden' });
    this.stageEl = h('main', { class: 'stage' }, this.canvas, this.readout, this.chips, this.pourHint);
    // controls
    this.furnaceInput = /** @type {HTMLInputElement} */ (h('input', { type: 'range', min: '-100', max: '100', step: '1', value: '0', 'aria-label': 'Fire and frost control' }));
    this.furnaceInput.addEventListener('input', () => {
      const v = Number(this.furnaceInput.value) / 100;
      this.setFurnace(Math.abs(v) < 0.06 ? 0 : v);
    });
    this.furnaceLabel = h('span', { class: 'flabel' });
    this.furnaceIcon = icon('flame');
    this.actions = h('div', { class: 'actions' });
    this.controls = h('section', { class: 'controls frame' },
      h('div', { class: 'furnace' }, this.furnaceIcon, this.furnaceInput, this.furnaceLabel),
      this.actions,
    );
    // toolbar + shelf
    this.toolsEl = h('div', { class: 'tools', role: 'toolbar' });
    this.shelfEl = h('div', { class: 'shelf', role: 'listbox', 'aria-label': 'Ingredient shelf' });
    this.doseEl = h('div', { class: 'dose' });
    this.toolbar = h('nav', { class: 'toolbar frame' }, this.toolsEl);
    this.shelfWrap = h('div', { class: 'shelf-wrap frame' }, h('div', { class: 'shelf-title small muted', text: 'Reagent shelf' }), this.shelfEl);
    this.side = h('div', { class: 'side' }, this.shelfWrap, this.controls);
    this.el.append(this.topbar, this.custEl, this.stageEl, this.side, this.toolbar);
    this.root.appendChild(this.el);
    this.buildTools();
    this.buildShelf();
    this.buildDose();
    this.placeDose();
  }

  /** Dose buttons float over the cauldron on phones, live in the shelf panel on desktop. */
  placeDose() {
    const desktop = window.matchMedia('(min-width: 960px) and (min-aspect-ratio: 1/1)').matches;
    const parent = desktop ? this.shelfWrap : this.stageEl;
    if (this.doseEl.parentElement !== parent) parent.appendChild(this.doseEl);
    this.doseEl.classList.toggle('hidden', !desktop && this.tool !== 'pour');
  }

  buildActions() {
    // The same actions appear in the desktop control panel and in the mobile
    // tool row; each control is created once per container.
    this.actionSets = [];
    for (const container of [this.actions, this.mobileActs].filter(Boolean)) {
      const a = clear(container);
      const set = {};
      set.lid = btn('', () => this.toggleLid(), { icon: 'lid', cls: 'icon', title: 'Lid on/off (L)', act: 'lid' });
      set.stir = btn('', () => {}, { icon: 'gear', cls: 'icon', title: this.state.has('stirrer') ? 'Clockwork stirrer on/off (A)' : 'Hold to stir automatically', act: 'autostir' });
      const startAuto = (e) => { e.preventDefault(); if (this.state.has('stirrer')) this.setAutoStir(!this.autoStir); else this.setAutoStir(true); };
      const stopAuto = () => { if (!this.state.has('stirrer')) this.setAutoStir(false); };
      set.stir.addEventListener('pointerdown', startAuto);
      set.stir.addEventListener('pointerup', stopAuto);
      set.stir.addEventListener('pointerleave', stopAuto);
      set.stir.addEventListener('pointercancel', stopAuto);
      set.speed = btn('1\u00d7', () => this.cycleSpeed(), { icon: 'speed', cls: 'icon', title: 'Time speed (F)', act: 'speed' });
      a.append(set.lid, set.stir, set.speed);
      if (this.state.has('thermal')) {
        set.thermal = btn('', () => this.toggleThermal(), { icon: 'monocle', cls: 'icon', title: 'Heat map (T)', act: 'thermal' });
        a.append(set.thermal);
      }
      if (this.state.has('alembic')) {
        set.alembic = btn('', () => this.toggleAlembic(), { icon: 'alembic', cls: 'icon', title: 'Alembic valve', act: 'alembic' });
        a.append(set.alembic);
      }
      a.append(btn('', () => this.emptyCauldron(), { icon: 'trash', cls: 'icon danger', title: 'Empty the cauldron', act: 'empty' }));
      this.actionSets.push(set);
    }
    this.syncActions();
  }

  /** Reflect toggle states on every copy of the action buttons. */
  syncActions() {
    for (const set of this.actionSets || []) {
      set.lid.classList.toggle('active', !this.sim.cauldron.lidClosed);
      set.lid.title = this.sim.cauldron.lidClosed ? 'Lid closed — tap to open (L)' : 'Lid open — tap to close (L)';
      set.stir.classList.toggle('active', this.autoStir);
      set.speed.classList.toggle('active', this.speed > 1);
      const l = set.speed.querySelector('.lbl');
      if (l) l.textContent = this.speed + '\u00d7';
      if (set.thermal) set.thermal.classList.toggle('active', this.thermal);
      if (set.alembic) set.alembic.classList.toggle('active', this.alembicOpen);
    }
  }

  toggleThermal() {
    this.thermal = !this.thermal;
    this.syncActions();
  }

  buildTools() {
    const t = clear(this.toolsEl);
    this.toolBtns = {};
    for (const d of TOOL_DEFS) {
      if (d.needs && !this.state.has(d.needs)) continue;
      const b = btn(d.label, () => this.selectTool(d.id), { icon: d.icon, title: `${d.label} (${d.key})`, act: 'tool-' + d.id });
      this.toolBtns[d.id] = b;
      t.appendChild(b);
    }
    if (this.sandbox) t.appendChild(btn('Analyse', () => this.analyseAll(), { icon: 'assay', title: 'Analyse the whole brew', act: 'analyse' }));
    t.appendChild(h('div', { class: 'sep' }));
    this.mobileActs = h('div', { class: 'acts' });
    t.appendChild(this.mobileActs);
    if (this.actions) this.buildActions();
    if (this.tool) this.selectTool(this.tool, true);
  }

  buildShelf() {
    const sh = clear(this.shelfEl);
    this.jarEls = {};
    const st = this.state;
    const ids = this.sandbox ? st.world.ingredients : st.world.ingredients.filter((id) => st.lookup(id).tier <= st.rank || st.stock(id) > 0);
    for (const id of ids) {
      const m = st.lookup(id);
      const cv = /** @type {HTMLCanvasElement} */ (h('canvas', { width: '15', height: '20' }));
      const ctx = cv.getContext('2d');
      drawJar(ctx, 1, 0, 13, 20, m.look || m.color, m.form);
      const stock = h('span', { class: 'jstock' });
      const el = h('button', { class: 'jar', title: m.name, 'aria-label': m.name, 'data-id': id, role: 'option' }, stock, cv, h('span', { class: 'jname', text: m.name.split(' ').slice(-1)[0] }));
      let pressTimer = 0;
      el.addEventListener('pointerdown', () => { pressTimer = /** @type {any} */ (setTimeout(() => { pressTimer = -1; panels.openIngredient(this, id); }, 550)); });
      const cancel = () => { if (pressTimer > 0) clearTimeout(pressTimer); };
      el.addEventListener('pointerup', cancel);
      el.addEventListener('pointerleave', cancel);
      el.addEventListener('click', () => {
        if (pressTimer === -1) { pressTimer = 0; return; }
        this.selectIngredient(id);
      });
      el.addEventListener('contextmenu', (e) => { e.preventDefault(); panels.openIngredient(this, id); });
      this.jarEls[id] = { el, stock };
      sh.appendChild(el);
    }
    this.updateShelf();
  }

  buildDose() {
    const d = clear(this.doseEl);
    d.append(h('span', { class: 'muted dose-note', text: 'Dose:' }));
    for (const ml of [25, 50, 100, 250]) {
      d.append(btn(`${ml} ml`, () => this.pourDose(ml), { title: `Pour exactly ${ml} ml`, act: 'dose-' + ml }));
    }
    d.append(h('span', { class: 'muted dose-note', text: 'ml · or hold in the cauldron' }));
  }

  // ------------------------------------------------------------------ layout
  resize(force = false) {
    this.placeDose();
    const r = this.stageEl.getBoundingClientRect();
    if (r.width < 10 || r.height < 10) return;
    const st = this.state;
    const jars = st.world.ingredients.slice(0, 14).map((id) => ({ color: st.lookup(id).look || st.lookup(id).color, form: st.lookup(id).form }));
    if (force) this.renderer._key = '';
    this.renderer.resize(Math.floor(r.width), Math.floor(r.height), this.sim.cauldron, jars, this.app.settings.quality);
  }

  // ------------------------------------------------------------------ input
  bindInput() {
    const cv = this.canvas;
    const pos = (e) => {
      const r = cv.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    };
    cv.addEventListener('pointerdown', (e) => {
      if (this.pointer.down) return;
      audio.unlock();
      cv.setPointerCapture(e.pointerId);
      const [x, y] = pos(e);
      this.pointer = { down: true, x, y, id: e.pointerId, wx: 0, wy: 0 };
      this.pointerWorld();
      this.onPointerStart();
      e.preventDefault();
    });
    cv.addEventListener('pointermove', (e) => {
      const [x, y] = pos(e);
      if (this.pointer.down && e.pointerId !== this.pointer.id) return;
      this.pointer.x = x;
      this.pointer.y = y;
      this.pointerWorld();
      this.hover = !this.pointer.down && e.pointerType === 'mouse';
      if (this.pointer.down) this.onPointerMove();
      else if (this.hover) this.onHover();
    });
    const end = (e) => {
      if (!this.pointer.down || e.pointerId !== this.pointer.id) return;
      this.pointer.down = false;
      this.onPointerEnd();
    };
    cv.addEventListener('pointerup', end);
    cv.addEventListener('pointercancel', end);
    cv.addEventListener('pointerleave', () => { this.hover = false; });
    cv.addEventListener('contextmenu', (e) => e.preventDefault());
    this.onKey = (e) => this.handleKey(e);
    window.addEventListener('keydown', this.onKey);
  }

  pointerWorld() {
    const [wx, wy] = this.renderer.toWorld(this.pointer.x, this.pointer.y);
    this.pointer.wx = wx;
    this.pointer.wy = wy;
  }

  onPointerStart() {
    const { wx, wy } = this.pointer;
    if (this.tool === 'pour') {
      if (!this.selected) { toast('Choose a reagent', 'Tap a jar on the shelf first.', 'jar'); return; }
      this.startPour(wx);
    } else if (this.tool === 'probe') {
      this.probe = { x: wx, y: wy, r: 0.22 };
      this.updateProbe();
    } else {
      this.setAutoStir(false);
      const [x, y] = clampToInterior(this.sim, wx, wy, 0.1);
      this.sim.tool.type = /** @type {any} */ (this.tool);
      this.sim.tool.setTarget(x, y, true);
    }
  }

  onPointerMove() {
    const { wx, wy } = this.pointer;
    if (this.tool === 'pour') {
      this.pourX = this.clampPourX(wx);
      this.sim.emitter.setX(this.pourX);
    } else if (this.tool === 'probe') {
      this.probe = { x: wx, y: wy, r: 0.22 };
    } else {
      const [x, y] = clampToInterior(this.sim, wx, wy, 0.1);
      this.sim.tool.setTarget(x, y, true);
    }
  }

  onHover() {
    if (this.tool === 'spoon' || this.tool === 'pestle' || this.tool === 'skimmer') {
      const [x, y] = clampToInterior(this.sim, this.pointer.wx, this.pointer.wy, 0.1);
      if (!this.sim.tool.active) { this.sim.tool.x = x; this.sim.tool.y = y; this.sim.tool.tx = x; this.sim.tool.ty = y; }
    }
  }

  onPointerEnd() {
    if (this.tool === 'pour') {
      if (this.sim.emitter.pouring && !this.sim.emitter.active.dose) this.sim.emitter.stop();
    } else if (this.tool === 'probe') {
      // keep the last reading visible
    } else {
      const t = this.sim.tool;
      t.setTarget(t.x, t.y, false);
    }
  }

  handleKey(e) {
    if (e.target && /** @type {HTMLElement} */ (e.target).tagName === 'INPUT' && /** @type {any} */ (e.target).type !== 'range') return;
    if (document.querySelector('.overlay')) {
      if (e.key === 'Escape') { const x = /** @type {HTMLElement} */ (document.querySelector('.overlay .modal-head .btn')); if (x) x.click(); }
      return;
    }
    const k = e.key.toLowerCase();
    const def = TOOL_DEFS.find((d) => d.key === k);
    if (def && this.toolBtns[def.id]) { this.selectTool(def.id); return; }
    if (k === 'l') this.toggleLid();
    else if (k === 'f') this.cycleSpeed();
    else if (k === 'b' && !this.sandbox) this.startBottling();
    else if (k === 's' && !this.sandbox) panels.openShop(this);
    else if (k === 'r' && !this.sandbox) panels.openRecipes(this);
    else if (k === 'j' && !this.sandbox) panels.openJournal(this);
    else if (k === 'a') this.setAutoStir(!this.autoStir);
    else if (k === 't' && this.state.has('thermal')) this.toggleThermal();
    else if (k === 'escape') panels.openPause(this);
    else if (k === 'arrowup' || k === 'arrowright') { this.setFurnace(Math.min(1, this.sim.furnace.setting + 0.1)); }
    else if (k === 'arrowdown' || k === 'arrowleft') { this.setFurnace(Math.max(-1, this.sim.furnace.setting - 0.1)); }
    else if (k === '0') this.setFurnace(0);
  }

  // ------------------------------------------------------------------ actions
  selectTool(id, silent = false) {
    this.tool = id;
    for (const [k, b] of Object.entries(this.toolBtns || {})) b.classList.toggle('active', k === id);
    if (id !== 'probe') { this.probe = null; this.readout.classList.add('hidden'); }
    if (id === 'spoon' || id === 'pestle' || id === 'skimmer') this.sim.tool.type = /** @type {any} */ (id);
    if (id !== 'pour' && this.sim.emitter.pouring && !(this.sim.emitter.active && this.sim.emitter.active.dose)) this.sim.emitter.stop();
    this.pourHint.classList.toggle('hidden', id !== 'pour');
    this.updatePourHint();
    if (this.doseEl) this.placeDose();
    if (!silent) audio.play('select');
    if (this.tutorial) this.tutorial.notify('tool', id);
  }

  selectIngredient(id) {
    this.selected = id;
    for (const [k, j] of Object.entries(this.jarEls)) j.el.classList.toggle('selected', k === id);
    this.selectTool('pour', true);
    audio.play('select');
    this.updatePourHint();
    if (this.tutorial) this.tutorial.notify('select', id);
  }

  updatePourHint() {
    if (this.tool !== 'pour') return;
    const m = this.selected ? this.state.lookup(this.selected) : null;
    this.pourHint.textContent = m ? `Hold in the cauldron to pour ${m.name}` : 'Tap a reagent jar on the shelf';
  }

  clampPourX(x) {
    const m = this.sim.cauldron.mouth - 0.15;
    return Math.max(-m, Math.min(m, x));
  }

  canPour(id) {
    if (this.sandbox) return Infinity;
    return Math.floor(this.state.stock(id) / SIM.ML_PER_PARTICLE);
  }

  startPour(x, amount) {
    const id = this.selected;
    if (!id) return;
    const avail = this.canPour(id);
    if (avail <= 0) {
      audio.play('error');
      toast('Out of stock', `Buy more ${this.state.lookup(id).name} in the shop.`, 'bag');
      return;
    }
    if (this.sim.p.count >= this.sim.maxParticles - 2) {
      toast('The cauldron is full', 'Bottle, skim or empty it first.', 'cauldron');
      return;
    }
    this.pourX = this.clampPourX(x);
    const def = this.state.lookup(id);
    const n = Math.min(avail, amount ?? Infinity);
    this.sim.emitter.start(def, { x: this.pourX, amount: n });
    this.sim.emitter.active.dose = amount !== undefined;
    this.lastPoured[id] = this.sim.emitter.poured[id] || 0;
    if (this.tutorial) this.tutorial.notify('pour', id);
  }

  pourDose(ml) {
    if (!this.selected) { toast('Choose a reagent', 'Tap a jar on the shelf first.', 'jar'); return; }
    if (this.tool !== 'pour') this.selectTool('pour', true);
    this.startPour(this.pourX, Math.round(ml / SIM.ML_PER_PARTICLE));
  }

  /** Charge inventory for particles the emitter actually spawned. */
  accountPours() {
    const em = this.sim.emitter;
    for (const [id, total] of Object.entries(em.poured)) {
      const prev = this.lastPoured[id] || 0;
      const d = total - prev;
      if (d <= 0) continue;
      this.lastPoured[id] = total;
      const ml = d * SIM.ML_PER_PARTICLE;
      if (!this.sandbox) {
        this.state.consume(id, ml);
        if (this.state.stock(id) < SIM.ML_PER_PARTICLE && em.active && em.active.def.id === id) em.stop();
      }
      this.logPour(id, ml);
    }
  }

  logPour(id, ml) {
    const log = this.state.brewLog;
    const last = log[log.length - 1];
    if (last && last.type === 'pour' && last.id === id) last.ml += ml;
    else log.push({ type: 'pour', id, ml, t: Math.round(this.sim.time) });
    this.state.stats.brews = this.state.stats.brews || 0;
  }

  setFurnace(v) {
    this.sim.furnace.setting = v;
    this.furnaceInput.value = String(Math.round(v * 100));
    if (this.tutorial) this.tutorial.notify('furnace', v);
  }

  toggleLid() {
    const c = this.sim.cauldron;
    c.lidClosed = !c.lidClosed;
    audio.play('lid');
    this.state.brewLog.push({ type: 'lid', closed: c.lidClosed, t: Math.round(this.sim.time) });
    this.refreshHud();
  }

  toggleAlembic() {
    this.alembicOpen = !this.alembicOpen;
    this.syncActions();
    toast(this.alembicOpen ? 'Alembic valve open' : 'Alembic valve closed', this.alembicOpen ? 'Vapour under the lid is drawn into the receiver flask.' : '', 'alembic', 2000);
  }

  cycleSpeed() {
    this.speed = this.speed === 1 ? 2 : this.speed === 2 ? 4 : 1;
    this.syncActions();
  }

  setAutoStir(on) {
    if (this.autoStir === on) return;
    this.autoStir = on;
    const t = this.sim.tool;
    const upgraded = this.state.has('stirrer');
    t.auto = on;
    if (on) {
      t.type = 'spoon';
      const c = this.sim.cauldron;
      t.autoCenterX = 0;
      t.autoCenterY = c.depth - 0.75;
      t.autoRadius = upgraded ? c.belly * 0.55 : c.belly * 0.32;
      t.autoPhase = 0;
    } else {
      t.setTarget(t.x, t.y, false);
    }
    this.syncActions();
  }

  async emptyCauldron() {
    if (this.sim.p.count === 0) return;
    const ok = await confirmDialog('Empty the cauldron?', 'Everything in the cauldron will be poured away. Ingredients are not refunded.', 'Empty it', 'danger');
    if (!ok) return;
    this.sim.clear();
    this.state.brewLog = [];
    this.lastPoured = {};
    audio.play('splash');
    this.save();
  }

  // ------------------------------------------------------------------ customers
  bringCustomer(withSound = true) {
    const st = this.state;
    if (this.sandbox) return;
    const c = st.nextCustomer();
    if (c && withSound) audio.play('bell');
    this.refreshCustomer();
  }

  refreshCustomer() {
    const st = this.state;
    const el = clear(this.custEl);
    const com = st.current;
    this.reqEls = [];
    el.classList.toggle('empty', !com);
    if (com && !this._custInit) { this._custInit = true; el.classList.add('collapsed'); }
    if (!com) {
      if (st.dayOver) {
        el.append(h('div', { class: 'empty-msg' }, `The last customer has left. Day ${st.day} is over.`),
          h('div', { class: 'cust-actions' }, btn('Close shop for the night', () => this.endDay(), { cls: 'gold', icon: 'sun', act: 'end-day' })));
      } else {
        el.append(h('div', { class: 'empty-msg' }, 'The shop is quiet. Experiment, or call in the next customer.'),
          h('div', { class: 'cust-actions' }, btn('Open the door', () => this.bringCustomer(true), { cls: 'gold', icon: 'door', act: 'next-customer' })));
      }
      return;
    }
    const portrait = /** @type {HTMLCanvasElement} */ (h('canvas', { class: 'portrait' }));
    drawPortrait(portrait, com.customer.portrait, 'neutral');
    this.portraitEl = portrait;
    const list = h('ul', { class: 'reqs' });
    for (const req of com.requirements) {
      const now = h('span', { class: 'now' });
      const meter = h('i');
      const target = req.key === 'color'
        ? h('span', {}, h('span', { class: 'swatch', style: { background: rgbToHex(req.rgb) } }), req.label)
        : h('span', { text: req.label });
      const li = h('li', { class: 'req', title: PROPERTY_LABELS[req.key] }, icon(REQ_ICON[req.key] || 'star'), h('span', {}, h('span', { class: 'lbl-k', text: PROPERTY_LABELS[req.key] + ' ' }), target), now, h('div', { class: 'meter' }, meter));
      list.appendChild(li);
      this.reqEls.push({ req, li, now, meter });
    }
    const qNow = h('span', { class: 'now' });
    const qMeter = h('i');
    const qli = h('li', { class: 'req' }, icon('flask'), h('span', {}, h('span', { class: 'lbl-k', text: 'Quantity ' }), `${com.bottleMl} ml`), qNow, h('div', { class: 'meter' }, qMeter));
    list.appendChild(qli);
    this.reqEls.push({ req: { key: 'quantity' }, li: qli, now: qNow, meter: qMeter });
    const info = h('div', { class: 'cust-info' },
      h('div', { class: 'cust-head' }, h('span', { class: 'cust-name', text: `${com.customer.name} · ${com.customer.title}${com.contract ? ' · Guild contract' : ''}${com.grand ? ' · Grand Commission' : ''}` }),
        h('span', { class: 'budget' }, icon('coin', 'sm'), ` up to ${coins(com.budget)}`)),
      h('div', { class: 'potion-name', text: com.potionName }),
      h('div', { class: 'dialogue', text: '“' + com.dialogue + '”' }),
      list,
    );
    this.bottleBtn = btn('Bottle', () => this.startBottling(), { icon: 'flask', cls: 'primary', title: 'Bottle the potion (B)', act: 'bottle' });
    const more = btn('', () => this.custEl.classList.toggle('collapsed'), { icon: 'scroll', cls: 'icon', title: 'Show the full order', act: 'cust-more' });
    const side = h('div', { class: 'cust-side' }, this.bottleBtn, more);
    const actions = h('div', { class: 'cust-actions' },
      btn(com.hintCost ? `Advice (${com.hintCost})` : 'Advice', () => panels.openHint(this), { icon: 'bulb', cls: 'extra', title: 'Ask the guild for advice', act: 'hint' }),
      com.tutorial ? null : btn('Decline', () => this.decline(), { icon: 'door', cls: 'extra', title: 'Send the customer away', act: 'decline' }),
    );
    el.append(portrait, info, side, actions);
    portrait.addEventListener('click', () => this.custEl.classList.toggle('collapsed'));
    this.updateAssay(true);
  }

  async decline() {
    const ok = await confirmDialog('Decline this order?', 'The customer will leave without paying. Your reputation is not affected.', 'Decline', 'danger');
    if (!ok) return;
    this.state.declineCustomer();
    this.refreshCustomer();
    setTimeout(() => this.bringCustomer(true), 900);
  }

  endDay() {
    const summary = this.state.endDay();
    this.save();
    panels.showDaySummary(this, summary, () => {
      const relief = this.state.claimRelief();
      if (relief) toast('Guild stipend', `The guild lends a struggling apprentice ${relief} coins.`, 'coin', 4000);
      this.buildShelf();
      this.bringCustomer(true);
      this.refreshHud(true);
    });
  }

  // ------------------------------------------------------------------ bottling
  startBottling() {
    if (this.sandbox || this.bottling) return;
    const com = this.state.current;
    if (!com) { toast('No order', 'Wait for a customer before bottling.', 'door'); return; }
    const sel = tapSelection(this.sim, com.bottleN);
    if (sel.length < 1) { toast('Nothing to bottle', 'There is no liquid at the tap.', 'flask'); audio.play('error'); return; }
    const m = measureParticles(this.sim, sel);
    this.sim.emitter.stop();
    this.setAutoStir(false);
    this.bottling = { total: sel.length, removed: 0, progress: 0, color: m.color, measurement: m, commission: com, t: 0 };
    audio.play('glass');
    if (this.tutorial) this.tutorial.notify('bottle');
  }

  stepBottling(dt) {
    const b = this.bottling;
    if (!b) return;
    b.t += dt;
    const target = Math.min(b.total, Math.ceil(b.total * Math.min(1, b.t / 1.4)));
    const k = target - b.removed;
    if (k > 0) {
      const sel = tapSelection(this.sim, k).sort((a, c) => c - a);
      for (const i of sel) this.sim.removeParticle(i);
      b.removed += k;
    }
    b.progress = b.removed / Math.max(1, b.commission.bottleN);
    if (b.t > 1.8) this.finishBottling();
  }

  finishBottling() {
    const b = this.bottling;
    this.bottling = null;
    const ev = evaluatePotion(b.commission, b.measurement);
    audio.play(ev.quality >= 0.7 ? 'coin' : 'fail');
    const recipe = this.recipeDraft(b.measurement, ev, b.commission);
    panels.showResult(this, b.commission, b.measurement, ev, recipe, () => {
      const events = this.state.completeSale(ev, b.measurement);
      for (const e of events) this.announce(e);
      this.state.brewLog = this.state.brewLog.filter(() => false);
      this.lastPoured = {};
      this.save();
      this.refreshCustomer();
      this.refreshHud(true);
      if (this.tutorial) this.tutorial.notify('sold');
      if (!this.state.dayOver) setTimeout(() => this.bringCustomer(true), 1400);
    });
  }

  /** Build a recipe description from the brew log + the measured result. */
  recipeDraft(m, ev, com) {
    const st = this.state;
    const ing = [];
    for (const e of st.brewLog) if (e.type === 'pour') ing.push({ id: e.id, ml: e.ml });
    const agg = [];
    for (const i of ing) {
      const last = agg[agg.length - 1];
      if (last && last.id === i.id) last.ml += i.ml;
      else agg.push({ ...i });
    }
    const stats = st.brewLog.find((e) => e.type === 'stats') || {};
    return {
      name: com ? com.potionName : 'Experiment',
      ingredients: agg,
      maxTemp: Math.round(stats.maxT ?? m.temperature),
      minTemp: Math.round(stats.minT ?? m.temperature),
      serveTemp: Math.round(m.temperature),
      stirSeconds: Math.round(stats.stir || 0),
      crushed: !!stats.crushed,
      lid: this.sim.cauldron.lidClosed,
      result: { color: m.color, density: m.density, viscosity: m.viscosity, aspects: m.aspects, stability: m.stability, volatility: m.volatility, ml: m.ml },
      quality: ev ? ev.quality : null,
      customer: com ? com.customer.title : null,
      day: st.day,
    };
  }

  /** Track temperatures / stirring for the recipe log. */
  trackBrew(dt) {
    const log = this.state.brewLog;
    let s = log.find((e) => e.type === 'stats');
    if (!s) { s = { type: 'stats', maxT: -1e9, minT: 1e9, stir: 0, crushed: false }; log.push(s); }
    const p = this.sim.p;
    if (p.count === 0) return;
    let T = 0, n = 0;
    for (let i = 0; i < p.count; i += 3) if (p.phase[i] !== PHASE.GAS) { T += p.temp[i]; n++; }
    if (n) {
      T /= n;
      s.maxT = Math.max(s.maxT, T);
      s.minT = Math.min(s.minT, T);
    }
    const t = this.sim.tool;
    if (t.active && t.type === 'spoon' && t.speed > 0.2) s.stir += dt;
  }

  analyseAll() {
    const sel = [];
    for (let i = 0; i < this.sim.p.count; i++) if (this.sim.p.phase[i] !== PHASE.GAS) sel.push(i);
    const m = measureParticles(this.sim, sel);
    if (!m) { toast('Nothing to analyse', 'The cauldron is empty.', 'flask'); return; }
    panels.showAnalysis(this, m, this.recipeDraft(m, null, null));
  }

  announce(e) {
    if (e.type === 'achievement') {
      toast(`Achievement: ${e.name}`, `${e.desc} (+${e.reward} coins)`, 'star', 4200);
      audio.play('fanfare');
    } else if (e.type === 'rank') {
      toast(`Promoted to ${e.name}!`, 'New customers, reagents and equipment are available.', 'charter', 5000);
      audio.play('fanfare');
      this.buildShelf();
    }
  }

  // ------------------------------------------------------------------ live analysis
  updateAssay(force = false) {
    const com = this.state.current;
    if (!com || !this.reqEls || !this.reqEls.length) return;
    const sel = tapSelection(this.sim, com.bottleN);
    const m = sel.length ? measureParticles(this.sim, sel) : null;
    this.assay = m;
    const cap = this.state;
    for (const r of this.reqEls) {
      let score = 0, text = '—';
      if (m) {
        if (r.req.key === 'quantity') {
          const f = Math.min(1, m.ml / com.bottleMl);
          score = f >= 0.98 ? 1 : f * f;
          text = `${m.ml} ml`;
        } else {
          const s = scoreRequirement(r.req, m);
          score = s.score;
          text = this.readable(r.req.key, s.value, m, cap);
        }
      }
      r.now.textContent = text;
      r.meter.style.width = Math.round(score * 100) + '%';
      r.meter.style.background = score >= 0.999 ? '#4c8a2a' : score > 0.6 ? '#c08a2a' : '#a83a2a';
      r.li.classList.toggle('ok', score >= 0.999);
    }
    if (this.bottleBtn) this.bottleBtn.disabled = !m;
    void force;
  }

  /** Value text respecting which instruments the player owns. */
  readable(key, value, m, st) {
    const has = (id) => this.sandbox || st.has(id);
    switch (key) {
      case 'color': return value < 1 ? 'exact' : `ΔE ${value.toFixed(0)}`;
      case 'temperature': return `${Math.round(value)}°C`;
      case 'density': return has('hydrometer') ? `${value.toFixed(2)}` : '? (hydrometer)';
      case 'viscosity': return has('viscometer') ? `${value < 100 ? value.toFixed(1) : Math.round(value)} cP` : viscosityClass(value);
      case 'stability': case 'volatility': return has('assay') ? `${Math.round(value)}` : value > 66 ? 'high' : value > 33 ? 'medium' : 'low';
      default: return has('lens') ? `${Math.round(value)}` : value >= 45 ? 'strong' : value >= 20 ? 'moderate' : value >= 6 ? 'faint' : 'none';
    }
  }

  updateProbe() {
    if (!this.probe) return;
    const sel = probeSelection(this.sim, this.probe.x, this.probe.y, this.probe.r);
    const el = clear(this.readout);
    el.classList.remove('hidden');
    if (!sel.length) {
      const c = this.sim.cauldron;
      const wall = c.wallCellAt(this.probe.x, this.probe.y);
      el.append(h('div', { text: wall >= 0 ? `Iron wall: ${Math.round(c.cellT[wall])}°C` : 'Empty space' }));
      return;
    }
    const m = measureParticles(this.sim, sel);
    const st = this.state;
    const comp = Object.entries(m.composition).sort((a, b) => b[1] - a[1]).slice(0, 3);
    const phase = Object.entries(m.phases).sort((a, b) => b[1] - a[1])[0][0];
    el.append(
      h('div', { class: 'rrow' }, h('span', { class: 'swatch', style: { background: rgbToHex(m.color), display: 'inline-block', width: '14px', height: '10px', boxShadow: '0 0 0 1px #2b1d14' } }), h('b', { text: `${describeColor(m.color)} ${phase}` })),
      h('div', { text: `${Math.round(m.temperature)}°C · ${this.readable('viscosity', m.viscosity, m, st)}` }),
      h('div', { text: `Density ${this.readable('density', m.density, m, st)}` }),
      ...comp.map(([id, f]) => h('div', { text: `${Math.round(f * 100)}% ${st.lookup(id) ? st.lookup(id).name : id}` })),
      h('div', { text: ['vitality', 'ardor', 'arcana', 'fortitude'].map((k, i) => (m.aspects[i] >= 6 ? `${PROPERTY_LABELS[k]} ${this.readable(k, m.aspects[i], m, st)}` : '')).filter(Boolean).join(' · ') || 'No magical potency' }),
    );
  }

  // ------------------------------------------------------------------ HUD
  refreshHud(full = false) {
    const st = this.state;
    if (!this.sandbox) {
      this.coinEl.textContent = coins(st.coins);
      const r = st.rank, next = RANKS[r + 1];
      this.rankName.textContent = RANKS[r].name;
      const prog = next ? (st.reputation - RANKS[r].rep) / (next.rep - RANKS[r].rep) : 1;
      this.rankBar.style.width = Math.round(Math.min(1, prog) * 100) + '%';
      this.rankBar.parentElement.title = `Reputation ${st.reputation}${next ? ' / ' + next.rep : ''}`;
      clear(this.dayEl).append(h('span', { text: `Day ${st.day} · ${Math.min(st.customerIndex + (st.current ? 1 : 0), st.customersPerDay)}/${st.customersPerDay}` }), h('span', { class: 'event', text: st.marketEvent.key !== 'none' ? st.marketEvent.name : '' }));
    }
    this.syncActions();
    const f = this.sim.furnace.setting;
    const c = this.sim.cauldron;
    const label = f > 0.02 ? `Fire ${Math.round(f * 100)}%` : f < -0.02 ? `Frost ${Math.round(-f * 100)}%` : 'Off';
    this.furnaceLabel.textContent = `${label} · ${Math.round(c.bottomTemperature())}°C`;
    const want = iconUrl(f < -0.02 ? 'snow' : 'flame');
    if (this.furnaceIcon.src !== want) this.furnaceIcon.src = want;
    if (full) this.updateShelf();
    this.updateChips();
  }

  updateShelf() {
    if (!this.jarEls) return;
    for (const [id, j] of Object.entries(this.jarEls)) {
      const s = this.sandbox ? Infinity : this.state.stock(id);
      j.stock.textContent = isFinite(s) ? (s >= 1000 ? (s / 1000).toFixed(1) + 'L' : String(Math.round(s))) : '∞';
      j.el.classList.toggle('empty', s < SIM.ML_PER_PARTICLE);
    }
  }

  updateChips() {
    const c = clear(this.chips);
    const sim = this.sim;
    const p = sim.p;
    let T = 0, n = 0, gas = 0;
    for (let i = 0; i < p.count; i++) { if (p.phase[i] === PHASE.GAS) gas++; else { T += p.temp[i]; n++; } }
    c.append(h('div', { class: 'chip', text: `${p.count * SIM.ML_PER_PARTICLE} ml / ${sim.maxParticles * SIM.ML_PER_PARTICLE} ml` }));
    if (n) c.append(h('div', { class: 'chip', text: `Brew ${Math.round(T / n)}°C` }));
    if (gas > 0) c.append(h('div', { class: 'chip', text: `Vapour ${gas * SIM.ML_PER_PARTICLE} ml${sim.cauldron.lidClosed ? '' : ' (escaping!)'}` }));
    if (this.autoBrewer) c.append(h('div', { class: 'chip', text: `Homunculus: ${this.autoBrewer.status}` }));
    if (this.state.receiver && this.state.receiver.count) c.append(h('div', { class: 'chip', text: `Receiver ${this.state.receiver.count * SIM.ML_PER_PARTICLE} ml` }));
    if (this.app.settings.showFps) c.append(h('div', { class: 'chip', text: `${this.fpsAcc.fps} fps · ${sim.stats.stepMs.toFixed(1)} ms/step · ${p.count} particles` }));
  }

  // ------------------------------------------------------------------ frame loop
  frame(t) {
    let dt = (t - this.lastT) / 1000;
    this.lastT = t;
    if (dt > 0.1) dt = 0.1;
    this.time += dt;
    const fa = this.fpsAcc;
    fa.t += dt; fa.n++;
    if (fa.t >= 1) { fa.fps = Math.round(fa.n / fa.t); fa.t = 0; fa.n = 0; }
    const modalOpen = !!document.querySelector('.overlay');
    const sim = this.sim;
    // physics (keeps running behind non-blocking panels so brews keep evolving)
    if (this.autoBrewer) {
      // the homunculus decides once per physics step
      const n = Math.min(12, Math.round((dt * this.speed) / SIM.DT));
      for (let k = 0; k < n; k++) {
        this.autoBrewer.tick();
        sim.step();
        if (this.autoBrewer.done) { toast('Homunculus finished', this.autoBrewer.failed ? 'It stopped — check your stock.' : 'The brew is ready to bottle.', 'homunculus'); this.autoBrewer = null; this.setFurnace(0); break; }
      }
      this.accountPours();
    } else {
      sim.advance(dt, this.speed, this.speed > 1 ? 10 : 6);
      this.accountPours();
    }
    if (this.alembicOpen) this.collectVapour();
    this.stepBottling(dt);
    this.trackBrew(dt);
    // events
    if (sim.events.length) {
      const evs = sim.events.splice(0);
      for (const e of evs) this.handleSimEvent(e);
    }
    // periodic UI
    this.hudTimer += dt;
    this.assayTimer += dt;
    this.saveTimer += dt;
    this.layerTimer += dt;
    if (this.hudTimer > 0.25) { this.hudTimer = 0; this.refreshHud(); this.updateShelf(); if (this.probe) this.updateProbe(); }
    if (this.assayTimer > 0.35 && !this.bottling) { this.assayTimer = 0; this.updateAssay(); }
    if (this.layerTimer > 2) { this.layerTimer = 0; this.detectLayers(); }
    if (this.saveTimer > 15) { this.saveTimer = 0; this.save(); }
    if (this.tutorial) this.tutorial.update();
    // audio levels
    const tool = sim.tool;
    const stirTarget = tool.active && tool.type !== 'skimmer' ? Math.min(1, tool.speed / 2.5) : 0;
    this.stirLevel += (stirTarget - this.stirLevel) * Math.min(1, dt * 10);
    let boiling = 0;
    if (sim.steps % 30 === 0) { for (let i = 0; i < sim.p.count; i++) if (sim.p.phase[i] === PHASE.GAS && sim.nCond[i] >= 3) boiling++; this.lastBoil = boiling; }
    audio.update({ fire: Math.max(0, sim.furnace.setting), cold: Math.max(0, -sim.furnace.setting), stir: this.stirLevel, pour: sim.emitter.pouring ? 1 : 0, boil: Math.min(1, this.lastBoil / 30) }, dt);
    // render
    const em = sim.emitter;
    this.renderer.render({
      sim,
      time: this.time,
      dt: modalOpen ? dt * 0.5 : dt,
      pour: { active: em.pouring, x: em.active ? em.active.x : this.pourX, def: em.active ? em.active.def : null },
      tool: { type: tool.type, x: tool.x, y: tool.y, active: tool.active },
      toolHover: this.hover && (this.tool === 'spoon' || this.tool === 'pestle' || this.tool === 'skimmer'),
      bottling: this.bottling ? { progress: this.bottling.progress, color: this.bottling.color } : null,
      showBottle: !!this.state.current && !this.sandbox,
      probe: this.tool === 'probe' ? this.probe : null,
      thermal: this.thermal,
      alembic: this.state.has('alembic'),
      receiver: this.state.receiver,
      stirrer: this.state.has('stirrer') && this.autoStir,
    });
  }

  handleSimEvent(e) {
    this.renderer.onEvent(e);
    switch (e.type) {
      case 'reaction': audio.play('reaction'); break;
      case 'crush': if (Math.random() < 0.5) audio.play('crush'); break;
      case 'ignite': audio.play('ignite'); break;
      case 'phase': if (e.to === 'solid' && Math.random() < 0.15) audio.play('freeze'); break;
      case 'full': toast('The cauldron is full', 'Bottle, skim or empty it before adding more.', 'cauldron'); break;
    }
    if (this.sandbox) return;
    const r = processEvent(this.state, e);
    for (const entry of r.entries) {
      if (entry.kind === 'ingredient') continue;
      toast(entry.kind === 'reaction' ? 'New reaction discovered!' : 'Discovery', entry.title, entry.kind === 'reaction' ? 'eye' : 'scroll', 3800);
      audio.play('discover');
    }
    for (const a of r.achievements) this.announce(a);
  }

  /** Notice immiscible liquids sitting in separate layers (journal). */
  detectLayers() {
    if (this.sandbox) return;
    const sim = this.sim, p = sim.p, sp = sim.species;
    const counts = new Map();
    for (let i = 0; i < p.count; i++) {
      if (p.phase[i] !== PHASE.LIQUID) continue;
      let best = -1, bf = 0.8;
      for (let s = 0; s < sp.count; s++) if (p.comp[i * MAX_SPECIES + s] > bf) { bf = p.comp[i * MAX_SPECIES + s]; best = s; }
      if (best >= 0) counts.set(best, (counts.get(best) || 0) + 1);
    }
    const slots = [...counts.entries()].filter(([, c]) => c >= 15).map(([s]) => s);
    for (let a = 0; a < slots.length; a++) for (let b = a + 1; b < slots.length; b++) {
      const A = slots[a], B = slots[b];
      if (compatFactor(sp.compatA[A], sp.compatB[A], sp.compatA[B], sp.compatB[B]) < 0.2) {
        const ids = [sp.defs[A].id, sp.defs[B].id].sort();
        this.handleSimEvent({ type: 'layers', a: ids[0], b: ids[1] });
      }
    }
  }

  /** Alembic: draw vapour from under the lid into the receiver flask. */
  collectVapour() {
    const sim = this.sim, p = sim.p, c = sim.cauldron;
    if (!c.lidClosed) return;
    const st = this.state;
    st.receiver = st.receiver || { count: 0, comp: {}, color: [0.7, 0.8, 0.9] };
    const rec = st.receiver;
    let took = 0;
    for (let i = p.count - 1; i >= 0 && took < 3; i--) {
      if (p.phase[i] !== PHASE.GAS || p.y[i] > 0.25 || p.x[i] < c.mouth * 0.3) continue;
      for (let s = 0; s < sim.species.count; s++) {
        const f = p.comp[i * MAX_SPECIES + s];
        if (f > 0 && sim.species.defs[s]) rec.comp[sim.species.defs[s].id] = (rec.comp[sim.species.defs[s].id] || 0) + f;
      }
      rec.color = [sim.colR[i], sim.colG[i], sim.colB[i]];
      rec.count++;
      sim.removeParticle(i);
      took++;
    }
    if (took && rec.count >= 4) {
      const r = st.unlock('distil');
      for (const a of r) this.announce(a);
    }
  }

  /** Pour the receiver's distillate back into the cauldron (as liquid). */
  pourReceiver() {
    const rec = this.state.receiver;
    if (!rec || !rec.count) return;
    const sim = this.sim;
    const total = Object.values(rec.comp).reduce((a, b) => a + b, 0) || 1;
    const ids = Object.keys(rec.comp);
    let made = 0;
    for (let k = 0; k < rec.count; k++) {
      const x = (Math.random() - 0.5) * sim.cauldron.mouth;
      const i = sim.addParticle(this.state.lookup(ids[0]), x, 0.2 + Math.random() * 0.2, PHASE.LIQUID, 20);
      if (i < 0) break;
      sim.p.comp.fill(0, i * MAX_SPECIES, (i + 1) * MAX_SPECIES);
      for (const id of ids) {
        const s = sim.slotFor(this.state.lookup(id));
        if (s >= 0) sim.p.comp[i * MAX_SPECIES + s] += rec.comp[id] / total;
      }
      sim.p.dirty[i] = 1;
      made++;
    }
    this.state.receiver = null;
    toast('Distillate poured back', `${made * SIM.ML_PER_PARTICLE} ml returned to the cauldron.`, 'alembic');
  }

  /** Run a saved recipe with the homunculus. */
  startHomunculus(recipe) {
    const plan = {
      ingredients: recipe.ingredients.map((i) => ({ id: i.id, n: Math.round(i.ml / SIM.ML_PER_PARTICLE) })),
      heatTo: recipe.maxTemp, coolTo: recipe.minTemp, serveTemp: recipe.serveTemp, knead: recipe.stirSeconds > 12, crush: recipe.crushed, hold: 12,
    };
    this.autoBrewer = new AutoBrewer(this.sim, plan, this.state.lookup, {
      onPour: (id, n) => {
        const ml = n * SIM.ML_PER_PARTICLE;
        if (!this.sandbox && this.state.stock(id) < ml) return false;
        return true;
      },
    });
    toast('The homunculus gets to work', recipe.name, 'homunculus');
  }

  save() {
    if (this.sandbox) {
      saveJSON(KEYS.sandbox, { seed: this.state.seed, cauldron: snapshotSim(this.sim, this.cap.size) });
      return;
    }
    this.state.cauldron = snapshotSim(this.sim, this.cap.size);
    saveGame(this.state);
  }
}

export { describeValue };
