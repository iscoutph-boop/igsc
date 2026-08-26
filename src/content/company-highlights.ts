export type CompanyHighlight = {
  category: string;
  title: string;
  description: string;
  src: string;
  alt: string;
  objectPosition?: string;
};

export const COMPANY_HIGHLIGHTS: readonly CompanyHighlight[] = [
  {
    category: "Client meetings",
    title: "Client Meeting",
    description: "Kim Residence project presentation and material review with the client team.",
    src: "/assets/company-highlights/client-meeting-kim-residence.jpg",
    alt: "IG Sabroso team and clients reviewing the Kim Residence project presentation in a meeting room",
    objectPosition: "center 42%",
  },
  {
    category: "Client meetings",
    title: "Client Meeting",
    description:
      "A collaborative design session for the Wong Residence with plans and material samples.",
    src: "/assets/company-highlights/client-meeting-wong-residence.jpg",
    alt: "Clients and the IG Sabroso team gathered around a table during a Wong Residence design meeting",
    objectPosition: "center 45%",
  },
  {
    category: "Company activities",
    title: "Safety & Health Training",
    description:
      "The IG Sabroso team recognizing the people who uphold safe, quality work on every site.",
    src: "/assets/company-highlights/company-activities-safety-seminar.jpg",
    alt: "IG Sabroso team members holding certificates after a safety and health seminar",
    objectPosition: "center 47%",
  },
  {
    category: "Company activities",
    title: "Site Briefing",
    description:
      "Practical onsite coordination keeps construction decisions clear and teams aligned.",
    src: "/assets/company-highlights/company-activities-site-briefing.jpg",
    alt: "An IG Sabroso team member briefing construction workers at an active project site",
    objectPosition: "center 50%",
  },
  {
    category: "Ground breaking",
    title: "Concrete Pour",
    description:
      "A construction milestone in progress, built with careful coordination from the ground up.",
    src: "/assets/company-highlights/ground-breaking-concrete-pour.jpg",
    alt: "IG Sabroso workers guiding a concrete pour at an active construction site",
    objectPosition: "center 42%",
  },
  {
    category: "Ground breaking",
    title: "Ground-Breaking Ceremony",
    description:
      "A project begins with shared purpose, clear preparation, and the people it is built for.",
    src: "/assets/company-highlights/ground-breaking-ceremony.jpg",
    alt: "Clients and the IG Sabroso team taking part in a ceremonial ground breaking",
    objectPosition: "center 50%",
  },
];
