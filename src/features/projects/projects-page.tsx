import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Lightbox } from "@/components/lightbox";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { projects, type Project, type ProjectFilter } from "./project-data";
import { filterProjects } from "./project-state";
import { ProjectCard } from "./project-card";
import { ProjectFilterBar } from "./project-filter";
import { ProjectGallery } from "./project-gallery";

export type ProjectsPageProps = {
  catalog?: Project[];
  category: ProjectFilter;
  selectedSlug?: string;
  onCategoryChange: (category: ProjectFilter) => void;
  onProjectSelect: (slug?: string) => void;
};

export function ProjectsPage({
  catalog = projects,
  category,
  selectedSlug,
  onCategoryChange,
  onProjectSelect,
}: ProjectsPageProps) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const lightboxTriggerRef = useRef<HTMLElement | null>(null);
  const filteredProjects = filterProjects(catalog, category);
  const selectedProject = catalog.find((project) => project.slug === selectedSlug);

  const handleCategoryChange = (nextCategory: ProjectFilter) => {
    if (selectedProject && nextCategory !== "all" && selectedProject.category !== nextCategory) {
      setLightboxIndex(-1);
      onProjectSelect(undefined);
    }
    onCategoryChange(nextCategory);
  };

  const handleImageOpen = (index: number, triggerElement: HTMLButtonElement) => {
    lightboxTriggerRef.current = triggerElement;
    setLightboxIndex(index);
  };

  const lightboxImages =
    selectedProject?.images.map((image) => ({
      src: image.full,
      alt: image.alt,
    })) ?? [];

  return (
    <>
      <SiteHeader />
      <main className="bg-background text-foreground">
        <section className="border-b border-border">
          <div className="mx-auto max-w-[1500px] px-5 py-16 sm:px-8 md:px-10 md:py-24">
            <h1 className="max-w-5xl font-display text-4xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              Real work. Built by IG Sabroso.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              Browse verified completed, ongoing, and design projects from IG Sabroso Construction.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="project-index-heading"
          className="mx-auto max-w-[1500px] px-5 py-12 sm:px-8 md:px-10 md:py-16"
        >
          <h2 id="project-filter-heading" className="sr-only">
            Filter projects
          </h2>
          <ProjectFilterBar category={category} onCategoryChange={handleCategoryChange} />

          <div className="mt-12 flex items-end justify-between gap-5 border-b border-border pb-5">
            <h2
              id="project-index-heading"
              className="font-display text-2xl font-bold tracking-tight sm:text-3xl"
            >
              Project index
            </h2>
            <p className="shrink-0 text-sm font-semibold text-muted-foreground">
              {filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"}
            </p>
          </div>

          {filteredProjects.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} onSelect={onProjectSelect} />
              ))}
            </div>
          ) : (
            <div className="mt-8 border-y border-border py-16 text-center">
              <p className="font-display text-2xl font-bold">No projects found</p>
              <button
                type="button"
                onClick={() => handleCategoryChange("all")}
                className="mt-6 inline-flex min-h-11 items-center justify-center border border-foreground bg-foreground px-5 py-2 text-sm font-semibold text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Show all projects
              </button>
            </div>
          )}
        </section>

        {selectedProject && (
          <section
            aria-labelledby="selected-project-heading"
            className="border-y border-border bg-surface"
          >
            <div className="mx-auto max-w-[1500px] px-5 py-14 sm:px-8 md:px-10 md:py-20">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    {selectedProject.statusLabel}
                  </p>
                  <h2
                    id="selected-project-heading"
                    className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl"
                  >
                    {selectedProject.name}
                  </h2>
                </div>
                <p className="text-sm font-semibold text-muted-foreground">
                  {selectedProject.images.length} images
                </p>
              </div>
              <ProjectGallery project={selectedProject} onImageOpen={handleImageOpen} />
            </div>
          </section>
        )}

        <section className="bg-foreground text-background">
          <div className="mx-auto flex max-w-[1500px] flex-col items-start justify-between gap-8 px-5 py-14 sm:px-8 md:px-10 md:py-20 lg:flex-row lg:items-end">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Have a project in mind?
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-background/70 sm:text-base">
                Tell us a bit about it and our team will be in touch shortly.
              </p>
            </div>
            <Link
              to="/consultation"
              className="inline-flex min-h-11 items-center justify-center bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              Request a Consultation
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />

      <Lightbox
        images={lightboxImages}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(-1)}
        onIndexChange={setLightboxIndex}
        returnFocusRef={lightboxTriggerRef}
      />
    </>
  );
}
