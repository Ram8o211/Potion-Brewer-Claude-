// Hand-tuned reference materials. Used by the physics test-suite, the
// developer sandbox, and as archetype anchors for the procedural generator.

import { completeMaterial } from './schema.js';

/** @type {Record<string, import('./schema.js').MaterialDef>} */
export const REF = {};

const add = (d) => (REF[d.id] = completeMaterial(d));

add({ id: 'water', name: 'Spring Water', form: 'liquid', archetype: 'water', color: [0.62, 0.8, 0.95], tint: 0.12, opacity: 0.55,
  density: 1.0, viscosity: 1, compat: [0.85, 0.1], conductivity: 1, heatCapacity: 4.2, melt: 0, boil: 100, gasDensity: 0.62, latentVapor: 380, latentFusion: 60 });
add({ id: 'oil', name: 'Lamp Oil', form: 'liquid', archetype: 'oil', color: [0.95, 0.72, 0.25], tint: 0.6, opacity: 0.75,
  density: 0.82, viscosity: 40, compat: [0.15, 0.1], conductivity: 0.3, heatCapacity: 1.8, melt: -20, boil: 280, flammability: 0.9, ignition: 230, combustionHeat: 900, smoke: 'smoke' });
add({ id: 'honey', name: 'Bog Honey', form: 'liquid', archetype: 'syrup', color: [0.9, 0.62, 0.12], tint: 0.7, opacity: 0.85,
  density: 1.42, viscosity: 6000, viscTemp: 0.045, compat: [0.78, 0.18], conductivity: 0.6, heatCapacity: 3.2, melt: -10, boil: 190 });
add({ id: 'spirit', name: 'Moon Spirit', form: 'liquid', archetype: 'spirit', color: [0.82, 0.95, 0.85], tint: 0.15, opacity: 0.4,
  density: 0.79, viscosity: 1.2, compat: [0.55, 0.15], conductivity: 0.8, heatCapacity: 2.4, melt: -110, boil: 72, gasDensity: 1.5, flammability: 0.8, ignition: 360, combustionHeat: 700, smoke: 'smoke', latentVapor: 260 });
add({ id: 'quick', name: 'Quickwater', form: 'liquid', archetype: 'metal', color: [0.78, 0.8, 0.84], tint: 0.9, opacity: 1,
  density: 3.2, viscosity: 1.5, compat: [0.5, 0.95], conductivity: 4, heatCapacity: 1.6, melt: -38, boil: 360 });
add({ id: 'red', name: 'Crimson Essence', form: 'liquid', archetype: 'essence', color: [0.86, 0.12, 0.16], tint: 1, opacity: 0.8,
  density: 1.04, viscosity: 1.5, compat: [0.82, 0.12], melt: -5, boil: 104 });
add({ id: 'blue', name: 'Azure Tincture', form: 'liquid', archetype: 'essence', color: [0.12, 0.3, 0.9], tint: 1, opacity: 0.8,
  density: 1.06, viscosity: 1.5, compat: [0.84, 0.12], melt: -5, boil: 104 });
add({ id: 'sand', name: 'River Sand', form: 'powder', archetype: 'sand', color: [0.78, 0.66, 0.45], tint: 0.6, opacity: 1,
  density: 1.6, compat: [0.8, 0.2], friction: 0.65, melt: 1500, boil: Infinity, heatCapacity: 1.3, conductivity: 0.4 });
add({ id: 'flour', name: 'Mill Dust', form: 'powder', archetype: 'binder', color: [0.93, 0.9, 0.82], tint: 0.5, opacity: 1,
  density: 1.3, compat: [0.8, 0.15], friction: 0.72, binder: 1, melt: 1500, boil: Infinity, heatCapacity: 1.6, conductivity: 0.3, flammability: 0.4, ignition: 420, combustionHeat: 400, ash: 'soot' });
add({ id: 'salt', name: 'Sun Salt', form: 'powder', archetype: 'salt', color: [0.97, 0.93, 0.98], tint: 0.2, opacity: 1,
  density: 2.1, compat: [0.86, 0.1], friction: 0.6, solubility: 0.25, solubilityTemp: 0.002, melt: 800, boil: Infinity, heatCapacity: 1.9, conductivity: 1.2 });
add({ id: 'wax', name: 'Bee Wax Flakes', form: 'powder', archetype: 'wax', color: [0.98, 0.9, 0.6], tint: 0.6, opacity: 0.95,
  density: 0.92, compat: [0.15, 0.12], friction: 0.55, viscosity: 30, melt: 62, boil: 360, heatCapacity: 2.2, conductivity: 0.3, latentFusion: 40, flammability: 0.7, ignition: 250, combustionHeat: 800, smoke: 'smoke', ash: 'soot' });
add({ id: 'crystal', name: 'Moonstone Shard', form: 'solid', archetype: 'crystal', color: [0.7, 0.75, 1.0], tint: 0.8, opacity: 1,
  density: 2.4, compat: [0.7, 0.4], friction: 0.6, melt: 1200, boil: Infinity, hardness: 0.6, heatCapacity: 2, conductivity: 1.5, aspects: [0, 0, 40, 10], glow: 0.4 });
add({ id: 'soot', name: 'Soot', form: 'powder', archetype: 'ash', color: [0.18, 0.17, 0.17], tint: 0.9, opacity: 1,
  density: 1.1, compat: [0.5, 0.3], friction: 0.7, melt: 3000, boil: Infinity, heatCapacity: 1, conductivity: 0.2 });
add({ id: 'smoke', name: 'Smoke', form: 'gas', archetype: 'smoke', color: [0.45, 0.43, 0.42], tint: 0.6, opacity: 0.6,
  density: 0.9, gasDensity: 0.9, compat: [0.5, 0.3], melt: -200, boil: -150, heatCapacity: 1.2, conductivity: 0.2 });
add({ id: 'vapor', name: 'Swamp Vapour', form: 'gas', archetype: 'gas', color: [0.5, 0.8, 0.4], tint: 0.5, opacity: 0.5,
  density: 1.1, gasDensity: 2.2, compat: [0.6, 0.3], melt: -90, boil: 8, heatCapacity: 2.0 });

/** @param {string} id */
export const refLookup = (id) => REF[id];
