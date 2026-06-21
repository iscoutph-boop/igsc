import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Building2, Hammer, CalendarCheck } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { PageTransition } from "@/components/page-transition";
import { CheckBookingModal } from "@/components/booking-modals";
import helmetAsset from "@/assets/helmet-hero.png.asset.json";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IG Sabroso Construction — Your Dependable Building Partner" },
      { name: "description", content: "Premium construction, renovation, and civil works in Dasmariñas, Cavite. Build with confidence — build with Sabroso." },
      { property: "og:title", content: "IG Sabroso Construction" },
      { property: "og:description", content: "Already booked an appointment? View details, reschedule, or cancel anytime here." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const hero = helmetAsset.url;
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <PageTransition>
      {/* ============== MOBILE LAYOUT (< md) ============== */}
      <main className="md:hidden relative w-full min-h-screen bg-background overflow-x-hidden">
        <SiteHeader />

        {/* Hero block with background image */}
        <section className="relative w-full px-5 pt-6 pb-8">
          <div className="absolute inset-0 -z-0">
            <img
              src={hero}
              alt="IG Sabroso Construction crew safety helmets lined up at golden hour"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/55 to-background/95" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 max-w-[420px]"
          >
            <div className="h-[3px] w-10 gradient-brand rounded-full mb-5" />
            <h1 className="font-display font-black text-[26px] leading-[1.15] tracking-tight text-foreground">
              Building the future with quality and trust.
            </h1>
            <p className="mt-4 text-[15px] leading-[1.6] text-foreground/75">
              We deliver lasting construction solutions with confidence, precision, and integrity.
            </p>

            {/* Manage Booking supporting CTA */}
            <div className="mt-7 mb-2 w-full max-w-[360px]">
              <button
                onClick={() => setBookingOpen(true)}
                aria-label="Manage your booking"
                className="w-full flex items-center gap-3 rounded-2xl bg-white/90 dark:bg-white/10 backdrop-blur-md border border-white/60 dark:border-white/15 shadow-card px-4 py-3.5 text-left hover:bg-white transition"
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <CalendarCheck size={20} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-display font-bold text-[15px] leading-tight text-foreground">
                    Manage Booking
                  </span>
                  <span className="block text-[12px] leading-snug text-muted-foreground mt-0.5">
                    View, reschedule, or cancel anytime.
                  </span>
                </span>
                <ArrowRight size={18} className="text-primary shrink-0" />
              </button>
            </div>
          </motion.div>
        </section>

        {/* Tagline + primary CTA */}
        <section className="w-full px-5 pt-6 pb-2 flex flex-col items-center gap-5">
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-foreground/70">
            <Hammer className="text-primary" size={13} />
            <span>27 Sabroso</span>
            <span className="h-px w-5 bg-primary/60" />
            <span className="text-primary font-semibold">Built to Last</span>
          </div>

          <Link
            to="/details"
            hash="about"
            className="group relative w-full max-w-[360px] inline-flex items-center justify-center gap-3 gradient-brand text-primary-foreground rounded-full px-6 py-4 text-base font-bold tracking-[0.18em] shadow-glow"
          >
            <span className="absolute inset-0 rounded-full ring-1 ring-white/20" />
            DISCOVER MORE
            <span className="bg-background/25 rounded-full p-2 group-hover:translate-x-1 transition-transform">
              <ArrowRight size={16} />
            </span>
          </Link>

          <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground text-center px-2">
            Build with confidence — build with Sabroso.
          </p>
        </section>

        {/* Stats */}
        <section className="w-full px-5 pt-6 pb-8 grid grid-cols-2 gap-4">
          <MobileStatCard icon={<ShieldCheck size={16} />} value="10+" label="Years of construction experience" />
          <MobileStatCard icon={<Building2 size={16} />} value="300+" label="Projects completed" />
        </section>

        {/* Community footer microblock */}
        <section className="w-full px-5 pb-10 text-center">
          <p className="text-xs text-muted-foreground">Trusted by our community</p>
        </section>
      </main>

      {/* ============== DESKTOP / TABLET LAYOUT (≥ md) — unchanged ============== */}
      <main className="hidden md:block relative w-full min-h-screen overflow-hidden bg-background">
        <div className="absolute inset-0">
          <motion.img
            key={hero}
            src={hero}
            alt="IG Sabroso Construction crew safety helmets lined up at golden hour"
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/35 to-background/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-background/30" />
        </div>

        <SiteHeader floating />

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="absolute top-40 left-12 max-w-[260px] z-10"
        >
          <div className="h-0.5 w-10 gradient-brand rounded-full mb-3" />
          <p className="text-sm text-foreground/85 font-medium leading-relaxed">
            Already booked an appointment?<br />
            <span className="text-foreground/75">Manage your booking here — view details, reschedule, or cancel anytime.</span>
          </p>
          <button
            onClick={() => setBookingOpen(true)}
            aria-label="Manage your booking"
            className="mt-5 group inline-flex items-center gap-2.5 rounded-full px-5 py-3 text-sm font-semibold tracking-wide bg-white/85 dark:bg-white/10 backdrop-blur-md text-foreground border border-white/40 shadow-card hover:bg-white hover:scale-[1.02] transition"
          >
            <CalendarCheck size={16} className="text-primary" />
            Manage Booking
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="absolute top-40 right-12 max-w-[220px] text-right z-10"
        >
          <p className="text-sm text-foreground/85 font-medium leading-relaxed">
            Building the future with quality and trust.
          </p>
          <div className="h-0.5 w-10 gradient-brand rounded-full mt-3 ml-auto" />
        </motion.div>

        <div className="absolute right-12 top-1/2 -translate-y-1/2 flex flex-col gap-5 z-10">
          <StatCard delay={0.7} icon={<ShieldCheck size={18} />} value="10+" label="Years of construction experience" />
          <StatCard delay={0.85} icon={<Building2 size={18} />} value="300+" label="Projects completed" />
        </div>

        <div className="absolute left-0 right-0 bottom-0 z-10 px-12 pb-12 flex flex-col items-center gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="flex items-center gap-3 text-xs uppercase tracking-[0.32em] text-foreground/70"
          >
            <Hammer className="text-primary" size={14} />
            <span>27 Sabroso</span>
            <span className="h-px w-6 bg-primary/60" />
            <span className="text-primary font-semibold">Built to Last</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.7 }}
            className="flex items-center"
          >
            <Link
              to="/details"
              hash="about"
              className="group relative inline-flex items-center gap-4 gradient-brand text-primary-foreground rounded-full pl-9 pr-3 py-4 text-lg font-bold tracking-[0.18em] shadow-glow hover:scale-[1.03] transition-transform"
            >
              <span className="absolute inset-0 rounded-full ring-1 ring-white/20" />
              DISCOVER MORE
              <span className="bg-background/25 rounded-full p-2.5 group-hover:translate-x-1 transition-transform">
                <ArrowRight size={16} />
              </span>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.25, duration: 0.7 }}
            className="text-xs uppercase tracking-[0.28em] text-muted-foreground text-center"
          >
            Build with confidence — build with Sabroso.
          </motion.p>
        </div>
      </main>

      <CheckBookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </PageTransition>
  );
}

function MobileStatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="glass rounded-2xl p-4 shadow-card">
      <div className="inline-flex items-center justify-center h-9 w-9 rounded-xl gradient-brand text-primary-foreground mb-3">
        {icon}
      </div>
      <div className="text-3xl font-display font-black leading-none">{value}</div>
      <div className="mt-2 text-[11px] text-muted-foreground leading-snug">{label}</div>
    </div>
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
      className="glass rounded-2xl p-5 w-[210px] shadow-card"
    >
      <div className="inline-flex items-center justify-center h-9 w-9 rounded-xl gradient-brand text-primary-foreground mb-3">
        {icon}
      </div>
      <div className="text-4xl font-display font-black leading-none">{value}</div>
      <div className="mt-2 text-xs text-muted-foreground leading-snug">{label}</div>
    </motion.div>
  );
}
