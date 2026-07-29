import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Building2, CalendarCheck, Hammer, ShieldCheck } from "lucide-react";
import { CheckBookingModal } from "@/components/booking-modals";
import { PageTransition } from "@/components/page-transition";
import { SiteHeaderHome } from "@/components/site-header-home";
import helmetHeroAsset from "@/assets/helmet-hero.png.asset.json";

type HomeHeroContentProps = {
  onOpenBooking: () => void;
};

const heroEase = [0.22, 1, 0.36, 1] as const;

export function HomePage() {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <PageTransition>
      <main className="relative min-h-[100dvh] overflow-hidden bg-[#ece7df] text-[#121212] dark:bg-neutral-950 dark:text-white">
        <SiteHeaderHome />
        <HomeHeroContent onOpenBooking={() => setBookingOpen(true)} />
      </main>

      <CheckBookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </PageTransition>
  );
}

export function HomeHeroContent({ onOpenBooking }: HomeHeroContentProps) {
  return (
    <section
      aria-label="IG Sabroso Construction"
      className="relative isolate flex min-h-[100dvh] w-full flex-col overflow-hidden"
    >
      <motion.img
        src={helmetHeroAsset.url}
        alt="A row of white IG Sabroso Construction hard hats"
        className="absolute inset-0 -z-30 h-full w-full max-w-none object-cover object-[57%_center] md:object-[52%_center]"
        initial={{ opacity: 0, scale: 1.025 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.85, ease: heroEase }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(243,239,232,0.78)_0%,rgba(243,239,232,0.36)_34%,rgba(243,239,232,0.08)_70%),linear-gradient(180deg,rgba(244,240,234,0.2)_0%,rgba(247,243,237,0.04)_52%,rgba(246,242,236,0.84)_100%)] dark:bg-[linear-gradient(90deg,rgba(8,8,9,0.78)_0%,rgba(8,8,9,0.36)_34%,rgba(8,8,9,0.08)_70%),linear-gradient(180deg,rgba(8,8,9,0.22)_0%,rgba(8,8,9,0.08)_52%,rgba(8,8,9,0.82)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_54%,transparent_18%,rgba(244,239,232,0.15)_66%,rgba(244,239,232,0.3)_100%)] dark:bg-[radial-gradient(circle_at_50%_54%,transparent_18%,rgba(0,0,0,0.14)_66%,rgba(0,0,0,0.28)_100%)]"
      />

      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[1540px] flex-1 flex-col px-6 pb-[calc(24px+env(safe-area-inset-bottom))] pt-[clamp(48px,7dvh,72px)] sm:px-8 md:block md:px-10 md:pb-0 md:pt-0 2xl:px-0">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: heroEase }}
          className="w-full max-w-[340px] md:absolute md:left-10 md:top-[clamp(132px,18vh,176px)] md:max-w-[270px]"
        >
          <span
            aria-hidden="true"
            className="mb-6 block h-[3px] w-20 rounded-full bg-primary md:mb-3 md:h-0.5 md:w-8"
          />
          <h1 className="font-sans text-[clamp(20px,5.6vw,25px)] font-medium leading-[1.52] tracking-[-0.025em] text-[#202020] md:text-[14px] md:leading-[1.55] md:tracking-[-0.01em] dark:text-white">
            Dependable building solutions for homes, renovations, and civil works.
          </h1>
          <button
            type="button"
            onClick={onOpenBooking}
            className="mt-10 inline-flex min-h-14 items-center gap-4 rounded-full border border-white/85 bg-white/88 px-6 py-3.5 font-display text-[17px] font-semibold text-[#181818] shadow-[0_12px_28px_rgba(72,50,36,0.09),inset_0_1px_0_rgba(255,255,255,0.92)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white active:translate-y-0 md:mt-8 md:min-h-11 md:gap-3 md:px-5 md:py-2.5 md:text-[12px]"
          >
            <CalendarCheck className="size-6 text-primary md:size-4" aria-hidden="true" />
            Check Booking
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="absolute right-10 top-[clamp(132px,18vh,176px)] hidden w-[210px] text-right md:block"
        >
          <p className="text-[12px] font-medium leading-relaxed text-[#2b2928] dark:text-white/78">
            Building the future with quality and trust.
          </p>
          <span
            aria-hidden="true"
            className="ml-auto mt-2 block h-0.5 w-8 rounded-full bg-primary"
          />
        </motion.div>

        <div className="min-h-[clamp(160px,26dvh,250px)] flex-1 md:hidden" aria-hidden="true" />

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.58, delay: 0.18, ease: heroEase }}
          className="grid grid-cols-2 gap-3 md:absolute md:right-10 md:top-[clamp(238px,32vh,290px)] md:w-[178px] md:grid-cols-1 md:gap-4"
          aria-label="Company experience"
        >
          <HomeMetric
            value="10+"
            label="Years of construction experience"
            mobileLabel="Years experience"
            icon={<ShieldCheck aria-hidden="true" />}
          />
          <HomeMetric
            value="300+"
            label="Projects completed"
            icon={<Building2 aria-hidden="true" />}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.62, delay: 0.26, ease: heroEase }}
          className="mt-9 flex w-full flex-col items-center text-center md:absolute md:bottom-[clamp(14px,3.5vh,34px)] md:left-1/2 md:mt-0 md:w-auto md:-translate-x-1/2"
        >
          <div className="mb-5 hidden items-center gap-3 text-[10px] font-medium uppercase tracking-[0.34em] text-[#4a4541] md:flex dark:text-white/72">
            <Hammer className="size-3.5 text-primary" aria-hidden="true" />
            <span>27 Sabroso</span>
            <span aria-hidden="true" className="h-px w-8 bg-primary/70" />
            <span className="text-primary">Built to Last</span>
          </div>

          <a
            href="/details#about"
            className="group inline-flex min-h-[64px] w-full max-w-[300px] items-center justify-center gap-5 rounded-full bg-[linear-gradient(100deg,#ff4b08,#ed2d27)] px-6 py-3 font-display text-[17px] font-bold uppercase tracking-[0.2em] text-white shadow-[0_18px_46px_rgba(234,61,20,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_50px_rgba(234,61,20,0.32)] active:translate-y-0 md:min-h-[58px] md:w-[272px] md:gap-4 md:text-[14px]"
          >
            <span>Discover More</span>
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-white/20 transition-transform group-hover:translate-x-0.5 md:size-10">
              <ArrowRight className="size-5" aria-hidden="true" />
            </span>
          </a>

          <p className="mt-7 max-w-[330px] text-[11px] font-medium uppercase leading-[1.7] tracking-[0.27em] text-[#514b47] md:mt-5 md:max-w-none md:text-[10px] md:tracking-[0.3em] dark:text-white/72">
            Build with confidence - build with Sabroso.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function HomeMetric({
  value,
  label,
  mobileLabel,
  icon,
}: {
  value: string;
  label: string;
  mobileLabel?: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex min-h-[92px] items-center gap-3 rounded-[28px] border border-white/75 bg-white/58 px-4 py-3 shadow-[0_16px_42px_rgba(90,62,40,0.1),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-2xl md:min-h-[140px] md:flex-col md:items-start md:gap-0 md:rounded-[23px] md:px-4 md:py-4 dark:border-white/16 dark:bg-neutral-900/48">
      <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-white [&>svg]:size-5 md:size-8 md:[&>svg]:size-4">
        {icon}
      </span>
      <div className="min-w-0 md:mt-3">
        <div className="font-display text-[30px] font-black leading-none tracking-[-0.04em] text-[#111] md:text-[29px] dark:text-white">
          {value}
        </div>
        <div className="mt-1 text-[12px] leading-[1.25] text-[#5f5a56] md:mt-2 md:text-[10px] md:leading-[1.35] dark:text-white/68">
          {mobileLabel ? <span className="md:hidden">{mobileLabel}</span> : null}
          <span className={mobileLabel ? "hidden md:inline" : undefined}>{label}</span>
        </div>
      </div>
    </div>
  );
}
