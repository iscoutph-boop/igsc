import { useState, type ReactNode } from "react";
import {
  Bath,
  Bed,
  Building2,
  Calculator,
  CheckSquare2,
  Home,
  Layers3,
  MapPin,
  PaintRoller,
  RotateCcw,
} from "lucide-react";
import { calculateEstimate, validateEstimate } from "../model";
import type { EstimateInput, PackageType } from "../types";
import { EstimateSummary } from "./estimate-summary";
import { RefinementSection } from "./refinement-shell";
import { SectionHeading } from "./section-heading";

const initialInput: EstimateInput = {
  projectType: "",
  location: "",
  floors: 0,
  area: 0,
  packageType: "",
  bedrooms: 4,
  bathrooms: 3,
  site: "",
  addons: [],
};

const packageTypes: PackageType[] = ["Standard", "Semi-Elegant", "Elegant", "Luxury"];

const addOnOptions = ["Gate & Fence", "Carport", "Interior Fit-Out", "Smart Home Features"];

export function EstimatorSection() {
  const [input, setInput] = useState<EstimateInput>(initialInput);
  const errors = validateEstimate(input);
  const result = calculateEstimate(input);

  const update = <Key extends keyof EstimateInput>(key: Key, value: EstimateInput[Key]) => {
    setInput((current) => ({ ...current, [key]: value }));
  };

  const toggleAddon = (addon: string) => {
    setInput((current) => ({
      ...current,
      addons: current.addons.includes(addon)
        ? current.addons.filter((item) => item !== addon)
        : [...current.addons, addon],
    }));
  };

  return (
    <RefinementSection id="estimator">
      <SectionHeading
        eyebrow="Price estimator"
        title="Estimate your build"
        accent="before you begin."
        description="Get a clear estimated construction range based on your project details, finish preferences, and required spaces."
        className="max-w-3xl"
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)_24rem] xl:grid-cols-[16rem_minmax(0,1fr)_26rem]">
        <ol className="rounded-[1.5rem] border border-border bg-card p-6 shadow-soft">
          <EstimatorStep
            icon={Home}
            title="Project basics"
            description="Tell us about your project"
            active
          />
          <EstimatorStep
            icon={PaintRoller}
            title="Finish and rooms"
            description="Choose your package and room details"
          />
          <EstimatorStep
            icon={CheckSquare2}
            title="Site and add-ons"
            description="Describe the site and optional work"
          />
        </ol>

        <form
          className="rounded-[1.5rem] border border-border bg-card p-5 shadow-soft sm:p-7"
          onSubmit={(event) => event.preventDefault()}
        >
          <fieldset>
            <legend className="sr-only">Project basics</legend>
            <div className="grid gap-5 md:grid-cols-2">
              <Field id="estimate-project-type" label="Project Type" error={errors.projectType}>
                <div className="relative">
                  <Building2
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary"
                    size={18}
                  />
                  <select
                    id="estimate-project-type"
                    value={input.projectType}
                    onChange={(event) => update("projectType", event.target.value)}
                    aria-invalid={Boolean(errors.projectType)}
                    aria-describedby={
                      errors.projectType ? "estimate-project-type-error" : undefined
                    }
                    className="h-12 w-full appearance-none rounded-xl border border-input bg-background pl-11 pr-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Select a project type</option>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Renovation">Renovation</option>
                  </select>
                </div>
              </Field>

              <Field id="estimate-location" label="Project Location" error={errors.location}>
                <div className="relative">
                  <MapPin
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary"
                    size={18}
                  />
                  <input
                    id="estimate-location"
                    value={input.location}
                    onChange={(event) => update("location", event.target.value)}
                    aria-invalid={Boolean(errors.location)}
                    aria-describedby={errors.location ? "estimate-location-error" : undefined}
                    placeholder="Barangay, City, Province"
                    className="h-12 w-full rounded-xl border border-input bg-background pl-11 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </Field>

              <Field id="estimate-area" label="Floor Area (sqm)" error={errors.area}>
                <div className="relative">
                  <Calculator
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary"
                    size={18}
                  />
                  <input
                    id="estimate-area"
                    type="number"
                    min={10}
                    value={input.area || ""}
                    onChange={(event) => update("area", Number(event.target.value))}
                    aria-invalid={Boolean(errors.area)}
                    aria-describedby={errors.area ? "estimate-area-error" : undefined}
                    placeholder="Minimum 10 sqm"
                    className="h-12 w-full rounded-xl border border-input bg-background pl-11 pr-14 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    sqm
                  </span>
                </div>
              </Field>

              <Field id="estimate-floors" label="Number of Floors" error={errors.floors}>
                <div className="relative">
                  <Layers3
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary"
                    size={18}
                  />
                  <select
                    id="estimate-floors"
                    value={input.floors || ""}
                    onChange={(event) => update("floors", Number(event.target.value))}
                    aria-invalid={Boolean(errors.floors)}
                    aria-describedby={errors.floors ? "estimate-floors-error" : undefined}
                    className="h-12 w-full appearance-none rounded-xl border border-input bg-background pl-11 pr-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Select number of floors</option>
                    {[1, 2, 3, 4].map((floor) => (
                      <option key={floor} value={floor}>
                        {floor} {floor === 1 ? "Floor" : "Floors"}
                      </option>
                    ))}
                  </select>
                </div>
              </Field>
            </div>
          </fieldset>

          <fieldset className="mt-7 border-t border-border pt-6">
            <legend className="flex items-center gap-3 text-sm font-bold text-foreground">
              <PaintRoller aria-hidden="true" className="text-primary" size={21} />
              Finish and rooms
            </legend>

            <div className="mt-5">
              <span className="text-sm font-semibold text-foreground">Package Type</span>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {packageTypes.map((packageType) => (
                  <label
                    key={packageType}
                    className={[
                      "flex min-h-11 cursor-pointer items-center justify-center rounded-xl border px-3 text-center text-xs font-semibold transition-colors",
                      input.packageType === packageType
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-background text-foreground hover:border-primary/50",
                    ].join(" ")}
                  >
                    <input
                      type="radio"
                      name="estimate-package"
                      value={packageType}
                      checked={input.packageType === packageType}
                      onChange={() => update("packageType", packageType)}
                      className="sr-only"
                    />
                    {packageType}
                  </label>
                ))}
              </div>
              {errors.packageType ? (
                <p
                  id="estimate-package-error"
                  className="mt-2 text-xs font-medium text-destructive"
                >
                  {errors.packageType}
                </p>
              ) : null}
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <CompactSelect
                id="estimate-bedrooms"
                label="Bedrooms"
                icon={<Bed aria-hidden="true" size={18} />}
                value={input.bedrooms}
                onChange={(value) => update("bedrooms", value)}
                options={[1, 2, 3, 4, 5, 6, 7]}
              />
              <CompactSelect
                id="estimate-bathrooms"
                label="Bathrooms"
                icon={<Bath aria-hidden="true" size={18} />}
                value={input.bathrooms}
                onChange={(value) => update("bathrooms", value)}
                options={[1, 2, 3, 4, 5, 6, 7]}
              />
            </div>
          </fieldset>

          <fieldset className="mt-7 border-t border-border pt-6">
            <legend className="flex items-center gap-3 text-sm font-bold text-foreground">
              <CheckSquare2 aria-hidden="true" className="text-primary" size={21} />
              Site and add-ons
            </legend>
            <label className="mt-5 block">
              <span className="text-sm font-semibold text-foreground">Site Condition</span>
              <select
                value={input.site}
                onChange={(event) => update("site", event.target.value)}
                className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Describe the site</option>
                <option value="Flat lot">Flat lot</option>
                <option value="Sloped lot">Sloped lot</option>
                <option value="Existing structure">Existing structure</option>
                <option value="Restricted access">Restricted access</option>
              </select>
            </label>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {addOnOptions.map((addon) => (
                <label
                  key={addon}
                  className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-input bg-background px-4 text-sm text-foreground transition-colors hover:border-primary/50"
                >
                  <input
                    type="checkbox"
                    checked={input.addons.includes(addon)}
                    onChange={() => toggleAddon(addon)}
                    className="size-4 accent-primary"
                  />
                  {addon}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-7 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => {
                document
                  .getElementById("estimate-summary")
                  ?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              className="min-h-12 rounded-full bg-primary px-7 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 active:translate-y-px"
            >
              Continue
            </button>
            <button
              type="button"
              onClick={() => setInput(initialInput)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <RotateCcw aria-hidden="true" size={16} />
              Clear form
            </button>
          </div>
        </form>

        <div id="estimate-summary">
          <EstimateSummary input={input} errors={errors} result={result} />
        </div>
      </div>
    </RefinementSection>
  );
}

type EstimatorStepProps = {
  icon: typeof Home;
  title: string;
  description: string;
  active?: boolean;
};

function EstimatorStep({ icon: Icon, title, description, active = false }: EstimatorStepProps) {
  return (
    <li className="relative flex gap-4 pb-10 last:pb-0">
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-6 top-12 w-px border-l border-dashed border-border last:hidden"
      />
      <span
        className={[
          "relative z-10 grid size-12 shrink-0 place-items-center rounded-full border",
          active
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-secondary text-muted-foreground",
        ].join(" ")}
      >
        <Icon aria-hidden="true" size={21} />
      </span>
      <span>
        <span className="block text-sm font-bold text-foreground">{title}</span>
        <span className="mt-1 block text-xs leading-5 text-muted-foreground">{description}</span>
      </span>
    </li>
  );
}

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
};

function Field({ id, label, error, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-bold text-foreground">
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-xs font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type CompactSelectProps = {
  id: string;
  label: string;
  icon: ReactNode;
  value: number;
  onChange: (value: number) => void;
  options: number[];
};

function CompactSelect({ id, label, icon, value, onChange, options }: CompactSelectProps) {
  return (
    <label htmlFor={id}>
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <span className="relative mt-2 block">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary">
          {icon}
        </span>
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="h-12 w-full appearance-none rounded-xl border border-input bg-background pl-11 pr-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </span>
    </label>
  );
}
