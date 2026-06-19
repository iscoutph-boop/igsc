import { useEffect, useState } from "react";
import logoAsset from "@/assets/logo.png.asset.json";

export function IntroLoader() {
  const [mounted, setMounted] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // Lock body scroll while active
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const restore = () => {
      document.body.style.overflow = prevOverflow;
    };

    if (prefersReduced) {
      const t = window.setTimeout(() => {
        setMounted(false);
        restore();
      }, 400);
      return () => {
        window.clearTimeout(t);
        restore();
      };
    }

    // ~250ms hold, then exit; total ~900ms
    const tExit = window.setTimeout(() => setExiting(true), 260);
    const tUnmount = window.setTimeout(() => {
      setMounted(false);
      restore();
    }, 950);
    // Hard fallback
    const tFallback = window.setTimeout(() => {
      setMounted(false);
      restore();
    }, 2000);

    return () => {
      window.clearTimeout(tExit);
      window.clearTimeout(tUnmount);
      window.clearTimeout(tFallback);
      restore();
    };
  }, []);

  if (!mounted) return null;

  const ease = "cubic-bezier(0.76, 0, 0.24, 1)";

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
        transition: `opacity 640ms ${ease}`,
        pointerEvents: exiting ? "none" : "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.9rem",
          transform: exiting ? "translateY(-120vh)" : "translateY(0)",
          opacity: exiting ? 0 : 1,
          transition: `transform 720ms ${ease}, opacity 640ms ${ease}`,
          willChange: "transform, opacity",
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
          }}
        >
          IG SABROSO CONSTRUCTION
        </div>
      </div>
    </div>
  );
}
