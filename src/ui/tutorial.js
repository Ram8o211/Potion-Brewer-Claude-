// The guided tour: the first brew, step by step, and a visit to every room
// and control of the shop. Each step outlines the control it talks about;
// an action step waits for the player to really do it (in the simulation),
// an info step waits for "Next". The tour docks in its own strip between the
// top bar and the rooms (lab.tutorSlot), so it never covers a control.

import { h, btn, placeToasts } from './dom.js';
import { PHASE } from '../simulation/constants.js';
import { TUTORIAL_HERBS } from '../game/commissions.js';
import { thresholdToCelsius } from '../alchemy/arcane.js';
import { shortName } from '../game/customers.js';

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
    const H = TUTORIAL_HERBS, leaf = st.lookup(H.healer), arc = st.lookup(H.arcane);
    const thrC = arc && arc.arcane ? Math.round(thresholdToCelsius(arc.arcane.thr)) : 85;
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
    /** something in the cauldron has awakened (its awakened form is in the brew) */
    const awakened = () => [...lab.sim.species.slotOf.keys()].some((id) => typeof id === 'string' && id.endsWith('~a'));
    const tab = (id) => () => lab.tabEls[id] && lab.tabEls[id].b;
    const q = (sel) => () => /** @type {HTMLElement|null} */ (lab.el.querySelector(sel));
    const inView = (id) => () => lab.view === id;
    const rabbitTested = () => st.trials.records.some((r) => r.subjectId === 'rabbit' && r.batchId === st.batch.id);
    const hasSeed = () => Object.keys(st.garden.seeds).length > 0 || st.garden.plots.some((p) => p.crop);
    const sown = () => st.garden.plots.some((p) => p.crop);
    const watered = () => st.garden.plots.some((p) => p.crop && p.crop.w > 0.5);
    const who = st.current && st.current.customer ? shortName(st.current.customer.name) : 'the customer';
    return [
      // ---- 1. the shop
      { text: 'Welcome to your shop, alchemist! This tour walks you through your first day: gathering, your garden, a first brew with an Arcane ingredient, a test and a sale. Follow the glowing outline, or press Next. (☰ → Tour replays it; Skip ends it.)', button: 'Let’s begin' },
      { text: 'Your rooms: Counter (customers), Brew (the cauldron), Wilds (gathering), Garden (growing), Trials (testing on animals) and Book (recipes, notes and the ingredient encyclopedia).', target: () => lab.tabbar, button: 'Next' },
      // ---- 2–5. the Whisperwood
      { text: 'Your shelves are nearly bare. Travel to the Wilds.', target: tab('wilds'), done: inView('wilds') },
      { text: 'The Whisperwood, home of healing magic and of the fox. Every species here has a fixed rarity — Common, Uncommon, Rare, Unique or Legendary — and now and then grows in an Arcane form. Tap a Silverleaf (silvery leaves) in the picture to gather it.', target: q('.view-wilds .wilds-scene'), done: () => !!st.found[H.healer] },
      { text: `A glowing, violet-rimmed Silverleaf grows here too: an Arcane specimen. Only Arcane ingredients can awaken when a brew passes their threshold. Gather it.`, target: q('.view-wilds .wilds-scene'), done: () => !!st.found[H.arcane] },
      { text: 'Harvests sometimes drop a seed — your first Silverleaf did. Seeds keep their species and form: a Silverleaf seed always grows Silverleaf.', target: q('.view-wilds .deposits'), done: hasSeed, button: hasSeed() ? 'Next' : undefined },
      { text: 'The fox is the Whisperwood’s native creature. Three quick taps on one catch it alive for your hutch; testing potions on animals comes later.', target: q('.view-wilds .wilds-scene'), button: 'Next' },
      // ---- 6–7. the garden
      { text: 'Open your Garden.', target: tab('garden'), done: inView('garden') },
      { text: 'Choose your Silverleaf seed, then tap an empty plot to sow it.', target: q('.view-garden .seeds'), done: sown },
      { text: 'Tap the plot again (or Water all) to water it: moist soil grows faster. Your first seed grows quickly; later crops take real time, even while the game is closed.', target: q('.view-garden .plots'), done: watered },
      // ---- 8–10. the brew, and an Arcane transition
      { text: 'A customer is waiting. Open the Counter.', target: tab('counter'), done: inView('counter') },
      { text: 'The order: every line must be met — the effect and its strength, purity (nothing else above a limit) and the quantity. Press “Brew it”.', target: () => lab.el.querySelector('[data-act=go-brew]') || tab('brew')(), done: inView('brew') },
      { text: `Tap the jar of ${water.name}, then pour about 110 ml (tap 100, then 25). You can also hold a finger in the cauldron, or drag a jar onto it.`, target: () => lab.jarEls[R.water] && lab.jarEls[R.water].el, done: () => poured(R.water) >= 95 },
      { text: `Pick up the ${leaf.name} (long-press any jar to read it: rarity, effects, seeds) and pour 45 ml.`, target: () => lab.jarEls[H.healer] && lab.jarEls[H.healer].el, done: () => poured(H.healer) >= 40 && !lab.sim.emitter.pouring },
      { text: `Now the ${arc ? arc.name : 'Arcane Silverleaf'} (the jar with the violet rim): pour 15 ml.`, target: () => lab.jarEls[H.arcane] && lab.jarEls[H.arcane].el, done: () => poured(H.arcane) >= 10 && !lab.sim.emitter.pouring },
      { text: 'Choose Crush (the pestle) and drag it over the leaves at the bottom: only crushed herbs give up their magic.', target: () => lab.toolBtns.pestle, done: () => wholeSolids() <= 3 || (lab.tool === 'pestle' && (lab.sim.tool.stirDistance - (this.flags.crush0 ?? (this.flags.crush0 = lab.sim.tool.stirDistance))) > 25) },
      { text: 'Choose Stir and drag circles through the brew to spread the magic evenly.', target: () => lab.toolBtns.spoon, done: () => (lab.sim.tool.stirDistance - (this.flags.stir0 ?? (this.flags.stir0 = lab.sim.tool.stirDistance))) > 12 || lab.sim.tool.auto || brewT() >= 40 },
      { text: `The Arcane transition: slide the fire control right and heat the brew past about ${thrC} °C. Only the Arcane leaf’s magic awakens — and only the effects it carries — growing several times stronger, and it stays awake as the brew cools.`, target: () => lab.controls, done: () => awakened() || brewT() >= thrC + 1 },
      { text: 'It awoke: its particles swarm denser and brighter. Now let the brew cool a little (fire control left, or just wait).', target: () => lab.controls, done: () => brewT() <= thrC - 10 || this.flags.cooledSkip, button: 'Next' },
      // ---- 11. the trial
      { text: 'Does it really heal? A mixture is unknown until tested. Open the Trials room.', target: tab('trials'), done: inView('trials') },
      { text: 'Choose a rabbit (tap it) and press Give — or drag the dropper onto it. The dose is real potion from the cauldron’s tap.', target: () => document.querySelector('[data-act=test-rabbit]') || lab.views.trials.hutch.el, done: rabbitTested },
      { text: 'Each effect the rabbit showed, with a ± margin. One reading is a rough guess; a second animal narrows it most.', target: q('.estimate-card'), button: 'Next' },
      { text: 'Back to the cauldron.', target: tab('brew'), done: inView('brew') },
      // ---- 12–13. bottling and the sale
      { text: 'Press Bottle and choose 100 ml (the order’s quantity).', target: () => lab.bottleFab, done: () => this.flags.bottled },
      { text: `Your vial is on the counter, labelled from your trial. Press “Sell to ${who}”, agree on a price, then save the recipe.`, target: () => document.querySelector('[data-act=serve]') || tab('counter')(), done: () => this.flags.sold },
      // ---- 14–15. coins, regeneration, unlocks, the harvest
      { text: 'Your first sale! Back in the Wilds: the biome bar shows its category, dominant effect, native creature, what is left — and your Traveller Coins.', target: tab('wilds'), done: inView('wilds') },
      { text: 'The wilds never grow back by themselves. Spend a Traveller Coin on Regenerate for a new generation: new scenery, new species, new specimens. Coins recharge with time, and delighted customers sometimes give one.', target: q('.view-wilds .biome-bar'), button: 'Next' },
      { text: 'New biomes open as you serve customers and rise in rank: five more Natural ones, then the Exotic biomes with new effects — Levitation, Invisibility, Phasing, Temporal Distortion. Later customers commission harder potions: stronger, purer, several effects, awakened magic.', target: q('.view-wilds .region-tabs'), button: 'Next' },
      { text: 'Your Silverleaf should be ready by now: open the Garden and tap it to harvest.', target: tab('garden'), done: () => st.garden.harvested > 0 || this.flags.skipHarvest, button: 'Later' },
      { text: 'That is the loop: explore, gather, collect seeds, grow, brew, test and sell — and unlock more of the world. ☰ → How to play explains everything. Good luck!', target: tab('counter'), button: 'Run my shop!' },
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
