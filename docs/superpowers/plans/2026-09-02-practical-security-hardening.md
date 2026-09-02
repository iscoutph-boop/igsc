# IG Sabroso Practical Security Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the smallest practical production-readiness security controls for the IG Sabroso consultation and booking workflow without changing design, customer experience, CRM/Calendar behavior, or production.

**Architecture:** Keep the existing TanStack Start server-function → Google Apps Script → Google Sheets/Calendar/Gmail architecture. Strengthen the existing server boundary with stricter Zod validation and a server-validated honeypot, add a conservative Netlify edge rate limit for server functions, and add low-risk HTTP response headers. Preserve the Apps Script booking authorization, idempotency, CRM and notification lifecycle.

**Tech Stack:** React 19, TypeScript, TanStack Start, Zod, Vitest, Netlify, Google Apps Script, Google Sheets, Google Calendar, Gmail.

**Spec:** User-approved WEBSITE SECURITY AUDIT & PRACTICAL HARDENING instructions dated 2026-09-02.

## Global Constraints

- Staging first; production must remain untouched until explicit approval.
- Do not merge or publish production changes.
- Preserve current design, forms, booking management, Gmail notifications, CRM, Calendar integration, mobile behavior, and animations.
- Prefer free/platform-native controls and minimal dependencies.
- Do not add CAPTCHA or Turnstile unless real spam remains after basic controls.
- Never use `npm audit fix --force`.
- Do not expose or print secrets.

---

### Task 1: Strengthen booking payload validation

**Files:**
- Modify: `src/lib/bookings.functions.test.ts`
- Modify: `src/lib/bookings.functions.ts`
- Modify: `src/routes/consultation.tsx`

**Interfaces:**
- Consumes: existing `createBookingPayloadSchema` and consultation form payload.
- Produces: server-enforced valid email format, exact allowlists for project type/service/budget/lead source, and a mandatory empty honeypot value.

- [ ] **Step 1: Write failing tests**
  - Reject malformed non-empty email addresses.
  - Accept an empty optional email address.
  - Reject project types outside the UI allowlist.
  - Reject services outside the UI allowlist.
  - Reject budget values outside the UI allowlist while allowing an empty value.
  - Reject non-empty honeypot values and require the honeypot field in create submissions.

- [ ] **Step 2: Run `npm test -- src/lib/bookings.functions.test.ts` and verify the new tests fail for the intended missing controls.**

- [ ] **Step 3: Implement the minimum schema changes**
  - Add explicit enums matching the current consultation UI options.
  - Transform optional email by trimming; allow empty string or a valid email, maximum 254 characters.
  - Require `companyWebsite` and only accept an empty trimmed value.
  - Preserve all existing spreadsheet-prefix sanitization and field limits.
  - Add `companyWebsite` to the client payload without changing visible UI.

- [ ] **Step 4: Run the focused unit test, then the full unit suite.**

### Task 2: Add basic Netlify edge abuse controls

**Files:**
- Modify: `netlify.toml`

**Interfaces:**
- Consumes: TanStack Start server-function endpoint prefix `/_serverFn/*`.
- Produces: conservative per-IP/domain rate limiting and baseline headers without adding dependencies.

- [ ] **Step 1: Add a Netlify rate-limit redirect rule for `/_serverFn/*`**
  - Maximum 10 requests per 60 seconds per IP and domain.
  - Default 429 action.
  - Do not add CORS headers.

- [ ] **Step 2: Add low-risk security headers for `/*`**
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `X-Frame-Options: SAMEORIGIN`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - Do not add a strict CSP or HSTS preload during this patch.

- [ ] **Step 3: Build/deploy the isolated security branch and confirm Netlify accepts the configuration.**

### Task 3: Repository secret hygiene

**Files:**
- Review: `.gitignore`
- Review without printing: `.env.production`

**Interfaces:**
- Produces: a documented decision on whether the tracked env file is sensitive or required.

- [ ] **Step 1: Confirm `.env.production` is tracked even though `.env.*` is ignored.**
- [ ] **Step 2: Do not print its content. If it contains a real secret, report `SENSITIVE SECRET DETECTED`, move the value to Netlify environment variables, remove the tracked file, and rotate the secret.**
- [ ] **Step 3: If it contains only a non-secret deployment toggle or harmless value, still recommend untracking it for consistent env hygiene, but do not claim a secret was exposed.**

### Task 4: Dependency verification

**Files:**
- Review: `package.json`
- Review: `package-lock.json`

- [ ] **Step 1: Run `npm audit` in an environment with npm registry access.**
- [ ] **Step 2: Review each production-impacting finding; prefer targeted compatible upgrades.**
- [ ] **Step 3: Do not run `npm audit fix --force`.**

### Task 5: Staging regression and abuse QA

**Files:**
- Existing tests and staging deployment only.

- [ ] Verify normal customer submission works.
- [ ] Verify invalid email is rejected server-side.
- [ ] Verify missing fields are rejected.
- [ ] Verify overlong input is rejected.
- [ ] Verify honeypot is rejected server-side.
- [ ] Verify repeated requests receive rate limiting when threshold is exceeded.
- [ ] Verify duplicate submission remains idempotent.
- [ ] Verify HTML/script content is escaped/safe in CRM/email.
- [ ] Verify notification recipient cannot be overridden.
- [ ] Verify admin Gmail notification remains operational.
- [ ] Verify CRM record and Calendar lifecycle remain operational.
- [ ] Verify find/reschedule/cancel still require booking reference plus matching contact.
- [ ] Verify desktop/mobile consultation UI has no visual regression.
- [ ] Verify no major console errors.

### Task 6: Security report and production gate

- [ ] Classify every audited control PASS / NEEDS IMPROVEMENT / MISSING / NOT VERIFIED.
- [ ] Record P1/P2/P3 priority, practical fix, and verification result.
- [ ] Keep overall assessment proportional to a small-business site.
- [ ] Stop before production deployment and request explicit production approval only after staging QA passes.
