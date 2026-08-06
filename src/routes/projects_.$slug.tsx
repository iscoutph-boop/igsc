import { createFileRoute, notFound } from "@tanstack/react-router";
import { ProjectDetailPage } from "@/features/projects/project-detail-page";
import { getProjectBySlug } from "@/content/projects";
import { buildCanonicalUrl, DEFAULT_SOCIAL_IMAGE } from "@/lib/seo";

export const Route = createFileRoute("/projects_/$slug")({
  loader: ({ params }) => {
    const project = getProjectBySlug(params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    const project = loaderData?.project;
    if (!project) return {};
    return {
      meta: [
        { title: `${project.name} | IG Sabroso Construction` },
        { name: "description", content: project.summary },
        { property: "og:title", content: `${project.name} | IG Sabroso Construction` },
        { property: "og:description", content: project.summary },
        { property: "og:url", content: buildCanonicalUrl(`/projects/${project.slug}`) },
        { property: "og:image", content: DEFAULT_SOCIAL_IMAGE },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: buildCanonicalUrl(`/projects/${project.slug}`) }],
    };
  },
  component: ProjectRouteComponent,
});

function ProjectRouteComponent() {
  const { project } = Route.useLoaderData();
  return <ProjectDetailPage project={project} />;
}
