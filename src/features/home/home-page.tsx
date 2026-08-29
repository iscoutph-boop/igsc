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
          className="w-full max-w-[650px] lg:pointer-events-auto"
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
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-primary px-6 text-xs font-extrabold uppercase tracking-[0.06em] text-white shadow-[0_14px_34px_rgba(244,81,30,0.2)] transition hover:-translate-y-0.5 hover:bg-[#df4114]"
            >
              Let&apos;s build together
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
            <Link
              to="/projects"
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg border border-[#d6dbe1] bg-white px-6 text-xs font-extrabold uppercase tracking-[0.06em] text-[#152238] transition hover:border-primary/45 hover:text-primary"
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
    >
      <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-primary">
        Client testimonial
      </p>

      <div aria-live="off" className="relative mt-5 min-h-[184px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.figure
            key={`${review.name}-${activeIndex}`}
            initial={reduceMotion ? false : { opacity: 0, x: 26 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: -26 }}
            transition={{
              duration: reduceMotion ? 0 : 0.42,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute inset-0"
          >
            <Quote aria-hidden="true" size={29} className="text-primary" />
            <blockquote className="mt-3 text-[0.82rem] leading-6 text-[#344054]">
              “{review.quote}”
            </blockquote>
            <figcaption className="mt-5">
              <p className="text-[0.76rem] font-extrabold text-[#152238]">— {review.name}</p>
              <p className="mt-1 text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[#7a8491]">
                {review.project}
              </p>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>
    </section>
  );
}

function TrustStrip() {
  const items = [
    { icon: ShieldCheck, label: "Trust & reliability" },
    { icon: Sparkles, label: "Quality & precision" },
    { icon: Handshake, label: "Transparency & integrity" },
    { icon: HardHat, label: "Safety first" },
    { icon: UserRoundCheck, label: "Client focused" },
  ];

  return (
    <section aria-label="Company commitments" className="border-b border-[#e5e8ec] bg-[#fbfbfc]">
      <div className="mx-auto grid max-w-[1760px] grid-cols-2 divide-x divide-y divide-[#e5e8ec] px-6 sm:px-8 md:grid-cols-3 lg:grid-cols-5 lg:divide-y-0 lg:px-12">
        {items.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex min-h-[88px] items-center justify-center gap-3 px-4 py-5 text-center"
          >
            <Icon
              aria-hidden="true"
              size={23}
              strokeWidth={1.75}
              className="shrink-0 text-primary"
            />
            <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.08em] text-[#344054]">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function AboutPreview() {
  return (
    <section className="bg-white py-20 sm:py-24 lg:py-28">
      <div className="mx-auto grid w-full max-w-[1500px] gap-12 px-6 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-14">
        <div>
          <SectionHeading
            label="About IG Sabroso"
            title={
              <>
                Built on values.
                <span className="block text-primary">Focused on you.</span>
              </>
            }
            description="We combine practical construction experience, collaborative planning, and skilled workmanship to create spaces designed for everyday life."
          />
          <p className="mt-7 max-w-2xl text-base leading-8 text-[#667085]">{COMPANY.history}</p>
          <Link
            to="/details"
            hash="about"
            className="mt-8 inline-flex min-h-12 items-center gap-3 border-b-2 border-primary pb-1 text-sm font-extrabold uppercase tracking-[0.08em] text-[#152238]"
          >
            Learn more about us
            <ArrowRight aria-hidden="true" size={18} className="text-primary" />
          </Link>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-[1.75rem] bg-[#f1f3f5] shadow-[0_24px_70px_rgba(21,34,56,0.12)]">
            <img
              src={teamEvent}
              alt="IG Sabroso team gathered with clients at a project event"
              className="aspect-[4/3] h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:absolute lg:-bottom-12 lg:-left-10 lg:w-[92%]">
            {[
              ["Mission", "Exceptional construction with honesty and excellence."],
              ["Approach", "Clear collaboration from planning to turnover."],
              ["Values", "Integrity, quality, safety, teamwork, and innovation."],
            ].map(([title, copy]) => (
              <div
                key={title}
                className="rounded-2xl border border-[#e4e8ec] bg-white p-5 shadow-[0_14px_38px_rgba(21,34,56,0.09)]"
              >
                <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-primary">
                  {title}
                </p>
                <p className="mt-2 text-sm leading-6 text-[#53606e]">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesPreview() {
  return (
    <section className="bg-[#f7f8fa] py-20 sm:py-24 lg:py-28">
      <div className="mx-auto w-full max-w-[1500px] px-6 sm:px-8 lg:px-14">
        <SectionHeading
          label="Our services"
          title={
            <>
              Complete solutions.
              <span className="block text-primary">Superior results.</span>
            </>
          }
          description="A coordinated construction service direction for homes, renovations, commercial spaces, and multi-unit developments."
          action={
            <Link
              to="/details"
              hash="services"
              className="inline-flex min-h-12 items-center gap-3 rounded-xl border border-[#d8dde3] bg-white px-5 text-sm font-extrabold text-[#152238] transition hover:border-primary/40 hover:text-primary"
            >
              Explore all services
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
          }
        />

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {SERVICES.map(({ icon: Icon, title, shortDescription }, index) => (
            <article
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-[#e2e6ea] bg-white p-7 transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_20px_50px_rgba(21,34,56,0.09)]"
            >
              <span className="absolute right-5 top-4 font-display text-4xl font-black text-[#edf0f2]">
                0{index + 1}
              </span>
              <span className="grid size-12 place-items-center rounded-xl bg-[#fff1eb] text-primary">
                <Icon aria-hidden="true" size={24} />
              </span>
              <h3 className="mt-8 text-xl font-extrabold tracking-[-0.02em] text-[#152238]">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#667085]">{shortDescription}</p>
              <Link
                to="/details"
                hash="services"
                className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-primary"
              >
                Learn more
                <ArrowRight
                  aria-hidden="true"
                  size={17}
                  className="transition group-hover:translate-x-1"
                />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectsPreview() {
  return (
    <section className="bg-white py-20 sm:py-24 lg:py-28">
      <div className="mx-auto w-full max-w-[1500px] px-6 sm:px-8 lg:px-14">
        <SectionHeading
          label="Selected real projects"
          title={
            <>
              Built with purpose.
              <span className="block text-primary">Delivered with pride.</span>
            </>
          }
          description="A curated view of completed IG Sabroso homes and developments. Each project is selected for its design clarity, real construction outcome, and relevance to prospective clients."
          action={
            <Link
              to="/projects"
              className="inline-flex min-h-12 items-center gap-3 rounded-xl bg-primary px-5 text-sm font-extrabold text-white"
            >
              View all projects
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
          }
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {featuredProjects.map((project, index) => (
            <article
              key={project.slug}
              className={[
                "group overflow-hidden rounded-[1.5rem] border border-[#e2e6ea] bg-white shadow-[0_18px_46px_rgba(21,34,56,0.08)]",
                index === 0 ? "lg:col-span-2" : "",
              ].join(" ")}
            >
              <Link
                to="/projects/$slug"
                params={{ slug: project.slug }}
                aria-label={`View ${project.name}`}
                className="block overflow-hidden"
              >
                <img
                  src={project.cover.src}
                  alt={project.cover.alt}
                  className={[
                    "w-full object-cover transition duration-700 group-hover:scale-[1.025]",
                    index === 0 ? "aspect-[16/9]" : "aspect-[4/3]",
                  ].join(" ")}
                  loading="lazy"
                />
              </Link>
              <div className="p-6 sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <StatusBadge
                    status={project.status}
                    visualizationOnly={project.visualizationOnly}
                  />
                  <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#7a8491]">
                    {project.category.replace("-", " ")}
                  </span>
                </div>
                <h3 className="mt-5 text-2xl font-extrabold tracking-[-0.025em] text-[#152238]">
                  {project.name}
                </h3>
                <p className="mt-1 text-sm font-semibold text-primary">{project.location}</p>
                <p className="mt-4 text-sm leading-7 text-[#667085]">{project.summary}</p>
                <Link
                  to="/projects/$slug"
                  params={{ slug: project.slug }}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-[#152238] transition hover:text-primary"
                >
                  View project details
                  <ArrowRight aria-hidden="true" size={17} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessPreview() {
  return (
    <section className="overflow-hidden bg-[#152238] py-20 text-white sm:py-24 lg:py-28">
      <div className="mx-auto grid w-full max-w-[1500px] gap-12 px-6 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-14">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#ff8a5d]">
            Our process
          </p>
          <h2 className="mt-3 font-display text-5xl font-black uppercase leading-[0.9] tracking-[-0.04em] sm:text-6xl">
            A clear process.
            <span className="mt-2 block text-[#ff6a33]">A smoother build.</span>
          </h2>
          <p className="mt-6 max-w-xl text-base leading-8 text-white/68">
            Every stage is structured to keep decisions, expectations, and next actions visible to
            the client.
          </p>
          <Link
            to="/details"
            hash="process"
            className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-xl bg-white px-5 text-sm font-extrabold text-[#152238]"
          >
            See the complete process
            <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </div>

        <div className="grid gap-px overflow-hidden rounded-2xl bg-white/15 sm:grid-cols-2">
          {processSteps.map((step) => (
            <article key={step.number} className="bg-[#1b2b45] p-7 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <span className="font-display text-4xl font-black text-[#ff6a33]">
                  {step.number}
                </span>
                <Check aria-hidden="true" size={20} className="text-[#ff8a5d]" />
              </div>
              <h3 className="mt-8 text-xl font-extrabold">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/65">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewsPreview() {
  return (
    <section className="bg-[#f7f8fa] py-20 sm:py-24 lg:py-28">
      <div className="mx-auto w-full max-w-[1500px] px-6 sm:px-8 lg:px-14">
        <SectionHeading
          label="Client reviews"
          title={
            <>
              Trusted by real clients.
              <span className="block text-primary">Proven through real projects.</span>
            </>
          }
          description="Public recommendations from clients who worked directly with the IG Sabroso team."
          action={
            <Link
              to="/details"
              hash="reviews"
              className="inline-flex min-h-12 items-center gap-3 rounded-xl border border-[#d8dde3] bg-white px-5 text-sm font-extrabold text-[#152238]"
            >
              Read all reviews
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
          }
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {REVIEWS.map((review) => (
            <figure
              key={review.name}
              className="rounded-2xl border border-[#e2e6ea] bg-white p-7 shadow-[0_14px_40px_rgba(21,34,56,0.07)]"
            >
              <Quote aria-hidden="true" size={30} className="text-primary" />
              <blockquote className="mt-6 text-base leading-8 text-[#344054]">
                “{review.quote}”
              </blockquote>
              <figcaption className="mt-7 border-t border-[#eceef1] pt-5">
                <p className="font-extrabold text-[#152238]">{review.name}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.1em] text-primary">
                  {review.project}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function ConsultationCallout() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto w-full max-w-[1500px] px-6 sm:px-8 lg:px-14">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#fff1eb] px-7 py-12 sm:px-10 lg:px-14 lg:py-16">
          <div
            aria-hidden="true"
            className="absolute -right-16 -top-20 size-72 rounded-full border-[52px] border-primary/10"
          />
          <div className="relative grid gap-10 lg:grid-cols-[1fr_0.75fr] lg:items-center">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                Start your project
              </p>
              <h2 className="mt-3 max-w-3xl font-display text-5xl font-black uppercase leading-[0.92] tracking-[-0.04em] text-[#152238] sm:text-6xl">
                Let’s build something great together.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[#5e6976]">
                Tell us about your location, project type, priorities, and preferred timeline. The
                consultation form connects directly to the existing booking workflow.
              </p>
            </div>
            <div className="rounded-2xl border border-white/90 bg-white p-6 shadow-[0_18px_45px_rgba(21,34,56,0.09)] sm:p-8">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div className="flex items-center gap-3">
                  <CalendarDays aria-hidden="true" className="text-primary" />
                  <span className="text-sm font-bold text-[#344054]">Schedule a consultation</span>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 aria-hidden="true" className="text-primary" />
                  <span className="text-sm font-bold text-[#344054]">
                    Discuss project requirements
                  </span>
                </div>
              </div>
              <Link
                to="/consultation"
                className="mt-7 flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-primary px-6 text-sm font-extrabold uppercase tracking-[0.06em] text-white"
              >
                Book a consultation
                <ArrowRight aria-hidden="true" size={19} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
