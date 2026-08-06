import { IGS_ADDRESS, IGS_EMAIL, IGS_PHONE_TEL } from "./contact";

export const SITE_URL = "https://www.igsabroso.com";
export const DEFAULT_SOCIAL_IMAGE = `${SITE_URL}/og/ig-sabroso-social.jpg`;

export function buildCanonicalUrl(pathname = "/") {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${SITE_URL}${normalized === "/" ? "" : normalized}`;
}

export const LOCAL_BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  name: "IG Sabroso Construction",
  url: SITE_URL,
  image: DEFAULT_SOCIAL_IMAGE,
  logo: `${SITE_URL}/brand/ig-sabroso-logo.png`,
  telephone: IGS_PHONE_TEL,
  email: IGS_EMAIL,
  address: {
    "@type": "PostalAddress",
    streetAddress: IGS_ADDRESS,
    addressLocality: "Dasmarinas City",
    addressRegion: "Cavite",
    addressCountry: "PH",
  },
  areaServed: ["Cavite", "Laguna", "Metro Manila"],
  slogan: "Elevate Your Lifestyle",
} as const;
