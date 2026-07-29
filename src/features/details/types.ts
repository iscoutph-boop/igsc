export type ProjectType = "Residential" | "Apartment" | "Commercial" | "Renovation";

export type ProjectStatus = "Completed" | "Ongoing";

export type Project = {
  id: string;
  title: string;
  status: ProjectStatus;
  type: ProjectType;
  location: string;
  description: string;
  highlights: string[];
  number: string;
  img: string;
};

export type ProjectFilter = "All" | ProjectStatus | ProjectType;

export type ProjectSort = "latest" | "completed" | "ongoing" | "name";

export type PackageType = "Standard" | "Semi-Elegant" | "Elegant" | "Luxury";

export type EstimateInput = {
  projectType: string;
  location: string;
  floors: number;
  area: number;
  packageType: PackageType | "";
  bedrooms: number;
  bathrooms: number;
  site: string;
  addons: string[];
};

export type EstimateField = "projectType" | "location" | "floors" | "area" | "packageType";

export type EstimateErrors = Partial<Record<EstimateField, string>>;

export type EstimateResult = {
  low: number;
  high: number;
};
