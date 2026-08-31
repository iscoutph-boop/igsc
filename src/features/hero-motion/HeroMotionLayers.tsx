import type { CSSProperties, RefObject } from "react";
import { HERO_MOTION } from "./heroMotion.config";
import type { HeroMotionState } from "./heroMotion.types";
import "./heroMotion.css";

const HERO_ASSETS = {
  finished: "/assets/hero-motion/hero-finished-full.webp",
  interior: "/assets/hero-motion/hero-light-interior.webp",
  exterior: "/assets/hero-motion/hero-light-exterior.webp",
  bounce: "/assets/hero-motion/hero-light-bounce.webp",
} as const;

interface HeroMotionLayersProps {
  state: HeroMotionState;
  layerRef?: RefObject<HTMLDivElement | null>;
  onAssetError?: () => void;
}

export function HeroMotionLayers({ state, layerRef, onAssetError }: HeroMotionLayersProps) {
  const lightsOn = state === "finishedLights";
  const rootStyle = {
    "--hero-reveal-diameter": HERO_MOTION.revealDiameter,
    "--hero-interior-opacity": lightsOn ? 1 : 0,
    "--hero-exterior-opacity": lightsOn ? 0.88 : 0,
    "--hero-bounce-opacity": lightsOn ? 0.72 : 0,
  } as CSSProperties;

  return (
    <div
      ref={layerRef}
      data-testid="hero-motion-layers"
      data-hero-state={state}
      className="heroMotionLayers"
      style={rootStyle}
      aria-hidden="true"
    >
      <img
        src={HERO_ASSETS.finished}
        alt=""
        aria-hidden="true"
        className="heroMotionOverlay heroFinishedReveal"
        onError={onAssetError}
      />
      <img
        src={HERO_ASSETS.interior}
        alt=""
        aria-hidden="true"
        className="heroMotionOverlay heroLightLayer heroLightInterior"
        onError={onAssetError}
      />
      <img
        src={HERO_ASSETS.exterior}
        alt=""
        aria-hidden="true"
        className="heroMotionOverlay heroLightLayer heroLightExterior"
        onError={onAssetError}
      />
      <img
        src={HERO_ASSETS.bounce}
        alt=""
        aria-hidden="true"
        className="heroMotionOverlay heroLightLayer heroLightBounce"
        onError={onAssetError}
      />
    </div>
  );
}
