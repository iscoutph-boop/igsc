# IG Sabroso Homepage Responsive Design

## Status

Approved by the user through the supplied desktop and mobile references on
2026-07-29. This specification replaces the previous instruction to keep the
homepage unchanged. It applies only to `/`; the refined `/details` and
`/consultation` experiences remain unchanged.

## Design read

This is a preservation redesign for prospective residential and commercial
construction clients. The visual language is cinematic and trust-led: one
full-bleed project photograph, warm neutral overlays, a single orange brand
accent, restrained glass surfaces, and short conversion-focused copy.

- `DESIGN_VARIANCE: 6`
- `MOTION_INTENSITY: 3`
- `VISUAL_DENSITY: 4`
- Design system: existing Tailwind v4 utilities, project tokens, Framer Motion,
  and Lucide because they are already established dependencies.

## Shared requirements

- Use the existing Lovable-hosted `helmet-hero.png` asset that shows the row of
  branded white hard hats.
- Fill the first viewport with the hero using `min-height: 100dvh`; never use
  `100vh`.
- Keep the existing orange brand accent and Poppins/Montserrat typography.
- Use regular hyphens in visible copy. Do not introduce em dashes or en dashes.
- Preserve `/details#about`, `/consultation`, booking-modal behavior, theme
  behavior, focus indicators, reduced-motion behavior, and the global contact
  widget.
- Do not modify the route structure, interior-page content, form fields, or
  project data.

## Desktop composition

Target reference: 1600 x 750.

- Full-bleed row-of-hard-hats image with the hero crop centered slightly right.
- Warm ivory overlay keeps dark text legible while retaining the photographic
  depth and orange helmet logos.
- Header stays within a 1400px content frame and remains no taller than 72px.
- Logo and wordmark sit left. A translucent white pill holds the six primary
  navigation links in the center. Social icons, the circular theme toggle, and
  the orange Consultation pill sit right.
- The active Home item is an orange pill.
- Main H1 copy sits in the upper-left hero area:
  "Dependable building solutions for homes, renovations, and civil works."
- A short orange rule sits above the H1.
- "Check Booking" appears below the H1 in a white pill with a calendar icon.
- The supporting line "Building the future with quality and trust." sits at the
  upper-right, aligned with a short orange rule.
- Two translucent metric cards stack on the right:
  "10+ Years of construction experience" and
  "300+ Projects completed".
- The conversion stack is centered near the lower edge: compact brand line,
  orange Discover More pill, then the confidence slogan.
- The contact launcher remains at the bottom-right and does not cover the CTA.

## Mobile composition

Target reference: iPhone-class viewport, verified at 390 x 844 and 430 x 932.

- Hide the homepage header entirely below 768px.
- Keep the row-of-hard-hats image full-bleed and crop it so the branded foreground
  helmet remains the visual focus.
- Place the H1 and Check Booking control near the upper-left with 24-32px side
  gutters.
- Reserve flexible image-led space through the middle of the viewport.
- Place two equal translucent metric pills in one row near the lower third.
- Put the full-width Discover More pill below the metrics.
- Center the confidence slogan beneath the CTA and allow it to wrap to two lines.
- Render a larger orange contact launcher at the lower-right while maintaining
  safe-area clearance.
- Do not create horizontal overflow at 360px, 390px, or 430px widths.

## Interaction and accessibility

- "Check Booking" opens the existing booking modal.
- "Discover More" navigates to `/details#about`.
- Header navigation links preserve their current destinations.
- Theme toggle retains an accessible label.
- Mobile menu remains available only on intermediate/tablet layouts where the
  full navigation does not fit; it is not shown on the phone homepage.
- All interactive targets are at least 44px.
- Buttons keep visible focus states and sufficient text contrast.
- Motion is limited to a subtle initial fade/scale and tactile hover/press states.
  Reduced-motion users receive the final static state immediately.

## Acceptance criteria

1. Desktop and mobile screenshots match the supplied composition, hierarchy,
   crop, spacing, colors, radii, and CTA placement.
2. The row-of-hard-hats image is used rather than the single-hat fallback.
3. The desktop header contains the centered pill navigation and right-side
   actions.
4. The phone homepage has no visible header.
5. Booking, navigation, theme, Discover More, and contact controls still work.
6. Tests, lint, and production build pass.
7. The published custom domain serves the new homepage at both desktop and
   mobile viewports with no app-owned console errors.
