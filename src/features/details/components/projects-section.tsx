import { useState } from "react";
import { ArrowRight, Building2, Search, SlidersHorizontal, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { projectFilters, projects } from "../content";
import { filterProjects } from "../model";
import type { Project, ProjectFilter, ProjectSort } from "../types";
import { ProjectDetail } from "./project-detail";
import { RefinementSection } from "./refinement-shell";
import { SectionHeading } from "./section-heading";

type ProjectsSectionProps = {
  onOpenImage: (src: string, group: string[]) => void;
};

const projectLayoutClasses = [
  "lg:col-span-6 lg:row-span-2",
  "lg:col-span-3",
  "lg:col-span-3",
  "lg:col-span-4",
  "lg:col-span-4",
  "lg:col-span-4",
];

export function ProjectsSection({ onOpenImage }: ProjectsSectionProps) {
  const [filter, setFilter] = useState<ProjectFilter>("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<ProjectSort>("latest");
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = filterProjects(projects, filter, query, sort);
  const visibleProjects = filteredProjects.slice(0, visibleCount);

  const chooseFilter = (nextFilter: ProjectFilter) => {
    setFilter(nextFilter);
    setVisibleCount(6);
  };

  const clearFilters = () => {
    setFilter("All");
    setQuery("");
    setSort("latest");
    setVisibleCount(6);
  };

  return (
    <>
      <RefinementSection id="portfolio" tone="muted">
        <SectionHeading
          title="Explore all our"
          accent="builds."
          description="From modern homes to multi-unit developments and commercial spaces, explore completed and ongoing projects built with quality, integrity, and purpose."
          className="max-w-3xl"
        />

        <div className="mt-9 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div
            className="flex gap-2 overflow-x-auto pb-2 no-scrollbar"
            aria-label="Project filters"
          >
            {projectFilters.map((projectFilter) => (
              <button
                type="button"
                key={projectFilter}
                aria-pressed={filter === projectFilter}
                onClick={() => chooseFilter(projectFilter)}
                className={[
                  "min-h-11 shrink-0 rounded-xl border px-5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  filter === projectFilter
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/50 hover:text-primary",
                ].join(" ")}
              >
                {projectFilter}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative min-w-0 sm:w-72">
              <span className="sr-only">Search projects</span>
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <input
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setVisibleCount(6);
                }}
                aria-label="Search projects"
                placeholder="Search project or location"
                className="h-12 w-full rounded-xl border border-border bg-card pl-11 pr-10 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Clear project search"
                >
                  <X aria-hidden="true" size={17} />
                </button>
              ) : null}
            </label>

            <label className="relative">
              <span className="sr-only">Sort projects</span>
              <SlidersHorizontal
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={17}
              />
              <select
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value as ProjectSort);
                  setVisibleCount(6);
                }}
                aria-label="Sort projects"
                className="h-12 min-w-44 appearance-none rounded-xl border border-border bg-card pl-11 pr-9 text-sm font-semibold text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="latest">Latest first</option>
                <option value="completed">Completed first</option>
                <option value="ongoing">Ongoing first</option>
                <option value="name">Project name</option>
              </select>
            </label>
          </div>
        </div>

        {visibleProjects.length > 0 ? (
          <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-12">
            {visibleProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                featured={index === 0}
                className={projectLayoutClasses[index] ?? "lg:col-span-4"}
                onOpen={() => setSelectedProject(project)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-[1.5rem] border border-dashed border-border bg-card px-6 py-16 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-accent text-primary">
              <Building2 aria-hidden="true" size={26} />
            </span>
            <h3 className="mt-5 text-2xl font-bold text-foreground">
              No projects match these filters.
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Try another category or clear the search to see the complete project portfolio.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 min-h-11 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
            >
              Clear filters
            </button>
          </div>
        )}

        {visibleCount < filteredProjects.length ? (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() =>
                setVisibleCount((current) => Math.min(current + 6, filteredProjects.length))
              }
              className="inline-flex min-h-12 items-center gap-3 rounded-full border border-primary px-6 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
            >
              View more projects
              <ArrowRight aria-hidden="true" size={18} />
            </button>
          </div>
        ) : null}
      </RefinementSection>

      <Dialog
        open={selectedProject !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedProject(null);
          }
        }}
      >
        <DialogContent className="max-h-[92dvh] max-w-6xl overflow-y-auto rounded-[1.5rem] border-border bg-card p-5 sm:p-8">
          <DialogTitle className="sr-only">
            {selectedProject?.title ?? "Project details"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Project photographs, summary, and key spaces.
          </DialogDescription>
          {selectedProject ? (
            <ProjectDetail project={selectedProject} onOpenImage={onOpenImage} />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

type ProjectCardProps = {
  project: Project;
  featured: boolean;
  className: string;
  onOpen: () => void;
};

function ProjectCard({ project, featured, className, onOpen }: ProjectCardProps) {
  return (
    <article className={`group overflow-hidden rounded-[1.35rem] bg-card shadow-soft ${className}`}>
      <button
        type="button"
        onClick={onOpen}
        className="block w-full overflow-hidden text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/60"
        aria-label={`Open ${project.title} project`}
      >
        <img
          src={project.img}
          alt={`${project.title}, ${project.type.toLowerCase()} project in ${project.location}`}
          className={[
            "w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]",
            featured ? "aspect-[1.62/1] lg:h-[29rem] lg:aspect-auto" : "aspect-[1.55/1]",
          ].join(" ")}
        />
      </button>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
              {project.status} {project.type}
            </p>
            <h3 className="mt-2 text-xl font-bold text-foreground">{project.title}</h3>
          </div>
          <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted-foreground">
            {project.number}
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{project.location}</p>
        <button
          type="button"
          onClick={onOpen}
          className="mt-5 flex items-center gap-2 text-sm font-bold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Open project
          <ArrowRight
            aria-hidden="true"
            size={17}
            className="transition-transform group-hover:translate-x-1"
          />
        </button>
      </div>
    </article>
  );
}
