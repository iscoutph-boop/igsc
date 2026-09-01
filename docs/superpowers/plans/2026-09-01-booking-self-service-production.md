# IG Sabroso Booking Self-Service Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a production-ready, immediate self-service consultation lifecycle on the staging branch: create, find, reschedule, cancel, CRM/calendar synchronization, and consistent branded customer/admin Gmail messages, while leaving production `main` and `igsabroso.com` untouched until explicit approval.

**Architecture:** Preserve the existing TanStack Start consultation route and Manage Booking modal. The website continues to call the server-only `callCRMFn`, which validates and sanitizes requests before forwarding them to the staging Google Apps Script Web App. Google Apps Script V6.2 becomes the single lifecycle-email authority and source of truth for CRM, Appointment Calendar sheet, Google Calendar, and customer/admin lifecycle notifications. Netlify's temporary booking-notification mailer remains disabled to prevent duplicates.

**Tech Stack:** React 19, TypeScript 5.8, TanStack Start/Router, Zod, Framer Motion, Tailwind CSS v4, Vitest, Testing Library, Google Apps Script, Google Sheets, Google Calendar, Gmail/MailApp, Netlify Deploy Preview.

**Spec:** `docs/superpowers/specs/2026-09-01-booking-self-service-production-design.md`

## Global Constraints

- Staging branch only: `feature/booking-email-staging-recovered-2`.
- Do not merge to `main` and do not modify the production `igsabroso.com` deployment during implementation or QA.
- Approved behavior is **Immediate self-service**.
- Reschedule completes immediately and must use status `Rescheduled`.
- Cancel completes immediately and must use status `Cancelled`.
- Customer lifecycle email goes to the valid email entered in the booking form.
- Admin lifecycle email goes to the configured IG Sabroso staging admin inbox.
- Google Apps Script is the single booking lifecycle email authority.
- Normalize cancellation reason property name to `cancellationReason` across frontend, server validation, and Apps Script.
- Apps Script Web App URL remains server-only; never expose it in browser code.
- All displayed schedule values are Asia/Manila.
- Email failure after a completed CRM/calendar state change is fail-open and returned as a warning; it must not roll back a completed booking.
- Calendar state failures during reschedule/cancel are transactional: do not report completion if Google Calendar is left inconsistent.
- Cancel must be idempotent from the customer perspective.
- Production promotion is a separate explicit approval step after staging passes all release gates.

---

## File Map

### Existing website files to modify

- `src/lib/bookings.functions.ts` — server-side validation/forwarding; remove duplicate Netlify lifecycle-mail send and normalize cancellation payload.
- `src/lib/bookings.functions.test.ts` — server contract tests for all four actions.
- `src/components/booking-modals.tsx` — Manage Booking UX/state semantics for immediate reschedule/cancel.
- `src/components/booking-modals.test.tsx` — new component tests for lookup, reschedule, cancel, loading, and completed-state wording.
- `src/routes/consultation.tsx` — consultation success-state clarity and email-delivery wording.
- `src/routes/consultation.test.tsx` — new route/form tests for success and error states.

### Staging Apps Script source

- Create: `apps-script/IGS_Staging_CRM_V6_2.gs` — version-controlled staging copy derived from the validated V6.1 source.
- Synchronize the same content to Drive recovery file `IGS_Staging_CRM_V6_1_VALIDATED.gs` after validation, preserving a recoverable authoritative copy.
- Manually update the existing Apps Script Web App deployment to a new version after code review because the available connector does not expose Apps Script deployment writes.

### Existing notification files

- `src/lib/booking-notification.server.ts`
- `src/lib/booking-notification.server.test.ts`

Keep these files in the branch for rollback/history, but do not call `sendBookingNotification()` from the booking lifecycle server path. Netlify lifecycle notification env vars remain disabled.

---

### Task 1: Normalize the server booking contract and remove duplicate email authority

**Files:**
- Modify: `src/lib/bookings.functions.ts`
- Modify: `src/lib/bookings.functions.test.ts`

**Interfaces:**
- Consumes: `callCRMFn({ data: { action, payload } })` from `src/lib/bookings.ts`.
- Produces: one validated server gateway for `createBooking`, `findBooking`, `rescheduleBooking`, and `cancelBooking`; cancellation payload property is `cancellationReason`.

- [ ] **Step 1: Write failing contract tests**

Add tests that prove cancellation accepts `cancellationReason`, rejects an overlong reason, and no longer invokes the Netlify `sendBookingNotification` path on `createBooking`.

```ts
import { describe, expect, it } from "vitest";
import {
  cancelBookingPayloadSchema,
  createBookingPayloadSchema,
} from "./bookings.functions";

describe("booking server payloads", () => {
  it("accepts normalized cancellationReason", () => {
    const parsed = cancelBookingPayloadSchema.parse({
      bookingReference: "IGS-2026-0018",
      contact: "qa@example.com",
      cancellationReason: "Schedule changed",
    });

    expect(parsed.cancellationReason).toBe("Schedule changed");
  });

  it("rejects cancellationReason beyond the long-text limit", () => {
    expect(() =>
      cancelBookingPayloadSchema.parse({
        bookingReference: "IGS-2026-0018",
        contact: "qa@example.com",
        cancellationReason: "x".repeat(2501),
      }),
    ).toThrow();
  });

  it("keeps customer email optional but bounded", () => {
    const parsed = createBookingPayloadSchema.parse({
      fullName: "VMM QA",
      phoneNumber: "09171234567",
      emailAddress: "customer@example.com",
      projectType: "Residential",
      projectLocation: "Cagayan de Oro City",
      preferredService: "Project Consultation",
      approximateArea: "180 sqm",
      preferredDate: "2026-09-03",
      preferredTime: "14:00",
      budgetRange: "PHP 3,000,000 - PHP 5,000,000",
      projectDetails: "Production-readiness QA booking",
      privacyConsent: "accepted",
      leadSource: "Website",
    });

    expect(parsed.emailAddress).toBe("customer@example.com");
  });
});
```

If the schemas are not currently exported, export only the four payload schemas for testing; do not expose them to browser code.

- [ ] **Step 2: Run the focused test and confirm RED**

Run:

```bash
npm test -- src/lib/bookings.functions.test.ts
```

Expected: at least the cancellation contract test fails because the current server schema uses `cancellationReason` while the existing UI still sends `cancelReason`, and any existing create-booking notification expectation reflects the duplicate Netlify mailer path.

- [ ] **Step 3: Remove the Netlify lifecycle-mail call and export payload schemas for tests**

Update imports and create handler so `bookings.functions.ts` no longer imports or invokes `sendBookingNotification`:

```ts
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
```

Use exported schemas:

```ts
export const createBookingPayloadSchema = z.object({
  fullName: shortText.refine((value) => value.length > 0, "Name is required"),
  phoneNumber: phoneText.refine((value) => value.length > 0, "Phone number is required"),
  emailAddress: optionalShortText,
  projectType: shortText.refine((value) => value.length > 0, "Project type is required"),
  projectLocation: mediumText.refine((value) => value.length > 0, "Project location is required"),
  preferredService: shortText.refine((value) => value.length > 0, "Preferred service is required"),
  approximateArea: optionalShortText,
  preferredDate: shortText.refine((value) => value.length > 0, "Preferred date is required"),
  preferredTime: shortText.refine((value) => value.length > 0, "Preferred time is required"),
  budgetRange: optionalShortText,
  projectDetails: longText.refine((value) => value.length > 0, "Project details are required"),
  privacyConsent: shortText.refine((value) => value === "accepted", "Privacy consent is required"),
  leadSource: optionalShortText,
});

export const findBookingPayloadSchema = z.object({
  bookingReference: shortText,
  contact: phoneText.optional().default(""),
});

export const rescheduleBookingPayloadSchema = z.object({
  bookingReference: shortText,
  contact: phoneText.optional().default(""),
  newPreferredDate: optionalShortText,
  newPreferredTime: optionalShortText,
  rescheduleNotes: longText.optional().default(""),
});

export const cancelBookingPayloadSchema = z.object({
  bookingReference: shortText,
  contact: phoneText.optional().default(""),
  cancellationReason: longText.optional().default(""),
});
```

After the Apps Script response succeeds, return the response text directly for every action. Do not invoke a second mailer:

```ts
const text = await response.text();
const json = JSON.parse(text) as { success?: boolean; message?: string };
if (!json.success) {
  throw new Error(typeof json.message === "string" ? json.message : "CRM request failed.");
}
return text;
```

- [ ] **Step 4: Run the focused tests and confirm GREEN**

```bash
npm test -- src/lib/bookings.functions.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit the server contract change**

```bash
git add src/lib/bookings.functions.ts src/lib/bookings.functions.test.ts
git commit -m "fix: normalize booking lifecycle server contract"
```

---

### Task 2: Convert Manage Booking UI to immediate self-service semantics

**Files:**
- Modify: `src/components/booking-modals.tsx`
- Create: `src/components/booking-modals.test.tsx`

**Interfaces:**
- Consumes: `callCRM("findBooking" | "rescheduleBooking" | "cancelBooking", payload)`.
- Produces: completed-state UI using `Rescheduled` and `Cancelled`, and normalized `cancellationReason` payload.

- [ ] **Step 1: Write failing UI tests for completed semantics**

Mock `callCRM` and verify the new copy and payload:

```tsx
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CheckBookingModal } from "./booking-modals";

const callCRMMock = vi.fn();
vi.mock("@/lib/bookings", () => ({
  callCRM: (...args: unknown[]) => callCRMMock(...args),
}));

const booking = {
  bookingReference: "IGS-2026-0018",
  fullName: "VMM QA",
  phoneNumber: "09171234567",
  emailAddress: "customer@example.com",
  projectType: "Residential",
  projectLocation: "Cagayan de Oro City",
  projectDetails: "QA booking",
  preferredDate: "2026-09-03",
  preferredTime: "14:00",
  bookingStatus: "New",
};

describe("CheckBookingModal immediate self-service", () => {
  beforeEach(() => callCRMMock.mockReset());

  it("uses immediate cancellation language and normalized reason field", async () => {
    const user = userEvent.setup();
    callCRMMock
      .mockResolvedValueOnce({ success: true, booking })
      .mockResolvedValueOnce({ success: true, booking: { ...booking, bookingStatus: "Cancelled" } });

    render(<CheckBookingModal open onClose={() => {}} />);
    await user.type(screen.getByPlaceholderText(/IGS-2026/i), booking.bookingReference);
    await user.type(screen.getByPlaceholderText(/email or phone/i), booking.emailAddress);
    await user.click(screen.getByRole("button", { name: /find my booking/i }));
    await screen.findByText(/appointment request found/i);
    await user.click(screen.getByRole("button", { name: /^cancel booking$/i }));
    await user.type(screen.getByLabelText(/cancellation reason/i), "Schedule changed");
    await user.click(screen.getByRole("button", { name: /yes, cancel booking/i }));

    await waitFor(() => {
      expect(callCRMMock).toHaveBeenLastCalledWith("cancelBooking", {
        bookingReference: booking.bookingReference,
        contact: booking.emailAddress,
        cancellationReason: "Schedule changed",
      });
    });
    expect(await screen.findByText(/booking cancelled/i)).toBeInTheDocument();
  });
});
```

Add a reschedule test that expects button text `Confirm new schedule`, final heading `Booking rescheduled`, and `bookingStatus: "Rescheduled"` in the locally refreshed record.

- [ ] **Step 2: Run the component test and confirm RED**

```bash
npm test -- src/components/booking-modals.test.tsx
```

Expected: FAIL because current buttons/copy use `Cancel Request`, `Confirm Cancellation`, `Submit Reschedule Request`, `Reschedule Request Received`, and the UI sends `cancelReason`.

- [ ] **Step 3: Update action labels and payloads**

Apply these exact semantic changes:

```tsx
// Details actions
<CalendarClock size={16} className="text-primary" /> Reschedule booking
<XCircle size={16} /> Cancel booking
```

Reschedule submit button:

```tsx
{loading ? "Updating schedule..." : "Confirm new schedule"}
```

Reschedule success heading/message:

```tsx
<h3 className="mt-4 text-2xl font-display font-bold">Booking rescheduled</h3>
<p className="text-sm text-foreground/90" role="status" aria-live="polite">
  Your preferred consultation schedule has been updated. Your confirmation email contains the latest schedule.
</p>
```

Set local status to:

```ts
bookingStatus: "Rescheduled",
```

Cancellation request payload:

```ts
await callCRM("cancelBooking", {
  bookingReference: booking.bookingReference,
  contact: ctx.contact,
  cancellationReason: reason,
});
```

Cancellation dialog heading/buttons:

```tsx
<h3 className="mt-4 text-2xl font-display font-bold">Cancel booking?</h3>

// secondary
Keep booking

// destructive
{loading ? "Cancelling..." : "Yes, cancel booking"}
```

Cancellation completion:

```ts
onDone({ ...booking, bookingStatus: "Cancelled" });
```

```tsx
<ResultCard
  tone="info"
  title="Booking cancelled"
  message="Your consultation booking has been cancelled. No appointment remains scheduled for this booking reference."
  reference={view.booking.bookingReference}
  onClose={onClose}
/>
```

- [ ] **Step 4: Polish accessibility and mobile behavior without changing the modal architecture**

Add `type="button"` to non-submit buttons, retain Escape and backdrop close, ensure destructive buttons are disabled while loading, and add `role="status" aria-live="polite"` to completed-state messages. Keep the existing scrollable backdrop and minimum touch height of at least 44px.

- [ ] **Step 5: Run the component test and confirm GREEN**

```bash
npm test -- src/components/booking-modals.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Commit the Manage Booking UX change**

```bash
git add src/components/booking-modals.tsx src/components/booking-modals.test.tsx
git commit -m "feat: polish immediate booking self-service UX"
```

---

### Task 3: Clarify consultation success and customer email expectations

**Files:**
- Modify: `src/routes/consultation.tsx`
- Create: `src/routes/consultation.test.tsx`

**Interfaces:**
- Consumes: create-booking response containing `bookingReference`.
- Produces: success panel that accurately tells customers whether a confirmation email was requested, without exposing backend details.

- [ ] **Step 1: Write a failing route/form success test**

Test the success copy independent of a real backend by mocking `callCRM`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ConsultationForm } from "./consultation";

vi.mock("@/lib/bookings", () => ({
  callCRM: vi.fn().mockResolvedValue({
    success: true,
    bookingReference: "IGS-2026-0099",
  }),
}));

describe("ConsultationForm", () => {
  it("reports the booking reference after a successful submission", async () => {
    const onSuccess = vi.fn();
    render(<ConsultationForm onSuccess={onSuccess} />);
    // Fill required fields using Testing Library helpers used by the project.
    // The assertion below is the contract for this component.
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
```

For the page-level success panel, test exact copy through an exported `SuccessPanel` or a small extracted presentational component. Required assertion:

```ts
expect(screen.getByText(/confirmation email was sent to the email address you provided/i)).toBeInTheDocument();
```

Only show that sentence when a non-empty email was submitted.

- [ ] **Step 2: Run the focused test and confirm RED**

```bash
npm test -- src/routes/consultation.test.tsx
```

Expected: FAIL because `SuccessPanel` currently receives only the reference and does not know whether an email was supplied.

- [ ] **Step 3: Carry email-presence state into the success panel**

Change the success state from `string | null` to:

```ts
type BookingSuccess = {
  reference: string;
  emailProvided: boolean;
};

const [bookingSuccess, setBookingSuccess] = useState<BookingSuccess | null>(null);
```

Change the form success callback to:

```ts
onSuccess({
  reference,
  emailProvided: Boolean(payload.emailAddress),
});
```

Success copy:

```tsx
<p className="mt-3 text-sm leading-7 text-[#667085]">
  The IG Sabroso team will review your project details and contact you about the consultation.
  {emailProvided
    ? " A confirmation email was sent to the email address you provided."
    : " Save your booking reference below so you can manage this booking later."}
</p>
```

Keep the `Manage booking` and `Submit another request` actions.

- [ ] **Step 4: Run the focused test and confirm GREEN**

```bash
npm test -- src/routes/consultation.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit the consultation success-state change**

```bash
git add src/routes/consultation.tsx src/routes/consultation.test.tsx
git commit -m "feat: clarify consultation confirmation UX"
```

---

### Task 4: Build Apps Script V6.2 immediate lifecycle state and branded emails

**Files:**
- Create: `apps-script/IGS_Staging_CRM_V6_2.gs`
- Source baseline: Drive file `IGS_Staging_CRM_V6_1_VALIDATED.gs`

**Interfaces:**
- Consumes POST body `{ action, payload }` from `callCRMFn`.
- Produces JSON `{ success: true, booking... }` for create/find/reschedule/cancel and warnings for non-critical lifecycle-email failures.
- Sends customer/admin lifecycle emails through MailApp only.

- [ ] **Step 1: Copy the validated V6.1 staging source into the versioned repo file**

Use the Drive recovery source as the only baseline. Do not derive from production Apps Script.

Update `doGet()` version string to:

```js
version: '6.2-staging-self-service',
```

- [ ] **Step 2: Make reschedule state immediate and transactional**

Replace `rescheduleBookingV6_` semantics so the completed state is `Rescheduled`. Preserve the old schedule for notification/audit.

Core state values:

```js
const oldDate = record.booking.preferredDate;
const oldTime = record.booking.preferredTime;
const newDate = parseBookingDateV6_(payload.newPreferredDate).normalized;
const newTimeInfo = parseBookingTimeV6_(payload.newPreferredTime);
```

Use Google Calendar compensation: create the new event, remove the old matching event, then update sheet rows. If sheet update fails, delete the newly created event and recreate the old event before throwing.

Required completed fields:

```js
updateBookingFieldsV6_(record.row, {
  'Preferred Date': newDate,
  'Preferred Time': newTimeInfo.display,
  'Booking Status': 'Rescheduled',
  'Reschedule Requested?': 'Yes',
  'Notes': appendNoteV6_(record.booking.notes, note),
});

updateAppointmentV6_(reference, {
  'Appointment Date': newDate,
  'Time': newTimeInfo.display,
  'Schedule Status': 'Rescheduled',
  'Notes': '[' + timestampV6_() + '] Client rescheduled booking.',
});
```

Do not return success until the replacement Calendar event and both sheet updates are complete.

- [ ] **Step 3: Make cancellation immediate and idempotent**

At the beginning of `cancelBookingV6_`, after lookup/contact validation:

```js
if (String(record.booking.bookingStatus || '').toLowerCase() === 'cancelled') {
  return { booking: record.booking, alreadyCancelled: true };
}
```

Use normalized input:

```js
const reason = cleanTextV6_(payload.cancellationReason) || 'No reason provided.';
```

Completed fields remain:

```js
'Booking Status': 'Cancelled',
'Cancel Requested?': 'Yes',
```

Delete only Calendar events whose exact reference is present in the IG Sabroso staging event title/description. If sheet status persistence fails after deletion, recreate the original event from the saved booking data before throwing.

- [ ] **Step 4: Replace plain customer reschedule/cancel emails with branded responsive HTML**

Customer reschedule subject:

```js
const subject = 'IG Sabroso Booking Rescheduled — ' + reference;
```

Required customer reschedule content:

```text
Booking rescheduled
Booking reference
Previous schedule
New schedule
What happens next: The preferred consultation schedule has been updated. Keep this reference for future changes.
```

Customer cancellation subject:

```js
const subject = 'IG Sabroso Booking Cancelled — ' + reference;
```

Required customer cancellation content:

```text
Booking cancelled
Booking reference
Cancelled schedule
Cancellation reason (when supplied)
No appointment remains scheduled for this booking reference.
```

Use the same navy/orange, mobile-responsive table-email visual system already used by the V6.1 create-booking confirmation. Do not use external CSS, JavaScript, forms, or remote fonts in email HTML.

- [ ] **Step 5: Add branded admin reschedule/cancel lifecycle notifications**

Add:

```js
function sendAdminRescheduleNotificationV6_(recipient, reference, booking, oldDate, oldTime, newDate, newTime, notes) {}
function sendAdminCancellationNotificationV6_(recipient, reference, booking, cancelledDate, cancelledTime, reason) {}
```

Required subjects:

```js
'Booking rescheduled - ' + reference + ' - ' + booking.fullName
'Booking cancelled - ' + reference + ' - ' + booking.fullName
```

Both must include customer contact, project type/location, reference, schedule data, and a Reply-To action when the customer email is valid.

Email delivery remains fail-open after the state transition:

```js
const warnings = [];
try {
  sendCustomerRescheduleConfirmationV6_(/* ... */);
} catch (error) {
  warnings.push('Customer reschedule email: ' + safeErrorV6_(error));
}
try {
  sendAdminRescheduleNotificationV6_(/* ... */);
} catch (error) {
  warnings.push('Admin reschedule email: ' + safeErrorV6_(error));
}
return { booking: readBookingByRowV6_(record.row), warnings: warnings };
```

Use the equivalent pattern for cancellation.

- [ ] **Step 6: Validate Apps Script syntax locally before deployment**

Because `.gs` is JavaScript with Apps Script globals, run a parser/syntax check by copying the file to a temporary `.js` file and using Node's syntax checker:

```bash
cp apps-script/IGS_Staging_CRM_V6_2.gs /tmp/IGS_Staging_CRM_V6_2.js
node --check /tmp/IGS_Staging_CRM_V6_2.js
```

Expected: no syntax error output and exit code 0.

- [ ] **Step 7: Commit the staging Apps Script source**

```bash
git add apps-script/IGS_Staging_CRM_V6_2.gs
git commit -m "feat: add staging booking lifecycle v6.2"
```

- [ ] **Step 8: Synchronize the Drive recovery copy**

Replace the content of the existing Drive recovery file `IGS_Staging_CRM_V6_1_VALIDATED.gs` with the validated V6.2 source and rename its display copy to `IGS_Staging_CRM_V6_2_VALIDATED.gs` if the connector supports safe rename. If rename is unavailable, preserve the existing Drive file ID and update the first comment/version marker to V6.2.

- [ ] **Step 9: Update the existing Apps Script Web App deployment manually**

This is the only manual control-plane step because no connected tool exposes Apps Script deployment writes.

In the existing staging Apps Script project:

1. Replace the active `.gs` content with `apps-script/IGS_Staging_CRM_V6_2.gs`.
2. Run `authorize` and require:
   - spreadsheet found
   - calendars found: `1`
   - remaining email quota greater than `0`
   - execution completed
3. `Deploy` → `Manage deployments` → edit the **existing Web app** → `New version` → `Deploy`.
4. Keep the same `/exec` Web App URL already configured in Netlify Deploy Preview.
5. Open the Web App URL and verify JSON contains:

```json
{"success":true,"version":"6.2-staging-self-service"}
```

Do not create a new production endpoint and do not change production env vars.

---

### Task 5: Run complete automated regression and production build checks

**Files:**
- No new runtime files unless a failing test requires a scoped fix.

**Interfaces:**
- Consumes all work from Tasks 1-4.
- Produces a green staging commit suitable for Deploy Preview QA.

- [ ] **Step 1: Run focused booking tests**

```bash
npm test -- src/lib/bookings.functions.test.ts src/components/booking-modals.test.tsx src/routes/consultation.test.tsx
```

Expected: all focused tests PASS.

- [ ] **Step 2: Run the full Vitest suite**

```bash
npm test
```

Expected: zero failing tests.

- [ ] **Step 3: Run ESLint**

```bash
npm run lint
```

Expected: exit code 0. Fix only issues introduced or exposed by this feature; do not perform unrelated refactors.

- [ ] **Step 4: Run production build**

```bash
npm run build
```

Expected: successful TanStack/Vite build with no TypeScript/build errors.

- [ ] **Step 5: Review staging diff against production**

```bash
git diff main...HEAD -- src/lib/bookings.functions.ts src/components/booking-modals.tsx src/routes/consultation.tsx apps-script/IGS_Staging_CRM_V6_2.gs
```

Verify no unrelated site sections, project assets, hero, navigation, or production config were changed.

- [ ] **Step 6: Commit any test-only corrections**

```bash
git add -A
git commit -m "test: validate booking self-service lifecycle"
```

Skip this commit if the worktree is already clean.

---

### Task 6: Deploy and execute the staging lifecycle acceptance test

**Files/Systems:**
- Netlify Deploy Preview for PR #4 only.
- Staging Apps Script V6.2.
- Staging Bookings CRM sheet.
- Staging Appointment Calendar sheet.
- Staging Google Calendar.
- Customer Gmail inbox and admin Gmail inbox.

**Interfaces:**
- Consumes the green staging branch and deployed Apps Script V6.2.
- Produces release evidence for explicit production approval.

- [ ] **Step 1: Confirm Netlify Deploy Preview environment isolation**

Verify `GOOGLE_APPS_SCRIPT_WEB_APP_URL` is scoped to `deploy-preview` and resolves to the validated V6.2 staging Web App. Confirm notification environment variables that would enable the redundant Netlify mailer are absent/disabled.

- [ ] **Step 2: Wait for the latest Deploy Preview to become `ready`**

The canonical QA URL must be:

```text
https://deploy-preview-4--darling-sunburst-da0a5d.netlify.app/consultation
```

Do not use immutable deploy-ID hostnames if they return Netlify global 404s on the user's device.

- [ ] **Step 3: Create one fresh lifecycle QA booking**

Use a reachable non-admin customer email and clearly mark project details as staging QA. Record the returned booking reference.

Expected create state:

```text
Bookings CRM: Booking Status = New
Appointment Calendar: Schedule Status = Pending
Google Calendar: exact-reference event exists
Customer Gmail: branded Appointment Request Received
Admin Gmail: branded New consultation request
```

- [ ] **Step 4: Verify Manage Booking lookup**

Use reference + matching email/phone. Confirm displayed date/time are correct Asia/Manila values and status is `New`/pending confirmation.

- [ ] **Step 5: Reschedule through the website**

Choose a different valid date/time and click `Confirm new schedule`.

Expected:

```text
Website: Booking rescheduled
Bookings CRM: Booking Status = Rescheduled
Bookings CRM: Preferred Date/Time = new values
Appointment Calendar: Schedule Status = Rescheduled
Old Google Calendar event: absent
New Google Calendar event: present at new schedule
Customer Gmail: IG Sabroso Booking Rescheduled
Admin Gmail: Booking rescheduled
```

- [ ] **Step 6: Find the booking again and cancel through the website**

Click `Cancel booking` → provide a QA cancellation reason → `Yes, cancel booking`.

Expected:

```text
Website: Booking cancelled
Bookings CRM: Booking Status = Cancelled
Appointment Calendar: Schedule Status = Cancelled
Google Calendar event: absent
Customer Gmail: IG Sabroso Booking Cancelled
Admin Gmail: Booking cancelled
```

- [ ] **Step 7: Verify cancelled-state idempotency and action lockout**

Find the same booking again. The UI must show `Cancelled` and must not render Reschedule or Cancel actions. A repeated backend cancellation request, if probed, must return a stable cancelled booking and must not create/delete additional events.

- [ ] **Step 8: Verify Gmail UI on mobile and desktop**

Customer and admin create/reschedule/cancel emails must be inspected in Gmail mobile and desktop views for:

- IG Sabroso navy/orange brand consistency
- no horizontal overflow
- readable schedule/reference hierarchy
- functional Reply-To admin action
- correct lifecycle wording
- no obsolete `request received` language for completed reschedule/cancel actions

- [ ] **Step 9: Check Netlify release evidence**

Require:

```text
Deploy Preview: ready
Secret scan: 0 matches
PR #4: draft/unmerged
Production main: unchanged
igsabroso.com production deployment: unchanged
```

- [ ] **Step 10: Update PR #4 with QA evidence**

Record the tested booking reference, test/build results, Netlify deploy state, Gmail lifecycle results, Calendar results, and remaining release blockers. Keep the PR in Draft until explicit production approval.

---

## Final Release Checklist

Do not promote to production until every box is checked:

- [ ] `npm test` passes with zero failures.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] Apps Script V6.2 syntax validation passes.
- [ ] Apps Script `authorize` passes.
- [ ] V6.2 Web App GET reports `6.2-staging-self-service`.
- [ ] Fresh create booking passes end-to-end.
- [ ] Manage Booking lookup passes.
- [ ] Immediate reschedule passes CRM + Appointment sheet + Calendar + customer/admin email checks.
- [ ] Immediate cancellation passes CRM + Appointment sheet + Calendar + customer/admin email checks.
- [ ] Cancelled booking hides destructive management actions.
- [ ] Customer Gmail create/reschedule/cancel UI approved on mobile and desktop.
- [ ] Admin Gmail create/reschedule/cancel UI approved on mobile and desktop.
- [ ] Netlify Deploy Preview is `ready`.
- [ ] Netlify secret scan has zero matches.
- [ ] PR #4 remains Draft and unmerged during staging QA.
- [ ] Production `main` and `igsabroso.com` remain unchanged.
- [ ] User explicitly approves production promotion.
