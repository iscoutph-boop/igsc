import { Link, useRouterState } from "@tanstack/react-router";
import { Facebook, Moon, Sun, ArrowRight, Menu, X, CalendarCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoAsset from "@/assets/logo.png.asset.json";
import { navItems, socialLinks, type NavigationItem } from "@/data/navigation";
import { useTheme } from "./theme-provider";

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

const landingSectionIds = navItems.flatMap((item) => (item.hash ? [item.hash] : []));

function normalizeHash(hash: string) {
  return hash.replace(/^#/, "");
}

export function SiteHeader({ floating = false }: { floating?: boolean }) {
  const { theme, toggle } = useTheme();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const routerHash = useRouterState({ select: (s) => s.location.hash });
  const [activeHash, setActiveHash] = useState<string>(normalizeHash(routerHash || ""));
  const [open, setOpen] = useState(false);

  // Track landing sections in view for active pill highlighting.
  useEffect(() => {
    if (pathname !== "/" || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveHash(visible.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    landingSectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    setActiveHash(normalizeHash(routerHash || ""));
  }, [pathname, routerHash]);

  const isActive = (item: NavigationItem) => {
    if (item.to === "/") {
      if (pathname !== "/") return false;
      return item.hash ? activeHash === item.hash : activeHash === "";
    }
    if (item.to === "/projects") return pathname.startsWith("/projects");
    if (item.to === "/consultation") return pathname.startsWith("/consultation");
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
                activeOptions={{ exact: item.to === "/", includeHash: item.to === "/" }}
                className={`relative min-h-11 px-4 py-2 inline-flex items-center text-sm font-medium rounded-full transition-colors ${
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
            {socialLinks.map((link) => (
              <a
                key={link.label}
                aria-label={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:text-primary hover:bg-accent transition"
              >
                {link.label === "Facebook" ? <Facebook size={16} /> : <TikTokIcon size={16} />}
              </a>
            ))}
          </div>

          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="glass rounded-full h-11 w-11 inline-flex items-center justify-center hover:shadow-soft transition relative overflow-hidden"
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
            className="hidden sm:inline-flex min-h-11 items-center gap-2 gradient-brand text-primary-foreground rounded-full pl-5 pr-2 py-2 text-sm font-semibold shadow-soft hover:shadow-glow transition-shadow group"
          >
            Consultation
            <span className="bg-background/20 rounded-full p-1.5 group-hover:translate-x-0.5 transition-transform">
              <ArrowRight size={14} />
            </span>
          </Link>

          {/* Mobile booking icon — visible on small screens only */}
          <Link
            to="/consultation"
            aria-label="Book a consultation"
            className="sm:hidden inline-flex items-center justify-center h-11 w-11 rounded-full gradient-brand text-primary-foreground shadow-soft"
          >
            <CalendarCheck size={16} />
          </Link>

          <button
            className="xl:hidden inline-flex h-11 w-11 items-center justify-center rounded-full glass"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="xl:hidden overflow-hidden glass border-t border-border"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  hash={item.hash}
                  activeOptions={{
                    exact: item.to === "/",
                    includeHash: item.to === "/",
                  }}
                  onClick={() => setOpen(false)}
                  className={`min-h-11 px-3 py-3 rounded-xl hover:bg-accent transition text-sm font-medium ${
                    isActive(item) ? "text-primary" : ""
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
