import { Calculator, CheckCircle2 } from "lucide-react";
import type { EstimateErrors, EstimateInput, EstimateResult } from "../types";

type EstimateSummaryProps = {
  input: EstimateInput;
  errors: EstimateErrors;
  result: EstimateResult | null;
};

const inclusions = [
  "Structural Works",
  "Doors & Windows",
  "Electrical & Plumbing",
  "Paint Works",
  "Roofing & Ceiling",
  "Basic Fixtures & Fittings",
  "Flooring & Wall Finishes",
];

export function EstimateSummary({ input, errors, result }: EstimateSummaryProps) {
  const complete = result !== null && Object.keys(errors).length === 0;
  const destination = complete
    ? `/consultation?projectType=${encodeURIComponent(input.projectType)}&location=${encodeURIComponent(input.location)}&area=${input.area}&package=${encodeURIComponent(input.packageType)}`
    : "/consultation";

  return (
    <aside
      aria-live="polite"
      className="rounded-[1.5rem] border border-border bg-card p-6 shadow-soft lg:sticky lg:top-24"
    >
      <div className="flex items-center gap-4">
        <Calculator aria-hidden="true" className="text-primary" size={30} strokeWidth={1.8} />
        <h3 className="text-xl font-bold text-foreground">Estimate Summary</h3>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        Choose a package and enter a floor area of at least 10 sqm to see your estimated range.
      </p>

      <h4 className="mt-7 text-sm font-bold text-foreground">Inclusions Summary</h4>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {inclusions.map((inclusion) => (
          <li
            key={inclusion}
            className="flex items-start gap-2 text-xs leading-5 text-muted-foreground"
          >
            <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0 text-primary" size={15} />
            {inclusion}
          </li>
        ))}
      </ul>

      <div className="mt-7 grid min-h-44 place-items-center rounded-xl border border-dashed border-border bg-secondary/35 p-6 text-center">
        {result ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Estimated construction range
            </p>
            <p className="mt-3 text-2xl font-bold leading-tight text-foreground">
              {formatRange(result)}
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Based on {input.area.toLocaleString("en-US")} sqm and the {input.packageType} package.
            </p>
          </div>
        ) : (
          <div>
            <Calculator aria-hidden="true" className="mx-auto text-muted-foreground/45" size={36} />
            <p className="mx-auto mt-4 max-w-56 text-sm leading-6 text-muted-foreground">
              Complete the required fields to see your estimated range.
            </p>
          </div>
        )}
      </div>

      <p className="mt-6 border-t border-border pt-5 text-xs leading-5 text-muted-foreground">
        Final cost may vary based on design, site condition, finishes, and scope of work.
      </p>
      <a
        href={destination}
        aria-disabled={!complete}
        tabIndex={complete ? undefined : -1}
        onClick={(event) => {
          if (!complete) {
            event.preventDefault();
          }
        }}
        className={[
          "mt-6 flex min-h-12 items-center justify-center rounded-full px-5 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4",
          complete
            ? "bg-primary text-primary-foreground transition-transform hover:-translate-y-0.5 active:translate-y-px"
            : "cursor-not-allowed bg-primary/35 text-primary-foreground",
        ].join(" ")}
      >
        Get Detailed Estimate
      </a>
    </aside>
  );
}

function formatRange(result: EstimateResult) {
  return `PHP ${result.low.toLocaleString("en-US")} - PHP ${result.high.toLocaleString("en-US")}`;
}
