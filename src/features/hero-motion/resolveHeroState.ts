import { HERO_MOTION } from "./heroMotion.config";
import type { HeroMotionState } from "./heroMotion.types";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export function resolveHeroState(rawXRatio: number, previous: HeroMotionState): HeroMotionState {
  const x = clamp01(rawXRatio);
  const { lightsStart, hysteresis } = HERO_MOTION;

  if (previous === "finishedLights") {
    if (x >= lightsStart - hysteresis) return "finishedLights";
    return "sketchReveal";
  }

  if (previous === "sketchReveal") {
    if (x >= lightsStart + hysteresis) return "finishedLights";
    return "sketchReveal";
  }

  if (x >= lightsStart) return "finishedLights";
  return "sketchReveal";
}
