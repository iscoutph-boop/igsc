# IG Sabroso Google Apps Script integration

## Approved V4 email UI

`booking-notification-v4.gs` is the approved responsive internal booking-notification renderer. It is deliberately isolated from the CRM logic.

### What it changes

- Internal booking notification subject and visual HTML body.
- Responsive Gmail desktop/mobile layout.
- Plain-text fallback.
- Customer `Reply-To` when a valid email is submitted.
- `Reply to client` CTA, with phone fallback if the booking has no email.
- HTML escaping for customer-supplied values.

### What it must not change

- Booking reference generation.
- Google Sheets writes.
- Google Calendar creation/update logic.
- `createBooking`, `findBooking`, `rescheduleBooking`, or `cancelBooking` response contracts.
- Existing staging/production recipient configuration.

## Integration hook

The current Apps Script project is bound to the Google Sheet and is not exposed through the connected Drive API. Integrate the module inside the existing Apps Script project rather than replacing the CRM script.

1. Add the contents of `booking-notification-v4.gs` to the existing Apps Script project as a new script file, e.g. `BookingNotificationV4.gs`.
2. In the existing `createBooking` flow, locate only the current internal `MailApp.sendEmail(...)` block that produces the plain booking notification.
3. Replace that notification block with:

```javascript
sendBookingNotificationV4_(EXISTING_NOTIFICATION_RECIPIENT, bookingReference, payload);
```

Use the existing notification-recipient variable/configuration from the current script. Do not introduce a second hardcoded recipient.

4. Leave the Sheets write, Calendar event creation, booking reference generation, and return JSON exactly where they are.
5. Save, create a new Web App version, and keep the existing deployment URL so the website staging environment does not need to change.

## Staging acceptance test

Submit one staging booking using a clearly labeled QA name and verify all of the following before any production release:

- Gmail receives the approved V4 branded layout.
- Subject is `New consultation request - <reference> - <client name>`.
- Gmail Reply targets the submitted customer email when present.
- Booking reference and all submitted fields are correct.
- Google Sheets contains the same booking.
- Google Calendar contains the same appointment.
- Manage Booking lookup still succeeds.
- Reschedule still succeeds.
- Cancellation and cancellation reason still succeed.
- No production branch merge or production deployment occurs until final approval.
