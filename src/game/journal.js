// Turns simulation events into discoveries: journal entries and achievements.

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
      if (m) state.learn(e.id, 'seen', true);
      break;
    }
    case 'phase': {
      const id = e.species;
      if (!id) break;
      const T = Math.round(e.temp);
      if (e.to === 'gas') {
        add({ key: `boil:${id}`, title: `${name(id)} boils`, text: `It turned to vapour at about ${T}°C. Magic that boils away is lost unless the lid keeps it in.`, kind: 'phase', material: id });
        achievements.push(...state.unlock('boil'));
      } else if (e.to === 'solid') {
        add({ key: `freeze:${id}`, title: `${name(id)} freezes`, text: `It froze solid at about ${T}°C. A frozen brew cannot be stirred: crush it or let it thaw.`, kind: 'phase', material: id });
        achievements.push(...state.unlock('frozen'));
      }
      break;
    }
    case 'transmute': {
      add({ key: 'transmute', title: 'A super transition', text: 'The brew crossed its super-transition temperature: its whole magic poured into a single property and the rest vanished. Blends average the thresholds of their ingredients, weighted by their magic.', kind: 'magic' });
      achievements.push(...state.unlock('super'));
      break;
    }
    case 'fade': {
      add({ key: 'fade', title: 'Fading magic', text: 'Overheated, the brew’s magic began to burn away. Every blend has a fading temperature: the magic-weighted mean of its ingredients’.', kind: 'magic' });
      achievements.push(...state.unlock('fade'));
      break;
    }
    case 'heatmix': {
      add({ key: `heatmix:${e.a}:${e.b}`, title: 'Blended by heat', text: `${name(e.a)} and ${name(e.b)} kept apart while cold but blended once hot — and stay blended.`, kind: 'mixing', material: e.a });
      achievements.push(...state.unlock('heatmix'));
      break;
    }
    case 'ignite': {
      const id = e.species;
      add({ key: `fire:${id}`, title: `${name(id)} burns`, text: 'It caught fire where it met the air. Burnt magic is gone for good. Closing the lid starves the flame.', kind: 'fire', material: id });
      achievements.push(...state.unlock('fire'));
      break;
    }
    case 'crush':
      achievements.push(...state.unlock('crush'));
      add({ key: 'crush', title: 'Smashing stones', text: 'The pestle smashes whole stones into powder without losing any. Only powder dissolves, and hot water draws out far more magic.', kind: 'tool' });
      break;
    case 'layers': {
      add({ key: `layers:${e.a}:${e.b}`, title: 'Separate layers', text: `${name(e.a)} and ${name(e.b)} refuse to blend while cold and settle into layers. Heat helps them blend.`, kind: 'mixing', material: e.a });
      break;
    }
  }
  return { entries, achievements };
}
