// Online booking stays off on Cloudflare until the verified CRM bridge is configured.
// Test mode preserves existing booking-flow unit tests without exposing live submissions.
export function isOnlineBookingEnabled(mode: string, flag?: string): boolean {
  return mode === "test" || flag === "true";
}

export const ONLINE_BOOKING_ENABLED = isOnlineBookingEnabled(
  import.meta.env.MODE,
  import.meta.env.VITE_IGS_ONLINE_BOOKING_ENABLED,
);
