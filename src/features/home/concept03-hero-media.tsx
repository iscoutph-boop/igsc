import { useEffect, useState } from "react";
import approvedHero from "@/assets/real/concept03/hero-base-approved.png";
import fallbackHero from "@/assets/real/home-hero-sketch-house.png";
import { HeroMotionLayers } from "@/features/hero-motion/HeroMotionLayers";
import { HERO_MOTION } from "@/features/hero-motion/heroMotion.config";
import type { HeroMotionState } from "@/features/hero-motion/heroMotion.types";
import { useHeroMotion } from "@/features/hero-motion/useHeroMotion";

const DESKTOP_POINTER_QUERY = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const HERO_ALT =
  "IG Sabroso residence transitioning from architectural sketch to completed construction";
const INTERACTION_ASSETS = [
  "/assets/hero-motion/hero-finished-full.webp",
  "/assets/hero-motion/hero-light-interior.webp",
  "/assets/hero-motion/hero-light-exterior.webp",
  "/assets/hero-motion/hero-light-bounce.webp",
] as const;

function preloadImage(src: string) {
  return new Promise<void>((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      if (typeof image.decode !== "function") {
        resolve();
        return;
      }
      void image.decode().then(resolve).catch(resolve);
    };
    image.onerror = () => reject(new Error(`Unable to load hero overlay: ${src}`));
    image.src = src;
  });
}

function diagnosticPreview(state: HeroMotionState) {
  if (state === "sketchReveal") return "finished";
  if (state === "finishedLights") return "lights";
  return "rest";
}

export function Concept03DesktopHeroMedia() {
  const [baseLoaded, setBaseLoaded] = useState(false);
  const [overlaysReady, setOverlaysReady] = useState(false);
  const [overlaysFailed, setOverlaysFailed] = useState(false);
  const [desktopPointerEligible, setDesktopPointerEligible] = useState(false);
  const [reducedMotionPreferred, setReducedMotionPreferred] = useState(false);
  const interactionReady =
    HERO_MOTION.enabled && desktopPointerEligible && overlaysReady && !overlaysFailed;
  const motion = useHeroMotion({
    enabled: interactionReady,
    reducedMotion: reducedMotionPreferred,
  });

  useEffect(() => {
    const desktopPointer = window.matchMedia(DESKTOP_POINTER_QUERY);
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
    const configureExperience = () => {
      setDesktopPointerEligible(desktopPointer.matches);
      setReducedMotionPreferred(reducedMotion.matches);
    };
    configureExperience();
    desktopPointer.addEventListener("change", configureExperience);
    reducedMotion.addEventListener("change", configureExperience);
    return () => {
      desktopPointer.removeEventListener("change", configureExperience);
      reducedMotion.removeEventListener("change", configureExperience);
    };
  }, []);

  useEffect(() => {
    if (!baseLoaded || !desktopPointerEligible || !HERO_MOTION.enabled) return;
    let cancelled = false;
    const loadOverlays = () => {
      void Promise.all(INTERACTION_ASSETS.map(preloadImage))
        .then(() => {
          if (!cancelled) setOverlaysReady(true);
        })
        .catch(() => {
          if (!cancelled) setOverlaysFailed(true);
        });
    };
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const idleId = idleWindow.requestIdleCallback?.(loadOverlays, { timeout: 1200 });
    const timeoutId = idleId === undefined ? window.setTimeout(loadOverlays, 180) : undefined;
    return () => {
      cancelled = true;
      if (idleId !== undefined) idleWindow.cancelIdleCallback?.(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [baseLoaded, desktopPointerEligible]);

  return (
    <div
      data-testid="concept03-desktop-hero-media"
      data-hero-state={motion.state}
      data-preview={diagnosticPreview(motion.state)}
      data-interaction-ready={interactionReady ? "true" : "false"}
      className="absolute inset-y-0 right-0 z-0 hidden w-[58%] overflow-hidden bg-white lg:block"
      onPointerEnter={motion.onPointerEnter}
      onPointerMove={motion.onPointerMove}
      onPointerLeave={motion.onPointerLeave}
    >
      <img
        src={approvedHero}
        alt={HERO_ALT}
        className="absolute inset-0 h-full w-full object-cover object-[56%_center]"
        fetchPriority="high"
        onLoad={() => setBaseLoaded(true)}
        onError={(event) => {
          if (event.currentTarget.dataset.fallbackApplied === "true") return;
          event.currentTarget.dataset.fallbackApplied = "true";
          event.currentTarget.src = fallbackHero;
        }}
      />
      {overlaysReady && desktopPointerEligible && !overlaysFailed && HERO_MOTION.enabled ? (
        <HeroMotionLayers
          state={motion.state}
          layerRef={motion.layerRef}
          onAssetError={() => setOverlaysFailed(true)}
        />
      ) : null}
    </div>
  );
}

export function Concept03MobileHeroMedia() {
  return (
    <div className="relative lg:hidden" data-testid="concept03-mobile-hero-media">
      <img
        src={approvedHero}
        alt={HERO_ALT}
        className="aspect-[3/2] w-full object-cover object-[58%_center]"
        fetchPriority="high"
        onError={(event) => {
          if (event.currentTarget.dataset.fallbackApplied === "true") return;
          event.currentTarget.dataset.fallbackApplied = "true";
          event.currentTarget.src = fallbackHero;
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white to-transparent"
      />
    </div>
  );
}
