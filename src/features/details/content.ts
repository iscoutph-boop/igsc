import type { LucideIcon } from "lucide-react";
import {
  Box,
  CheckCircle2,
  Compass,
  Hammer,
  HardHat,
  Home,
  PencilRuler,
  Ruler,
  Wrench,
} from "lucide-react";
import aResidenceAsset from "@/assets/proj-a-residence.jpg";
import oResidenceAsset from "@/assets/proj-o-residence.jpg";
import iResidenceAsset from "@/assets/proj-i-residence.jpg";
import lResidenceAsset from "@/assets/proj-l-residence.jpg";
import bApartmentAsset from "@/assets/proj-b-apartment.jpg";
import keystoneAsset from "@/assets/proj-keystone.jpg";
import fResidenceAsset from "@/assets/proj-f-residence.jpg";
import igs1Asset from "@/assets/igs-1.jpg";
import igs2Asset from "@/assets/igs-2.jpg";
import igs3Asset from "@/assets/igs-3.jpg";
import igs4Asset from "@/assets/igs-4.jpg";
import igs6Asset from "@/assets/igs-6.jpg";
import igs7Asset from "@/assets/igs-7.jpg";
import igs8Asset from "@/assets/igs-8.jpg";
import igs9Asset from "@/assets/igs-9.jpg";
import meeting1Asset from "@/assets/meeting-472871.jpg";
import meeting2Asset from "@/assets/meeting-615890.jpg";
import meeting3Asset from "@/assets/meeting-616099.jpg";
import meeting4Asset from "@/assets/meeting-619956.jpg";
import meeting5Asset from "@/assets/meeting-622434.jpg";
import meeting6Asset from "@/assets/meeting-626269.jpg";
import meeting7Asset from "@/assets/meeting-628710.jpg";
import carousel1Asset from "@/assets/carousel-1.jpg";
import carousel2Asset from "@/assets/carousel-2.jpg";
import carousel3Asset from "@/assets/carousel-3.jpg";
import carousel4Asset from "@/assets/carousel-4.jpg";
import carousel5Asset from "@/assets/carousel-5.jpg";
import miniPreview1Asset from "@/assets/mini-preview-1.png";
import miniPreview2Asset from "@/assets/mini-preview-2.png";
import miniPreview3Asset from "@/assets/mini-preview-3.png";
import miniPreview4Asset from "@/assets/mini-preview-4.png";
import type { PackageType, Project, ProjectFilter } from "./types";

export type Service = {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  icon: LucideIcon;
};

export type FinishPackage = {
  type: PackageType;
  name: string;
  price: string;
  note: string;
  recommendation?: string;
  groups: {
    title: string;
    items: string[];
  }[];
};

export type Testimonial = {
  name: string;
  project: string;
  location: string;
  rating: number;
  quote: string;
};

export type ProcessStep = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  outcomes: string[];
};

const slugify = (value: string) =>
  `service-${value
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")}`;

export const aboutSlides = [
  carousel1Asset,
  carousel2Asset,
  carousel3Asset,
  carousel4Asset,
  carousel5Asset,
];

export const aboutPreviewImages = [
  miniPreview1Asset,
  miniPreview2Asset,
  miniPreview3Asset,
  miniPreview4Asset,
];

export const projectGalleryPool = [
  igs1Asset,
  igs2Asset,
  igs3Asset,
  igs4Asset,
  igs6Asset,
  igs7Asset,
  igs8Asset,
  igs9Asset,
];

export const meetingImages = [
  {
    src: meeting1Asset,
    alt: "IG Sabroso team and clients gathered for a design review",
    caption: "Design review with the client team",
  },
  {
    src: meeting5Asset,
    alt: "Project consultation around a meeting table",
    caption: "Project consultation",
  },
  {
    src: meeting3Asset,
    alt: "IG Sabroso team reviewing materials with clients",
    caption: "Materials review",
  },
  {
    src: meeting4Asset,
    alt: "Client and IG Sabroso team at a turnover planning meeting",
    caption: "Turnover planning",
  },
  {
    src: meeting2Asset,
    alt: "IG Sabroso team meeting with a client",
    caption: "Client alignment",
  },
  {
    src: meeting6Asset,
    alt: "Construction planning session with the IG Sabroso team",
    caption: "Construction planning",
  },
  {
    src: meeting7Asset,
    alt: "Project presentation with clients and the IG Sabroso team",
    caption: "Project presentation",
  },
];

export const services: Service[] = [
  {
    icon: Home,
    title: "Residential Construction",
    description: "Custom homes built to last with craftsmanship and care.",
    longDescription:
      "From new builds to expansions, we deliver residential projects that combine durable materials, careful space planning, and precise construction around how your family lives.",
  },
  {
    icon: Wrench,
    title: "Renovation & Remodeling",
    description: "Reimagine your space with modern, functional upgrades.",
    longDescription:
      "Full and partial remodels, kitchen and bath updates, room conversions, and modernization works delivered cleanly and with minimal disruption.",
  },
  {
    icon: HardHat,
    title: "Civil Works",
    description: "Reliable infrastructure for roads, drainage, and foundations.",
    longDescription:
      "Site development, foundations, drainage, retaining walls, and roadworks built to engineering specifications for residential and commercial projects.",
  },
  {
    icon: Ruler,
    title: "Design-Build Services",
    description: "One team from concept to handover.",
    longDescription:
      "Architecture, engineering, and construction under one accountable team, with one contract and one coordinated timeline.",
  },
  {
    icon: Compass,
    title: "Construction Management",
    description: "Timelines, budgets, and quality kept on track.",
    longDescription:
      "Project oversight, scheduling, cost control, subcontractor coordination, quality assurance, and clear progress reporting.",
  },
  {
    icon: PencilRuler,
    title: "Architectural Drawings",
    description: "Precise, code-ready plans tailored to your vision.",
    longDescription:
      "Concept design, floor plans, elevations, working drawings, and permit-ready documentation prepared to local codes.",
  },
  {
    icon: Box,
    title: "3D Rendering & Visualization",
    description: "See your project in lifelike detail before construction begins.",
    longDescription:
      "Photorealistic interior and exterior renders, walkthrough animations, and material studies help you review the design before construction.",
  },
].map((service) => ({
  ...service,
  id: slugify(service.title),
}));

export const finishPackages: FinishPackage[] = [
  {
    type: "Standard",
    name: "Standard Finish",
    price: "PHP 30,000 - PHP 34,000",
    note: "per square meter",
    groups: [
      {
        title: "Structure",
        items: [
          "Standard structural works",
          "CHB walls with plaster finish",
          "Steel roof frame",
          "Ribbed metal roofing",
          "Septic tank system",
        ],
      },
      {
        title: "Systems",
        items: [
          "Standard electrical system",
          "Standard plumbing system",
          "Waterline provision",
          "Basic fixtures",
          "Painted interior walls",
        ],
      },
      {
        title: "Finishes",
        items: [
          "Quality basic finishes",
          "Essential floor tiles",
          "Tiled toilet and bath",
          "Aluminum windows",
          "Standard cabinetry",
        ],
      },
    ],
  },
  {
    type: "Semi-Elegant",
    name: "Semi-Elegant Finish",
    price: "PHP 35,000 - PHP 39,000",
    note: "per square meter",
    recommendation: "Popular pick",
    groups: [
      {
        title: "Structure",
        items: [
          "Reinforced structural works",
          "CHB walls with smooth finish",
          "Upgraded roof system",
          "Waterproofing provision",
          "Septic tank system",
        ],
      },
      {
        title: "Systems",
        items: [
          "Upgraded electrical system",
          "Upgraded plumbing system",
          "Waterline provision",
          "Quality fixtures",
          "Ceiling detail provision",
        ],
      },
      {
        title: "Finishes",
        items: [
          "Upgraded floor and wall tiles",
          "Accent wall provision",
          "Quality cabinetry",
          "Aluminum windows",
          "Painted interior walls",
        ],
      },
    ],
  },
  {
    type: "Elegant",
    name: "Elegant Finish",
    price: "PHP 40,000 - PHP 45,000",
    note: "per square meter",
    recommendation: "Most recommended",
    groups: [
      {
        title: "Structure",
        items: [
          "Reinforced concrete frame",
          "CHB walls with plaster finish",
          "Steel roof frame",
          "Ribbed metal roofing",
          "Septic tank system",
        ],
      },
      {
        title: "Systems",
        items: [
          "Complete electrical system",
          "Complete plumbing system",
          "Waterline provision",
          "CATV and internet conduit",
          "Smoke detector provision",
        ],
      },
      {
        title: "Finishes",
        items: [
          "Porcelain floor tiles",
          "Painted interior walls",
          "Tiled toilet and bath",
          "Modular kitchen base cabinets",
          "Aluminum windows",
        ],
      },
    ],
  },
  {
    type: "Luxury",
    name: "Luxury Finish",
    price: "Starts at PHP 50,000",
    note: "depending on design complexity",
    groups: [
      {
        title: "Structure",
        items: [
          "High-end structural works",
          "Premium waterproofing system",
          "Engineered roof system",
          "Custom structural details",
          "Premium exterior finish",
        ],
      },
      {
        title: "Systems",
        items: [
          "Premium electrical system",
          "Premium plumbing system",
          "Smart-home provision",
          "Designer lighting provision",
          "Security system provision",
        ],
      },
      {
        title: "Finishes",
        items: [
          "Luxury imported finishes",
          "Designer floor and wall tiles",
          "Custom millwork",
          "Premium built-ins",
          "High-grade windows and doors",
        ],
      },
    ],
  },
];

export const projects: Project[] = [
  {
    id: "a-res",
    title: "A Residence",
    status: "Completed",
    type: "Residential",
    location: "Imus City, Cavite",
    number: "01",
    img: aResidenceAsset,
    description:
      "A two-storey modern contemporary residence with clean lines, layered volumes, and efficient planning across a compact 125 sqm footprint.",
    highlights: [
      "2-vehicle carport",
      "Living area",
      "Kitchen area",
      "Dining area",
      "3 bedrooms",
      "4 restrooms",
    ],
  },
  {
    id: "o-res",
    title: "O Residence",
    status: "Completed",
    type: "Residential",
    location: "Dasmarinas City, Cavite",
    number: "02",
    img: oResidenceAsset,
    description:
      "A two-storey, 174 sqm residence with strong geometric volumes and a high-ceiling living area that creates openness.",
    highlights: [
      "2-vehicle carport",
      "Living area",
      "Kitchen and service kitchen",
      "Dining area",
      "Office",
      "5 bedrooms",
      "5 restrooms",
    ],
  },
  {
    id: "g-res",
    title: "G Residence",
    status: "Completed",
    type: "Residential",
    location: "Imus City, Cavite",
    number: "03",
    img: aResidenceAsset,
    description:
      "A refined residential build with premium materials and a contemporary palette tailored to family living.",
    highlights: [
      "1-vehicle carport",
      "Living area",
      "Kitchen area",
      "Dining area",
      "4 bedrooms",
      "3 restrooms",
    ],
  },
  {
    id: "i-res",
    title: "I Residence",
    status: "Completed",
    type: "Residential",
    location: "Imus City, Cavite",
    number: "04",
    img: iResidenceAsset,
    description:
      "A three-storey modern residence that integrates exposed brick, premium materials, and smart-home features across 222 sqm.",
    highlights: [
      "1-vehicle carport",
      "2 living areas",
      "Kitchen and service kitchen",
      "Dining area",
      "6 bedrooms",
      "5 restrooms",
    ],
  },
  {
    id: "l-res",
    title: "L Residence",
    status: "Completed",
    type: "Renovation",
    location: "Pasig City",
    number: "05",
    img: lResidenceAsset,
    description:
      "A three-storey renovation transformed with dark Japanese-inspired interiors, premium materials, and selected execution works.",
    highlights: [
      "2-vehicle carport",
      "2 living areas",
      "Kitchen",
      "Dining area",
      "Office and jacuzzi",
      "Primary bedroom",
    ],
  },
  {
    id: "b-apt",
    title: "B Apartment",
    status: "Completed",
    type: "Apartment",
    location: "San Pedro City, Laguna",
    number: "06",
    img: bApartmentAsset,
    description:
      "A two-storey, three-unit apartment building with durable rentable units and clean modern detailing.",
    highlights: [
      "1-vehicle carport",
      "Living area",
      "Kitchen area",
      "Dining area",
      "2 bedrooms per unit",
      "1 restroom per unit",
    ],
  },
  {
    id: "keystone",
    title: "Keystone Building",
    status: "Completed",
    type: "Commercial",
    location: "Dasmarinas City, Cavite",
    number: "07",
    img: keystoneAsset,
    description:
      "A three-storey commercial building designed for flexible tenancy and strong street-level visibility.",
    highlights: ["2-vehicle carport", "6 commercial units", "3 restrooms"],
  },
  {
    id: "f-res",
    title: "F Residence",
    status: "Ongoing",
    type: "Residential",
    location: "Silang, Cavite",
    number: "08",
    img: fResidenceAsset,
    description:
      "A 232 sqm multi-level home that responds to a steep site slope with a Bali-inspired contemporary design.",
    highlights: [
      "2-vehicle carport",
      "2 living areas",
      "Kitchen and service kitchen",
      "Dining area",
      "6 bedrooms",
      "7 restrooms",
    ],
  },
  {
    id: "k-res",
    title: "K Residence",
    status: "Ongoing",
    type: "Residential",
    location: "Dasmarinas City, Cavite",
    number: "09",
    img: oResidenceAsset,
    description:
      "A contemporary family residence focused on natural light and tropical-modern detailing.",
    highlights: [
      "2-vehicle carport",
      "Living area",
      "Kitchen area",
      "Dining area",
      "4 bedrooms",
      "4 restrooms",
    ],
  },
  {
    id: "a-res-2",
    title: "A Residence",
    status: "Ongoing",
    type: "Residential",
    location: "Imus City, Cavite",
    number: "10",
    img: aResidenceAsset,
    description: "A modern residential build with efficient planning for an expanding family.",
    highlights: [
      "1-vehicle carport",
      "Living area",
      "Kitchen area",
      "Dining area",
      "3 bedrooms",
      "3 restrooms",
    ],
  },
  {
    id: "z-res",
    title: "Z Residence",
    status: "Ongoing",
    type: "Residential",
    location: "Dasmarinas City, Cavite",
    number: "11",
    img: iResidenceAsset,
    description:
      "A bold modern residence in development with structured massing and warm material accents.",
    highlights: [
      "2-vehicle carport",
      "Living area",
      "Kitchen area",
      "Dining area",
      "5 bedrooms",
      "4 restrooms",
    ],
  },
  {
    id: "v-res",
    title: "V Residence",
    status: "Ongoing",
    type: "Residential",
    location: "Imus City, Cavite",
    number: "13",
    img: fResidenceAsset,
    description:
      "An ongoing residential project that combines contemporary architecture with careful construction.",
    highlights: [
      "2-vehicle carport",
      "Living area",
      "Kitchen area",
      "Dining area",
      "4 bedrooms",
      "3 restrooms",
    ],
  },
];

export const projectFilters: ProjectFilter[] = [
  "All",
  "Completed",
  "Ongoing",
  "Residential",
  "Apartment",
  "Commercial",
  "Renovation",
];

export const testimonials: Testimonial[] = [
  {
    name: "The Kim Family",
    project: "Kim Residence, Two-Storey Home",
    location: "Dasmarinas, Cavite",
    rating: 5,
    quote:
      "From the first consultation to turnover, the IG Sabroso team handled every detail with professionalism. The transparency in pricing and the quality of finishes exceeded our expectations.",
  },
  {
    name: "Mr. & Mrs. Wong",
    project: "Wong Residence, Two-Storey Residential",
    location: "Imus, Cavite",
    rating: 5,
    quote:
      "They truly listened to our vision and turned it into a real home we are proud of. Honest communication, on-time milestones, and craftsmanship you can feel in every room.",
  },
  {
    name: "The Prudencio Family",
    project: "Prudencio Residence, Four Bedrooms",
    location: "San Agustin, Cavite",
    rating: 5,
    quote:
      "What stood out was how organized the build was. Site updates, material recommendations, and design refinements were thoughtful. Highly recommended.",
  },
];

export const processSteps: ProcessStep[] = [
  {
    id: "consultation",
    title: "Consultation",
    description: "Understanding your needs, vision, and budget.",
    icon: Compass,
    outcomes: ["Project brief", "Initial budget range", "Consultation summary"],
  },
  {
    id: "planning",
    title: "Planning",
    description: "Designs, drawings, schedules, and strategy.",
    icon: Ruler,
    outcomes: ["Approved design direction", "Construction drawings", "Project schedule"],
  },
  {
    id: "building",
    title: "Building",
    description: "Quality construction with precision and care.",
    icon: Hammer,
    outcomes: ["Site coordination", "Progress updates", "Quality inspections"],
  },
  {
    id: "turnover",
    title: "Turnover",
    description: "Delivering on time, with careful final checks.",
    icon: CheckCircle2,
    outcomes: ["Final inspection", "Turnover documents", "Client handover"],
  },
];
