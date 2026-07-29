import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Building2, Hammer, CalendarCheck } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { PageTransition } from "@/components/page-transition";
import { CheckBookingModal } from "@/components/booking-modals";
import heroImage from "@/assets/helmet-hero-single.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IG Sabroso Construction — Your Dependable Building Partner" },
      { name: "description", content: "Premium construction, renovation, and civil works in Dasmariñas, Cavite. Build with confidence — build with Sabroso." },
      { property: "og:title", content: "IG Sabroso Construction — Your Dependable Building Partner" },
      { property: "og:description", content: "Premium construction, renovation, and civil works in Dasmariñas, Cavite. Build with confidence — build with Sabroso." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <PageTransition>
      <main
        className="relative w-full overflow-hidden bg-neutral-950 text-white"
        style={{ minHeight: "100svh" }}
      >
        {/* Hero background image — shared across all breakpoints */}
        <div className="absolute inset-0 z-0">
          <motion.img
            src={heroImage}
            alt="White safety hard hat on a construction site at golden hour"
            width={1920}
            height={1280}
            className="absolute inset-0 h-full w-full object-cover object-[70%_center] md:object-[65%_center] lg:object-center"
            initial={{ scale: 1.06, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* Directional gradients — keep helmet visible, darken text areas */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />
        </div>

        <SiteHeader floating />

        {/* Content grid */}
        <div
          className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col px-5 sm:px-8 lg:px-12"
          style={{ minHeight: "100svh", paddingTop: "clamp(96px, 14vh, 168px)", paddingBottom: "calc(env(safe-area-inset-bottom) + clamp(24px, 5vh, 56px))" }}
        >
          {/* Upper zone: booking (left) + headline+stats (right) */}
          <div className="grid flex-1 grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Booking utility panel */}
            <motion.aside
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-4 xl:col-span-4"
            >
              <div className="max-w-sm rounded-2xl border border-white/15 bg-white/10 p-5 sm:p-6 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/90 text-primary-foreground">
                    <CalendarCheck size={16} />
                  </span>
                  <div className="h-px flex-1 bg-white/20" />
                </div>
                <h2 className="mt-4 font-display text-lg sm:text-xl font-semibold text-white">
                  Already booked an appointment?
                </h2>
                <p className="mt-2 text-[13.5px] leading-relaxed text-white/75">
                  Manage your booking here to view details, reschedule, or cancel anytime.
                </p>
                <button
                  onClick={() => setBookingOpen(true)}
                  className="group mt-5 inline-flex w-full items-center justify-between gap-2 rounded-full bg-white px-5 py-3 text-[13px] font-bold uppercase tracking-[0.16em] text-neutral-900 transition hover:bg-white/90"
                >
                  Manage Booking
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground group-hover:translate-x-0.5 transition-transform">
                    <ArrowRight size={13} />
                  </span>
                </button>
              </div>
            </motion.aside>

            {/* Headline + metrics */}
            <div className="lg:col-span-8 xl:col-span-8 lg:pl-6">
              <div className="flex flex-col gap-8 lg:items-end lg:text-right">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="max-w-2xl"
                >
                  <div className="mb-4 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.28em] text-primary lg:justify-end">
                    <span className="h-px w-8 bg-primary" />
                    IG Sabroso Construction
                  </div>
                  <h1
                    className="font-display font-black tracking-[-0.03em] text-white leading-[1.02]"
                    style={{ fontSize: "clamp(32px, 6vw, 64px)" }}
                  >
                    Building the future with quality and trust.
                  </h1>
                </motion.div>

                {/* Metrics */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="grid w-full max-w-md grid-cols-2 gap-4 lg:max-w-sm"
                >
                  <MetricCard icon={<ShieldCheck size={16} />} value="10+" label="Years of construction experience" />
                  <MetricCard icon={<Building2 size={16} />} value="300+" label="Projects completed" />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Lower zone: Built to Last + CTA + slogan, centered */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-10 flex flex-col items-center gap-5 sm:mt-14"
          >
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-white/70">
              <Hammer className="text-primary" size={14} />
              <span>IG Sabroso</span>
              <span className="h-px w-6 bg-primary/70" />
              <span className="font-semibold text-primary">Built to Last</span>
            </div>

            <Link
              to="/details"
              hash="about"
              className="group relative inline-flex items-center gap-3 rounded-full gradient-brand text-primary-foreground pl-7 pr-2 py-2.5 sm:pl-9 sm:pr-3 sm:py-3 font-bold tracking-[0.18em] shadow-[0_16px_40px_rgba(228,68,22,0.4)] hover:scale-[1.02] transition-transform"
              style={{ fontSize: "clamp(13px, 1.6vw, 16px)", minHeight: 54 }}
            >
              <span className="absolute inset-0 rounded-full ring-1 ring-white/20" />
              DISCOVER MORE
              <span className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/20 group-hover:translate-x-1 transition-transform">
                <ArrowRight size={16} />
              </span>
            </Link>

            <p className="text-center text-[11px] uppercase tracking-[0.26em] text-white/70">
              Build with confidence — build with Sabroso.
            </p>
          </motion.div>
        </div>
      </main>

      <CheckBookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </PageTransition>
  );
}

function MetricCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
      <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl gradient-brand text-primary-foreground">
        {icon}
      </div>
      <div className="font-display text-3xl sm:text-4xl font-black leading-none text-white">{value}</div>
      <div className="mt-2 h-px w-8 bg-primary/70" />
      <div className="mt-2 text-[11.5px] leading-snug text-white/75">{label}</div>
    </div>
  );
}
