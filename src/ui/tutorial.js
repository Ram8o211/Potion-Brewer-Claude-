// Guided first brew. Each step highlights the relevant control and waits for
// the player to actually perform the action in the simulation.

import { h, btn } from './dom.js';
import { PHASE } from '../simulation/constants.js';
import { TUTORIAL_HERBS } from '../game/commissions.js';

export class Tutorial {
  /** @param {import('./lab.js').LabScreen} lab */
  constructor(lab) {
    this.lab = lab;
    this.active = false;
    this.index = 0;
    this.box = null;
    this.target = null;
    this.flags = {};
  }

  get steps() {
    const lab = this.lab;
    const st = lab.state;
    const R = st.world.roles;
    const water = st.lookup(R.water);
    const H = TUTORIAL_HERBS, leaf = st.lookup(H.healer), sun = st.lookup(H.warmer);
    /** ml of an ingredient poured into this batch */
    const poured = (id) => st.brewLog.reduce((a, e) => a + (e.type === 'pour' && e.id === id ? e.ml : 0), 0);
    const brewT = () => {
      const p = lab.sim.p;
      let T = 0, n = 0;
      for (let i = 0; i < p.count; i++) if (p.phase[i] !== PHASE.GAS) { T += p.temp[i]; n++; }
      return n ? T / n : 20;
    };
    const tab = (id) => () => lab.tabEls[id] && lab.tabEls[id].b;
    const rabbitTested = () => st.trials.records.some((r) => r.subjectId === 'rabbit' && r.batchId === st.batch.id);
    return [
      { text: `Welcome to your shop, alchemist! Your very first customer is here. Let’s brew their order together — it only takes a few minutes.`, button: 'Let’s begin' },
      { text: 'This strip is the order. The temperature meter fills as your brew matches. The heart (healing) shows “?”: what a mixture really does stays unknown until you test it.', target: () => lab.strip, button: 'Got it' },
      { text: `Tap the jar of ${water.name} on the shelf to pick it up.`, target: () => lab.jarEls[R.water] && lab.jarEls[R.water].el, done: () => lab.selected === R.water },
      { text: 'Pour about 110 ml: tap the dose buttons (100, then 25) or hold your finger in the cauldron. You can also drag a jar straight onto the cauldron.', target: () => lab.doseEl, done: () => poured(R.water) >= 95 },
      { text: `Now pick up the ${leaf.name}. Long-press any jar to see what it is known to do: it heals, but carries a frosty bite.`, target: () => lab.jarEls[H.healer] && lab.jarEls[H.healer].el, done: () => lab.selected === H.healer },
      { text: 'Pour about 50 ml. The mortar grinds it first (“Ground” is lit): whole leaves would give up almost nothing.', target: () => lab.doseEl, done: () => poured(H.healer) >= 45 && !lab.sim.emitter.pouring },
      { text: `Nothing that grows is pure. Fire cancels frost, life cancels death, alkali cancels acid. Pick up the ${sun.name}: its fire will cancel the leaf’s frost.`, target: () => lab.jarEls[H.warmer] && lab.jarEls[H.warmer].el, done: () => lab.selected === H.warmer },
      { text: 'Pour about 25 ml — half as much as the leaf, so the fire and the frost balance out.', target: () => lab.doseEl, done: () => poured(H.warmer) >= 20 && !lab.sim.emitter.pouring },
      { text: 'Pick the spoon and drag it in circles through the brew. Stirring spreads colour — and magic — far faster than waiting.', target: () => lab.toolBtns.spoon, done: () => (lab.sim.tool.stirDistance - (this.flags.stir0 ?? (this.flags.stir0 = lab.sim.tool.stirDistance))) > 12 || lab.sim.tool.auto || brewT() >= 40 },
      { text: 'Herbs steep only when warm. Slide the fire control to the right and bring the brew to about 60°C — heat enters through the bottom and spreads.', target: () => lab.furnaceInput.parentElement, done: () => brewT() >= 50 },
      { text: 'Is it really a healing tonic? Nobody knows until it is tested. Open the Trials room.', target: tab('trials'), done: () => lab.view === 'trials' },
      { text: 'Choose a rabbit in the hutch and give it a dose: press Give, or drag the dropper onto it. The dose is real potion from the tap. Each rabbit reads a potion a little differently — later, test several.', target: () => document.querySelector('[data-act=test-rabbit]') || lab.views.trials.hutch.el, done: rabbitTested },
      { text: 'The rabbit shows how much vitality — and any frost or fire left over — this batch carries. Verified effects now count on the order. Back to the cauldron!', target: tab('brew'), done: () => lab.view === 'brew' },
      { text: 'Let it cool to a warm 45°C or so, then press Bottle. A bottle can go to the counter or onto your potion shelves for later.', target: () => lab.bottleFab, done: () => this.flags.bottled },
      { text: 'Your sealed vial waits at the Counter. Offer it to the customer: seal its label (your trial reading is already written in), then agree on a price.', target: () => document.querySelector('[data-act=serve]') || tab('counter')(), done: () => this.flags.sold },
      { text: 'Splendid — your first sale! New orders ask for strength, love, fire… Every herb carries side effects: gather in the Wilds, balance them against their opposites, test every mixture in the Trials room and save good recipes in your Book.', button: 'Run my shop!' },
    ];
  }

  start(restart = false) {
    if (restart) {
      this.lab.state.tutorial.done = false;
    }
    this.active = true;
    this.index = 0;
    this.flags = {};
    this.lab.state.tutorial.active = true;
    this.show();
  }

  stop() {
    this.active = false;
    this.clearUi();
  }

  finish() {
    this.stop();
    this.lab.state.tutorial.active = false;
    this.lab.state.tutorial.done = true;
  }

  clearUi() {
    if (this.box) this.box.remove();
    this.box = null;
    if (this.target) this.target.classList.remove('highlight');
    this.target = null;
  }

  show() {
    this.clearUi();
    const steps = this.steps;
    const s = steps[this.index];
    if (!s) { this.finish(); return; }
    if (s.hidden) return;
    const lab = this.lab;
    const actions = h('div', { class: 'tutor-actions' },
      btn('Skip tutorial', () => this.finish(), { act: 'tutorial-skip' }),
      s.button ? btn(s.button, () => this.advance(), { cls: 'primary', act: 'tutorial-next' }) : h('span', { class: 'small muted', text: `Step ${this.index + 1} of ${steps.length}` }),
    );
    this.box = h('div', { class: 'tutor parch', role: 'note' }, h('div', { text: s.text }), actions);
    lab.el.appendChild(this.box);
    const t = s.target ? s.target() : null;
    if (t) { t.classList.add('highlight'); this.target = t; }
    this.place();
  }

  place() {
    if (!this.box) return;
    const lab = this.lab;
    const area = lab.view === 'brew' ? lab.stageEl : lab.viewsEl;
    const sr = area.getBoundingClientRect();
    const lr = lab.el.getBoundingClientRect();
    const bw = this.box.offsetWidth;
    // keep the box over the top of the current room, clear of the controls
    this.box.style.left = Math.max(8, Math.min(lr.width - bw - 8, sr.left - lr.left + (sr.width - bw) / 2)) + 'px';
    const t = this.target && this.target.getBoundingClientRect();
    const top = sr.top - lr.top + 8;
    // never cover the highlighted control
    this.box.style.top = (t && t.top - lr.top < top + this.box.offsetHeight + 8 && t.bottom - lr.top > top ? Math.max(8, t.bottom - lr.top + 8) : Math.max(8, top)) + 'px';
  }

  advance() {
    this.index++;
    this.show();
  }

  /** @param {string} kind @param {any} [data] */
  notify(kind, data) {
    if (!this.active) return;
    if (kind === 'bottle') this.flags.bottled = true;
    if (kind === 'view') {
      // the closing note never blocks a room the player has moved on to
      if (this.index === this.steps.length - 1) { this.finish(); return; }
      this.show();
    }
    if (kind === 'sold') { this.flags.sold = true; }
    void data;
  }

  update() {
    if (!this.active) return;
    const s = this.steps[this.index];
    if (!s) return;
    if (s.done && s.done()) this.advance();
    else if (this.box && Math.random() < 0.05) {
      // targets can be rebuilt (room refreshes): re-attach the highlight
      const t = s.target ? s.target() : null;
      if (t && t !== this.target) { if (this.target) this.target.classList.remove('highlight'); t.classList.add('highlight'); this.target = t; }
      this.place();
    }
  }
}
