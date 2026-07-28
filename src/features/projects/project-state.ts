import type { Project, ProjectFilter } from "./project-data";

const validFilters = new Set<ProjectFilter>(["all", "completed", "ongoing", "design"]);

export function filterProjects(catalog: Project[], category: ProjectFilter): Project[] {
  return category === "all" ? catalog : catalog.filter((project) => project.category === category);
}

export function normalizeProjectSearch(search: Record<string, unknown>): {
  category: ProjectFilter;
  project?: string;
} {
  const category =
    typeof search.category === "string" && validFilters.has(search.category as ProjectFilter)
      ? (search.category as ProjectFilter)
      : "all";
  const project =
    typeof search.project === "string" && search.project.trim() ? search.project : undefined;
  return { category, project };
}
