# IG Sabroso V6.2.5 R2 — CDS runtime migration

Date: 2026-09-02 (Asia/Manila)

This staging-only record documents the Google-side runtime migration completed after the final source/build gates on staging head `3c78771a010f4fd9444b2b0f8794b840545c0fda`.

## CDS Apps Script Web App

A new staging Web App deployment was created under `caballerodigitals@gmail.com`. The exact `/exec` endpoint is intentionally not committed to the repository; it is stored only in the Netlify Deploy Preview secret environment.

The Apps Script source reports version `6.2.5-production-readiness-r2`.

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

The Apps Script endpoint was updated only in the `deploy-preview` context. Production remains untouched until the fresh lifecycle, Gmail, Call Client, cleanup, and smoke gates pass.

## Release integrity

Repository source synchronization completed in `d75811c38a52dcb4dedb54ef065ca882a59b86aa`:
- Apps Script `CONFIG.CALENDAR_ID` now pins the CDS-owned Calendar ID.
- Calendar identity tests expect the same CDS-owned Calendar ID.
- name-only Calendar lookup remains forbidden.

A fresh verification run must pass on the post-sync staging head before any production promotion.
