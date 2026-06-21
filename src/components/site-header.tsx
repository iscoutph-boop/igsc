import { Link, useRouterState } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Moon, Sun, ArrowRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

export function SiteHeader({ floating = false }: { floating?: boolean }) {
  const { theme, toggle } = useTheme();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const routerHash = useRouterState({ select: (s) => s.location.hash });
  const [activeHash, setActiveHash] = useState<string>(routerHash || "");
  const [open, setOpen] = useState(false);

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
          <img src={logoAsset.url} alt="IG Sabroso Construction" className="h-11 w-11 md:h-12 md:w-12 object-contain transition-transform group-hover:scale-105" />
          <div className="leading-tight">
            <div className="font-display font-bold tracking-tight text-[12px] sm:text-[15px] md:text-base">IG SABROSO CONSTRUCTION</div>
            <div className="hidden sm:block text-[11px] md:text-xs text-muted-foreground">Elevate Your Lifestyle</div>
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
            <a aria-label="Facebook" href="#" className="p-2 rounded-full hover:text-primary hover:bg-accent transition"><Facebook size={16} /></a>
            <a aria-label="Instagram" href="#" className="p-2 rounded-full hover:text-primary hover:bg-accent transition"><Instagram size={16} /></a>
            <a aria-label="LinkedIn" href="#" className="p-2 rounded-full hover:text-primary hover:bg-accent transition"><Linkedin size={16} /></a>
          </div>

          <button
            onClick={toggle}
            aria-label="Toggle theme"
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

          <button
            className="xl:hidden p-2 rounded-full glass"
            aria-label="Menu"
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
                  onClick={() => setOpen(false)}
                  className="px-3 py-3 rounded-xl hover:bg-accent transition text-sm font-medium"
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
