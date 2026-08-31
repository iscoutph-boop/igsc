import { describe, expect, it } from "vitest";
import { buildCRMForwardRequest, createBookingPayloadSchema } from "./bookings.functions";

describe("createBookingPayloadSchema", () => {
  it("requires the production inquiry fields and sanitizes spreadsheet prefixes", () => {
    const result = createBookingPayloadSchema.parse({
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
});

describe("buildCRMForwardRequest", () => {
  it("preserves cancellationReason and adds the legacy cancelReason alias", () => {
    const request = buildCRMForwardRequest({
      action: "cancelBooking",
      payload: {
        bookingReference: "IGS-2026-TEST",
        contact: "client@example.com",
        cancellationReason: "Schedule changed",
      },
    });

    expect(request).toEqual({
      action: "cancelBooking",
      payload: {
        bookingReference: "IGS-2026-TEST",
        contact: "client@example.com",
        cancellationReason: "Schedule changed",
        cancelReason: "Schedule changed",
      },
    });
  });

  it("does not add compatibility fields to other CRM actions", () => {
    const request = buildCRMForwardRequest({
      action: "findBooking",
      payload: {
        bookingReference: "IGS-2026-TEST",
        contact: "client@example.com",
      },
    });

    expect(request).toEqual({
      action: "findBooking",
      payload: {
        bookingReference: "IGS-2026-TEST",
        contact: "client@example.com",
      },
    });
  });
});
