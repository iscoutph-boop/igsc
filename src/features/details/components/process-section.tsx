import { useState } from "react";
import { ArrowRight, Check, Clock3 } from "lucide-react";
import { processSteps } from "../content";
import { RefinementSection } from "./refinement-shell";
import { SectionHeading } from "./section-heading";

export function ProcessSection() {
  const [selectedId, setSelectedId] = useState(processSteps[0].id);
  const selectedStep = processSteps.find((step) => step.id === selectedId) ?? processSteps[0];

  return (
    <RefinementSection id="process">
      <SectionHeading
        eyebrow="Our process"
        title="A clear process."
        accent="A solid foundation."
        align="center"
        className="max-w-3xl"
      />

      <div
        role="tablist"
        aria-label="Construction process"
        className="relative mt-12 grid gap-4 md:grid-cols-4 md:gap-6"
      >
        <span
          aria-hidden="true"
          className="absolute left-[12.5%] right-[12.5%] top-11 hidden border-t border-dashed border-border md:block"
        />
        {processSteps.map((step, index) => {
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
                "group relative z-10 grid min-h-24 grid-cols-[4.5rem_1fr] items-center gap-4 rounded-2xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:block md:min-h-44 md:border-transparent md:bg-transparent md:p-0 md:text-center",
                selected
                  ? "border-primary bg-accent md:border-transparent md:bg-transparent"
                  : "border-border bg-card hover:border-primary/45 md:border-transparent md:bg-transparent",
              ].join(" ")}
            >
              <span
                className={[
                  "grid size-16 place-items-center rounded-full border-2 text-xl font-bold tabular-nums transition-colors md:mx-auto md:size-[5.5rem] md:text-3xl",
                  selected
                    ? "border-primary bg-primary text-primary-foreground shadow-soft"
                    : "border-border bg-card text-foreground group-hover:border-primary/45",
                ].join(" ")}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>
                <span className="block text-base font-bold text-foreground md:mt-4">
                  {step.title}
                </span>
                <span
                  className={[
                    "mt-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.12em]",
                    selected
                      ? "border-primary text-primary"
                      : "border-border text-muted-foreground",
                  ].join(" ")}
                >
                  {selected ? (
                    <Check aria-hidden="true" size={12} />
                  ) : (
                    <Clock3 aria-hidden="true" size={12} />
                  )}
                  {selected ? "Current" : "Upcoming"}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`process-panel-${selectedStep.id}`}
        aria-labelledby={`process-tab-${selectedStep.id}`}
        className="relative mt-7 rounded-[1.5rem] border border-primary/45 bg-card p-6 shadow-soft sm:p-8"
      >
        <p className="text-lg font-medium text-foreground">{selectedStep.description}</p>
        <div className="mt-6 grid gap-4 border-t border-border pt-6 sm:grid-cols-3">
          {selectedStep.outcomes.map((outcome) => {
            const Icon = selectedStep.icon;
            return (
              <div key={outcome} className="flex items-center gap-3 rounded-xl bg-secondary/55 p-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-primary">
                  <Icon aria-hidden="true" size={19} />
                </span>
                <span className="text-sm font-semibold text-foreground">{outcome}</span>
              </div>
            );
          })}
        </div>
        <a
          href="/consultation"
          className="mt-7 inline-flex min-h-12 items-center gap-3 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 active:translate-y-px"
        >
          Proceed to consultation
          <ArrowRight aria-hidden="true" size={18} />
        </a>
      </div>
    </RefinementSection>
  );
}
