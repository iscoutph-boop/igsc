import { createFileRoute } from "@tanstack/react-router";
// MAINTENANCE MODE: the original homepage lives in "@/features/home/home-page" (HomePage)
// and is untouched. To restore it, import HomePage again and set `component: HomePage`,
// then revert the head() meta below to the original title/description.
// import { HomePage } from "@/features/home/home-page";
import { MaintenancePage } from "@/features/maintenance/maintenance-page";
import { DEFAULT_SOCIAL_IMAGE, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Website Update | IG Sabroso Construction" },
      {
        name: "description",
        content:
          "IG Sabroso Construction is currently updating its website to provide an improved online experience. Contact us for inquiries and consultations.",
      },
      { property: "og:title", content: "Website Update | IG Sabroso Construction" },
      {
        property: "og:description",
        content:
          "IG Sabroso Construction is currently updating its website to provide an improved online experience. Contact us for inquiries and consultations.",
      },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: DEFAULT_SOCIAL_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
  }),
  component: MaintenancePage,
});
