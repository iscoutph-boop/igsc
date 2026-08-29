import type { PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import approvedHero from "@/assets/real/concept03/hero-base-approved.png";
import finishedHero from "@/assets/real/concept03/hero-finished-full.webp";
import introVideo from "@/assets/real/concept03/igs-hero-concept03-intro-desktop.mp4";
import introPoster from "@/assets/real/concept03/igs-hero-concept03-poster-desktop.jpg";
import fallbackHero from "@/assets/real/home-hero-sketch-house.png";

const DESKTOP_POINTER_QUERY = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const INTRO_SESSION_KEY = "igs-concept03-intro-played";
const HERO_ALT =
  "IG Sabroso residence transitioning from architectural sketch to completed construction";

type PreviewMode = "rest" | "finished" | "lights";

function markIntroPlayed() {
  try {
    window.sessionStorage.setItem(INTRO_SESSION_KEY, "true");
  } catch {
    // The static hero remains available when storage is unavailable.
  }
}

function hasPlayedIntro() {
  try {
    return window.sessionStorage.getItem(INTRO_SESSION_KEY) === "true";
  } catch {
    return false;
  }
}

function preloadImage(src: string) {
  return new Promise<void>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => reject(new Error(`Unable to load hero overlay: ${src}`));
    image.src = src;
  });
}

export function Concept03DesktopHeroMedia() {
  const rootRef = useRef<HTMLDivElement>(null);
  const finishedRef = useRef<HTMLImageElement>(null);
  const lightsRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const pointerXRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const introTimerRef = useRef<number | null>(null);
  const previewRef = useRef<PreviewMode>("rest");
  const interactionEnabledRef = useRef(false);
  const [baseLoaded, setBaseLoaded] = useState(false);
  const [overlaysReady, setOverlaysReady] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const [introLeaving, setIntroLeaving] = useState(false);
  const [showIntro, setShowIntro] = useState(false);

  const setPreview = useCallback((mode: PreviewMode) => {
    if (previewRef.current === mode) return;

    previewRef.current = mode;
    rootRef.current?.setAttribute("data-preview", mode);

    if (finishedRef.current) {
      finishedRef.current.style.opacity = mode === "finished" ? "1" : "0";
    }

    if (lightsRef.current) {
      lightsRef.current.style.opacity = mode === "lights" ? "1" : "0";
    }
  }, []);

  const finishIntro = useCallback(() => {
    markIntroPlayed();
    setIntroLeaving(true);

    if (introTimerRef.current !== null) {
      window.clearTimeout(introTimerRef.current);
    }

    introTimerRef.current = window.setTimeout(() => {
      setShowIntro(false);
      setIntroLeaving(false);
      setIntroComplete(true);
    }, 280);
  }, []);

  useEffect(() => {
    const desktopPointer = window.matchMedia(DESKTOP_POINTER_QUERY);
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);

    const configureExperience = () => {
      const eligible = desktopPointer.matches;
      const skipIntro = !eligible || reducedMotion.matches || hasPlayedIntro();

      setShowIntro(!skipIntro);
      setIntroComplete(skipIntro);

      if (!eligible) {
        interactionEnabledRef.current = false;
        setPreview("rest");
      }
    };

    configureExperience();
    desktopPointer.addEventListener("change", configureExperience);
    reducedMotion.addEventListener("change", configureExperience);

    return () => {
      desktopPointer.removeEventListener("change", configureExperience);
      reducedMotion.removeEventListener("change", configureExperience);
    };
  }, [setPreview]);

  useEffect(() => {
    if (!baseLoaded || !window.matchMedia(DESKTOP_POINTER_QUERY).matches) return;

    let cancelled = false;
    const loadOverlay = () => {
      preloadImage(finishedHero)
        .then(() => {
          if (!cancelled) setOverlaysReady(true);
        })
        .catch(() => {
          if (!cancelled) setOverlaysReady(false);
        });
    };

    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    const idleId = idleWindow.requestIdleCallback?.(loadOverlay, { timeout: 1200 });
    const timeoutId = idleId === undefined ? window.setTimeout(loadOverlay, 180) : undefined;

    return () => {
      cancelled = true;
      if (idleId !== undefined) idleWindow.cancelIdleCallback?.(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [baseLoaded]);

  useEffect(() => {
    interactionEnabledRef.current = overlaysReady && introComplete;
    rootRef.current?.setAttribute(
      "data-interaction-ready",
      interactionEnabledRef.current ? "true" : "false",
    );

    if (!interactionEnabledRef.current) setPreview("rest");
  }, [introComplete, overlaysReady, setPreview]);

  useEffect(
    () => () => {
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
      if (introTimerRef.current !== null) window.clearTimeout(introTimerRef.current);
    },
    [],
  );

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!interactionEnabledRef.current) return;

    pointerXRef.current = event.clientX;
    if (frameRef.current !== null) return;

    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      const root = rootRef.current;
      if (!root) return;

      const bounds = root.getBoundingClientRect();
      const pointerRatio = (pointerXRef.current - bounds.left) / bounds.width;
      setPreview(pointerRatio < 0.52 ? "finished" : "lights");
    });
  };

  const handlePointerLeave = () => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    setPreview("rest");
  };

  return (
    <div
      ref={rootRef}
      data-testid="concept03-desktop-hero-media"
      data-preview="rest"
      data-interaction-ready="false"
      className="absolute inset-y-0 right-0 z-0 hidden w-[58%] overflow-hidden bg-white lg:block"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
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

      {overlaysReady ? (
        <img
          ref={finishedRef}
          src={finishedHero}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[56%_center] opacity-0 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
        />
      ) : null}

      <div
        ref={lightsRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
      >
        <img
          src={approvedHero}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[56%_center] brightness-[1.025] saturate-[1.08]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_35%,rgba(255,184,92,0.015)_55%,rgba(255,168,72,0.055)_100%)] mix-blend-screen" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_31%,rgba(255,190,98,0.18)_0,rgba(255,190,98,0.07)_8%,transparent_19%),radial-gradient(circle_at_84%_58%,rgba(255,166,64,0.17)_0,rgba(255,166,64,0.06)_7%,transparent_16%),radial-gradient(circle_at_64%_66%,rgba(255,190,105,0.12)_0,transparent_13%)] mix-blend-screen" />
      </div>

      {showIntro ? (
        <video
          ref={videoRef}
          src={introVideo}
          poster={introPoster}
          autoPlay
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          data-testid="concept03-intro-video"
          className={`pointer-events-none absolute inset-0 z-20 h-full w-full object-cover object-[56%_center] transition-opacity duration-300 motion-reduce:hidden ${
            introLeaving ? "opacity-0" : "opacity-100"
          }`}
          onPlay={markIntroPlayed}
          onEnded={finishIntro}
          onError={finishIntro}
          onCanPlay={() => {
            void videoRef.current?.play().catch(finishIntro);
          }}
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
