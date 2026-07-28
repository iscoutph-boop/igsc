import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Building2, CalendarCheck, Hammer, ShieldCheck } from "lucide-react";
import excavatorMobile from "@/assets/excavator-hero-mobile.jpg";
import helmetAsset from "@/assets/helmet-hero.png.asset.json";
import { SiteHeader } from "@/components/site-header";

export function HomeHero({ onManageBooking }: { onManageBooking: () => void }) {
  const hero = helmetAsset.url;

  return (
    <>
      <div className="relative w-full max-w-[100vw] overflow-x-hidden bg-background pb-[calc(110px+env(safe-area-inset-bottom))] md:hidden">
        <SiteHeader />

        <section className="relative w-full overflow-hidden" aria-labelledby="home-heading-mobile">
          <div className="pointer-events-none absolute right-0 top-0 h-[clamp(420px,72vw,560px)] w-[62%]">
            <img
              src={excavatorMobile}
              alt="Orange excavator at an IG Sabroso construction site"
              className="absolute inset-0 h-full w-full object-cover object-left"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--background)_0%,rgba(255,255,255,0.55)_18%,rgba(255,255,255,0)_46%)]" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,var(--background)_100%)]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 px-5 pb-4 pt-7"
          >
            <div className="mb-4 h-[3px] w-9 rounded-full bg-primary" />
            <h1
              id="home-heading-mobile"
              className="max-w-[55%] break-words font-display font-black leading-[0.95] tracking-[-0.04em] text-foreground"
              style={{ fontSize: "clamp(40px, 12vw, 58px)" }}
            >
              Building <br />
              better <br />
              spaces, <br />
              lasting <br />
              value.
            </h1>

            <p className="mt-6 max-w-[58%] text-[15px] leading-[1.55] text-muted-foreground">
              Manage your booking with ease — view details, reschedule, or cancel anytime.
            </p>
          </motion.div>
        </section>

        <section aria-label="Hero actions" className="relative z-10 space-y-3 px-4 pb-5 pt-4">
          <a
            href="#about"
            className="group relative inline-flex h-[64px] w-full items-center justify-center gap-3 rounded-full gradient-brand pl-7 pr-2 text-[14px] font-bold tracking-[0.22em] text-primary-foreground shadow-[0_18px_34px_rgba(228,68,22,0.34)] max-[390px]:h-[58px]"
          >
            <span className="absolute inset-0 rounded-full ring-1 ring-white/25" />
            DISCOVER MORE
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/20 transition-transform group-hover:translate-x-1">
              <ArrowRight size={16} />
            </span>
          </a>

          <button
            type="button"
            onClick={onManageBooking}
            aria-label="Manage your booking"
            className="inline-flex h-[58px] w-full items-center justify-between gap-3 rounded-full border border-black/5 bg-white px-5 text-foreground shadow-[0_8px_22px_rgba(0,0,0,0.10)] transition hover:bg-white/95 max-[390px]:h-[54px]"
          >
            <CalendarCheck size={18} className="shrink-0 text-primary" />
            <span className="text-[15px] font-semibold">Manage Booking</span>
            <ArrowRight size={16} className="shrink-0 text-primary" />
          </button>
        </section>

        <section aria-label="IG Sabroso proof" className="px-4 pb-6">
          <div className="rounded-[22px] border border-black/5 bg-white px-5 py-5 shadow-card">
            <div className="flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.22em] text-foreground/70">
              <Hammer className="text-primary" size={13} />
              <span className="font-medium">IG Sabroso</span>
              <span className="h-px w-5 bg-primary/60" />
              <span className="font-semibold text-primary">Built to Last</span>
            </div>
            <p className="mt-4 text-center text-[11.5px] uppercase leading-[1.6] tracking-[0.22em] text-muted-foreground">
              Build with confidence — <br />
              build with Sabroso.
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <MobileStatCard
              icon={<ShieldCheck size={16} />}
              value="10+"
              label="Years of construction experience"
            />
            <MobileStatCard
              icon={<Building2 size={16} />}
              value="300+"
              label="Projects completed"
            />
          </div>
        </section>
      </div>

      <section
        className="relative hidden min-h-screen w-full overflow-hidden bg-background md:block"
        aria-labelledby="home-heading-desktop"
      >
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
          className="absolute left-12 top-40 z-10 max-w-[260px]"
        >
          <div className="mb-3 h-0.5 w-10 rounded-full gradient-brand" />
          <p className="text-sm font-medium leading-relaxed text-foreground/85">
            Already booked an appointment?
            <br />
            <span className="text-foreground/75">
              Manage your booking here — view details, reschedule, or cancel anytime.
            </span>
          </p>
          <button
            type="button"
            onClick={onManageBooking}
            aria-label="Manage your booking"
            className="group mt-5 inline-flex min-h-11 items-center gap-2.5 rounded-full border border-white/40 bg-white/85 px-5 py-3 text-sm font-semibold tracking-wide text-foreground shadow-card backdrop-blur-md transition hover:scale-[1.02] hover:bg-white dark:bg-white/10"
          >
            <CalendarCheck size={16} className="text-primary" />
            Manage Booking
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="absolute right-12 top-40 z-10 max-w-[220px] text-right"
        >
          <h1
            id="home-heading-desktop"
            className="font-sans text-sm font-medium leading-relaxed tracking-normal text-foreground/85"
          >
            Building the future with quality and trust.
          </h1>
          <div className="ml-auto mt-3 h-0.5 w-10 rounded-full gradient-brand" />
        </motion.div>

        <div className="absolute right-12 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-5">
          <StatCard
            delay={0.7}
            icon={<ShieldCheck size={18} />}
            value="10+"
            label="Years of construction experience"
          />
          <StatCard
            delay={0.85}
            icon={<Building2 size={18} />}
            value="300+"
            label="Projects completed"
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center gap-6 px-12 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="flex items-center gap-3 text-xs uppercase tracking-[0.32em] text-foreground/70"
          >
            <Hammer className="text-primary" size={14} />
            <span>27 Sabroso</span>
            <span className="h-px w-6 bg-primary/60" />
            <span className="font-semibold text-primary">Built to Last</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.7 }}
            className="flex items-center"
          >
            <a
              href="#about"
              className="group relative inline-flex min-h-11 items-center gap-4 rounded-full gradient-brand py-4 pl-9 pr-3 text-lg font-bold tracking-[0.18em] text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
            >
              <span className="absolute inset-0 rounded-full ring-1 ring-white/20" />
              DISCOVER MORE
              <span className="rounded-full bg-background/25 p-2.5 transition-transform group-hover:translate-x-1">
                <ArrowRight size={16} />
              </span>
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.25, duration: 0.7 }}
            className="text-center text-xs uppercase tracking-[0.28em] text-muted-foreground"
          >
            Build with confidence — build with Sabroso.
          </motion.p>
        </div>
      </section>
    </>
  );
}

function MobileStatCard({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return (
    <div className="flex min-h-[150px] flex-col rounded-[24px] p-[18px] glass shadow-card">
      <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl gradient-brand text-primary-foreground">
        {icon}
      </div>
      <div className="font-display text-[42px] font-black leading-none">{value}</div>
      <div className="mt-2 text-[13px] leading-snug text-muted-foreground">{label}</div>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  delay,
}: {
  icon: ReactNode;
  value: string;
  label: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ y: -4 }}
      className="w-[210px] rounded-2xl p-5 glass shadow-card"
    >
      <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl gradient-brand text-primary-foreground">
        {icon}
      </div>
      <div className="font-display text-4xl font-black leading-none">{value}</div>
      <div className="mt-2 text-xs leading-snug text-muted-foreground">{label}</div>
    </motion.div>
  );
}
