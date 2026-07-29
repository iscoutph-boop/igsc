import { useState } from "react";
import { ArrowRight, Check, Star } from "lucide-react";
import { finishPackages } from "../content";
import type { PackageType } from "../types";
import { RefinementSection } from "./refinement-shell";
import { SectionHeading } from "./section-heading";

export function PackagesSection() {
  const [selectedType, setSelectedType] = useState<PackageType>("Elegant");
  const selectedPackage =
    finishPackages.find((plan) => plan.type === selectedType) ?? finishPackages[2];

  return (
    <RefinementSection id="packages">
      <SectionHeading
        eyebrow="Finish packages"
        title="Four finish tiers."
        accent="One standard of quality."
        description="Transparent rates per square meter, tailored to fit your vision and budget."
        align="center"
        className="max-w-4xl"
      />

      <fieldset className="mt-10 overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
        <legend className="sr-only">Choose a finish package</legend>
        <div className="grid min-w-[760px] grid-cols-4 p-1.5">
          {finishPackages.map((plan) => {
            const selected = plan.type === selectedType;
            return (
              <label
                key={plan.type}
                className={[
                  "relative flex min-h-20 cursor-pointer flex-col items-center justify-center rounded-xl px-4 text-center transition-colors",
                  selected
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-secondary",
                ].join(" ")}
              >
                <input
                  type="radio"
                  name="finish-package"
                  value={plan.type}
                  checked={selected}
                  onChange={() => setSelectedType(plan.type)}
                  className="sr-only"
                />
                <span className="font-bold">{plan.type}</span>
                <span
                  className={[
                    "mt-1 text-xs",
                    selected ? "text-primary-foreground/85" : "text-muted-foreground",
                  ].join(" ")}
                >
                  {plan.price}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <article className="rounded-[1.5rem] border border-border bg-card p-6 shadow-soft sm:p-8">
          <div className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-3xl font-bold text-foreground">{selectedPackage.name}</h3>
              <p className="mt-2 text-2xl font-bold text-primary">{selectedPackage.price}</p>
              <p className="mt-1 text-sm text-muted-foreground">{selectedPackage.note}</p>
            </div>
            {selectedPackage.recommendation ? (
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-full border border-primary text-primary">
                  <Star aria-hidden="true" size={20} fill="currentColor" />
                </span>
                <span className="rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground">
                  {selectedPackage.recommendation}
                </span>
              </div>
            ) : null}
          </div>

          <div className="mt-7 grid gap-8 md:grid-cols-3">
            {selectedPackage.groups.map((group) => (
              <div key={group.title}>
                <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-foreground">
                  {group.title}
                </h4>
                <ul className="mt-5 space-y-4">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-5 text-muted-foreground">
                      <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                        <Check aria-hidden="true" size={11} strokeWidth={3} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </article>

        <aside className="rounded-[1.5rem] border border-border bg-card p-6 shadow-soft">
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
            All packages
          </h3>
          <div className="mt-4">
            {finishPackages.map((plan) => {
              const selected = plan.type === selectedType;
              return (
                <button
                  type="button"
                  key={plan.type}
                  aria-pressed={selected}
                  onClick={() => setSelectedType(plan.type)}
                  className={[
                    "flex w-full items-center gap-3 border-b border-border px-2 py-4 text-left transition-colors last:border-b-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    selected ? "rounded-xl bg-accent" : "hover:bg-secondary/70",
                  ].join(" ")}
                >
                  <span
                    aria-hidden="true"
                    className={[
                      "size-5 shrink-0 rounded-full border",
                      selected ? "border-[5px] border-primary" : "border-muted-foreground/45",
                    ].join(" ")}
                  />
                  <span className="min-w-0">
                    <span className="block font-semibold text-foreground">{plan.type}</span>
                    <span className="block text-xs text-muted-foreground">{plan.note}</span>
                  </span>
                  <span className="ml-auto max-w-32 text-right text-xs font-bold text-foreground">
                    {plan.price}
                  </span>
                </button>
              );
            })}
          </div>
          <a
            href="/consultation"
            className="mt-5 flex min-h-12 items-center justify-center gap-3 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 active:translate-y-px"
          >
            View {selectedPackage.type} checklist
            <ArrowRight aria-hidden="true" size={17} />
          </a>
        </aside>
      </div>

      <p className="mx-auto mt-8 max-w-4xl text-center text-sm leading-6 text-muted-foreground">
        Package prices are approximate estimates and may vary based on scope, location, materials,
        site conditions, permits, professional fees, and customization.
      </p>
    </RefinementSection>
  );
}
