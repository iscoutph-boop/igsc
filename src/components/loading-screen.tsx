import { useEffect, useState } from "react";
import logoAsset from "../assets/igs-icon-logo.png.asset.json";

export function LoadingScreen() {
  const [mounted, setMounted] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setMounted(true);
    const prefersReduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const total = prefersReduced ? 1200 : 1850;
    const fadeT = setTimeout(() => setFadingOut(true), total);
    const removeT = setTimeout(() => setRemoved(true), total + 500);
    return () => {
      clearTimeout(fadeT);
      clearTimeout(removeT);
    };
  }, []);

  if (!mounted || removed) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background:
          "radial-gradient(ellipse at center, #fbf6ef 0%, #f4ece0 70%, #efe6d6 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadingOut ? 0 : 1,
        transition: "opacity 500ms ease-out",
        pointerEvents: fadingOut ? "none" : "auto",
      }}
    >
      <style>{`
        @keyframes igs-logo-in {
          0% { opacity: 0; transform: translateY(8px) scale(0.94) rotate(-1.5deg); }
          60% { opacity: 1; }
          100% { opacity: 1; transform: translateY(0) scale(1) rotate(0deg); }
        }
        @keyframes igs-logo-lift {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-4px) rotate(0.6deg); }
        }
        @keyframes igs-glow-pulse {
          0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.85; transform: translate(-50%, -50%) scale(1.08); }
        }
        @keyframes igs-sweep {
          0% { transform: translateX(-150%) skewX(-18deg); opacity: 0; }
          30% { opacity: 0.9; }
          100% { transform: translateX(150%) skewX(-18deg); opacity: 0; }
        }
        .igs-stage {
          position: relative;
          width: min(36vw, 200px);
          height: min(36vw, 200px);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: igs-logo-in 900ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .igs-logo-float {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: igs-logo-lift 3.6s ease-in-out 900ms infinite;
        }
        .igs-glow {
          position: absolute;
          top: 50%; left: 50%;
          width: 150%; height: 150%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(234, 88, 12, 0.45) 0%, rgba(234, 88, 12, 0.18) 40%, rgba(234, 88, 12, 0) 70%);
          filter: blur(24px);
          animation: igs-glow-pulse 2.4s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }
        .igs-sweep-mask {
          position: absolute;
          inset: 0;
          overflow: hidden;
          border-radius: 50%;
          pointer-events: none;
          z-index: 1;
        }
        .igs-sweep {
          position: absolute;
          top: 0; left: 0;
          width: 60%;
          height: 100%;
          background: linear-gradient(90deg, transparent 0%, rgba(255, 170, 80, 0.55) 50%, transparent 100%);
          filter: blur(8px);
          animation: igs-sweep 1.8s cubic-bezier(0.4, 0, 0.2, 1) 300ms forwards;
        }
        .igs-logo-img {
          position: relative;
          width: 82%;
          height: 82%;
          object-fit: contain;
          z-index: 2;
          image-rendering: auto;
        }
        @media (prefers-reduced-motion: reduce) {
          .igs-glow, .igs-sweep, .igs-logo-float { animation: none !important; }
          .igs-stage { animation: igs-logo-in 600ms ease-out both; }
        }
      `}</style>
      <div className="igs-stage">
        <div className="igs-glow" />
        <div className="igs-sweep-mask"><div className="igs-sweep" /></div>
        <div className="igs-logo-float">
          <img
            src={logoAsset.url}
            alt="IG Sabroso Construction"
            className="igs-logo-img"
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}
