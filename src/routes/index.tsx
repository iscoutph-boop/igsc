import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/features/home/home-page";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IG Sabroso Construction | Your Dependable Building Partner" },
      {
        name: "description",
        content:
          "Premium construction, renovation, and civil works in Dasmarinas, Cavite. Build with confidence. Build with Sabroso.",
      },
      {
        property: "og:title",
        content: "IG Sabroso Construction | Your Dependable Building Partner",
      },
      {
        property: "og:description",
        content:
          "Premium construction, renovation, and civil works in Dasmarinas, Cavite. Build with confidence. Build with Sabroso.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});
