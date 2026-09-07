import { beforeEach, describe, expect, it, vi } from "vitest";

const { callCRMFnMock } = vi.hoisted(() => ({
  callCRMFnMock: vi.fn(),
}));

vi.mock("./bookings.functions", () => ({
  callCRMFn: (...args: unknown[]) => callCRMFnMock(...args),
}));

import { callCRM } from "./bookings";

const createPayload = {
  submissionId: "7c7f0a90-ec47-4a0d-9f51-a4939d71ea0d",
  fullName: "VMM Retry QA",
  phoneNumber: "+639171234567",
  emailAddress: "qa@example.com",
  projectType: "Residential",
  projectLocation: "Cagayan de Oro City",
  preferredService: "Project Consultation",
  approximateArea: "180 sqm",
  preferredDate: "2026-09-15",
  preferredTime: "10:30",
  budgetRange: "PHP 3,000,000 - PHP 5,000,000",
  projectDetails: "Controlled timeout recovery test.",
  privacyConsent: "accepted",
  leadSource: "Website",
};

describe("callCRM create recovery", () => {
  beforeEach(() => callCRMFnMock.mockReset());

  it("retries one transient timeout with the same submission id", async () => {
    callCRMFnMock
      .mockRejectedValueOnce(new Error("Inactivity Timeout"))
      .mockResolvedValueOnce(JSON.stringify({ success: true, bookingReference: "IGS-2026-0042" }));

    await expect(callCRM("createBooking", createPayload)).resolves.toMatchObject({
      success: true,
      bookingReference: "IGS-2026-0042",
    });

    expect(callCRMFnMock).toHaveBeenCalledTimes(2);
    expect(callCRMFnMock.mock.calls[0]?.[0]).toEqual(callCRMFnMock.mock.calls[1]?.[0]);
  });

  it("never exposes raw HTML when recovery cannot confirm the booking", async () => {
    const rawHtml = "<!doctype html><html><title>Inactivity Timeout</title></html>";
    callCRMFnMock
      .mockImplementationOnce(async () => {
        throw new Error(rawHtml);
      })
      .mockImplementationOnce(async () => {
        throw new Error(rawHtml);
      });

    await expect(callCRM("createBooking", createPayload)).rejects.toThrow(
      "We could not confirm the booking response. Please try submitting again; the same request will not create a duplicate booking.",
    );
    expect(callCRMFnMock).toHaveBeenCalledTimes(2);
  });
});
