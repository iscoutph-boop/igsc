import { useEffect, useState } from "react";
import logoAsset from "../assets/igs-icon-logo-v2.png.asset.json";

export function LoadingScreen() {
  const [mounted, setMounted] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setMounted(true);
    const prefersReduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const total = prefersReduced ? 1200 : 2100;
    const fadeT = setTimeout(() => setFadingOut(true), total);
    const removeT = setTimeout(() => setRemoved(true), total + 600);
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
          "radial-gradient(ellipse at center, #fdf8f1 0%, #f5ecde 60%, #ebe0cc 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadingOut ? 0 : 1,
        transform: fadingOut ? "translateY(-14px)" : "translateY(0)",
        transition: "opacity 600ms ease-out, transform 600ms ease-out",
        pointerEvents: fadingOut ? "none" : "auto",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes igs-vignette {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes igs-logo-in {
          0% { opacity: 0; transform: scale(0.9) translateY(6px); filter: blur(4px); }
          60% { filter: blur(0); }
          100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
        }
        @keyframes igs-logo-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes igs-glow-pulse {
          0%, 100% { opacity: 0.45; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.85; transform: translate(-50%, -50%) scale(1.1); }
        }
        @keyframes igs-sweep {
          0% { transform: translateX(-160%) skewX(-20deg); opacity: 0; }
          25% { opacity: 1; }
          100% { transform: translateX(160%) skewX(-20deg); opacity: 0; }
        }
        @keyframes igs-ring-rot {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes igs-line-draw {
          0% { transform: scaleX(0); opacity: 0; }
          100% { transform: scaleX(1); opacity: 1; }
        }
        @keyframes igs-text-in {
          0% { opacity: 0; transform: translateY(8px); letter-spacing: 0.5em; }
          100% { opacity: 0.85; transform: translateY(0); letter-spacing: 0.42em; }
        }
        @keyframes igs-sub-in {
          0% { opacity: 0; letter-spacing: 0.7em; }
          100% { opacity: 0.55; letter-spacing: 0.6em; }
        }
        .igs-vignette {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at center, transparent 50%, rgba(120, 60, 20, 0.08) 100%);
          pointer-events: none;
          animation: igs-vignette 800ms ease-out both;
        }
        .igs-col {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 26px;
        }
        .igs-stage {
          position: relative;
          width: min(30vw, 180px);
          height: min(30vw, 180px);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .igs-glow {
          position: absolute;
          top: 50%; left: 50%;
          width: 180%; height: 180%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(234, 88, 12, 0.5) 0%, rgba(234, 88, 12, 0.18) 38%, rgba(234, 88, 12, 0) 72%);
          filter: blur(28px);
          animation: igs-glow-pulse 2.8s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }
        .igs-ring {
          position: absolute;
          inset: -14%;
          border-radius: 50%;
          border: 1px solid transparent;
          background:
            conic-gradient(from 0deg, rgba(234,88,12,0) 0deg, rgba(234,88,12,0.55) 40deg, rgba(234,88,12,0) 90deg, rgba(234,88,12,0) 270deg, rgba(234,88,12,0.35) 310deg, rgba(234,88,12,0) 360deg) border-box;
          -webkit-mask:
            linear-gradient(#000 0 0) padding-box,
            linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
                  mask-composite: exclude;
          padding: 1px;
          animation: igs-ring-rot 6s linear infinite;
          opacity: 0.9;
        }
        .igs-logo-float {
          position: relative;
          width: 100%;
          height: 100%;
          z-index: 2;
          animation: igs-logo-in 1100ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .igs-logo-float-inner {
          width: 100%;
          height: 100%;
          animation: igs-logo-float 4s ease-in-out 1.1s infinite;
        }
        .igs-logo-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
          filter: drop-shadow(0 8px 24px rgba(234, 88, 12, 0.28));
        }
        .igs-sweep-mask {
          position: absolute;
          inset: 0;
          overflow: hidden;
          border-radius: 50%;
          pointer-events: none;
          z-index: 3;
        }
        .igs-sweep {
          position: absolute;
          top: 0; left: 0;
          width: 55%;
          height: 100%;
          background: linear-gradient(90deg, transparent 0%, rgba(255, 200, 140, 0.55) 50%, transparent 100%);
          filter: blur(10px);
          animation: igs-sweep 1.8s cubic-bezier(0.4, 0, 0.2, 1) 500ms forwards;
          mix-blend-mode: screen;
        }
        .igs-line {
          width: 130px;
          height: 1.5px;
          background: linear-gradient(90deg, transparent, #ea580c 18%, #ea580c 82%, transparent);
          transform-origin: center;
          animation: igs-line-draw 750ms cubic-bezier(0.22, 1, 0.36, 1) 700ms both;
          box-shadow: 0 0 8px rgba(234, 88, 12, 0.45);
        }
        .igs-brand {
          font-family: 'Poppins', system-ui, sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.42em;
          color: #2a1a0e;
          text-transform: uppercase;
          animation: igs-text-in 800ms ease-out 1000ms both;
          opacity: 0.85;
        }
        .igs-sub {
          margin-top: -16px;
          font-family: 'Poppins', system-ui, sans-serif;
          font-size: 8.5px;
          font-weight: 500;
          letter-spacing: 0.6em;
          color: #ea580c;
          text-transform: uppercase;
          animation: igs-sub-in 800ms ease-out 1200ms both;
          opacity: 0.55;
        }
        @media (prefers-reduced-motion: reduce) {
          .igs-glow, .igs-sweep, .igs-ring, .igs-logo-float-inner { animation: none !important; }
          .igs-logo-float, .igs-line, .igs-brand, .igs-sub {
            animation: igs-logo-in 600ms ease-out both !important;
          }
        }
      `}</style>
      <div className="igs-vignette" />
      <div className="igs-col">
        <div className="igs-stage">
          <div className="igs-glow" />
          <div className="igs-ring" />
          <div className="igs-logo-float">
            <div className="igs-logo-float-inner">
              <img
                src={logoAsset.url}
                alt="IG Sabroso Construction"
                className="igs-logo-img"
                draggable={false}
              />
            </div>
          </div>
          <div className="igs-sweep-mask"><div className="igs-sweep" /></div>
        </div>
        <div className="igs-line" />
        <div className="igs-brand">IG Sabroso Construction</div>
        <div className="igs-sub">Built on Trust · Driven by Excellence</div>
      </div>
    </div>
  );
}
