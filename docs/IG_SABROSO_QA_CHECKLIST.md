# IG Sabroso Redesign QA Checklist

## Automated checks

- [ ] `npm.cmd run lint`
- [ ] `npm.cmd test`
- [ ] `npm.cmd run build`
- [ ] `npm audit --omit=dev --audit-level=high` reports zero production vulnerabilities
- [ ] No browser console errors
- [ ] No missing-image requests
- [ ] No exposed server environment values

## Security hardening V6.3

- [ ] `CRM_SHARED_SECRET` exists only in the Netlify Deploy Preview server/runtime context during staging
- [ ] `CRM_SHARED_SECRET` is configured as the matching Google Apps Script Script Property
- [ ] Secret value is at least 32 random bytes and is never committed, logged, displayed, or exposed in client bundles
- [ ] Rotate the Netlify value and Apps Script Script Property together when rotation is required
- [ ] Direct legacy/unsigned Apps Script POST is rejected with a generic failure and creates no CRM, Calendar, or Gmail side effect
- [ ] Invalid HMAC signature is rejected before action dispatch
- [ ] Signed request older/newer than the allowed clock window is rejected
- [ ] Reusing an accepted nonce is rejected during the replay-cache window
- [ ] Valid signed Deploy Preview request reaches the Apps Script lifecycle successfully
- [ ] Formula-triggering Sheet inputs beginning with `=`, `+`, `-`, or `@`, including leading-whitespace variants, are stored as literal inert text
- [ ] Normal CRM values remain unchanged after final-boundary Sheet sanitization
- [ ] Server-function rate limiting returns a safe throttling response when deliberately exceeded with a small controlled test
- [ ] CSRF/origin checks reject inappropriate cross-site server-function requests
- [ ] Honeypot and spam screening reject controlled bot/solicitation fixtures without affecting legitimate inquiries
- [ ] Security headers are verified from the actual Deploy Preview response, not only from `netlify.toml`
- [ ] Secret scan of source and final deployed client assets reports no credential exposure

### Staging secret setup / rotation procedure

1. Generate a cryptographically random value of at least 32 bytes. Do not paste it into source code or documentation.
2. Store it in Netlify as secret environment variable `CRM_SHARED_SECRET`, scoped to Deploy Preview server runtime/functions only while staging.
3. Store the identical value in the existing CDS Apps Script project under **Project Settings → Script Properties → `CRM_SHARED_SECRET`**.
4. Redeploy the existing staging Web App while preserving the approved `/exec` URL.
5. Run the negative unsigned/invalid-signature/stale/replay checks before any positive lifecycle test.
6. Run Create → duplicate Create → Find → Reschedule → Find → Cancel → Find through the Deploy Preview and verify CRM, Calendar, and Gmail side effects.
7. If rotating, replace both sides in one controlled maintenance window; a mismatched value intentionally fails closed.

## Core navigation

- [ ] Header logo returns to `/`
- [ ] About opens `/details#about`
- [ ] Services opens `/details#services`
- [ ] Projects opens `/projects`
- [ ] Process opens `/details#process`
- [ ] Reviews opens `/details#reviews`
- [ ] Contact opens `/details#contact`
- [ ] Consultation opens `/consultation`
- [ ] Mobile menu traps focus and closes with Escape
- [ ] Manage Booking opens from desktop and mobile navigation

## Homepage

- [ ] Hero image crops correctly on desktop and mobile
- [ ] Primary CTA and projects CTA are visible without overlap
- [ ] Metrics wrap correctly at 320px
- [ ] Service cards remain readable
- [ ] Featured project links are correct
- [ ] Review content is approved
- [ ] Footer contact links work

## Details

- [ ] All hash sections have the correct IDs
- [ ] Direct hash links scroll to the intended section
- [ ] Reduced-motion users do not receive animated scrolling
- [ ] Packages and estimator are not rendered in the default public flow
- [ ] Process keyboard controls work

## Projects

- [ ] All/Residential/Commercial/Renovation/Multi-unit/Completed/Ongoing filters work
- [ ] Search matches project name and location
- [ ] Empty state clears filters
- [ ] Every card opens a shareable detail route
- [ ] Every detail gallery uses only project-specific images
- [ ] Ongoing render status is explicit
- [ ] Unknown project slug returns the app's not-found state

## Consultation and booking

- [ ] Required fields prevent incomplete submission
- [ ] Date and time are required
- [ ] Privacy consent is required
- [ ] Honeypot rejects bot-filled submissions
- [ ] Loading state disables duplicate submission
- [ ] Server error is announced with `role="alert"`
- [ ] Successful submission displays a booking reference
- [ ] Booking lookup works
- [ ] Reschedule works
- [ ] Cancellation works
- [ ] No personally identifiable information is logged

## Responsive widths

- [ ] 320px
- [ ] 375px
- [ ] 390px
- [ ] 414px
- [ ] 430px
- [ ] 768px
- [ ] 1024px
- [ ] 1280px
- [ ] 1440px+

## Accessibility

- [ ] Skip-to-content link works
- [ ] One visible H1 per route
- [ ] Logical heading order
- [ ] Keyboard-visible focus
- [ ] Dialog focus management
- [ ] Accurate image alt text
- [ ] Decorative images are hidden from assistive technology
- [ ] Color contrast passes
- [ ] Touch targets are at least 44px
- [ ] Reduced-motion behavior works

## Production handoff

- [ ] Preview deployment approved by client
- [ ] CRM environment variable configured
- [ ] Contact information reconfirmed
- [ ] Project data reconfirmed
- [ ] Review permissions reconfirmed
- [ ] Domain, SSL, forms, metadata, and analytics verified after launch
