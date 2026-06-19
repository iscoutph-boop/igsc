import { useEffect, useState } from "react";
import logoAsset from "@/assets/logo.png.asset.json";

export function IntroLoader() {
  const [mounted, setMounted] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const visibleMs = prefersReduced ? 500 : 1450;
    const fadeMs = prefersReduced ? 250 : 400;

    const t1 = window.setTimeout(() => setFadingOut(true), visibleMs);
    const t2 = window.setTimeout(() => setMounted(false), visibleMs + fadeMs);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "#F8F5EF",
        opacity: fadingOut ? 0 : 1,
        pointerEvents: fadingOut ? "none" : "auto",
        transition: "opacity 400ms ease-out",
        overflow: "hidden",
      }}
    >
      {/* Blueprint grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(31,27,22,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(31,27,22,0.08) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          opacity: 0,
          animation: "igsGridIn 700ms ease-out 200ms forwards",
          maskImage:
            "radial-gradient(ellipse at center, black 35%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 35%, transparent 75%)",
        }}
      />

      {/* Center stack */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 1.5rem",
        }}
      >
        {/* Logo frame */}
        <div
          style={{
            position: "relative",
            width: "clamp(120px, 22vw, 180px)",
            height: "clamp(120px, 22vw, 180px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Blueprint corner lines */}
          <span className="igs-bp" style={{ top: 0, left: 0, borderTop: "1px solid rgba(31,27,22,0.18)", borderLeft: "1px solid rgba(31,27,22,0.18)" }} />
          <span className="igs-bp" style={{ top: 0, right: 0, borderTop: "1px solid rgba(31,27,22,0.18)", borderRight: "1px solid rgba(31,27,22,0.18)" }} />
          <span className="igs-bp" style={{ bottom: 0, left: 0, borderBottom: "1px solid rgba(31,27,22,0.18)", borderLeft: "1px solid rgba(31,27,22,0.18)" }} />
          <span className="igs-bp" style={{ bottom: 0, right: 0, borderBottom: "1px solid rgba(31,27,22,0.18)", borderRight: "1px solid rgba(31,27,22,0.18)" }} />

          {/* Soft glow */}
          <div
            style={{
              position: "absolute",
              inset: "-20%",
              background:
                "radial-gradient(circle, rgba(228,68,22,0.12), transparent 65%)",
              filter: "blur(8px)",
              opacity: 0,
              animation: "igsFadeIn 600ms ease-out 350ms forwards",
            }}
          />

          <img
            src={logoAsset.url}
            alt="IG Sabroso Construction"
            style={{
              width: "78%",
              height: "78%",
              objectFit: "contain",
              opacity: 0,
              transform: "scale(0.94)",
              animation: "igsLogoIn 700ms cubic-bezier(0.22,1,0.36,1) 350ms forwards",
            }}
          />
        </div>

        {/* Orange sweep line */}
        <div
          style={{
            marginTop: "1.25rem",
            width: "clamp(120px, 22vw, 180px)",
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
              top: 0,
              left: 0,
              height: "100%",
              width: "100%",
              background: "rgba(228,68,22,0.85)",
              transformOrigin: "left center",
              transform: "scaleX(0)",
              animation: "igsSweep 700ms cubic-bezier(0.7,0,0.3,1) 650ms forwards",
            }}
          />
        </div>

        {/* Brand text */}
        <div
          style={{
            marginTop: "1.25rem",
            textAlign: "center",
            opacity: 0,
            transform: "translateY(8px)",
            animation: "igsTextIn 600ms ease-out 850ms forwards",
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
              marginTop: 8,
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
        @keyframes igsFadeIn { to { opacity: 1; } }
        @keyframes igsGridIn { to { opacity: 1; } }
        @keyframes igsLogoIn { to { opacity: 1; transform: scale(1); } }
        @keyframes igsSweep { to { transform: scaleX(1); } }
        @keyframes igsTextIn { to { opacity: 1; transform: translateY(0); } }
        .igs-bp { position: absolute; width: 18px; height: 18px; }
        @media (prefers-reduced-motion: reduce) {
          .igs-bp { display: none; }
        }
      `}</style>
    </div>
  );
}
