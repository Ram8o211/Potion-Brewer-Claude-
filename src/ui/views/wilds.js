// The wilds: travel between regions, tap deposits in the scene (or use the
// list) to gather raw ingredients into the shop's stores. Deposits are
// finite and regrow with real time; nothing here runs while you brew. What a
// harvest brings depends on the method and tool, the hour (dawn / midday /
// dusk follow the shop's customers), the weather and how thoroughly you
// strip the deposit (game/gathering.js).

import { h, btn, clear, toast } from '../dom.js';
import { icon } from '../icons.js';
import { audio } from '../../audio/audio.js';
import { REGIONS, depositStatus, formatWait, gatherPlan, harvestable, dayPart, weatherOn, DAY_PART_NAME } from '../../game/gathering.js';
import { equipmentById } from '../../game/equipment.js';
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
    /** strip deposits for twice the yield (they regrow at half speed) */
    this.thorough = false;
    this.rain = [];
  }

  build() {
    const el = clear(this.el);
    this.tabs = h('div', { class: 'region-tabs', role: 'tablist' });
    this.sky = h('div', { class: 'wilds-sky small' });
    this.canvas = /** @type {HTMLCanvasElement} */ (h('canvas', { width: String(SCENE_W), height: String(SCENE_H), class: 'scene', 'aria-label': 'Region scene: tap a deposit to gather' }));
    this.ctx = /** @type {CanvasRenderingContext2D} */ (this.canvas.getContext('2d'));
    this.canvas.addEventListener('pointerdown', (e) => this.tapScene(e));
    this.info = h('div', { class: 'region-info small' });
    this.list = h('div', { class: 'deposits' });
    this.foot = h('div', { class: 'small muted wilds-foot' });
    // the scene and its caption form one column, so a landscape phone can
    // keep the scene in view beside the deposit list
    el.append(this.tabs, h('div', { class: 'wilds-scene' }, h('div', { class: 'scene-wrap' }, this.canvas), this.info), h('div', { class: 'wilds-list' }, this.sky, this.list, this.foot));
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
    // the hour, the weather and how hard to harvest
    const weather = weatherOn(st.seed, st.day), part = dayPart(st);
    const mode = (t, on, act) => btn(t, () => { this.thorough = on; audio.play('click'); this.refresh(); }, { cls: 'small' + (this.thorough === on ? ' active' : ''), act });
    clear(this.sky).append(...[
      h('div', { class: 'row wrap sky-row' },
        icon(part === 'dawn' ? 'sun' : part === 'dusk' ? 'wisp' : 'sun', 'sm'), h('b', { text: lab.sandbox ? 'Any hour' : DAY_PART_NAME[part] }),
        lab.sandbox ? null : h('span', { class: 'muted', text: part === 'dawn' ? '(the first customer of the day)' : part === 'dusk' ? '(the last customer, and after closing)' : '' }),
        h('span', { class: 'spacer' }), icon(weather.icon, 'sm'), h('b', { text: lab.sandbox ? '' : weather.name })),
      lab.sandbox || weather.id === 'clear' ? null : h('div', { class: 'muted', text: weather.desc }),
      h('div', { class: 'row wrap seg harvest-mode' }, h('span', { text: 'Harvest:' }), mode('Careful', false, 'harvest-careful'), mode('Thorough ×2', true, 'harvest-thorough'),
        this.thorough ? h('span', { class: 'muted', text: 'strips the deposit: it regrows at half speed' }) : null)].filter(Boolean));
    this.rows = {};
    for (const d of this.deposits()) {
      const m = st.lookup(d.materialId);
      const s = depositStatus(st.gathering, d, now);
      const locked = !lab.sandbox && d.rank > st.rank;
      const plan = gatherPlan(st, d, m, { thorough: this.thorough });
      const can = lab.sandbox ? d.take : harvestable(st.gathering, d, plan, now);
      const take = lab.sandbox ? d.take : can || plan.take;
      const fx = Object.entries(m.effects || {}).filter(([, v]) => Math.abs(v) >= 5).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1])).slice(0, 3);
      const stock = lab.sandbox ? '∞' : `${Math.floor(s.stock)} / ${d.capacity} ml`;
      const when = lab.sandbox ? 'never runs out' : this.when(s, can, plan);
      const g = btn(locked ? RANKS[d.rank].name : `${plan.method.verb} +${take} ml`, () => this.gather(d), { cls: 'gold', icon: locked ? 'lock' : plan.method.icon, disabled: locked || (!lab.sandbox && can < 5), act: 'gather-' + d.id });
      const barI = h('i', { style: { width: Math.round((lab.sandbox ? 1 : s.fraction) * 100) + '%' } });
      const meta = h('div', { class: 'meta', text: `${stock} · ${when}` });
      this.rows[d.id] = { barI, meta, g, locked, take };
      const notes = lab.sandbox ? [] : plan.factors.filter((f) => f.why !== 'satchel' && !f.why.startsWith('thorough')).map((f) => f.why);
      const tool = plan.method.tool ? equipmentById(plan.method.tool) : null;
      list.appendChild(h('div', { class: 'deposit parch' + (locked ? ' locked' : '') + (s.scarred ? ' scarred' : '') },
        rawSprite(m.wild ? m.wild.shape : 'stone', m.look || m.color, lab.sandbox ? 1 : s.fraction),
        h('div', { class: 'dep-info' },
          h('div', { class: 'title' }, m.name, d.rare ? h('span', { class: 'tag rare', text: 'rare' }) : null, plan.hour ? h('span', { class: 'tag hour', text: plan.hour }) : null),
          d.place ? h('div', { class: 'meta place', text: d.place }) : null,
          h('div', { class: 'bar' }, barI),
          meta,
          notes.length ? h('div', { class: 'meta note', text: notes.join(' · ') }) : null,
          !lab.sandbox && tool && !plan.hasTool ? h('div', { class: 'meta muted', text: `${tool.name}: ${tool.price} coins at the shop` }) : null,
          h('div', { class: 'meta fx' }, ...fx.map(([k, v]) => h('span', { class: 'fx-chip', title: EFFECT_BY_KEY[k].label }, icon(EFFECT_BY_KEY[k].icon, 'sm'), ` ${Math.round(v)}`)),
            h('span', { class: 'muted', text: ` · in stores: ${Math.round(st.stock(m.id))} ml` }))),
        g));
    }
    clear(this.foot).append(`Shelf space ${st.cap.storage} ml per ingredient. ${st.has('satchel') ? 'Your satchel carries half as much again. ' : ''}Deposits regrow with time — even while the shop is closed — and recover half their stock each new day (a stripped one, a quarter). Dawn and dusk follow your customers: the first of the day comes at dawn, the last at dusk.`);
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
    const plan = gatherPlan(st, d, m, { thorough: this.thorough });
    const r = lab.sandbox ? { ok: true, amount: d.take, events: [] } : st.gather(d.id, { thorough: this.thorough });
    if (!r.ok) {
      audio.play('error');
      const why = r.reason === 'full' ? `Your shelves are full of ${m.name}.` : r.reason === 'locked' ? 'You may not gather here yet.' : r.reason === 'reserve' ? 'Careful hands leave the rest to regrow. A thorough harvest would strip it — and it would regrow slowly.' : `Picked clean. It regrows in ${formatWait(r.nextIn || 60000)}.`;
      toast('Nothing to gather', why, 'satchel');
      return;
    }
    audio.play(plan.method.sound);
    setTimeout(() => audio.play('select'), 140);
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

  /** How a deposit is doing, in words. @param {any} s status @param {number} can @param {any} plan */
  when(s, can, plan) {
    if (s.fraction >= 0.999) return 'fully grown';
    const growing = `regrowing${s.scarred ? ' slowly' : ''} · full in ${formatWait(s.fullIn)}`;
    if (can >= 5) return growing;
    return s.stock > plan.reserve ? `left to regrow · ${growing}` : `resting · full in ${formatWait(s.fullIn)}`;
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
      row.meta.textContent = `${Math.floor(s.stock)} / ${d.capacity} ml · ${this.when(s, can, plan)}`;
      row.g.disabled = row.locked || can < 5;
    }
  }
}
