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
import { Lightbox } from "@/components/lightbox";
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
import up6 from "@/assets/up-6.jpg.asset.json";
import up7 from "@/assets/up-7.jpg.asset.json";
import up9 from "@/assets/up-9.jpg.asset.json";
import up10 from "@/assets/up-10.jpg.asset.json";
import up11 from "@/assets/up-11.jpg.asset.json";
import up12 from "@/assets/up-12.jpg.asset.json";
import meeting1 from "@/assets/meeting-472871.jpg.asset.json";
import meeting2 from "@/assets/meeting-615890.jpg.asset.json";
import meeting3 from "@/assets/meeting-616099.jpg.asset.json";
import meeting4 from "@/assets/meeting-619956.jpg.asset.json";
import meeting5 from "@/assets/meeting-622434.jpg.asset.json";
import meeting6 from "@/assets/meeting-626269.jpg.asset.json";
import meeting7 from "@/assets/meeting-628710.jpg.asset.json";
import carousel1 from "@/assets/carousel-1.jpg.asset.json";
import carousel2 from "@/assets/carousel-2.jpg.asset.json";
import carousel3 from "@/assets/carousel-3.jpg.asset.json";
import carousel4 from "@/assets/carousel-4.jpg.asset.json";
import carousel5 from "@/assets/carousel-5.jpg.asset.json";
import miniPreview1 from "@/assets/mini-preview-1.png.asset.json";
import miniPreview2 from "@/assets/mini-preview-2.png.asset.json";
import miniPreview3 from "@/assets/mini-preview-3.png.asset.json";
import miniPreview4 from "@/assets/mini-preview-4.png.asset.json";
import ongoingThumbAsset from "@/assets/portfolio-ongoing-thumb.png.asset.json";
import apartmentThumbAsset from "@/assets/portfolio-apartment-thumb.png.asset.json";
import renovationThumbAsset from "@/assets/portfolio-renovation-thumb.png.asset.json";
import residentialThumbAsset from "@/assets/portfolio-residential-thumb.png.asset.json";
import commercialThumbAsset from "@/assets/portfolio-commercial-thumb.png.asset.json";
import completedThumbAsset from "@/assets/portfolio-completed-thumb.png.asset.json";
import { ChevronLeft, ChevronRight, MessageSquareQuote, Users, Handshake, Building2 } from "lucide-react";

const aRes = aResAsset.url;
const oRes = oResAsset.url;
const iRes = iResAsset.url;
const lRes = lResAsset.url;
const bApt = bAptAsset.url;
const keystone = keystoneAsset.url;
const fRes = fResAsset.url;

// Project images for the large slideshow
const interiorSlides = [carousel1.url, carousel2.url, carousel3.url, carousel4.url, carousel5.url];

// Images for the mini floating preview card
const exteriorImages = [miniPreview1.url, miniPreview2.url, miniPreview3.url, miniPreview4.url];


const galleryPool = [igs1.url, igs2.url, igs3.url, igs4.url, igs6.url, igs7.url, igs8.url, igs9.url];

const meetingImages = [meeting1.url, meeting2.url, meeting3.url, meeting4.url, meeting5.url, meeting6.url, meeting7.url];

const testimonials = [
  { name: "The Kim Family", project: "Kim Residence — Two-Storey Home", location: "Dasmariñas, Cavite", rating: 5,
    quote: "From the first consultation to turnover, the IG Sabroso team handled every detail with professionalism. The transparency in pricing and the quality of finishes exceeded our expectations." },
  { name: "Mr. & Mrs. Wong", project: "Wong Residence — Two-Storey Residential", location: "Imus, Cavite", rating: 5,
    quote: "They truly listened to our vision and turned it into a real home we are proud of. Honest communication, on-time milestones, and craftsmanship you can feel walking through every room." },
  { name: "The Prudencio Family", project: "Prudencio Residence — Four Bedrooms", location: "San Agustin, Cavite", rating: 5,
    quote: "What stood out was how organized the build was. Site updates, material recommendations, and design refinements — everything was thoughtful. Highly recommended." },
];



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

const slugify = (s: string) => "service-" + s.toLowerCase().replace(/&/g, "").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");

const services = [
  { icon: Home, title: "Residential Construction", desc: "Custom homes built to last with craftsmanship and care.",
    long: "From new builds to expansions, we deliver residential projects that combine craftsmanship, durable materials, and thoughtful space planning — designed around how your family actually lives." },
  { icon: Wrench, title: "Renovation & Remodeling", desc: "Reimagine your space with modern, functional upgrades.",
    long: "Full or partial remodels, kitchen and bath updates, room conversions, and modernization works — executed cleanly, on schedule, with minimal disruption to your routine." },
  { icon: HardHat, title: "Civil Works", desc: "Reliable infrastructure for roads, drainage, and foundations.",
    long: "Site development, foundations, drainage, retaining walls, and roadworks built to engineering specs. Reliable groundwork for residential, commercial, and institutional projects." },
  { icon: Ruler, title: "Design-Build Services", desc: "One team from concept to handover — seamless delivery.",
    long: "Architecture, engineering, and construction under one accountable team. One contract, one timeline, fewer surprises — from first sketches all the way to turnover." },
  { icon: Compass, title: "Construction Management", desc: "Timelines, budgets, and quality kept on track end to end.",
    long: "Project oversight, scheduling, cost control, subcontractor coordination, QA/QC, and clear weekly reporting — so you always know where the build stands." },
  { icon: PencilRuler, title: "Architectural Drawings", desc: "Precise, code-ready plans tailored to your vision.",
    long: "Concept design, floor plans, elevations, working drawings, and permit-ready documentation prepared by licensed professionals to local codes." },
  { icon: Box, title: "3D Rendering & Visualization", desc: "See your project in lifelike detail before we break ground.",
    long: "Photorealistic interior and exterior renders, walkthrough animations, and material studies that let you experience the design before construction starts." },
].map((s) => ({ ...s, id: slugify(s.title) }));

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
  { id: "v-res", title: "V Residence", status: "Ongoing", type: "Residential", location: "Imus City, Cavite", number: "13", img: fRes,
    description: "An ongoing residential project showcasing contemporary architecture and quality craftsmanship.",
    highlights: ["2-vehicle carport", "Living area", "Kitchen area", "Dining area", "4 Bedrooms", "3 Restrooms"] },
];

const packages = [
  { tier: "STANDARD FINISH", price: "₱30,000 – ₱34,000", note: "per square meter", featured: false, badge: "",
    features: ["Standard structural works", "Quality basic finishes", "Essential fixtures", "Standard electrical & plumbing", "Painted interior walls"] },
  { tier: "SEMI-ELEGANT FINISH", price: "₱35,000 – ₱39,000", note: "per square meter", featured: true, badge: "Popular Pick",
    features: ["Reinforced structural works", "Upgraded floor & wall tiles", "Better fixtures & cabinetry", "Quality electrical & plumbing", "Accent walls & ceiling details"] },
  { tier: "ELEGANT FINISH", price: "₱40,000 – ₱45,000", note: "per square meter", featured: true, badge: "Most Recommended",
    features: ["Premium structural works", "Designer finishes & tiles", "High-grade fixtures", "Enhanced electrical & plumbing", "Custom cabinetry & built-ins"] },
  { tier: "LUXURY", price: "Starts @ ₱50,000", note: "depending on design complexity", featured: false, badge: "",
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
  const [folder, setFolder] = useState<Filter | null>(null);
  const [active, setActive] = useState<Project | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("latest");
  const [visible, setVisible] = useState(6);
  const [zoomGroup, setZoomGroup] = useState<string[]>([]);
  const [zoomIndex, setZoomIndex] = useState<number>(-1);
  const openZoom = (src: string, group?: string[]) => {
    const g = group && group.length ? group : [src];
    setZoomGroup(g);
    const idx = g.indexOf(src);
    setZoomIndex(idx >= 0 ? idx : 0);
  };
  const closeZoom = () => { setZoomIndex(-1); setZoomGroup([]); };
  const [overviewOpen, setOverviewOpen] = useState(false);

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

  const folderDefs: { key: Filter; label: string; icon: typeof Home; desc: string }[] = [
    { key: "Completed", label: "Completed", icon: CheckCircle2, desc: "Delivered & turned over" },
    { key: "Ongoing", label: "Ongoing", icon: HardHat, desc: "Currently under construction" },
    { key: "Residential", label: "Residential", icon: Home, desc: "Custom family homes" },
    { key: "Apartment", label: "Apartment", icon: Building, desc: "Multi-unit dwellings" },
    { key: "Commercial", label: "Commercial", icon: Layers, desc: "Commercial buildings" },
    { key: "Renovation", label: "Renovation", icon: Wrench, desc: "Remodels & transformations" },
  ];

  const folderCount = (k: Filter) =>
    k === "Completed" || k === "Ongoing"
      ? projects.filter((p) => p.status === k).length
      : projects.filter((p) => p.type === k).length;

  const folderCover = (k: Filter) => {
    const customThumbs: Partial<Record<Filter, string>> = {
      Completed: completedThumbAsset.url,
      Ongoing: ongoingThumbAsset.url,
      Residential: residentialThumbAsset.url,
      Apartment: apartmentThumbAsset.url,
      Commercial: commercialThumbAsset.url,
      Renovation: renovationThumbAsset.url,
    };

    if (customThumbs[k]) return customThumbs[k];

    const list = k === "Completed" || k === "Ongoing"
      ? projects.filter((p) => p.status === k)
      : projects.filter((p) => p.type === k);
    return list[0]?.img ?? projects[0].img;
  };

  const openFolder = (k: Filter) => {
    setFolder(k);
    setFilter(k);
    setQuery("");
    setVisible(6);
  };

  const closeFolder = () => {
    setFolder(null);
    setFilter("All");
    setQuery("");
  };

  const sectionIds = ["about", "services", "packages", "portfolio", "meetings", "reviews", "process", "estimator"] as const;

  const scrollToHash = (hash: string, smooth = true) => {
    const id = hash.replace(/^#/, "");
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
  };

  const handleServiceClick = (f: Filter) => {
    if (f === "All") {
      setFolder(null);
      setFilter("All");
    } else {
      openFolder(f);
    }
    if (typeof window !== "undefined" && window.location.hash !== "#portfolio") {
      window.history.pushState(null, "", "#portfolio");
    }
    requestAnimationFrame(() => scrollToHash("portfolio"));
  };

  const scrollToService = (id: string) => {
    if (typeof window === "undefined") return;
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    // brief highlight
    el.classList.add("ring-2", "ring-primary", "shadow-glow");
    window.setTimeout(() => {
      el.classList.remove("ring-2", "ring-primary", "shadow-glow");
    }, 1600);
    window.history.replaceState(null, "", `#${id}`);
  };


  // Handle initial hash on mount (refresh / direct link).
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash) {
      const id = window.requestAnimationFrame(() => scrollToHash(window.location.hash, false));
      const t = window.setTimeout(() => scrollToHash(window.location.hash, false), 250);
      return () => {
        window.cancelAnimationFrame(id);
        window.clearTimeout(t);
      };
    }
  }, []);

  // Listen for hashchange / back-forward to scroll to the appropriate section.
  useEffect(() => {
    const onHashChange = () => scrollToHash(window.location.hash);
    const onPop = () => scrollToHash(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("popstate", onPop);
    };
  }, []);

  // Scroll-spy: as the user scrolls between sections, push a new history entry
  // so the browser Back button returns to the previously-viewed section.
  useEffect(() => {
    if (typeof window === "undefined") return;
    let current = window.location.hash.replace(/^#/, "") || "";
    let isProgrammatic = false;
    let popTimer: number | null = null;

    const markProgrammatic = () => {
      isProgrammatic = true;
      if (popTimer) window.clearTimeout(popTimer);
      popTimer = window.setTimeout(() => { isProgrammatic = false; }, 800);
    };
    window.addEventListener("hashchange", markProgrammatic);
    window.addEventListener("popstate", markProgrammatic);

    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammatic) return;
        // Pick the entry closest to the top of the viewport that is intersecting.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (!visible) return;
        const id = visible.target.id;
        if (!id || id === current) return;
        current = id;
        // Push a real history entry so Back returns to the previous section.
        window.history.pushState(null, "", `#${id}`);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", markProgrammatic);
      window.removeEventListener("popstate", markProgrammatic);
      if (popTimer) window.clearTimeout(popTimer);
    };
  }, []);






  return (
    <PageTransition>
      <SiteHeader />
      <main className="w-full">
        {/* About */}
        <section id="about" className="scroll-mt-24 py-10 sm:py-14 md:py-20">
          <div className="max-w-[1760px] mx-auto px-4 sm:px-6 md:px-10 xl:px-14 2xl:px-20">

            <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              <Reveal className="lg:col-span-4 xl:col-span-3">
                <Eyebrow>About Us</Eyebrow>
                <h2 className="mt-3 text-4xl md:text-5xl lg:text-[3.25rem] font-display font-bold leading-[1.05]">
                  Built on trust.<br />
                  Driven by <span className="text-gradient-brand">excellence.</span>
                </h2>
                <p className="mt-6 text-muted-foreground text-base leading-relaxed">
                  IG Sabroso Construction is a full-service construction company committed to
                  delivering high-quality, dependable, and efficient building solutions. From
                  concept to completion, we bring expertise, transparency, and dedication to every project.
                </p>
                <div className="mt-8 grid grid-cols-1 gap-3">
                  {[
                    { icon: Home, label: "Residential Builds", filter: "Residential" as Filter },
                    { icon: Wrench, label: "Renovation Works", filter: "Renovation" as Filter },
                    { icon: Layers, label: "Project Portfolio", filter: "All" as Filter },
                  ].map((f) => (
                    <button
                      key={f.label}
                      type="button"
                      onClick={() => handleServiceClick(f.filter)}
                      aria-label={`View ${f.label} projects`}
                      className="group text-left glass rounded-2xl p-4 hover:shadow-soft transition-all hover:-translate-y-1 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <f.icon className="text-primary" size={20} />
                          <div className="text-sm font-semibold">{f.label}</div>
                        </div>
                        <ArrowRight size={14} className="text-primary transition-transform group-hover:translate-x-1" />

                      </div>
                    </button>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={0.15} className="lg:col-span-8 xl:col-span-9">
                <AboutSlideshow onZoom={openZoom} />
              </Reveal>
            </div>
          </div>
        </section>


        {/* Services */}
        <Section id="services" muted>
          <Reveal className="text-center max-w-2xl mx-auto">
            <Eyebrow center>Our Services</Eyebrow>
            <h2 className="mt-3 text-4xl md:text-5xl font-display font-bold leading-tight">
              Comprehensive solutions.<br />
              <span className="text-gradient-brand">Exceptional results.</span>
            </h2>
          </Reveal>

          {/* Mobile: horizontal swipe row. sm+: original grid. */}
          <div className="mt-14 sm:hidden -mx-4 px-4 overflow-x-auto snap-x snap-mandatory flex gap-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {services.map((s) => (
              <button
                key={s.title}
                type="button"
                onClick={() => scrollToService(s.id)}
                className="snap-start shrink-0 w-[78%] text-left glass rounded-3xl p-6 hover:shadow-card transition active:scale-[0.99]"
              >
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl gradient-brand text-primary-foreground shadow-soft">
                  <s.icon size={20} />
                </div>
                <h3 className="mt-5 text-lg font-display font-bold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </button>
            ))}
          </div>
          <div className="mt-14 hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.06}>
                <button
                  type="button"
                  onClick={() => scrollToService(s.id)}
                  className="group text-left w-full glass rounded-3xl p-7 h-full hover:shadow-card transition-all hover:-translate-y-1"
                >
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl gradient-brand text-primary-foreground shadow-soft">
                    <s.icon size={20} />
                  </div>
                  <h3 className="mt-5 text-lg font-display font-bold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary group-hover:gap-3 transition-all">
                    Learn more <ArrowRight size={14} />
                  </span>
                </button>
              </Reveal>
            ))}
          </div>

          {/* Service details — anchor targets with brief highlight on scroll-in */}
          <div className="mt-16 grid gap-4">
            {services.map((s) => (
              <div
                key={s.id}
                id={s.id}
                className="scroll-mt-28 glass rounded-2xl p-6 md:p-7 border border-transparent transition-colors duration-500"
              >
                <div className="flex items-start gap-4">
                  <span className="inline-flex items-center justify-center h-11 w-11 shrink-0 rounded-xl gradient-brand text-primary-foreground">
                    <s.icon size={18} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display font-bold text-lg md:text-xl">{s.title}</h3>
                    <p className="mt-1.5 text-sm md:text-base text-muted-foreground leading-relaxed">{s.long}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>


        {/* Finish Packages */}
        <Section id="packages">
          <Reveal className="text-center max-w-2xl mx-auto">
            <Eyebrow center>Finish Packages</Eyebrow>
            <h2 className="mt-3 text-4xl md:text-5xl font-display font-bold leading-tight">
              Four finish tiers.<br />
              <span className="text-gradient-brand">One standard of quality.</span>
            </h2>
            <p className="mt-5 text-muted-foreground">
              Transparent rates per square meter — tailored to fit your vision and budget.
            </p>
          </Reveal>

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((p, i) => (
              <Reveal key={p.tier} delay={i * 0.08}>
                <PackageCard p={p} />
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
              Explore all our <span className="text-primary">builds.</span>
            </h2>
            <p className="mt-5 text-muted-foreground max-w-2xl">
              From modern homes to multi-unit developments and commercial spaces, explore our portfolio
              of completed and ongoing projects built with quality, integrity, and purpose.
            </p>
          </Reveal>

          {folder === null ? (
            // Folder grid view
            <Reveal delay={0.1}>
              <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {folderDefs.map((f, i) => (
                  <motion.button
                    key={f.key}
                    type="button"
                    onClick={() => openFolder(f.key)}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.25) }}
                    className="group relative text-left bg-card rounded-3xl overflow-hidden shadow-card hover:shadow-glow hover:-translate-y-1 transition-all border border-border/50"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img src={folderCover(f.key)} alt={f.label} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.08]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                      <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur text-foreground px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] font-bold shadow-sm">
                        <Building2 size={12} className="text-primary group-hover:scale-110 transition-transform" /> {f.key === "Ongoing" ? "ON-GOING" : f.key.toUpperCase()}
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                        <div className="min-w-0 text-white">
                          <div className="font-display font-black text-2xl truncate drop-shadow">{"\n"}</div>
                          <div className="text-xs opacity-95">{f.desc}</div>
                        </div>
                        <div className="shrink-0 rounded-full bg-white/15 backdrop-blur-xl border border-primary/40 text-white px-3 py-1.5 text-xs font-bold group-hover:bg-primary/90 group-hover:border-primary transition">
                          {folderCount(f.key)} {folderCount(f.key) === 1 ? "project" : "projects"}
                        </div>
                      </div>
                    </div>
                    <div className="p-5 flex items-center justify-center bg-card">
                      <span className="inline-flex items-center gap-2 text-primary text-sm font-semibold group-hover:brightness-110">
                        Open Project <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </Reveal>
          ) : (
            <>
              {/* Folder header + back */}
              <Reveal delay={0.1}>
                <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <button onClick={closeFolder} className="hover:text-foreground transition inline-flex items-center gap-1.5">
                      <ChevronLeft size={16} /> All Folders
                    </button>
                    <span>›</span>
                    <span className="text-primary font-semibold">{folder}</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <div className="relative">
                      <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value as SortKey)}
                        className="appearance-none glass rounded-full pl-5 pr-10 py-2.5 text-sm font-medium cursor-pointer hover:shadow-soft transition"
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
                        placeholder="Search project"
                        list="portfolioSearchList"
                        className="glass rounded-full pl-11 pr-5 py-2.5 text-sm w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                      />
                      <datalist id="portfolioSearchList">
                        {projects.map((p) => (
                          <option key={p.id} value={p.title} />
                        ))}
                        {Array.from(new Set(projects.map((p) => p.location))).map((loc) => (
                          <option key={loc} value={loc} />
                        ))}
                      </datalist>
                    </div>
                  </div>
                </div>
              </Reveal>

              <motion.div layout className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      <ProjectCard project={p} onOpen={() => setActive(p)} onZoom={(src) => openZoom(src, filtered.slice(0, visible).map((x) => x.img))} />
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

              <Reveal className="mt-10 flex justify-center">
                <button
                  onClick={closeFolder}
                  className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold glass hover:shadow-soft transition"
                >
                  <ChevronLeft size={14} /> Back to Project Portfolio
                </button>
              </Reveal>
            </>
          )}
        </Section>


        {/* Client Reviews moved below Client & Team Meetings */}

        {/* Website Estimator */}
        <EstimatorSection />

        {/* Client & Team Meetings */}
        <Section id="meetings" muted>
          <Reveal className="max-w-3xl">
            <Eyebrow><Handshake size={12} className="inline mr-1" /> Client & Team Meetings</Eyebrow>
            <h2 className="mt-3 text-4xl md:text-5xl font-display font-bold leading-[1.05]">
              Understanding your vision,<br />
              <span className="text-gradient-brand">together.</span>
            </h2>
            <p className="mt-5 text-muted-foreground max-w-2xl">
              Every project starts with a real conversation. We sit with our clients, review plans
              and materials, and align with our team — so what we build truly reflects how you want to live.
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {meetingImages.map((src, i) => (
              <Reveal key={src} delay={Math.min(i * 0.05, 0.3)}>
                <button
                  type="button"
                  onClick={() => openZoom(src, meetingImages)}
                  aria-label={`Open meeting photo ${i + 1}`}
                  className={`relative rounded-2xl overflow-hidden shadow-card group block w-full ${i === 0 ? "col-span-2 row-span-2 aspect-[4/3] md:aspect-[4/5]" : "aspect-square"}`}
                >
                  <img src={src} alt={`IG Sabroso client meeting ${i + 1}`} loading="lazy" decoding="async" sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 720px" className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110 cursor-zoom-in select-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
                </button>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10 grid sm:grid-cols-3 gap-4">
            {[
              { icon: Compass, title: "Consultation", desc: "We listen first — your needs, vision, and budget guide every decision." },
              { icon: Users, title: "Collaboration", desc: "Our team, designers, and engineers work side by side with you." },
              { icon: ClipboardCheck, title: "Aligned Execution", desc: "Clear plans, regular updates, no surprises during the build." },
            ].map((c) => (
              <div key={c.title} className="glass rounded-2xl p-5 flex items-start gap-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl gradient-brand text-primary-foreground">
                  <c.icon size={18} />
                </span>
                <div className="min-w-0">
                  <div className="font-display font-bold">{c.title}</div>
                  <div className="text-sm text-muted-foreground mt-1 leading-relaxed">{c.desc}</div>
                </div>
              </div>
            ))}
          </Reveal>
        </Section>

        {/* Client Reviews — under Client & Team Meetings */}
        <Section id="reviews">
          <Reveal className="text-center max-w-2xl mx-auto">
            <Eyebrow center>Client Reviews</Eyebrow>
            <h2 className="mt-3 text-4xl md:text-5xl font-display font-bold leading-tight">
              Trusted by families.<br />
              <span className="text-gradient-brand">Proven by results.</span>
            </h2>
            <p className="mt-5 text-muted-foreground">
              Real feedback from clients we have built with — from the first consultation to turnover day.
            </p>
          </Reveal>

          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08}>
                <div className="relative h-full glass rounded-3xl p-7 shadow-card hover:shadow-glow transition-all hover:-translate-y-1">
                  <MessageSquareQuote className="text-primary/30 absolute top-5 right-5" size={36} />
                  <div className="flex items-center gap-1 text-primary">
                    {Array.from({ length: t.rating }).map((_, k) => (
                      <Star key={k} size={14} className="fill-primary" />
                    ))}
                  </div>
                  <p className="mt-5 text-sm md:text-base text-foreground/90 leading-relaxed italic">
                    “{t.quote}”
                  </p>
                  <div className="mt-6 pt-5 border-t border-border flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full gradient-brand text-primary-foreground font-display font-black">
                      {t.name.split(" ").slice(-1)[0]?.[0] ?? "C"}
                    </span>
                    <div className="min-w-0">
                      <div className="font-display font-bold text-sm truncate">{t.name}</div>
                      <div className="text-[11px] text-muted-foreground truncate">{t.project}</div>
                      <div className="text-[11px] text-primary mt-0.5 flex items-center gap-1"><MapPin size={10} /> {t.location}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>






        {/* Process */}
        <Section id="process">
          <Reveal className="text-center max-w-2xl mx-auto">
            <Eyebrow center>Our Process</Eyebrow>
            <h2 className="mt-3 text-4xl md:text-5xl font-display font-bold leading-tight">
              A clear process.<br />
              <span className="text-gradient-brand">A solid foundation.</span>
            </h2>
          </Reveal>

          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
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

      {/* Project Detail Modal — styled like the About Page 3 reference */}
      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="w-[96vw] sm:w-auto max-w-6xl p-0 overflow-hidden bg-background border-border max-h-[92vh] overflow-y-auto">
          {active && <ProjectDetail project={active} onClose={() => setActive(null)} onZoom={openZoom} />}
        </DialogContent>
      </Dialog>

      {/* Shared lightbox — used by About, Collaboration, Meetings, Portfolio, Project gallery */}
      <Lightbox
        images={zoomGroup}
        index={zoomIndex}
        onIndexChange={setZoomIndex}
        onClose={closeZoom}
      />
    </PageTransition>
  );
}

function ProjectDetail({ project, onClose, onZoom }: { project: Project; onClose: () => void; onZoom?: (src: string, group?: string[]) => void }) {
  // Build a gallery using project hero + 4 rotating gallery images
  const start = (Number(project.number) * 2) % galleryPool.length;
  const gallery = [project.img, ...Array.from({ length: 5 }, (_, i) => galleryPool[(start + i) % galleryPool.length])];
  const [hero, setHero] = useState(gallery[0]);

  return (
    <div className="p-5 md:p-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
        <button onClick={onClose} className="hover:text-foreground transition">Home</button>
        <span>›</span>
        <button onClick={onClose} className="hover:text-foreground transition">Projects</button>
        <span>›</span>
        <span className="text-primary font-semibold">{project.title}</span>
      </nav>

      <div className="mt-6 grid lg:grid-cols-2 gap-8 lg:gap-10">
        {/* Left — gallery */}
        <div>
          <div className="relative rounded-3xl overflow-hidden shadow-card aspect-[4/3]">
            <img
              src={hero}
              alt={project.title}
              decoding="async"
              sizes="(max-width: 1024px) 96vw, 640px"
              className="h-full w-full object-cover cursor-zoom-in select-none"
              onDoubleClick={() => onZoom?.(hero)}
            />
            <button
              type="button"
              onClick={() => onZoom?.(hero)}
              className="absolute bottom-4 left-4 inline-flex items-center gap-2 bg-background/90 backdrop-blur rounded-full px-4 py-2 text-xs font-semibold hover:bg-background transition"
            >
              <ImageIcon size={14} className="text-primary" /> View Full Gallery
            </button>
          </div>
          <div className="mt-4 grid grid-cols-4 sm:grid-cols-6 gap-2 md:gap-3">
            {gallery.slice(0, 6).map((g, i) => (
              <button
                key={i}
                onClick={() => setHero(g)}
                onDoubleClick={() => onZoom?.(g)}
                className={`relative aspect-square rounded-xl overflow-hidden transition ${hero === g ? "ring-2 ring-primary" : "opacity-80 hover:opacity-100"}`}
              >
                <img src={g} alt={`${project.title} ${i + 1}`} loading="lazy" decoding="async" sizes="(max-width: 640px) 25vw, 120px" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <div className="mt-5 glass rounded-2xl p-4 flex items-center gap-4">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full gradient-brand text-primary-foreground">
              <Award size={18} />
            </span>
            <div>
              <div className="text-sm font-bold">Built on Trust. Driven by Excellence.</div>
              <div className="text-xs text-muted-foreground">Every project reflects our commitment to quality, transparency, and client satisfaction.</div>
            </div>
          </div>
        </div>

        {/* Right — meta */}
        <div>
          <h2 className="text-4xl md:text-5xl font-display font-bold leading-[1.05]">{project.title}</h2>
          <div className="mt-3 flex items-center gap-1.5 text-sm">
            <MapPin size={16} className="text-primary" /> {project.location}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold gradient-brand text-primary-foreground">
              <Home size={12} /> {project.type}
            </span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${project.status === "Completed" ? "border-emerald-500 text-emerald-600" : "border-primary text-primary"}`}>
              {project.status}
            </span>
          </div>
          <p className="mt-5 text-muted-foreground leading-relaxed">{project.description}</p>

          <div className="mt-6 glass rounded-2xl p-5 grid grid-cols-2 gap-5">
            <MetaItem icon={Building} label="Project Type" value={project.type} sub="New Construction" />
            <MetaItem icon={Square} label="Floor Area" value="220.00 sqm" sub="Total Floor Area" />
            <MetaItem icon={ClipboardCheck} label="Status" value={project.status} sub={project.status === "Completed" ? "Turned Over" : "In Progress"} />
            <MetaItem icon={CalendarDays} label="Timeline" value="6 Months" sub="Jan 2024 – Jun 2024" />
          </div>

          <div className="mt-5 glass rounded-2xl p-5">
            <div className="font-display font-bold mb-3">Project Features</div>
            <ul className="grid sm:grid-cols-2 gap-2.5">
              {project.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check size={12} />
                  </span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function PackageCard({ p }: { p: typeof packages[number] }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`relative h-full rounded-3xl p-7 transition-all hover:-translate-y-1 ${
        p.featured
          ? "gradient-brand text-primary-foreground shadow-glow"
          : "glass shadow-card hover:shadow-card"
      }`}
    >
      {p.featured && p.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center bg-background text-foreground rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.18em] font-bold shadow-card whitespace-nowrap">
          {p.badge}
        </div>
      )}
      <div className={`text-[11px] uppercase tracking-[0.22em] font-bold ${p.featured ? "text-primary-foreground/80" : "text-primary"}`}>
        {p.tier}
      </div>
      <div className="mt-4 text-2xl md:text-[1.75rem] font-display font-black leading-none">
        {p.price}
      </div>
      <div className={`mt-2 text-xs ${p.featured ? "text-primary-foreground/85" : "text-muted-foreground"}`}>
        {p.note}
      </div>
      <div className={`mt-6 h-px ${p.featured ? "bg-primary-foreground/25" : "bg-border"}`} />
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`mt-5 w-full inline-flex items-center justify-between gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
          p.featured
            ? "bg-background text-foreground hover:scale-[1.02]"
            : "gradient-brand text-primary-foreground hover:scale-[1.02]"
        }`}
      >
        {open ? "Hide Checklist" : "Tap to View Checklist"}
        <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul className="mt-5 space-y-3">
          {p.features.map((f) => (
            <li key={f} className="flex items-start gap-3 text-sm">
              <span className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${p.featured ? "bg-primary-foreground/20" : "bg-primary/10 text-primary"}`}>
                <Check size={12} />
              </span>
              <span className={p.featured ? "" : "text-foreground/90"}>{f}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function MetaItem({ icon: Icon, label, value, sub }: { icon: typeof Building; label: string; value: string; sub: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon size={18} />
      </span>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="font-display font-bold text-base leading-tight">{value}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
      </div>
    </div>
  );
}


function extractMeta(highlights: string[]) {
  const find = (re: RegExp) => {
    for (const h of highlights) { const m = h.match(re); if (m) return m[1]; }
    return null;
  };
  const beds = find(/(\d+)\s*Bedroom/i);
  const baths = find(/(\d+)\s*(Restroom|Bathroom)/i);
  const cars = find(/(\d+)[-\s]?vehicle\s*carport/i);
  return { beds, baths, cars };
}

function ProjectCard({ project, onOpen, onZoom }: { project: Project; onOpen: () => void; onZoom?: (src: string, group?: string[]) => void }) {
  const meta = extractMeta(project.highlights);
  return (
    <div className="group relative h-full rounded-3xl overflow-hidden glass shadow-card hover:shadow-glow transition-all hover:-translate-y-1 flex flex-col">
      <button
        type="button"
        onClick={() => onZoom?.(project.img)}
        aria-label={`Preview ${project.title}`}
        className="relative aspect-[4/3] overflow-hidden block w-full cursor-zoom-in"
      >
        <img
          src={project.img}
          alt={project.title}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
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
      </button>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display font-bold text-lg md:text-xl">{project.title}</h3>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin size={12} className="text-primary" /> {project.location}
        </div>
        {(meta.beds || meta.baths || meta.cars) && (
          <div className="mt-3 flex items-center gap-3 text-xs">
            {meta.beds && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-foreground font-semibold">
                <Bed size={13} className="text-primary" /> {meta.beds}
              </span>
            )}
            {meta.baths && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-foreground font-semibold">
                <Bath size={13} className="text-primary" /> {meta.baths}
              </span>
            )}
            {meta.cars && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-foreground font-semibold">
                <HardHat size={13} className="text-primary" /> {meta.cars}
              </span>
            )}
          </div>
        )}
        <p className="mt-3 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {project.description}
        </p>
        <button
          onClick={onOpen}
          className="mt-auto pt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary hover:gap-3 transition-all self-start"
        >
          Open Project <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}


function Section({ id, children, muted = false }: { id?: string; children: React.ReactNode; muted?: boolean }) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 py-10 sm:py-14 md:py-20 ${muted ? "bg-gradient-to-b from-transparent via-surface/40 to-transparent" : ""}`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10">{children}</div>
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

function AboutSlideshow({ onZoom }: { onZoom?: (src: string, group?: string[]) => void } = {}) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [exterior, setExterior] = useState(exteriorImages[0]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % interiorSlides.length), 4500);
    return () => clearInterval(t);
  }, [paused]);

  const prev = () => setIdx((i) => (i - 1 + interiorSlides.length) % interiorSlides.length);
  const next = () => setIdx((i) => (i + 1) % interiorSlides.length);

  const thumbs = exteriorImages.filter((e) => e !== exterior).slice(0, 3);

  return (
    <div className="relative mx-auto w-full sm:w-[92%] lg:w-[88%]">
      <div className="absolute -inset-6 gradient-brand opacity-10 blur-3xl rounded-[2rem] pointer-events-none" />

      {/* Main slideshow — full width */}
      <div
        className="relative rounded-3xl shadow-card overflow-hidden aspect-[4/3] md:aspect-[16/10] lg:aspect-[16/9] group select-none cursor-zoom-in"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onClick={() => onZoom?.(interiorSlides[idx], interiorSlides)}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={interiorSlides[idx]}
            src={interiorSlides[idx]}
            alt={`IG Sabroso interior project ${idx + 1}`}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-xl border border-white/25 text-white rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] font-bold shadow-soft">
          <span className={`h-1.5 w-1.5 rounded-full ${paused ? "bg-white/70" : "bg-emerald-400 animate-pulse"}`} />
          {paused ? "Paused — tap to resume" : "Autoplay"}
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 backdrop-blur-xl border border-white/25 text-white shadow-soft hover:bg-white/25 transition opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 backdrop-blur-xl border border-white/25 text-white shadow-soft hover:bg-white/25 transition opacity-0 group-hover:opacity-100"
        >
          <ArrowRight size={20} />
        </button>

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5">
          {interiorSlides.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setIdx(i); }}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === idx ? "w-8 bg-primary" : "w-3 bg-white/60 hover:bg-white"}`}
            />
          ))}
        </div>

        {/* Mini exterior preview card — glass overlay inside the carousel */}
        <div className="absolute bottom-5 right-5 hidden sm:block w-[180px] md:w-[210px] lg:w-[240px] bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl p-2.5 shadow-card">
          <div className="relative rounded-xl overflow-hidden aspect-[4/3]">
            <AnimatePresence mode="wait">
              <motion.img
                key={exterior}
                src={exterior}
                alt="IG Sabroso exterior"
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {thumbs.map((t) => (
              <button
                key={t}
                onClick={() => setExterior(t)}
                aria-label="Preview exterior"
                className="relative aspect-square rounded-md overflow-hidden ring-1 ring-white/30 hover:ring-primary transition"
              >
                <img src={t} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <div className="px-1 pt-2 pb-0.5 text-[10px] uppercase tracking-[0.16em] font-bold text-white/90">
            CLIENT COLLABORATION
          </div>
        </div>
      </div>
    </div>
  );
}



type Pkg = "Standard" | "Semi-elegant" | "Elegant" | "Luxury";
const PKG_RATE: Record<Pkg, number> = { Standard: 32000, "Semi-elegant": 37000, Elegant: 42500, Luxury: 55000 };
const ADDONS = [
  { id: "gate", label: "Gate & Fence" },
  { id: "carport", label: "Carport" },
  { id: "interior", label: "Interior Fit-Out" },
  { id: "smart", label: "Smart Home Features" },
] as const;

function EstimatorSection() {
  const [projectType, setProjectType] = useState("");
  const [location, setLocation] = useState("");
  const [floors, setFloors] = useState(2);
  const [area, setArea] = useState<number | "">("");
  const [pkg, setPkg] = useState<Pkg | "">("");
  const [bedrooms, setBedrooms] = useState(4);
  const [bathrooms, setBathrooms] = useState(3);
  const [site, setSite] = useState("");
  const [addons, setAddons] = useState<string[]>([]);
  const [showSummary, setShowSummary] = useState(false);

  const safeArea = typeof area === "number" && area >= 10 ? area : 0;
  const rate = pkg ? PKG_RATE[pkg] : 0;
  const base = safeArea * rate;
  // Add-ons are excluded from the estimated total — manually quoted after consultation.
  const low = Math.round(base * 1.0);
  const high = Math.round(base * 1.18);
  const fmt = (n: number) => "₱" + n.toLocaleString("en-PH");
  const selectedAddons = ADDONS.filter((a) => addons.includes(a.id));
  const canEstimate = !!pkg && safeArea >= 10;

  const inclusions = ["Structural Works", "Doors & Windows", "Electrical & Plumbing", "Paint Works", "Roofing & Ceiling", "Basic Fixtures & Fittings", "Flooring & Wall Finishes"];

  return (
    <Section id="estimator">
      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-12 items-start">
        <Reveal>
          <Eyebrow>Price Estimator</Eyebrow>
          <h2 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-[1.05]">
            Estimate your build<br />
            before you <span className="text-gradient-brand">begin.</span>
          </h2>
          <p className="mt-5 text-muted-foreground max-w-xl">
            Get a quick and reliable estimated construction cost based on your project details.
            Customize your preferences and see how your vision comes to life.
          </p>

          <div className="mt-8 glass rounded-3xl p-6 md:p-7 shadow-card space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Project Type">
                <TextInputWithIcon
                  value={projectType}
                  onChange={setProjectType}
                  placeholder="e.g. Residential, Commercial, Renovation..."
                  icon={<Home size={16} />}
                  list="estProjectTypes"
                />
                <datalist id="estProjectTypes">
                  <option value="Residential House" />
                  <option value="Apartment" />
                  <option value="Commercial" />
                  <option value="Renovation" />
                  <option value="Civil Works" />
                </datalist>
              </Field>
              <Field label="Project Location">
                <TextInputWithIcon
                  value={location}
                  onChange={setLocation}
                  placeholder="Barangay, City, Province / Country"
                  icon={<MapPin size={16} />}
                />
              </Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Floor Area (sqm)">
                <div className="flex items-center gap-2 bg-background rounded-xl border border-border px-4 py-3">
                  <Square size={16} className="text-primary" />
                  <input
                    type="number"
                    min={10}
                    placeholder="Min. 10 sqm"
                    value={area === "" ? "" : area}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "") setArea("");
                      else setArea(Math.max(0, Number(v) || 0));
                    }}
                    className="bg-transparent w-full focus:outline-none"
                  />
                  <span className="text-xs text-muted-foreground px-2 py-0.5 rounded bg-muted">sqm</span>
                </div>
                {area !== "" && area < 10 && (
                  <p className="mt-1.5 text-[11px] text-destructive">Floor area must be at least 10 sqm.</p>
                )}
              </Field>
              <Field label="Number of Floors">
                <SelectInput
                  value={`${floors} Floor${floors > 1 ? "s" : ""}`}
                  onChange={(v) => setFloors(Number(v.split(" ")[0]))}
                  options={["1 Floor", "2 Floors", "3 Floors", "4 Floors", "5 Floors"]}
                  icon={<Layers size={16} />}
                />
              </Field>
            </div>

            <Field label="Package Type">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {(["Standard", "Semi-elegant", "Elegant", "Luxury"] as Pkg[]).map((p) => {
                  const active = pkg === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPkg(p)}
                      className={`text-left rounded-2xl border-2 p-4 transition ${active ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`h-4 w-4 rounded-full border-2 ${active ? "border-primary bg-primary" : "border-muted-foreground/40"}`} />
                        <Home size={16} className="text-primary" />
                        <span className="font-bold text-sm">{p}</span>
                      </div>
                      <div className="mt-1.5 text-[11px] text-muted-foreground">
                        {p === "Standard" && "₱30k–34k / sqm — essentials"}
                        {p === "Semi-elegant" && "₱35k–39k / sqm — upgraded"}
                        {p === "Elegant" && "₱40k–45k / sqm — premium"}
                        {p === "Luxury" && "₱50k+ / sqm — high-end"}
                      </div>
                    </button>
                  );
                })}
              </div>
              {!pkg && (
                <p className="mt-2 text-[11px] text-muted-foreground">Please select a package to see your estimate.</p>
              )}
            </Field>

            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Bedrooms">
                <SelectInput value={String(bedrooms)} onChange={(v) => setBedrooms(Number(v))} options={["1", "2", "3", "4", "5", "6"]} icon={<Bed size={16} />} />
              </Field>
              <Field label="Bathrooms">
                <SelectInput value={String(bathrooms)} onChange={(v) => setBathrooms(Number(v))} options={["1", "2", "3", "4", "5"]} icon={<Bath size={16} />} />
              </Field>
              <Field label="Site Condition">
                <TextInputWithIcon
                  value={site}
                  onChange={setSite}
                  placeholder="Describe the site (e.g. flat, sloped, tight access)"
                  icon={<HardHat size={16} />}
                  list="estSiteList"
                />
                <datalist id="estSiteList">
                  <option value="Flat & Accessible" />
                  <option value="Sloped Site" />
                  <option value="Tight Access" />
                  <option value="Coastal / Soft Soil" />
                </datalist>
              </Field>
            </div>

            <Field label="Optional Add-Ons">
              <div className="grid sm:grid-cols-2 gap-2.5">
                {ADDONS.map((a) => {
                  const checked = addons.includes(a.id);
                  return (
                    <label key={a.id} className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 cursor-pointer transition ${checked ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => setAddons((prev) => e.target.checked ? [...prev, a.id] : prev.filter((x) => x !== a.id))}
                        className="accent-primary h-4 w-4"
                      />
                      <span className="flex-1 text-sm font-medium">{a.label}</span>
                    </label>
                  );
                })}
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground leading-relaxed">
                Add-ons are manually estimated after project review, site condition checking, and final design scope.
              </p>
            </Field>

            {/* Mobile: Estimate Summary button */}
            <div className="md:hidden pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowSummary(true);
                  requestAnimationFrame(() => {
                    document.getElementById("estimator-mobile-summary")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  });
                }}
                className="w-full inline-flex items-center justify-center gap-2 gradient-brand text-primary-foreground rounded-full px-6 py-3 font-semibold shadow-glow"
              >
                <Calculator size={16} /> View Estimate Summary
              </button>
            </div>
          </div>
        </Reveal>

        {/* Summary — desktop */}
        <Reveal delay={0.12} className="hidden md:block">
          <EstimateSummary
            pkg={pkg}
            area={typeof area === "number" ? area : 0}
            rate={rate}
            low={low}
            high={high}
            canEstimate={canEstimate}
            selectedAddons={selectedAddons}
            inclusions={inclusions}
            fmt={fmt}
          />
        </Reveal>
      </div>

      {/* Summary — mobile (revealed by button) */}
      {showSummary && (
        <div id="estimator-mobile-summary" className="md:hidden mt-8">
          <EstimateSummary
            pkg={pkg}
            area={typeof area === "number" ? area : 0}
            rate={rate}
            low={low}
            high={high}
            canEstimate={canEstimate}
            selectedAddons={selectedAddons}
            inclusions={inclusions}
            fmt={fmt}
          />
        </div>
      )}
    </Section>
  );
}

function EstimateSummary({
  pkg, area, rate, low, high, canEstimate, selectedAddons, inclusions, fmt,
}: {
  pkg: Pkg | "";
  area: number;
  rate: number;
  low: number;
  high: number;
  canEstimate: boolean;
  selectedAddons: { id: string; label: string }[];
  inclusions: string[];
  fmt: (n: number) => string;
}) {
  return (
    <div className="lg:sticky lg:top-24 glass rounded-3xl p-6 md:p-8 shadow-card">
      <div className="flex items-center gap-2 text-primary">
        <Calculator size={18} />
        <span className="text-[11px] uppercase tracking-[0.22em] font-bold">Estimate Summary</span>
      </div>

      {!canEstimate ? (
        <div className="mt-5 text-sm text-muted-foreground">
          Choose a <span className="font-semibold text-foreground">package</span> and enter a <span className="font-semibold text-foreground">floor area (min 10 sqm)</span> to see your estimated range.
        </div>
      ) : (
        <>
          <div className="mt-5 pb-5 border-b border-border">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-bold">Base Rate ({pkg} Package)</div>
                <div className="text-xs text-muted-foreground">Based on selected floor area</div>
              </div>
              <div className="text-right">
                <div className="text-primary font-bold">{fmt(rate)} / sqm</div>
                <div className="text-xs text-muted-foreground">{area} sqm</div>
              </div>
            </div>
          </div>
          <div className="mt-5 pb-5 border-b border-border">
            <div className="font-bold">Estimated Construction Range</div>
            <div className="mt-1 text-2xl md:text-3xl font-display font-black text-primary">
              {fmt(low)} – {fmt(high)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Based on project complexity and finishes</div>
          </div>
        </>
      )}

      {selectedAddons.length > 0 && (
        <div className="mt-5 pb-5 border-b border-border">
          <div className="font-bold">Selected Add-Ons</div>
          <ul className="mt-2 space-y-1.5">
            {selectedAddons.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-primary shrink-0" />
                  {a.label}
                </span>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                  Manual estimate required
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Add-ons receive a custom quote after consultation and are not included in the range above.
          </p>
        </div>
      )}

      {pkg && (
        <div className="mt-5">
          <div className="flex items-center gap-2">
            <Star size={16} className="text-primary" />
            <span className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Selected Package</span>
          </div>
          <div className="mt-1 font-display font-black text-xl">{pkg}</div>
          <div className="text-xs text-muted-foreground">Quality materials, modern design</div>
        </div>
      )}

      <div className="mt-5">
        <div className="font-bold mb-3">Inclusions Summary</div>
        <ul className="grid sm:grid-cols-2 gap-2 text-sm">
          {inclusions.map((i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0" />
              <span>{i}</span>
            </li>
          ))}
        </ul>
      </div>

      {canEstimate && (
        <div className="mt-6 rounded-2xl bg-primary/5 border border-primary/20 p-5 text-center">
          <div className="text-[11px] uppercase tracking-[0.22em] font-bold text-muted-foreground">Estimated Total Budget</div>
          <div className="mt-2 text-2xl md:text-3xl font-display font-black text-primary">
            {fmt(low)} – {fmt(high)}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">This is an estimated budget only.</div>
        </div>
      )}

      <Link
        to="/consultation"
        className="mt-5 group w-full inline-flex items-center justify-center gap-3 gradient-brand text-primary-foreground rounded-full px-7 py-4 font-semibold shadow-glow hover:scale-[1.01] transition"
      >
        Get Detailed Estimate
        <span className="bg-background/25 rounded-full p-2 group-hover:translate-x-1 transition-transform">
          <ArrowRight size={16} />
        </span>
      </Link>
      <p className="mt-3 text-[11px] text-muted-foreground text-center leading-relaxed">
        Final cost may vary based on design, site condition, finishes, and scope of work.
      </p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-bold mb-2">{label}</div>
      {children}
    </div>
  );
}

function SelectInput({ value, onChange, options, icon }: { value: string; onChange: (v: string) => void; options: string[]; icon?: React.ReactNode }) {
  return (
    <div className="relative">
      {icon && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">{icon}</span>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none w-full bg-background rounded-xl border border-border ${icon ? "pl-11" : "pl-4"} pr-10 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40`}
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

function TextInputWithIcon({
  value, onChange, placeholder, icon, list,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; icon?: React.ReactNode; list?: string;
}) {
  return (
    <div className="relative">
      {icon && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">{icon}</span>}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        list={list}
        className={`w-full bg-background rounded-xl border border-border ${icon ? "pl-11" : "pl-4"} pr-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40`}
      />
    </div>
  );
}

