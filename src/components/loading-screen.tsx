import { useEffect, useState } from "react";
import logoAsset from "../assets/igs-logo-full.png.asset.json";

export function LoadingScreen() {
  const [mounted, setMounted] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setMounted(true);
    const prefersReduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const total = prefersReduced ? 700 : 1600;

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / total);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(Math.round(eased * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const fadeT = setTimeout(() => setFadingOut(true), total + 250);
    const removeT = setTimeout(() => setRemoved(true), total + 900);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fadeT);
      clearTimeout(removeT);
    };
  }, []);

  if (!mounted || removed) return null;

  return (
    <div
      aria-hidden="true"
      role="status"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background:
          "radial-gradient(ellipse at center, #ffffff 0%, #fbf6ef 55%, #f3eadb 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadingOut ? 0 : 1,
        transition: "opacity 600ms ease-out",
        pointerEvents: fadingOut ? "none" : "auto",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes igs-logo-in {
          0% { opacity: 0; transform: scale(0.96) translateY(6px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes igs-glow {
          0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.06); }
        }
        @keyframes igs-fade-up {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes igs-grid-in {
          0% { opacity: 0; }
          100% { opacity: 0.55; }
        }
        @keyframes igs-line-h {
          0% { transform: scaleX(0); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: scaleX(1); opacity: 1; }
        }
        @keyframes igs-line-v {
          0% { transform: scaleY(0); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: scaleY(1); opacity: 1; }
        }
        @keyframes igs-sweep {
          0% { transform: translateX(-110%); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateX(110%); opacity: 0; }
        }
        .igs-bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(31, 27, 22, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(31, 27, 22, 0.06) 1px, transparent 1px);
          background-size: 56px 56px;
          opacity: 0;
          animation: igs-grid-in 900ms ease-out 100ms forwards;
          mask-image: radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 70%);
          -webkit-mask-image: radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 70%);
          pointer-events: none;
        }
        .igs-col {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          padding: 0 24px;
          z-index: 1;
        }
        .igs-stage {
          position: relative;
          width: min(58vw, 260px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px 8px;
        }
        .igs-glow {
          position: absolute;
          top: 50%; left: 50%;
          width: 130%;
          height: 130%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(228,68,22,0.22) 0%, rgba(228,68,22,0.08) 40%, rgba(228,68,22,0) 70%);
          filter: blur(28px);
          animation: igs-glow 2.6s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }
        .igs-blueprint {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 2;
        }
        .igs-bp-line {
          position: absolute;
          background: rgba(31, 27, 22, 0.18);
        }
        .igs-bp-top, .igs-bp-bottom {
          left: 0; right: 0; height: 1px;
          transform-origin: left center;
          animation: igs-line-h 700ms cubic-bezier(0.65, 0, 0.35, 1) 150ms both;
        }
        .igs-bp-top { top: 0; }
        .igs-bp-bottom { bottom: 0; animation-delay: 250ms; transform-origin: right center; }
        .igs-bp-left, .igs-bp-right {
          top: 0; bottom: 0; width: 1px;
          transform-origin: center top;
          animation: igs-line-v 700ms cubic-bezier(0.65, 0, 0.35, 1) 200ms both;
        }
        .igs-bp-left { left: 0; }
        .igs-bp-right { right: 0; animation-delay: 300ms; transform-origin: center bottom; }
        .igs-bp-corner {
          position: absolute;
          width: 10px; height: 10px;
          border: 1.5px solid #E44416;
          opacity: 0;
          animation: igs-fade-up 500ms ease-out 700ms both;
        }
        .igs-bp-corner.tl { top: -1px; left: -1px; border-right: none; border-bottom: none; }
        .igs-bp-corner.tr { top: -1px; right: -1px; border-left: none; border-bottom: none; }
        .igs-bp-corner.bl { bottom: -1px; left: -1px; border-right: none; border-top: none; }
        .igs-bp-corner.br { bottom: -1px; right: -1px; border-left: none; border-top: none; }
        .igs-sweep {
          position: absolute;
          top: 50%;
          left: 0; right: 0;
          height: 1.5px;
          background: linear-gradient(90deg, rgba(228,68,22,0) 0%, #E44416 50%, rgba(228,68,22,0) 100%);
          box-shadow: 0 0 12px rgba(228, 68, 22, 0.55);
          transform: translateX(-110%);
          animation: igs-sweep 1400ms cubic-bezier(0.65, 0, 0.35, 1) 350ms both;
          z-index: 3;
        }
        .igs-logo-img {
          position: relative;
          z-index: 1;
          width: 100%;
          height: auto;
          object-fit: contain;
          display: block;
          animation: igs-logo-in 800ms cubic-bezier(0.22, 1, 0.36, 1) 200ms both;
        }
        .igs-progress-wrap {
          width: min(70vw, 240px);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          animation: igs-fade-up 500ms ease-out 400ms both;
        }
        .igs-progress-track {
          width: 100%;
          height: 2px;
          border-radius: 999px;
          background: rgba(31, 27, 22, 0.10);
          overflow: hidden;
          position: relative;
        }
        .igs-progress-bar {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #E44416 0%, #f97316 100%);
          box-shadow: 0 0 10px rgba(228, 68, 22, 0.55);
          transition: width 120ms linear;
        }
        .igs-progress-label {
          font-family: 'Poppins', system-ui, sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.32em;
          color: #6b513a;
          text-transform: uppercase;
          font-variant-numeric: tabular-nums;
        }
        @media (prefers-reduced-motion: reduce) {
          .igs-bg-grid, .igs-glow, .igs-sweep,
          .igs-bp-top, .igs-bp-bottom, .igs-bp-left, .igs-bp-right,
          .igs-bp-corner {
            animation: none !important;
            opacity: 0 !important;
          }
          .igs-logo-img, .igs-progress-wrap {
            animation: igs-fade-up 400ms ease-out both !important;
          }
          .igs-progress-bar { transition: none !important; }
        }
      `}</style>
      <div className="igs-bg-grid" />
      <div className="igs-col">
        <div className="igs-stage">
          <div className="igs-glow" />
          <div className="igs-blueprint">
            <div className="igs-bp-line igs-bp-top" />
            <div className="igs-bp-line igs-bp-bottom" />
            <div className="igs-bp-line igs-bp-left" />
            <div className="igs-bp-line igs-bp-right" />
            <span className="igs-bp-corner tl" />
            <span className="igs-bp-corner tr" />
            <span className="igs-bp-corner bl" />
            <span className="igs-bp-corner br" />
          </div>
          <div className="igs-sweep" />
          <img
            src={logoAsset.url}
            alt="IG Sabroso Construction"
            className="igs-logo-img"
            draggable={false}
          />
        </div>
        <div className="igs-progress-wrap">
          <div className="igs-progress-track">
            <div
              className="igs-progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="igs-progress-label">
            Loading {progress}%
          </div>
        </div>
      </div>
    </div>
  );
}
