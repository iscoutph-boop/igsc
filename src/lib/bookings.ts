// CRM integration with Google Apps Script Web App.
// Uses text/plain to avoid CORS preflight.

const GOOGLE_APPS_SCRIPT_WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbym6yZbnhNFA6xVAYRQhW1hB7lXGFVFXTKdgj3lUMZscjN2HZq6K547FZgFDiQkypTd9g/exec";

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
  const response = await fetch(GOOGLE_APPS_SCRIPT_WEB_APP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify({ action, payload }),
  });

  const data = (await response.json()) as CRMResponse<T>;

  console.log("IGS CRM response:", data);

  if (!data.success) {
    throw new Error(data.message || "CRM request failed.");
  }

  return data;
}
