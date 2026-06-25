// CRM integration. All calls are routed through a TanStack server function
// that validates and sanitizes input with zod before forwarding to the
// Google Apps Script CRM. The Apps Script URL is server-only.
import { callCRMFn } from "./bookings.functions";

export type CRMAction =
  | "createBooking"
  | "findBooking"
  | "rescheduleBooking"
  | "cancelBooking";

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
  preferredDate?: string;
  preferredTime?: string;
  budgetRange?: string;
  projectDetails: string;
  bookingStatus?: string;
  notes?: string;
  leadSource?: string;
  submittedAt?: string;
}

export async function callCRM<T = Record<string, unknown>>(
  action: CRMAction,
  payload: Record<string, unknown>,
): Promise<CRMResponse<T>> {
  const text = await callCRMFn({ data: { action, payload } as never });
  const data = JSON.parse(text) as CRMResponse<T>;
  if (!data.success) {
    throw new Error(data.message || "CRM request failed.");
  }
  return data;
}
