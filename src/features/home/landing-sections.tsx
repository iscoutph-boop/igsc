import { Link } from "@tanstack/react-router";
import { projects } from "@/features/projects/project-data";
import { processSteps, services } from "./home-content";

const featuredProjectSpecs = [
  { slug: "gono", width: 640, height: 360 },
  { slug: "obida", width: 640, height: 427 },
  { slug: "alivio", width: 640, height: 480 },
] as const;

const featuredProjects = featuredProjectSpecs.map(({ slug, width, height }) => {
  const project = projects.find((item) => item.slug === slug);
  if (!project) {
    throw new Error(`Missing verified featured project: ${slug}`);
  }

  return { project, width, height };
});

export function LandingSections() {
  return (
    <>
      <section
        id="about"
        aria-labelledby="about-heading"
        className="landing-section editorial-shell border-b border-border"
      >
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-20">
          <div>
            <p className="editorial-eyebrow">About IG Sabroso</p>
            <h2
              id="about-heading"
              className="mt-5 max-w-xl text-4xl font-black leading-[1.02] tracking-[-0.045em] sm:text-5xl lg:text-6xl"
            >
              Building the future with quality and trust.
            </h2>
          </div>
          <div className="flex items-end">
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl sm:leading-9">
              Elevate Your Lifestyle. Built on trust, driven by excellence.
            </p>
          </div>
        </div>
      </section>

      <section
        id="services"
        aria-labelledby="services-heading"
        className="landing-section editorial-shell"
      >
        <div className="mb-12 grid gap-5 border-b border-foreground/20 pb-8 md:grid-cols-2 md:items-end">
          <div>
            <p className="editorial-eyebrow">What we build</p>
            <h2
              id="services-heading"
              className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl"
            >
              Services
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-muted-foreground md:justify-self-end">
            Built to last with craftsmanship and care.
          </p>
        </div>

        <ol className="border-b border-border">
          {services.map(([title, description], index) => (
            <li
              key={title}
              className="grid gap-4 border-t border-border py-7 sm:grid-cols-[4rem_minmax(0,0.8fr)_minmax(0,1fr)] sm:items-baseline sm:gap-8"
            >
              <span className="font-display text-xs font-semibold tracking-[0.2em] text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-xl font-bold tracking-[-0.025em] sm:text-2xl">{title}</h3>
              <p className="max-w-xl leading-7 text-muted-foreground">{description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section
        id="projects-preview"
        aria-labelledby="projects-preview-heading"
        className="landing-section bg-foreground text-background"
      >
        <div className="editorial-shell">
          <div className="mb-10 flex flex-col gap-6 border-b border-background/20 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="editorial-eyebrow text-primary">Selected work</p>
              <h2
                id="projects-preview-heading"
                className="mt-4 max-w-3xl text-4xl font-black tracking-[-0.045em] sm:text-5xl lg:text-6xl"
              >
                Featured projects
              </h2>
            </div>
            <Link
              to="/projects"
              className="inline-flex min-h-11 shrink-0 items-center border-b border-primary pb-1 text-sm font-bold text-background transition-colors hover:text-primary"
            >
              Explore all projects
            </Link>
          </div>

          <div className="grid gap-5 lg:grid-cols-12">
            {featuredProjects.map(({ project, width, height }, index) => {
              const cover = project.images[0];
              return (
                <figure
                  key={project.slug}
                  className={
                    index === 0
                      ? "group grid grid-rows-[auto_auto] lg:col-span-7 lg:row-span-2 lg:grid-rows-[minmax(0,1fr)_auto]"
                      : "group lg:col-span-5"
                  }
                >
                  <div
                    className={
                      index === 0
                        ? "media-fallback aspect-[4/3] overflow-hidden bg-background/10 lg:aspect-auto lg:h-full lg:min-h-0"
                        : "media-fallback aspect-[4/3] overflow-hidden bg-background/10 lg:aspect-[16/9]"
                    }
                  >
                    <img
                      src={cover.thumb}
                      alt={cover.alt}
                      width={width}
                      height={height}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                  <figcaption className="flex items-baseline justify-between gap-4 border-t border-background/20 py-4">
                    <span className="font-display text-xl font-bold">{project.name}</span>
                    <span className="text-xs uppercase tracking-[0.18em] text-background/60">
                      {project.statusLabel}
                    </span>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="process"
        aria-labelledby="process-heading"
        className="landing-section editorial-shell"
      >
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,1.38fr)] lg:gap-20">
          <div>
            <p className="editorial-eyebrow">How we work</p>
            <h2
              id="process-heading"
              className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl"
            >
              Our process
            </h2>
          </div>
          <ol className="border-b border-foreground/20">
            {processSteps.map(([number, title, description]) => (
              <li
                key={number}
                className="grid gap-3 border-t border-foreground/20 py-7 sm:grid-cols-[4rem_minmax(0,0.7fr)_minmax(0,1fr)] sm:items-baseline sm:gap-7"
              >
                <span className="font-display text-xs font-semibold tracking-[0.2em] text-primary">
                  {number}
                </span>
                <h3 className="text-xl font-bold sm:text-2xl">{title}</h3>
                <p className="leading-7 text-muted-foreground">{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        aria-labelledby="consultation-heading"
        className="editorial-shell pb-8 pt-6 sm:pb-12"
      >
        <div className="bg-foreground px-6 py-12 text-background sm:px-10 sm:py-16 lg:px-16">
          <p className="editorial-eyebrow text-primary">Start a conversation</p>
          <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <h2
              id="consultation-heading"
              className="max-w-4xl text-4xl font-black leading-[1.04] tracking-[-0.045em] sm:text-5xl"
            >
              Build with confidence — build with Sabroso.
            </h2>
            <Link
              to="/consultation"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-7 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Book a consultation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
