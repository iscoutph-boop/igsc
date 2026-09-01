import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { sendBookingNotification } from "./booking-notification.server";

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
const optionalMediumText = mediumText.optional().default("");

export const createBookingPayloadSchema = z.object({
  fullName: shortText.refine((value) => value.length > 0, "Name is required"),
  phoneNumber: phoneText.refine((value) => value.length > 0, "Phone number is required"),
  emailAddress: optionalShortText,
  projectType: shortText.refine((value) => value.length > 0, "Project type is required"),
  projectLocation: mediumText.refine((value) => value.length > 0, "Project location is required"),
  preferredService: shortText.refine((value) => value.length > 0, "Preferred service is required"),
  approximateArea: optionalShortText,
  preferredDate: shortText.refine((value) => value.length > 0, "Preferred date is required"),
  preferredTime: shortText.refine((value) => value.length > 0, "Preferred time is required"),
  budgetRange: optionalShortText,
  projectDetails: longText.refine((value) => value.length > 0, "Project details are required"),
  privacyConsent: shortText.refine((value) => value === "accepted", "Privacy consent is required"),
  leadSource: optionalShortText,
});

const findBookingPayloadSchema = z.object({
  bookingReference: shortText,
  contact: phoneText.optional().default(""),
});

const rescheduleBookingPayloadSchema = z.object({
  bookingReference: shortText,
  contact: phoneText.optional().default(""),
  newPreferredDate: optionalShortText,
  newPreferredTime: optionalShortText,
  rescheduleNotes: longText.optional().default(""),
});

const cancelBookingPayloadSchema = z.object({
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

export const callCRMFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => crmInputSchema.parse(data))
  .handler(async ({ data }) => {
    const url = process.env.GOOGLE_APPS_SCRIPT_WEB_APP_URL;
    if (!url) {
      throw new Error("Booking service is not configured.");
    }

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: data.action, payload: data.payload }),
    });

    if (!response.ok) {
      throw new Error(`Booking service returned ${response.status}.`);
    }

    const text = await response.text();
    const json = JSON.parse(text) as { success?: boolean; message?: string };
    if (!json.success) {
      throw new Error(typeof json.message === "string" ? json.message : "CRM request failed.");
    }

    if (data.action === "createBooking") {
      await sendBookingNotification({
        fullName: data.payload.fullName,
        phoneNumber: data.payload.phoneNumber,
        emailAddress: data.payload.emailAddress,
        projectType: data.payload.projectType,
        projectLocation: data.payload.projectLocation,
        preferredService: data.payload.preferredService,
        approximateArea: data.payload.approximateArea,
        preferredDate: data.payload.preferredDate,
        preferredTime: data.payload.preferredTime,
        budgetRange: data.payload.budgetRange,
        projectDetails: data.payload.projectDetails,
        leadSource: data.payload.leadSource,
      });
    }

    return text;
  });
