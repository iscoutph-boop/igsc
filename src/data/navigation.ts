export type NavigationItem = {
  label: string;
  to: "/" | "/projects" | "/consultation";
  hash?: string;
};

export type SocialLink = {
  label: "Facebook" | "TikTok";
  href: string;
};

export const navItems: readonly NavigationItem[] = [
  { label: "Home", to: "/" },
  { label: "About", to: "/", hash: "about" },
  { label: "Services", to: "/", hash: "services" },
  { label: "Projects", to: "/projects" },
  { label: "Process", to: "/", hash: "process" },
  { label: "Contact", to: "/consultation" },
] as const;

export const socialLinks: readonly SocialLink[] = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/search/top?q=ig%20sabroso%20construction",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@igs.construction",
  },
] as const;
