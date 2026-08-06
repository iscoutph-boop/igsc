import { Quote, Star } from "lucide-react";
import turnoverHandover from "@/assets/real/turnover-handover.webp";
import { REVIEWS } from "@/content/reviews";
import { RefinementSection } from "./refinement-shell";
import { SectionHeading } from "./section-heading";

export function ReviewsSection() {
  return (
    <RefinementSection id="reviews" tone="muted">
      <SectionHeading
        eyebrow="Client reviews"
        title="Trusted by real clients."
        accent="Proven through real projects."
        description="Public recommendations from clients who worked directly with the IG Sabroso team."
        align="center"
        className="max-w-4xl"
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
        <div className="overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-card">
          <img
            src={turnoverHandover}
            alt="IG Sabroso team presenting a ceremonial project key during a completed residential handover"
            className="h-full min-h-[420px] w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="grid gap-4">
          {REVIEWS.map((review) => (
            <figure
              key={review.name}
              className="rounded-2xl border border-border bg-white p-6 shadow-[0_12px_36px_rgba(21,34,56,0.055)] sm:p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <Quote aria-hidden="true" size={29} className="text-primary" />
                <div className="flex gap-0.5 text-primary" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star key={index} aria-hidden="true" size={16} fill="currentColor" />
                  ))}
                </div>
              </div>
              <blockquote className="mt-5 text-base leading-8 text-[#344054]">
                “{review.quote}”
              </blockquote>
              <figcaption className="mt-5 border-t border-border pt-4">
                <p className="font-extrabold text-foreground">{review.name}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.1em] text-primary">
                  {review.project}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </RefinementSection>
  );
}
