import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  MAX_FORM_COMPLETION_MS,
  MIN_FORM_COMPLETION_MS,
  assertPlausibleFormTiming,
  createBookingPayloadSchema,
} from "./bookings.functions";

const consultationSource = fs.readFileSync(
  path.resolve(process.cwd(), "src/routes/consultation.tsx"),
  "utf8",
);

const basePayload = {
  submissionId: "7c7f0a90-ec47-4a0d-9f51-a4939d71ea0d",
  fullName: "Juan Dela Cruz",
  phoneNumber: "+639171234567",
  emailAddress: "juan@example.com",
  projectType: "Residential" as const,
  projectLocation: "Imus City, Cavite",
  preferredService: "Project Consultation" as const,
  preferredDate: "2026-09-15",
  preferredTime: "10:00",
  budgetRange: "" as const,
  projectDetails: "New two-storey home",
  privacyConsent: "accepted" as const,
  leadSource: "Website" as const,
  companyWebsite: "",
  formElapsedMs: 3_000,
};

describe("strict booking schedule validation", () => {
  it("rejects impossible calendar dates", () => {
    expect(() =>
      createBookingPayloadSchema.parse({ ...basePayload, preferredDate: "2026-02-31" }),
    ).toThrow("Invalid booking date");
  });

  it.each(["07:30", "08:15", "17:30", "22:00", "99:99"])(
    "rejects unsupported appointment time %s",
    (preferredTime) => {
      expect(() => createBookingPayloadSchema.parse({ ...basePayload, preferredTime })).toThrow(
        "Invalid booking time",
      );
    },
  );

  it.each(["08:00", "08:30", "12:00", "16:30", "17:00"])(
    "accepts supported appointment time %s",
    (preferredTime) => {
      expect(createBookingPayloadSchema.parse({ ...basePayload, preferredTime }).preferredTime).toBe(
        preferredTime,
      );
    },
  );
});

describe("server-side form completion timing", () => {
  it("accepts plausible human completion durations", () => {
    expect(() => assertPlausibleFormTiming(MIN_FORM_COMPLETION_MS)).not.toThrow();
    expect(() => assertPlausibleFormTiming(30_000)).not.toThrow();
  });

  it("rejects missing, impossible-fast, and stale form timing", () => {
    expect(() => assertPlausibleFormTiming(undefined)).toThrow();
    expect(() => assertPlausibleFormTiming(MIN_FORM_COMPLETION_MS - 1)).toThrow();
    expect(() => assertPlausibleFormTiming(MAX_FORM_COMPLETION_MS + 1)).toThrow();
  });

  it("requires the consultation UI to forward elapsed timing to the server boundary", () => {
    expect(consultationSource).toContain("formElapsedMs");
    expect(consultationSource).toMatch(/Date\.now\(\)\s*-\s*formOpenedAtRef\.current/);
  });
});
