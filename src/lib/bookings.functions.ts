import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { z } from "zod";
import { buildSignedCrmEnvelope, requireCrmSharedSecret } from "./crm-auth.server";

const PROJECT_TYPES = [
  "Residential",
  "Commercial",
  "Renovation",
  "Multi-unit / Apartment",
  "Other",
] as const;

const PREFERRED_SERVICES = [
  "General Contracting",
  "Design-Build Services",
  "Construction Management",
  "Renovation and Remodeling",
  "Project Consultation",
] as const;

const BUDGET_RANGES = [
  "",
  "Below PHP 1,000,000",
  "PHP 1,000,000 - PHP 3,000,000",
  "PHP 3,000,000 - PHP 5,000,000",
  "PHP 5,000,000 - PHP 10,000,000",
  "Above PHP 10,000,000",
] as const;

export const MIN_FORM_COMPLETION_MS = 1_500;
export const MAX_FORM_COMPLETION_MS = 4 * 60 * 60 * 1_000;

export function assertPlausibleFormTiming(value: unknown): asserts value is number {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    !Number.isInteger(value) ||
    value < MIN_FORM_COMPLETION_MS ||
    value > MAX_FORM_COMPLETION_MS
  ) {
    throw new Error("Unable to process this request.");
  }
}

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

function isValidPhone(value: string): boolean {
  if (!/^[+()0-9\s.-]+$/.test(value)) return false;
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

function isValidCalendarDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function isSupportedBookingTime(value: string): boolean {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return false;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 8 || hour > 17) return false;
  if (minute !== 0 && minute !== 30) return false;
  return !(hour === 17 && minute !== 0);
}

const shortText = z.string().max(200).transform(sanitizeText);
const phoneText = z
  .string()
  .max(50)
  .transform(sanitizePhone)
  .refine(isValidPhone, "Invalid phone number");
const emailText = z
  .string()
  .trim()
  .max(254)
  .refine(
    (value) => value === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    "Invalid email address",
  );
const mediumText = z.string().max(500).transform(sanitizeText);
const longText = z.string().max(2500).transform(sanitizeText);
const optionalShortText = shortText.optional().default("");
const submissionIdText = z.string().trim().uuid("Invalid submission ID");
const bookingReferenceText = z
  .string()
  .trim()
  .max(48)
  .regex(/^IGS-\d{4}-(?:\d{4}|[0-9A-F]{32})$/i, "Invalid booking reference")
  .transform((value) => value.toUpperCase());
const contactText = z
  .string()
  .trim()
  .max(254)
  .refine(
    (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || isValidPhone(value),
    "Invalid booking contact",
  );
const dateText = z.string().trim().refine(isValidCalendarDate, "Invalid booking date");
const timeText = z.string().trim().refine(isSupportedBookingTime, "Invalid booking time");
const honeypotText = z
  .string()
  .trim()
  .max(0, "Spam submission rejected")
  .optional()
  .default("");

export const createBookingPayloadSchema = z.object({
  submissionId: submissionIdText,
  fullName: shortText.refine((value) => value.length > 0, "Name is required"),
  phoneNumber: phoneText,
  emailAddress: emailText.optional().default(""),
  projectType: z.enum(PROJECT_TYPES),
  projectLocation: mediumText.refine((value) => value.length > 0, "Project location is required"),
  preferredService: z.enum(PREFERRED_SERVICES),
  approximateArea: optionalShortText,
  preferredDate: dateText,
  preferredTime: timeText,
  budgetRange: z.enum(BUDGET_RANGES).optional().default(""),
  projectDetails: longText.refine((value) => value.length > 0, "Project details are required"),
  privacyConsent: z.literal("accepted", { errorMap: () => ({ message: "Privacy consent is required" }) }),
  leadSource: z.literal("Website").optional().default("Website"),
  companyWebsite: honeypotText,
  formElapsedMs: z.number().finite().int().optional(),
});

export const findBookingPayloadSchema = z.object({
  bookingReference: bookingReferenceText,
  contact: contactText,
});

export const rescheduleBookingPayloadSchema = z.object({
  bookingReference: bookingReferenceText,
  contact: contactText,
  newPreferredDate: dateText,
  newPreferredTime: timeText,
  rescheduleNotes: longText.optional().default(""),
});

export const cancelBookingPayloadSchema = z.object({
  bookingReference: bookingReferenceText,
  contact: contactText,
  cancellationReason: longText.optional().default(""),
});

const crmInputSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("createBooking"), payload: createBookingPayloadSchema }),
  z.object({ action: z.literal("findBooking"), payload: findBookingPayloadSchema }),
  z.object({ action: z.literal("rescheduleBooking"), payload: rescheduleBookingPayloadSchema }),
  z.object({ action: z.literal("cancelBooking"), payload: cancelBookingPayloadSchema }),
]);

export const CRM_UPSTREAM_TIMEOUT_MS = 12_000;

export const buildCRMRequestBody = createServerOnlyFn(
  (
    action: string,
    payload: unknown,
    secret: string,
    nowSeconds?: number,
    nonce?: string,
  ): string => JSON.stringify(buildSignedCrmEnvelope(action, payload, secret, nowSeconds, nonce)),
);

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
    if (data.action === "createBooking") {
      assertPlausibleFormTiming(data.payload.formElapsedMs);
    }
    const secret = requireCrmSharedSecret(process.env.CRM_SHARED_SECRET);
    const body = buildCRMRequestBody(data.action, data.payload, secret);

    const response = await fetchCRMUpstream(url, body);

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