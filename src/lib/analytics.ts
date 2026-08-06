export type AnalyticsEvent =
  | "consultation_cta_click"
  | "projects_cta_click"
  | "project_filter_change"
  | "project_card_click"
  | "consultation_form_start"
  | "consultation_form_success"
  | "consultation_form_error"
  | "phone_click"
  | "email_click";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function trackEvent(event: AnalyticsEvent, properties: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer?.push({ event, ...properties });
}
