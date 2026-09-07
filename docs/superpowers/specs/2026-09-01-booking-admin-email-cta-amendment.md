# IG Sabroso Admin Email CTA Amendment

Date: 2026-09-01
Status: Approved staging requirement
Scope: Staging branch and Netlify Deploy Preview only. Production remains untouched until explicit approval.

## Requirement

All internal/admin booking lifecycle emails must use the same approved IG Sabroso visual language already established in the booking-email conversation:

- Navy: `#16263f`
- Orange: `#ff4b18`
- White primary surfaces
- Soft gray secondary surfaces
- Clean high-contrast typography
- Compact uppercase utility labels
- Rounded cards and buttons
- Responsive mobile stacking
- No unrelated visual system or generic Gmail template styling

## Admin CTA block

Every internal/admin lifecycle email must include an operations CTA block near the bottom of the message, above the footer.

### Primary CTA

**Label:** `VIEW APPOINTMENT`

Behavior for new and rescheduled bookings:

- Open Google Calendar filtered to the exact booking reference.
- Use the booking reference as the only search term; do not put customer PII into the URL.
- Recommended URL generated server-side by Apps Script:

```text
https://calendar.google.com/calendar/u/0/r/search?q=<URL_ENCODED_BOOKING_REFERENCE>
```

Behavior for cancelled bookings:

- Because the event is removed immediately under the approved self-service model, the CTA label becomes `OPEN CALENDAR` and routes to the calendar home/agenda rather than a deleted event.

### Secondary CTA

**Label:** `OPEN CRM RECORD`

Behavior:

- Open the Bookings CRM Google Sheet at the exact booking row.
- Build the link server-side from the configured spreadsheet and sheet metadata.
- Recommended Apps Script shape:

```javascript
function buildCrmRecordUrlV62_(sheet, row) {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  return ss.getUrl() + '#gid=' + sheet.getSheetId() + '&range=A' + row;
}
```

This avoids hard-coding a `gid` and keeps the link valid if the spreadsheet URL changes while the sheet remains the same.

## Visual treatment

Desktop Gmail:

- CTAs sit side-by-side when space permits.
- `VIEW APPOINTMENT` uses the primary orange fill with white text.
- `OPEN CRM RECORD` uses navy fill or a navy outline treatment with navy text on white, whichever matches the current approved admin email composition most faithfully.
- Minimum button height: 44px.
- Strong spacing from project details and footer.

Mobile Gmail:

- CTAs stack vertically at full width.
- Primary action first.
- Minimum 44px touch target.
- No horizontal overflow.
- Keep the CTA block inside the same responsive email container used by the existing branded admin notification.

## Lifecycle labels

- New booking: `VIEW APPOINTMENT` + `OPEN CRM RECORD`
- Rescheduled booking: `VIEW UPDATED APPOINTMENT` + `OPEN CRM RECORD`
- Cancelled booking: `OPEN CALENDAR` + `OPEN CRM RECORD`

## Security and privacy

- These CTAs appear only in internal/admin emails.
- Customer confirmation, reschedule, and cancellation emails must never expose CRM or internal Calendar links.
- Calendar URLs may contain only the booking reference, not customer PII.
- CRM access remains protected by Google Drive permissions even if the email is forwarded.
- Do not expose spreadsheet IDs, Calendar identifiers, or Apps Script endpoints in frontend/browser code.

## QA acceptance criteria

For each lifecycle email (new, rescheduled, cancelled):

1. Admin email renders with the approved IG Sabroso navy/orange branding.
2. Calendar CTA is visible and tappable on Gmail mobile and desktop.
3. CRM CTA is visible and tappable on Gmail mobile and desktop.
4. CRM CTA opens the correct booking row.
5. New/rescheduled Calendar CTA surfaces the matching booking reference in Calendar.
6. Cancelled Calendar CTA opens Calendar without targeting a deleted event.
7. No internal CTA appears in customer emails.
8. Buttons do not wrap, clip, or overflow at mobile widths.
9. Existing Reply to Client behavior remains available where appropriate.
10. Production source and production environment remain unchanged during staging QA.
