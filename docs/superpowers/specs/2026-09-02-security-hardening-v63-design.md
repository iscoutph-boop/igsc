# IG Sabroso Security Hardening V6.3 Design

## Scope

This design closes the remaining security findings from the 2026-09-02 CDS re-audit while preserving the existing booking lifecycle, Gmail admin UI, CRM, Calendar, Manage Booking, reschedule, cancellation, and the staging-only production boundary.

Production `main`, the production Netlify context, `igsabroso.com`, and any production Apps Script migration remain untouched until a separate production approval.

## Security objectives

1. Prevent unauthenticated callers from invoking the Google Apps Script booking API directly.
2. Prevent replay of authenticated server-to-server requests.
3. Enforce spreadsheet formula-injection protection at the final Google Sheets write boundary, not only in the TanStack server validator.
4. Keep the existing public form resistant to bots, repeated submissions, spam/SEO solicitation, malicious-link campaigns, and abusive request bursts.
5. Preserve generic public errors and avoid exposing secrets, endpoint URLs, stack traces, CRM internals, or customer PII.
6. Keep customer lifecycle emails disabled in staging.
7. Keep the implementation practical for a small-business website; do not add CAPTCHA unless the existing layered controls prove insufficient.

## Architecture

### 1. Authenticated server-to-server envelope

The browser continues to call the TanStack `callCRMFn` server function. Only the Netlify server knows the Apps Script endpoint and a shared secret.

The Netlify server builds a signed request envelope:

```json
{
  "request": "{\"version\":1,\"timestamp\":...,\"nonce\":\"...\",\"action\":\"createBooking\",\"payload\":{...}}",
  "signature": "lowercase-hex-hmac-sha256"
}
```

`request` is an exact JSON string. The signature is `HMAC-SHA256(request, CRM_SHARED_SECRET)`. This avoids JSON canonicalization ambiguity because Apps Script verifies the exact string that Netlify signed before parsing it.

Netlify reads `CRM_SHARED_SECRET` from a secret environment variable. Apps Script reads the same value from `PropertiesService.getScriptProperties().getProperty('CRM_SHARED_SECRET')`. The secret is never committed to GitHub, included in client bundles, returned to the browser, logged, or stored in the CRM.

### 2. Apps Script authentication and replay protection

`doPost` verifies the envelope before dispatching any booking action or side effect.

Verification requirements:

- `request` and `signature` are present and bounded.
- Apps Script shared secret exists; otherwise fail closed.
- HMAC is recalculated using `Utilities.computeHmacSha256Signature` and compared in constant-time style.
- parsed `version` must equal `1`.
- `timestamp` must be an integer within +/- 120 seconds of server time.
- `nonce` must match a UUID v4 format.
- nonce must not already exist in script cache; accepted nonces are cached for 300 seconds.
- `action` must be one of the four existing booking actions.
- only after all checks pass may the existing dispatcher execute.

Authentication failures return the same generic failure message and must not reveal whether the timestamp, nonce, signature, or secret was wrong.

### 3. Final-boundary Sheet safety

All values written through `appendRowByHeadersV6_` and `setFieldsByHeadersV6_` pass through one helper before `setValues`/`setValue`.

For string values, after trimming leading Unicode/ASCII whitespace for inspection, a leading `=`, `+`, `-`, or `@` is neutralized by prefixing an apostrophe. Normal strings, numbers, booleans, and date values are preserved.

This control applies to Bookings, Appointments, audit notes, cancellation reasons, reschedule notes, contact values, and any future field that uses the shared write helpers.

### 4. Existing layered abuse controls retained

The current controls remain active:

- browser hidden honeypot;
- server-side Zod schemas with length, enum, phone, email, date, time, consent, and booking-reference constraints;
- Netlify IP/domain rate limiting on `/_serverFn/*`;
- TanStack same-origin CSRF middleware;
- stable UUID submission id;
- Apps Script honeypot enforcement;
- Apps Script multi-signal solicitation/URL screening;
- recent duplicate fingerprint cache;
- Apps Script lock/idempotency and side-effect reconciliation;
- generic errors;
- HTML escaping in notification UIs;
- fixed internal admin recipient;
- customer lifecycle notifications disabled in staging.

A CAPTCHA is deliberately not introduced in this pass because it would add UX and operational complexity while the existing layered controls plus authenticated upstream boundary are appropriate for the current threat level.

## Configuration

### Netlify Deploy Preview

Add secret environment variable:

`CRM_SHARED_SECRET=<32+ random bytes encoded as hex or base64url>`

Scope it to Deploy Preview runtime/functions/build contexts only as needed by the TanStack server. Do not create a Production value yet.

### Apps Script staging deployment

Add Script Property:

`CRM_SHARED_SECRET=<exact same secret>`

Redeploy the existing staging Web App while preserving the existing `/exec` URL.

## Testing

### Server tests

Add tests proving:

- signed envelopes are deterministic for the supplied request string and secret;
- upstream requests contain the signed envelope rather than a raw action/payload body;
- missing `CRM_SHARED_SECRET` fails before an upstream request is made;
- no secret appears in thrown errors.

### Apps Script tests

Add tests proving:

- valid signatures are accepted;
- invalid signatures fail before CRM/Calendar/Gmail side effects;
- expired/future timestamps fail;
- replayed nonce fails;
- malformed envelopes fail closed;
- spreadsheet write helpers neutralize formula prefixes including leading whitespace;
- legitimate ordinary text is preserved;
- the existing honeypot, abuse-screening, duplicate-submission, booking lifecycle, Calendar identity, and CALL CLIENT tests remain green.

### Deployment verification

Run:

- `npm ci --ignore-scripts --no-audit --no-fund`
- `npm audit --omit=dev --audit-level=high`
- `npm test`
- `npm run build`
- GitHub Actions `Staging Final Verification`
- Netlify Deploy Preview build and secret scan
- live staging Create -> Find -> Reschedule -> Find -> Cancel -> Find
- negative direct Apps Script POST without signature must fail and create no CRM row, Calendar event, or email
- authenticated path through Deploy Preview must continue to succeed

## Acceptance criteria

Security hardening is considered code-green when:

- all automated tests pass;
- production dependency audit has zero high/critical runtime advisories;
- staging build succeeds;
- Apps Script rejects unsigned, invalid, expired, and replayed requests before side effects;
- spreadsheet formula payloads are stored as inert text;
- normal booking lifecycle still works through staging;
- no customer lifecycle email is sent;
- no secret is committed or exposed to the client;
- PR #4 remains unmerged and production remains unchanged.
