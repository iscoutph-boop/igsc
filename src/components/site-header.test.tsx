import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderRoute } from "@/test/render-route";

function normalizedPathname(link: HTMLElement) {
  const href = link.getAttribute("href");
  if (!href) return "";
  const pathname = new URL(href, "http://localhost").pathname;
  return pathname === "/" ? pathname : pathname.replace(/\/$/, "");
}

describe("site navigation", () => {
  it("exposes the approved hybrid routes in the mobile menu", async () => {
    const user = userEvent.setup();
    await renderRoute("/");
    await user.click(await screen.findByRole("button", { name: "Open navigation menu" }));

    const dialog = screen.getByRole("dialog", { name: "Navigation menu" });
    const projectsLink = within(dialog).getByRole("link", { name: "Projects" });
    const consultationLink = within(dialog).getByRole("link", {
      name: "Book a consultation",
    });

    expect(normalizedPathname(projectsLink)).toBe("/projects");
    expect(normalizedPathname(consultationLink)).toBe("/consultation");
  });

  it("marks only the active details anchor as current", async () => {
    await renderRoute("/details#services");

    const serviceLinks = await screen.findAllByRole("link", { name: "Services" });
    const aboutLinks = screen.getAllByRole("link", { name: "About" });

    expect(serviceLinks.every((link) => link.getAttribute("aria-current") === "page")).toBe(true);
    expect(aboutLinks.every((link) => link.getAttribute("aria-current") !== "page")).toBe(true);
  });
});
