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
    const total = prefersReduced ? 1200 : 2000;
    const fadeT = setTimeout(() => setFadingOut(true), total);
    const removeT = setTimeout(() => setRemoved(true), total + 550);
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
        transform: fadingOut ? "translateY(-12px)" : "translateY(0)",
        transition: "opacity 550ms ease-out, transform 550ms ease-out",
        pointerEvents: fadingOut ? "none" : "auto",
      }}
    >
      <style>{`
        @keyframes igs-logo-in {
          0% { opacity: 0; transform: scale(0.92); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes igs-glow-pulse {
          0%, 100% { opacity: 0.55; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.9; transform: translate(-50%, -50%) scale(1.1); }
        }
        @keyframes igs-line-draw {
          0% { transform: scaleX(0); opacity: 0; }
          100% { transform: scaleX(1); opacity: 1; }
        }
        @keyframes igs-text-in {
          0% { opacity: 0; transform: translateY(6px); letter-spacing: 0.45em; }
          100% { opacity: 1; transform: translateY(0); letter-spacing: 0.38em; }
        }
        .igs-col {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 22px;
        }
        .igs-logo-wrap {
          position: relative;
          width: min(28vw, 160px);
          height: min(28vw, 160px);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: igs-logo-in 1000ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .igs-glow {
          position: absolute;
          top: 50%; left: 50%;
          width: 160%; height: 160%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(234, 88, 12, 0.42) 0%, rgba(234, 88, 12, 0.16) 42%, rgba(234, 88, 12, 0) 72%);
          filter: blur(26px);
          animation: igs-glow-pulse 2.6s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }
        .igs-logo-img {
          position: relative;
          width: 100%;
          height: 100%;
          object-fit: contain;
          z-index: 2;
        }
        .igs-line {
          width: 120px;
          height: 1.5px;
          background: linear-gradient(90deg, transparent, #ea580c 20%, #ea580c 80%, transparent);
          transform-origin: center;
          animation: igs-line-draw 700ms cubic-bezier(0.22, 1, 0.36, 1) 600ms both;
        }
        .igs-brand {
          font-family: 'Poppins', system-ui, sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.38em;
          color: rgba(60, 40, 20, 0.78);
          text-transform: uppercase;
          animation: igs-text-in 700ms ease-out 900ms both;
        }
        @media (prefers-reduced-motion: reduce) {
          .igs-glow { animation: none !important; }
          .igs-logo-wrap, .igs-line, .igs-brand {
            animation: igs-logo-in 600ms ease-out both !important;
          }
        }
      `}</style>
      <div className="igs-col">
        <div className="igs-logo-wrap">
          <div className="igs-glow" />
          <img
            src={logoAsset.url}
            alt="IG Sabroso Construction"
            className="igs-logo-img"
            draggable={false}
          />
        </div>
        <div className="igs-line" />
        <div className="igs-brand">IG Sabroso Construction</div>
      </div>
    </div>
  );
}
