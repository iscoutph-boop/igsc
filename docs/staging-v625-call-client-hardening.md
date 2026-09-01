# IG Sabroso V6.2.5 — Mobile Call Client hardening

Staging-only release note.

## Root cause

Gmail on iOS can suppress or fail to activate `tel:` links embedded directly in HTML email. The existing phone normalization was valid; the client-specific failure was at the Gmail mobile link-handling boundary.

## Staging fix

- Admin lifecycle email `CALL CLIENT` now uses the Apps Script Web App HTTPS origin.
- The HTTPS bridge receives only a sanitized dialable phone value.
- The bridge hands off to the native `tel:` scheme after Gmail has opened a normal HTTPS link.
- A visible `CALL CLIENT` tel fallback remains if automatic handoff is blocked by the mobile browser.
- Invalid phone values never render a dial URI.
- `REPLY TO CLIENT`, `OPEN CRM RECORD`, lifecycle behavior, CRM data, Calendar behavior, and customer-email suppression remain unchanged.

## QA requirement

The Deploy Preview build must pass all Vitest coverage, including the dedicated mobile call-bridge regression tests, before this change is considered staging-ready.
