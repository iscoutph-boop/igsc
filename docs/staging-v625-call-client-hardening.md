# IG Sabroso V6.2.5 — Mobile Call Client hardening

Staging-only release note.

## Root cause

Gmail on iOS can suppress or fail to activate `tel:` links embedded directly in HTML email. The existing phone normalization was valid; the client-specific failure was at the Gmail mobile link-handling boundary.

A second release-hardening issue was identified during final QA: placing the sanitized phone number directly in the HTTPS bridge query (`?open=call&phone=...`) allowed the bridge target to be supplied independently of a verified CRM record.

## Hardened staging fix

- Admin lifecycle email `CALL CLIENT` uses the Apps Script Web App HTTPS origin rather than a direct Gmail `tel:` link.
- The email link contains only the normalized booking reference and CRM row (`open=call&ref=...&row=...`); it does not expose the phone number in the bridge URL.
- The bridge loads the referenced CRM row and requires its booking reference to match the requested reference before reading the stored phone number.
- Only after that CRM/reference match does the bridge sanitize the stored phone and hand off to the native `tel:` scheme.
- An arbitrary `phone=` query is rejected and never renders a dial URI.
- A mismatched booking reference/row is rejected and never renders a dial URI.
- A visible `CALL CLIENT` native-tel fallback remains if automatic mobile handoff is blocked by the browser/OS.
- Invalid or unavailable phone values render a safe unavailable state.
- `REPLY TO CLIENT`, `OPEN CRM RECORD`, lifecycle behavior, CRM data, exact Calendar-ID behavior, and customer-email suppression remain unchanged.

## Related reliability hardening

The Netlify/TanStack server-to-Apps-Script request now has an explicit 12-second abort budget. Abort errors become the deterministic transient message `Booking service timed out.`. The browser create-booking recovery path continues to reuse the same stable UUID `submissionId`, preserving Apps Script idempotency and duplicate protection.

## QA requirement

The Deploy Preview must pass a clean `npm ci`, all Vitest coverage, the production build, the dedicated CRM-bound mobile call-bridge regression tests, and live Apps Script/Calendar/Gmail lifecycle verification before production promotion.

A real mobile Gmail validation remains mandatory: tapping `CALL CLIENT` must open the native dialer with the CRM-stored client number prefilled. The operating system may require the user's final confirmation to place the call.
