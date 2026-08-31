import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Check,
  Handshake,
  HardHat,
  Quote,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import teamEvent from "@/assets/real/team-event.webp";
import turnoverTeam from "@/assets/real/turnover-team.webp";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusBadge } from "@/components/ui/status-badge";
import { COMPANY } from "@/content/company";
import { PROJECTS } from "@/content/projects";
import { REVIEWS } from "@/content/reviews";
import { SERVICES } from "@/content/services";
import { PageTransition } from "@/components/page-transition";
import { CompanyHighlights } from "@/features/home/company-highlights";
import {
  Concept03DesktopHeroMedia,
  Concept03MobileHeroMedia,
} from "@/features/home/concept03-hero-media";

const featuredProjects = PROJECTS.filter((project) => project.featured).slice(0, 3);
const processSteps = [
  {
    number: "01",
    title: "Consultation",
    description: "Clarify the project goals, site conditions, priorities, and preferred timeline.",
  },
  {
    number: "02",
    title: "Planning",
    description:
      "Align the scope, design direction, budget expectations, and construction approach.",
  },
  {
    number: "03",
    title: "Construction",
    description:
      "Execute the work with coordinated supervision, quality checks, and progress updates.",
  },
  {
    number: "04",
    title: "Turnover",
    description:
      "Complete the final inspection, documentation, and client handover with confidence.",
  },
] as const;

export function HomePage() {
  return (
    <PageTransition>
      <SiteHeader />
      <main>
        <HomeHero />
        <HomeOverviewRail />
        <TrustStrip />
        <AboutPreview />
        <ServicesPreview />
        <ProjectsPreview />
        <ProcessPreview />
        <ReviewsPreview />
        <ConsultationCallout />
      </main>
      <SiteFooter />
    </PageTransition>
  );
}

function HomeHero() {
  const heroMetrics = COMPANY.metrics.slice(0, 3);

  return (
    <section className="relative isolate overflow-hidden bg-white lg:min-h-[650px]">
      <Concept03DesktopHeroMedia />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 hidden bg-[linear-gradient(90deg,#fff_0%,#fff_38%,rgba(255,255,255,0.96)_43%,rgba(255,255,255,0.46)_51%,rgba(255,255,255,0)_61%)] lg:block"
      />

      <Concept03MobileHeroMedia />

      <div className="relative z-20 mx-auto flex w-full max-w-[1760px] items-center px-8 pb-12 pt-0 lg:pointer-events-none lg:min-h-[650px] lg:px-12 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[650px]"
        >
          <h1 className="w-full max-w-full font-display text-[clamp(1.7rem,8.6vw,3.1rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.035em] text-[#152238] lg:max-w-[640px] lg:text-[clamp(3.25rem,4.35vw,5.2rem)] lg:leading-[0.91] lg:tracking-[-0.032em]">
            <span className="block lg:inline">Build with</span>{" "}
            <span className="block lg:inline">confidence.</span>
            <span className="mt-1 block whitespace-nowrap text-[#FF4B16] lg:mt-1.5">
              Build with Sabroso.
            </span>
          </h1>
          <p className="mt-4 max-w-[520px] text-[0.98rem] leading-7 text-[#4f5b69] sm:text-[1.02rem] lg:mt-6">
            We deliver quality construction and real estate solutions with honesty, precision, and a
            commitment to excellence—from concept to completion.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/consultation"
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-primary px-6 text-xs font-extrabold uppercase tracking-[0.06em] text-white shadow-[0_14px_34px_rgba(244,81,30,0.2)] transition hover:-translate-y-0.5 hover:bg-[#df4114] lg:pointer-events-auto"
            >
              Let&apos;s build together
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
            <Link
              to="/projects"
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg border border-[#d6dbe1] bg-white px-6 text-xs font-extrabold uppercase tracking-[0.06em] text-[#152238] transition hover:border-primary/45 hover:text-primary lg:pointer-events-auto"
            >
              View our projects
              <ArrowRight aria-hidden="true" size={18} className="text-primary" />
            </Link>
          </div>

          <div className="mt-7 grid overflow-hidden rounded-xl border border-[#e6e9ed] bg-white shadow-[0_16px_44px_rgba(21,34,56,0.1)] sm:grid-cols-3 lg:w-[690px]">
            {heroMetrics.map((metric, index) => (
              <div
                key={metric.label}
                className={[
                  "flex min-h-[88px] items-center gap-3 px-5 py-4",
                  index > 0 ? "border-t border-[#e7eaee] sm:border-l sm:border-t-0" : "",
                ].join(" ")}
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#fff3ed] text-primary">
                  {index === 0 ? (
                    <ShieldCheck aria-hidden="true" size={21} />
                  ) : index === 1 ? (
                    <Building2 aria-hidden="true" size={21} />
                  ) : (
                    <UserRoundCheck aria-hidden="true" size={21} />
                  )}
                </span>
                <span>
                  <span className="block font-display text-[1.7rem] font-extrabold leading-none tracking-[-0.025em] text-[#152238]">
                    {metric.value}
                  </span>
                  <span className="mt-1 block text-[0.68rem] leading-4 text-[#667085]">
                    {metric.label}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function HomeOverviewRail() {
  return (
    <section className="border-y border-[#e5e8ec] bg-white">
      <div className="mx-auto grid w-full max-w-[1760px] divide-y divide-[#e5e8ec] px-6 sm:px-8 lg:grid-cols-[0.9fr_1.25fr_0.9fr] lg:divide-x lg:divide-y-0 lg:px-12">
        <article className="grid min-h-[248px] grid-cols-[64px_1fr] gap-5 py-8 pr-0 lg:pr-9">
          <span className="grid size-16 place-items-center self-start rounded-xl border border-[#e7eaee] bg-white text-primary shadow-[0_10px_28px_rgba(21,34,56,0.07)]">
            <Building2 aria-hidden="true" size={31} strokeWidth={1.7} />
          </span>
          <div>
            <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-primary">
              About us
            </p>
            <h2 className="mt-3 font-display text-[1.65rem] font-extrabold uppercase leading-[0.95] tracking-[-0.025em] text-[#152238]">
              Built on values.
              <span className="block">Focused on you.</span>
            </h2>
            <p className="mt-4 text-[0.78rem] leading-5 text-[#5f6b78]">
              Every structure should reflect integrity, quality, and purpose. We combine practical
              planning with skilled craftsmanship to create spaces that last.
            </p>
            <a
              href="/details#about"
              className="mt-5 inline-flex items-center gap-2 text-[0.7rem] font-extrabold uppercase tracking-[0.08em] text-[#152238] hover:text-primary"
            >
              Learn more about us
              <ArrowRight aria-hidden="true" size={15} className="text-primary" />
            </a>
          </div>
        </article>

        <CompanyHighlights />

        <TestimonialCarousel />
      </div>
    </section>
  );
}

function TestimonialCarousel() {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const review = REVIEWS[activeIndex];

  useEffect(() => {
    if (REVIEWS.length <= 1) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % REVIEWS.length);
    }, 6500);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section
      aria-label="Client testimonials"
      className="relative min-h-[248px] overflow-hidden py-8 pl-0 lg:pl-9"
