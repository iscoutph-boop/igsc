import { Link, useRouterState } from "@tanstack/react-router";
import { Facebook, Moon, Sun, ArrowRight, Menu, X, CalendarCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import logoAsset from "@/assets/logo.png.asset.json";
import { useTheme } from "./theme-provider";

const FACEBOOK_URL = "https://www.facebook.com/search/top?q=ig%20sabroso%20construction";
const TIKTOK_URL = "https://www.tiktok.com/@igs.construction";

function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.6 6.32a5.4 5.4 0 0 1-3.16-1.02 5.4 5.4 0 0 1-2.17-3.55h-3.36v13.13a2.86 2.86 0 1 1-2.86-2.86c.29 0 .57.04.83.13V8.7a6.2 6.2 0 1 0 5.39 6.18V9.4a8.78 8.78 0 0 0 5.33 1.8V7.85a5.4 5.4 0 0 1 0-1.53z" />
    </svg>
  );
}

const navItems: { to: "/" | "/details" | "/consultation"; label: string; hash?: string }[] = [
  { to: "/", label: "Home" },
  { to: "/details", label: "About", hash: "about" },
  { to: "/details", label: "Services", hash: "services" },
  { to: "/details", label: "Projects", hash: "portfolio" },
  { to: "/details", label: "Process", hash: "process" },
  { to: "/consultation", label: "Contact" },
];

export function SiteHeader({ floating = false }: { floating?: boolean }) {
  const { theme, toggle } = useTheme();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const routerHash = useRouterState({ select: (s) => s.location.hash });
  const [activeHash, setActiveHash] = useState<string>(routerHash || "");
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);

  // Track section in view on /details for active pill highlighting
  useEffect(() => {
    if (pathname !== "/details") return;
    const ids = ["about", "services", "portfolio", "process"];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveHash(visible.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (routerHash) setActiveHash(routerHash);
  }, [routerHash]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const panel = mobilePanelRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>(focusableSelector);

    document.body.style.overflow = "hidden";
    focusable?.[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab" || !focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const isActive = (item: { to: string; hash?: string }) => {
    if (item.to === "/") return pathname === "/";
    if (item.to === "/consultation") return pathname.startsWith("/consultation");
    if (item.to === "/details") {
      if (pathname !== "/details") return false;
      return (activeHash || "about") === item.hash;
    }
    return false;
  };

  return (
    <header
      className={
        floating
          ? "absolute top-0 left-0 right-0 z-50"
          : "sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border"
      }
    >
      <div className="max-w-[1500px] mx-auto px-5 md:px-10 py-5 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <img
            src={logoAsset.url}
            alt="IG Sabroso Construction"
            className="h-11 w-11 md:h-12 md:w-12 object-contain transition-transform group-hover:scale-105"
          />
          <div className="leading-tight">
            <div className="font-display font-bold tracking-tight text-[12px] sm:text-[15px] md:text-base">
              IG SABROSO CONSTRUCTION
            </div>
            <div className="text-[10px] sm:text-[11px] md:text-xs text-muted-foreground">
              Elevate Your Lifestyle
            </div>
          </div>
        </Link>

        {/* Center pill nav */}
        <nav className="hidden xl:flex mx-auto items-center gap-1 glass rounded-full p-1.5 shadow-soft">
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.label}
                to={item.to}
                hash={item.hash}
                className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  active ? "text-primary-foreground" : "text-foreground/80 hover:text-foreground"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full gradient-brand shadow-soft"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <div className="hidden md:flex items-center gap-1.5 text-muted-foreground">
            <a
              aria-label="Facebook"
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:text-primary hover:bg-accent transition"
            >
              <Facebook size={16} />
            </a>
            <a
              aria-label="TikTok"
              href={TIKTOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:text-primary hover:bg-accent transition"
            >
              <TikTokIcon size={16} />
            </a>
          </div>

          <button
            onClick={toggle}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="glass rounded-full p-2.5 hover:shadow-soft transition relative overflow-hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ y: 12, opacity: 0, rotate: -45 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: -12, opacity: 0, rotate: 45 }}
                transition={{ duration: 0.22 }}
                className="flex"
              >
                {theme === "dark" ? <Sun size={16} className="text-primary" /> : <Moon size={16} />}
              </motion.span>
            </AnimatePresence>
          </button>

          <Link
            to="/consultation"
            className="hidden sm:inline-flex items-center gap-2 gradient-brand text-primary-foreground rounded-full pl-5 pr-2 py-2 text-sm font-semibold shadow-soft hover:shadow-glow transition-shadow group"
          >
            Consultation
            <span className="bg-background/20 rounded-full p-1.5 group-hover:translate-x-0.5 transition-transform">
              <ArrowRight size={14} />
            </span>
          </Link>

          {/* Mobile booking icon, visible on small screens only. */}
          <Link
            to="/consultation"
            aria-label="Book a consultation"
            className="sm:hidden inline-flex items-center justify-center h-9 w-9 rounded-full gradient-brand text-primary-foreground shadow-soft"
          >
            <CalendarCheck size={16} />
          </Link>

          <button
            ref={menuButtonRef}
            className="xl:hidden p-2 rounded-full glass"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-controls="site-mobile-navigation"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                id="site-mobile-navigation"
                className="fixed inset-x-0 bottom-0 top-[85px] z-40 xl:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <button
                  type="button"
                  aria-label="Close navigation"
                  className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
                  onClick={() => setOpen(false)}
                />
                <motion.div
                  ref={mobilePanelRef}
                  role="dialog"
                  aria-modal="true"
                  aria-label="Site navigation"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", stiffness: 320, damping: 34 }}
                  className="absolute right-0 top-0 flex h-full w-[min(88vw,420px)] flex-col border-l border-border bg-background p-6 shadow-card"
                >
                  <div className="flex items-center justify-between border-b border-border pb-5">
                    <div>
                      <p className="font-display text-lg font-bold">Explore</p>
                      <p className="text-xs text-muted-foreground">IG Sabroso Construction</p>
                    </div>
                    <button
                      type="button"
                      aria-label="Close navigation menu"
                      className="rounded-full border border-border p-2.5 hover:bg-accent"
                      onClick={() => {
                        setOpen(false);
                        menuButtonRef.current?.focus();
                      }}
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <nav aria-label="Mobile navigation" className="mt-5 flex flex-col">
                    {navItems.map((item, index) => (
                      <Link
                        key={item.label}
                        to={item.to}
                        hash={item.hash}
                        onClick={() => setOpen(false)}
                        className={`flex items-center justify-between border-b border-border px-1 py-4 text-base font-semibold transition hover:text-primary ${
                          isActive(item) ? "text-primary" : "text-foreground"
                        }`}
                      >
                        <span>{item.label}</span>
                        <span className="font-display text-xs text-muted-foreground">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </Link>
                    ))}
                  </nav>

                  <div className="mt-auto pt-8">
                    <Link
                      to="/consultation"
                      onClick={() => setOpen(false)}
                      className="flex w-full items-center justify-between rounded-2xl gradient-brand px-5 py-4 font-semibold text-primary-foreground shadow-soft"
                    >
                      Request a consultation
                      <ArrowRight size={18} />
                    </Link>
                    <div className="mt-5 flex items-center gap-2 text-muted-foreground">
                      <a
                        aria-label="Facebook"
                        href={FACEBOOK_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-border p-3 hover:text-primary"
                      >
                        <Facebook size={17} />
                      </a>
                      <a
                        aria-label="TikTok"
                        href={TIKTOK_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-border p-3 hover:text-primary"
                      >
                        <TikTokIcon size={17} />
                      </a>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </header>
  );
}
