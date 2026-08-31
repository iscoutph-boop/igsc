import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { describe, expect, it } from "vitest";

const patchPath = fileURLToPath(new URL("./booking-backend-v5-patch.gs", import.meta.url));

function loadPatch() {
  expect(existsSync(patchPath), "booking-backend-v5-patch.gs must exist").toBe(true);
  if (!existsSync(patchPath)) return null;

  const context: Record<string, unknown> = {};
  vm.createContext(context);
  vm.runInContext(readFileSync(patchPath, "utf8"), context, {
    filename: "booking-backend-v5-patch.gs",
  });
  return context as Record<string, (...args: unknown[]) => unknown>;
}

describe("IG Sabroso Apps Script V5 booking patch", () => {
  it("normalizes 24-hour and 12-hour PM values without losing the PM period", () => {
    const patch = loadPatch();
    if (!patch) return;

    const from24 = patch.parseBookingTimeV5_("13:30") as Record<string, unknown>;
    expect(from24.normalized24).toBe("13:30");
    expect(from24.display).toBe("1:30 PM");

    const from12 = patch.parseBookingTimeV5_("1:30 PM") as Record<string, unknown>;
    expect(from12.normalized24).toBe("13:30");
    expect(from12.display).toBe("1:30 PM");
  });

  it("handles noon and midnight explicitly", () => {
    const patch = loadPatch();
    if (!patch) return;

    const noon = patch.parseBookingTimeV5_("12:00 PM") as Record<string, unknown>;
    const midnight = patch.parseBookingTimeV5_("12:00 AM") as Record<string, unknown>;
    expect(noon.normalized24).toBe("12:00");
    expect(midnight.normalized24).toBe("00:00");
  });

  it("rejects impossible clock values", () => {
    const patch = loadPatch();
    if (!patch) return;

    expect(() => patch.parseBookingTimeV5_("25:00")).toThrow(/Invalid booking time/i);
    expect(() => patch.parseBookingTimeV5_("13:90")).toThrow(/Invalid booking time/i);
  });

  it("only marks IG Sabroso calendar events carrying the exact booking reference as deletable", () => {
    const patch = loadPatch();
    if (!patch) return;

    expect(
      patch.isBookingCalendarEventV5_(
        "IG Sabroso Consultation — Juan Dela Cruz — IGS-2026-0099",
        "Booking Reference: IGS-2026-0099",
        "IGS-2026-0099",
      ),
    ).toBe(true);

    expect(
      patch.isBookingCalendarEventV5_(
        "Personal appointment — IGS-2026-0099",
        "Booking Reference: IGS-2026-0099",
        "IGS-2026-0099",
      ),
    ).toBe(false);

    expect(
      patch.isBookingCalendarEventV5_(
        "IG Sabroso Consultation — Juan Dela Cruz — IGS-2026-0100",
        "Booking Reference: IGS-2026-0100",
        "IGS-2026-0099",
      ),
    ).toBe(false);
  });
});
