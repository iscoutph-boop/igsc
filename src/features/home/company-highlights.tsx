import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Expand } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Lightbox } from "@/components/lightbox";
import { COMPANY_HIGHLIGHTS } from "@/content/company-highlights";

const highlightImages = COMPANY_HIGHLIGHTS.map((highlight) => highlight.src);
const highlightAltText = COMPANY_HIGHLIGHTS.map((highlight) => highlight.alt);
const AUTO_ADVANCE_DELAY_MS = 6500;

function wrapIndex(index: number) {
  return (index + COMPANY_HIGHLIGHTS.length) % COMPANY_HIGHLIGHTS.length;
}

export function CompanyHighlights() {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const activeHighlight = COMPANY_HIGHLIGHTS[activeIndex];

  const goTo = useCallback((index: number) => {
    setActiveIndex(wrapIndex(index));
  }, []);

  useEffect(() => {
    if (lightboxIndex >= 0 || COMPANY_HIGHLIGHTS.length <= 1) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setActiveIndex((currentIndex) => wrapIndex(currentIndex + 1));
    }, AUTO_ADVANCE_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [activeIndex, lightboxIndex, reduceMotion]);

  return (
    <section
      aria-label="Company highlights"
      className="relative min-h-[248px] overflow-hidden py-8 pl-0 lg:px-9"
    >
      <div className="flex items-start">
        <div>
          <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-primary">
            Company highlights
          </p>
          <h2 className="mt-2 font-display text-[1.55rem] font-extrabold uppercase leading-[0.96] tracking-[-0.025em] text-[#152238]">
            {activeHighlight.title}
          </h2>
        </div>
      </div>

      <p className="mt-1 text-[0.68rem] font-bold uppercase tracking-[0.08em] text-primary">
        {activeHighlight.category}
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)] sm:items-center">
        <div>
          <p className="text-[0.78rem] leading-5 text-[#5f6b78]">{activeHighlight.description}</p>

          <div className="mt-5 flex items-center">
            <span
              className="flex gap-1.5"
              aria-label={`Slide ${activeIndex + 1} of ${COMPANY_HIGHLIGHTS.length}`}
            >
              {COMPANY_HIGHLIGHTS.map((highlight, index) => (
                <button
                  key={highlight.src}
                  type="button"
                  aria-label={`Go to ${highlight.title} ${index + 1}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                  onClick={() => goTo(index)}
                  className={[
                    "h-2 rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    index === activeIndex
                      ? "w-5 bg-primary"
                      : "w-2 bg-[#cbd3dc] hover:bg-[#98a2b3]",
                  ].join(" ")}
                />
              ))}
            </span>
          </div>
        </div>

        <div
          id="company-highlight-image"
          className="relative overflow-hidden rounded-xl border border-[#e3e7eb] bg-[#f2f4f6] shadow-[0_12px_30px_rgba(21,34,56,0.09)]"
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.button
              key={activeHighlight.src}
              type="button"
              initial={reduceMotion ? false : { opacity: 0, scale: 1.015 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.985 }}
              transition={{ duration: reduceMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
              aria-label={`Open ${activeHighlight.title} image`}
              onClick={() => setLightboxIndex(activeIndex)}
              className="group relative block w-full cursor-zoom-in overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <img
                src={activeHighlight.src}
                alt={activeHighlight.alt}
                width={1800}
                height={1350}
                className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.035]"
                style={{ objectPosition: activeHighlight.objectPosition }}
                loading="lazy"
                decoding="async"
              />
              <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-[linear-gradient(0deg,rgba(21,34,56,0.82),transparent)] px-4 pb-3 pt-10 text-left text-xs font-extrabold uppercase tracking-[0.08em] text-white opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
                View image
                <span className="grid size-8 place-items-center rounded-full bg-white/16 backdrop-blur-sm">
                  <Expand aria-hidden="true" size={16} />
                </span>
              </span>
            </motion.button>
          </AnimatePresence>
        </div>
      </div>

      <div className="sr-only" aria-live="polite">
        {activeHighlight.title}, {activeHighlight.category}, slide {activeIndex + 1} of{" "}
        {COMPANY_HIGHLIGHTS.length}
      </div>

      <Lightbox
        images={highlightImages}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(-1)}
        onIndexChange={(index) => {
          setLightboxIndex(index);
          goTo(index);
        }}
        alt={highlightAltText}
        label="Company highlights viewer"
      />
    </section>
  );
}
