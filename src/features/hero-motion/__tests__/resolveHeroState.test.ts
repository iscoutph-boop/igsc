import { describe, expect, it } from "vitest";
import { resolveHeroState } from "../resolveHeroState";

describe("resolveHeroState", () => {
  it.each([
    [0.1, "idle"],
    [0.36, "sketchReveal"],
    [0.5, "sketchReveal"],
    [0.63, "finishedLights"],
    [0.95, "finishedLights"],
  ] as const)("maps %s to %s", (x, expected) => {
    expect(resolveHeroState(x, "idle")).toBe(expected);
  });
  it("holds sketch inside the seam buffer", () => {
    expect(resolveHeroState(0.635, "sketchReveal")).toBe("sketchReveal");
  });
  it("holds lights until the pointer clears the seam buffer", () => {
    expect(resolveHeroState(0.62, "finishedLights")).toBe("finishedLights");
    expect(resolveHeroState(0.6, "finishedLights")).toBe("sketchReveal");
  });
});
