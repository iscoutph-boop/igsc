import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight, Home, Wrench, Building2, HardHat, Ruler, Box, PencilRuler,
  Compass, Hammer, Layers, CheckCircle2,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageTransition } from "@/components/page-transition";
import aboutImg from "@/assets/about.jpg";
import p1 from "@/assets/project-1.jpg";
import p2 from "@/assets/project-2.jpg";
import p3 from "@/assets/project-3.jpg";
import p4 from "@/assets/project-4.jpg";

export const Route = createFileRoute("/details")({
  head: () => ({
    meta: [
      { title: "About, Services & Projects — IG Sabroso Construction" },
      { name: "description", content: "Discover IG Sabroso Construction: residential builds, renovations, civil works, design-build services, and featured projects across Cavite." },
      { property: "og:title", content: "About IG Sabroso Construction" },
      { property: "og:description", content: "Built on trust. Driven by excellence. Creating lasting spaces." },
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

const projects = [
  { img: p1, title: "Modern Hillside Residence", tag: "Residential" },
  { img: p2, title: "Urban Modern Home", tag: "Residential" },
  { img: p3, title: "Contemporary Villa", tag: "Luxury" },
  { img: p4, title: "Commercial Building", tag: "Commercial" },
];

const steps = [
  { n: "01", title: "Consultation", desc: "Understanding your needs, vision, and budget.", icon: Compass },
  { n: "02", title: "Planning", desc: "Designs, drawings, schedules, and strategy.", icon: Ruler },
  { n: "03", title: "Building", desc: "Quality construction with precision and care.", icon: Hammer },
  { n: "04", title: "Turnover", desc: "Delivering on time, with perfection.", icon: CheckCircle2 },
];

function DetailsPage() {
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
              <div className="relative">
                <div className="absolute -inset-4 gradient-brand opacity-20 blur-3xl rounded-3xl" />
                <img
                  src={aboutImg}
                  alt="Premium home interior built by IG Sabroso"
                  loading="lazy"
                  width={1400}
                  height={1000}
                  className="relative rounded-3xl shadow-card w-full object-cover aspect-[4/3]"
                />
                <div className="absolute -bottom-6 -left-6 glass rounded-2xl p-5 shadow-card">
                  <div className="text-3xl font-display font-black">10+</div>
                  <div className="text-xs text-muted-foreground">Years building trust</div>
                </div>
              </div>
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
                  <div className="mt-5 text-xs font-semibold text-primary inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                    Learn more <ArrowRight size={12} />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* Projects */}
        <Section id="projects">
          <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <Eyebrow>Featured Projects</Eyebrow>
              <h2 className="mt-3 text-4xl md:text-5xl font-display font-bold leading-tight">
                Spaces crafted <span className="text-gradient-brand">with purpose.</span>
              </h2>
            </div>
            <p className="text-muted-foreground max-w-sm">
              A glimpse of recent residences and commercial works we've proudly delivered.
            </p>
          </Reveal>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {projects.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="group relative overflow-hidden rounded-3xl shadow-card cursor-pointer">
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src={p.img}
                      alt={p.title}
                      loading="lazy"
                      width={1200}
                      height={1500}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider bg-primary/90 mb-2">{p.tag}</span>
                    <h3 className="font-display font-bold text-lg leading-tight">{p.title}</h3>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* Process */}
        <Section id="process" muted>
          <Reveal className="text-center max-w-2xl mx-auto">
            <Eyebrow center>Our Process</Eyebrow>
            <h2 className="mt-3 text-4xl md:text-5xl font-display font-bold leading-tight">
              A clear process.<br />
              <span className="text-gradient-brand">A solid foundation.</span>
            </h2>
          </Reveal>

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5 relative">
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
    </PageTransition>
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
