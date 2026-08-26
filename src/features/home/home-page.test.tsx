import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CompanyHighlights } from "@/features/home/company-highlights";
import { renderRoute } from "@/test/render-route";

describe("HomePage", () => {
  it("keeps the company highlights slideshow advancing when reduced motion is preferred", async () => {
    const originalMatchMedia = window.matchMedia;
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: (query: string) => ({
        matches: query === "(prefers-reduced-motion)",
        media: query,
        onchange: null,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        addListener: () => undefined,
        removeListener: () => undefined,
        dispatchEvent: () => false,
      }),
    });
    vi.useFakeTimers();

    try {
      render(<CompanyHighlights />);

      const highlights = screen.getByRole("region", { name: "Company highlights" });
      await act(async () => {
        await vi.advanceTimersByTimeAsync(6500);
      });

      expect(
        within(highlights).getByText(/Wong Residence with plans and material samples/i),
      ).toBeTruthy();
    } finally {
      vi.useRealTimers();
      Object.defineProperty(window, "matchMedia", {
        configurable: true,
        value: originalMatchMedia,
      });
    }
  });

  it("renders the approved conversion hierarchy and real featured project", async () => {
    await renderRoute("/");
    expect(
      await screen.findByRole("heading", { level: 1, name: /build with confidence/i }),
    ).toBeTruthy();
    expect(screen.getByRole("link", { name: /view our projects/i }).getAttribute("href")).toBe(
      "/projects",
    );
    expect(
      screen.getAllByRole("link", { name: /book a consultation/i })[0].getAttribute("href"),
    ).toBe("/consultation");
    expect(screen.getAllByText("O Residence").length).toBeGreaterThan(0);
  });

  it("renders an automatic testimonial slider without manual controls", async () => {
    await renderRoute("/");

    const testimonialRegion = await screen.findByRole("region", {
      name: "Client testimonials",
    });

    expect(testimonialRegion.querySelector("blockquote")).not.toBeNull();
    expect(within(testimonialRegion).queryAllByRole("button")).toHaveLength(0);
    expect(within(testimonialRegion).queryAllByRole("link")).toHaveLength(0);
  });

  it("automatically advances the company highlights slideshow", async () => {
    vi.useFakeTimers();

    try {
      render(<CompanyHighlights />);

      const highlights = screen.getByRole("region", { name: "Company highlights" });
      expect(within(highlights).getByText(/Kim Residence project presentation/i)).toBeTruthy();

      await act(async () => {
        await vi.advanceTimersByTimeAsync(6500);
      });

      expect(
        within(highlights).getByText(/Wong Residence with plans and material samples/i),
      ).toBeTruthy();
    } finally {
      vi.useRealTimers();
    }
  });

  it("keeps viewer controls but removes the gallery arrow controls", async () => {
    const user = userEvent.setup();

    await renderRoute("/");

    const highlights = await screen.findByRole("region", { name: "Company highlights" });
    expect(within(highlights).getByText("Client Meeting")).toBeTruthy();
    expect(
      within(highlights).queryByRole("button", { name: /previous company highlight/i }),
    ).toBeNull();
    expect(
      within(highlights).queryByRole("button", { name: /next company highlight/i }),
    ).toBeNull();
    expect(highlights.textContent).not.toMatch(/01\s*\/\s*06/);

    await user.click(
      within(highlights).getByRole("button", { name: /open client meeting image/i }),
    );

    const viewer = await screen.findByRole("dialog", { name: "Company highlights viewer" });
    expect(within(viewer).getByRole("button", { name: "Next image" })).toBeTruthy();
    expect(within(viewer).getByRole("button", { name: "Close" })).toBeTruthy();
  });
});
