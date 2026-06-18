import { useEffect, useState } from "react";
import logoAsset from "../assets/igs-loader-logo.png.asset.json";

const SESSION_KEY = "igs_loader_shown";

export function LoadingScreen() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
    } catch {}
    setMounted(true);
    setVisible(true);
    const prefersReduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const total = prefersReduced ? 1200 : 2100;
    const fadeT = setTimeout(() => setFadingOut(true), total);
    const removeT = setTimeout(() => {
      setVisible(false);
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {}
    }, total + 600);
    return () => {
      clearTimeout(fadeT);
      clearTimeout(removeT);
    };
  }, []);

  if (!mounted || !visible) return null;

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
        transition: "opacity 600ms ease-out",
        pointerEvents: fadingOut ? "none" : "auto",
      }}
    >
      <style>{`
        @keyframes igs-loader-in {
          0% { opacity: 0; transform: scale(0.92); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes igs-loader-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes igs-loader-glow {
          0%, 100% { opacity: 0.55; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.9; transform: translate(-50%, -50%) scale(1.12); }
        }
        @keyframes igs-loader-fade {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .igs-loader-wrap {
          position: relative;
          width: min(38vw, 220px);
          height: min(38vw, 220px);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: igs-loader-in 900ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .igs-loader-glow {
          position: absolute;
          top: 50%; left: 50%;
          width: 130%; height: 130%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(234, 88, 12, 0.45) 0%, rgba(234, 88, 12, 0.15) 40%, rgba(234, 88, 12, 0) 70%);
          filter: blur(20px);
          animation: igs-loader-glow 2.4s ease-in-out infinite;
          pointer-events: none;
        }
        .igs-loader-ring {
          position: absolute;
          inset: -8%;
          border-radius: 50%;
          border: 1.5px dashed rgba(234, 88, 12, 0.35);
          animation: igs-loader-spin 6s linear infinite;
        }
        .igs-loader-logo {
          position: relative;
          width: 78%;
          height: 78%;
          object-fit: contain;
          z-index: 2;
        }
        .igs-loader-caption {
          position: absolute;
          bottom: 8vh;
          left: 0; right: 0;
          text-align: center;
          font-family: 'Poppins', system-ui, sans-serif;
          letter-spacing: 0.32em;
          font-size: 11px;
          font-weight: 600;
          color: rgba(60, 40, 20, 0.7);
          text-transform: uppercase;
          animation: igs-loader-fade 1.2s ease-out 0.4s both;
        }
        @media (prefers-reduced-motion: reduce) {
          .igs-loader-ring, .igs-loader-glow { animation: none !important; }
          .igs-loader-wrap { animation: igs-loader-fade 600ms ease-out both; }
        }
      `}</style>
      <div className="igs-loader-wrap">
        <div className="igs-loader-glow" />
        <div className="igs-loader-ring" />
        <img
          src={logoAsset.url}
          alt="IG Sabroso Construction"
          className="igs-loader-logo"
        />
      </div>
      <div className="igs-loader-caption">IG Sabroso Construction</div>
    </div>
  );
}
