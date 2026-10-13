// Turns simulation events into discoveries: journal entries, learned
// material facts (revealed in the ingredient inspector) and achievements.

/**
 * @param {import('./state.js').GameState} state
 * @param {any} e simulation event
 * @returns {{entries: any[], achievements: any[]}}
 */
export function processEvent(state, e) {
  const entries = [];
  const achievements = [];
  const L = state.lookup;
  const name = (id) => (id && L(id) ? L(id).name : 'a mixture');
  const add = (entry) => {
    const r = state.discover(entry);
    if (r) entries.push(r);
  };
  switch (e.type) {
    case 'pourEnd': {
      const m = L(e.id);
      if (m) {
        state.learn(e.id, 'seen', true);
        add({ key: 'ing:' + e.id, title: m.name, text: m.description, kind: 'ingredient', material: e.id });
      }
      break;
    }
    case 'phase': {
      const id = e.species;
      if (!id) break;
      const T = Math.round(e.temp);
      if (e.to === 'gas') {
        state.learn(id, 'boil', T);
        add({ key: `boil:${id}`, title: `${name(id)} boils`, text: `${name(id)} turned to vapour at about ${T}°C. With the lid on, the vapour gathers under it and can condense again.`, kind: 'phase', material: id });
        achievements.push(...state.unlock('boil'));
      } else if (e.from === 'gas') {
        add({ key: `condense:${id}`, title: `${name(id)} condenses`, text: `Vapour of ${name(id)} condensed back into droplets on a cool surface.`, kind: 'phase', material: id });
        achievements.push(...state.unlock('condense'));
      } else if (e.to === 'solid') {
        state.learn(id, 'melt', T);
        add({ key: `freeze:${id}`, title: `${name(id)} freezes`, text: `${name(id)} froze solid at about ${T}°C, forming a block shaped like the liquid. The pestle can crush it.`, kind: 'phase', material: id });
        achievements.push(...state.unlock('frozen'));
      } else if (e.from === 'solid' || (e.from === 'powder' && e.to !== 'powder')) {
        state.learn(id, 'melt', T);
        add({ key: `melt:${id}`, title: `${name(id)} melts`, text: `${name(id)} melted at about ${T}°C.`, kind: 'phase', material: id });
      }
      break;
    }
    case 'paste': {
      const id = e.species;
      if (e.binder > 0.4) {
        add({ key: `dough:${id}`, title: 'A dough forms', text: `Kneading the powder with liquid turned it into a thick, cohesive dough. More liquid thins it into a paste and eventually a liquid.`, kind: 'mixing', material: id });
        achievements.push(...state.unlock('dough'));
      }
      break;
    }
    case 'dissolve': {
      const id = e.species;
      if (id) {
        state.learn(id, 'soluble', true);
        add({ key: `dissolve:${id}`, title: `${name(id)} dissolves`, text: `${name(id)} dissolved into the liquid. Heat and stirring make it dissolve faster.`, kind: 'mixing', material: id });
      }
      break;
    }
    case 'reaction': {
      const rule = state.world.reactions.find((r) => r.id === e.rule);
      if (!rule) break;
      const prods = rule.products.map((p) => name(p.id)).join(' and ');
      const before = state.reactionsDiscovered();
      add({
        key: `reaction:${rule.id}`,
        title: `Reaction: ${rule.name}`,
        text: `${name(rule.a)}${rule.b ? ' + ' + name(rule.b) : ''} → ${prods}. ${rule.minT > -20 ? `Needs at least ${rule.minT}°C` : `Needs cold below ${rule.maxT}°C`}${rule.maxT < 200 && rule.minT > -20 ? ` and stops above ${rule.maxT}°C` : ''}. ${rule.heat > 50 ? 'It releases a lot of heat!' : rule.heat < 0 ? 'It draws heat in.' : ''} ${rule.hint || ''}`,
        kind: 'reaction',
        material: rule.products[0].id,
      });
      for (const p of rule.products) state.learn(p.id, 'seen', true);
      if (/^rw_(steep|infuse)/.test(rule.id)) achievements.push(...state.unlock('steep'));
      const after = state.reactionsDiscovered();
      if (after > before) {
        if (after >= 1) achievements.push(...state.unlock('react1'));
        if (after >= 5) achievements.push(...state.unlock('react5'));
        if (after >= 10) achievements.push(...state.unlock('react10'));
      }
      break;
    }
    case 'ignite': {
      const id = e.species;
      add({ key: `fire:${id}`, title: `${name(id)} burns`, text: `${name(id)} caught fire where it met the air. Fire needs oxygen — closing the lid starves it.`, kind: 'fire', material: id });
      if (id) state.learn(id, 'flammable', true);
      achievements.push(...state.unlock('fire'));
      break;
    }
    case 'spark':
      add({ key: 'spark', title: 'A galvanic spark', text: 'Charge leapt between touching matter. Conductive brews (brine, metals) carry electric charge; oil and pure spirits insulate. Moving charge warms what it passes through.', kind: 'tool' });
      break;
    case 'crush':
      achievements.push(...state.unlock('crush'));
      add({ key: 'crush', title: 'Crushing', text: 'The pestle breaks solid blocks and crystals into grains without losing any material.', kind: 'tool' });
      break;
    case 'layers': {
      add({ key: `layers:${e.a}:${e.b}`, title: 'Immiscible layers', text: `${name(e.a)} and ${name(e.b)} refuse to mix and separate into layers by density.`, kind: 'mixing', material: e.a });
      state.learn(e.a, 'immiscible', true);
      achievements.push(...state.unlock('layers'));
      break;
    }
  }
  return { entries, achievements };
}
