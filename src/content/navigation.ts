export const PRIMARY_NAVIGATION = [
  { label: "Home", to: "/" },
  { label: "About", to: "/details", hash: "about" },
  { label: "Services", to: "/details", hash: "services" },
  { label: "Projects", to: "/projects" },
  { label: "Process", to: "/details", hash: "process" },
  { label: "Reviews", to: "/details", hash: "reviews" },
  { label: "Contact", to: "/details", hash: "contact" },
] as const;

export type PrimaryNavigationItem = (typeof PRIMARY_NAVIGATION)[number];

export function isPrimaryNavigationItemActive(
  item: PrimaryNavigationItem,
  pathname: string,
  hash = "",
) {
  const currentHash = hash.replace(/^#/, "");

  if (item.to === "/") return pathname === "/";
  if (item.to === "/projects") return pathname.startsWith("/projects");

  if (item.to === "/details" && "hash" in item) {
    if (pathname !== "/details") return false;
    return currentHash ? currentHash === item.hash : item.hash === "about";
  }

  return pathname === (item as PrimaryNavigationItem).to;
}

export function getPrimaryNavigationActiveOptions(item: PrimaryNavigationItem) {
  return {
    exact: item.to !== "/projects",
    includeHash: "hash" in item,
  };
}
