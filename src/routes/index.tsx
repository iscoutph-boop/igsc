import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Building2, Hammer, CalendarCheck } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { PageTransition } from "@/components/page-transition";
import { CheckBookingModal } from "@/components/booking-modals";
import helmetAsset from "@/assets/helmet-hero.png.asset.json";
import excavatorMobile from "@/assets/excavator-hero-mobile.jpg";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IG Sabroso Construction — Your Dependable Building Partner" },
      { name: "description", content: "Premium construction, renovation, and civil works in Dasmariñas, Cavite. Build with confidence — build with Sabroso." },
      { property: "og:title", content: "IG Sabroso Construction — Your Dependable Building Partner" },
      { property: "og:description", content: "Premium construction, renovation, and civil works in Dasmariñas, Cavite. Build with confidence — build with Sabroso." },
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
      <main className="md:hidden relative w-full max-w-[100vw] min-h-[100svh] bg-background overflow-x-hidden pb-[calc(110px+env(safe-area-inset-bottom))]">
        <SiteHeader />

        {/* Hero — text left, image right (light theme) */}
        <section className="relative w-full overflow-hidden">
          {/* Image on right, behind text */}
          <div className="absolute right-0 top-0 h-[clamp(420px,72vw,560px)] w-[62%] pointer-events-none">
            <img
              src={excavatorMobile}
              alt="Orange excavator at an IG Sabroso construction site"
              className="absolute inset-0 h-full w-full object-cover object-left"
            />
            {/* Soft fade into background on the left edge of the image */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--background)_0%,rgba(255,255,255,0.55)_18%,rgba(255,255,255,0)_46%)]" />
            {/* Bottom fade so image blends into white before CTAs */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,var(--background)_100%)]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 px-5 pt-7 pb-4"
          >
            <div className="h-[3px] w-9 bg-primary rounded-full mb-4" />
            <h1
              className="font-display font-black tracking-[-0.04em] text-foreground leading-[0.95] max-w-[55%] break-words"
              style={{ fontSize: "clamp(40px, 12vw, 58px)" }}
            >
              Building<br />better<br />spaces,<br />lasting<br />value.
            </h1>

            <p className="mt-6 text-[15px] leading-[1.55] text-muted-foreground max-w-[58%]">
              Manage your booking with ease — view details, reschedule, or cancel anytime.
            </p>
          </motion.div>
        </section>

        {/* CTAs */}
        <section className="relative z-10 px-4 pt-4 pb-5 space-y-3">
          <Link
            to="/details"
            hash="about"
            className="group relative w-full inline-flex items-center justify-center gap-3 gradient-brand text-primary-foreground rounded-full pl-7 pr-2 h-[64px] max-[390px]:h-[58px] text-[14px] font-bold tracking-[0.22em] shadow-[0_18px_34px_rgba(228,68,22,0.34)]"
          >
            <span className="absolute inset-0 rounded-full ring-1 ring-white/25" />
            DISCOVER MORE
            <span className="bg-white/20 rounded-full h-11 w-11 inline-flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowRight size={16} />
            </span>
          </Link>

          <button
            onClick={() => setBookingOpen(true)}
            aria-label="Manage your booking"
            className="w-full inline-flex items-center justify-between gap-3 rounded-full bg-white text-foreground border border-black/5 shadow-[0_8px_22px_rgba(0,0,0,0.10)] h-[58px] max-[390px]:h-[54px] px-5 hover:bg-white/95 transition"
          >
            <CalendarCheck size={18} className="text-primary shrink-0" />
            <span className="font-semibold text-[15px]">Manage Booking</span>
            <ArrowRight size={16} className="text-primary shrink-0" />
          </button>
        </section>

        {/* Brand card */}
        <section className="px-4 pb-6">
          <div className="rounded-[22px] bg-white border border-black/5 shadow-card px-5 py-5">
            <div className="flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.22em] text-foreground/70">
              <Hammer className="text-primary" size={13} />
              <span className="font-medium">IG Sabroso</span>
              <span className="h-px w-5 bg-primary/60" />
              <span className="text-primary font-semibold">Built to Last</span>
            </div>
            <p className="mt-4 text-[11.5px] uppercase tracking-[0.22em] text-muted-foreground text-center leading-[1.6]">
              Build with confidence —<br />build with Sabroso.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <MobileStatCard icon={<ShieldCheck size={16} />} value="10+" label="Years of construction experience" />
            <MobileStatCard icon={<Building2 size={16} />} value="300+" label="Projects completed" />
          </div>
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
    <div className="glass rounded-[24px] p-[18px] shadow-card min-h-[150px] flex flex-col">
      <div className="inline-flex items-center justify-center h-9 w-9 rounded-xl gradient-brand text-primary-foreground mb-3">
        {icon}
      </div>
      <div className="text-[42px] font-display font-black leading-none">{value}</div>
      <div className="mt-2 text-[13px] text-muted-foreground leading-snug">{label}</div>
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
