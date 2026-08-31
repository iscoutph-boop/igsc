# Concept 03 hero motion QA results

Date: 2026-08-31

## Release state

- Branch: `feature/hero-motion-2x-reveal`
- Draft PR: https://github.com/iscoutph-boop/igsc/pull/1
- Deploy preview: https://deploy-preview-1--darling-sunburst-da0a5d.netlify.app/
- Preview commit at QA: `85b3160d5cee29209fef5035b5190dcc60bbf6e0`
- Production commit remains: `1e4fbc2084bb57db3326860cc1d003fc3730d126`
- Production publish: **not performed**

## Automated verification

| Check | Result |
| --- | --- |
| `npm run test` | PASS — 23 files, 47 tests |
| `npm run lint` | PASS — 0 errors; 7 pre-existing Fast Refresh warnings in unrelated UI files |
| `npm run build` | PASS |
| `npx playwright test --list` | PASS — 3 E2E cases discovered |
| Local Playwright execution | NOT RUN — browser download was unavailable in this environment |

The E2E definitions cover desktop three-state behavior, the static touch fallback, and reduced motion.

## Live deploy-preview verification

Tested in the connected Chrome browser at 1363 × 936.

| Gate | Result | Evidence |
| --- | --- | --- |
| Enhancement initialization | PASS | `data-interaction-ready="true"`; four 1536 × 864 layers decoded |
| Resting state | PASS | `idle`; all light layer opacities `0` |
| Native cursor | PASS | computed cursor is `auto`; no custom cursor or canvas |
| Sketch interaction | PASS | `sketchReveal`; 218.08 px computed radial diameter with a feathered edge |
| Lighting interaction | PASS | `finishedLights`; interior, exterior, and bounce rules stage in order |
| Lighting timing | PASS | 70 + 190 ms, 120 + 200 ms, and 180 + 240 ms; maximum is 420 ms |
| Pointer exit | PASS | returns to `idle`; all light opacities return to `0` |
| Exact exit restoration | PASS | initial-rest and post-light exit hero crops have RMSE `0 (0)` |
| Geometry/layout shift | PASS | hero media remains 781.828 × 650 in all states |
| Horizontal overflow | PASS | document width does not exceed the viewport |
| Console | PASS | no site-origin error or warning entries |
| Accessibility semantics | PASS | overlays are empty-alt, `aria-hidden`, decorative, and pointer-safe |
| Content regression | PASS | preview and production title, H1, nav links, CTA labels/targets, stats, and skip link match |

Screenshots captured outside the repository:

- `igs-hero-preview-final-desktop-rest.jpg`
- `igs-hero-preview-final-desktop-sketch-reveal.jpg`
- `igs-hero-preview-final-desktop-lights-settled.jpg`
- `igs-hero-preview-final-desktop-exit-restored-verified.jpg`

## Responsive and reduced-motion status

- Component tests confirm the touch/mobile fallback stays static and the mobile hero component is unchanged.
- Unit tests confirm reduced motion removes intent delay; the feature CSS removes transition durations and delays under `prefers-reduced-motion: reduce`.
- The live 1024/768/390 visual matrix was **not captured** because the connected browser exposes a fixed desktop viewport and blocks local responsive-frame URLs.
- This responsive visual gate remains open before production approval.

## Performance and asset contract

| Asset | Dimensions | Size |
| --- | ---: | ---: |
| `hero-finished-full.webp` | 1536 × 864 | 82,208 B |
| `hero-light-interior.webp` | 1536 × 864 | 7,486 B |
| `hero-light-exterior.webp` | 1536 × 864 | 26,154 B |
| `hero-light-bounce.webp` | 1536 × 864 | 63,890 B |
| **Total** |  | **179,738 B** |

- The approved base remains the only `fetchPriority="high"` image.
- Interaction assets load after the base and remain below the 620 KB combined budget.
- Pointer movement writes CSS variables through one animation frame and does not set React state on every pointer move.
- Netlify Lighthouse mobile scores: production `63` performance / `97` accessibility; deploy preview `39` performance / `97` accessibility.
- Netlify does not expose the individual LCP comparison through the connected deploy reader, so the plan's `≤100 ms or 5%` LCP-regression gate is **not cleared**. The preview is therefore held for review.

## Scope verification

Only the isolated hero feature, its four assets, the resolved home hero host, hero tests/configuration, and QA documentation changed. The approved base image, Projects, routes, navigation, copy, CTAs, forms, booking, mobile layout, backend, global styles, and Netlify configuration were not modified.
