import { describe, expect, it } from "vitest";
import {
  cancelBookingPayloadSchema,
  findBookingPayloadSchema,
  rescheduleBookingPayloadSchema,
} from "./bookings.functions";

const LEGACY_REFERENCE = "IGS-2026-0042";
const SECURE_REFERENCE = "IGS-2026-7C7F0A90EC474A0D9F51A4939D71EA0D";
const SHORT_REFERENCE = "IGS-Y7Y2MG";

describe("booking reference compatibility", () => {
  it("accepts short, legacy, and high-entropy references for lookup", () => {
    for (const bookingReference of [SHORT_REFERENCE, LEGACY_REFERENCE, SECURE_REFERENCE]) {
      expect(
        findBookingPayloadSchema.parse({
          bookingReference,
          contact: "owner@example.com",
        }).bookingReference,
      ).toBe(bookingReference);
    }
  });

  it("accepts short and secure references for reschedule and cancellation", () => {
    for (const bookingReference of [SHORT_REFERENCE, SECURE_REFERENCE]) {
      expect(
        rescheduleBookingPayloadSchema.parse({
          bookingReference,
          contact: "owner@example.com",
          newPreferredDate: "2026-09-05",
          newPreferredTime: "15:00",
          rescheduleNotes: "",
        }).bookingReference,
      ).toBe(bookingReference);

      expect(
        cancelBookingPayloadSchema.parse({
          bookingReference,
          contact: "owner@example.com",
          cancellationReason: "",
        }).bookingReference,
      ).toBe(bookingReference);
    }
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
