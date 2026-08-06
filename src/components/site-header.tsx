import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight, CalendarSearch, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { BrandLockup } from "@/components/brand/brand-lockup";
import {
  getPrimaryNavigationActiveOptions,
  isPrimaryNavigationItemActive,
  PRIMARY_NAVIGATION,
} from "@/content/navigation";
import { CheckBookingModal } from "./booking-modals";

const routeTargets = ["/", "/details", "/projects", "/consultation"] as const;
type RouteTarget = (typeof routeTargets)[number];

export function SiteHeader({ floating = false }: { floating?: boolean }) {
  const location = useRouterState({ select: (state) => state.location });
  const [menuOpen, setMenuOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const selector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusable = menuPanelRef.current?.querySelectorAll<HTMLElement>(selector);
    focusable?.[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
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
  }, [menuOpen]);

  return (
    <>
      <header
        className={[
          "z-50 w-full border-b border-black/5 bg-white/95 backdrop-blur-xl",
          floating ? "absolute inset-x-0 top-0" : "sticky top-0",
        ].join(" ")}
      >
        <div className="mx-auto flex min-h-[78px] w-full max-w-[1760px] items-center gap-5 px-5 sm:px-8 lg:px-12">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            aria-label="IG Sabroso Construction home"
            className="shrink-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <BrandLockup />
          </Link>

          <nav
            aria-label="Primary navigation"
            className="mx-auto hidden items-center gap-8 xl:flex"
          >
            {PRIMARY_NAVIGATION.map((item) => {
              const active = isPrimaryNavigationItemActive(item, location.pathname, location.hash);

              const className = [
                "relative py-3 text-[0.84rem] font-bold text-[#344054] transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                active ? "text-primary" : "",
              ].join(" ");

              const content = (
                <>
                  {item.label}
                  {active ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-primary"
                    />
                  ) : null}
                </>
              );

              if ("hash" in item) {
                return (
                  <a
                    key={item.label}
                    href={`${item.to}#${item.hash}`}
                    aria-current={active ? "page" : undefined}
                    className={className}
                  >
                    {content}
                  </a>
                );
              }

              return (
                <Link
                  key={item.label}
                  to={item.to as RouteTarget}
                  activeOptions={getPrimaryNavigationActiveOptions(item)}
                  aria-current={active ? "page" : undefined}
                  className={className}
                >
                  {content}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setManageOpen(true)}
              className="hidden min-h-11 items-center gap-2 rounded-lg px-3 text-[0.82rem] font-bold text-[#152238] transition hover:bg-[#f7f8fa] hover:text-primary lg:inline-flex"
            >
              <CalendarSearch aria-hidden="true" size={17} />
              Manage booking
            </button>
            <Link
              to="/consultation"
              activeOptions={{ exact: true }}
              className="inline-flex min-h-11 items-center gap-3 rounded-lg bg-primary px-4 text-[0.78rem] font-extrabold uppercase tracking-[0.045em] text-white shadow-[0_10px_28px_rgba(244,81,30,0.18)] transition hover:-translate-y-0.5 hover:bg-[#dd3e12] sm:px-5"
            >
              <span className="hidden sm:inline">Book a consultation</span>
              <span className="sm:hidden">Get a quote</span>
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen(true)}
              className="grid size-12 place-items-center rounded-xl border border-[#e3e7ec] bg-white text-[#152238] xl:hidden"
            >
              <Menu aria-hidden="true" size={25} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            className="fixed inset-0 z-[80] bg-[#152238]/45 backdrop-blur-sm xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setMenuOpen(false);
            }}
          >
            <motion.div
              id="mobile-navigation"
              ref={menuPanelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 330, damping: 34 }}
              className="ml-auto flex h-full w-[min(90vw,430px)] flex-col bg-white p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between gap-4">
                <BrandLockup compact />
                <button
                  type="button"
                  aria-label="Close navigation menu"
                  onClick={() => {
                    setMenuOpen(false);
                    menuButtonRef.current?.focus();
                  }}
                  className="grid size-11 place-items-center rounded-xl border border-[#e3e7ec]"
                >
                  <X aria-hidden="true" size={23} />
                </button>
              </div>

              <nav aria-label="Mobile navigation" className="mt-10 flex flex-col">
                {PRIMARY_NAVIGATION.map((item, index) => {
                  const active = isPrimaryNavigationItemActive(
                    item,
                    location.pathname,
                    location.hash,
                  );

                  const className = [
                    "flex min-h-14 items-center justify-between border-b border-[#edf0f3] py-3 text-lg font-bold hover:text-primary",
                    active ? "text-primary" : "text-[#152238]",
                  ].join(" ");

                  const content = (
                    <>
                      <span>{item.label}</span>
                      <span aria-hidden="true" className="text-sm font-black text-primary">
                        0{index + 1}
                      </span>
                    </>
                  );

                  if ("hash" in item) {
                    return (
                      <a
                        key={item.label}
                        href={`${item.to}#${item.hash}`}
                        aria-label={item.label}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setMenuOpen(false)}
                        className={className}
                      >
                        {content}
                      </a>
                    );
                  }

                  return (
                    <Link
                      key={item.label}
                      to={item.to as RouteTarget}
                      activeOptions={getPrimaryNavigationActiveOptions(item)}
                      aria-label={item.label}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setMenuOpen(false)}
                      className={className}
                    >
                      {content}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-auto space-y-3 pt-8">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setManageOpen(true);
                  }}
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#dce1e7] bg-white px-5 font-bold text-[#152238]"
                >
                  <CalendarSearch aria-hidden="true" size={18} />
                  Manage booking
                </button>
                <Link
                  to="/consultation"
                  activeOptions={{ exact: true }}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-13 w-full items-center justify-center gap-3 rounded-xl bg-primary px-5 font-extrabold text-white"
                >
                  Book a consultation
                  <ArrowRight aria-hidden="true" size={18} />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <CheckBookingModal open={manageOpen} onClose={() => setManageOpen(false)} />
    </>
  );
}
