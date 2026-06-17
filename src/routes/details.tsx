import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight, Home, Wrench, HardHat, Ruler, Box, PencilRuler,
  Compass, Hammer, Layers, CheckCircle2, MapPin, Check, Sparkles,
  Search, ChevronDown, Calculator, Building, CalendarDays, ClipboardCheck,
  Image as ImageIcon, Award, Star, Bed, Bath, Square,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageTransition } from "@/components/page-transition";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import aResAsset from "@/assets/proj-a-residence.jpg.asset.json";
import oResAsset from "@/assets/proj-o-residence.jpg.asset.json";
import iResAsset from "@/assets/proj-i-residence.jpg.asset.json";
import lResAsset from "@/assets/proj-l-residence.jpg.asset.json";
import bAptAsset from "@/assets/proj-b-apartment.jpg.asset.json";
import keystoneAsset from "@/assets/proj-keystone.jpg.asset.json";
import fResAsset from "@/assets/proj-f-residence.jpg.asset.json";
import igs1 from "@/assets/igs-1.jpg.asset.json";
import igs2 from "@/assets/igs-2.jpg.asset.json";
import igs3 from "@/assets/igs-3.jpg.asset.json";
import igs4 from "@/assets/igs-4.jpg.asset.json";
import igs6 from "@/assets/igs-6.jpg.asset.json";
import igs7 from "@/assets/igs-7.jpg.asset.json";
import igs8 from "@/assets/igs-8.jpg.asset.json";
import igs9 from "@/assets/igs-9.jpg.asset.json";

const aRes = aResAsset.url;
const oRes = oResAsset.url;
const iRes = iResAsset.url;
const lRes = lResAsset.url;
const bApt = bAptAsset.url;
const keystone = keystoneAsset.url;
const fRes = fResAsset.url;

const aboutSlides = [igs1.url, igs2.url, igs3.url, igs4.url];
const galleryPool = [igs1.url, igs2.url, igs3.url, igs4.url, igs6.url, igs7.url, igs8.url, igs9.url];


export const Route = createFileRoute("/details")({
  head: () => ({
    meta: [
      { title: "Packages & Portfolio — IG Sabroso Construction" },
      { name: "description", content: "Explore IG Sabroso Construction's finish packages and full project portfolio across Cavite, Laguna, and Metro Manila." },
      { property: "og:title", content: "IG Sabroso — Packages & Portfolio" },
      { property: "og:description", content: "Basic, Elegant, and Luxury finish packages plus our completed and ongoing builds." },
    ],
  }),
  component: DetailsPage,
});

const services = [
  { icon: Home, title: "Residential Construction", desc: "Custom homes built to last with craftsmanship and care." },
  { icon: Wrench, title: "Renovation & Remodeling", desc: "Reimagine your space with modern, functional upgrades." },
  { icon: HardHat, title: "Civil Works", desc: "Reliable infrastructure for roads, drainage, and foundations." },
  { icon: Ruler, title: "Design-Build Services", desc: "One team from concept to handover — seamless delivery." },
  { icon: Compass, title: "Construction Management", desc: "Timelines, budgets, and quality kept on track end to end." },
  { icon: PencilRuler, title: "Architectural Drawings", desc: "Precise, code-ready plans tailored to your vision." },
  { icon: Box, title: "3D Rendering & Visualization", desc: "See your project in lifelike detail before we break ground." },
];

type ProjectType = "Residential" | "Apartment" | "Commercial" | "Renovation";
type ProjectStatus = "Completed" | "Ongoing";
type Project = {
  id: string;
  title: string;
  status: ProjectStatus;
  type: ProjectType;
  location: string;
  description: string;
  highlights: string[];
  number: string;
  img: string;
};

const projects: Project[] = [
  { id: "a-res", title: "A Residence", status: "Completed", type: "Residential", location: "Imus City, Cavite", number: "01", img: aRes,
    description: "A two-storey residence in modern contemporary style, defined by clean lines, layered volumes, and a balanced mix of glass and warm accent materials. Despite a compact 125 sqm footprint, it showcases efficient space planning that maximizes functionality and comfort.",
    highlights: ["2-vehicle carport", "Living area", "Kitchen area", "Dining area", "3 Bedrooms", "4 Restrooms"] },
  { id: "o-res", title: "O Residence", status: "Completed", type: "Residential", location: "Dasmariñas City, Cavite", number: "02", img: oRes,
    description: "A two-storey, 174 sqm residence with a classic space-planning approach — strong geometric volumes and bold structured massing. A high-ceiling living area enhances spatial openness and architectural presence.",
    highlights: ["2-vehicle carport", "Living area", "Kitchen & service kitchen", "Dining area", "Office", "5 Bedrooms", "5 Restrooms"] },
  { id: "g-res", title: "G Residence", status: "Completed", type: "Residential", location: "Imus City, Cavite", number: "03", img: aRes,
    description: "A refined residential build emphasizing premium materials and a contemporary palette tailored to family living.",
    highlights: ["1-vehicle carport", "Living area", "Kitchen area", "Dining area", "4 Bedrooms", "3 Restrooms"] },
  { id: "i-res", title: "I Residence", status: "Completed", type: "Residential", location: "Imus City, Cavite", number: "04", img: iRes,
    description: "A three-storey modern contemporary residence distinguished by exposed brick within a predominantly white interior palette. High-end materials and smart-home features are seamlessly integrated in this 222 sqm home.",
    highlights: ["1-vehicle carport", "2 Living areas", "Kitchen & service kitchen", "Dining area", "6 Bedrooms", "5 Restrooms"] },
  { id: "l-res", title: "L Residence", status: "Completed", type: "Renovation", location: "Pasig City", number: "05", img: lRes,
    description: "A three-storey renovation transformed into a modern contemporary residence with dark, Japanese-inspired interiors. The scope focused on premium-quality materials, interior design, and selected execution works.",
    highlights: ["2-vehicle carport", "2 Living areas", "Kitchen", "Dining area", "Office & Jacuzzi", "Master Bedroom"] },
  { id: "b-apt", title: "B Apartment", status: "Completed", type: "Apartment", location: "San Pedro City, Laguna", number: "06", img: bApt,
    description: "A two-storey, three-unit apartment building delivering durable, rentable units with clean modern detailing.",
    highlights: ["1-vehicle carport", "Living area", "Kitchen area", "Dining area", "2 Bedrooms per unit", "1 Restroom per unit"] },
  { id: "keystone", title: "Keystone Building", status: "Completed", type: "Commercial", location: "Dasmariñas City, Cavite", number: "07", img: keystone,
    description: "A three-storey commercial building designed for flexible tenancy and street-level visibility.",
    highlights: ["2-vehicle carport", "6 commercial units", "3 Restrooms"] },
  { id: "f-res", title: "F Residence", status: "Ongoing", type: "Residential", location: "Silang, Cavite", number: "08", img: fRes,
    description: "A two-storey residence designed as a multi-level home that responds to a steep site slope, carefully balancing spaces within a 232 sqm floor area. Features a modern contemporary interpretation of a Bali-inspired theme.",
    highlights: ["2-vehicle carport", "2 Living areas", "Kitchen & service kitchen", "Dining area", "6 Bedrooms", "7 Restrooms"] },
  { id: "k-res", title: "K Residence", status: "Ongoing", type: "Residential", location: "Dasmariñas City, Cavite", number: "09", img: oRes,
    description: "A contemporary family residence in progress, focused on natural light and tropical-modern detailing.",
    highlights: ["2-vehicle carport", "Living area", "Kitchen area", "Dining area", "4 Bedrooms", "4 Restrooms"] },
  { id: "a-res-2", title: "A Residence", status: "Ongoing", type: "Residential", location: "Imus City, Cavite", number: "10", img: aRes,
    description: "A new residential build with a modern aesthetic and efficient space planning for an expanding family.",
    highlights: ["1-vehicle carport", "Living area", "Kitchen area", "Dining area", "3 Bedrooms", "3 Restrooms"] },
  { id: "z-res", title: "Z Residence", status: "Ongoing", type: "Residential", location: "Dasmariñas City, Cavite", number: "11", img: iRes,
    description: "A bold modern residence in development — strong massing paired with warm material accents.",
    highlights: ["2-vehicle carport", "Living area", "Kitchen area", "Dining area", "5 Bedrooms", "4 Restrooms"] },
  { id: "a-res-reno", title: "A Residence Renovation / Extension", status: "Ongoing", type: "Renovation", location: "Dasmariñas City, Cavite", number: "12", img: lRes,
    description: "A residential renovation and extension upgrading layout, finishes, and additional living areas to suit evolving family needs.",
    highlights: ["Structural extension", "Interior renovation", "Premium finishes", "Updated kitchen", "Additional bedroom"] },
  { id: "v-res", title: "V Residence", status: "Ongoing", type: "Residential", location: "Imus City, Cavite", number: "13", img: fRes,
    description: "An ongoing residential project showcasing contemporary architecture and quality craftsmanship.",
    highlights: ["2-vehicle carport", "Living area", "Kitchen area", "Dining area", "4 Bedrooms", "3 Restrooms"] },
];

const packages = [
  { tier: "BASIC", price: "₱35,000", note: "per square meter", featured: false,
    features: ["Standard structural works", "Quality basic finishes", "Essential fixtures", "Standard electrical & plumbing", "Painted interior walls"] },
  { tier: "ELEGANT", price: "₱40,000 – ₱45,000", note: "per square meter", featured: true,
    features: ["Premium structural works", "Upgraded finishes & tiles", "Designer fixtures", "Enhanced electrical & plumbing", "Accent walls & cabinetry"] },
  { tier: "LUXURY", price: "₱50,000", note: "per square meter", featured: false,
    features: ["High-end structural works", "Luxury imported finishes", "Premium smart-home features", "Designer lighting & built-ins", "Custom millwork & detailing"] },
];

const filters = ["All", "Completed", "Ongoing", "Residential", "Apartment", "Commercial", "Renovation"] as const;
type Filter = typeof filters[number];

const steps = [
  { n: "01", title: "Consultation", desc: "Understanding your needs, vision, and budget.", icon: Compass },
  { n: "02", title: "Planning", desc: "Designs, drawings, schedules, and strategy.", icon: Ruler },
  { n: "03", title: "Building", desc: "Quality construction with precision and care.", icon: Hammer },
  { n: "04", title: "Turnover", desc: "Delivering on time, with perfection.", icon: CheckCircle2 },
];

type SortKey = "latest" | "completed" | "ongoing" | "name";

function DetailsPage() {
  const [filter, setFilter] = useState<Filter>("All");
  const [active, setActive] = useState<Project | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("latest");
  const [visible, setVisible] = useState(6);

  const filtered = useMemo(() => {
    let list = projects;
    if (filter !== "All") {
      list = (filter === "Completed" || filter === "Ongoing")
        ? list.filter((p) => p.status === filter)
        : list.filter((p) => p.type === filter);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q),
      );
    }
    const sorted = [...list];
    if (sort === "name") sorted.sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === "completed") sorted.sort((a, b) => (a.status === "Completed" ? -1 : 1));
    else if (sort === "ongoing") sorted.sort((a, b) => (a.status === "Ongoing" ? -1 : 1));
    else sorted.sort((a, b) => Number(b.number) - Number(a.number));
    return sorted;
  }, [filter, query, sort]);

  useEffect(() => { setVisible(6); }, [filter, query, sort]);


  return (
    <PageTransition>
      <SiteHeader />
      <main className="w-full">
        {/* About */}
        <Section id="about">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <Reveal>
              <Eyebrow>About Us</Eyebrow>
              <h2 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-[1.05]">
                Built on trust.<br />
                Driven by <span className="text-gradient-brand">excellence.</span>
              </h2>
              <p className="mt-6 text-muted-foreground text-base md:text-lg leading-relaxed max-w-xl">
                IG Sabroso Construction is a full-service construction company committed to
                delivering high-quality, dependable, and efficient building solutions. From
                concept to completion, we bring expertise, transparency, and dedication to every project.
              </p>
              <div className="mt-8 grid sm:grid-cols-3 gap-4">
                {[
                  { icon: Home, label: "Residential Builds" },
                  { icon: Wrench, label: "Renovation Works" },
                  { icon: Layers, label: "Construction Management" },
                ].map((f) => (
                  <div key={f.label} className="glass rounded-2xl p-4 hover:shadow-soft transition">
                    <f.icon className="text-primary" size={20} />
                    <div className="mt-3 text-sm font-semibold">{f.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <AboutSlideshow />
            </Reveal>
          </div>
        </Section>

        {/* Services */}
        <Section id="services" muted>
          <Reveal className="text-center max-w-2xl mx-auto">
            <Eyebrow center>Our Services</Eyebrow>
            <h2 className="mt-3 text-4xl md:text-5xl font-display font-bold leading-tight">
              Comprehensive solutions.<br />
              <span className="text-gradient-brand">Exceptional results.</span>
            </h2>
          </Reveal>

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.06}>
                <div className="group glass rounded-3xl p-7 h-full hover:shadow-card transition-all hover:-translate-y-1">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl gradient-brand text-primary-foreground shadow-soft">
                    <s.icon size={20} />
                  </div>
                  <h3 className="mt-5 text-lg font-display font-bold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* Finish Packages */}
        <Section id="packages">
          <Reveal className="text-center max-w-2xl mx-auto">
            <Eyebrow center>Finish Packages</Eyebrow>
            <h2 className="mt-3 text-4xl md:text-5xl font-display font-bold leading-tight">
              Three tiers.<br />
              <span className="text-gradient-brand">One standard of quality.</span>
            </h2>
            <p className="mt-5 text-muted-foreground">
              Transparent starting rates per square meter — tailored to fit your vision and budget.
            </p>
          </Reveal>

          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {packages.map((p, i) => (
              <Reveal key={p.tier} delay={i * 0.08}>
                <div
                  className={`relative h-full rounded-3xl p-8 transition-all hover:-translate-y-1 ${
                    p.featured
                      ? "gradient-brand text-primary-foreground shadow-glow"
                      : "glass shadow-card hover:shadow-card"
                  }`}
                >
                  {p.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 bg-background text-foreground rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.18em] font-bold shadow-card">
                      <Sparkles size={12} className="text-primary" /> Most Popular
                    </div>
                  )}
                  <div className={`text-[11px] uppercase tracking-[0.28em] font-bold ${p.featured ? "text-primary-foreground/80" : "text-primary"}`}>
                    {p.tier}
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-[11px] uppercase tracking-widest opacity-70">Starts @</span>
                  </div>
                  <div className="mt-1 text-3xl md:text-4xl font-display font-black leading-none">
                    {p.price}
                  </div>
                  <div className={`mt-2 text-xs ${p.featured ? "text-primary-foreground/85" : "text-muted-foreground"}`}>
                    {p.note}
                  </div>
                  <div className={`mt-6 h-px ${p.featured ? "bg-primary-foreground/25" : "bg-border"}`} />
                  <ul className="mt-6 space-y-3">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm">
                        <span className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${p.featured ? "bg-primary-foreground/20" : "bg-primary/10 text-primary"}`}>
                          <Check size={12} />
                        </span>
                        <span className={p.featured ? "" : "text-foreground/90"}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/consultation"
                    className={`mt-8 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                      p.featured
                        ? "bg-background text-foreground hover:scale-[1.02]"
                        : "gradient-brand text-primary-foreground hover:scale-[1.02]"
                    }`}
                  >
                    Request a Quote <ArrowRight size={14} />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <p className="mt-10 text-xs md:text-sm text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
              <span className="font-semibold text-foreground">Please note: </span>
              Package prices are approximate estimates and may vary depending on project scope,
              location, materials, site conditions, permits, professional fees, and customization requirements.
            </p>
          </Reveal>
        </Section>

        {/* Portfolio */}
        <Section id="portfolio" muted>
          <Reveal>
            <Eyebrow>Project Portfolio</Eyebrow>
            <h2 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-[1.05]">
              Explore all our <span className="text-gradient-brand">builds.</span>
            </h2>
            <p className="mt-5 text-muted-foreground max-w-2xl">
              From modern homes to multi-unit developments and commercial spaces, explore our portfolio
              of completed and ongoing projects built with quality, integrity, and purpose.
            </p>
          </Reveal>

          {/* Filters + Sort + Search */}
          <Reveal delay={0.1}>
            <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_auto_auto] lg:items-center">
              <div className="flex flex-wrap gap-2 min-w-0">
                {filters.map((f) => {
                  const isActive = filter === f;
                  return (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all ${
                        isActive
                          ? "gradient-brand text-primary-foreground shadow-soft"
                          : "glass hover:shadow-soft text-foreground/80"
                      }`}
                    >
                      {f}
                    </button>
                  );
                })}
              </div>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="appearance-none glass rounded-full pl-5 pr-10 py-2.5 text-sm font-medium cursor-pointer hover:shadow-soft transition w-full lg:w-auto"
                >
                  <option value="latest">Latest Projects</option>
                  <option value="name">Project Name</option>
                  <option value="completed">Completed First</option>
                  <option value="ongoing">Ongoing First</option>
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </div>
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search projects..."
                  className="glass rounded-full pl-11 pr-5 py-2.5 text-sm w-full lg:w-72 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                />
              </div>
            </div>
          </Reveal>

          {/* Grid */}
          <motion.div layout className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.slice(0, visible).map((p, i) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.45, delay: Math.min(i * 0.04, 0.3), ease: [0.22, 1, 0.36, 1] }}
                >
                  <ProjectCard project={p} onOpen={() => setActive(p)} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <p className="mt-10 text-center text-muted-foreground">No projects match your search.</p>
          )}

          {visible < filtered.length && (
            <Reveal className="mt-12 flex justify-center">
              <button
                onClick={() => setVisible((v) => v + 6)}
                className="inline-flex items-center gap-3 rounded-full px-7 py-3 text-sm font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition"
              >
                Load More Projects
                <ArrowRight size={16} />
              </button>
            </Reveal>
          )}
        </Section>

        {/* Website Estimator */}
        <EstimatorSection />


        {/* Process */}
        <Section id="process">
          <Reveal className="text-center max-w-2xl mx-auto">
            <Eyebrow center>Our Process</Eyebrow>
            <h2 className="mt-3 text-4xl md:text-5xl font-display font-bold leading-tight">
              A clear process.<br />
              <span className="text-gradient-brand">A solid foundation.</span>
            </h2>
          </Reveal>

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08}>
                <div className="relative glass rounded-3xl p-7 h-full">
                  <div className="text-5xl font-display font-black text-primary/20">{s.n}</div>
                  <div className="mt-2 inline-flex items-center justify-center h-10 w-10 rounded-xl gradient-brand text-primary-foreground">
                    <s.icon size={18} />
                  </div>
                  <h3 className="mt-4 font-display font-bold text-lg">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-14 flex justify-center">
            <Link
              to="/consultation"
              className="group inline-flex items-center gap-3 gradient-brand text-primary-foreground rounded-full pl-7 pr-2 py-3 font-semibold shadow-glow hover:scale-[1.02] transition"
            >
              Proceed to Consultation
              <span className="bg-background/25 rounded-full p-2 group-hover:translate-x-1 transition-transform">
                <ArrowRight size={16} />
              </span>
            </Link>
          </Reveal>
        </Section>

        <SiteFooter />
      </main>

      {/* Project Detail Modal */}
      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-background border-border">
          {active && (
            <div className="flex flex-col">
              <div className="relative h-56 md:h-72 overflow-hidden">
                <img src={active.img} alt={active.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${active.status === "Completed" ? "bg-emerald-500 text-white" : "bg-primary text-primary-foreground"}`}>
                    {active.status}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold bg-background/90 text-foreground">
                    {active.type}
                  </span>
                </div>
                <div className="pointer-events-none absolute -right-2 -bottom-6 text-[9rem] leading-none font-display font-black text-white/15 select-none">
                  {active.number}
                </div>
              </div>
              <div className="p-6 md:p-8">
                <DialogHeader>
                  <DialogTitle className="text-2xl md:text-3xl font-display font-bold">{active.title}</DialogTitle>
                  <DialogDescription className="flex items-center gap-1.5 text-sm">
                    <MapPin size={14} className="text-primary" /> {active.location}
                  </DialogDescription>
                </DialogHeader>
                <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">
                  {active.description}
                </p>
                <div className="mt-6">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-primary font-semibold mb-3">Highlights</div>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {active.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-sm">
                        <Check size={14} className="mt-0.5 text-primary shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <div className="group relative h-full rounded-3xl overflow-hidden glass shadow-card hover:shadow-glow transition-all hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={project.img}
          alt={project.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${project.status === "Completed" ? "bg-emerald-500 text-white" : "bg-primary text-primary-foreground"}`}>
            {project.status}
          </span>
          <span className="px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold bg-background/90 text-foreground">
            {project.type}
          </span>
        </div>
        <div className="pointer-events-none absolute -right-2 -bottom-6 text-[7rem] leading-none font-display font-black text-white/20 select-none">
          {project.number}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-display font-bold text-lg md:text-xl">{project.title}</h3>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin size={12} className="text-primary" /> {project.location}
        </div>
        <p className="mt-3 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {project.description}
        </p>
        <button
          onClick={onOpen}
          className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary hover:gap-3 transition-all"
        >
          View Details <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

function Section({ id, children, muted = false }: { id?: string; children: React.ReactNode; muted?: boolean }) {
  return (
    <section id={id} className={`scroll-mt-24 py-20 md:py-28 ${muted ? "bg-surface/40" : ""}`}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">{children}</div>
    </section>
  );
}

function Eyebrow({ children, center }: { children: React.ReactNode; center?: boolean }) {
  return (
    <div className={`flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-primary font-semibold ${center ? "justify-center" : ""}`}>
      <span className="h-px w-8 bg-primary" />
      {children}
    </div>
  );
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
