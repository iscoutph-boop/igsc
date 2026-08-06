import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Bath, BedDouble, CarFront, MapPin, Ruler } from "lucide-react";
import { Lightbox } from "@/components/lightbox";
import { PageTransition } from "@/components/page-transition";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { getRelatedProjects, type ProjectRecord } from "@/content/projects";

export function ProjectDetailPage({ project }: { project: ProjectRecord }) {
  return (
    <PageTransition>
      <SiteHeader />
      <ProjectDetailContent project={project} />
      <SiteFooter />
    </PageTransition>
  );
}

export function ProjectDetailContent({ project }: { project: ProjectRecord }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const related = getRelatedProjects(project);
  const activeImage = project.gallery[activeIndex] ?? project.cover;

  return (
    <main>
      <section className="bg-white py-10 sm:py-14 lg:py-18">
        <div className="mx-auto w-full max-w-[1500px] px-6 sm:px-8 lg:px-14">
          <Link
            to="/projects"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-extrabold text-[#344054] transition hover:text-primary"
          >
            <ArrowLeft aria-hidden="true" size={18} />
            Back to projects
          </Link>

          <div className="mt-7 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-14">
            <div className="min-w-0">
              <button
                type="button"
                onClick={() => setLightboxIndex(activeIndex)}
                aria-label={`Open full-size image for ${project.name}`}
                className="block w-full overflow-hidden rounded-[1.75rem] border border-border bg-[#eef1f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <img
                  src={activeImage.src}
                  alt={activeImage.alt}
                  className="aspect-[4/3] w-full object-cover"
                  fetchPriority="high"
                />
              </button>
              {project.gallery.length > 1 ? (
                <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-5">
                  {project.gallery.map((image, index) => (
                    <button
                      type="button"
                      key={`${image.src}-${index}`}
                      onClick={() => setActiveIndex(index)}
                      aria-label={`Show ${project.name} image ${index + 1}`}
                      aria-pressed={activeIndex === index}
                      className={[
                        "overflow-hidden rounded-xl border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        activeIndex === index ? "border-primary" : "border-transparent",
                      ].join(" ")}
                    >
                      <img
                        src={image.src}
                        alt=""
                        className="aspect-square w-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="lg:sticky lg:top-28">
              <StatusBadge status={project.status} visualizationOnly={project.visualizationOnly} />
              <h1 className="mt-6 font-display text-5xl font-black uppercase leading-[0.9] tracking-[-0.045em] text-[#152238] sm:text-6xl">
                {project.name}
              </h1>
              <p className="mt-4 flex items-center gap-2 text-sm font-bold text-primary">
                <MapPin aria-hidden="true" size={18} />
                {project.location}
              </p>
              <p className="mt-7 text-base leading-8 text-[#5f6b78]">{project.description}</p>

              <ProjectSpecifications project={project} />

              <div className="mt-7 border-t border-border pt-6">
                <h2 className="text-sm font-extrabold uppercase tracking-[0.12em] text-[#152238]">
                  Project highlights
                </h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {project.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-start gap-3 text-sm leading-6 text-[#667085]"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                      />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to="/consultation"
                className="mt-8 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-primary px-6 text-sm font-extrabold uppercase tracking-[0.06em] text-white shadow-[0_16px_40px_rgba(244,81,30,0.2)]"
              >
                Discuss a similar project
                <ArrowRight aria-hidden="true" size={19} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-[#f7f8fa] py-16 sm:py-20">
        <div className="mx-auto w-full max-w-[1500px] px-6 sm:px-8 lg:px-14">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
                Continue exploring
              </p>
              <h2 className="mt-3 text-4xl font-extrabold tracking-[-0.035em] text-[#152238]">
                Related projects
              </h2>
            </div>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-sm font-extrabold text-primary"
            >
              View complete portfolio
              <ArrowRight aria-hidden="true" size={17} />
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                to="/projects/$slug"
                params={{ slug: item.slug }}
                className="group overflow-hidden rounded-2xl border border-border bg-white shadow-[0_12px_38px_rgba(21,34,56,0.055)]"
              >
                <img
                  src={item.cover.src}
                  alt={item.cover.alt}
                  className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-[1.025]"
                  loading="lazy"
                />
                <span className="block p-5">
                  <span className="block text-lg font-extrabold text-[#152238]">{item.name}</span>
                  <span className="mt-1 block text-sm font-semibold text-primary">
                    {item.location}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Lightbox
        images={project.gallery.map((image) => image.src)}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(-1)}
        onIndexChange={(index) => {
          setLightboxIndex(index);
          setActiveIndex(index);
        }}
        alt={`${project.name} project gallery`}
      />
    </main>
  );
}

function ProjectSpecifications({ project }: { project: ProjectRecord }) {
  const facts = [
    project.specifications.floorArea
      ? { label: "Floor area", value: project.specifications.floorArea, icon: Ruler }
      : null,
    project.specifications.bedrooms
      ? { label: "Bedrooms", value: String(project.specifications.bedrooms), icon: BedDouble }
      : null,
    project.specifications.bathrooms
      ? { label: "Bathrooms", value: String(project.specifications.bathrooms), icon: Bath }
      : null,
    project.specifications.carport
      ? { label: "Carport", value: project.specifications.carport, icon: CarFront }
      : null,
  ].filter((fact): fact is NonNullable<typeof fact> => Boolean(fact));

  return facts.length ? (
    <dl className="mt-8 grid grid-cols-2 gap-3">
      {facts.map(({ label, value, icon: Icon }) => (
        <div key={label} className="rounded-xl border border-border bg-[#f7f8fa] p-4">
          <Icon aria-hidden="true" size={19} className="text-primary" />
          <dt className="mt-4 text-[0.68rem] font-extrabold uppercase tracking-[0.1em] text-muted-foreground">
            {label}
          </dt>
          <dd className="mt-1 font-extrabold text-[#152238]">{value}</dd>
        </div>
      ))}
    </dl>
  ) : null;
}
