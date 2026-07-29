import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight, Facebook, Menu, Moon, Music2, Sun, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import logoAsset from "@/assets/logo.png.asset.json";
import { useTheme } from "./theme-provider";

const FACEBOOK_URL = "https://www.facebook.com/search/top?q=ig%20sabroso%20construction";
const TIKTOK_URL = "https://www.tiktok.com/@igs.construction";

const navItems: { to: "/" | "/details" | "/consultation"; label: string; hash?: string }[] = [
  { to: "/", label: "Home" },
  { to: "/details", label: "About", hash: "about" },
  { to: "/details", label: "Services", hash: "services" },
  { to: "/details", label: "Projects", hash: "portfolio" },
  { to: "/details", label: "Process", hash: "process" },
  { to: "/consultation", label: "Contact" },
];

export function SiteHeaderHome() {
  const { theme, toggle } = useTheme();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [open, setOpen] = useState(false);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const firstItemRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const opener = openerRef.current;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => firstItemRef.current?.focus(), 40);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
      opener?.focus();
    };
  }, [open]);

  return (
    <header className="absolute inset-x-0 top-0 z-50 hidden md:block">
      <div className="relative mx-auto flex h-[72px] w-full max-w-[1540px] items-center px-10">
        <Link
          to="/"
          className="group flex min-w-0 items-center gap-3 text-[#171717] dark:text-white"
        >
          <img
            src={logoAsset.url}
            alt="IG Sabroso Construction"
            width={46}
            height={46}
            className="size-10 shrink-0 object-contain transition-transform group-hover:scale-105"
          />
          <span className="min-w-0 leading-tight">
            <span className="block truncate font-display text-[13px] font-bold tracking-[-0.025em]">
              IG SABROSO CONSTRUCTION
            </span>
            <span className="block truncate text-[10px] text-[#403c38]/72 dark:text-white/68">
              Your Dependable Building Partner
            </span>
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="absolute left-1/2 hidden -translate-x-1/2 items-center rounded-full border border-white/85 bg-white/70 p-1 shadow-[0_12px_32px_rgba(73,56,43,0.08),inset_0_1px_0_rgba(255,255,255,0.92)] backdrop-blur-2xl xl:flex"
        >
          {navItems.map((item) => {
            const active =
              (item.to === "/" && pathname === "/") ||
              (item.to === "/consultation" && pathname.startsWith("/consultation"));

            return (
              <Link
                key={item.label}
                to={item.to}
                hash={item.hash}
                className={`inline-flex min-h-9 items-center justify-center whitespace-nowrap rounded-full px-4 text-[12px] font-medium transition ${
                  active
                    ? "bg-[linear-gradient(100deg,#ff4b08,#ed2d27)] text-white shadow-[0_6px_16px_rgba(235,59,21,0.2)]"
                    : "text-[#262321] hover:bg-white/66"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          <div className="hidden items-center gap-0.5 xl:flex">
            <SocialLink href={FACEBOOK_URL} label="Facebook">
              <Facebook className="size-3.5" aria-hidden="true" />
            </SocialLink>
            <SocialLink href={TIKTOK_URL} label="TikTok">
              <Music2 className="size-3.5" aria-hidden="true" />
            </SocialLink>
          </div>

          <button
            type="button"
            onClick={toggle}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            className="inline-flex size-9 items-center justify-center rounded-full border border-white/78 bg-white/66 text-[#292623] shadow-[0_8px_22px_rgba(70,52,39,0.08)] backdrop-blur-xl transition hover:bg-white dark:border-white/15 dark:bg-black/36 dark:text-white"
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>

          <Link
            to="/consultation"
            className="group hidden min-h-10 items-center gap-2 rounded-full bg-[linear-gradient(100deg,#ff4b08,#ed2d27)] py-1.5 pl-5 pr-1.5 font-display text-[12px] font-semibold text-white shadow-[0_10px_26px_rgba(235,60,20,0.22)] transition hover:-translate-y-0.5 xl:inline-flex"
          >
            Consultation
            <span className="inline-flex size-7 items-center justify-center rounded-full bg-white/20 transition-transform group-hover:translate-x-0.5">
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </span>
          </Link>

          <button
            ref={openerRef}
            type="button"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            aria-controls="home-tablet-navigation"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex size-10 items-center justify-center rounded-full border border-white/78 bg-white/66 text-[#292623] backdrop-blur-xl xl:hidden dark:border-white/15 dark:bg-black/36 dark:text-white"
          >
            {open ? <X className="size-4.5" /> : <Menu className="size-4.5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="home-tablet-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className="mx-10 rounded-[24px] border border-white/80 bg-white/82 p-3 shadow-[0_18px_50px_rgba(53,40,30,0.14)] backdrop-blur-2xl xl:hidden dark:border-white/12 dark:bg-neutral-950/82"
          >
            <nav aria-label="Tablet primary" className="grid grid-cols-3 gap-1">
              {navItems.map((item, index) => (
                <Link
                  key={item.label}
                  to={item.to}
                  hash={item.hash}
                  ref={index === 0 ? firstItemRef : undefined}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-3 text-center text-sm font-medium text-[#252220] transition hover:bg-primary hover:text-white dark:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex size-8 items-center justify-center rounded-full text-[#393532]/55 transition hover:bg-white/58 hover:text-primary dark:text-white/55"
    >
      {children}
    </a>
  );
}
