# IG Sabroso Redesign QA Checklist

## Automated checks

- [ ] `npm.cmd run lint`
- [ ] `npm.cmd test`
- [ ] `npm.cmd run build`
- [ ] No browser console errors
- [ ] No missing-image requests
- [ ] No exposed server environment values

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
