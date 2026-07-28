import { useState } from "react";
import type { Project } from "./project-data";

export type ProjectGalleryProps = {
  project: Project;
  onImageOpen: (index: number, triggerElement: HTMLButtonElement) => void;
};

export function ProjectGallery({ project, onImageOpen }: ProjectGalleryProps) {
  const [failedImages, setFailedImages] = useState<Set<number>>(() => new Set());

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {project.images.map((image, index) => {
        const imageFailed = failedImages.has(index);

        return (
          <button
            key={image.thumb}
            type="button"
            aria-label={image.alt}
            onClick={(event) => onImageOpen(index, event.currentTarget)}
            className="group block min-h-11 overflow-hidden bg-muted text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <span className="block aspect-[4/3]">
              {imageFailed ? (
                <span
                  role="status"
                  className="flex h-full min-h-36 items-center justify-center px-5 text-sm font-medium text-muted-foreground"
                >
                  Image unavailable
                </span>
              ) : (
                <img
                  src={image.thumb}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  width={640}
                  height={480}
                  onError={() =>
                    setFailedImages((failed) => {
                      const next = new Set(failed);
                      next.add(index);
                      return next;
                    })
                  }
                  className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-300 motion-reduce:transform-none [@media(hover:hover)]:group-hover:scale-[1.025]"
                />
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
