import { CheckCircle2, Compass, Hammer, Ruler, type LucideIcon } from "lucide-react";

export type ProcessStep = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  outcomes: readonly string[];
};

export const PROCESS_STEPS: readonly ProcessStep[] = [
  {
    id: "consultation",
    title: "Consultation",
    description: "Understanding your needs, vision, site priorities, and budget expectations.",
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
    description: "Quality construction with coordinated supervision, precision, and care.",
    icon: Hammer,
    outcomes: ["Site coordination", "Progress updates", "Quality inspections"],
  },
  {
    id: "turnover",
    title: "Turnover",
    description: "Delivering with careful final checks, documentation, and client handover.",
    icon: CheckCircle2,
    outcomes: ["Final inspection", "Turnover documents", "Client handover"],
  },
] as const;
