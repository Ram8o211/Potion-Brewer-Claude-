// The guided tour: the first order from start to finish — gathering in the
// Whisperwood, catching its creature, brewing with an arcane awakening,
// testing and selling — and the shop's other features in a line each. Each step outlines the control it talks about;
// an action step waits for the player to really do it (in the simulation),
// an info step waits for "Next". The tour docks in its own strip between the
// top bar and the rooms (lab.tutorSlot), so it never covers a control.

import { h, btn, placeToasts } from './dom.js';
import { PHASE } from '../simulation/constants.js';
import { TUTORIAL_HERBS } from '../game/commissions.js';
import { shortName } from '../game/customers.js';
import { KINDS } from '../game/kinds.js';
import { REGION_BY_ID } from '../game/gathering.js';

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

  /**
   * The steps. `text` says what to look at or do; `target` is the control to
   * outline; `done` (action steps) advances once the player has done it;
   * `button` (info steps) labels the button that moves on.
   * @returns {{text:string, target?:()=>any, done?:()=>boolean, button?:string}[]}
   */
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
    /** whole herbs and stones still in the pot */
    const wholeSolids = () => {
      const p = lab.sim.p;
      let n = 0;
      for (let i = 0; i < p.count; i++) if (p.phase[i] === PHASE.SOLID) n++;
      return n;
    };
    const tab = (id) => () => lab.tabEls[id] && lab.tabEls[id].b;
    const q = (sel) => () => /** @type {HTMLElement|null} */ (lab.el.querySelector(sel));
    const inView = (id) => () => lab.view === id;
    const who = st.current && st.current.customer ? shortName(st.current.customer.name) : 'the customer';
    const gathered = () => !!this.flags.gathered;
    const awakened = () => !!st.achievements.awaken || this.flags.awoke || brewT() >= 84;
    const creature = KINDS[REGION_BY_ID.forest.creature];
    return [
      // ---- the order
      { text: 'Welcome, alchemist! Your first customer needs a healing draught. Follow the glow: do what it asks, or press Next.', button: 'Let’s begin' },
      { text: 'Open the Counter.', target: tab('counter'), done: inView('counter') },
      { text: 'The order: the effect and its strength, “Pure” (nothing else above the limit) and the bottle. Later customers lose patience — the bar under their portrait.', target: q('.customer-card .req-grid'), button: 'Next' },
      // ---- gathering and hunting
      { text: 'Herbs come from the wilds. Open the Wilds.', target: tab('wilds'), done: inView('wilds') },
      { text: 'The Whisperwood: everything here heals. Swipe across a plant to shake it, then tap what falls to gather it.', target: q('.view-wilds .scene-wrap'), done: gathered },
      { text: `A ${creature.noun} lives here — the creature of this land. Tap one three times, quickly, to catch it alive: ${creature.plural} read ${REGION_BY_ID.forest.effect} more steadily than any rabbit.`, target: q('.view-wilds .scene-wrap'), done: () => !!this.flags.caught },
      { text: 'Nothing grows back. When a land is picked clean, Travel spends a traveller coin on a new expedition. Coins return with time — and happy customers tip them.', target: q('[data-act=expedition]'), button: 'Next' },
      // ---- the brew
      { text: 'To the cauldron.', target: tab('brew'), done: inView('brew') },
      { text: `Tap the ${water.name}.`, target: () => lab.jarEls[R.water] && lab.jarEls[R.water].el, done: () => lab.selected === R.water },
      { text: 'Pour about 110 ml: 100, then 25 (or hold a finger in the pot).', target: () => lab.doseEl, done: () => poured(R.water) >= 95 },
      { text: `Pick up the ${leaf.name} (long-press any jar to read it): it heals, with a frosty bite.`, target: () => lab.jarEls[H.healer] && lab.jarEls[H.healer].el, done: () => lab.selected === H.healer },
      { text: 'Pour 50 ml. Whole leaves give up almost nothing — you will crush them.', target: () => lab.doseEl, done: () => poured(H.healer) >= 45 && !lab.sim.emitter.pouring },
      { text: `Opposites cancel: fire–frost, life–death, acid–alkali. The ${sun.name} heals too, with a fire that cancels the frost. Pick it up.`, target: () => lab.jarEls[H.warmer] && lab.jarEls[H.warmer].el, done: () => lab.selected === H.warmer },
      { text: 'Pour about 45 ml (25, then 25): its fire balances the leaf’s frost.', target: () => lab.doseEl, done: () => poured(H.warmer) >= 40 && !lab.sim.emitter.pouring },
      { text: 'Choose Crush and drag the pestle over the pieces at the bottom.', target: () => lab.toolBtns.pestle, done: () => wholeSolids() <= 3 || (lab.tool === 'pestle' && (lab.sim.tool.stirDistance - (this.flags.crush0 ?? (this.flags.crush0 = lab.sim.tool.stirDistance))) > 25) },
      { text: 'Choose Stir and drag circles: the magic spreads evenly.', target: () => lab.toolBtns.spoon, done: () => (lab.sim.tool.stirDistance - (this.flags.stir0 ?? (this.flags.stir0 = lab.sim.tool.stirDistance))) > 12 || lab.sim.tool.auto || brewT() >= 40 },
      { text: 'Herbs steep when warm: slide the fire right and bring the brew to about 60 °C.', target: () => lab.controls, done: () => brewT() >= 55 },
      { text: 'Arcane awakening: magic sleeps until the brew passes its threshold. Keep heating to about 85 °C — the sparks grow bolder as it wakes, several times stronger, and it stays awake.', target: () => lab.controls, done: awakened },
      { text: 'Now slide the fire back to Off. Tap the ml · °C readout to see what is inside.', target: () => lab.controls, button: 'Next' },
      // ---- the trial
      { text: 'Does it heal? Test it. Open Trials.', target: tab('trials'), done: inView('trials') },
      { text: `Tap an animal (your ${creature.noun} reads healing best) and press Give, or drag the dropper onto it.`, target: () => document.querySelector('[data-act=test-rabbit]') || lab.views.trials.hutch.el, done: () => st.trials.records.some((r) => r.batchId === st.batch.id) },
      { text: 'Each effect with its ± margin. More animals narrow it; cautious customers want that.', target: q('.estimate-card'), button: 'Next' },
      // ---- selling
      { text: 'Back to the cauldron.', target: tab('brew'), done: inView('brew') },
      { text: 'Press Bottle and choose 100 ml.', target: () => lab.bottleFab, done: () => this.flags.bottled },
      { text: `Press “Sell to ${who}”, agree a price, and save the recipe.`, target: () => document.querySelector('[data-act=serve]') || tab('counter')(), done: () => this.flags.sold },
      { text: 'Your first sale! They come back tomorrow to say how it worked. Unsold bottles keep on the shelves.', target: () => lab.el.querySelector('.view-counter .shelf-card') || tab('counter')(), button: 'Next' },
      // ---- the rest
      { text: 'More lands: buy a land’s map in the Wilds (tabs). Each has its own magic and creature; the exotic lands hold the rarest.', target: tab('wilds'), button: 'Next' },
      { text: 'Some customers order something harder to collect days later — accept only what your lands, shelves and skill can make.', target: tab('counter'), button: 'Next' },
      { text: 'The Book keeps recipes, trials, laws, ingredients and notes; the Shop sells equipment.', target: tab('book'), button: 'Next' },
      { text: 'A day: gather at dawn, open the door, brew, test, bottle, sell, close at dusk. ☰ → How to play explains the rest. Good luck!', target: tab('counter'), button: 'Run my shop!' },
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
    this.lab.el.classList.remove('touring');
    if (this.target) this.target.classList.remove('highlight');
    this.target = null;
    placeToasts();
  }

  show() {
    this.clearUi();
    const steps = this.steps;
    const s = steps[this.index];
    if (!s) { this.finish(); return; }
    const lab = this.lab;
    const actions = h('div', { class: 'tutor-actions' },
      h('span', { class: 'tutor-step', text: `${this.index + 1}/${steps.length}` }),
      btn('End tour', () => this.finish(), { act: 'tutorial-skip', title: 'End the guided tour (restart it from ☰ Menu)' }),
      s.button
        ? btn(s.button, () => this.advance(), { cls: 'primary', act: 'tutorial-next' })
        : btn('Skip step', () => this.advance(), { act: 'tutorial-skip-step', title: 'Move on without doing this step' }),
    );
    this.box = h('div', { class: 'tutor parch' + (s.button ? '' : ' waiting'), role: 'note' }, h('div', { class: 'tutor-text', text: s.text }), actions);
    lab.tutorSlot.appendChild(this.box);
    lab.el.classList.add('touring');
    const t = s.target ? s.target() : null;
    if (t) { t.classList.add('highlight'); this.target = t; }
    placeToasts();
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
    if (kind === 'gather') this.flags.gathered = true;
    if (kind === 'caught') this.flags.caught = true;
    if (kind === 'awaken') this.flags.awoke = true;
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
    }
  }
}
