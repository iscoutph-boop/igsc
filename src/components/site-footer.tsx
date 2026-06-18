import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Phone, Mail, MapPin } from "lucide-react";
import logoAsset from "@/assets/logo.png.asset.json";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface/60 mt-24">
      <div className="max-w-[1500px] mx-auto px-6 md:px-10 py-16 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-3">
            <img src={logoAsset.url} alt="IG Sabroso" className="h-12 w-12 object-contain" />
            <div className="leading-tight">
              <div className="font-display font-bold text-sm">IG SABROSO</div>
              <div className="text-[11px] text-muted-foreground">CONSTRUCTION</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Elevate Your Lifestyle. Built on trust, driven by excellence.</p>
          <div className="mt-5 flex items-center gap-2 text-muted-foreground">
            <a href="#" aria-label="Facebook" className="p-2 rounded-full hover:text-primary hover:bg-accent transition"><Facebook size={16} /></a>
            <a href="#" aria-label="Instagram" className="p-2 rounded-full hover:text-primary hover:bg-accent transition"><Instagram size={16} /></a>
            <a href="#" aria-label="LinkedIn" className="p-2 rounded-full hover:text-primary hover:bg-accent transition"><Linkedin size={16} /></a>
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-4">Quick Links</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/" className="hover:text-primary transition">Home</Link></li>
            <li><Link to="/details" hash="about" className="hover:text-primary transition">About</Link></li>
            <li><Link to="/details" hash="projects" className="hover:text-primary transition">Projects</Link></li>
            <li><Link to="/details" hash="process" className="hover:text-primary transition">Process</Link></li>
            <li><Link to="/consultation" className="hover:text-primary transition">Consultation</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-4">Services</h4>
          <ul className="space-y-2.5 text-sm">
            <li>Residential Construction</li>
            <li>Renovation & Remodeling</li>
            <li>Civil Works</li>
            <li>Design-Build Services</li>
            <li>3D Rendering</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-4">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5"><Phone size={15} className="text-primary mt-0.5 shrink-0" /> +63 917 123 4567</li>
            <li className="flex items-start gap-2.5"><Mail size={15} className="text-primary mt-0.5 shrink-0" /> info@igsabrosoconstruction.com</li>
            <li className="flex items-start gap-2.5"><MapPin size={15} className="text-primary mt-0.5 shrink-0" /> Dasmariñas, Cavite, Philippines</li>
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
