// Simulation-wide constants. Lengths are in simulation units (≈10 cm),
// time in seconds, temperature in °C.

export const PHASE = Object.freeze({ LIQUID: 0, POWDER: 1, PASTE: 2, SOLID: 3, GAS: 4 });
export const PHASE_NAMES = ['liquid', 'powder', 'paste', 'solid', 'gas'];

export const SIM = Object.freeze({
  /** fixed physics timestep (s) */
  DT: 1 / 120,
  /** particle radius / rest spacing */
  RADIUS: 0.05,
  SPACING: 0.1,
  /** fluid kernel radius */
  H: 0.22,
  /** gravity (units/s²) */
  GRAVITY: 34,
  /** speed limit to prevent tunnelling (≤ radius per step) */
  MAX_SPEED: 5.0,
  /** ambient room temperature */
  AMBIENT: 20,
  /** volume represented by one particle (ml) */
  ML_PER_PARTICLE: 5,
  /** the spoon's stirring influence radius (preserved from the original sandbox) */
  SPOON_RADIUS: 0.42,
  /** physical spoon bowl collider radius */
  SPOON_CORE: 0.12,
  PESTLE_RADIUS: 0.17,
  /** constraint iterations per step */
  ITERATIONS: 3,
});

/** Solver tuning parameters (mutable for experiments; defaults are the tuned values). */
export const TUNE = {
  iterations: 3,
  epsilon: 30,
  cohesionLiquid: 0.06,
  cohesionPaste: 0.1,
  kCorr: 0.003,
  viscBase: 0.08,
  viscSlope: 0.085,
  maxCorr: 0.03,
  buoyancy: 0.5,
  massPow: 2,
  viscPressure: 1,
  viscDampMax: 0.45,
  viscDampSlope: 0.22,
};

/** Initial phase of a material poured in its stored form. @param {string} form */
export function formPhase(form) {
  if (form === 'powder') return PHASE.POWDER;
  if (form === 'solid') return PHASE.SOLID;
  if (form === 'gas') return PHASE.GAS;
  return PHASE.LIQUID;
}
