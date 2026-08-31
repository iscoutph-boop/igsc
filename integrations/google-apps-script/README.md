# IG Sabroso Google Apps Script integration

This folder contains **isolated, staging-first patches** for the existing Google Sheet-bound Apps Script CRM. The bound project itself is not exposed by the connected Drive API, so these modules must be added to that existing Apps Script project; do not replace the CRM with a new script.

## Current staging findings

Real staging submissions proved two backend defects in the active Apps Script:

1. The website correctly submits `preferredTime` as 24-hour `HH:mm` (for example `13:30`). Google Sheets can store that as 1:30 PM, but the current customer email and Calendar creation code can reinterpret it as 1:30 AM.
2. Sending `1:30 PM` instead is **not** a safe workaround: the current backend parser reduces that value to 1:30 AM before/while writing the booking.
3. Cancellation now reaches the CRM with the correct reason, but the active Calendar event is not removed when the booking is cancelled.

Therefore, **keep the website/server contract as `HH:mm`** and fix the Apps Script parsing boundary. Do not convert the website payload to 12-hour text.

---

## V5 booking backend patch

`booking-backend-v5-patch.gs` is the tested compatibility module for time parsing and Calendar cleanup.

### What V5 fixes

- Explicitly parses `HH:mm` in `Asia/Manila`.
- Correctly renders `13:30` as `1:30 PM`.
- Also accepts human 12-hour values without losing AM/PM.
- Builds Calendar `Date` values using `Utilities.parseDate(..., 'Asia/Manila', ...)` rather than implementation-dependent Date-string parsing.
- Provides one canonical customer-facing schedule formatter.
- Provides a Calendar creator that uses the same canonical Philippine-time value.
- Provides cancellation cleanup that deletes only an `IG Sabroso Consultation` event carrying the exact booking reference.

### What V5 must not change

- Booking reference generation.
- Existing Google Sheet column order or CRM history.
- Website payload field names.
- Authentication/contact verification for find/reschedule/cancel.
- Existing recipient addresses or Calendar selection.
- Existing API response JSON.

### Install V5 into the bound Apps Script

1. Open the **existing Apps Script project bound to the IG Sabroso CRM spreadsheet**.
2. Add a new script file named `BookingBackendV5.gs`.
3. Copy the complete contents of `booking-backend-v5-patch.gs` into that file.
4. Keep the website request value `payload.preferredTime` unchanged (`HH:mm`).

### Hook 1 — Calendar creation in `createBooking`

Find the existing Calendar event creation block in the current `createBooking` flow. Keep the same Calendar object/configuration already used by the script, but replace only the date/time construction and `createEvent(...)` call with:

```javascript
createBookingCalendarEventV5_(
  EXISTING_CALENDAR_OBJECT,
  bookingReference,
  payload
);
```

`EXISTING_CALENDAR_OBJECT` means the Calendar instance already used by the current script. Do **not** switch calendars or hardcode a new Calendar ID.

### Hook 2 — customer confirmation schedule

Where the current customer confirmation email builds the displayed preferred schedule, replace only the existing date/time formatter with:

```javascript
const preferredScheduleV5 = formatBookingScheduleV5_(
  payload.preferredDate,
  payload.preferredTime
);
```

Use `preferredScheduleV5` in the current plain-text/HTML customer confirmation wherever the old schedule text is inserted. Keep the current recipient, subject, surrounding message, and send timing unchanged.

### Hook 3 — Calendar cleanup in `cancelBooking`

After the existing cancellation has been authenticated and the CRM row has been successfully marked cancelled, call:

```javascript
deleteBookingCalendarEventsV5_(
  EXISTING_CALENDAR_OBJECT,
  bookingReference,
  EXISTING_BOOKING_PREFERRED_DATE
);
```

Use the same Calendar object already used by booking creation. `EXISTING_BOOKING_PREFERRED_DATE` must be the stored `YYYY-MM-DD` date for the booking being cancelled.

The helper searches only that booking date, then refuses to delete anything unless the event starts with `IG Sabroso Consultation` **and** carries the exact booking reference.

---

## Approved V4 internal email UI

`booking-notification-v4.gs` is the approved responsive **internal booking-notification** renderer. It remains deliberately isolated from the CRM logic.

### What V4 changes

- Internal booking notification subject and visual HTML body.
- Responsive Gmail desktop/mobile layout.
- Plain-text fallback.
- Customer `Reply-To` when a valid email is submitted.
- `Reply to client` CTA, with phone fallback if the booking has no email.
- HTML escaping for customer-supplied values.

### What V4 must not change

- Customer confirmation email.
- Booking reference generation.
- Google Sheets writes.
- Google Calendar logic.
- `createBooking`, `findBooking`, `rescheduleBooking`, or `cancelBooking` response contracts.
- Existing staging/production recipient configuration.

### Install V4

1. Add a new Apps Script file named `BookingNotificationV4.gs`.
2. Copy the complete contents of `booking-notification-v4.gs` into it.
3. In `createBooking`, locate only the current **internal owner/team** `MailApp.sendEmail(...)` notification block.
4. Replace that internal notification block with:

```javascript
sendBookingNotificationV4_(
  EXISTING_NOTIFICATION_RECIPIENT,
  bookingReference,
  payload
);
```

Use the existing internal notification recipient variable/configuration. Do not hardcode a second recipient, and do not replace the separate customer confirmation message.

---

## Deployment procedure

After V5 and V4 are inserted into the existing bound project:

1. Save the Apps Script project.
2. Confirm the Apps Script project timezone is **Asia/Manila**. V5 is explicit about timezone, but the project should still match the business locale.
3. Create a **new Web App version** of the existing deployment.
4. Keep the existing Web App deployment URL so the Netlify staging environment does not need a secret/config change.
5. Do not merge the website staging PR to `main` yet.

## Required staging acceptance test

Submit one clearly labeled QA booking using an **afternoon** slot such as `1:30 PM` through the real website picker. Verify all of the following:

- Google Sheets shows **1:30 PM**.
- Customer Gmail confirmation shows **1:30 PM**.
- Google Calendar starts at **13:30 Asia/Manila**.
- Approved V4 internal email is received.
- V4 subject is `New consultation request - <reference> - <client name>`.
- Gmail Reply targets the submitted customer email when present.
- Manage Booking lookup succeeds.
- Reschedule succeeds and preserves the correct PM time.
- Cancellation succeeds with the submitted cancellation reason.
- The matching Calendar event disappears after cancellation.
- No unrelated Calendar event is changed.

Only after every item above passes should the staging PR be considered for production approval.
