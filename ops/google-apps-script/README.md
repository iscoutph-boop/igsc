# IG Sabroso Google Apps Script — V4 Email UI Handoff

## Status

The Gmail UI V4 has been visually approved after a real Gmail iOS rendering test.

This folder contains the presentation-only renderer for the existing Google Apps Script booking CRM. It does **not** replace the working CRM, Google Sheets writes, Google Calendar creation, booking lookup, reschedule, or cancellation logic.

## File to add in Apps Script

Create a new script file in the existing Apps Script project:

`IGS_Email_Notification_V4.gs`

Copy the complete contents of:

`ops/google-apps-script/IGS_Email_Notification_V4.gs`

into that Apps Script file.

## One existing line/call to replace

In the existing booking-creation handler, locate the admin notification that currently produces the plain email with a subject similar to:

`New Website Booking — IGS-...`

It will normally be a `MailApp.sendEmail(...)` or `GmailApp.sendEmail(...)` call.

Replace **only that admin-notification call** with:

```javascript
sendIgSabrosoConsultationEmailV4FromPayload_(
  ADMIN_EMAIL,
  payload,
  bookingReference
);
```

Use the existing admin/notification-email variable from the current script instead of inventing a new `ADMIN_EMAIL` constant if the variable has another name.

Do **not** change:

- `doPost(e)` routing
- booking reference generation
- Google Sheets append/update logic
- Google Calendar event creation
- `findBooking`
- `rescheduleBooking`
- `cancelBooking`
- the deployed web-app URL
- any separate client confirmation email unless separately approved

## Expected payload fields

The V4 adapter accepts the same fields already sent by the website:

```text
fullName
phoneNumber
emailAddress
projectType
projectLocation
preferredService
approximateArea
preferredDate
preferredTime
budgetRange
projectDetails
```

The generated `bookingReference` is passed separately.

## Gmail behavior

The renderer sends:

- production-style subject: `New consultation request - <reference> - <client>`
- branded IG Sabroso HTML body
- plain-text fallback
- responsive desktop/mobile email CSS
- display name: `IG Sabroso Appointments`
- `Reply-To`: the submitted client email when provided
- orange `REPLY TO CLIENT →` mailto CTA when the client supplied an email

The authenticated Gmail account remains the actual sender unless a verified Gmail alias/domain mailbox is configured later.

## Staging verification checklist

After adding the module and replacing the one notification call:

1. Save the Apps Script project.
2. Deploy a **new version** of the existing Web App deployment. Do not create a different endpoint.
3. Keep `Execute as: Me` and the existing access level used by the working deployment.
4. Confirm the `/exec` URL remains the same deployment endpoint already configured in Netlify deploy-preview.
5. Submit one staging consultation from the Netlify deploy preview.
6. Verify Google Sheets receives the booking.
7. Verify Google Calendar receives the appointment.
8. Verify Gmail receives the V4 branded notification.
9. In Gmail, press Reply and confirm the recipient is the submitted client email.
10. Verify Manage Booking lookup still works.
11. Cancel the staging booking and confirm the cancellation reason is preserved.

## Production gate

Do not merge the staging PR or publish the change to the live domain until the real Apps Script-generated V4 message has been visually verified in Gmail mobile and desktop and the existing CRM/Calendar tests still pass.
