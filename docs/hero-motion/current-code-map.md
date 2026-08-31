# Concept 03 hero integration map

## Verified host

- Desktop and mobile media host: `src/features/home/concept03-hero-media.tsx`
- Unique production marker: `data-testid="concept03-desktop-hero-media"`
- Existing host test: `src/features/home/concept03-hero-media.test.tsx`

## Current host imports and assets

- React hooks and pointer event types from `react`
- Approved base: `src/assets/real/concept03/hero-base-approved.png`
- Existing finished layer: `src/assets/real/concept03/hero-finished-full.webp`
- Error fallback: `src/assets/real/home-hero-sketch-house.png`

## Test and build commands

- Unit/component tests: `npm run test`
- Production build: `npm run build`
- Lint: `npm run lint`
- Local development: `npm run dev`
- Test framework: Vitest 4 with Testing Library and jsdom

## Integration boundary

The patch may add `src/features/hero-motion/`, four files under
`public/assets/hero-motion/`, hero-specific tests and QA notes, and a small
integration change in the verified host. The approved base remains the only
high-priority image. Mobile markup remains static.

## Explicitly out of scope

Routes, navigation, hero copy, CTA labels or destinations, forms, booking,
mobile layout, sections below the hero, global styles, backend behavior,
integrations, analytics, footer, and Netlify configuration.
