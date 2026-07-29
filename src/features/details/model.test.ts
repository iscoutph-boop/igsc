import { describe, expect, it } from "vitest";
import { calculateEstimate, filterProjects, validateEstimate } from "./model";
import type { Project } from "./types";

const projects: Project[] = [
  {
    id: "a",
    title: "A Residence",
    status: "Completed",
    type: "Residential",
    location: "Imus City, Cavite",
    description: "Family home",
    highlights: [],
    number: "01",
    img: "/a.jpg",
  },
  {
    id: "b",
    title: "Keystone Building",
    status: "Ongoing",
    type: "Commercial",
    location: "Dasmarinas City, Cavite",
    description: "Commercial build",
    highlights: [],
    number: "07",
    img: "/b.jpg",
  },
];

describe("filterProjects", () => {
  it("filters by status and a case-insensitive location query", () => {
    expect(
      filterProjects(projects, "Completed", "imus", "latest").map((project) => project.id),
    ).toEqual(["a"]);
  });

  it("sorts latest projects by descending project number", () => {
    expect(filterProjects(projects, "All", "", "latest").map((project) => project.id)).toEqual([
      "b",
      "a",
    ]);
  });
});

describe("estimate model", () => {
  it("returns field errors until the required project inputs are valid", () => {
    expect(
      validateEstimate({
        projectType: "",
        location: "",
        floors: 0,
        area: 0,
        packageType: "",
        bedrooms: 4,
        bathrooms: 3,
        site: "",
        addons: [],
      }),
    ).toEqual({
      projectType: "Please select a project type.",
      location: "Please enter your project location.",
      floors: "Please select the number of floors.",
      area: "Minimum floor area is 10 sqm.",
      packageType: "Please select a finish package.",
    });
  });

  it("returns a transparent range from area and package rates", () => {
    expect(
      calculateEstimate({
        projectType: "Residential",
        location: "Imus City, Cavite",
        floors: 2,
        area: 100,
        packageType: "Elegant",
        bedrooms: 4,
        bathrooms: 3,
        site: "Flat lot",
        addons: [],
      }),
    ).toEqual({ low: 4_000_000, high: 4_500_000 });
  });
});
