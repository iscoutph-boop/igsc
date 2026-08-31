import { HERO_MOTION } from "./heroMotion.config";
import type { HeroMotionState } from "./heroMotion.types";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export function resolveHeroState(rawXRatio: number, previous: HeroMotionState): HeroMotionState {
  const x = clamp01(rawXRatio);
  const { sketchStart, lightsStart, hysteresis } = HERO_MOTION;

  if (previous === "finishedLights") {
    if (x >= lightsStart - hysteresis) return "finishedLights";
    return x >= sketchStart ? "sketchReveal" : "idle";
  }

  if (previous === "sketchReveal") {
    if (x < sketchStart - hysteresis) return "idle";
    if (x >= lightsStart + hysteresis) return "finishedLights";
    return "sketchReveal";
  }

  if (x >= lightsStart) return "finishedLights";
  if (x >= sketchStart) return "sketchReveal";
  return "idle";
}
