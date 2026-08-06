import {
  Building2,
  Compass,
  DraftingCompass,
  HardHat,
  MessagesSquare,
  RefreshCw,
} from "lucide-react";

export const SERVICES = [
  {
    slug: "general-contracting",
    title: "General Contracting",
    shortDescription: "Complete construction management from initial planning through turnover.",
    description:
      "IG Sabroso manages construction projects from conception to completion, coordinating people, materials, quality checks, and schedules with one accountable team.",
    icon: HardHat,
  },
  {
    slug: "design-build",
    title: "Design-Build Services",
    shortDescription:
      "One coordinated team for design decisions, technical planning, and construction.",
    description:
      "The design-build approach connects design and construction early, reducing handoff gaps and helping clients make informed decisions around scope, cost, and buildability.",
    icon: DraftingCompass,
  },
  {
    slug: "construction-management",
    title: "Construction Management",
    shortDescription: "Professional oversight for schedule, cost, coordination, and quality.",
    description:
      "Experienced construction managers oversee complex work, coordinate project participants, control costs, monitor milestones, and keep progress visible to the client.",
    icon: Compass,
  },
  {
    slug: "renovation-remodeling",
    title: "Renovation and Remodeling",
    shortDescription: "Purposeful upgrades that improve function, comfort, and visual character.",
    description:
      "Existing spaces are assessed and transformed through coordinated renovation works, modern material choices, and practical planning tailored to the client's priorities.",
    icon: RefreshCw,
  },
  {
    slug: "project-consultation",
    title: "Project Consultation",
    shortDescription: "Early guidance for project scope, site priorities, timing, and next steps.",
    description:
      "A structured consultation helps clarify the project brief before major design or construction commitments are made.",
    icon: MessagesSquare,
  },
  {
    slug: "commercial-and-multi-unit",
    title: "Commercial and Multi-unit",
    shortDescription: "Flexible construction solutions for business spaces and income properties.",
    description:
      "IG Sabroso applies the same quality and coordination standards to commercial buildings, apartments, and multi-unit developments.",
    icon: Building2,
  },
] as const;
