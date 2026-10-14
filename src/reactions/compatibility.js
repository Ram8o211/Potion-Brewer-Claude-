// Miscibility. Each material has a 2-D compatibility vector (think: polarity
// and "aetheric" character). Blends of nearby vectors mix; distant vectors
// stay separate and stratify by density. A blend's vector is the
// volume-weighted mean, so a mediating ingredient can act as a co-solvent.

export const COMPAT_FULL = 0.26;
export const COMPAT_NONE = 0.4;
/**
 * Heat helps mixing: both limits widen by this much per °C above room
 * temperature, so liquids that stay apart when cold blend when hot (and,
 * once blended, stay blended: the mixture sits between them).
 */
export const HEAT_MIX = 0.0028;

/** Compatibility factor 0..1 from two vectors. */
export function compatFactor(a1, b1, a2, b2) {
  const d = Math.hypot(a1 - a2, b1 - b2);
  if (d <= COMPAT_FULL) return 1;
  if (d >= COMPAT_NONE) return 0;
  return 1 - (d - COMPAT_FULL) / (COMPAT_NONE - COMPAT_FULL);
}

/** Compatibility factor at temperature T (°C). */
export function compatFactorT(a1, b1, a2, b2, T) {
  const d = Math.hypot(a1 - a2, b1 - b2);
  const w = T > 20 ? HEAT_MIX * (T - 20) : 0;
  const full = COMPAT_FULL + w, none = COMPAT_NONE + w;
  if (d <= full) return 1;
  if (d >= none) return 0;
  return 1 - (d - full) / (none - full);
}

/** Temperature at which two vectors blend completely (°C), or Infinity if they already do at 20°C. */
export function fullMixTemperature(c1, c2) {
  const d = Math.hypot(c1[0] - c2[0], c1[1] - c2[1]);
  if (d <= COMPAT_FULL) return -Infinity;
  return 20 + (d - COMPAT_FULL) / HEAT_MIX;
}

/** @param {{compat:number[]}} m1 @param {{compat:number[]}} m2 */
export function miscible(m1, m2) {
  return compatFactor(m1.compat[0], m1.compat[1], m2.compat[0], m2.compat[1]) > 0.5;
}
