import { useEffect, useRef, useState } from "react";
import logoAsset from "@/assets/logo.png.asset.json";

export function IntroLoader() {
  const [mounted, setMounted] = useState(true);
  const [logoReady, setLogoReady] = useState(false);
  const [entered, setEntered] = useState(false);
  const [movingUp, setMovingUp] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const logoRef = useRef<HTMLImageElement>(null);

  // Scroll-lock lifecycle — re-runs when `mounted` flips so cleanup restores overflow
  useEffect(() => {
    if (!mounted) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [mounted]);

  // Safety fallback: if the logo never loads, force-ready after 3s
  useEffect(() => {
    if (logoReady) return;
    const t = window.setTimeout(() => setLogoReady(true), 3000);
    return () => window.clearTimeout(t);
  }, [logoReady]);

  // Animation lifecycle — only runs once the logo asset is ready
  useEffect(() => {
    if (!logoReady) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      const rAF = requestAnimationFrame(() => {
        setEntered(true);
        setRevealing(true);
      });
      const t = window.setTimeout(() => setMounted(false), 500);
      return () => {
        cancelAnimationFrame(rAF);
        window.clearTimeout(t);
      };
    }

    const rAF = requestAnimationFrame(() => setEntered(true));
    const moveTimer = window.setTimeout(() => setMovingUp(true), 700);
    const revealTimer = window.setTimeout(() => setRevealing(true), 1150);
    const unmountTimer = window.setTimeout(() => setMounted(false), 1700);
    const fallbackTimer = window.setTimeout(() => setMounted(false), 2600);

    return () => {
      cancelAnimationFrame(rAF);
      window.clearTimeout(moveTimer);
      window.clearTimeout(revealTimer);
      window.clearTimeout(unmountTimer);
      window.clearTimeout(fallbackTimer);
    };
  }, [logoReady]);

  if (!mounted) return null;

  const easeOut = "cubic-bezier(0.16, 1, 0.3, 1)";
  const easeInOut = "cubic-bezier(0.65, 0, 0.35, 1)";

  return (
    <div
      data-intro-overlay
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483647,
        background: "rgba(248, 245, 239, 0.96)",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: revealing ? 0 : 1,
        transition: "opacity 500ms ease",
        pointerEvents: revealing ? "none" : "auto",
      }}
    >
      <div
        data-intro-group
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.9rem",
          transform: movingUp
            ? "translate3d(0, -110vh, 0)"
            : "translate3d(0, 0, 0)",
          transition: `transform 800ms ${easeInOut}`,
          willChange: "transform",
        }}
      >
        <div
          style={{
            transform: entered ? "scale(1)" : "scale(0.35)",
            opacity: entered ? 1 : 0,
            transition: `transform 420ms ${easeOut}, opacity 420ms ${easeOut}`,
            willChange: "transform, opacity",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.9rem",
          }}
        >
          <img
            src={logoAsset.url}
            alt="IG Sabroso Construction"
            onLoad={() => setLogoReady(true)}
            onError={() => setLogoReady(true)}
            style={{
              width: "clamp(96px, 14vw, 150px)",
              height: "clamp(96px, 14vw, 150px)",
              objectFit: "contain",
              display: "block",
            }}
          />
          <span
            style={{
              display: "block",
              width: 1,
              height: 26,
              background: "rgba(31,27,22,0.45)",
              opacity: entered ? 1 : 0,
              transition: `opacity 360ms ${easeOut} 120ms`,
            }}
          />
          <div
            style={{
              fontFamily: "'Poppins', system-ui, sans-serif",
              fontWeight: 600,
              fontSize: "clamp(11px, 1.2vw, 13px)",
              letterSpacing: "0.38em",
              color: "#1F1B16",
              whiteSpace: "nowrap",
              paddingLeft: "0.38em",
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(4px)",
              transition: `opacity 360ms ${easeOut} 160ms, transform 360ms ${easeOut} 160ms`,
            }}
          >
            IG SABROSO CONSTRUCTION
          </div>
        </div>
      </div>
    </div>
  );
}
