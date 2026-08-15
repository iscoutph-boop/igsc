import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MaintenancePage } from "./maintenance-page";

describe("MaintenancePage", () => {
  it("keeps the approved IG Sabroso identity and reference copy", () => {
    render(<MaintenancePage />);

    expect(screen.getByRole("img", { name: "IG Sabroso Construction logo" })).toBeTruthy();
    expect(screen.getByText("Elevate Your Lifestyle")).toBeTruthy();
    expect(screen.getByRole("heading", { level: 1 }).textContent).toMatch(
      /we.re updating.*our website.*we.ll be back soon/i,
    );
    expect(screen.getAllByRole("heading", { name: "Thank you" }).length).toBeGreaterThan(0);
    expect(screen.getByText("Need to reach us?")).toBeTruthy();
  });

  it("keeps the contact links and Caballero footer credit functional", () => {
    render(<MaintenancePage />);

    const contact = screen.getByRole("region", { name: "Need to reach us?" });
    expect(
      within(contact)
        .getByRole("link", { name: "caballerodigitals@gmail.com" })
        .getAttribute("href"),
    ).toBe("mailto:caballerodigitals@gmail.com");
    expect(within(contact).getByRole("link", { name: "+65 8780 5776" }).getAttribute("href")).toBe(
      "https://wa.me/6587805776",
    );

    expect(screen.getByText("Caballero Digital Solutions")).toBeTruthy();
    expect(screen.getAllByText("caballerodigitalsolutions.com").length).toBeGreaterThan(0);
  });
});
