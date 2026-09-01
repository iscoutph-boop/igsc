import { describe, expect, it } from "vitest";
import {
  cancelBookingPayloadSchema,
  createBookingPayloadSchema,
  findBookingPayloadSchema,
  rescheduleBookingPayloadSchema,
} from "./bookings.functions";

describe("booking payload schemas", () => {
  it("requires the production inquiry fields and sanitizes spreadsheet prefixes", () => {
    const result = createBookingPayloadSchema.parse({
      submissionId: "7c7f0a90-ec47-4a0d-9f51-a4939d71ea0d",
      fullName: "=Juan Dela Cruz",
      phoneNumber: "+639171234567",
      emailAddress: "juan@example.com",
      projectType: "Residential Construction",
      projectLocation: "Imus City, Cavite",
      preferredService: "Design-Build Services",
      approximateArea: "180 sqm",
      preferredDate: "2026-09-01",
      preferredTime: "10:00",
      budgetRange: "PHP 3,000,000 - PHP 5,000,000",
      projectDetails: "New two-storey home",
      privacyConsent: "accepted",
      leadSource: "Website",
    });

    expect(result.fullName).toBe("Juan Dela Cruz");
    expect(result.submissionId).toBe("7c7f0a90-ec47-4a0d-9f51-a4939d71ea0d");
    expect(result.phoneNumber).toBe("+639171234567");
    expect(
      createBookingPayloadSchema.parse({
        ...result,
        phoneNumber: "-09171234567",
      }).phoneNumber,
    ).toBe("09171234567");
    expect(result.privacyConsent).toBe("accepted");
  });

  it("rejects submissions without required schedule and consent fields", () => {
    expect(() =>
      createBookingPayloadSchema.parse({
        fullName: "Juan Dela Cruz",
        phoneNumber: "09171234567",
        projectType: "Residential Construction",
        privacyConsent: "",
      }),
    ).toThrow();
  });

  it("accepts the normalized cancellationReason contract", () => {
    const parsed = cancelBookingPayloadSchema.parse({
      bookingReference: "IGS-2026-0018",
      contact: "qa@example.com",
      cancellationReason: "Schedule changed",
    });

    expect(parsed.cancellationReason).toBe("Schedule changed");
  });

  it("rejects overlong cancellation reasons", () => {
    expect(() =>
      cancelBookingPayloadSchema.parse({
        bookingReference: "IGS-2026-0018",
        contact: "qa@example.com",
        cancellationReason: "x".repeat(2501),
      }),
    ).toThrow();
  });

  it("keeps find and reschedule contracts bounded", () => {
    expect(
      findBookingPayloadSchema.parse({
        bookingReference: "IGS-2026-0018",
        contact: "qa@example.com",
      }),
    ).toMatchObject({ bookingReference: "IGS-2026-0018", contact: "qa@example.com" });

    expect(
      rescheduleBookingPayloadSchema.parse({
        bookingReference: "IGS-2026-0018",
        contact: "qa@example.com",
        newPreferredDate: "2026-09-05",
        newPreferredTime: "15:00",
        rescheduleNotes: "Client selected a new date.",
      }),
    ).toMatchObject({
      bookingReference: "IGS-2026-0018",
      newPreferredDate: "2026-09-05",
      newPreferredTime: "15:00",
    });
  });
});
