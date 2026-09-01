export type BookingNotification = {
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  projectType: string;
  projectLocation: string;
  preferredService: string;
  approximateArea: string;
  preferredDate: string;
  preferredTime: string;
  budgetRange: string;
  projectDetails: string;
  leadSource: string;
};

type NotificationEnvironment = Record<string, string | undefined>;

type NotificationResponse = Pick<Response, "ok" | "text">;

type NotificationFetch = (input: string, init: RequestInit) => Promise<NotificationResponse>;

type NotificationOptions = {
  env?: NotificationEnvironment;
  fetchImpl?: NotificationFetch;
};

type NotificationResult =
  { sent: true } | { sent: false; reason: "disabled" | "not_configured" | "delivery_failed" };

export async function sendBookingNotification(
  notification: BookingNotification,
  { env = process.env, fetchImpl = fetch }: NotificationOptions = {},
): Promise<NotificationResult> {
  if (env.BOOKING_NOTIFICATION_ENABLED !== "true") {
    return { sent: false, reason: "disabled" };
  }

  const url = env.BOOKING_NOTIFICATION_WEBHOOK_URL;
  const secret = env.BOOKING_NOTIFICATION_WEBHOOK_SECRET;
  if (!url || !secret) {
    return { sent: false, reason: "not_configured" };
  }

  try {
    const response = await fetchImpl(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ secret, notification }),
    });
    if (!response.ok) return { sent: false, reason: "delivery_failed" };

    const payload = JSON.parse(await response.text()) as { success?: boolean };
    return payload.success ? { sent: true } : { sent: false, reason: "delivery_failed" };
  } catch {
    return { sent: false, reason: "delivery_failed" };
  }
}
