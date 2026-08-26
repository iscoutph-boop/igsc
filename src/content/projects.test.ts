import { describe, expect, it } from "vitest";
import { PROJECTS, getProjectBySlug } from "./projects";

describe("PROJECTS", () => {
  it("contains a curated public portfolio with unique project routes", () => {
    expect(PROJECTS.length).toBeGreaterThanOrEqual(6);
    expect(PROJECTS.length).toBeLessThanOrEqual(8);
    expect(new Set(PROJECTS.map((project) => project.slug)).size).toBe(PROJECTS.length);

    for (const project of PROJECTS) {
      expect(project.slug).toMatch(/^[a-z0-9-]+$/);
      expect(project.cover.alt.length).toBeGreaterThan(12);
      expect(project.gallery.length).toBeGreaterThan(0);
      expect(project.gallery.every((image) => image.approvedForPublicUse)).toBe(true);

      if (project.status === "ongoing") {
        expect(project.visualizationOnly).toBe(true);
      }
    }
  });

  it("finds a project by its shareable slug", () => {
    expect(getProjectBySlug("o-residence")?.name).toBe("O Residence");
    expect(getProjectBySlug("missing-project")).toBeUndefined();
  });

  it("uses the supplied project folders and thumbnail files for selected real projects", () => {
    const selectedProjects = PROJECTS.filter((project) => project.featured);

    expect(selectedProjects.map((project) => project.name)).toEqual([
      "O Residence",
      "A Residence",
      "Townhouse Project",
    ]);
    expect(selectedProjects.map((project) => project.cover.src)).toEqual([
      "/assets/projects/o-residence/thumbnail.jpg",
      "/assets/projects/a-residence/thumbnail.jpg",
      "/assets/projects/townhouse-project/thumbnail.png",
    ]);
    expect(getProjectBySlug("townhouse-project")?.gallery.length).toBe(7);
  });
});
