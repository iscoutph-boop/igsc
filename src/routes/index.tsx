import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/features/home/home-page";
import { getMaintenanceAwareTitle } from "@/features/maintenance/maintenance-mode";
import { DEFAULT_SOCIAL_IMAGE, SITE_URL } from "@/lib/seo";

const ROUTE_TITLE = getMaintenanceAwareTitle(
  "IG Sabroso Construction | Build with Confidence",
  import.meta.env.VITE_MAINTENANCE_MODE,
  import.meta.env.MODE,
);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: ROUTE_TITLE },
      {
        name: "description",
        content:
          "Explore selected real projects and dependable general contracting, design-build, construction management, and renovation services in Cavite and nearby areas.",
      },
      { property: "og:title", content: "IG Sabroso Construction | Build with Confidence" },
      {
        property: "og:description",
        content:
          "Quality construction, transparent coordination, and a clear path from consultation to turnover.",
      },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: DEFAULT_SOCIAL_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
  }),
  component: HomePage,
});
