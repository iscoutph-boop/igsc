import type { PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { HERO_MOTION } from "./heroMotion.config";
import type { HeroMotionState, HeroPointerSample } from "./heroMotion.types";
import { resolveHeroState } from "./resolveHeroState";

interface UseHeroMotionOptions {
  enabled: boolean;
  reducedMotion: boolean;
}
interface MotionPoint extends HeroPointerSample {
  width: number;
  height: number;
}

function stateIntentDelay(
  next: HeroMotionState,
  previous: HeroMotionState,
  reducedMotion: boolean,
) {
  if (reducedMotion) return 0;
  if (next === "finishedLights") return HERO_MOTION.lightsIntentMs;
  if (next === "sketchReveal" && previous === "idle") return HERO_MOTION.sketchIntentMs;
  if (next === "idle") return HERO_MOTION.sketchExitMs;
  return 0;
}

export function useHeroMotion({ enabled, reducedMotion }: UseHeroMotionOptions) {
  const [state, setState] = useState<HeroMotionState>("idle");
  const layerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<HeroMotionState>("idle");
  const pendingStateRef = useRef<HeroMotionState | null>(null);
  const intentTimerRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);
  const targetRef = useRef<MotionPoint | null>(null);
  const currentRef = useRef<MotionPoint | null>(null);

  const clearIntent = useCallback(() => {
    if (intentTimerRef.current !== null) window.clearTimeout(intentTimerRef.current);
    intentTimerRef.current = null;
    pendingStateRef.current = null;
  }, []);

  const commitState = useCallback((next: HeroMotionState) => {
    pendingStateRef.current = null;
    intentTimerRef.current = null;
    if (stateRef.current === next) return;
    stateRef.current = next;
    setState(next);
  }, []);

  const scheduleState = useCallback(
    (next: HeroMotionState) => {
      if (next === stateRef.current) {
        clearIntent();
        return;
      }
      if (pendingStateRef.current === next) return;
      clearIntent();
      pendingStateRef.current = next;
      intentTimerRef.current = window.setTimeout(
        () => commitState(next),
        stateIntentDelay(next, stateRef.current, reducedMotion),
      );
    },
    [clearIntent, commitState, reducedMotion],
  );

  const animate = useCallback(() => {
    frameRef.current = null;
    const target = targetRef.current;
    const layer = layerRef.current;
    if (!target || !layer) return;
    const current = currentRef.current ?? { ...target };
    const smoothing = reducedMotion ? 1 : 0.28;
    const nextX = current.x + (target.x - current.x) * smoothing;
    const nextY = current.y + (target.y - current.y) * smoothing;
    currentRef.current = { ...target, x: nextX, y: nextY };
    const xPercent = (nextX / target.width) * 100;
    const yPercent = (nextY / target.height) * 100;
    layer.style.setProperty("--hero-reveal-x", `${Number(xPercent.toFixed(3))}%`);
    layer.style.setProperty("--hero-reveal-y", `${Number(yPercent.toFixed(3))}%`);
    if (Math.hypot(target.x - nextX, target.y - nextY) <= 0.25) {
      currentRef.current = { ...target };
      layer.style.setProperty(
        "--hero-reveal-x",
        `${Number(((target.x / target.width) * 100).toFixed(3))}%`,
      );
      layer.style.setProperty(
        "--hero-reveal-y",
        `${Number(((target.y / target.height) * 100).toFixed(3))}%`,
      );
      return;
    }
    frameRef.current = window.requestAnimationFrame(animate);
  }, [reducedMotion]);

  const scheduleFrame = useCallback(() => {
    if (frameRef.current === null) frameRef.current = window.requestAnimationFrame(animate);
  }, [animate]);

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!enabled) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      const width = Math.max(bounds.width, 1);
      const height = Math.max(bounds.height, 1);
      const x = Math.min(Math.max(event.clientX - bounds.left, 0), width);
      const y = Math.min(Math.max(event.clientY - bounds.top, 0), height);
      const sample: MotionPoint = { x, y, xRatio: x / width, width, height };
      targetRef.current = sample;
      currentRef.current ??= { ...sample };
      scheduleState(resolveHeroState(sample.xRatio, stateRef.current));
      scheduleFrame();
    },
    [enabled, scheduleFrame, scheduleState],
  );

  const onPointerLeave = useCallback(() => {
    clearIntent();
    if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    targetRef.current = null;
    currentRef.current = null;
    commitState("idle");
  }, [clearIntent, commitState]);

  useEffect(() => {
    if (!enabled) onPointerLeave();
  }, [enabled, onPointerLeave]);
  useEffect(
    () => () => {
      clearIntent();
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    },
    [clearIntent],
  );

  return { state, layerRef, onPointerEnter: onPointerMove, onPointerMove, onPointerLeave };
}
