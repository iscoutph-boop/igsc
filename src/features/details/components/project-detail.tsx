import { useState } from "react";
import { ArrowRight, Bath, Bed, Building2, CalendarDays, MapPin, Square } from "lucide-react";
import { projectGalleryPool } from "../content";
import type { Project } from "../types";

type ProjectDetailProps = {
  project: Project;
  onOpenImage: (src: string, group: string[]) => void;
};

export function ProjectDetail({ project, onOpenImage }: ProjectDetailProps) {
  const galleryStart = Number(project.number) % projectGalleryPool.length;
  const gallery = [
    project.img,
    ...Array.from(
      { length: 5 },
      (_, index) => projectGalleryPool[(galleryStart + index) % projectGalleryPool.length],
    ),
  ];
  const [activeImage, setActiveImage] = useState(gallery[0]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="min-w-0">
        <button
          type="button"
          onClick={() => onOpenImage(activeImage, gallery)}
          className="block w-full overflow-hidden rounded-[1.25rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={`Open full-size image for ${project.title}`}
        >
          <img
            src={activeImage}
            alt={`${project.title} in ${project.location}`}
            className="aspect-[4/3] w-full object-cover"
          />
        </button>
        <div className="mt-3 grid grid-cols-5 gap-2">
          {gallery.slice(1).map((image, index) => (
            <button
              type="button"
              key={`${image}-${index}`}
              onClick={() => setActiveImage(image)}
              aria-label={`Show ${project.title} image ${index + 2}`}
              className={[
                "overflow-hidden rounded-xl border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                activeImage === image ? "border-primary" : "border-transparent",
              ].join(" ")}
            >
              <img src={image} alt="" className="aspect-square w-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.13em] text-primary">
          <span>{project.status}</span>
          <span aria-hidden="true" className="h-px w-5 bg-primary/50" />
          <span>{project.type}</span>
        </div>
        <h2 className="mt-4 text-4xl font-bold leading-tight text-foreground">{project.title}</h2>
        <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin aria-hidden="true" size={17} className="text-primary" />
          {project.location}
        </p>
        <p className="mt-6 text-base leading-7 text-muted-foreground">{project.description}</p>

        <div className="mt-7 grid grid-cols-2 gap-3">
          {extractProjectFacts(project.highlights).map((fact) => {
            const Icon = fact.icon;
            return (
              <div key={fact.label} className="rounded-xl bg-secondary/70 p-4">
                <Icon aria-hidden="true" size={19} className="text-primary" />
                <p className="mt-3 text-sm font-semibold text-foreground">{fact.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{fact.value}</p>
              </div>
            );
          })}
        </div>

        <ul className="mt-7 grid gap-3 sm:grid-cols-2">
          {project.highlights.map((highlight) => (
            <li key={highlight} className="flex items-center gap-2 text-sm text-muted-foreground">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
              {highlight}
            </li>
          ))}
        </ul>

        <a
          href="/consultation"
          className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 active:translate-y-px"
        >
          Discuss a similar project
          <ArrowRight aria-hidden="true" size={18} />
        </a>
      </div>
    </div>
  );
}

function extractProjectFacts(highlights: string[]) {
  const bedrooms = highlights.find((item) => /bedroom/i.test(item)) ?? "Project-specific";
  const bathrooms = highlights.find((item) => /restroom|bath/i.test(item)) ?? "Project-specific";
  const parking =
    highlights.find((item) => /carport|parking|vehicle/i.test(item)) ?? "Project-specific";

  return [
    { label: "Bedrooms", value: bedrooms, icon: Bed },
    { label: "Bathrooms", value: bathrooms, icon: Bath },
    { label: "Parking", value: parking, icon: Building2 },
    {
      label: "Project scope",
      value: `${highlights.length} key spaces`,
      icon: Square,
    },
    {
      label: "Status",
      value: "Verified project record",
      icon: CalendarDays,
    },
  ].slice(0, 4);
}
