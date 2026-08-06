import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { PROCESS_STEPS } from "@/content/process";
import { RefinementSection } from "./refinement-shell";
import { SectionHeading } from "./section-heading";

export function ProcessSection() {
  const [selectedId, setSelectedId] = useState(PROCESS_STEPS[0].id);
  const selectedStep = PROCESS_STEPS.find((step) => step.id === selectedId) ?? PROCESS_STEPS[0];

  return (
    <RefinementSection id="process" className="overflow-hidden bg-[#152238] text-white">
      <SectionHeading
        eyebrow="Our process"
        title="A clear process."
        accent="A smoother build."
        description="A four-stage project journey that keeps decisions, progress, and next actions visible from consultation through turnover."
        align="center"
        className="max-w-4xl [&_h2]:text-white [&_p:last-child]:text-white/65"
      />

      <div
        role="tablist"
        aria-label="Construction process"
        className="mt-12 grid gap-3 md:grid-cols-4"
      >
        {PROCESS_STEPS.map((step, index) => {
          const selected = step.id === selectedId;
          return (
            <button
              type="button"
              role="tab"
              id={`process-tab-${step.id}`}
              aria-label={step.title}
              aria-selected={selected}
              aria-controls={`process-panel-${step.id}`}
              tabIndex={selected ? 0 : -1}
              key={step.id}
              onClick={() => setSelectedId(step.id)}
              className={[
                "group min-h-36 rounded-2xl border p-5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff8a5d]",
                selected
                  ? "border-[#ff7440] bg-[#ff5a1f] text-white shadow-[0_16px_44px_rgba(244,81,30,0.28)]"
                  : "border-white/12 bg-white/[0.045] text-white hover:border-white/25 hover:bg-white/[0.07]",
              ].join(" ")}
            >
              <span className="flex items-center justify-between gap-4">
                <span className="font-display text-3xl font-black">0{index + 1}</span>
                {selected ? <Check aria-hidden="true" size={19} /> : null}
              </span>
              <span className="mt-7 block text-lg font-extrabold">{step.title}</span>
              <span
                className={
                  selected ? "mt-2 block text-xs text-white/80" : "mt-2 block text-xs text-white/55"
                }
              >
                {selected ? "Selected phase" : "View phase"}
              </span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`process-panel-${selectedStep.id}`}
        aria-labelledby={`process-tab-${selectedStep.id}`}
        className="mt-5 grid gap-8 rounded-[1.6rem] border border-white/12 bg-[#1b2b45] p-7 sm:p-9 lg:grid-cols-[0.7fr_1.3fr] lg:items-center"
      >
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#ff8a5d]">
            {selectedStep.title}
          </p>
          <p className="mt-4 text-2xl font-extrabold leading-9 text-white">
            {selectedStep.description}
          </p>
          <Link
            to="/consultation"
            className="mt-7 inline-flex min-h-12 items-center gap-3 rounded-xl bg-white px-5 text-sm font-extrabold text-[#152238]"
          >
            Proceed to consultation
            <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {selectedStep.outcomes.map((outcome) => {
            const Icon = selectedStep.icon;
            return (
              <div key={outcome} className="rounded-xl border border-white/10 bg-white/[0.055] p-5">
                <Icon aria-hidden="true" size={21} className="text-[#ff7440]" />
                <p className="mt-5 text-sm font-bold leading-6 text-white/85">{outcome}</p>
              </div>
            );
          })}
        </div>
      </div>
    </RefinementSection>
  );
}
