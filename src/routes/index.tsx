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
      <main className="relative w-full min-h-screen overflow-hidden bg-background">
        {/* Background image */}
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
          {/* Cinematic gradient overlay that complements the warm helmet image */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/35 to-background/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-background/30" />
        </div>

        <SiteHeader floating />


        {/* Left tagline + Check Booking CTA */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="absolute top-28 sm:top-32 md:top-40 left-4 sm:left-5 md:left-12 max-w-[78vw] sm:max-w-[260px] z-10"
        >
          <div className="h-0.5 w-10 gradient-brand rounded-full mb-3" />
          <p className="text-xs md:text-sm text-foreground/85 font-medium leading-relaxed whitespace-pre-line">
            Already booked an appointment?{"\n"}View details, reschedule, or cancel anytime here.
          </p>
          <button
            onClick={() => setBookingOpen(true)}
            aria-label="Check Booking Status"
            className="mt-5 group inline-flex items-center gap-2.5 rounded-full px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold tracking-wide bg-white/85 dark:bg-white/10 backdrop-blur-md text-foreground border border-white/40 shadow-card hover:bg-white hover:scale-[1.02] transition"
          >
            <CalendarCheck size={16} className="text-primary" />
            Manage Booking
          </button>
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

        {/* Floating stat cards — desktop/tablet only to avoid overlap on mobile */}
        <div className="hidden md:flex absolute right-4 md:right-12 top-1/2 -translate-y-1/2 flex-col gap-4 md:gap-5 z-10">
          <StatCard delay={0.7} icon={<ShieldCheck size={18} />} value="10+" label="Years of construction experience" />
          <StatCard delay={0.85} icon={<Building2 size={18} />} value="300+" label="Projects completed" />
        </div>


        {/* Bottom-left supporting tagline */}
        <div className="absolute left-0 right-0 bottom-0 z-10 px-4 sm:px-5 md:px-12 pb-6 sm:pb-8 md:pb-12 flex flex-col items-center gap-5 sm:gap-6">
          {/* Mobile inline stat row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="md:hidden grid grid-cols-2 gap-3 w-full max-w-[420px]"
          >
            <div className="glass rounded-2xl px-3 py-2.5 shadow-card flex items-center gap-2 min-w-0">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg gradient-brand text-primary-foreground">
                <ShieldCheck size={14} />
              </span>
              <div className="min-w-0">
                <div className="text-lg font-display font-black leading-none">10+</div>
                <div className="text-[10px] text-muted-foreground leading-tight truncate">Years experience</div>
              </div>
            </div>
            <div className="glass rounded-2xl px-3 py-2.5 shadow-card flex items-center gap-2 min-w-0">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg gradient-brand text-primary-foreground">
                <Building2 size={14} />
              </span>
              <div className="min-w-0">
                <div className="text-lg font-display font-black leading-none">300+</div>
                <div className="text-[10px] text-muted-foreground leading-tight truncate">Projects completed</div>
              </div>
            </div>
          </motion.div>

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

          {/* Primary + secondary CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.7 }}
            className="flex items-center"
          >
            <Link
              to="/details"
              hash="about"
              className="group relative inline-flex items-center gap-3 sm:gap-4 gradient-brand text-primary-foreground rounded-full pl-7 sm:pl-9 pr-2.5 sm:pr-3 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-bold tracking-[0.18em] shadow-glow hover:scale-[1.03] transition-transform"
            >
              <span className="absolute inset-0 rounded-full ring-1 ring-white/20" />
              DISCOVER MORE
              <span className="bg-background/25 rounded-full p-2 sm:p-2.5 group-hover:translate-x-1 transition-transform">
                <ArrowRight size={16} />
              </span>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.25, duration: 0.7 }}
            className="text-[10px] sm:text-[11px] md:text-xs uppercase tracking-[0.24em] sm:tracking-[0.28em] text-muted-foreground text-center px-2"
          >
            Build with confidence — build with Sabroso.
          </motion.p>
        </div>

      </main>

      <CheckBookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
      
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
