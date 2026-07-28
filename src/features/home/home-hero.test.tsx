import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ThemeProvider } from "@/components/theme-provider";
import { renderWithRouter } from "@/test/render-with-router";
import { HomeHero } from "./home-hero";

async function renderHero(onManageBooking = vi.fn()) {
  await renderWithRouter(
    <ThemeProvider>
      <HomeHero onManageBooking={onManageBooking} />
    </ThemeProvider>,
  );
  return onManageBooking;
}

describe("HomeHero", () => {
  it("provides distinct labelled H1s for the mobile and desktop hero sections", async () => {
    await renderHero();

    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(2);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Building better spaces, lasting value.",
      }),
    ).toHaveAttribute("id", "home-heading-mobile");
    const desktopHeading = screen.getByRole("heading", {
      level: 1,
      name: "Building the future with quality and trust.",
    });
    expect(desktopHeading).toHaveAttribute("id", "home-heading-desktop");
    expect(
      screen.getByRole("region", {
        name: "Building the future with quality and trust.",
      }),
    ).toContainElement(desktopHeading);
  });

  it("preserves both responsive booking actions and reports their activation", async () => {
    const user = userEvent.setup();
    const onManageBooking = await renderHero();
    const bookingActions = screen.getAllByRole("button", {
      name: "Manage your booking",
    });

    expect(bookingActions).toHaveLength(2);
    await user.click(bookingActions[0]);
    await user.click(bookingActions[1]);

    expect(onManageBooking).toHaveBeenCalledTimes(2);
  });

  it("preserves the locked discover actions, trust statistics, and confidence line", async () => {
    await renderHero();

    const discoverLinks = screen.getAllByRole("link", {
      name: /discover more/i,
    });
    expect(discoverLinks).toHaveLength(2);
    for (const link of discoverLinks) {
      expect(link).toHaveAttribute("href", "#about");
    }
    expect(screen.getAllByText("10+")).toHaveLength(2);
    expect(screen.getAllByText("300+")).toHaveLength(2);
    expect(screen.getByRole("region", { name: "IG Sabroso proof" })).toHaveTextContent(
      "Build with confidence — build with Sabroso.",
    );
    expect(screen.getAllByText("Build with confidence — build with Sabroso.")).toHaveLength(2);
  });
});
