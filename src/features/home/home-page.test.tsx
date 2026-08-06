import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderRoute } from "@/test/render-route";

describe("HomePage", () => {
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
});
