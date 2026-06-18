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
    const total = prefersReduced ? 900 : 2200;

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
          0% { opacity: 0; transform: scale(0.94) translateY(6px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes igs-glow {
          0%, 100% { opacity: 0.55; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.85; transform: translate(-50%, -50%) scale(1.08); }
        }
        @keyframes igs-fade-up {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .igs-col {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
          padding: 0 24px;
        }
        .igs-stage {
          position: relative;
          width: min(60vw, 280px);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .igs-glow {
          position: absolute;
          top: 50%; left: 50%;
          width: 130%;
          height: 130%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(234,88,12,0.28) 0%, rgba(234,88,12,0.10) 40%, rgba(234,88,12,0) 70%);
          filter: blur(28px);
          animation: igs-glow 2.8s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }
        .igs-logo-img {
          position: relative;
          z-index: 1;
          width: 100%;
          height: auto;
          object-fit: contain;
          display: block;
          animation: igs-logo-in 900ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .igs-progress-wrap {
          width: min(70vw, 260px);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          animation: igs-fade-up 600ms ease-out 200ms both;
        }
        .igs-progress-track {
          width: 100%;
          height: 3px;
          border-radius: 999px;
          background: rgba(42, 26, 14, 0.10);
          overflow: hidden;
          position: relative;
        }
        .igs-progress-bar {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #f97316 0%, #ea580c 100%);
          box-shadow: 0 0 10px rgba(234, 88, 12, 0.55);
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
          .igs-glow { animation: none !important; }
          .igs-logo-img, .igs-progress-wrap {
            animation: igs-fade-up 500ms ease-out both !important;
          }
          .igs-progress-bar { transition: none !important; }
        }
      `}</style>
      <div className="igs-col">
        <div className="igs-stage">
          <div className="igs-glow" />
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
