import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

function sanitizeText(value: unknown): string {
  if (typeof value !== "string") return "";
  let sanitized = value.trim();
  while (
    sanitized.length > 0 &&
    (sanitized[0] === "=" || sanitized[0] === "+" || sanitized[0] === "-" || sanitized[0] === "@")
  ) {
    sanitized = sanitized.slice(1).trimStart();
  }
  return sanitized;
}

function sanitizePhone(value: unknown): string {
  if (typeof value !== "string") return "";
  const sanitized = value.trim();
  if (sanitized.startsWith("=") || sanitized.startsWith("@") || sanitized.startsWith("-")) {
    return sanitized.slice(1).trimStart();
  }
  return sanitized;
}

const shortText = z.string().max(200).transform(sanitizeText);
const phoneText = z.string().max(50).transform(sanitizePhone);
const mediumText = z.string().max(500).transform(sanitizeText);
const longText = z.string().max(2500).transform(sanitizeText);
const optionalShortText = shortText.optional().default("");
const submissionIdText = z.string().trim().uuid("Invalid submission ID");
const optionalEmailText = z
  .string()
  .trim()
  .max(254)
  .refine(
    (value) => value === "" || z.string().email().safeParse(value).success,
    "Invalid email address",
  )
  .optional()
  .default("");

const projectTypeText = z.enum([
  "Residential",
  "Commercial",
  "Renovation",
  "Multi-unit / Apartment",
  "Other",
]);

const preferredServiceText = z.enum([
  "General Contracting",
  "Design-Build Services",
  "Construction Management",
  "Renovation and Remodeling",
  "Project Consultation",
]);

const budgetRangeText = z.enum([
  "",
  "Below PHP 1,000,000",
  "PHP 1,000,000 - PHP 3,000,000",
  "PHP 3,000,000 - PHP 5,000,000",
  "PHP 5,000,000 - PHP 10,000,000",
  "Above PHP 10,000,000",
]);

const honeypotText = z
  .string()
  .max(200)
  .refine((value) => value.trim() === "", "Invalid submission")
  .transform((value) => value.trim());

export const createBookingPayloadSchema = z.object({
  submissionId: submissionIdText,
  fullName: shortText.refine((value) => value.length > 0, "Name is required"),
  phoneNumber: phoneText.refine((value) => value.length > 0, "Phone number is required"),
  emailAddress: optionalEmailText,
  projectType: projectTypeText,
  projectLocation: mediumText.refine((value) => value.length > 0, "Project location is required"),
  preferredService: preferredServiceText,
  approximateArea: optionalShortText,
  preferredDate: shortText.refine((value) => value.length > 0, "Preferred date is required"),
  preferredTime: shortText.refine((value) => value.length > 0, "Preferred time is required"),
  budgetRange: budgetRangeText,
  projectDetails: longText.refine((value) => value.length > 0, "Project details are required"),
  privacyConsent: z.literal("accepted"),
  leadSource: z.literal("Website"),
  companyWebsite: honeypotText,
});

export const findBookingPayloadSchema = z.object({
  bookingReference: shortText,
  contact: phoneText.optional().default(""),
});

export const rescheduleBookingPayloadSchema = z.object({
  bookingReference: shortText,
  contact: phoneText.optional().default(""),
  newPreferredDate: optionalShortText,
  newPreferredTime: optionalShortText,
  rescheduleNotes: longText.optional().default(""),
});

export const cancelBookingPayloadSchema = z.object({
  bookingReference: shortText,
  contact: phoneText.optional().default(""),
  cancellationReason: longText.optional().default(""),
});

const crmInputSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("createBooking"), payload: createBookingPayloadSchema }),
  z.object({ action: z.literal("findBooking"), payload: findBookingPayloadSchema }),
  z.object({ action: z.literal("rescheduleBooking"), payload: rescheduleBookingPayloadSchema }),
  z.object({ action: z.literal("cancelBooking"), payload: cancelBookingPayloadSchema }),
]);

export const CRM_UPSTREAM_TIMEOUT_MS = 12_000;

export async function fetchCRMUpstream(url: string, body: string): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CRM_UPSTREAM_TIMEOUT_MS);

  try {
    return await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body,
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Booking service timed out.");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const callCRMFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => crmInputSchema.parse(data))
  .handler(async ({ data }) => {
    const url = process.env.GOOGLE_APPS_SCRIPT_WEB_APP_URL;
    if (!url) {
      throw new Error("Booking service is not configured.");
    }

    const response = await fetchCRMUpstream(
      url,
      JSON.stringify({ action: data.action, payload: data.payload }),
    );

    if (!response.ok) {
      throw new Error(`Booking service returned ${response.status}.`);
    }

    const text = await response.text();
    const json = JSON.parse(text) as { success?: boolean; message?: string };
    if (!json.success) {
      throw new Error(typeof json.message === "string" ? json.message : "CRM request failed.");
    }

    // Google Apps Script is the sole lifecycle-email authority. Keeping all
    // lifecycle email side effects there prevents duplicate admin/customer mail.
    return text;
  });
