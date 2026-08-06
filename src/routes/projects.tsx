import { createFileRoute } from "@tanstack/react-router";
import { ProjectsPage } from "@/features/projects/projects-page";
import { buildCanonicalUrl, DEFAULT_SOCIAL_IMAGE } from "@/lib/seo";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Selected Projects | IG Sabroso Construction" },
      {
        name: "description",
        content:
          "Explore selected completed and ongoing residential, renovation, multi-unit, and commercial projects by IG Sabroso Construction.",
      },
      { property: "og:title", content: "Selected Projects | IG Sabroso Construction" },
      { property: "og:url", content: buildCanonicalUrl("/projects") },
      {
        property: "og:description",
        content:
          "Real IG Sabroso projects built through clear planning, quality construction, and dependable delivery.",
      },
      { property: "og:image", content: DEFAULT_SOCIAL_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: buildCanonicalUrl("/projects") }],
  }),
  component: ProjectsPage,
});
