# IG Sabroso Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the `/` hero to match the approved desktop and mobile references, then publish the verified result to GitHub and Lovable.

**Architecture:** Move homepage presentation from the route module into a focused
`HomePage` feature component. Keep route metadata and registration in
`src/routes/index.tsx`. Rework the homepage-only header and add a route-aware
closed-state treatment to the shared contact launcher without changing its panel
behavior.

**Tech Stack:** TanStack Start, React 19, TypeScript, Tailwind CSS v4, Framer
Motion, Lucide React, Vitest, Testing Library, Lovable hosting.

## Global Constraints

- Change only the homepage composition and its route-specific header/contact presentation.
- Use the existing `helmet-hero.png.asset.json` image.
- Keep `/details` and `/consultation` behavior unchanged.
- Use `min-height: 100dvh`, not `100vh`.
- Hide the homepage header below 768px.
- Preserve booking modal, theme, navigation, and contact behavior.
- No new runtime dependency.
- Use regular hyphens in visible copy.

---

### Task 1: Add the homepage behavioral contract

**Files:**
- Create: `src/features/home/home-page.test.tsx`
- Create after RED: `src/features/home/home-page.tsx`

**Interfaces:**
- Produces: `<HomeHeroContent onOpenBooking: () => void />`
- Produces: `<HomePage />`
- Consumes: current booking modal, `SiteHeaderHome`, PageTransition, and the helmet asset JSON.

- [ ] **Step 1: Write the failing component test**

Test one semantic H1 with the approved dependable-building copy, both real
metrics, the Discover More link, and the state change caused by Check Booking.

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```powershell
npm.cmd test -- src/features/home/home-page.test.tsx --reporter=verbose
```

Expected: FAIL because `home-page.tsx` does not exist.

- [ ] **Step 3: Implement the approved responsive hero**

Use one responsive DOM tree where possible. Desktop positions the booking copy,
supporting line, stacked metric cards, and centered conversion stack over the
full-bleed image. Mobile hides the header, uses a flexible spacer, horizontal
metric pills, full-width CTA, and safe-area-aware bottom spacing.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run the Step 2 command. Expected: one test file passes with zero failures.

### Task 2: Recompose the homepage-only header and contact launcher

**Files:**
- Modify: `src/components/site-header-home.tsx`
- Modify: `src/components/floating-contact.tsx`

**Interfaces:**
- `SiteHeaderHome` keeps its public no-prop interface.
- `FloatingContact` keeps its public no-prop interface and derives the current
  route with `useRouterState`.

- [ ] **Step 1: Implement the desktop header**

Use centered translucent pill navigation, active Home pill, existing logo,
desktop social links, circular theme toggle, Consultation pill, and an
intermediate-width menu. Hide the entire header below 768px.

- [ ] **Step 2: Implement the route-aware launcher**

On `/`, render the closed launcher as the approved orange headphone circle with
larger mobile dimensions. Keep the existing image launcher on other routes and
preserve all open-panel interactions.

### Task 3: Route composition and rendered fidelity

**Files:**
- Modify: `src/routes/index.tsx`
- Modify only if a visual mismatch requires it: `src/styles.css`

- [ ] **Step 1: Reduce the route to metadata plus `<HomePage />`**

Keep existing SEO route registration while replacing visible em-dash separators
in homepage metadata with regular punctuation.

- [ ] **Step 2: Start the local production preview**

Run:

```powershell
npm.cmd run build
npm.cmd run preview -- --host 127.0.0.1
```

- [ ] **Step 3: Validate desktop and mobile with Browser**

The flow under test is:

`/ loads -> approved hero renders -> Check Booking opens the modal -> Discover More points to /details#about -> no runtime error appears`.

Capture 1600 x 750, 390 x 844, and 430 x 932 screenshots. Compare copy,
hierarchy, crop, header, metrics, CTA, slogan, safe areas, and contact launcher
against the two supplied references. Fix material mismatches and repeat.

### Task 4: Verification, push, publish, and live-domain QA

**Files:**
- Modify only files that fail verification.

- [ ] **Step 1: Run fresh verification**

```powershell
npm.cmd test -- --reporter=verbose --pool=threads --maxWorkers=1 --testTimeout=30000 --hookTimeout=30000
npm.cmd run lint
npm.cmd run build
git diff --check
git status --short
```

- [ ] **Step 2: Commit and push**

Commit the homepage source, tests, spec, and plan. Push the refinement branch
and fast-forward `main` after confirming `origin/main` is an ancestor.

- [ ] **Step 3: Publish with Lovable**

Wait for Lovable to synchronize to the exact Git commit, update the production
deployment, and wait until its publisher reports "Up to date".

- [ ] **Step 4: Verify production**

Open `https://www.igsabroso.com/` at desktop and mobile viewports. Confirm the
approved homepage content and crop, exercise Check Booking, verify Discover More,
and confirm zero app-owned console errors.

