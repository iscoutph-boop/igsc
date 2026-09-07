# IG Sabroso Security Hardening V6.3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the remaining CDS security re-audit findings on staging without changing the production website or the existing booking lifecycle behavior.

**Architecture:** The browser continues to call the TanStack server function. Netlify signs the exact inner request string with HMAC-SHA256 using a server-only shared secret; Apps Script verifies signature, freshness, and nonce replay before dispatching any action. Google Sheets write helpers neutralize spreadsheet-formula prefixes at the final storage boundary.

**Tech Stack:** TanStack Start, TypeScript, Node 22 Web/Node crypto, Vitest, Google Apps Script, Netlify Deploy Preview, Google Sheets, Google Calendar, Gmail.

**Spec:** `docs/superpowers/specs/2026-09-02-security-hardening-v63-design.md`

## Global Constraints

- Production `main`, the production Netlify context, `igsabroso.com`, and production Apps Script remain unchanged.
- Customer lifecycle email remains disabled in staging.
- Preserve CRM, Calendar, Manage Booking, reschedule, cancellation, admin Gmail UI, OPEN CRM RECORD, REPLY TO CLIENT, CALL CLIENT, and Powered by CDS.
- Do not commit `CRM_SHARED_SECRET` or any `/exec` endpoint.
- Do not add CAPTCHA unless layered controls fail verification.
- All security failures exposed to public callers use generic messages.

---

### Task 1: Server-to-server signing contract

**Files:**
- Create: `src/lib/crm-auth.server.ts`
- Create: `src/lib/crm-auth.server.test.ts`
- Modify: `src/lib/bookings.functions.ts`
- Modify: `src/lib/bookings.functions.test.ts`

**Interfaces:**
- Produces: `buildSignedCrmEnvelope(action, payload, secret, now?, nonce?) -> { request: string; signature: string }`
- Produces: `getCrmSharedSecret() -> string`
- Consumes: existing `fetchCRMUpstream(url, body)` and `callCRMFn`.

- [ ] **Step 1: Write failing signing tests**

Add tests that assert: no secret throws a generic configuration error; the envelope contains an exact inner JSON `request`; HMAC signature is 64 lowercase hex characters; supplied `now` and `nonce` make the envelope deterministic; the secret itself never appears in the envelope.

- [ ] **Step 2: Push the tests and verify RED in GitHub Actions**

Expected: the new test file fails because `crm-auth.server.ts`/exported functions do not exist.

- [ ] **Step 3: Implement the minimal server-only signing helper**

Use `node:crypto` `createHmac('sha256', secret).update(request, 'utf8').digest('hex')`. Generate UUID v4 with `randomUUID()` when a nonce is not supplied. Timestamp is `Math.floor(Date.now()/1000)`.

- [ ] **Step 4: Change the upstream request body**

Inside the existing `callCRMFn` handler, read `CRM_SHARED_SECRET` at request time, build the signed envelope, and send `JSON.stringify(envelope)` to Apps Script. Do not alter the browser payload contract.

- [ ] **Step 5: Run/verify GREEN**

Expected: server auth tests, existing booking schema tests, and production build pass.

---

### Task 2: Apps Script authentication and replay protection

**Files:**
- Create: `apps-script/IGS_Staging_CRM_V6_2_5.security-auth.test.ts`
- Modify: `apps-script/IGS_Staging_CRM_V6_2_5_PRODUCTION_READINESS_R2.gs`

**Interfaces:**
- Produces: `verifyAuthenticatedRequestV63_(body, nowSeconds?) -> { action: string, payload: Object }`
- Produces: `getCrmSharedSecretV63_() -> string`
- Produces: `constantTimeEqualV63_(left, right) -> boolean`
- Consumes: Apps Script `PropertiesService`, `Utilities.computeHmacSha256Signature`, `CacheService`.

- [ ] **Step 1: Write failing authentication tests**

Tests cover valid signed request, invalid signature, absent secret, stale timestamp, future timestamp, malformed UUID nonce, replayed nonce, malformed inner JSON, and failure before action dispatch.

- [ ] **Step 2: Push and verify RED**

Expected: tests fail because the verification helpers do not exist and `doPost` still accepts raw action/payload requests.

- [ ] **Step 3: Implement secret lookup and HMAC verification**

Read `CRM_SHARED_SECRET` from Script Properties. Compute HMAC-SHA256 over the exact `body.request` string. Convert signed bytes to lowercase two-character hex. Compare signature without early exit based on first mismatch.

- [ ] **Step 4: Implement freshness and replay checks**

Require version `1`; timestamp integer within +/-120 seconds; UUID v4 nonce; cache accepted nonces for 300 seconds. Only mark nonce used after all structural/signature/freshness checks succeed and immediately before dispatch.

- [ ] **Step 5: Gate `doPost` before any side effect**

Replace direct `action/payload` extraction with `verifyAuthenticatedRequestV63_(body)` and dispatch only the returned values. Catch block keeps a generic failure message for authentication failures.

- [ ] **Step 6: Verify GREEN**

Expected: all authentication tests plus existing Apps Script lifecycle/abuse tests pass.

---

### Task 3: Spreadsheet formula-injection protection at final write boundary

**Files:**
- Modify: `apps-script/IGS_Staging_CRM_V6_2_5.security-auth.test.ts`
- Modify: `apps-script/IGS_Staging_CRM_V6_2_5_PRODUCTION_READINESS_R2.gs`

**Interfaces:**
- Produces: `safeSheetValueV63_(value)`.
- Consumes: `appendRowByHeadersV6_` and `setFieldsByHeadersV6_`.

- [ ] **Step 1: Add failing Sheet-safety tests**

Assert that `=SUM(1,1)`, `+cmd`, `-1+2`, `@IMPORTXML(...)`, and whitespace-prefixed variants are written as inert text with a leading apostrophe; normal text and non-string values are unchanged.

- [ ] **Step 2: Verify RED**

Expected: current write helpers return the dangerous strings unchanged.

- [ ] **Step 3: Implement one final-boundary sanitizer**

`safeSheetValueV63_` checks a string after removing only leading Unicode/ASCII whitespace for inspection. If the first inspected character is `=`, `+`, `-`, or `@`, return an apostrophe plus the original string. Otherwise return the original value.

- [ ] **Step 4: Apply it to every shared Sheet write**

Map append-row values through `safeSheetValueV63_`; wrap update-field values before `setValue`.

- [ ] **Step 5: Verify GREEN**

Expected: new formula-injection tests and all existing CRM/Calendar tests pass.

---

### Task 4: Security configuration regression tests and documentation

**Files:**
- Modify: `src/security-config.test.ts`
- Modify: `.env.example`
- Modify: `docs/IG_SABROSO_QA_CHECKLIST.md`

**Interfaces:**
- Documents `CRM_SHARED_SECRET` as server-only and environment-scoped.

- [ ] **Step 1: Add failing regression assertions**

Assert `.env.example` includes an empty `CRM_SHARED_SECRET=` entry and comments that it is server-only and must match the Apps Script Script Property.

- [ ] **Step 2: Verify RED**

Expected: test fails until the example/config documentation is updated.

- [ ] **Step 3: Update example and QA checklist**

Document secret generation/rotation, Deploy Preview-only scope, Script Property requirement, negative unsigned-call test, formula-injection test, and secret-exposure check.

- [ ] **Step 4: Verify GREEN**

Expected: security configuration tests pass.

---

### Task 5: Staging secret configuration and source synchronization

**Files/Systems:**
- Netlify Deploy Preview environment variable
- Google Drive staging `.gs` source file
- Existing CDS Apps Script staging Web App deployment

- [ ] **Step 1: Generate a strong random secret**

Generate at least 32 random bytes and encode as hex. Never print it in chat, commit it, or place it in client-visible configuration.

- [ ] **Step 2: Set Netlify Deploy Preview `CRM_SHARED_SECRET`**

Scope only to deploy-preview contexts. Keep the existing `GOOGLE_APPS_SCRIPT_WEB_APP_URL` unchanged.

- [ ] **Step 3: Synchronize the staged Apps Script source file**

Update the existing Drive `.gs` file with the exact GitHub staging source.

- [ ] **Step 4: Configure Apps Script Script Property and redeploy existing staging Web App**

Set `CRM_SHARED_SECRET` to the exact same value and preserve the existing `/exec` URL. If the current connector cannot edit Script Properties or create a deployment version, record this as the only manual Google-console gate rather than weakening the design.

---

### Task 6: Full verification and PR status

**Systems:** GitHub Actions, Netlify Deploy Preview, Apps Script staging runtime, CRM, Calendar, Gmail.

- [ ] **Step 1: Automated verification**

Run/confirm `npm audit --omit=dev --audit-level=high`, `npm test`, and `npm run build` through the staging workflow.

- [ ] **Step 2: Verify Netlify preview**

Confirm deployment succeeds, secret scan is clean, no production environment variable is created, and the preview uses the new commit.

- [ ] **Step 3: Negative security QA**

Unsigned direct Apps Script POST, invalid signature, stale timestamp, and replayed nonce must fail with no new CRM row, Calendar event, or Gmail notification.

- [ ] **Step 4: Positive lifecycle QA**

Through the Deploy Preview: Create -> Find -> Reschedule -> Find -> Cancel -> Find. Verify one booking row, expected appointment state, Calendar lifecycle, admin-only emails, and zero customer lifecycle emails.

- [ ] **Step 5: Update PR #4**

Record exact commit, workflow run, deploy result, negative/positive QA evidence, and any remaining manual Google-console gate. Keep PR Draft and unmerged until every staging gate is green.
