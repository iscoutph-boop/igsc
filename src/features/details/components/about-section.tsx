import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  ChevronLeft,
  ChevronRight,
  Home,
  Layers3,
  Pause,
  Play,
  Wrench,
} from "lucide-react";
import { aboutPreviewImages, aboutSlides } from "../content";
import { RefinementSection } from "./refinement-shell";
import { SectionHeading } from "./section-heading";

type AboutSectionProps = {
  onOpenImage: (src: string, group: string[]) => void;
};

const aboutActions = [
  { label: "Residential Builds", href: "#portfolio", icon: Home },
  { label: "Renovation Works", href: "#services", icon: Wrench },
  { label: "Project Portfolio", href: "#portfolio", icon: Layers3 },
];

export function AboutSection({ onOpenImage }: AboutSectionProps) {
  const reduceMotion = useReducedMotion();
  const [activeSlide, setActiveSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(false);

  useEffect(() => {
    if (!autoplay || reduceMotion) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % aboutSlides.length);
    }, 5_000);

    return () => window.clearInterval(interval);
  }, [autoplay, reduceMotion]);

  const showPrevious = () => {
    setActiveSlide((current) => (current - 1 + aboutSlides.length) % aboutSlides.length);
  };

  const showNext = () => {
    setActiveSlide((current) => (current + 1) % aboutSlides.length);
  };

  return (
    <RefinementSection id="about" className="pt-12 lg:pt-16">
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(270px,0.72fr)_minmax(0,1.85fr)] lg:gap-14">
        <div className="lg:pt-4">
          <SectionHeading
            eyebrow="About us"
            title="Built on trust."
            accent="Driven by excellence."
          />
          <p className="mt-7 max-w-[39ch] text-base leading-7 text-muted-foreground">
            IG Sabroso Construction is a full-service construction company committed to dependable
            building solutions. From concept to completion, we bring expertise, transparency, and
            dedication to every project.
          </p>

          <nav aria-label="About IG Sabroso" className="mt-8 border-y border-border">
            {aboutActions.map((action) => {
              const Icon = action.icon;
              return (
                <a
                  key={action.label}
                  href={action.href}
                  className="group flex min-h-16 items-center gap-4 border-b border-border px-1 text-sm font-semibold transition-colors last:border-b-0 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
                >
                  <Icon aria-hidden="true" className="text-primary" size={21} strokeWidth={1.8} />
                  <span>{action.label}</span>
                  <ArrowRight
                    aria-hidden="true"
                    className="ml-auto text-primary transition-transform group-hover:translate-x-1"
                    size={18}
                  />
                </a>
              );
            })}
          </nav>

          <a
            href="#services"
            className="mt-6 flex min-h-16 items-center rounded-2xl bg-primary px-5 text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 active:translate-y-px"
          >
            <Building2 aria-hidden="true" size={22} />
            <span className="ml-4">
              <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.2em]">
                Learn more
              </span>
              <span className="block text-sm font-bold">Company Overview</span>
            </span>
            <ArrowRight aria-hidden="true" className="ml-auto" size={19} />
          </a>
        </div>

        <div className="relative min-w-0 overflow-hidden rounded-[1.5rem] bg-card shadow-card">
          <button
            type="button"
            className="group block w-full overflow-hidden focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/60"
            onClick={() => onOpenImage(aboutSlides[activeSlide], aboutSlides)}
            aria-label={`Open project image ${activeSlide + 1} of ${aboutSlides.length}`}
          >
            <img
              src={aboutSlides[activeSlide]}
              alt="Completed IG Sabroso residential project"
              className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-[1.015] lg:aspect-[1.72/1]"
            />
          </button>

          <button
            type="button"
            role="switch"
            aria-checked={autoplay}
            aria-label={`Autoplay ${autoplay ? "on" : "off"}`}
            onClick={() => setAutoplay((current) => !current)}
            className="absolute right-4 top-4 flex min-h-12 items-center gap-3 rounded-full border border-white/70 bg-white/90 px-4 text-sm font-semibold text-zinc-900 shadow-lg backdrop-blur focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {autoplay ? (
              <Pause aria-hidden="true" size={17} fill="currentColor" />
            ) : (
              <Play aria-hidden="true" size={17} fill="currentColor" />
            )}
            Autoplay {autoplay ? "on" : "off"}
          </button>

          <div
            className="absolute bottom-4 left-4 flex items-center gap-3 rounded-2xl border border-white/75 bg-white/90 p-2 text-zinc-900 shadow-lg backdrop-blur"
            aria-label="Project image controls"
          >
            <button
              type="button"
              onClick={showPrevious}
              className="grid size-11 place-items-center rounded-xl bg-white transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Show previous project image"
            >
              <ChevronLeft aria-hidden="true" size={22} />
            </button>
            <span className="min-w-16 text-center text-sm font-semibold tabular-nums">
              {String(activeSlide + 1).padStart(2, "0")} /{" "}
              <span className="text-zinc-500">{String(aboutSlides.length).padStart(2, "0")}</span>
            </span>
            <button
              type="button"
              onClick={showNext}
              className="grid size-11 place-items-center rounded-xl bg-white transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Show next project image"
            >
              <ChevronRight aria-hidden="true" size={22} />
            </button>
          </div>

          <button
            type="button"
            onClick={() =>
              onOpenImage(
                aboutPreviewImages[activeSlide % aboutPreviewImages.length],
                aboutPreviewImages,
              )
            }
            className="absolute bottom-4 right-4 hidden w-56 rounded-[1.35rem] border-8 border-white bg-white text-left text-zinc-900 shadow-xl transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:block"
          >
            <img
              src={aboutPreviewImages[activeSlide % aboutPreviewImages.length]}
              alt="Client collaboration during project planning"
              className="aspect-[4/3] w-full rounded-[0.85rem] object-cover"
            />
            <span className="block px-3 py-3 text-center text-sm font-semibold">
              Client collaboration
            </span>
          </button>
        </div>
      </div>
    </RefinementSection>
  );
}
