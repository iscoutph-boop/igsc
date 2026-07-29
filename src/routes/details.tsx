import { createFileRoute } from "@tanstack/react-router";
import { DetailsPage } from "@/features/details/details-page";

export const Route = createFileRoute("/details")({
  head: () => ({
    meta: [
      {
        title: "Services, Packages & Portfolio | IG Sabroso Construction",
      },
      {
        name: "description",
        content:
          "Explore IG Sabroso Construction services, finish packages, project portfolio, process, and price estimator across Cavite, Laguna, and Metro Manila.",
      },
      {
        property: "og:title",
        content: "IG Sabroso Construction | Services, Packages & Portfolio",
      },
      {
        property: "og:description",
        content:
          "Residential construction, renovation, civil works, finish packages, and verified project builds.",
      },
    ],
  }),
  component: DetailsPage,
});
