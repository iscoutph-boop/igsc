import { describe, expect, it } from "vitest";
import { navItems, socialLinks } from "./navigation";

describe("verified navigation", () => {
  it("links Projects to the projects route", () => {
    expect(navItems.find((item) => item.label === "Projects")).toEqual({
      label: "Projects",
      to: "/projects",
    });
  });

  it("links landing sections to hashes on the home route", () => {
    expect(
      navItems.filter((item) => ["Home", "About", "Services", "Process"].includes(item.label)),
    ).toEqual([
      { label: "Home", to: "/" },
      { label: "About", to: "/", hash: "about" },
      { label: "Services", to: "/", hash: "services" },
      { label: "Process", to: "/", hash: "process" },
    ]);
  });

  it("links Contact to consultation", () => {
    expect(navItems.find((item) => item.label === "Contact")).toEqual({
      label: "Contact",
      to: "/consultation",
    });
  });

  it("does not publish an Instagram item", () => {
    expect([...navItems, ...socialLinks].some((item) => item.label === "Instagram")).toBe(false);
  });

  it("publishes only the verified social links", () => {
    expect(socialLinks).toEqual([
      {
        label: "Facebook",
        href: "https://www.facebook.com/search/top?q=ig%20sabroso%20construction",
      },
      {
        label: "TikTok",
        href: "https://www.tiktok.com/@igs.construction",
      },
    ]);
  });
});
