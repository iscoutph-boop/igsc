# IG Sabroso Mobile Responsive Redesign Design Specification

**Date:** 2026-08-06  
**Target branch:** `codex/igsabroso-mobile-responsive-redesign`  
**Repository:** `iscoutph-boop/igsc`

## 1. Objective

Redesign the IG Sabroso website's mobile and tablet experience to closely match the approved reference screens while preserving the existing desktop implementation, routes, data, booking workflow, consultation form, analytics, SEO, and Lovable deployment behavior.

The redesign must be genuinely responsive across real mobile widths rather than optimized for a single screenshot size.

## 2. Responsive Scope

- `320pxâ€“479px`: compact phone layout
- `480pxâ€“767px`: large phone layout
- `768pxâ€“1023px`: tablet adaptation
- `1024px+`: preserve the approved desktop composition and behavior

Desktop visual changes are out of scope unless a shared accessibility, overflow, or performance correction is required.

## 3. Visual Direction

### Core style

- Premium light construction brand
- Warm white / off-white background
- Deep navy typography
- IG Sabroso orange accent
- Thin neutral borders
- Restrained shadows
- Condensed architectural headings
- Generous but controlled spacing
- Real IG Sabroso project imagery already present in the repository

### Architectural pencil-line background

Add one reusable lightweight SVG background asset with:

- low-opacity architectural drawing lines
- no embedded raster image
- no text
- transparent background
- `pointer-events: none`
- opacity between `0.05` and `0.10`
- applied only to selected light sections
- hidden or repositioned when it could reduce readability

Preferred sections:
- About
- Services introduction
- Reviews
- Contact
- selected project-page backgrounds

## 4. Mobile Header

The header must closely match the reference:

- official IG Sabroso logo on the left
- compact orange `GET A QUOTE` CTA
- hamburger button on the right
- white background
- thin bottom border
- sticky behavior
- no clipping at 320px
- minimum 44px touch targets
- no horizontal overflow

At narrow widths, reduce CTA horizontal padding before reducing the type size. Keep `GET A QUOTE` on one line.

The existing accessible mobile navigation dialog, focus trap, Escape handling, active-route state, booking modal, and consultation route must be preserved.

## 5. Home Hero

Mobile order:

1. Header
2. Full-width real project hero image
3. Soft white gradient transition
4. Eyebrow label
5. Two-line condensed headline
6. Short supporting copy
7. Primary and secondary CTA
8. Metrics panel

Requirements:

- use existing real hero image
- maintain meaningful crop with `object-fit: cover`
- prioritize hero loading
- no layout shift
- heading uses responsive `clamp()`
- CTAs stack only when necessary
- metrics use 2Ã—2 on compact phones and may use four columns on wider screens
- desktop hero remains unchanged

## 6. About Section

Mobile composition:

- eyebrow
- large heading
- concise supporting copy
- full-width real project image
- Mission, Vision, and Values cards
- metrics strip
- consultation CTA

Behavior:

- one-column cards on compact phones
- optional multi-column cards on larger mobile/tablet
- pencil-line background placed behind content with low opacity
- real company profile content only

## 7. Services Section

Mobile composition:

- eyebrow
- headline
- supporting copy
- real image banner
- service card grid
- CTA strip
- trust/value indicators

Behavior:

- one card per row on compact phones
- two cards per row only when card width remains readable
- full card remains visually balanced
- existing consultation links remain functional
- no invented service claims

## 8. Projects Page

Mobile composition:

- eyebrow
- large heading
- supporting copy
- horizontally scrollable category filters
- vertical project list
- featured project panel
- metrics strip

Behavior:

- search remains functional
- filter state remains functional
- no page-wide horizontal scroll
- cards stack image above content on compact phones
- image/text split may be used on wider mobile only
- use current project records and images
- project links and analytics events remain functional
- no fake projects from reference mockups

## 9. Process Section

Use a mobile vertical timeline instead of the desktop tab layout.

Mobile layout:

- section heading
- short intro
- numbered orange circles
- vertical connector line
- white process cards
- icon on the right
- four stages visible in sequence
- real CTA image panel below

Desktop and large tablet may retain the existing interactive tab treatment.

The existing process data remains the single source of truth.

## 10. Reviews Section

Mobile layout:

- section heading
- supporting copy
- review cards or automatic-only single-card slider
- rating treatment
- real client review text only
- supporting real project image

For the home overview testimonial, preserve the approved automatic-only slider:
- no arrows
- no dots
- no play/pause
- automatic transition
- no layout shift
- reduced-motion users receive an instant content change

## 11. Contact / Consultation

Mobile composition:

- eyebrow
- large heading
- intro
- real project image with soft fade
- form card
- contact information card
- bottom project CTA image

Form requirements:

- one column on phones
- two columns only when sufficient width exists
- visible labels
- minimum 48px field height
- clear validation and error state
- full-width submit button
- booking and consultation data flow preserved
- no exposed private endpoint or credential
- no invented contact details

## 12. Responsive Quality Requirements

The implementation must pass at:

- 320px
- 360px
- 375px
- 390px
- 414px
- 430px
- 768px
- 1024px
- 1440px

Required behavior:

- no horizontal overflow
- no clipped text
- no overlapping controls
- minimum 44px interactive targets
- minimum 16px body type where practical
- safe-area-aware spacing
- keyboard-accessible mobile menu
- visible focus state
- reduced-motion support
- lazy-load below-fold images
- optimized WebP project assets
- stable image dimensions
- no desktop regression at 1024px+

## 13. Architecture

Use shared data and behavior with responsive presentation layers.

Recommended implementation:

- reusable mobile section shell
- reusable architectural sketch background component or utility
- mobile-only layout branches where the desktop structure is fundamentally different
- responsive Tailwind classes where only spacing or grid behavior changes
- no duplicated project, service, review, process, or company data
- no separate mobile routes

## 14. Expected Files

Likely modifications:

- `src/components/site-header.tsx`
- `src/components/brand/brand-lockup.tsx`
- `src/features/home/home-page.tsx`
- `src/features/details/components/about-section.tsx`
- `src/features/details/components/services-section.tsx`
- `src/features/details/components/process-section.tsx`
- `src/features/details/components/reviews-section.tsx`
- `src/features/details/components/consultation-close.tsx`
- `src/features/projects/projects-page.tsx`
- `src/features/consultation/consultation-form.tsx`
- `src/styles.css`

Likely new files:

- `src/components/ui/architectural-sketch.tsx`
- `public/brand/architecture-pencil-lines.svg`
- focused mobile-responsive tests where needed

Actual file changes must follow the current repository structure after inspection.

## 15. Testing Strategy

Before implementation:
- inspect existing tests and responsive component structure
- add failing tests for critical mobile structure and preserved functionality

During implementation:
- run focused tests after each component task
- keep changes small and independently reviewable

Final verification:

```powershell
npm.cmd run audit:redesign
npm.cmd run lint
npm.cmd test
npm.cmd run build
git diff --check
```

Manual QA:

- Chrome responsive mode
- actual Android Chrome when available
- iPhone Safari when available
- portrait and landscape
- 200% zoom
- mobile menu open/close
- all anchors and routes
- project filters and search
- consultation validation
- booking modal
- testimonial auto-rotation
- desktop regression review

## 16. Non-Negotiable Constraints

- Do not rebuild the application from scratch.
- Do not replace the existing framework.
- Do not remove working functionality.
- Do not change desktop composition unnecessarily.
- Do not invent project data, reviews, services, statistics, contact information, or credentials.
- Do not expose environment variables or private endpoints.
- Do not publish automatically before local visual QA and user approval.
- Use only existing real project assets and approved brand assets.
- Maintain accessibility, performance, SEO, and mobile usability.

