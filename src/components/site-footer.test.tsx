import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithRouter } from "@/test/render-with-router";
import { SiteFooter } from "./site-footer";

describe("SiteFooter", () => {
  it("uses the verified shared landing and route destinations", async () => {
    await renderWithRouter(<SiteFooter />);

    const navigation = screen.getByRole("navigation", {
      name: "Footer navigation",
    });
    const expectedLinks = [
      ["Home", "/"],
      ["About", "/#about"],
      ["Services", "/#services"],
      ["Projects", "/projects"],
      ["Process", "/#process"],
      ["Contact", "/consultation"],
    ] as const;

    for (const [name, href] of expectedLinks) {
      expect(within(navigation).getByRole("link", { name })).toHaveAttribute("href", href);
    }
  });

  it("lists only the four verified Task 7 services", async () => {
    await renderWithRouter(<SiteFooter />);

    const services = screen.getByRole("navigation", {
      name: "Footer services",
    });
    const links = within(services).getAllByRole("link");
    expect(links).toHaveLength(4);
    expect(links.map((link) => link.textContent)).toEqual([
      "Residential construction",
      "Renovation & remodeling",
      "Civil works",
      "Design-build services",
    ]);
    for (const link of links) {
      expect(link).toHaveAttribute("href", "/#services");
    }
    expect(within(services).queryByText("3D Rendering")).not.toBeInTheDocument();
  });

  it("renders only verified social links and keeps footer actions touch friendly", async () => {
    await renderWithRouter(<SiteFooter />);

    expect(screen.queryByRole("link", { name: "Instagram" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Facebook" })).toHaveAttribute(
      "href",
      "https://www.facebook.com/search/top?q=ig%20sabroso%20construction",
    );
    expect(screen.getByRole("link", { name: "TikTok" })).toHaveAttribute(
      "href",
      "https://www.tiktok.com/@igs.construction",
    );

    for (const social of ["Facebook", "TikTok"]) {
      expect(screen.getByRole("link", { name: social })).toHaveClass("h-11", "w-11");
    }

    const navigation = screen.getByRole("navigation", {
      name: "Footer navigation",
    });
    const services = screen.getByRole("navigation", {
      name: "Footer services",
    });
    for (const link of [
      ...within(navigation).getAllByRole("link"),
      ...within(services).getAllByRole("link"),
    ]) {
      expect(link).toHaveClass("min-h-11");
    }

    expect(screen.getByRole("button", { name: "0917 894 8989" })).toHaveClass("min-h-11");
    expect(
      screen.getByRole("link", {
        name: "letsbuild@igsabrosoconstruction.com",
      }),
    ).toHaveClass("min-h-11");
  });
});
