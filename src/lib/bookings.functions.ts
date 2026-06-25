import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// CRM URL is server-only; falls back to the previously hardcoded URL so the
// integration keeps working if the env var is not set.
const FALLBACK_CRM_URL =
  "https://script.google.com/macros/s/AKfycbym6yZbnhNFA6xVAYRQhW1hB7lXGFVFXTKdgj3lUMZscjN2HZq6K547FZgFDiQkypTd9g/exec";

// Strip leading characters that Google Sheets interprets as a formula.
function sanitizeText(value: unknown): string {
  if (typeof value !== "string") return "";
  let v = value.trim();
  while (v.length > 0 && (v[0] === "=" || v[0] === "+" || v[0] === "-" || v[0] === "@")) {
    v = v.slice(1).trimStart();
  }
  return v;
}

const shortText = z.string().max(200).transform(sanitizeText);
const mediumText = z.string().max(500).transform(sanitizeText);
const longText = z.string().max(2000).transform(sanitizeText);
const optShort = shortText.optional().default("");
const optMedium = mediumText.optional().default("");

const createBookingPayload = z.object({
  fullName: shortText.refine((v) => v.length > 0, "Name is required"),
  phoneNumber: shortText.refine((v) => v.length > 0, "Phone number is required"),
  emailAddress: optShort,
  projectType: shortText.refine((v) => v.length > 0, "Project type is required"),
  projectLocation: optMedium,
  preferredDate: optShort,
  preferredTime: optShort,
  budgetRange: optShort,
  projectDetails: longText.optional().default(""),
  leadSource: optShort,
});

const findBookingPayload = z.object({
  bookingReference: shortText,
  contact: optShort,
});

const rescheduleBookingPayload = z.object({
  bookingReference: shortText,
  contact: optShort,
  newPreferredDate: optShort,
  newPreferredTime: optShort,
  rescheduleNotes: longText.optional().default(""),
});

const cancelBookingPayload = z.object({
  bookingReference: shortText,
  contact: optShort,
  cancellationReason: longText.optional().default(""),
});

const crmInput = z.discriminatedUnion("action", [
  z.object({ action: z.literal("createBooking"), payload: createBookingPayload }),
  z.object({ action: z.literal("findBooking"), payload: findBookingPayload }),
  z.object({ action: z.literal("rescheduleBooking"), payload: rescheduleBookingPayload }),
  z.object({ action: z.literal("cancelBooking"), payload: cancelBookingPayload }),
]);

export const callCRMFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => crmInput.parse(data))
  .handler(async ({ data }) => {
    const url = process.env.GOOGLE_APPS_SCRIPT_WEB_APP_URL || FALLBACK_CRM_URL;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: data.action, payload: data.payload }),
    });
    const json = (await response.json()) as Record<string, unknown> & { success?: boolean; message?: string };
    if (!json.success) {
      throw new Error(typeof json.message === "string" ? json.message : "CRM request failed.");
    }
    return json as Record<string, unknown>;
  });
