import { createFileRoute } from "@tanstack/react-router";
import { DetailsPage } from "@/features/details/details-page";
import { buildCanonicalUrl, DEFAULT_SOCIAL_IMAGE } from "@/lib/seo";

export const Route = createFileRoute("/details")({
  head: () => ({
    meta: [
      { title: "About, Services and Process | IG Sabroso Construction" },
      {
        name: "description",
        content:
          "Learn about IG Sabroso Construction, its core services, project process, verified client reviews, and contact information.",
      },
      { property: "og:title", content: "About and Services | IG Sabroso Construction" },
      {
        property: "og:description",
        content:
          "A dependable construction partner built on clear collaboration, skilled workmanship, and client-focused delivery.",
      },
      { property: "og:url", content: buildCanonicalUrl("/details") },
      { property: "og:image", content: DEFAULT_SOCIAL_IMAGE },
    ],
    links: [{ rel: "canonical", href: buildCanonicalUrl("/details") }],
  }),
  component: DetailsPage,
});
