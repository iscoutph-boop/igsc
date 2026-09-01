# IG Sabroso V6.2.5 R2 Production-Readiness Execution Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to execute this plan inline. Subagents are intentionally not used for this run.

**Goal:** Produce, deploy, and verify the V6.2.5 R2 staging release candidate while preserving the current Apps Script `/exec` URL, keeping all customer lifecycle email disabled, routing all automated lifecycle mail only to `caballerodigitals@gmail.com`, and leaving production untouched.

**Architecture:** The TanStack Start site keeps one stable UUID per create attempt and performs one controlled retry only for transient timeout/HTML/502/503/504 failures. Google Apps Script remains the source of truth for idempotent CRM, Appointment-row, Calendar, and admin-email lifecycle side effects. R2 changes only the admin email operational links and health identity on top of the existing V6.2.5 candidate.

**Tech Stack:** React 19, TypeScript, TanStack Start, Zod, Vitest, Playwright, Netlify Deploy Preview, Google Apps Script, Google Sheets, Google Calendar, Gmail.

**Spec:** The user's “IG SABROSO — AUTONOMOUS PRODUCTION-READINESS EXECUTION” requirements in the current project conversation supersede older docs where customer email or Calendar Gmail CTAs were previously enabled.

## Global Constraints

- Work only on `feature/booking-email-staging-recovered-2` and PR #4.
- Do not merge PR #4, modify `main`, publish production, change `igsabroso.com`, or migrate production data before explicit final approval.
- Preserve the existing Apps Script Web App URL: `https://script.google.com/macros/s/AKfycbziiFGQQcfY0avo_ozTRIqc1VFueZCwaVoeIXfdkpE5L1X9cancnGk4lmrdYSUvmwgF/exec`.
- Health version must be exactly `6.2.5-production-readiness-r2`.
- `ADMIN_EMAIL` must be exactly `caballerodigitals@gmail.com`.
- `CUSTOMER_EMAIL_NOTIFICATIONS_ENABLED` must be exactly `false`.
- `vencemichael06@gmail.com` must not exist in notification implementation or QA customer data.
- Admin Gmail keeps `OPEN CRM RECORD`, `REPLY TO CLIENT`, `CALL CLIENT`, and clickable `Powered by CDS` without emoji/arrows.
- Admin Gmail must not contain a Calendar CTA, `calendar.google.com`, a plain-text `Calendar:` action link, an attachment, or a raw Sheets URL.
- Backend Calendar synchronization with `IGS Website Appointments` remains active.
- Every create retry reuses the same `submissionId`; duplicate create reconciles the original record and never repeats completed side effects.
- Raw HTML and Google Inactivity Timeout text never reaches the website customer.
- Normal Netlify build command remains `npm run build`.

---

### Task 1: Establish the isolated baseline

**Files:**
- Inspect: `package.json`
- Inspect: `netlify.toml`
- Inspect: `.env.example`
- Inspect: current tracked files and Git history

- [ ] Confirm the fresh clone is on `feature/booking-email-staging-recovered-2`, tracks the matching remote branch, and has no local changes.
- [ ] Record `HEAD`, `origin/main`, active remote, and the production/staging boundaries.
- [ ] Install exact dependencies with `npm ci`.
- [ ] Run focused existing booking tests, then the full test suite and production build to establish the baseline.
- [ ] If a baseline gate fails, use systematic debugging before changing code.

### Task 2: Add R2 policy regression coverage first

**Files:**
- Modify: `apps-script/IGS_Staging_CRM_V6_2_5.test.ts`

**Interfaces:**
- Consumes the canonical Apps Script source text and its VM-loaded functions.
- Proves exact release identity, mail routing, CTA rules, and preserved Calendar backend behavior.

- [ ] Add a source-policy test requiring the exact R2 health string, exact admin address, disabled customer mail, and absence of the forbidden address.
- [ ] Add admin-email assertions that reject `VIEW APPOINTMENT`, `VIEW UPDATED APPOINTMENT`, `OPEN CALENDAR`, `calendar.google.com`, and a `Calendar:` body action.
- [ ] Preserve assertions for CRM redirect, separate mailto/tel actions, tel sanitization, hidden invalid-phone CTA, no attachments, no raw Sheets URL, and clean CDS footer.
- [ ] Add a static assertion that Calendar lifecycle implementation and `IGS Website Appointments` remain present.
- [ ] Run `npm test -- apps-script/IGS_Staging_CRM_V6_2_5.test.ts` and verify it fails for the expected pre-R2 Calendar CTA/version behavior.

### Task 3: Create the canonical R2 Apps Script source

**Files:**
- Create: `apps-script/IGS_Staging_CRM_V6_2_5_PRODUCTION_READINESS_R2.gs`
- Modify: `apps-script/IGS_Staging_CRM_V6_2_5.test.ts`
- Remove after canonical source exists: `apps-script/IGS_Staging_CRM_V6_2_5_PRODUCTION_READINESS_R2.patch`

**Interfaces:**
- `doGet()` returns health version `6.2.5-production-readiness-r2`.
- `buildAdminOpsLinksV62_(reference, row)` returns only the CRM redirect URL.
- `sendAdminLifecycleNotificationV62_()` renders only CRM, reply, and valid-phone call actions.

- [ ] Copy the verified V6.2.5 candidate into the exact R2 filename without changing unrelated logic.
- [ ] Change the release banner and health version only.
- [ ] Remove Calendar URL generation, escaping, plaintext output, labels, and HTML CTA from admin mail only.
- [ ] Keep all Calendar create/reschedule/cancel backend functions unchanged.
- [ ] Point the VM test harness at the R2 source.
- [ ] Run the focused Apps Script suite and confirm all tests pass.
- [ ] Run forbidden-string and expected-string source scans against the R2 file.
- [ ] Delete the documentary pseudo-patch so there is one canonical deployable R2 artifact.

### Task 4: Verify frontend timeout and stable-submission behavior

**Files:**
- Verify: `src/lib/bookings.ts`
- Verify: `src/lib/bookings.test.ts`
- Verify: `src/routes/consultation.tsx`
- Verify: `src/features/consultation/consultation-form.test.tsx`

- [ ] Run the focused tests proving one controlled retry, reused payload/submission ID, safe HTML/timeout fallback, and UUID generation/reset behavior.
- [ ] Add a failing regression test before any frontend behavior change discovered necessary.
- [ ] Apply only the smallest correction needed, then rerun focused tests.

### Task 5: Complete local release verification

**Files:**
- Verify all tracked release files.

- [ ] Run `npm test` and record test count and zero failures.
- [ ] Run `npm run lint` and record the result; investigate any new errors separately from known baseline issues.
- [ ] Run `npm run build` and record exit code 0.
- [ ] Confirm `netlify.toml` still uses `npm run build` and no temporary QA hook exists.
- [ ] Confirm the working diff contains no production URL/environment mutation.
- [ ] Commit the canonical R2 source, tests, and execution documentation to the staging branch.

### Task 6: Update the existing staging Apps Script deployment

**Targets:**
- Existing Apps Script project and existing `/exec` deployment only.

- [ ] Open the authenticated Apps Script editor and identify the deployment backing the exact supplied `/exec` URL.
- [ ] Replace the staging script contents with the verified canonical R2 source.
- [ ] Save, create a new version, and edit the existing Web App deployment rather than creating a new deployment.
- [ ] If Google requires physical authentication, request only that authentication action and resume afterward.
- [ ] Open the existing `/exec` health endpoint and verify the exact R2 version.

### Task 7: Update Deploy Preview 4 without touching production

**Targets:**
- Push only `feature/booking-email-staging-recovered-2`.
- Netlify Deploy Preview 4 only.

- [ ] Push the verified staging commit without force.
- [ ] Confirm PR #4 remains Draft and unmerged.
- [ ] Wait for Deploy Preview 4 to build from the pushed commit.
- [ ] Verify the Deploy Preview reports the expected commit and remains wired to the staging Apps Script URL.
- [ ] Confirm `igsabroso.com` and the production Netlify deployment were not changed.

### Task 8: Run the complete live staging lifecycle

**Sequence:** Create → Duplicate Retry → Find → Reschedule → Find → Cancel → Find.

- [ ] Use a unique QA name, stable UUID, valid non-user QA email, and valid Philippine mobile number; never use the forbidden email.
- [ ] Create the booking and capture booking reference, submission ID, response, and UI evidence.
- [ ] Repeat create with the identical submission ID and verify the same reference plus `duplicatePrevented` reconciliation.
- [ ] Verify exactly one Bookings row, one Appointments row, one Calendar event, and one create admin email.
- [ ] Find and verify status `New`.
- [ ] Reschedule and verify status `Rescheduled`, updated Appointment row, and one updated Calendar event.
- [ ] Find and verify `Rescheduled`.
- [ ] Cancel and verify status `Cancelled`, updated CRM/audit data, and no orphan Calendar event.
- [ ] Find and verify `Cancelled`.

### Task 9: Verify Gmail and responsive operational behavior

**Targets:**
- Admin create, reschedule, and cancellation messages in `caballerodigitals@gmail.com`.
- Staging website and Gmail desktop/mobile layouts.

- [ ] Verify each lifecycle admin message was delivered only to the allowed admin inbox.
- [ ] Search Sent mail for the unique QA customer address and verify zero automated lifecycle messages.
- [ ] Open `REPLY TO CLIENT` and verify the mailto target and booking-reference subject without sending mail.
- [ ] Inspect `CALL CLIENT` and verify the sanitized `tel:` URI; test mobile handoff up to the native confirmation boundary without placing a call.
- [ ] Open `OPEN CRM RECORD` and verify it resolves to the exact booking row without a raw Sheets URL in the email body or attachment/preview card.
- [ ] Verify all Calendar CTA/link variants are absent from all three messages.
- [ ] Verify `Powered by CDS` is clickable and has no emoji/arrow.
- [ ] Capture desktop and mobile Gmail layout evidence.
- [ ] Run desktop and mobile staging form UX checks, including validation, loading, retry-safe error handling, Manage Booking, and no raw HTML exposure.

### Task 10: Cleanup, final verification, and PR evidence

**Files/targets:**
- Staging branch, PR #4, QA CRM/Calendar/Gmail evidence.

- [ ] Remove temporary QA hooks/scripts and confirm no synthetic address/config remains in tracked code.
- [ ] Keep the cancelled QA CRM row only when needed as audit evidence; do not delete rows in a way that changes booking-reference sequencing.
- [ ] Confirm the QA Calendar event is absent after cancellation.
- [ ] Rerun focused tests, full tests, lint, and production build on the final tree.
- [ ] Confirm branch status is clean and matches the pushed remote commit.
- [ ] Update PR #4 with exact commit, test/build outputs, health version, lifecycle results, and links/screenshots where supported.
- [ ] Keep PR #4 Draft and unmerged.
- [ ] Reconfirm production URL, production Netlify state, `main`, and production traffic were untouched.
- [ ] Check every user-required QA gate against fresh evidence; do not infer PASS from source inspection alone.
- [ ] Ask only the exact final production approval question after every gate passes and no blocker remains.
