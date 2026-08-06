import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import turnoverRibbon from "@/assets/real/turnover-ribbon.webp";
import { SERVICES } from "@/content/services";
import { RefinementSection } from "./refinement-shell";
import { SectionHeading } from "./section-heading";

export function ServicesSection() {
  return (
    <RefinementSection id="services" tone="muted">
      <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <div>
          <SectionHeading
            eyebrow="Our services"
            title="Complete solutions."
            accent="Superior results."
            description="From early project direction to construction and turnover, every service is structured around clear responsibility and dependable execution."
          />
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {[
              "Quality and precision",
              "Safety-conscious execution",
              "Transparent coordination",
              "Client-focused decisions",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm font-bold text-foreground">
                <CheckCircle2 aria-hidden="true" size={18} className="shrink-0 text-primary" />
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="overflow-hidden rounded-[1.75rem] border border-border bg-white shadow-card">
          <img
            src={turnoverRibbon}
            alt="IG Sabroso team and client during a real completed-project turnover"
            className="aspect-[16/9] w-full object-cover"
            loading="lazy"
          />
        </div>
      </div>

      <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {SERVICES.map(({ icon: Icon, title, description }, index) => (
          <article
            key={title}
            className="relative overflow-hidden rounded-2xl border border-border bg-white p-7 shadow-[0_12px_38px_rgba(21,34,56,0.055)]"
          >
            <span className="absolute right-5 top-4 font-display text-4xl font-black text-[#edf0f2]">
              0{index + 1}
            </span>
            <span className="grid size-12 place-items-center rounded-xl bg-[#fff0ea] text-primary">
              <Icon aria-hidden="true" size={24} />
            </span>
            <h3 className="mt-7 text-xl font-extrabold tracking-[-0.02em] text-foreground">
              {title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p>
            <Link
              to="/consultation"
              className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-primary"
            >
              Request consultation
              <ArrowRight aria-hidden="true" size={17} />
            </Link>
          </article>
        ))}
      </div>
    </RefinementSection>
  );
}
