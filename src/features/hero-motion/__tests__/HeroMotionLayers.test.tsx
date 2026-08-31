import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroMotionLayers } from "../HeroMotionLayers";

describe("HeroMotionLayers", () => {
  it("renders four decorative pointer-safe overlays without duplicating the base", () => {
    const { container } = render(<HeroMotionLayers state="sketchReveal" />);
    expect(screen.getByTestId("hero-motion-layers").getAttribute("data-hero-state")).toBe(
      "sketchReveal",
    );
    const overlays = container.querySelectorAll<HTMLImageElement>('img[aria-hidden="true"]');
    expect(overlays).toHaveLength(4);
    overlays.forEach((overlay) => {
      expect(overlay.getAttribute("alt")).toBe("");
      expect(overlay.className).toContain("heroMotionOverlay");
    });
    expect(container.querySelector("canvas")).toBeNull();
    expect(screen.getByTestId("hero-motion-layers").getAttribute("style") ?? "").not.toContain(
      "cursor",
    );
  });
});
