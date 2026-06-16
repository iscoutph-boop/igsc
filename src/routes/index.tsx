import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Building2, Hammer } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { PageTransition } from "@/components/page-transition";
import { useTheme } from "@/components/theme-provider";
import heroDark from "@/assets/hero-house.jpg";
import heroLight from "@/assets/hero-house-light.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IG Sabroso Construction — Your Dependable Building Partner" },
      { name: "description", content: "Premium construction, renovation, and civil works in Dasmariñas, Cavite. Build with confidence — build with Sabroso." },
      { property: "og:title", content: "IG Sabroso Construction" },
      { property: "og:description", content: "Dependable building solutions for homes, renovations, and civil works." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { theme } = useTheme();
  const hero = theme === "dark" ? heroDark : heroLight;

  return (
    <PageTransition>
      <main className="relative w-screen min-h-screen overflow-hidden bg-background">
        {/* Background image */}
        <div className="absolute inset-0">
          <motion.img
            key={hero}
            src={hero}
            alt="Modern luxury residence built by IG Sabroso Construction"
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="absolute inset-0 hero-overlay" />
        </div>

        <SiteHeader floating />

        {/* Giant transparent brand text */}
        <div className="pointer-events-none absolute left-0 right-0 top-[14%] md:top-[16%] flex justify-center px-4">
          <h1 className="font-display font-black tracking-tighter text-center text-foreground/10 dark:text-white/[0.07] text-[18vw] sm:text-[16vw] md:text-[13vw] leading-none select-none whitespace-nowrap">
            IG SABROSO
          </h1>
        </div>

        {/* Left tagline */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="absolute top-32 md:top-40 left-5 md:left-12 max-w-[240px] z-10"
        >
          <div className="h-0.5 w-10 gradient-brand rounded-full mb-3" />
          <p className="text-xs md:text-sm text-foreground/85 font-medium leading-relaxed">
            Dependable building solutions for homes, renovations, and civil works.
          </p>
        </motion.div>

        {/* Right tagline */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="hidden md:block absolute top-40 right-12 max-w-[220px] text-right z-10"
        >
          <p className="text-sm text-foreground/85 font-medium leading-relaxed">
            Building the future with quality and trust.
          </p>
          <div className="h-0.5 w-10 gradient-brand rounded-full mt-3 ml-auto" />
        </motion.div>

        {/* Floating stat cards */}
        <div className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 flex flex-col gap-4 md:gap-5 z-10">
          <StatCard delay={0.7} icon={<ShieldCheck size={18} />} value="10+" label="Years of construction experience" />
          <StatCard delay={0.85} icon={<Building2 size={18} />} value="300+" label="Projects completed" />
        </div>

        {/* Bottom-left supporting tagline */}
        <div className="absolute left-0 right-0 bottom-0 z-10 px-5 md:px-12 pb-8 md:pb-12 flex flex-col items-center gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="hidden md:flex items-center gap-3 text-xs uppercase tracking-[0.32em] text-foreground/70"
          >
            <Hammer className="text-primary" size={14} />
            <span>27 Sabroso</span>
            <span className="h-px w-6 bg-primary/60" />
            <span className="text-primary font-semibold">Built to Last</span>
          </motion.div>

          {/* Primary centered CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.7 }}
          >
            <Link
              to="/details"
              className="group relative inline-flex items-center gap-4 gradient-brand text-primary-foreground rounded-full pl-9 pr-3 py-4 text-base md:text-lg font-bold tracking-[0.18em] shadow-glow hover:scale-[1.03] transition-transform"
            >
              <span className="absolute inset-0 rounded-full ring-1 ring-white/20" />
              DISCOVER MORE
              <span className="bg-background/25 rounded-full p-2.5 group-hover:translate-x-1 transition-transform">
                <ArrowRight size={18} />
              </span>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.25, duration: 0.7 }}
            className="text-[11px] md:text-xs uppercase tracking-[0.28em] text-muted-foreground"
          >
            Build with confidence — build with Sabroso.
          </motion.p>
        </div>
      </main>
    </PageTransition>
  );
}

function StatCard({
  icon, value, label, delay,
}: { icon: React.ReactNode; value: string; label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ y: -4 }}
      className="glass rounded-2xl p-4 md:p-5 w-[180px] md:w-[210px] shadow-card"
    >
      <div className="inline-flex items-center justify-center h-9 w-9 rounded-xl gradient-brand text-primary-foreground mb-3">
        {icon}
      </div>
      <div className="text-3xl md:text-4xl font-display font-black leading-none">{value}</div>
      <div className="mt-2 text-[11px] md:text-xs text-muted-foreground leading-snug">{label}</div>
    </motion.div>
  );
}
