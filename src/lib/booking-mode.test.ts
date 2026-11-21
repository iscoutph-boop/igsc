import { describe, expect, it } from "vitest";
import { isOnlineBookingEnabled } from "./booking-mode";

describe("Cloudflare online booking release gate", () => {
  it("disables bookings by default in production without CRM credentials", () => {
    expect(isOnlineBookingEnabled("production", undefined)).toBe(false);
    expect(isOnlineBookingEnabled("production", "false")).toBe(false);
  });

  it("enables online bookings only after an explicit release switch", () => {
    expect(isOnlineBookingEnabled("production", "true")).toBe(true);
  });

  it("preserves existing isolated booking-flow tests", () => {
    expect(isOnlineBookingEnabled("test", undefined)).toBe(true);
  });
});
