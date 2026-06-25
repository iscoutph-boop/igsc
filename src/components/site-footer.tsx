import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Phone, Mail, MapPin } from "lucide-react";
import logoAsset from "@/assets/logo.png.asset.json";
import { IGS_PHONE_DISPLAY, IGS_EMAIL, IGS_ADDRESS, IGS_MAPS_URL, openIgsContact } from "@/lib/contact";

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

const FACEBOOK_URL = "https://www.facebook.com/search/top?q=ig%20sabroso%20construction";
const INSTAGRAM_URL = "https://www.tiktok.com/@igs.construction";
const TIKTOK_URL = "https://www.tiktok.com/@igs.construction";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface/60 mt-16">
      <div className="max-w-[1500px] mx-auto px-6 md:px-10 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={logoAsset.url} alt="IG Sabroso" className="h-12 w-12 object-contain transition-transform group-hover:scale-105" />
            <div className="leading-tight">
              <div className="font-display font-bold text-sm">IG SABROSO</div>
              <div className="text-[11px] text-muted-foreground">CONSTRUCTION</div>
            </div>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">Elevate Your Lifestyle. Built on trust, driven by excellence.</p>
          <div className="mt-5 flex items-center gap-2 text-muted-foreground">
            <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-2 rounded-full hover:text-primary hover:bg-accent transition"><Facebook size={16} /></a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-2 rounded-full hover:text-primary hover:bg-accent transition"><Instagram size={16} /></a>
            <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="p-2 rounded-full hover:text-primary hover:bg-accent transition"><TikTokIcon size={16} /></a>
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-4">Quick Links</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/" className="hover:text-primary transition">Home</Link></li>
            <li><Link to="/details" hash="about" className="hover:text-primary transition">About</Link></li>
            <li><Link to="/details" hash="portfolio" className="hover:text-primary transition">Projects</Link></li>
            <li><Link to="/details" hash="process" className="hover:text-primary transition">Process</Link></li>
            <li><Link to="/consultation" className="hover:text-primary transition">Consultation</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-4">Services</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/details" hash="portfolio-residential" className="hover:text-primary transition">Residential Construction</Link></li>
            <li><Link to="/details" hash="portfolio-renovation" className="hover:text-primary transition">Renovation & Remodeling</Link></li>
            <li><Link to="/details" hash="portfolio-commercial" className="hover:text-primary transition">Civil Works</Link></li>
            <li><span className="text-muted-foreground/70 cursor-default">Design-Build Services</span></li>
            <li><span className="text-muted-foreground/70 cursor-default">3D Rendering</span></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-4">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <button
                type="button"
                onClick={openIgsContact}
                className="flex items-start gap-2.5 text-left hover:text-primary transition w-full"
              >
                <Phone size={15} className="text-primary mt-0.5 shrink-0" />
                <span>{IGS_PHONE_DISPLAY}</span>
              </button>
            </li>
            <li>
              <a href={`mailto:${IGS_EMAIL}`} className="flex items-start gap-2.5 hover:text-primary transition break-all">
                <Mail size={15} className="text-primary mt-0.5 shrink-0" />
                <span>{IGS_EMAIL}</span>
              </a>
            </li>
            <li>
              <a
                href={IGS_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 hover:text-primary transition"
              >
                <MapPin size={15} className="text-primary mt-0.5 shrink-0" />
                <span>{IGS_ADDRESS}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="max-w-[1500px] mx-auto px-6 md:px-10 py-5 flex flex-col sm:flex-row justify-between gap-2 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} IG Sabroso Construction. All rights reserved.</span>
          <span>Dasmariñas, Cavite · Built to Last</span>
        </div>
      </div>
    </footer>
  );
}
