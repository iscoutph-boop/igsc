import { Building2, MapPin, Star } from "lucide-react";
import { testimonials, type Testimonial } from "../content";
import { RefinementSection } from "./refinement-shell";
import { SectionHeading } from "./section-heading";

export function ReviewsSection() {
  const [featuredReview, ...supportingReviews] = testimonials;

  return (
    <RefinementSection id="reviews" tone="muted">
      <SectionHeading
        eyebrow="Client reviews"
        title="Trusted by families."
        accent="Proven by results."
        description="Real feedback from clients we have built with, from the first consultation to turnover day."
        align="center"
        className="max-w-3xl"
      />

      <div className="mx-auto mt-12 grid max-w-6xl gap-8 lg:grid-cols-[1fr_1.08fr] lg:gap-12">
        <article className="border-b border-border pb-8 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-12">
          <span
            aria-hidden="true"
            className="font-display text-8xl font-bold leading-none text-primary/18"
          >
            “
          </span>
          <Rating rating={featuredReview.rating} />
          <blockquote className="mt-7 text-2xl font-medium leading-[1.55] text-foreground sm:text-3xl">
            “{featuredReview.quote}”
          </blockquote>
          <ReviewAttribution review={featuredReview} className="mt-8" />
        </article>

        <div>
          {supportingReviews.map((review) => (
            <article
              key={review.name}
              className="border-b border-border py-7 first:pt-0 last:border-b-0 last:pb-0"
            >
              <Rating rating={review.rating} />
              <blockquote className="mt-4 text-xl font-medium leading-8 text-foreground">
                “{review.quote}”
              </blockquote>
              <ReviewAttribution review={review} className="mt-6" />
            </article>
          ))}
        </div>
      </div>

      <p className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
        3 verified client stories shown
      </p>
    </RefinementSection>
  );
}

function Rating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 text-primary" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: rating }, (_, index) => (
        <Star key={index} aria-hidden="true" size={21} fill="currentColor" />
      ))}
    </div>
  );
}

function ReviewAttribution({ review, className }: { review: Testimonial; className?: string }) {
  return (
    <footer className={`flex items-center gap-4 ${className ?? ""}`}>
      <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
        {review.name.replace(/^The |^Mr\. & Mrs\. /, "").charAt(0)}
      </span>
      <span className="min-w-0">
        <span className="block font-bold text-foreground">{review.name}</span>
        <span className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Building2 aria-hidden="true" size={13} />
            {review.project}
          </span>
          <span className="inline-flex items-center gap-1 text-primary">
            <MapPin aria-hidden="true" size={13} />
            {review.location}
          </span>
        </span>
      </span>
    </footer>
  );
}
