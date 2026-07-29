import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CalendarCheck } from "lucide-react";
import { SiteHeaderHome } from "@/components/site-header-home";
import { PageTransition } from "@/components/page-transition";
import { CheckBookingModal } from "@/components/booking-modals";
import heroImage from "@/assets/helmet-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IG Sabroso Construction — Your Dependable Building Partner" },
      {
        name: "description",
        content:
          "Premium construction, renovation, and civil works in Dasmariñas, Cavite. Build with confidence — build with Sabroso.",
      },
      {
        property: "og:title",
        content: "IG Sabroso Construction — Your Dependable Building Partner",
      },
      {
        property: "og:description",
        content:
          "Premium construction, renovation, and civil works in Dasmariñas, Cavite. Build with confidence — build with Sabroso.",
      },
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
      <main className="relative w-full bg-neutral-950 text-white overflow-hidden">
        {/* Shared golden-hour hero — background on md+, inline visual on mobile */}
        <div className="absolute inset-0 z-0 hidden md:block" aria-hidden="true">
          <motion.img
            src={heroImage}
            alt=""
            width={1920}
            height={1280}
            className="absolute inset-0 h-full w-full object-cover object-center"
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* Directional gradients — only behind text and bottom, no full black wash */}
          <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-black/40 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>

        <SiteHeaderHome />

        {/* ============= md+ layout (tablet + desktop) ============= */}
        <section
          className="relative z-10 hidden md:block mx-auto w-full max-w-[1440px] px-8 lg:px-12"
          style={{
            minHeight: "100svh",
            paddingTop: "clamp(112px, 14vh, 176px)",
            paddingBottom: "clamp(28px, 5vh, 56px)",
          }}
        >
          {/* Upper zone: booking L / headline + metrics R */}
          <div className="grid grid-cols-12 gap-8 lg:gap-10">
            <motion.aside
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="col-span-6 lg:col-span-4"
            >
              <BookingPanel onOpen={() => setBookingOpen(true)} />
            </motion.aside>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="col-span-6 lg:col-span-8 lg:pl-8"
            >
              <div className="flex flex-col items-end text-right gap-8">
                <h1
                  className="font-display font-black tracking-[-0.03em] text-white leading-[1.02] max-w-2xl"
                  style={{ fontSize: "clamp(34px, 5.4vw, 66px)" }}
                >
                  Building the future with quality and trust.
                </h1>
                <MetricsColumn />
              </div>
            </motion.div>
          </div>

          {/* Lower zone: Built to Last heading, CTA, slogan — centered */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-10 lg:mt-16 flex flex-col items-center gap-6 text-center"
          >
            <h2
              className="font-display font-black tracking-[-0.02em] text-white leading-[0.95]"
              style={{ fontSize: "clamp(38px, 5.4vw, 72px)" }}
            >
              Built to Last.
            </h2>

            <DiscoverMore />

            <p className="text-[11px] uppercase tracking-[0.28em] text-white/75">
              Build with confidence — build with Sabroso.
            </p>
          </motion.div>
        </section>

        {/* ============= mobile layout (< md) ============= */}
        <section
          className="relative z-10 md:hidden mx-auto w-full max-w-[520px] px-5 flex flex-col gap-6"
          style={{
            minHeight: "100svh",
            paddingTop: "clamp(96px, 18vh, 132px)",
            paddingBottom: "calc(env(safe-area-inset-bottom) + 32px)",
          }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display font-black tracking-[-0.03em] text-white leading-[1.02]"
            style={{ fontSize: "clamp(34px, 10vw, 44px)" }}
          >
            Building the future with quality and trust.
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <BookingPanel onOpen={() => setBookingOpen(true)} />
          </motion.div>

          {/* Inline helmet visual */}
          <motion.figure
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative overflow-hidden rounded-3xl border border-white/10 shadow-[0_18px_40px_rgba(0,0,0,0.4)]"
          >
            <img
              src={heroImage}
              alt="White IG Sabroso hard hat on a construction site at golden hour"
              width={1920}
              height={1280}
              className="w-full h-auto object-cover"
            />
          </motion.figure>

          {/* Metrics row */}
          <MetricsRow />

          {/* Lower stack */}
          <div className="mt-2 flex flex-col items-center gap-5 text-center">
            <h2
              className="font-display font-black tracking-[-0.02em] text-white leading-[0.95]"
              style={{ fontSize: "clamp(36px, 11vw, 52px)" }}
            >
              Built to Last.
            </h2>
            <DiscoverMore />
            <p className="text-[10.5px] uppercase tracking-[0.26em] text-white/75">
              Build with confidence — build with Sabroso.
            </p>
          </div>
        </section>
      </main>

      <CheckBookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </PageTransition>
  );
}

// ---------- shared subcomponents ----------

function BookingPanel({ onOpen }: { onOpen: () => void }) {
  return (
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
        onClick={onOpen}
        className="group mt-5 inline-flex w-full items-center justify-between gap-2 rounded-full bg-white px-5 py-3 text-[13px] font-bold uppercase tracking-[0.16em] text-neutral-900 transition hover:bg-white/90 min-h-11"
      >
        Manage Booking
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground group-hover:translate-x-0.5 transition-transform">
          <ArrowRight size={13} />
        </span>
      </button>
    </div>
  );
}

/** Open metric layout used on md+ (vertical stack, thin orange rule at left) */
function MetricsColumn() {
  return (
    <div className="flex flex-col gap-6">
      <Metric value="10+" label="Years of construction experience" align="right" />
      <Metric value="300+" label="Projects completed" align="right" />
    </div>
  );
}

/** Two-column open row used on mobile, thin orange divider between */
function MetricsRow() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
      <Metric value="10+" label="Years of construction experience" align="left" />
      <div className="h-16 w-px bg-primary/60" aria-hidden="true" />
      <Metric value="300+" label="Projects completed" align="left" />
    </div>
  );
}

function Metric({
  value,
  label,
  align,
}: {
  value: string;
  label: string;
  align: "left" | "right";
}) {
  const isRight = align === "right";
  return (
    <div
      className={`flex items-start gap-4 ${isRight ? "flex-row-reverse text-right" : "text-left"}`}
    >
      <div
        className={`w-[3px] self-stretch min-h-[52px] bg-primary rounded-full`}
        aria-hidden="true"
      />
      <div>
        <div
          className="font-display font-black leading-none text-white"
          style={{ fontSize: "clamp(32px, 4.2vw, 52px)" }}
        >
          {value}
        </div>
        <div className="mt-2 text-[11.5px] uppercase tracking-[0.16em] text-white/75 max-w-[180px]">
          {label}
        </div>
      </div>
    </div>
  );
}

function DiscoverMore() {
  return (
    <Link
      to="/details"
      hash="about"
      className="group relative inline-flex items-center gap-3 rounded-full gradient-brand text-primary-foreground pl-7 pr-2 font-bold tracking-[0.18em] shadow-[0_16px_40px_rgba(228,68,22,0.4)] hover:scale-[1.02] transition-transform"
      style={{ fontSize: "clamp(13px, 1.4vw, 15px)", minHeight: 54 }}
    >
      <span className="absolute inset-0 rounded-full ring-1 ring-white/20" />
      DISCOVER MORE
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/20 group-hover:translate-x-1 transition-transform">
        <ArrowRight size={16} />
      </span>
    </Link>
  );
}
