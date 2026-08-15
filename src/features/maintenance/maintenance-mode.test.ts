import { describe, expect, it } from "vitest";
import { getMaintenanceAwareTitle, isMaintenanceModeEnabled } from "./maintenance-mode";

describe("maintenance mode", () => {
  it("recognizes explicit local maintenance values", () => {
    expect(isMaintenanceModeEnabled("true", "development")).toBe(true);
    expect(isMaintenanceModeEnabled("maintenance", "development")).toBe(true);
    expect(isMaintenanceModeEnabled("false", "development")).toBe(false);
  });

  it("never intercepts route tests even when the local env flag is true", () => {
    expect(isMaintenanceModeEnabled("true", "test")).toBe(false);
    expect(getMaintenanceAwareTitle("Normal page", "true", "test")).toBe("Normal page");
  });
});
