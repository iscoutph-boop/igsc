import { ArrowRight, CalendarCheck2, Grid2X2, Target } from "lucide-react";
import { meetingImages } from "../content";
import { RefinementSection } from "./refinement-shell";
import { SectionHeading } from "./section-heading";

type MeetingsSectionProps = {
  onOpenImage: (src: string, group: string[]) => void;
};

const meetingCoverage = [
  {
    title: "Scope and priorities",
    icon: Target,
  },
  {
    title: "Materials and finishes",
    icon: Grid2X2,
  },
  {
    title: "Timeline and next steps",
    icon: CalendarCheck2,
  },
];

export function MeetingsSection({ onOpenImage }: MeetingsSectionProps) {
  const imageGroup = meetingImages.map((image) => image.src);
  const [featuredImage, ...supportingImages] = meetingImages;

  return (
    <RefinementSection id="meetings">
      <div className="grid items-start gap-10 lg:grid-cols-[0.72fr_1.5fr] lg:gap-14">
        <div>
          <SectionHeading
            eyebrow="Client & team meetings"
            title="Understanding your vision,"
            accent="together."
          />
          <p className="mt-7 max-w-[39ch] text-base leading-7 text-muted-foreground">
            Every project starts with a real conversation. We review plans and materials with our
            clients, then align with the team so what we build reflects how they want to live.
          </p>

          <div className="mt-8 rounded-[1.35rem] border border-primary/45 bg-card p-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
              What every meeting covers
            </h3>
            <ul className="mt-5 space-y-5">
              {meetingCoverage.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.title} className="flex items-center gap-4">
                    <span className="grid size-12 place-items-center rounded-xl bg-accent text-primary">
                      <Icon aria-hidden="true" size={22} strokeWidth={1.8} />
                    </span>
                    <span className="font-semibold text-foreground">{item.title}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <a
            href="#process"
            className="mt-7 inline-flex min-h-11 items-center gap-3 text-sm font-bold uppercase tracking-[0.16em] text-primary underline decoration-primary/45 underline-offset-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            See how we work
            <ArrowRight aria-hidden="true" size={17} />
          </a>
        </div>

        <div className="min-w-0">
          <figure>
            <button
              type="button"
              onClick={() => onOpenImage(featuredImage.src, imageGroup)}
              className="block w-full overflow-hidden rounded-[1.5rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
              aria-label={`Open ${featuredImage.caption} image`}
            >
              <img
                src={featuredImage.src}
                alt={featuredImage.alt}
                className="aspect-[2.1/1] w-full object-cover transition-transform duration-500 hover:scale-[1.015]"
              />
            </button>
            <figcaption className="mt-3 text-sm font-medium text-foreground">
              {featuredImage.caption}
            </figcaption>
          </figure>

          <div className="mt-5 flex snap-x gap-4 overflow-x-auto pb-2 no-scrollbar lg:grid lg:grid-cols-3 lg:overflow-visible">
            {supportingImages.slice(0, 3).map((image) => (
              <figure
                key={image.src}
                className="w-[78vw] shrink-0 snap-start sm:w-[46vw] lg:w-auto"
              >
                <button
                  type="button"
                  onClick={() => onOpenImage(image.src, imageGroup)}
                  className="block w-full overflow-hidden rounded-[1.25rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
                  aria-label={`Open ${image.caption} image`}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="aspect-[1.22/1] w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                  />
                </button>
                <figcaption className="mt-3 text-sm font-medium text-foreground">
                  {image.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </RefinementSection>
  );
}
