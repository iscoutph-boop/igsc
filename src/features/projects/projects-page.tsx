import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Building2, Search, SlidersHorizontal } from "lucide-react";
import { PageTransition } from "@/components/page-transition";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusBadge } from "@/components/ui/status-badge";
import { PROJECTS, PROJECT_CATEGORIES, type ProjectRecord } from "@/content/projects";
import { trackEvent } from "@/lib/analytics";

export function ProjectsPage() {
  return (
    <PageTransition>
      <SiteHeader />
      <ProjectsPageContent />
      <SiteFooter />
    </PageTransition>
  );
}

export function ProjectsPageContent() {
  const [category, setCategory] = useState<(typeof PROJECT_CATEGORIES)[number]["value"]>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return PROJECTS.filter((project) => {
      const matchesCategory =
        category === "all" || project.category === category || project.status === category;
      const matchesQuery =
        !normalized ||
        [project.name, project.location, project.category, project.status].some((value) =>
          value.toLowerCase().includes(normalized),
        );
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  const featured = filtered.find((project) => project.featured) ?? filtered[0];
  const remaining = featured ? filtered.filter((project) => project.slug !== featured.slug) : [];

  return (
    <main>
      <section className="border-b border-border bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-[1500px] px-6 sm:px-8 lg:px-14">
          <SectionHeading
            level={1}
            label="Our projects"
            title={
              <>
                Selected real projects.
                <span className="block text-primary">Built for real life.</span>
              </>
            }
            description="Explore a curated portfolio of completed and ongoing IG Sabroso work across residential, renovation, multi-unit, and commercial projects."
          />

          <div className="mt-10 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex gap-2 overflow-x-auto pb-2" aria-label="Project filters">
              {PROJECT_CATEGORIES.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  aria-pressed={category === filter.value}
                  onClick={() => {
                    setCategory(filter.value);
                    trackEvent("project_filter_change", { filter: filter.value });
                  }}
                  className={[
                    "min-h-11 shrink-0 rounded-xl border px-4 text-sm font-extrabold transition",
                    category === filter.value
                      ? "border-primary bg-primary text-white"
                      : "border-[#dce1e6] bg-white text-[#344054] hover:border-primary/40 hover:text-primary",
                  ].join(" ")}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <label className="relative block w-full xl:w-80">
              <span className="sr-only">Search projects</span>
              <Search
                aria-hidden="true"
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search project or location"
                aria-label="Search projects"
                className="h-12 w-full rounded-xl border border-[#dce1e6] bg-white pl-11 pr-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
            </label>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f8fa] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-[1500px] px-6 sm:px-8 lg:px-14">
          {featured ? (
            <>
              <FeaturedProject project={featured} />
              <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {remaining.map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#cfd5dc] bg-white px-6 py-20 text-center">
              <Building2 aria-hidden="true" size={34} className="mx-auto text-primary" />
              <h2 className="mt-5 text-2xl font-extrabold text-foreground">
                No projects match these filters.
              </h2>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-7 text-muted-foreground">
                Try a different category or clear the search to return to the complete curated
                portfolio.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCategory("all");
                  setQuery("");
                }}
                className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-extrabold text-white"
              >
                <SlidersHorizontal aria-hidden="true" size={17} />
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function FeaturedProject({ project }: { project: ProjectRecord }) {
  return (
    <article className="grid overflow-hidden rounded-[1.75rem] border border-border bg-white shadow-[0_20px_60px_rgba(21,34,56,0.1)] lg:grid-cols-[1.2fr_0.8fr]">
      <Link
        to="/projects/$slug"
        params={{ slug: project.slug }}
        aria-label={`View ${project.name}`}
        onClick={() => trackEvent("project_card_click", { project: project.slug })}
        className="block overflow-hidden"
      >
        <img
          src={project.cover.src}
          alt={project.cover.alt}
          className="aspect-[16/10] h-full w-full object-cover transition duration-700 hover:scale-[1.02]"
        />
      </Link>
      <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
        <StatusBadge status={project.status} visualizationOnly={project.visualizationOnly} />
        <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.16em] text-primary">
          Featured project
        </p>
        <h2 className="mt-3 text-4xl font-extrabold tracking-[-0.035em] text-foreground sm:text-5xl">
          {project.name}
        </h2>
        <p className="mt-2 font-semibold text-primary">{project.location}</p>
        <p className="mt-6 text-base leading-8 text-muted-foreground">{project.description}</p>
        <ProjectFacts project={project} />
        <Link
          to="/projects/$slug"
          params={{ slug: project.slug }}
          className="mt-8 inline-flex min-h-12 w-fit items-center gap-3 rounded-xl bg-primary px-5 text-sm font-extrabold text-white"
        >
          View project details
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </div>
    </article>
  );
}

function ProjectCard({ project }: { project: ProjectRecord }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-white shadow-[0_14px_42px_rgba(21,34,56,0.06)]">
      <Link
        to="/projects/$slug"
        params={{ slug: project.slug }}
        aria-label={`View ${project.name}`}
        onClick={() => trackEvent("project_card_click", { project: project.slug })}
        className="block overflow-hidden"
      >
        <img
          src={project.cover.src}
          alt={project.cover.alt}
          className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-[1.025]"
          loading="lazy"
        />
      </Link>
      <div className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <StatusBadge status={project.status} visualizationOnly={project.visualizationOnly} />
          <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">
            {project.category.replace("-", " ")}
          </span>
        </div>
        <h2 className="mt-5 text-2xl font-extrabold tracking-[-0.025em] text-foreground">
          {project.name}
        </h2>
        <p className="mt-1 text-sm font-semibold text-primary">{project.location}</p>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">{project.summary}</p>
        <Link
          to="/projects/$slug"
          params={{ slug: project.slug }}
          className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-foreground transition hover:text-primary"
        >
          View project
          <ArrowRight aria-hidden="true" size={17} />
        </Link>
      </div>
    </article>
  );
}

function ProjectFacts({ project }: { project: ProjectRecord }) {
  const facts = [
    project.specifications.floorArea,
    project.specifications.bedrooms ? `${project.specifications.bedrooms} bedrooms` : undefined,
    project.specifications.bathrooms ? `${project.specifications.bathrooms} bathrooms` : undefined,
  ].filter((fact): fact is string => Boolean(fact));

  return facts.length ? (
    <div className="mt-7 flex flex-wrap gap-2">
      {facts.map((fact) => (
        <span
          key={fact}
          className="rounded-full bg-[#f2f4f7] px-3 py-2 text-xs font-bold text-[#475467]"
        >
          {fact}
        </span>
      ))}
    </div>
  ) : null;
}
