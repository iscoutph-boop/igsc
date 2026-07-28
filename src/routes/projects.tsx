import { createFileRoute } from "@tanstack/react-router";
import { ProjectsPage } from "@/features/projects/projects-page";
import type { ProjectFilter } from "@/features/projects/project-data";
import { normalizeProjectSearch } from "@/features/projects/project-state";

export const Route = createFileRoute("/projects")({
  validateSearch: normalizeProjectSearch,
  head: () => ({
    meta: [
      { title: "Projects — IG Sabroso Construction" },
      {
        name: "description",
        content:
          "Browse verified completed, ongoing, and design projects from IG Sabroso Construction.",
      },
    ],
  }),
  component: ProjectsRoute,
});

function ProjectsRoute() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const handleCategoryChange = (category: ProjectFilter) => {
    void navigate({
      search: {
        category,
        project: undefined,
      },
    });
  };

  const handleProjectSelect = (project?: string) => {
    void navigate({
      search: {
        category: search.category,
        project,
      },
    });
  };

  return (
    <ProjectsPage
      category={search.category}
      selectedSlug={search.project}
      onCategoryChange={handleCategoryChange}
      onProjectSelect={handleProjectSelect}
    />
  );
}
