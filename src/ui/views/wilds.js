// The wilds: travel between regions, tap deposits in the scene (or use the
// list) to gather raw ingredients into the shop's stores. Deposits are
// finite and regrow with real time; nothing here runs while you brew.

import { h, btn, clear, toast } from '../dom.js';
import { icon } from '../icons.js';
import { audio } from '../../audio/audio.js';
import { REGIONS, depositStatus, formatWait } from '../../game/gathering.js';
import { RANKS } from '../../game/equipment.js';
import { paintRegion, animateRegion, drawRaw, rawSprite, SCENE_W, SCENE_H } from '../../rendering/scenes.js';
import { EFFECT_BY_KEY } from '../../alchemy/effects.js';

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
  }

  build() {
    const el = clear(this.el);
    this.tabs = h('div', { class: 'region-tabs', role: 'tablist' });
    this.canvas = /** @type {HTMLCanvasElement} */ (h('canvas', { width: String(SCENE_W), height: String(SCENE_H), class: 'scene', 'aria-label': 'Region scene: tap a deposit to gather' }));
    this.ctx = /** @type {CanvasRenderingContext2D} */ (this.canvas.getContext('2d'));
    this.canvas.addEventListener('pointerdown', (e) => this.tapScene(e));
    this.info = h('div', { class: 'region-info small' });
    this.list = h('div', { class: 'deposits' });
    this.foot = h('div', { class: 'small muted wilds-foot' });
    el.append(this.tabs, h('div', { class: 'scene-wrap' }, this.canvas), this.info, this.list, this.foot);
    this.refresh();
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
        this.region = r.id; this.bgKey = ''; audio.play('page'); this.refresh();
      }, { cls: (this.region === r.id ? 'active ' : '') + (ok ? '' : 'locked'), icon: ok ? (r.magical ? 'wisp' : r.id === 'quarry' ? 'pick' : r.id === 'river' ? 'drop' : r.id === 'meadow' ? 'rose' : 'tree') : 'lock', act: 'region-' + r.id }));
    }
    const region = REGIONS.find((r) => r.id === this.region);
    clear(this.info).append(h('b', { text: region.name }), ' — ' + region.desc);
    const list = clear(this.list);
    const now = Date.now();
    this.rows = {};
    for (const d of this.deposits()) {
      const m = st.lookup(d.materialId);
      const s = depositStatus(st.gathering, d, now);
      const locked = !lab.sandbox && d.rank > st.rank;
      const take = st.has('satchel') ? Math.round(d.take * 1.5) : d.take;
      const fx = Object.entries(m.effects || {}).filter(([, v]) => Math.abs(v) >= 5).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1])).slice(0, 3);
      const stock = lab.sandbox ? '∞' : `${Math.floor(s.stock)} / ${d.capacity} ml`;
      const when = lab.sandbox ? 'never runs out' : s.fraction >= 0.999 ? 'fully grown' : s.available >= Math.min(take, d.capacity) ? `regrowing · full in ${formatWait(s.fullIn)}` : `resting · ready in ${formatWait(s.nextIn)}`;
      const g = btn(locked ? RANKS[d.rank].name : `+${take} ml`, () => this.gather(d), { cls: 'gold', icon: locked ? 'lock' : 'satchel', disabled: locked || (!lab.sandbox && s.available < 5), act: 'gather-' + d.id });
      const barI = h('i', { style: { width: Math.round((lab.sandbox ? 1 : s.fraction) * 100) + '%' } });
      const meta = h('div', { class: 'meta', text: `${stock} · ${when}` });
      this.rows[d.id] = { barI, meta, g, locked, take };
      list.appendChild(h('div', { class: 'deposit parch' + (locked ? ' locked' : '') },
        rawSprite(m.wild ? m.wild.shape : 'stone', m.look || m.color, lab.sandbox ? 1 : s.fraction),
        h('div', { class: 'dep-info' },
          h('div', { class: 'title' }, m.name, d.rare ? h('span', { class: 'tag rare', text: 'rare' }) : null),
          d.place ? h('div', { class: 'meta place', text: d.place }) : null,
          h('div', { class: 'bar' }, barI),
          meta,
          h('div', { class: 'meta fx' }, ...fx.map(([k, v]) => h('span', { class: 'fx-chip', title: EFFECT_BY_KEY[k].label }, icon(EFFECT_BY_KEY[k].icon, 'sm'), ` ${Math.round(v)}`)),
            h('span', { class: 'muted', text: ` · in stores: ${Math.round(st.stock(m.id))} ml` }))),
        g));
    }
    clear(this.foot).append(`Shelf space ${st.cap.storage} ml per ingredient. ${st.has('satchel') ? 'Your satchel carries half as much again. ' : ''}Deposits regrow with time — even while the shop is closed — and recover half their stock each new day.`);
    this.paintBg();
  }

  deposits() {
    return this.lab.state.deposits.filter((d) => d.region === this.region);
  }

  paintBg() {
    const key = this.region + ':' + this.lab.state.seed;
    if (key === this.bgKey) return;
    this.bgKey = key;
    this.bg = document.createElement('canvas');
    this.bg.width = SCENE_W; this.bg.height = SCENE_H;
    paintRegion(/** @type {CanvasRenderingContext2D} */ (this.bg.getContext('2d')), this.region, this.lab.state.seed);
  }

  /** @param {any} d */
  gather(d) {
    const lab = this.lab, st = lab.state;
    const m = st.lookup(d.materialId);
    const r = lab.sandbox ? { ok: true, amount: d.take, events: [] } : st.gather(d.id);
    if (!r.ok) {
      audio.play('error');
      const why = r.reason === 'full' ? `Your shelves are full of ${m.name}.` : r.reason === 'locked' ? 'You may not gather here yet.' : `Picked clean. It regrows in ${formatWait(r.nextIn || 60000)}.`;
      toast('Nothing to gather', why, 'satchel');
      return;
    }
    audio.play('pour');
    setTimeout(() => audio.play('select'), 120);
    this.floaters.push({ x: d.x * SCENE_W, y: d.y * SCENE_H, t: 0, text: `+${r.amount}`, color: m.look || m.color, shape: m.wild ? m.wild.shape : 'stone' });
    for (const e of r.events || []) lab.announce(e);
    if (lab.tutorial) lab.tutorial.notify('gather', d.materialId);
    // a first find gets its own place on the shelf
    if (!lab.jarEls[d.materialId]) lab.buildShelf(); else lab.updateShelf();
    lab.save();
    this.refresh();
  }

  /** @param {PointerEvent} e */
  tapScene(e) {
    const r = this.canvas.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * SCENE_W, y = ((e.clientY - r.top) / r.height) * SCENE_H;
    let best = null, bd = 14 * 14;
    for (const d of this.deposits()) {
      const dx = d.x * SCENE_W - x, dy = d.y * SCENE_H - 6 - y;
      const dd = dx * dx + dy * dy;
      if (dd < bd) { bd = dd; best = d; }
    }
    if (best) this.gather(best);
  }

  /** @param {number} dt */
  frame(dt) {
    if (!this.ctx || !this.bg) return;
    this.time += dt;
    const ctx = this.ctx, st = this.lab.state, now = Date.now();
    ctx.drawImage(this.bg, 0, 0);
    animateRegion(ctx, this.region, this.time);
    const deps = this.deposits().slice().sort((a, b) => a.y - b.y);
    for (const d of deps) {
      const m = st.lookup(d.materialId);
      const s = this.lab.sandbox ? { fraction: 1 } : depositStatus(st.gathering, d, now);
      const locked = !this.lab.sandbox && d.rank > st.rank;
      const x = Math.round(d.x * SCENE_W) - 8, y = Math.round(d.y * SCENE_H) - 14;
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(x + 3, y + 14, 10, 2);
      if (locked) ctx.globalAlpha = 0.35;
      drawRaw(ctx, x, y, m.wild ? m.wild.shape : 'stone', m.look || m.color, s.fraction);
      ctx.globalAlpha = 1;
      if (!locked && s.fraction >= 0.999 && Math.sin(this.time * 3 + d.x * 20) > 0.92) { ctx.fillStyle = '#fff6e0'; ctx.fillRect(x + 12, y + 1, 1, 1); }
    }
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

  tick() {
    const lab = this.lab, st = lab.state;
    if (lab.sandbox || !this.rows) return;
    const now = Date.now();
    for (const d of this.deposits()) {
      const row = this.rows[d.id];
      if (!row) continue;
      const s = depositStatus(st.gathering, d, now);
      row.barI.style.width = Math.round(s.fraction * 100) + '%';
      const when = s.fraction >= 0.999 ? 'fully grown' : s.available >= Math.min(row.take, d.capacity) ? `regrowing · full in ${formatWait(s.fullIn)}` : `resting · ready in ${formatWait(s.nextIn)}`;
      row.meta.textContent = `${Math.floor(s.stock)} / ${d.capacity} ml · ${when}`;
      row.g.disabled = row.locked || s.available < 5;
    }
  }
}
