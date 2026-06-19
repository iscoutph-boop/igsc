import { useEffect, useState } from "react";
import logoAsset from "../assets/igs-logo-full.png.asset.json";

export function LoadingScreen() {
  const [mounted, setMounted] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setMounted(true);
    const prefersReduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    const hold = prefersReduced ? 700 : 1500;
    const fadeT = setTimeout(() => setFadingOut(true), hold);
    const removeT = setTimeout(() => setRemoved(true), hold + 600);
    return () => {
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
        background: "#F8F5EF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadingOut ? 0 : 1,
        transition: "opacity 500ms ease-out",
        pointerEvents: fadingOut ? "none" : "auto",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes igs2-logo-in {
          0% { opacity: 0; transform: scale(0.94); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes igs2-fade-up {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes igs2-grid-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes igs2-line-h {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        @keyframes igs2-line-v {
          0% { transform: scaleY(0); }
          100% { transform: scaleY(1); }
        }
        @keyframes igs2-accent {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        @keyframes igs2-sweep {
          0% { transform: translateX(-110%); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateX(110%); opacity: 0; }
        }
        .igs2-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(31,27,22,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(31,27,22,0.05) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 70%);
          -webkit-mask-image: radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 70%);
          opacity: 0;
          animation: igs2-grid-in 900ms ease-out 150ms forwards;
          pointer-events: none;
        }
        .igs2-col {
          position: relative;
          display: flex; flex-direction: column; align-items: center;
          gap: 22px; padding: 0 24px; z-index: 1;
        }
        .igs2-stage {
          position: relative;
          width: min(60vw, 260px);
          padding: 22px 14px;
          display: flex; align-items: center; justify-content: center;
        }
        .igs2-bp { position: absolute; inset: 0; pointer-events: none; }
        .igs2-bp-line { position: absolute; background: rgba(31,27,22,0.14); }
        .igs2-bp-top, .igs2-bp-bottom {
          left: 0; right: 0; height: 1px;
          transform-origin: left center;
          animation: igs2-line-h 700ms cubic-bezier(0.65,0,0.35,1) 200ms both;
        }
        .igs2-bp-top { top: 0; }
        .igs2-bp-bottom { bottom: 0; animation-delay: 300ms; transform-origin: right center; }
        .igs2-bp-left, .igs2-bp-right {
          top: 0; bottom: 0; width: 1px;
          transform-origin: center top;
          animation: igs2-line-v 700ms cubic-bezier(0.65,0,0.35,1) 250ms both;
        }
        .igs2-bp-left { left: 0; }
        .igs2-bp-right { right: 0; animation-delay: 350ms; transform-origin: center bottom; }
        .igs2-sweep {
          position: absolute; top: 50%; left: 0; right: 0;
          height: 1.5px;
          background: linear-gradient(90deg, rgba(228,68,22,0) 0%, #E44416 50%, rgba(228,68,22,0) 100%);
          box-shadow: 0 0 10px rgba(228,68,22,0.5);
          transform: translateX(-110%);
          animation: igs2-sweep 1100ms cubic-bezier(0.65,0,0.35,1) 400ms both;
        }
        .igs2-logo {
          position: relative; z-index: 1;
          width: 100%; height: auto; display: block;
          object-fit: contain;
          animation: igs2-logo-in 700ms cubic-bezier(0.22,1,0.36,1) 150ms both;
        }
        .igs2-accent {
          width: 56px; height: 2px;
          background: #E44416;
          border-radius: 2px;
          transform: scaleX(0);
          transform-origin: center;
          animation: igs2-accent 600ms cubic-bezier(0.65,0,0.35,1) 700ms both;
        }
        .igs2-brand {
          font-family: 'Poppins', system-ui, sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.32em;
          color: #1F1B16;
          text-transform: uppercase;
          text-align: center;
          opacity: 0;
          animation: igs2-fade-up 600ms ease-out 800ms both;
        }
        .igs2-tag {
          font-family: 'Poppins', system-ui, sans-serif;
          font-size: 10.5px;
          font-weight: 400;
          letter-spacing: 0.22em;
          color: #6D675F;
          text-transform: uppercase;
          text-align: center;
          opacity: 0;
          animation: igs2-fade-up 600ms ease-out 950ms both;
        }
        @media (prefers-reduced-motion: reduce) {
          .igs2-grid, .igs2-sweep,
          .igs2-bp-top, .igs2-bp-bottom, .igs2-bp-left, .igs2-bp-right,
          .igs2-accent {
            animation: none !important;
          }
          .igs2-logo, .igs2-brand, .igs2-tag {
            animation: igs2-fade-up 400ms ease-out both !important;
          }
        }
      `}</style>
      <div className="igs2-grid" />
      <div className="igs2-col">
        <div className="igs2-stage">
          <div className="igs2-bp">
            <div className="igs2-bp-line igs2-bp-top" />
            <div className="igs2-bp-line igs2-bp-bottom" />
            <div className="igs2-bp-line igs2-bp-left" />
            <div className="igs2-bp-line igs2-bp-right" />
          </div>
          <div className="igs2-sweep" />
          <img
            src={logoAsset.url}
            alt="IG Sabroso Construction"
            className="igs2-logo"
            draggable={false}
          />
        </div>
        <div className="igs2-accent" />
        <div className="igs2-brand">IG Sabroso Construction</div>
        <div className="igs2-tag">Your Dependable Building Partner</div>
      </div>
    </div>
  );
}
