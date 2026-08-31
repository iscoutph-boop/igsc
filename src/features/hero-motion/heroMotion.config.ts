export const HERO_MOTION = {
  enabled: true,
  sketchStart: 0.36,
  lightsStart: 0.63,
  hysteresis: 0.015,
  revealDiameter: "clamp(180px, 16vw, 240px)",
  sketchIntentMs: 40,
  sketchExitMs: 140,
  lightsIntentMs: 70,
  lightsSettledMs: 420,
} as const;
