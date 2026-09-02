# IG Sabroso V6.2.5 R2 — CDS runtime migration

Date: 2026-09-02 (Asia/Manila)

This staging-only record documents the Google-side runtime migration completed after the final source/build gates on staging head `3c78771a010f4fd9444b2b0f8794b840545c0fda`.

## CDS Apps Script Web App

A new staging Web App deployment was created under `caballerodigitals@gmail.com`. The exact `/exec` endpoint is intentionally not committed in release documentation; it is stored in the Netlify Deploy Preview secret environment.

The Apps Script health response reports version `6.2.5-production-readiness-r2`.

## CDS-owned booking calendar

The Web App now targets the CDS-owned `IGS Website Appointments` Calendar ID:

`9a8c649815522b6ac9366068aa0a8e3b930046d1d5e6483a0db709f509156ca5@group.calendar.google.com`

Authorization succeeded against:
- Spreadsheet: `IG Sabroso Website CRM`
- Calendar: `IGS Website Appointments`
- Calendar execution account: CDS
- customer lifecycle email flag remains disabled

The prior `cbaff5...@group.calendar.google.com` Calendar must be retained until active legacy appointments are reconciled; do not delete it as part of this staging migration.

## Netlify boundary

The Apps Script endpoint was updated only in the `deploy-preview` context. Production remains untouched until the remaining live staging gates, cleanup, and smoke gates pass.

## Release integrity

Repository source synchronization completed in `d75811c38a52dcb4dedb54ef065ca882a59b86aa`:
- Apps Script `CONFIG.CALENDAR_ID` pins the CDS-owned Calendar ID.
- Calendar identity tests expect the same CDS-owned Calendar ID.
- name-only Calendar lookup remains forbidden.

Post-sync Staging Final Verification run `33582866433` completed successfully.

## Fresh staging lifecycle QA

Staging Live Lifecycle QA run `33582901903` completed successfully against the CDS Web App.

Controlled QA identity:
- booking reference: `IGS-2026-0010`
- submission ID: `aedf68d0-81a4-47bc-b0a9-64979327c60c`
- test customer email used the `.invalid` domain

Verified lifecycle:
1. health: PASS — version `6.2.5-production-readiness-r2`
2. create: PASS — status `New`, zero warnings
3. duplicate create with identical submission ID: PASS — same booking reference, `duplicatePrevented=true`, zero warnings
4. find new: PASS
5. reschedule: PASS — status `Rescheduled`, zero warnings
6. find rescheduled: PASS
7. cancel: PASS — status `Cancelled`, zero warnings
8. find cancelled: PASS

Independent side-effect checks:
- exactly one Bookings row for `IGS-2026-0010`, row 18, final status `Cancelled`
- exactly one Appointments row for `IGS-2026-0010`, row 18, final status `Cancelled`
- exactly three internal lifecycle emails: New, Rescheduled, Cancelled
- all three were sent from and to `caballerodigitals@gmail.com`
- exactly one New/create admin email; duplicate create generated no duplicate admin notification
- zero lifecycle emails sent to the `.invalid` customer address
- admin messages have no attachments
- `OPEN CRM RECORD` uses the HTTPS Apps Script CRM bridge
- `CALL CLIENT` uses the HTTPS CRM-bound Apps Script bridge with booking reference + CRM row; Gmail no longer uses a direct `tel:` CTA
- `REPLY TO CLIENT` remains a customer mailto action
- `Powered by CDS` remains present

Remaining release gates before production promotion:
- independently verify no `IGS-2026-0010` Calendar orphan remains on the CDS-owned Calendar after cancellation
- physical mobile Gmail `CALL CLIENT` → native dialer verification
- remove temporary verification workflow(s), obtain a final clean Deploy Preview with zero secret matches, then re-check PR/main boundaries
