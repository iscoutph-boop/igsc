import fResidenceAsset from "@/assets/proj-f-residence.jpg";
import iResidenceAsset from "@/assets/proj-i-residence.jpg";
import keystoneAsset from "@/assets/proj-keystone.jpg";
import lResidenceAsset from "@/assets/proj-l-residence.jpg";
import gonoDetail from "@/assets/real/gono-detail.webp";
import turnoverRibbon from "@/assets/real/turnover-ribbon.webp";
import turnoverHandover from "@/assets/real/turnover-handover.webp";

export type ProjectStatus = "completed" | "ongoing";
export type ProjectCategory = "residential" | "commercial" | "renovation" | "multi-unit";

export type ImageAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sourceFolder: string;
  approvedForPublicUse: boolean;
};

export type ProjectRecord = {
  slug: string;
  name: string;
  status: ProjectStatus;
  category: ProjectCategory;
  location: string;
  summary: string;
  description: string;
  specifications: {
    floorArea?: string;
    bedrooms?: number;
    bathrooms?: number;
    carport?: string;
  };
  highlights: readonly string[];
  cover: ImageAsset;
  gallery: readonly ImageAsset[];
  featured: boolean;
  visualizationOnly?: boolean;
};

const image = (
  src: string,
  alt: string,
  sourceFolder: string,
  width = 1600,
  height = 1067,
): ImageAsset => ({
  src,
  alt,
  width,
  height,
  sourceFolder,
  approvedForPublicUse: true,
});

const oResidenceCover = image(
  "/assets/projects/o-residence/thumbnail.jpg",
  "O Residence exterior photographed from the front gate",
  "Projects.zip / O Residence / Thumbnail.jpg",
);
const oResidenceGallery = [
  oResidenceCover,
  image(
    "/assets/projects/o-residence/exterior/ckr-2199-2-1.jpg",
    "O Residence exterior photographed from the front gate",
    "Projects.zip / O Residence / EXTERIOR / CKR_2199-2 (1).jpg",
  ),
  image(
    "/assets/projects/o-residence/interior/ckr-14.jpg",
    "O Residence interior photograph",
    "Projects.zip / O Residence / INTERIOR / CKR_-14.jpg",
  ),
  image(
    "/assets/projects/o-residence/interior/ckr-33.jpg",
    "O Residence interior photograph",
    "Projects.zip / O Residence / INTERIOR / CKR_-33.jpg",
  ),
  image(
    "/assets/projects/o-residence/interior/img-9373.jpg",
    "O Residence interior photograph",
    "Projects.zip / O Residence / INTERIOR / IMG_9373.JPG",
  ),
] as const;
const aResidenceCover = image(
  "/assets/projects/a-residence/thumbnail.jpg",
  "A Residence exterior photograph",
  "Projects.zip / A Residence / Thumbnail.jpg",
);
const aResidenceGallery = [
  aResidenceCover,
  image(
    "/assets/projects/a-residence/exterior/img-3902-dng-1.jpg",
    "A Residence exterior photograph",
    "Projects.zip / A Residence / EXTERIOR / IMG_3902.DNG (1).jpg",
  ),
  image(
    "/assets/projects/a-residence/exterior/img-3906-dng.jpg",
    "A Residence exterior photograph",
    "Projects.zip / A Residence / EXTERIOR / IMG_3906.DNG.jpg",
  ),
  image(
    "/assets/projects/a-residence/interior/20241127-142432.jpg",
    "A Residence interior photograph",
    "Projects.zip / A Residence / INTERIOR / 20241127_142432.jpg",
  ),
  image(
    "/assets/projects/a-residence/interior/6186221592237949530.jpg",
    "A Residence interior photograph",
    "Projects.zip / A Residence / INTERIOR / 6186221592237949530.jpg",
  ),
  image(
    "/assets/projects/a-residence/interior/img-1320.jpg",
    "A Residence interior photograph",
    "Projects.zip / A Residence / INTERIOR / IMG_1320.JPG",
  ),
] as const;
const gResidenceCover = image(
  gonoDetail,
  "Low-angle architectural detail of the completed G Residence with warm vertical cladding and broad roof overhangs",
  "Selected real projects / G Residence",
  2400,
  1600,
);
const gResidenceTurnover = image(
  turnoverRibbon,
  "IG Sabroso team and client during the completed residence ribbon-cutting turnover",
  "Groundbreaking and Turnover / G Residence",
  2400,
  1600,
);
const gResidenceHandover = image(
  turnoverHandover,
  "IG Sabroso project team presenting the ceremonial key during a residential handover",
  "Groundbreaking and Turnover / G Residence",
  2400,
  1600,
);
const iResidenceCover = image(
  iResidenceAsset,
  "Completed three-storey I Residence in Imus City with contemporary detailing",
  "Completed Projects / I Residence",
);
const lResidenceCover = image(
  lResidenceAsset,
  "Renovated L Residence in Pasig City with a refined contemporary exterior",
  "Completed Projects / L Residence",
);
const townhouseProjectCover = image(
  "/assets/projects/townhouse-project/thumbnail.webp",
  "Townhouse Project exterior photograph",
  "Projects.zip / Townhouse Project / Thumbnail.png",
);
const townhouseProjectGallery = [
  townhouseProjectCover,
  image(
    "/assets/projects/townhouse-project/exterior/img-5661.jpg",
    "Townhouse Project exterior photograph",
    "Projects.zip / Townhouse Project / Exterior / IMG_5661.JPG",
  ),
  image(
    "/assets/projects/townhouse-project/exterior/img-5686.jpg",
    "Townhouse Project exterior photograph",
    "Projects.zip / Townhouse Project / Exterior / IMG_5686.JPG",
  ),
  image(
    "/assets/projects/townhouse-project/exterior/img-5691-1.jpg",
    "Townhouse Project exterior photograph",
    "Projects.zip / Townhouse Project / Exterior / IMG_5691 (1).JPG",
  ),
  image(
    "/assets/projects/townhouse-project/interior/img-5673.jpg",
    "Townhouse Project interior photograph",
    "Projects.zip / Townhouse Project / Interior / IMG_5673.JPG",
  ),
  image(
    "/assets/projects/townhouse-project/interior/img-5778.jpg",
    "Townhouse Project interior photograph",
    "Projects.zip / Townhouse Project / Interior / IMG_5778.JPG",
  ),
  image(
    "/assets/projects/townhouse-project/interior/img-5786.jpg",
    "Townhouse Project interior photograph",
    "Projects.zip / Townhouse Project / Interior / IMG_5786.JPG",
  ),
] as const;
const keystoneCover = image(
  keystoneAsset,
  "Keystone Building three-storey commercial development in Dasmarinas City",
  "Completed Projects / Keystone Building",
);
const fResidenceCover = image(
  fResidenceAsset,
  "Architectural visualization of the ongoing F Residence on a sloping site in Silang, Cavite",
  "Ongoing Projects / F Residence",
);

export const PROJECTS: readonly ProjectRecord[] = [
  {
    slug: "o-residence",
    name: "O Residence",
    status: "completed",
    category: "residential",
    location: "Dasmarinas City, Cavite",
    summary:
      "A bold two-storey home designed around openness, natural light, and structured modern volumes.",
    description:
      "A 174 sqm two-storey residence with a classic space-planning approach. Strong geometric volumes and a high-ceiling living area create a confident architectural presence while keeping everyday family spaces practical and connected.",
    specifications: { floorArea: "174 sqm", bedrooms: 5, bathrooms: 5, carport: "2 vehicles" },
    highlights: [
      "High-ceiling living area",
      "Kitchen and service kitchen",
      "Home office",
      "Completed residence",
    ],
    cover: oResidenceCover,
    gallery: oResidenceGallery,
    featured: true,
  },
  {
    slug: "a-residence-imus",
    name: "A Residence",
    status: "completed",
    category: "residential",
    location: "Imus City, Cavite",
    summary: "Efficient modern living across a compact and distinctive 125 sqm footprint.",
    description:
      "A two-storey modern contemporary residence defined by clean lines, layered volumes, and a balanced mix of glass and warm accent materials. The layout maximizes comfort and function despite the compact site geometry.",
    specifications: { floorArea: "125 sqm", bedrooms: 3, bathrooms: 4, carport: "2 vehicles" },
    highlights: [
      "Living and dining areas",
      "Efficient space planning",
      "Warm accent materials",
      "Completed residence",
    ],
    cover: aResidenceCover,
    gallery: aResidenceGallery,
    featured: true,
  },
  {
    slug: "g-residence",
    name: "G Residence",
    status: "completed",
    category: "residential",
    location: "Imus City, Cavite",
    summary:
      "A warm contemporary home with generous roof lines and a connected open-plan interior.",
    description:
      "A two-storey modern contemporary residence featuring an open-plan layout that connects the main living spaces. Warm vertical cladding, wide roof overhangs, and expansive glazing create a balanced and functional design.",
    specifications: { bedrooms: 3, bathrooms: 3, carport: "1 vehicle" },
    highlights: [
      "Open-plan living",
      "Home office",
      "Wide roof overhangs",
      "Client turnover completed",
    ],
    cover: gResidenceCover,
    gallery: [gResidenceCover, gResidenceTurnover, gResidenceHandover],
    featured: false,
  },
  {
    slug: "i-residence",
    name: "I Residence",
    status: "completed",
    category: "residential",
    location: "Imus City, Cavite",
    summary:
      "A technology-ready three-storey home with premium finishes and a refined material palette.",
    description:
      "A 222 sqm three-storey modern contemporary residence distinguished by exposed brick, a predominantly white interior palette, premium materials, and integrated smart-home provisions.",
    specifications: { floorArea: "222 sqm", bedrooms: 6, bathrooms: 5, carport: "1 vehicle" },
    highlights: [
      "Two living areas",
      "Kitchen and service kitchen",
      "Smart-home provisions",
      "Completed residence",
    ],
    cover: iResidenceCover,
    gallery: [iResidenceCover],
    featured: false,
  },
  {
    slug: "l-residence",
    name: "L Residence",
    status: "completed",
    category: "renovation",
    location: "Pasig City",
    summary: "A premium renovation with a dark Japanese-inspired interior direction.",
    description:
      "A three-storey renovation transformed into a modern contemporary residence. The project focused on interior design services and selected execution works using premium materials and a calm, Japanese-inspired character.",
    specifications: { carport: "2 vehicles" },
    highlights: [
      "Two living areas",
      "Office and jacuzzi",
      "Primary bedroom suite",
      "Selected execution works",
    ],
    cover: lResidenceCover,
    gallery: [lResidenceCover],
    featured: false,
  },
  {
    slug: "townhouse-project",
    name: "Townhouse Project",
    status: "completed",
    category: "multi-unit",
    location: "Selected real project",
    summary:
      "A completed IG Sabroso project documented with supplied exterior and interior photography.",
    description:
      "Townhouse Project is presented through the supplied exterior and interior project photography.",
    specifications: {},
    highlights: ["Exterior photography", "Interior photography", "Completed project"],
    cover: townhouseProjectCover,
    gallery: townhouseProjectGallery,
    featured: true,
  },
  {
    slug: "keystone-building",
    name: "Keystone Building",
    status: "completed",
    category: "commercial",
    location: "Dasmarinas City, Cavite",
    summary: "A three-storey commercial building planned for six flexible business units.",
    description:
      "A modern contemporary commercial building designed to accommodate six units, including two full-floor spaces and four smaller business units. Clean architectural lines and exposed-brick accents create a professional street presence.",
    specifications: { bathrooms: 3, carport: "2 vehicles" },
    highlights: [
      "Six commercial units",
      "Two full-floor spaces",
      "Flexible small-business units",
      "Completed commercial project",
    ],
    cover: keystoneCover,
    gallery: [keystoneCover],
    featured: false,
  },
  {
    slug: "f-residence",
    name: "F Residence",
    status: "ongoing",
    category: "residential",
    location: "Silang, Cavite",
    summary: "A multi-level Bali-inspired residence designed in response to a steep site.",
    description:
      "An ongoing 232 sqm residence that responds to the site's slope through a carefully balanced multi-level plan. The design uses premium materials and orientation strategies to maximize daylight and scenic views.",
    specifications: { floorArea: "232 sqm", bedrooms: 6, bathrooms: 7, carport: "2 vehicles" },
    highlights: [
      "Multi-level planning",
      "Bali-inspired direction",
      "Scenic-view orientation",
      "Ongoing project",
    ],
    cover: fResidenceCover,
    gallery: [fResidenceCover],
    featured: false,
    visualizationOnly: true,
  },
] as const;

export const PROJECT_CATEGORIES = [
  { value: "all", label: "All" },
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "renovation", label: "Renovation" },
  { value: "multi-unit", label: "Multi-unit" },
  { value: "completed", label: "Completed" },
  { value: "ongoing", label: "Ongoing" },
] as const;

export function getProjectBySlug(slug: string) {
  return PROJECTS.find((project) => project.slug === slug);
}

export function getRelatedProjects(project: ProjectRecord, limit = 3) {
  return PROJECTS.filter((candidate) => candidate.slug !== project.slug)
    .slice()
    .sort((first, second) => {
      const firstScore =
        Number(first.category === project.category) + Number(first.status === project.status);
      const secondScore =
        Number(second.category === project.category) + Number(second.status === project.status);
      return secondScore - firstScore;
    })
    .slice(0, limit);
}
