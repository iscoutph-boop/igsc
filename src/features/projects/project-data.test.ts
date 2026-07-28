import { access } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { projects } from "./project-data";

describe("verified project catalog", () => {
  it("contains the approved category totals", () => {
    expect(projects).toHaveLength(13);
    expect(projects.filter((item) => item.category === "completed")).toHaveLength(5);
    expect(projects.filter((item) => item.category === "ongoing")).toHaveLength(4);
    expect(projects.filter((item) => item.category === "design")).toHaveLength(4);
  });

  it("contains six accessible images per project", async () => {
    for (const project of projects) {
      expect(project.images).toHaveLength(6);
      for (const image of project.images) {
        expect(image.alt).toContain(project.name);
        await access(path.join(process.cwd(), "public", image.thumb.slice(1)));
        await access(path.join(process.cwd(), "public", image.full.slice(1)));
      }
    }
  });

  it("does not publish unverified location or description fields", () => {
    expect(
      projects.every((project) => !("location" in project) && !("description" in project)),
    ).toBe(true);
  });
});
