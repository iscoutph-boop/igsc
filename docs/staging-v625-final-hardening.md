# IG Sabroso V6.2.5 R2 — Final staging hardening checkpoint

Staging only. Production remains untouched.

## Mobile Gmail Call Client

- Root cause isolated to Gmail iOS handling of direct `tel:` links inside HTML email.
- Admin `CALL CLIENT` now targets an HTTPS Apps Script call bridge.
- The bridge sanitizes the dialable number, hands off to the native `tel:` scheme, and presents a visible fallback `CALL CLIENT` control.
- Invalid/non-dialable values do not render a telephone URI.
- Dedicated regression coverage was added before the source fix; the pre-fix build failed and the post-fix build passed.

## Project-media performance

- Live `public/assets/projects` media before optimization: 81,342,083 bytes.
- Conservative JPEG/PNG optimization pass after total: 9,141,914 bytes.
- Savings from the first pass: 72,200,169 bytes (~88.8%).
- Townhouse featured thumbnail then changed from 1,732,286-byte PNG to 137,886-byte WebP.
- Approximate final project-media set: 7,547,514 bytes, ~90.7% below the original set.
- No project imagery was cropped, retouched, replaced, or semantically altered; oversized photos were resized for high-resolution web delivery and recompressed at high quality.

## Backend / CRM audit

- Bookings and Appointments references remain one-to-one through the current staging data set.
- Cancelled QA records are cancelled in both tables.
- Existing active/current records were not changed by the hardening pass.
- Customer lifecycle email automation remains disabled as required.
- Existing idempotent create/retry and side-effect reconciliation behavior remains intact.

## Final gate

The Deploy Preview must build from this checkpoint with the complete Vitest suite, including Call Client bridge coverage, and complete the Netlify secret scan with zero matches before the hardening pass is considered staging-ready.
