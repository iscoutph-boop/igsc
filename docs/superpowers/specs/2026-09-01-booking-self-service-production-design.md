# IG Sabroso Booking Self-Service Production Design

Date: 2026-09-01
Status: Proposed for staging implementation and user acceptance testing
Scope: Staging branch and Netlify Deploy Preview only. Production `main` and `igsabroso.com` remain untouched until explicit release approval.

## Objective

Polish the consultation booking system into a production-ready self-service flow with consistent website UX, reliable CRM/calendar state transitions, and branded Gmail communication across the full booking lifecycle.

Approved behavior: **Immediate self-service**.

- Creating a booking immediately records the consultation request and creates the pending calendar entry.
- Rescheduling immediately updates the booking's preferred date/time, updates the appointment sheet, and replaces the calendar event.
- Cancelling immediately marks the booking cancelled, marks the appointment cancelled, and removes the calendar event.
- UI and email language must describe completed state changes accurately. Do not call an immediate change a pending "request".

## System Boundaries

### Website frontend

Relevant existing files:

- `src/routes/consultation.tsx`
- `src/components/booking-modals.tsx`
- `src/components/schedule-picker.tsx`
- `src/lib/bookings.ts`
- `src/lib/bookings.functions.ts`

The current consultation page and Manage Booking modal are retained. This is a refinement, not a redesign of unrelated site sections.

### Server integration

`src/lib/bookings.functions.ts` remains the server-only gateway. It validates and sanitizes form data before forwarding actions to Google Apps Script through `GOOGLE_APPS_SCRIPT_WEB_APP_URL`.

Google Apps Script remains the source of truth for:

- booking reference generation
- Bookings CRM updates
- Appointment Calendar sheet updates
- Google Calendar event creation/deletion
- customer lifecycle emails
- internal/admin lifecycle emails

### Email authority

Google Apps Script becomes the **single booking-email authority** for this release.

The temporary/redundant Netlify booking-notification path must not send lifecycle emails. This avoids duplicate admin messages and reduces production failure modes.

## Booking Lifecycle

### 1. Create booking

State:

- Booking Status: `New`
- Appointment Schedule Status: `Pending`
- Calendar event: created at selected preferred date/time

Customer email:

- Subject: `IG Sabroso Appointment Request Received — <reference>`
- Branded responsive HTML
- Booking reference
- Preferred schedule
- Project type/location
- Clear next-step explanation
- Manage-booking instruction

Admin email:

- Subject: `New consultation request - <reference> - <client name>`
- Branded responsive HTML
- Client contact
- Project snapshot
- Schedule
- Project details
- Reply-to-client action

### 2. Find/manage booking

Authentication remains lightweight and appropriate for consultation management:

- booking reference
- matching email address or phone number

The modal displays:

- booking reference
- client name
- project type/service
- preferred schedule in Asia/Manila
- contact
- project location
- current status

Cancelled bookings cannot be rescheduled.

### 3. Reschedule booking

Customer action label:

- `Reschedule booking`

Confirmation action:

- `Confirm new schedule`

Backend behavior on success:

- validate booking reference/contact
- reject cancelled bookings
- update `Preferred Date`
- update `Preferred Time`
- set Booking Status to `Rescheduled`
- set `Reschedule Requested?` to `Yes` for historical compatibility
- append timestamped audit note
- update Appointment Calendar row to `Rescheduled`
- delete only the old Google Calendar event matching the exact booking reference
- create replacement Google Calendar event at the new schedule

Customer result UI:

- `Booking rescheduled`
- show new schedule and reference
- no wording that implies staff approval is still required

Customer email:

- Subject: `IG Sabroso Booking Rescheduled — <reference>`
- Branded HTML matching the primary booking-confirmation visual system
- Previous and new schedule when available
- Booking reference
- Clear statement that the preferred schedule has been updated

Admin email:

- Subject: `Booking rescheduled - <reference> - <client name>`
- Branded lifecycle notification
- client/contact information
- previous schedule
- new schedule
- notes/reason if supplied
- direct reply action

### 4. Cancel booking

Customer action label:

- `Cancel booking`

Destructive confirmation action:

- `Yes, cancel booking`

Secondary action:

- `Keep booking`

Backend behavior on success:

- validate booking reference/contact
- if already cancelled, return a stable cancelled state rather than performing duplicate destructive work
- set Booking Status to `Cancelled`
- set `Cancel Requested?` to `Yes` for historical compatibility
- append cancellation reason and timestamped audit note
- set Appointment Calendar row to `Cancelled`
- delete only the Google Calendar event carrying the exact booking reference

Customer result UI:

- `Booking cancelled`
- show booking reference
- explain that no appointment remains scheduled
- offer a clear route to submit a new consultation later

Customer email:

- Subject: `IG Sabroso Booking Cancelled — <reference>`
- Branded responsive HTML
- booking reference
- cancelled schedule when available
- cancellation reason when supplied
- clear confirmation that the calendar booking was removed

Admin email:

- Subject: `Booking cancelled - <reference> - <client name>`
- branded lifecycle notification
- client/contact information
- cancelled schedule
- reason
- reply action

## Website UX Requirements

### Consultation form

Preserve the current visual language and existing working fields.

Refinements:

- keep dynamic customer email; any syntactically valid address can be used
- improve inline validation/error copy
- make success state explicitly explain that the customer receives a confirmation email when an email was supplied
- maintain accessible labels, focus states, keyboard behavior, and loading states

### Manage Booking modal

Retain the current modal architecture and animations but improve clarity and consistency.

Required refinements:

- consistent button radii/weights with consultation page CTA system
- clearer status badge hierarchy
- separate normal and destructive actions visually
- immediate self-service wording throughout
- prevent destructive double-submit while loading
- preserve modal scrollability on small mobile screens
- maintain Escape close and backdrop handling
- ensure focus-visible states and adequate touch target sizes
- use `aria-live` or role status/alert for success and failure transitions

## Validation and Data Contract

Normalize cancellation reason naming across frontend/server/backend to:

`cancellationReason`

The current mismatch between frontend `cancelReason` and server schema `cancellationReason` must be removed.

All actions remain server validated with zod before reaching Apps Script.

Do not expose the Apps Script Web App URL or any secret in browser code.

## Error Handling

- Backend 4xx/5xx: show a concise user-safe message and preserve form state where practical.
- Apps Script returns `success: false`: surface its safe message through the server function.
- Email failure after CRM/calendar success must not roll back a completed booking state. Record the issue in warnings/logs for QA.
- Reschedule calendar replacement failure must be treated as an actionable backend error and not silently present a completed state when calendar state is uncertain.
- Cancellation of an already-cancelled booking is idempotent from the customer's perspective.

## Testing Strategy

### Automated

Add or update tests for:

- create booking server validation
- find booking validation
- reschedule contract and status
- cancellation reason contract
- cancelled booking cannot reschedule
- Manage Booking lookup states
- reschedule success state wording
- cancel confirmation and success wording
- loading/disabled states
- error rendering
- email template builder content where testable

Run the full existing test suite and require zero regressions.

### Staging integration QA

Use Netlify Deploy Preview only.

Perform at least one fresh lifecycle test with a QA booking:

1. Create booking with a reachable customer email.
2. Verify Bookings CRM row.
3. Verify Appointment Calendar row.
4. Verify Google Calendar event.
5. Verify branded customer create email.
6. Verify branded admin create email.
7. Find booking using reference + contact.
8. Reschedule booking.
9. Verify CRM status/date/time changed to `Rescheduled`.
10. Verify Appointment Calendar row changed.
11. Verify old calendar event removed and new event created.
12. Verify branded customer reschedule email.
13. Verify branded admin reschedule email.
14. Find booking again.
15. Cancel booking.
16. Verify CRM status `Cancelled`.
17. Verify Appointment Calendar `Cancelled`.
18. Verify calendar event removed.
19. Verify branded customer cancellation email.
20. Verify branded admin cancellation email.
21. Verify cancelled booking no longer offers Reschedule/Cancel actions.

### Responsive and accessibility QA

Check at minimum:

- iPhone-size viewport
- Android-size viewport
- tablet
- desktop

Validate:

- no clipped modal content
- no horizontal overflow
- keyboard/focus navigation
- disabled/loading state legibility
- error and success announcements
- adequate contrast and touch targets

## Release Gates

Production release is blocked until all are true:

- staging lifecycle test passes end-to-end
- customer/admin email UI approved on mobile Gmail and desktop Gmail
- full automated test suite passes
- Netlify preview build is `ready`
- secret scan reports zero matches
- no production environment variable/source change has occurred during staging QA
- user explicitly approves production promotion

Production deployment must be a separate step after approval. Do not merge the staging PR or modify `main` as part of staging implementation.

## Out of Scope

- payment processing
- customer accounts/passwords
- staff approval dashboard
- SMS notifications
- database migration away from Google Sheets
- unrelated visual redesigns of the IG Sabroso website
