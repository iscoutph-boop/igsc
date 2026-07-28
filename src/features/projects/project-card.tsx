import { useState } from "react";
import type { Project } from "./project-data";

export type ProjectCardProps = {
  project: Project;
  onSelect: (slug: string) => void;
};

export function ProjectCard({ project, onSelect }: ProjectCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const cover = project.images[0];

  return (
    <article className="min-w-0 border-t border-border pt-4">
      <button
        type="button"
        aria-label={`View ${project.name} gallery`}
        onClick={() => onSelect(project.slug)}
        className="group block min-h-11 w-full text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        <span className="block aspect-[4/3] overflow-hidden bg-muted">
          {imageFailed || !cover ? (
            <span
              role="status"
              className="flex h-full min-h-44 items-center justify-center px-6 text-sm font-medium text-muted-foreground"
            >
              Image unavailable
            </span>
          ) : (
            <img
              src={cover.thumb}
              alt={`${project.name} cover`}
              loading="lazy"
              decoding="async"
              width={640}
              height={480}
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-300 motion-reduce:transform-none [@media(hover:hover)]:group-hover:scale-[1.025]"
            />
          )}
        </span>
        <span className="flex items-start justify-between gap-4 py-4">
          <span>
            <span className="block font-display text-xl font-bold tracking-tight text-foreground">
              {project.name}
            </span>
            <span className="mt-1 block text-sm text-muted-foreground">{project.statusLabel}</span>
          </span>
          <span className="shrink-0 pt-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
            {project.images.length} images
          </span>
        </span>
      </button>
    </article>
  );
}
