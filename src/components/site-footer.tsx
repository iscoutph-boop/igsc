import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { BrandLockup } from "@/components/brand/brand-lockup";
import {
  getPrimaryNavigationActiveOptions,
  isPrimaryNavigationItemActive,
  PRIMARY_NAVIGATION,
} from "@/content/navigation";
import {
  IGS_ADDRESS,
  IGS_EMAIL,
  IGS_MAPS_URL,
  IGS_PHONE_DISPLAY,
  IGS_PHONE_TEL,
} from "@/lib/contact";

const routeTargets = ["/", "/details", "/projects", "/consultation"] as const;
type RouteTarget = (typeof routeTargets)[number];

export function SiteFooter() {
  const location = useRouterState({ select: (state) => state.location });

  return (
    <footer className="border-t border-[#e6e9ed] bg-[#f7f8fa]">
      <div className="mx-auto grid w-full max-w-[1500px] gap-10 px-6 py-14 md:grid-cols-[1.3fr_0.7fr_1fr] md:px-10 lg:px-14 lg:py-18">
        <div className="max-w-md">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            aria-label="IG Sabroso Construction home"
            className="inline-flex rounded-xl"
          >
            <BrandLockup />
          </Link>
          <p className="mt-6 text-sm leading-7 text-[#667085]">
            Dependable construction, design-build, project management, and renovation services
            delivered through clear coordination and skilled workmanship.
          </p>
          <Link
            to="/projects"
            activeOptions={{ exact: false }}
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#dfe3e8] bg-white px-4 text-sm font-bold text-[#152238] transition hover:border-primary/40 hover:text-primary"
          >
            View selected projects
            <ArrowRight aria-hidden="true" size={17} />
          </Link>
        </div>

        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#152238]">
            Explore
          </h2>
          <nav aria-label="Footer navigation" className="mt-5 grid gap-3">
            {PRIMARY_NAVIGATION.map((item) => {
              const active = isPrimaryNavigationItemActive(item, location.pathname, location.hash);

              const className = [
                "w-fit text-sm font-semibold transition hover:text-primary",
                active ? "text-primary" : "text-[#667085]",
              ].join(" ");

              if ("hash" in item) {
                return (
                  <a
                    key={item.label}
                    href={`${item.to}#${item.hash}`}
                    aria-current={active ? "page" : undefined}
                    className={className}
                  >
                    {item.label}
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
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#152238]">
            Contact
          </h2>
          <div className="mt-5 space-y-4 text-sm text-[#667085]">
            <a
              href={`tel:${IGS_PHONE_TEL}`}
              className="flex items-start gap-3 transition hover:text-primary"
            >
              <Phone aria-hidden="true" size={18} className="mt-0.5 shrink-0 text-primary" />
              <span>{IGS_PHONE_DISPLAY}</span>
            </a>
            <a
              href={`mailto:${IGS_EMAIL}`}
              className="flex items-start gap-3 transition hover:text-primary"
            >
              <Mail aria-hidden="true" size={18} className="mt-0.5 shrink-0 text-primary" />
              <span className="break-all">{IGS_EMAIL}</span>
            </a>
            <a
              href={IGS_MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-3 transition hover:text-primary"
            >
              <MapPin aria-hidden="true" size={18} className="mt-0.5 shrink-0 text-primary" />
              <span>{IGS_ADDRESS}</span>
            </a>
          </div>
          <Link
            to="/consultation"
            activeOptions={{ exact: true }}
            className="mt-7 inline-flex min-h-12 items-center gap-3 rounded-xl bg-primary px-5 text-sm font-extrabold text-white shadow-[0_10px_28px_rgba(244,81,30,0.2)]"
          >
            Start a project
            <ArrowUpRight aria-hidden="true" size={18} />
          </Link>
        </div>
      </div>

      <div className="border-t border-[#e1e5ea]">
        <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-2 px-6 py-5 text-xs text-[#7a8491] sm:flex-row sm:items-center sm:justify-between md:px-10 lg:px-14">
          <p>© {new Date().getFullYear()} IG Sabroso Construction. All rights reserved.</p>
          <p>Build with confidence - build with Sabroso.</p>
        </div>
      </div>
    </footer>
  );
}
