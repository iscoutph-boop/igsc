import { describe, expect, it } from "vitest";
import {
  cancelBookingPayloadSchema,
  findBookingPayloadSchema,
  rescheduleBookingPayloadSchema,
} from "./bookings.functions";

const LEGACY_REFERENCE = "IGS-2026-0042";
const SECURE_REFERENCE = "IGS-2026-7C7F0A90EC474A0D9F51A4939D71EA0D";

describe("booking reference compatibility", () => {
  it("accepts both legacy and high-entropy references for lookup", () => {
    for (const bookingReference of [LEGACY_REFERENCE, SECURE_REFERENCE]) {
      expect(
        findBookingPayloadSchema.parse({
          bookingReference,
          contact: "owner@example.com",
        }).bookingReference,
      ).toBe(bookingReference);
    }
  });

  it("accepts secure references for reschedule and cancellation", () => {
    expect(
      rescheduleBookingPayloadSchema.parse({
        bookingReference: SECURE_REFERENCE,
        contact: "owner@example.com",
        newPreferredDate: "2026-09-05",
        newPreferredTime: "15:00",
        rescheduleNotes: "",
      }).bookingReference,
    ).toBe(SECURE_REFERENCE);

    expect(
      cancelBookingPayloadSchema.parse({
        bookingReference: SECURE_REFERENCE,
        contact: "owner@example.com",
        cancellationReason: "",
      }).bookingReference,
    ).toBe(SECURE_REFERENCE);
  });

  it("rejects malformed reference shapes", () => {
    expect(() =>
      findBookingPayloadSchema.parse({
        bookingReference: "IGS-2026-guessable",
        contact: "owner@example.com",
      }),
    ).toThrow("Invalid booking reference");
  });
});
