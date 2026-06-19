import { useEffect, useState } from "react";
import logoAsset from "@/assets/logo.png.asset.json";

export function IntroLoader() {
  const [mounted, setMounted] = useState(true);
  const [entered, setEntered] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const restore = () => {
      document.body.style.overflow = prevOverflow;
    };

    if (prefersReduced) {
      const rAF = requestAnimationFrame(() => setEntered(true));
      const t = window.setTimeout(() => {
        setMounted(false);
        restore();
      }, 500);
      return () => {
        cancelAnimationFrame(rAF);
        window.clearTimeout(t);
        restore();
      };
    }

    // Stage 1: zoom-in entry on next frame
    const rAF = requestAnimationFrame(() => setEntered(true));
    // Stage 3: begin upward exit after entry (420ms) + hold (~230ms)
    const tExit = window.setTimeout(() => setExiting(true), 650);
    // Unmount after exit completes (~600ms)
    const tUnmount = window.setTimeout(() => {
      setMounted(false);
      restore();
    }, 1300);
    const tFallback = window.setTimeout(() => {
      setMounted(false);
      restore();
    }, 2400);

    return () => {
      cancelAnimationFrame(rAF);
      window.clearTimeout(tExit);
      window.clearTimeout(tUnmount);
      window.clearTimeout(tFallback);
      restore();
    };
  }, []);

  if (!mounted) return null;

  const easeOut = "cubic-bezier(0.16, 1, 0.3, 1)";
  const easeInOut = "cubic-bezier(0.76, 0, 0.24, 1)";

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483647,
        background: "rgba(248, 245, 239, 0.82)",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: exiting ? 0 : 1,
        transition: `opacity 600ms ${easeInOut}`,
        pointerEvents: exiting ? "none" : "auto",
      }}
    >
      {/* Outer wrapper: handles upward exit translate */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.9rem",
          transform: exiting ? "translateY(-120vh)" : "translateY(0)",
          transition: `transform 600ms ${easeInOut}`,
          willChange: "transform",
        }}
      >
        {/* Inner wrapper: handles zoom-in entry */}
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
