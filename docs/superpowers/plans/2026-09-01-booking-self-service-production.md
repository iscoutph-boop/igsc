# IG Sabroso Booking Self-Service Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a production-ready immediate self-service consultation lifecycle on the staging branch: create, find, reschedule, cancel, CRM/calendar synchronization, and branded customer/admin Gmail messages, while leaving production `main` and `igsabroso.com` untouched until explicit approval.

**Architecture:** Preserve the existing TanStack Start consultation route and Manage Booking modal. `callCRMFn` remains the server-only gateway and validates/sanitizes all booking actions before forwarding to the staging Google Apps Script Web App. Google Apps Script V6.2 is the single lifecycle-email authority and source of truth for Google Sheets, Google Calendar, and customer/admin booking emails. Netlify's separate booking-notification mailer is not invoked by the lifecycle flow.

**Tech Stack:** React 19, TypeScript 5.8, TanStack Start/Router, Zod, Framer Motion, Tailwind CSS v4, Vitest, Testing Library, Google Apps Script, Google Sheets, Google Calendar, Gmail/MailApp, Netlify Deploy Preview.

**Spec:** `docs/superpowers/specs/2026-09-01-booking-self-service-production-design.md`

## Global Constraints

- Work only on `feature/booking-email-staging-recovered-2` and Deploy Preview 4.
- Do not merge to `main` and do not alter the production `igsabroso.com` deployment or production environment variables.
- Approved behavior: **Immediate self-service**.
- Reschedule status is `Rescheduled`; cancel status is `Cancelled`.
- Customer lifecycle email goes to the valid email entered in the booking form.
- Admin lifecycle email goes to the configured staging admin inbox.
- Normalize cancellation reason to `cancellationReason` everywhere.
- Keep Apps Script URL server-only.
- Display schedules in `Asia/Manila`.
- Email failure after a completed state change is fail-open and returned as a warning.
- Reschedule/cancel calendar failures must not be presented to the customer as completed when calendar state is inconsistent.
- Cancellation is idempotent from the customer's perspective.
- Production promotion is a separate explicit approval step.

---

## File Map

**Modify**
- `src/lib/bookings.functions.ts` — server validation/forwarding; remove redundant lifecycle-mail invocation.
- `src/lib/bookings.functions.test.ts` — payload-contract tests.
- `src/components/booking-modals.tsx` — immediate self-service Manage Booking UX.
- `src/routes/consultation.tsx` — success-state/email clarity.

**Create**
- `src/components/booking-modals.test.tsx` — Manage Booking behavior tests.
- `src/routes/consultation.test.tsx` — success-panel tests.
- `apps-script/IGS_Staging_CRM_V6_2.gs` — version-controlled staging Apps Script source.

**Preserve but stop invoking from booking lifecycle**
- `src/lib/booking-notification.server.ts`
- `src/lib/booking-notification.server.test.ts`

---

### Task 1: Normalize the server contract and make Apps Script the single mail authority

**Files:**
- Modify: `src/lib/bookings.functions.ts`
- Modify: `src/lib/bookings.functions.test.ts`

**Interfaces:**
- Consumes: `callCRMFn({ data: { action, payload } })`.
- Produces: validated forwarding for create/find/reschedule/cancel; cancellation property is `cancellationReason`.

- [ ] **Step 1: Extend the existing schema test with cancellation coverage**

Add these imports and tests to `src/lib/bookings.functions.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  cancelBookingPayloadSchema,
  createBookingPayloadSchema,
  findBookingPayloadSchema,
  rescheduleBookingPayloadSchema,
} from "./bookings.functions";

it("accepts normalized cancellationReason", () => {
  const result = cancelBookingPayloadSchema.parse({
    bookingReference: "IGS-2026-0018",
    contact: "customer@example.com",
    cancellationReason: "Schedule changed",
  });
  expect(result.cancellationReason).toBe("Schedule changed");
});

it("rejects cancellationReason longer than 2500 characters", () => {
  expect(() =>
    cancelBookingPayloadSchema.parse({
      bookingReference: "IGS-2026-0018",
      contact: "customer@example.com",
      cancellationReason: "x".repeat(2501),
    }),
  ).toThrow();
});

it("accepts find and reschedule lifecycle contracts", () => {
  expect(
    findBookingPayloadSchema.parse({
      bookingReference: "IGS-2026-0018",
      contact: "09171234567",
    }).bookingReference,
  ).toBe("IGS-2026-0018");

  const reschedule = rescheduleBookingPayloadSchema.parse({
    bookingReference: "IGS-2026-0018",
    contact: "09171234567",
    newPreferredDate: "2026-09-05",
    newPreferredTime: "15:00",
    rescheduleNotes: "Afternoon preferred",
  });
  expect(reschedule.newPreferredTime).toBe("15:00");
});
```

- [ ] **Step 2: Run the focused test before implementation**

```bash
npm test -- src/lib/bookings.functions.test.ts
```

Expected: FAIL until the additional schemas are exported and the contract is complete.

- [ ] **Step 3: Export all four payload schemas and remove the redundant mailer**

In `src/lib/bookings.functions.ts`, use these declarations:

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

Remove:

```ts
import { sendBookingNotification } from "./booking-notification.server";
```

and remove the entire `if (data.action === "createBooking") { await sendBookingNotification(...) }` block. After Apps Script returns a successful JSON response, return the response text directly:

```ts
const text = await response.text();
const json = JSON.parse(text) as { success?: boolean; message?: string };
if (!json.success) {
  throw new Error(typeof json.message === "string" ? json.message : "CRM request failed.");
}
return text;
```

- [ ] **Step 4: Run the focused tests**

```bash
npm test -- src/lib/bookings.functions.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/bookings.functions.ts src/lib/bookings.functions.test.ts
git commit -m "fix: normalize booking lifecycle server contract"
```

---

### Task 2: Convert Manage Booking to immediate self-service semantics

**Files:**
- Modify: `src/components/booking-modals.tsx`
- Create: `src/components/booking-modals.test.tsx`

**Interfaces:**
- Consumes: `callCRM("findBooking" | "rescheduleBooking" | "cancelBooking", payload)`.
- Produces: final UI states `Rescheduled` and `Cancelled`; cancellation sends `cancellationReason`.

- [ ] **Step 1: Create deterministic component tests**

Create `src/components/booking-modals.test.tsx` with a mocked CRM and schedule picker:

```tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CheckBookingModal } from "./booking-modals";

const callCRMMock = vi.fn();
vi.mock("@/lib/bookings", () => ({
  callCRM: (...args: unknown[]) => callCRMMock(...args),
}));

vi.mock("@/components/schedule-picker", () => ({
  SchedulePicker: ({ onDateChange, onTimeChange }: any) => (
    <button
      type="button"
      onClick={() => {
        onDateChange(new Date(2026, 8, 5));
        onTimeChange("15:00");
      }}
    >
      Pick QA schedule
    </button>
  ),
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

async function openBooking(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByPlaceholderText(/IGS-2026/i), booking.bookingReference);
  await user.type(screen.getByPlaceholderText(/email or phone/i), booking.emailAddress);
  await user.click(screen.getByRole("button", { name: /find my booking/i }));
  await screen.findByText(/appointment request found/i);
}

describe("CheckBookingModal immediate self-service", () => {
  beforeEach(() => callCRMMock.mockReset());

  it("reschedules immediately with completed-state wording", async () => {
    const user = userEvent.setup();
    callCRMMock
      .mockResolvedValueOnce({ success: true, booking })
      .mockResolvedValueOnce({ success: true, booking: { ...booking, bookingStatus: "Rescheduled" } })
      .mockResolvedValueOnce({ success: true, booking: { ...booking, bookingStatus: "Rescheduled" } });

    render(<CheckBookingModal open onClose={() => {}} />);
    await openBooking(user);
    await user.click(screen.getByRole("button", { name: /reschedule booking/i }));
    await user.click(screen.getByRole("button", { name: /pick qa schedule/i }));
    await user.click(screen.getByRole("button", { name: /confirm new schedule/i }));

    await waitFor(() =>
      expect(callCRMMock).toHaveBeenCalledWith(
        "rescheduleBooking",
        expect.objectContaining({
          bookingReference: booking.bookingReference,
          newPreferredDate: "2026-09-05",
          newPreferredTime: "15:00",
        }),
      ),
    );
    expect(await screen.findByText(/booking rescheduled/i)).toBeInTheDocument();
  });

  it("cancels immediately and sends cancellationReason", async () => {
    const user = userEvent.setup();
    callCRMMock
      .mockResolvedValueOnce({ success: true, booking })
      .mockResolvedValueOnce({ success: true, booking: { ...booking, bookingStatus: "Cancelled" } });

    render(<CheckBookingModal open onClose={() => {}} />);
    await openBooking(user);
    await user.click(screen.getByRole("button", { name: /^cancel booking$/i }));
    await user.type(screen.getByLabelText(/cancellation reason/i), "Schedule changed");
    await user.click(screen.getByRole("button", { name: /yes, cancel booking/i }));

    await waitFor(() =>
      expect(callCRMMock).toHaveBeenLastCalledWith("cancelBooking", {
        bookingReference: booking.bookingReference,
        contact: booking.emailAddress,
        cancellationReason: "Schedule changed",
      }),
    );
    expect(await screen.findByText(/booking cancelled/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the new tests and confirm RED**

```bash
npm test -- src/components/booking-modals.test.tsx
```

Expected: FAIL because the current UI uses request/pending wording and `cancelReason`.

- [ ] **Step 3: Update action labels, payloads, and completed states**

Use these labels in `booking-modals.tsx`:

```tsx
<CalendarClock size={16} className="text-primary" /> Reschedule booking
<XCircle size={16} /> Cancel booking
```

Reschedule confirmation:

```tsx
{loading ? "Updating schedule..." : "Confirm new schedule"}
```

Set local completed status:

```ts
bookingStatus: "Rescheduled",
```

Render completed copy:

```tsx
<h3 className="mt-4 text-2xl font-display font-bold">Booking rescheduled</h3>
<div role="status" aria-live="polite" className="mt-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
  <p className="text-sm text-foreground/90">
    Your preferred consultation schedule has been updated. Your confirmation email contains the latest schedule.
  </p>
</div>
```

Cancellation payload:

```ts
await callCRM("cancelBooking", {
  bookingReference: booking.bookingReference,
  contact: ctx.contact,
  cancellationReason: reason,
});
```

Cancellation buttons/state:

```tsx
{loading ? "Cancelling..." : "Yes, cancel booking"}
```

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

Ensure all non-submit modal buttons use `type="button"`; retain Escape/backdrop close; disable destructive action while loading; keep the scrollable mobile backdrop; use `role="status"` for success and `role="alert"` for errors.

- [ ] **Step 4: Run the component tests and confirm GREEN**

```bash
npm test -- src/components/booking-modals.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/booking-modals.tsx src/components/booking-modals.test.tsx
git commit -m "feat: polish immediate booking self-service UX"
```

---

### Task 3: Clarify consultation success and dynamic customer email behavior

**Files:**
- Modify: `src/routes/consultation.tsx`
- Create: `src/routes/consultation.test.tsx`

**Interfaces:**
- Consumes: successful create response and whether the submitted form contained an email.
- Produces: accurate success copy without implying email delivery when no email was supplied.

- [ ] **Step 1: Export and test the presentational success panel**

Create `src/routes/consultation.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SuccessPanel } from "./consultation";

describe("SuccessPanel", () => {
  it("confirms email delivery when an email was supplied", () => {
    render(
      <SuccessPanel
        bookingReference="IGS-2026-0099"
        emailProvided
        onManage={vi.fn()}
        onReset={vi.fn()}
      />,
    );
    expect(
      screen.getByText(/confirmation email was sent to the email address you provided/i),
    ).toBeInTheDocument();
  });

  it("does not promise email when the form had no email", () => {
    render(
      <SuccessPanel
        bookingReference="IGS-2026-0099"
        emailProvided={false}
        onManage={vi.fn()}
        onReset={vi.fn()}
      />,
    );
    expect(screen.queryByText(/confirmation email was sent/i)).not.toBeInTheDocument();
    expect(screen.getByText(/save your booking reference/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test and confirm RED**

```bash
npm test -- src/routes/consultation.test.tsx
```

Expected: FAIL because the current success panel has no `emailProvided` prop.

- [ ] **Step 3: Carry email-presence state through the page**

Use:

```ts
type BookingSuccess = {
  reference: string;
  emailProvided: boolean;
};

const [bookingSuccess, setBookingSuccess] = useState<BookingSuccess | null>(null);
```

Change `ConsultationForm` success signature to:

```ts
export function ConsultationForm({
  onSuccess,
}: {
  onSuccess: (success: BookingSuccess) => void;
})
```

After a successful create call:

```ts
onSuccess({
  reference,
  emailProvided: Boolean(payload.emailAddress),
});
```

Export `SuccessPanel` and add `emailProvided: boolean`. Use:

```tsx
<p className="mt-3 text-sm leading-7 text-[#667085]">
  The IG Sabroso team will review your project details and contact you about the consultation.
  {emailProvided
    ? " A confirmation email was sent to the email address you provided."
    : " Save your booking reference below so you can manage this booking later."}
</p>
```

- [ ] **Step 4: Run the test and confirm GREEN**

```bash
npm test -- src/routes/consultation.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/routes/consultation.tsx src/routes/consultation.test.tsx
git commit -m "feat: clarify consultation confirmation UX"
```

---

### Task 4: Create staging Apps Script V6.2 with transactional lifecycle state and branded emails

**Files:**
- Create: `apps-script/IGS_Staging_CRM_V6_2.gs`
- Baseline: Drive recovery file `IGS_Staging_CRM_V6_1_VALIDATED.gs`

**Interfaces:**
- Consumes: POST `{ action, payload }` from `callCRMFn`.
- Produces: JSON success/failure for all booking actions; Google Sheets and Google Calendar state; customer/admin lifecycle MailApp messages.

- [ ] **Step 1: Copy the validated V6.1 staging source and change the health version**

Use only the validated staging source as baseline. Set:

```js
version: '6.2-staging-self-service',
```

- [ ] **Step 2: Replace reschedule semantics with an immediate transactional change**

Use this control flow inside `rescheduleBookingV6_` after lookup/contact validation:

```js
const oldDate = record.booking.preferredDate;
const oldTime = record.booking.preferredTime;
const oldPayload = bookingToCalendarPayloadV6_(record.booking, {
  preferredDate: oldDate,
  preferredTime: oldTime,
});
const newPayload = bookingToCalendarPayloadV6_(record.booking, {
  preferredDate: newDate,
  preferredTime: newTimeInfo.normalized24,
});
const calendar = getCalendarV6_();
let newEventCreated = false;

try {
  deleteBookingCalendarEventsV6_(calendar, reference, oldDate);
  createBookingCalendarEventV6_(calendar, reference, newPayload);
  newEventCreated = true;

  updateBookingFieldsV6_(record.row, {
    'Preferred Date': newDate,
    'Preferred Time': newTimeInfo.display,
    'Booking Status': 'Rescheduled',
    'Reschedule Requested?': 'Yes',
    'Notes': appendNoteV6_(
      record.booking.notes,
      '[' + timestampV6_() + '] Booking rescheduled from ' + oldDate + ' ' + oldTime +
        ' to ' + newDate + ' ' + newTimeInfo.display + '. Notes: ' +
        (cleanTextV6_(payload.rescheduleNotes) || 'None'),
    ),
  });

  if (!updateAppointmentV6_(reference, {
    'Appointment Date': newDate,
    'Time': newTimeInfo.display,
    'Schedule Status': 'Rescheduled',
    'Notes': '[' + timestampV6_() + '] Client rescheduled booking.',
  })) {
    throw new Error('Appointment row not found for ' + reference);
  }
} catch (error) {
  try {
    if (newEventCreated) deleteBookingCalendarEventsV6_(calendar, reference, newDate);
    createBookingCalendarEventV6_(calendar, reference, oldPayload);
    updateBookingFieldsV6_(record.row, {
      'Preferred Date': oldDate,
      'Preferred Time': oldTime,
      'Booking Status': record.booking.bookingStatus,
    });
    updateAppointmentV6_(reference, {
      'Appointment Date': oldDate,
      'Time': oldTime,
      'Schedule Status': record.booking.bookingStatus || 'Pending',
    });
  } catch (rollbackError) {
    Logger.log('Reschedule rollback failed: ' + safeErrorV6_(rollbackError));
  }
  throw error;
}
```

Do not return success until this block completes.

- [ ] **Step 3: Make cancellation immediate and idempotent with rollback**

Normalize reason and short-circuit already-cancelled records:

```js
if (String(record.booking.bookingStatus || '').toLowerCase() === 'cancelled') {
  return { booking: record.booking, alreadyCancelled: true };
}
const reason = cleanTextV6_(payload.cancellationReason) || 'No reason provided.';
```

Use this transaction pattern:

```js
const calendar = getCalendarV6_();
const oldPayload = bookingToCalendarPayloadV6_(record.booking, {});
let calendarDeleted = false;
try {
  deleteBookingCalendarEventsV6_(calendar, reference, record.booking.preferredDate);
  calendarDeleted = true;

  updateBookingFieldsV6_(record.row, {
    'Booking Status': 'Cancelled',
    'Cancel Requested?': 'Yes',
    'Notes': appendNoteV6_(
      record.booking.notes,
      '[' + timestampV6_() + '] Booking cancelled. Reason: ' + reason,
    ),
  });

  if (!updateAppointmentV6_(reference, {
    'Schedule Status': 'Cancelled',
    'Notes': '[' + timestampV6_() + '] Client cancelled booking. Reason: ' + reason,
  })) {
    throw new Error('Appointment row not found for ' + reference);
  }
} catch (error) {
  try {
    updateBookingFieldsV6_(record.row, {
      'Booking Status': record.booking.bookingStatus,
      'Cancel Requested?': 'No',
    });
    updateAppointmentV6_(reference, {
      'Schedule Status': record.booking.bookingStatus || 'Pending',
    });
    if (calendarDeleted) createBookingCalendarEventV6_(calendar, reference, oldPayload);
  } catch (rollbackError) {
    Logger.log('Cancellation rollback failed: ' + safeErrorV6_(rollbackError));
  }
  throw error;
}
```

- [ ] **Step 4: Add one reusable branded lifecycle email renderer**

Add this renderer, using the existing `escapeHtmlSimpleV6_` helper:

```js
function buildLifecycleEmailHtmlV62_(title, intro, reference, rows) {
  const rowHtml = rows.map(function (row) {
    return '<tr><td style="padding:10px 0;color:#7b8798;font-size:12px;vertical-align:top;width:38%;">' +
      escapeHtmlSimpleV6_(row.label) +
      '</td><td style="padding:10px 0;color:#16263f;font-size:14px;font-weight:700;vertical-align:top;">' +
      escapeHtmlSimpleV6_(row.value || 'Not provided') + '</td></tr>';
  }).join('');

  return '<!doctype html><html><body style="margin:0;background:#eef2f6;font-family:Arial,Helvetica,sans-serif;">' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:24px 12px;">' +
    '<table role="presentation" width="640" cellspacing="0" cellpadding="0" style="width:100%;max-width:640px;background:#fff;border-radius:20px;overflow:hidden;">' +
    '<tr><td style="background:#16263f;border-top:6px solid #ff4b18;padding:24px;color:#fff;">' +
    '<div style="font-size:18px;font-weight:800;">IG SABROSO CONSTRUCTION</div>' +
    '<div style="margin-top:4px;color:#ffad96;font-size:12px;font-weight:700;">Elevate Your Lifestyle</div>' +
    '</td></tr><tr><td style="padding:28px 24px;">' +
    '<div style="color:#ff4b18;font-size:11px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;">' +
    escapeHtmlSimpleV6_(title) + '</div>' +
    '<div style="margin-top:12px;color:#16263f;font-size:24px;line-height:1.2;font-weight:800;">' +
    escapeHtmlSimpleV6_(intro) + '</div>' +
    '<div style="margin-top:18px;background:#f7f8fa;border-radius:14px;padding:16px;">' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0">' + rowHtml + '</table></div>' +
    '<div style="margin-top:18px;color:#7b8798;font-size:11px;">Booking reference: <strong style="color:#45536a;">' +
    escapeHtmlSimpleV6_(reference) + '</strong></div>' +
    '</td></tr></table></td></tr></table></body></html>';
}

function sendLifecycleEmailV62_(to, subject, title, intro, reference, rows, replyTo) {
  const body = [title, intro, 'Booking reference: ' + reference]
    .concat(rows.map(function (row) { return row.label + ': ' + row.value; }))
    .join('\n');
  const options = {
    to: to,
    subject: subject,
    body: body,
    htmlBody: buildLifecycleEmailHtmlV62_(title, intro, reference, rows),
    name: 'IG Sabroso Construction',
  };
  if (replyTo && isEmailAddressV6_(replyTo)) options.replyTo = replyTo;
  MailApp.sendEmail(options);
}
```

- [ ] **Step 5: Replace customer reschedule/cancel emails and add admin lifecycle emails**

After a successful reschedule state transition:

```js
const warnings = [];
const oldSchedule = formatBookingScheduleV6_(oldDate, oldTime);
const newSchedule = formatBookingScheduleV6_(newDate, newTimeInfo.display);

if (isEmailAddressV6_(record.booking.emailAddress)) {
  try {
    sendLifecycleEmailV62_(
      record.booking.emailAddress,
      'IG Sabroso Booking Rescheduled — ' + reference,
      'Booking rescheduled',
      'Your preferred consultation schedule has been updated.',
      reference,
      [
        { label: 'Previous schedule', value: oldSchedule },
        { label: 'New schedule', value: newSchedule },
        { label: 'Project type', value: record.booking.projectType },
        { label: 'Project location', value: record.booking.projectLocation },
      ],
      '',
    );
  } catch (error) {
    warnings.push('Customer reschedule email: ' + safeErrorV6_(error));
  }
}

try {
  sendLifecycleEmailV62_(
    CONFIG.ADMIN_EMAIL,
    'Booking rescheduled - ' + reference + ' - ' + record.booking.fullName,
    'Booking rescheduled',
    record.booking.fullName + ' changed the consultation schedule.',
    reference,
    [
      { label: 'Client', value: record.booking.fullName },
      { label: 'Phone', value: record.booking.phoneNumber },
      { label: 'Email', value: record.booking.emailAddress },
      { label: 'Previous schedule', value: oldSchedule },
      { label: 'New schedule', value: newSchedule },
      { label: 'Notes', value: cleanTextV6_(payload.rescheduleNotes) || 'None' },
    ],
    record.booking.emailAddress,
  );
} catch (error) {
  warnings.push('Admin reschedule email: ' + safeErrorV6_(error));
}
```

After successful cancellation:

```js
const warnings = [];
const cancelledSchedule = formatBookingScheduleV6_(
  record.booking.preferredDate,
  record.booking.preferredTime,
);

if (isEmailAddressV6_(record.booking.emailAddress)) {
  try {
    sendLifecycleEmailV62_(
      record.booking.emailAddress,
      'IG Sabroso Booking Cancelled — ' + reference,
      'Booking cancelled',
      'Your consultation booking has been cancelled. No appointment remains scheduled for this booking reference.',
      reference,
      [
        { label: 'Cancelled schedule', value: cancelledSchedule },
        { label: 'Cancellation reason', value: reason },
      ],
      '',
    );
  } catch (error) {
    warnings.push('Customer cancellation email: ' + safeErrorV6_(error));
  }
}

try {
  sendLifecycleEmailV62_(
    CONFIG.ADMIN_EMAIL,
    'Booking cancelled - ' + reference + ' - ' + record.booking.fullName,
    'Booking cancelled',
    record.booking.fullName + ' cancelled the consultation booking.',
    reference,
    [
      { label: 'Client', value: record.booking.fullName },
      { label: 'Phone', value: record.booking.phoneNumber },
      { label: 'Email', value: record.booking.emailAddress },
      { label: 'Cancelled schedule', value: cancelledSchedule },
      { label: 'Cancellation reason', value: reason },
    ],
    record.booking.emailAddress,
  );
} catch (error) {
  warnings.push('Admin cancellation email: ' + safeErrorV6_(error));
}
```

Return `warnings` with the completed booking state for both lifecycle actions.

- [ ] **Step 6: Syntax-check the Apps Script source**

```bash
cp apps-script/IGS_Staging_CRM_V6_2.gs /tmp/IGS_Staging_CRM_V6_2.js
node --check /tmp/IGS_Staging_CRM_V6_2.js
```

Expected: exit code 0 and no syntax error output.

- [ ] **Step 7: Commit the staging Apps Script source**

```bash
git add apps-script/IGS_Staging_CRM_V6_2.gs
git commit -m "feat: add staging booking lifecycle v6.2"
```

- [ ] **Step 8: Synchronize the Drive recovery copy**

Replace the content of the existing Drive recovery file with the validated V6.2 source while preserving its file ID. The first comment and `doGet()` version must clearly state V6.2.

- [ ] **Step 9: Update the existing Apps Script Web App deployment**

The available connectors do not expose Apps Script deployment writes, so this control-plane step is manual:

1. In the existing staging Apps Script project, replace the active `.gs` content with `apps-script/IGS_Staging_CRM_V6_2.gs`.
2. Run `authorize` and require Spreadsheet access, `Calendars found: 1`, positive mail quota, and `Execution completed`.
3. `Deploy` → `Manage deployments` → edit the existing Web app → `New version` → `Deploy`.
4. Keep the same `/exec` URL already configured in Netlify Deploy Preview.
5. Open the Web App URL and require JSON containing `"version":"6.2-staging-self-service"`.

---

### Task 5: Run automated regression and build verification

**Files:**
- No new runtime files unless a scoped test failure requires a fix.

- [ ] **Step 1: Run focused booking tests**

```bash
npm test -- src/lib/bookings.functions.test.ts src/components/booking-modals.test.tsx src/routes/consultation.test.tsx
```

Expected: PASS.

- [ ] **Step 2: Run the full test suite**

```bash
npm test
```

Expected: zero failures.

- [ ] **Step 3: Run lint**

```bash
npm run lint
```

Expected: exit code 0.

- [ ] **Step 4: Run production build**

```bash
npm run build
```

Expected: successful TanStack/Vite build.

- [ ] **Step 5: Review feature-only diff**

```bash
git diff main...HEAD -- src/lib/bookings.functions.ts src/components/booking-modals.tsx src/routes/consultation.tsx apps-script/IGS_Staging_CRM_V6_2.gs
```

Verify no unrelated hero, projects, navigation, assets, production config, or production deployment files changed.

---

### Task 6: Deploy Preview and end-to-end staging acceptance test

**Systems:**
- Netlify Deploy Preview 4
- staging Apps Script V6.2
- staging Bookings CRM sheet
- staging Appointment Calendar sheet
- staging Google Calendar
- customer Gmail inbox
- admin Gmail inbox

- [ ] **Step 1: Confirm environment isolation**

Require `GOOGLE_APPS_SCRIPT_WEB_APP_URL` to be scoped to `deploy-preview` and still point to the validated staging `/exec` URL. Confirm the redundant Netlify lifecycle-notification variables remain disabled/absent.

- [ ] **Step 2: Wait for Deploy Preview `ready`**

Use:

```text
https://deploy-preview-4--darling-sunburst-da0a5d.netlify.app/consultation
```

- [ ] **Step 3: Create one fresh QA booking with a reachable non-admin email**

Expected state:

```text
Bookings CRM = New
Appointment Calendar = Pending
Google Calendar = one event with exact booking reference
Customer Gmail = branded Appointment Request Received
Admin Gmail = branded New consultation request
```

- [ ] **Step 4: Find the booking with reference + matching email/phone**

Verify name, project type, contact, location, status, and Asia/Manila preferred schedule.

- [ ] **Step 5: Reschedule through the website**

Choose a new valid date/time and click `Confirm new schedule`.

Expected:

```text
Website = Booking rescheduled
Bookings CRM status = Rescheduled
Preferred date/time = new values
Appointment Calendar status = Rescheduled
Old Google Calendar event = absent
New Google Calendar event = present
Customer Gmail = IG Sabroso Booking Rescheduled
Admin Gmail = Booking rescheduled
```

- [ ] **Step 6: Find again and cancel through the website**

Use a clear QA reason and click `Yes, cancel booking`.

Expected:

```text
Website = Booking cancelled
Bookings CRM status = Cancelled
Appointment Calendar status = Cancelled
Google Calendar event = absent
Customer Gmail = IG Sabroso Booking Cancelled
Admin Gmail = Booking cancelled
```

- [ ] **Step 7: Verify cancelled-state lockout/idempotency**

Find the same booking again. Status is `Cancelled`; Reschedule and Cancel actions are absent. A repeated cancellation backend probe returns stable cancelled state without new/deleted calendar events.

- [ ] **Step 8: Inspect all six lifecycle emails in Gmail mobile and desktop**

Check customer/admin create, reschedule, and cancel messages for brand consistency, no horizontal overflow, correct reference/schedule hierarchy, correct Reply-To behavior for admin mail, and no obsolete request/pending language for completed lifecycle actions.

- [ ] **Step 9: Verify release evidence**

Require:

```text
Deploy Preview = ready
Netlify secret scan = 0 matches
PR #4 = Draft and unmerged
production main = unchanged
igsabroso.com production deployment = unchanged
```

- [ ] **Step 10: Record QA evidence in PR #4**

Record the tested booking reference, automated test results, build result, lifecycle state results, Gmail results, Calendar results, and remaining release blockers. Keep the PR Draft until the user explicitly approves production promotion.

---

## Final Release Checklist

- [ ] Focused booking tests pass.
- [ ] Full `npm test` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] Apps Script V6.2 syntax check passes.
- [ ] Apps Script authorization passes.
- [ ] Web App health reports `6.2-staging-self-service`.
- [ ] Create booking passes end-to-end.
- [ ] Manage Booking lookup passes.
- [ ] Immediate reschedule passes CRM + Appointment sheet + Calendar + customer/admin email checks.
- [ ] Immediate cancellation passes CRM + Appointment sheet + Calendar + customer/admin email checks.
- [ ] Cancelled booking hides lifecycle actions and repeated cancel is idempotent.
- [ ] Customer/admin lifecycle Gmail UI is approved on mobile and desktop.
- [ ] Netlify Deploy Preview is `ready` with zero secret matches.
- [ ] PR #4 remains Draft/unmerged during staging QA.
- [ ] Production `main` and `igsabroso.com` remain unchanged.
- [ ] User explicitly approves production promotion.
