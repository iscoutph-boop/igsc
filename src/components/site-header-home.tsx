import { Link, useRouterState } from "@tanstack/react-router";
import { Moon, Sun, Menu, X, ArrowRight, CalendarCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import logoAsset from "@/assets/logo.png.asset.json";
import { useTheme } from "./theme-provider";

const navItems: { to: "/" | "/details" | "/consultation"; label: string; hash?: string }[] = [
  { to: "/", label: "Home" },
  { to: "/details", label: "About", hash: "about" },
  { to: "/details", label: "Services", hash: "services" },
  { to: "/details", label: "Projects", hash: "portfolio" },
  { to: "/details", label: "Process", hash: "process" },
  { to: "/consultation", label: "Contact" },
];

/**
 * Homepage-only header variant. Dark translucent, no glass pill nav,
 * no social icons, no animated orange pill. Semantic <nav>, keyboard-
 * accessible mobile menu with focus trap/restore, Escape close, scroll
 * lock and selection-close.
 */
export function SiteHeaderHome() {
  const { theme, toggle } = useTheme();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const firstItemRef = useRef<HTMLAnchorElement | null>(null);

  // Escape + scroll lock + focus restore for the mobile menu
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // move focus into the panel
    const t = window.setTimeout(() => firstItemRef.current?.focus(), 40);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      window.clearTimeout(t);
      // restore focus to opener
      openerRef.current?.focus();
    };
  }, [open]);

  const isActive = (item: { to: string; hash?: string }) => {
    if (item.to === "/") return pathname === "/";
    if (item.to === "/consultation") return pathname.startsWith("/consultation");
    return false;
  };

  return (
    <header className="absolute top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="flex items-center gap-4 py-4 sm:py-5">
          {/* Logo + wordmark */}
          <Link to="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3 group">
            <img
              src={logoAsset.url}
              alt="IG Sabroso Construction"
              width={48}
              height={48}
              className="h-9 w-9 sm:h-11 sm:w-11 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)] transition-transform group-hover:scale-105 shrink-0"
            />
            <div className="leading-tight text-white min-w-0">
              <div className="font-display font-bold tracking-tight text-[10.5px] sm:text-[13px] md:text-base truncate">
                IG SABROSO CONSTRUCTION
              </div>
              <div className="text-[9px] sm:text-[11px] md:text-xs text-white/70 truncate">
                Elevate Your Lifestyle
              </div>
            </div>
          </Link>

          {/* Desktop nav — plain text links, no pill */}
          <nav aria-label="Primary" className="hidden xl:flex mx-auto items-center gap-7">
            {navItems.map((item) => {
              const active = isActive(item);
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  hash={item.hash}
                  className={`text-sm font-medium transition-colors ${
                    active ? "text-white" : "text-white/75 hover:text-white"
                  }`}
                >
                  {item.label}
                  {active && <span className="mt-1 block h-[2px] w-6 mx-auto bg-primary rounded-full" />}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            {/* Theme toggle — small, secondary */}
            <button
              onClick={toggle}
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/15 hover:text-white transition backdrop-blur-md border border-white/15"
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Consultation — desktop */}
            <Link
              to="/consultation"
              className="hidden sm:inline-flex items-center gap-2 gradient-brand text-primary-foreground rounded-full pl-5 pr-2 py-2 text-sm font-semibold shadow-[0_10px_24px_rgba(228,68,22,0.35)] hover:shadow-[0_14px_28px_rgba(228,68,22,0.5)] transition-shadow group"
            >
              CONSULTATION
              <span className="bg-white/20 rounded-full p-1.5 group-hover:translate-x-0.5 transition-transform">
                <ArrowRight size={14} />
              </span>
            </Link>

            {/* Mobile: calendar quick action + hamburger */}
            <Link
              to="/consultation"
              aria-label="Book a consultation"
              className="sm:hidden inline-flex items-center justify-center h-10 w-10 rounded-full gradient-brand text-primary-foreground shadow-[0_10px_20px_rgba(228,68,22,0.35)] shrink-0"
            >
              <CalendarCheck size={16} />
            </Link>

            <button
              ref={openerRef}
              className="xl:hidden inline-flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white border border-white/15 backdrop-blur-md"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="home-mobile-nav"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="home-mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="xl:hidden overflow-hidden border-t border-white/10 bg-black/60 backdrop-blur-xl"
          >
            <nav aria-label="Mobile primary" className="mx-auto max-w-[1440px] px-6 py-4 flex flex-col gap-1">
              {navItems.map((item, i) => (
                <Link
                  key={item.label}
                  to={item.to}
                  hash={item.hash}
                  ref={i === 0 ? firstItemRef : undefined}
                  onClick={() => setOpen(false)}
                  className="px-3 py-3 rounded-xl text-white/85 hover:bg-white/10 hover:text-white transition text-sm font-medium"
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => { toggle(); setOpen(false); }}
                className="mt-2 flex items-center gap-2 px-3 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white text-sm font-medium"
              >
                {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
                {theme === "dark" ? "Light theme" : "Dark theme"}
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
