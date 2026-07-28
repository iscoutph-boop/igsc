import { Link } from "@tanstack/react-router";
import { Facebook, Mail, MapPin, Phone } from "lucide-react";
import logoAsset from "@/assets/logo.png.asset.json";
import { navItems, socialLinks } from "@/data/navigation";
import { services } from "@/features/home/home-content";
import {
  IGS_ADDRESS,
  IGS_EMAIL,
  IGS_MAPS_URL,
  IGS_PHONE_DISPLAY,
  openIgsContact,
} from "@/lib/contact";

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

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-surface/60">
      <div className="mx-auto grid max-w-[1500px] gap-10 px-6 py-14 md:grid-cols-4 md:px-10">
        <div className="md:col-span-1">
          <Link to="/" className="group flex items-center gap-3">
            <img
              src={logoAsset.url}
              alt="IG Sabroso"
              className="h-12 w-12 object-contain transition-transform group-hover:scale-105"
            />
            <div className="leading-tight">
              <div className="font-display text-sm font-bold">IG SABROSO</div>
              <div className="text-[11px] text-muted-foreground">CONSTRUCTION</div>
            </div>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            Elevate Your Lifestyle. Built on trust, driven by excellence.
          </p>
          <div className="mt-5 flex items-center gap-2 text-muted-foreground">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-accent hover:text-primary"
              >
                {link.label === "Facebook" ? <Facebook size={16} /> : <TikTokIcon size={16} />}
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Footer navigation">
          <h4 className="mb-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Quick Links
          </h4>
          <ul className="space-y-2.5 text-sm">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  hash={item.hash}
                  className="inline-flex min-h-11 items-center transition hover:text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Footer services">
          <h4 className="mb-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Services
          </h4>
          <ul className="space-y-2.5 text-sm">
            {services.map(([label]) => (
              <li key={label}>
                <Link
                  to="/"
                  hash="services"
                  className="inline-flex min-h-11 items-center transition hover:text-primary"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h4 className="mb-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Contact
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <button
                type="button"
                onClick={openIgsContact}
                className="flex min-h-11 w-full items-center gap-2.5 text-left transition hover:text-primary"
              >
                <Phone size={15} className="mt-0.5 shrink-0 text-primary" />
                <span>{IGS_PHONE_DISPLAY}</span>
              </button>
            </li>
            <li>
              <a
                href={`mailto:${IGS_EMAIL}`}
                className="flex min-h-11 items-center gap-2.5 break-all transition hover:text-primary"
              >
                <Mail size={15} className="mt-0.5 shrink-0 text-primary" />
                <span>{IGS_EMAIL}</span>
              </a>
            </li>
            <li>
              <a
                href={IGS_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-center gap-2.5 transition hover:text-primary"
              >
                <MapPin size={15} className="mt-0.5 shrink-0 text-primary" />
                <span>{IGS_ADDRESS}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1500px] flex-col justify-between gap-2 px-6 py-5 text-xs text-muted-foreground sm:flex-row md:px-10">
          <span>© {new Date().getFullYear()} IG Sabroso Construction. All rights reserved.</span>
          <span>Dasmariñas, Cavite · Built to Last</span>
        </div>
      </div>
    </footer>
  );
}
