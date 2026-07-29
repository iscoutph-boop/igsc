import type {
  EstimateErrors,
  EstimateInput,
  EstimateResult,
  PackageType,
  Project,
  ProjectFilter,
  ProjectSort,
} from "./types";

export const PACKAGE_RATES: Record<PackageType, readonly [number, number]> = {
  Standard: [30_000, 34_000],
  "Semi-Elegant": [35_000, 39_000],
  Elegant: [40_000, 45_000],
  Luxury: [50_000, 55_000],
};

export function filterProjects(
  projects: readonly Project[],
  filter: ProjectFilter,
  query: string,
  sort: ProjectSort,
): Project[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  const filtered = projects.filter((project) => {
    const matchesFilter = filter === "All" || project.status === filter || project.type === filter;

    if (!matchesFilter) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return [project.title, project.location, project.type, project.status].some((value) =>
      value.toLocaleLowerCase().includes(normalizedQuery),
    );
  });

  return filtered.toSorted((first, second) => {
    if (sort === "name") {
      return first.title.localeCompare(second.title);
    }

    if (sort === "completed" && first.status !== second.status) {
      return first.status === "Completed" ? -1 : 1;
    }

    if (sort === "ongoing" && first.status !== second.status) {
      return first.status === "Ongoing" ? -1 : 1;
    }

    return Number(second.number) - Number(first.number);
  });
}

export function validateEstimate(input: EstimateInput): EstimateErrors {
  const errors: EstimateErrors = {};

  if (!input.projectType.trim()) {
    errors.projectType = "Please select a project type.";
  }

  if (!input.location.trim()) {
    errors.location = "Please enter your project location.";
  }

  if (input.floors < 1) {
    errors.floors = "Please select the number of floors.";
  }

  if (input.area < 10) {
    errors.area = "Minimum floor area is 10 sqm.";
  }

  if (!input.packageType) {
    errors.packageType = "Please select a finish package.";
  }

  return errors;
}

export function calculateEstimate(input: EstimateInput): EstimateResult | null {
  if (Object.keys(validateEstimate(input)).length > 0 || !input.packageType) {
    return null;
  }

  const [lowRate, highRate] = PACKAGE_RATES[input.packageType];

  return {
    low: input.area * lowRate,
    high: input.area * highRate,
  };
}
