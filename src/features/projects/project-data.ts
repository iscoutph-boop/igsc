export type ProjectCategory = "completed" | "ongoing" | "design";
export type ProjectFilter = "all" | ProjectCategory;

export type ProjectImage = {
  alt: string;
  full: string;
  thumb: string;
};

export type Project = {
  slug: string;
  name: string;
  category: ProjectCategory;
  statusLabel: string;
  images: ProjectImage[];
};

const makeImages = (slug: string, projectName: string): ProjectImage[] =>
  Array.from({ length: 6 }, (_, index) => {
    const number = String(index + 1).padStart(2, "0");
    return {
      alt: `${projectName} — image ${index + 1} of 6`,
      full: `/assets/projects/${slug}/large-${number}.webp`,
      thumb: `/assets/projects/${slug}/thumb-${number}.webp`,
    };
  });

const definitions = [
  ["alivio", "Alivio Project", "completed", "Completed Project"],
  ["bonus", "Bonus Project", "completed", "Completed Project"],
  ["gono", "Gono Project", "completed", "Completed Project"],
  ["obida", "Obida Project", "completed", "Completed Project"],
  ["zemke", "Zemke Project", "completed", "Completed Project"],
  ["alonzo", "Alonzo Project", "ongoing", "Ongoing Project"],
  ["amores", "Amores Project", "ongoing", "Ongoing Project"],
  ["francisco", "Francisco Project", "ongoing", "Ongoing Project"],
  ["kim", "Kim Project", "ongoing", "Ongoing Project"],
  ["grajo", "Grajo Project", "design", "Design Project"],
  ["laparan", "Laparan Project", "design", "Design Project"],
  ["wong", "Wong Project", "design", "Design Project"],
  ["yambao-condo", "Yambao Project (Condo)", "design", "Design Project"],
] as const;

export const projects: Project[] = definitions.map(([slug, name, category, statusLabel]) => ({
  slug,
  name,
  category,
  statusLabel,
  images: makeImages(slug, name),
}));

export const projectFilters = [
  { value: "all", label: "All Projects" },
  { value: "completed", label: "Completed Projects" },
  { value: "ongoing", label: "Ongoing Projects" },
  { value: "design", label: "Design Projects" },
] as const;
