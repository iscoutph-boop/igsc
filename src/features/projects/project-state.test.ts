import { describe, expect, it } from "vitest";
import { projects } from "./project-data";
import { filterProjects, normalizeProjectSearch } from "./project-state";

describe("project state", () => {
  it("filters by category", () => {
    expect(filterProjects(projects, "completed")).toHaveLength(5);
    expect(filterProjects(projects, "ongoing")).toHaveLength(4);
    expect(filterProjects(projects, "design")).toHaveLength(4);
    expect(filterProjects(projects, "all")).toHaveLength(13);
  });

  it("normalizes unknown URL values", () => {
    expect(normalizeProjectSearch({ category: "other", project: 42 })).toEqual({
      category: "all",
      project: undefined,
    });
  });

  it("preserves valid category and slug values", () => {
    expect(normalizeProjectSearch({ category: "design", project: "wong" })).toEqual({
      category: "design",
      project: "wong",
    });
  });
});
