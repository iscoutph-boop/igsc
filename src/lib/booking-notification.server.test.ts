import { describe, expect, it, vi } from "vitest";
import { sendBookingNotification } from "./booking-notification.server";

const booking = {
  fullName: "Maria Santos",
  phoneNumber: "+63 917 555 0101",
  emailAddress: "maria@example.com",
  projectType: "Residential",
  projectLocation: "Cagayan de Oro",
  preferredService: "Design and Build",
  approximateArea: "180 sqm",
  preferredDate: "2026-09-15",
  preferredTime: "10:00 AM",
  budgetRange: "₱3M–₱5M",
  projectDetails: "Two-storey family home.",
  leadSource: "Website",
};

describe("sendBookingNotification", () => {
  it("posts the completed booking to the protected staging webhook", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 200 }));

    const result = await sendBookingNotification(booking, {
      env: {
        BOOKING_NOTIFICATION_ENABLED: "true",
        BOOKING_NOTIFICATION_WEBHOOK_URL: "https://example.test/booking",
        BOOKING_NOTIFICATION_WEBHOOK_SECRET: "staging-secret",
      },
      fetchImpl: fetchMock,
    });

    expect(result).toEqual({ sent: true });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.test/booking",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ secret: "staging-secret", notification: booking }),
      }),
    );
  });

  it("does not call the webhook while notifications are disabled", async () => {
    const fetchMock = vi.fn();

    const result = await sendBookingNotification(booking, {
      env: {
        BOOKING_NOTIFICATION_ENABLED: "false",
        BOOKING_NOTIFICATION_WEBHOOK_URL: "https://example.test/booking",
        BOOKING_NOTIFICATION_WEBHOOK_SECRET: "staging-secret",
      },
      fetchImpl: fetchMock,
    });

    expect(result).toEqual({ sent: false, reason: "disabled" });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
