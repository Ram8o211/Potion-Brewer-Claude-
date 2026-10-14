// The garden: tap a bed to harvest it (or the well to draw water); plant
// beds need watering to keep growing; empty plots can be planted for coins.
// Everything grows with real time, even while the shop is closed; nothing
// here runs while you brew (growth is resolved when shown).

import { h, btn, clear, toast, coins, confirmDialog } from '../dom.js';
import { icon } from '../icons.js';
import { audio } from '../../audio/audio.js';
import { BEDS, BED_BY_ID, WATER_COST, formatWait } from '../../game/garden.js';
import { RANKS } from '../../game/equipment.js';
import { paintGarden, drawBeds, bedAt, bedRect, GARDEN_W, GARDEN_H } from '../../rendering/garden.js';
import { rawSprite } from '../../rendering/scenes.js';
import { drawJar } from '../../rendering/art.js';
import { PROPS } from '../../alchemy/magic.js';

export class GardenView {
  /** @param {import('../lab.js').LabScreen} lab */
  constructor(lab) {
    this.lab = lab;
    this.el = h('section', { class: 'view view-garden', 'data-view': 'garden' });
    this.time = 0;
    this.floaters = [];
    this.bg = null;
    this.bgKey = '';
    this.rows = {};
  }

  build() {
    const el = clear(this.el);
    this.canvas = /** @type {HTMLCanvasElement} */ (h('canvas', { width: String(GARDEN_W), height: String(GARDEN_H), class: 'scene garden-scene', 'aria-label': 'Your garden: tap a bed to harvest it' }));
    this.ctx = /** @type {CanvasRenderingContext2D} */ (this.canvas.getContext('2d'));
    this.canvas.addEventListener('pointerdown', (e) => this.tapScene(e));
    this.list = h('div', { class: 'beds' });
    el.append(h('div', { class: 'garden-scene-wrap' }, h('div', { class: 'scene-wrap' }, this.canvas)), h('div', { class: 'garden-list' }, this.list));
    this.refresh();
  }

  /** The garden's growth state (sandbox: always ripe). @param {string} id */
  status(id) {
    const lab = this.lab, st = lab.state;
    if (lab.sandbox) return { owned: true, growth: 1, amount: BED_BY_ID[id].cap, cap: BED_BY_ID[id].cap, moist: true, ready: true, fullIn: 0, dryIn: Infinity };
    return st.bed(id);
  }

  refresh() {
    const lab = this.lab, st = lab.state;
    if (!this.list) return;
    const list = clear(this.list);
    this.rows = {};
    for (const b of BEDS) {
      const m = st.lookup(st.world.roles[b.role]);
      if (!m) continue;
      const s = this.status(b.id);
      const owned = !!(s && s.owned);
      const locked = !lab.sandbox && !owned && b.rank > st.rank;
      const sprite = m.form === 'solid' ? rawSprite(m.shape || 'stone', m.look || m.color, owned ? Math.max(0.3, s.growth) : 0.4) : jarSprite(m);
      const barI = h('i');
      const meta = h('div', { class: 'meta' });
      // the buttons are made once and only updated (a tap is never lost to a rebuild)
      const plantB = btn(`${b.price}`, () => this.plant(b.id), { icon: 'plus', cls: 'gold', title: `Plant for ${b.price} coins`, act: 'plant-' + b.id });
      const waterB = b.kind === 'plant' ? btn(`${WATER_COST}`, () => this.water(b.id), { icon: 'can', title: `Water it (${WATER_COST} ml of well water)`, act: 'water-' + b.id }) : null;
      const harvestB = btn('', () => this.harvest(b.id), { icon: b.kind === 'well' ? 'well' : 'satchel', cls: 'primary icon', title: b.kind === 'well' ? 'Draw water' : 'Harvest', act: 'harvest-' + b.id });
      const actions = h('div', { class: 'bed-actions' }, plantB, waterB, harvestB);
      const fx = h('div', { class: 'bed-fx' }, ...PROPS.filter((p) => (m.magic?.[p.key] || 0) >= 10).map((p) => icon(p.icon, 'sm')));
      const row = h('div', { class: 'bed parch' + (owned ? '' : ' unowned') + (locked ? ' locked' : ''), 'data-bed': b.id },
        sprite,
        h('div', { class: 'bed-info' }, h('div', { class: 'title' }, h('span', { text: m.name }), fx), h('div', { class: 'bar' }, barI), meta),
        actions);
      this.rows[b.id] = { row, barI, meta, plantB, waterB, harvestB, b, m, sig: '' };
      list.appendChild(row);
      this.fillRow(b.id);
    }
    this.paintBg();
  }

  /** Update one bed's row in place. @param {string} id */
  fillRow(id) {
    const lab = this.lab, st = lab.state;
    const r = this.rows[id];
    if (!r) return;
    const { b } = r;
    const s = this.status(id);
    const owned = !!(s && s.owned);
    const locked = !lab.sandbox && !owned && b.rank > st.rank;
    r.row.classList.toggle('unowned', !owned);
    r.row.classList.toggle('locked', locked);
    r.barI.style.width = Math.round((owned ? s.growth : 0) * 100) + '%';
    r.barI.classList.toggle('ripe', owned && s.ready);
    r.plantB.classList.toggle('hidden', owned || locked);
    r.plantB.disabled = st.coins < b.price;
    const showWater = owned && b.kind === 'plant' && isFinite(s.dryIn) && !lab.sandbox;
    if (r.waterB) {
      r.waterB.classList.toggle('hidden', !showWater);
      r.waterB.classList.toggle('gold', showWater && !s.moist);
      r.waterB.disabled = !showWater || (s.moist && s.dryIn > 18 * 60000) || st.stock(st.world.roles.water) < WATER_COST;
    }
    r.harvestB.classList.toggle('hidden', !owned);
    r.harvestB.disabled = !owned || !s.ready;
    // the meta line is rebuilt only when what it says changes
    let parts;
    if (!owned) parts = locked ? [['lock', RANKS[b.rank].name]] : [];
    else if (b.kind === 'well') parts = [['drop', String(s.amount)], s.growth < 0.999 ? ['clock', formatWait(s.fullIn)] : null];
    else parts = [['jar', String(s.ready ? s.amount : 0)], s.growth >= 0.999 ? ['check', ''] : s.moist ? ['clock', formatWait(s.fullIn)] : ['warn', ''],
      b.kind === 'plant' && s.moist && isFinite(s.dryIn) ? ['drop', formatWait(s.dryIn)] : null];
    parts = parts.filter(Boolean);
    const sig = JSON.stringify(parts);
    if (sig === r.sig) return;
    r.sig = sig;
    clear(r.meta).append(...parts.map(([ic, txt]) => h('span', { class: ic === 'check' ? 'ok' : ic === 'warn' ? 'warn' : ic === 'clock' || ic === 'drop' && b.kind !== 'well' ? 'muted' : '' }, icon(ic, 'sm'), txt ? ` ${txt}` : '')));
  }

  paintBg() {
    const key = this.lab.state.seed;
    if (key === this.bgKey) return;
    this.bgKey = key;
    this.bg = document.createElement('canvas');
    this.bg.width = GARDEN_W; this.bg.height = GARDEN_H;
    paintGarden(/** @type {CanvasRenderingContext2D} */ (this.bg.getContext('2d')), key);
  }

  /** @param {string} id */
  harvest(id) {
    const lab = this.lab, st = lab.state;
    const b = BED_BY_ID[id];
    const m = st.lookup(st.world.roles[b.role]);
    /** @type {any} */
    const r = lab.sandbox ? { ok: true, amount: b.kind === 'well' ? 150 : b.cap, events: [], reason: '', wait: 0 } : st.harvest(id);
    if (!r.ok) {
      audio.play('error');
      const why = r.reason === 'full' ? 'Your shelves are full.' : r.reason === 'unripe' ? (isFinite(r.wait) ? `Ripe in ${formatWait(r.wait)}.` : 'Too dry to grow — water it.') : r.reason === 'empty' ? 'The well is dry for now.' : '';
      toast(m.name, why, 'clock', 2600);
      return;
    }
    audio.play(b.kind === 'well' ? 'pour' : 'select');
    const rc = bedRect(id);
    this.floaters.push({ x: rc.x + rc.w / 2, y: rc.y + 6, t: 0, text: `+${r.amount}`, color: m.look || m.color });
    for (const e of r.events || []) lab.announce(e);
    if (lab.tutorial) lab.tutorial.notify('harvest', m.id);
    if (!lab.jarEls[m.id]) lab.buildShelf(); else lab.updateShelf();
    lab.save();
    this.fillRow(id);
    if (b.kind === 'well') for (const bb of BEDS) if (bb.kind === 'plant') this.fillRow(bb.id);
    lab.updateBadges();
  }

  /** @param {string} id */
  water(id) {
    const lab = this.lab, st = lab.state;
    const r = st.water(id);
    if (!r.ok) {
      audio.play('error');
      toast('Cannot water', r.reason === 'no-water' ? `It takes ${WATER_COST} ml of well water.` : r.reason === 'wet' ? 'It is still moist.' : '', 'can', 2400);
      return;
    }
    audio.play('pour');
    lab.updateShelf();
    lab.save();
    this.fillRow(id);
    this.fillRow('well');
  }

  /** @param {string} id */
  async plant(id) {
    const lab = this.lab, st = lab.state;
    const b = BED_BY_ID[id];
    const m = st.lookup(st.world.roles[b.role]);
    if (!(await confirmDialog(`Plant ${m.name}?`, `${coins(b.price)} coins. It starts from bare soil.`, 'Plant', 'gold'))) return;
    const r = st.plant(id);
    if (!r.ok) { toast('Cannot plant', r.reason || '', 'lock'); audio.play('error'); return; }
    audio.play('purchase');
    lab.buildShelf();
    lab.refreshHud();
    lab.save();
    this.refresh();
  }

  /** @param {PointerEvent} e */
  tapScene(e) {
    const r = this.canvas.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * GARDEN_W, y = ((e.clientY - r.top) / r.height) * GARDEN_H;
    const id = bedAt(x, y);
    if (!id) return;
    const s = this.status(id);
    if (!s || !s.owned) {
      const row = this.rows[id];
      if (row && row.row.scrollIntoView) row.row.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      return;
    }
    if (BED_BY_ID[id].kind === 'plant' && !s.moist && !s.ready) { this.water(id); return; }
    this.harvest(id);
  }

  /** @param {number} dt */
  frame(dt) {
    if (!this.ctx || !this.bg) return;
    this.time += dt;
    const ctx = this.ctx, lab = this.lab, st = lab.state;
    ctx.drawImage(this.bg, 0, 0);
    const now = Date.now();
    const cache = {};
    drawBeds(ctx, (id) => (cache[id] ||= lab.sandbox ? this.status(id) : st.bed(id, now)), (role) => { const m = st.lookup(st.world.roles[role]); return m ? m.look || m.color : [0.5, 0.5, 0.5]; }, this.time,
      (id) => !lab.sandbox && BED_BY_ID[id].rank > st.rank);
    for (const f of this.floaters) {
      f.t += dt;
      const a = Math.max(0, 1 - f.t / 1.2);
      ctx.globalAlpha = a;
      for (let k = 0; k < 4; k++) {
        const px = f.x + Math.cos(k * 1.7 + f.t * 3) * f.t * 10, py = f.y - f.t * 14 - k * 2;
        ctx.fillStyle = `rgb(${Math.round(f.color[0] * 255)},${Math.round(f.color[1] * 255)},${Math.round(f.color[2] * 255)})`;
        ctx.fillRect(Math.round(px), Math.round(py), 2, 2);
      }
      ctx.fillStyle = '#ffe39a';
      ctx.font = '8px "Alchemist Pixel", monospace';
      ctx.fillText(f.text, Math.round(f.x - 6), Math.round(f.y - 6 - f.t * 10));
      ctx.globalAlpha = 1;
    }
    this.floaters = this.floaters.filter((f) => f.t < 1.2);
    // live timers, updated in place about once a second
    this._acc = (this._acc || 0) + dt;
    if (this._acc > 1) { this._acc = 0; for (const id of Object.keys(this.rows)) this.fillRow(id); }
  }
}

/** A small jar sprite for a liquid ingredient. @param {any} m */
function jarSprite(m) {
  const cv = /** @type {HTMLCanvasElement} */ (h('canvas', { width: '15', height: '20', class: 'bed-jar' }));
  drawJar(cv.getContext('2d'), 1, 0, 13, 20, m.look || m.color, m.form);
  return cv;
}
