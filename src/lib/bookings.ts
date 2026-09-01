// CRM integration. All calls are routed through a TanStack server function
// that validates and sanitizes input with zod before forwarding to the
// Google Apps Script CRM. The Apps Script URL is server-only.
import { callCRMFn } from "./bookings.functions";

export type CRMAction = "createBooking" | "findBooking" | "rescheduleBooking" | "cancelBooking";

export interface CRMResponse<T = Record<string, unknown>> {
  success: boolean;
  message?: string;
  bookingReference?: string;
  booking?: BookingRecord;
  data?: T;
  [key: string]: unknown;
}

export interface BookingRecord {
  bookingReference: string;
  fullName: string;
  phoneNumber: string;
  emailAddress?: string;
  projectType: string;
  projectLocation?: string;
  preferredService?: string;
  approximateArea?: string;
  preferredDate?: string;
  preferredTime?: string;
  budgetRange?: string;
  projectDetails: string;
  privacyConsent?: string;
  bookingStatus?: string;
  notes?: string;
  leadSource?: string;
  submittedAt?: string;
}

const CREATE_RECOVERY_MESSAGE =
  "We could not confirm the booking response. Please try submitting again; the same request will not create a duplicate booking.";

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message.trim() : String(error ?? "").trim();
}

function isTransientBookingResponseError(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase();
  return (
    message.includes("inactivity timeout") ||
    message.includes("timed out") ||
    message.includes("timeout") ||
    message.includes("<!doctype") ||
    message.includes("<html") ||
    message.includes("unexpected token '<'") ||
    message.includes("booking service returned 502") ||
    message.includes("booking service returned 503") ||
    message.includes("booking service returned 504")
  );
}

function safeCRMError(error: unknown, action: CRMAction): Error {
  const message = getErrorMessage(error);
  if (action === "createBooking" && isTransientBookingResponseError(error)) {
    return new Error(CREATE_RECOVERY_MESSAGE);
  }
  if (
    !message ||
    message.includes("<!doctype") ||
    message.includes("<html") ||
    message.toLowerCase().includes("unexpected token")
  ) {
    return new Error("The booking service is temporarily unavailable. Please try again shortly.");
  }
  return new Error(message);
}

export async function callCRM<T = Record<string, unknown>>(
  action: CRMAction,
  payload: Record<string, unknown>,
): Promise<CRMResponse<T>> {
  const attempts = action === "createBooking" ? 2 : 1;
  let lastError: unknown;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const text = await callCRMFn({ data: { action, payload } as never });
      const data = JSON.parse(text) as CRMResponse<T>;
      if (!data.success) {
        throw new Error(data.message || "CRM request failed.");
      }
      return data;
    } catch (error) {
      lastError = error;
      const canRecover =
        action === "createBooking" && attempt === 0 && isTransientBookingResponseError(error);
      if (!canRecover) throw safeCRMError(error, action);
    }
  }

  throw safeCRMError(lastError, action);
}
