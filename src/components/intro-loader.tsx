import { useEffect, useState } from "react";
import logoAsset from "@/assets/logo.png.asset.json";

export function IntroLoader() {
  const [mounted, setMounted] = useState(true);
  const [phase, setPhase] = useState<"zoom" | "swipe" | "done">("zoom");

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      const t = window.setTimeout(() => setMounted(false), 500);
      return () => window.clearTimeout(t);
    }

    // 0–1100ms: logo zooms out (scale up + fade in then settle)
    // 1100ms: start swipe up
    // 1800ms: unmount
    const t1 = window.setTimeout(() => setPhase("swipe"), 1100);
    const t2 = window.setTimeout(() => setPhase("done"), 1750);
    const t3 = window.setTimeout(() => setMounted(false), 1850);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, []);

  if (!mounted) return null;

  const swiping = phase !== "zoom";

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "#F8F5EF",
        transform: swiping ? "translateY(-100%)" : "translateY(0)",
        transition: "transform 700ms cubic-bezier(0.76, 0, 0.24, 1)",
        pointerEvents: phase === "done" ? "none" : "auto",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* subtle blueprint grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(31,27,22,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(31,27,22,0.07) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.25rem",
        }}
      >
        {/* soft glow */}
        <div
          style={{
            position: "absolute",
            top: "-30%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "clamp(180px, 28vw, 260px)",
            height: "clamp(180px, 28vw, 260px)",
            background:
              "radial-gradient(circle, rgba(228,68,22,0.14), transparent 65%)",
            filter: "blur(10px)",
            pointerEvents: "none",
          }}
        />

        <img
          src={logoAsset.url}
          alt="IG Sabroso Construction"
          style={{
            width: "clamp(110px, 18vw, 170px)",
            height: "clamp(110px, 18vw, 170px)",
            objectFit: "contain",
            opacity: 0,
            transform: "scale(0.3)",
            animation:
              "igsZoomOut 1100ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
          }}
        />

        <div
          style={{
            width: "clamp(110px, 18vw, 170px)",
            height: 2,
            background: "rgba(31,27,22,0.08)",
            position: "relative",
            overflow: "hidden",
            borderRadius: 2,
          }}
        >
          <span
            style={{
              position: "absolute",
              inset: 0,
              background: "#E44416",
              transformOrigin: "left center",
              transform: "scaleX(0)",
              animation: "igsLineDraw 650ms cubic-bezier(0.7,0,0.3,1) 600ms forwards",
            }}
          />
        </div>

        <div
          style={{
            textAlign: "center",
            opacity: 0,
            transform: "translateY(8px)",
            animation: "igsTextRise 600ms ease-out 750ms forwards",
          }}
        >
          <div
            style={{
              fontFamily: "'Poppins', system-ui, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(12px, 1.4vw, 14px)",
              letterSpacing: "0.32em",
              color: "#1F1B16",
            }}
          >
            IG SABROSO CONSTRUCTION
          </div>
          <div
            style={{
              marginTop: 6,
              fontFamily: "'Montserrat', system-ui, sans-serif",
              fontSize: "clamp(10px, 1.1vw, 12px)",
              letterSpacing: "0.18em",
              color: "#6D675F",
              textTransform: "uppercase",
            }}
          >
            Your Dependable Building Partner
          </div>
        </div>
      </div>

      <style>{`
        @keyframes igsZoomOut {
          0%   { opacity: 0; transform: scale(0.3); }
          60%  { opacity: 1; }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes igsLineDraw { to { transform: scaleX(1); } }
        @keyframes igsTextRise { to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
