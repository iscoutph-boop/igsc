# IG Sabroso Mobile Responsive Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the IG Sabroso mobile and tablet experience to closely match the approved reference screens while preserving the current desktop composition, routes, project data, booking flow, consultation workflow, analytics, SEO, accessibility, and Lovable deployment.

**Architecture:** Keep one shared application and one shared content/data layer. Use responsive presentation branches only where the mobile composition is structurally different, and use Tailwind responsive utilities where only spacing, sizing, ordering, or grids change. Add a reusable architectural-pencil background primitive and a lightweight SVG asset instead of duplicating decorative markup across sections.

**Tech Stack:** React 19, TypeScript 5.8, TanStack Start/Router, Tailwind CSS 4, Framer Motion, Lucide React, Vitest, Testing Library, Lovable hosting.

## Global Constraints

- Work only on `codex/igsabroso-mobile-responsive-redesign`.
- Preserve the approved desktop composition at `1024px+`.
- Do not rebuild the application or replace TanStack Start.
- Do not duplicate company, service, project, process, or review data.
- Use only existing real IG Sabroso project imagery and approved brand assets.
- Do not invent statistics, reviews, services, contact information, URLs, or credentials.
- Keep the booking modal, consultation form, CRM call, analytics events, SEO metadata, routes, and project filters functional.
- Keep minimum touch targets at 44px.
- Prevent page-wide horizontal scrolling from 320px upward.
- Respect `prefers-reduced-motion`.
- Do not merge or publish before local responsive QA and user approval.

---

## File Map

### New files

- `public/brand/architecture-pencil-lines.svg`  
  Lightweight transparent architectural line-art background.

- `src/components/ui/architectural-sketch.tsx`  
  Reusable decorative layer that controls placement, opacity, and accessibility.

- `src/components/ui/mobile-section-shell.tsx`  
  Consistent mobile section padding, maximum width, and optional sketch background.

- `src/lib/responsive-contract.ts`  
  Shared breakpoint constants used by static audits and documentation.

- `src/lib/responsive-contract.test.ts`  
  Guards the approved breakpoint contract.

### Modified files

- `src/styles.css`
- `src/components/brand/brand-lockup.tsx`
- `src/components/site-header.tsx`
- `src/components/site-header.test.tsx`
- `src/features/home/home-page.tsx`
- `src/features/home/home-page.test.tsx`
- `src/features/details/components/about-section.tsx`
- `src/features/details/components/services-section.tsx`
- `src/features/details/components/process-section.tsx`
- `src/features/details/components/process-section.test.tsx`
- `src/features/details/components/reviews-section.tsx`
- `src/features/details/components/consultation-close.tsx`
- `src/features/details/details-page.test.tsx`
- `src/features/projects/projects-page.tsx`
- `src/features/projects/projects-page.test.tsx`
- `src/routes/consultation.tsx`
- `src/routes/consultation.test.tsx`
- `scripts/static-redesign-audit.mjs`
- `docs/IG_SABROSO_QA_CHECKLIST.md`
- `docs/IG_SABROSO_VERIFICATION_REPORT.md`

---

### Task 1: Establish the responsive contract and decorative primitives

**Files:**
- Create: `src/lib/responsive-contract.ts`
- Create: `src/lib/responsive-contract.test.ts`
- Create: `public/brand/architecture-pencil-lines.svg`
- Create: `src/components/ui/architectural-sketch.tsx`
- Create: `src/components/ui/mobile-section-shell.tsx`
- Modify: `src/styles.css`
- Modify: `scripts/static-redesign-audit.mjs`

**Interfaces:**
- Produces:
  - `RESPONSIVE_BREAKPOINTS` with `compactPhone`, `largePhone`, `tablet`, and `desktop`.
  - `ArchitecturalSketch` component.
  - `MobileSectionShell` component.
- Consumes: existing Tailwind configuration and global theme tokens.

- [ ] **Step 1: Write the responsive contract test**

```ts
import { describe, expect, it } from "vitest";
import { RESPONSIVE_BREAKPOINTS } from "./responsive-contract";

describe("RESPONSIVE_BREAKPOINTS", () => {
  it("preserves the approved mobile, tablet, and desktop boundaries", () => {
    expect(RESPONSIVE_BREAKPOINTS).toEqual({
      compactPhone: 320,
      largePhone: 480,
      tablet: 768,
      desktop: 1024,
    });
  });
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run in Windows PowerShell:

```powershell
npm.cmd test -- src/lib/responsive-contract.test.ts --reporter=verbose
```

Expected: failure because `src/lib/responsive-contract.ts` does not yet exist.

- [ ] **Step 3: Add the responsive contract**

```ts
export const RESPONSIVE_BREAKPOINTS = {
  compactPhone: 320,
  largePhone: 480,
  tablet: 768,
  desktop: 1024,
} as const;
```

- [ ] **Step 4: Add the pencil-line SVG**

Create an SVG with:

- `viewBox="0 0 1200 900"`
- transparent background
- line groups using `stroke="#152238"`
- `stroke-opacity` between `0.12` and `0.22`
- no embedded text
- no raster image
- file size target below 40 KB

- [ ] **Step 5: Add `ArchitecturalSketch`**

```tsx
type ArchitecturalSketchProps = {
  className?: string;
  position?: "left" | "right" | "center";
  opacity?: "subtle" | "visible";
};

export function ArchitecturalSketch({
  className = "",
  position = "right",
  opacity = "subtle",
}: ArchitecturalSketchProps) {
  return (
    <span
      aria-hidden="true"
      className={[
        "pointer-events-none absolute inset-y-0 hidden overflow-hidden sm:block",
        position === "left"
          ? "left-0 w-[68%]"
          : position === "center"
            ? "left-1/2 w-[85%] -translate-x-1/2"
            : "right-0 w-[68%]",
        opacity === "visible" ? "opacity-[0.10]" : "opacity-[0.055]",
        className,
      ].join(" ")}
    >
      <img
        src="/brand/architecture-pencil-lines.svg"
        alt=""
        className="h-full w-full object-cover object-center"
        loading="lazy"
      />
    </span>
  );
}
```

- [ ] **Step 6: Add `MobileSectionShell`**

```tsx
import type { ReactNode } from "react";
import { ArchitecturalSketch } from "./architectural-sketch";

type MobileSectionShellProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  sketch?: boolean;
  sketchPosition?: "left" | "right" | "center";
};

export function MobileSectionShell({
  children,
  className = "",
  contentClassName = "",
  sketch = false,
  sketchPosition = "right",
}: MobileSectionShellProps) {
  return (
    <section className={["relative overflow-hidden px-5 py-14 sm:px-8 sm:py-18 lg:px-14", className].join(" ")}>
      {sketch ? <ArchitecturalSketch position={sketchPosition} /> : null}
      <div className={["relative mx-auto w-full max-w-[1500px]", contentClassName].join(" ")}>
        {children}
      </div>
    </section>
  );
}
```

- [ ] **Step 7: Add global mobile utilities**

Add to `src/styles.css`:

```css
@utility mobile-card {
  border: 1px solid var(--color-border);
  border-radius: 1.25rem;
  background: #ffffff;
  box-shadow: 0 12px 34px rgba(21, 34, 56, 0.07);
}

@utility mobile-heading {
  font-family: var(--font-display);
  font-weight: 800;
  text-transform: uppercase;
  line-height: 0.92;
  letter-spacing: -0.035em;
}

@supports (padding: max(0px)) {
  .safe-inline {
    padding-left: max(1.25rem, env(safe-area-inset-left));
    padding-right: max(1.25rem, env(safe-area-inset-right));
  }
}
```

- [ ] **Step 8: Extend the static audit**

Add checks that fail when:

- the architectural SVG is missing;
- mobile header controls are below 44px;
- the project filters are missing `overflow-x-auto`;
- the implementation contains `min-w` values that force the page beyond 320px;
- `lg:` desktop preservation classes are removed from the primary sections.

- [ ] **Step 9: Verify Task 1**

```powershell
npm.cmd test -- src/lib/responsive-contract.test.ts --reporter=verbose
npm.cmd run audit:redesign
npm.cmd run lint
```

Expected: all pass with zero errors.

- [ ] **Step 10: Commit Task 1**

```powershell
git add public/brand/architecture-pencil-lines.svg src/components/ui/architectural-sketch.tsx src/components/ui/mobile-section-shell.tsx src/lib/responsive-contract.ts src/lib/responsive-contract.test.ts src/styles.css scripts/static-redesign-audit.mjs
git commit -m "feat: add mobile responsive design primitives"
```

---

### Task 2: Rebuild the mobile header without changing desktop navigation

**Files:**
- Modify: `src/components/brand/brand-lockup.tsx`
- Modify: `src/components/site-header.tsx`
- Modify: `src/components/site-header.test.tsx`

**Interfaces:**
- Consumes: existing `PRIMARY_NAVIGATION`, booking modal, route-active helpers, and `BrandLockup`.
- Produces: a compact mobile header and preserved desktop header.

- [ ] **Step 1: Add a failing header test**

Add an assertion that the rendered header exposes:

- home link;
- `Get a quote` link;
- menu button;
- no duplicate visible desktop navigation on the mobile DOM contract;
- accessible menu dialog after activation.

```tsx
it("exposes the compact mobile header actions", async () => {
  const user = userEvent.setup();
  await renderRoute("/");

  expect(screen.getByRole("link", { name: /IG Sabroso Construction home/i })).toBeTruthy();
  expect(screen.getByRole("link", { name: /Get a quote/i })).toBeTruthy();

  await user.click(screen.getByRole("button", { name: /open navigation menu/i }));
  expect(screen.getByRole("dialog", { name: /navigation menu/i })).toBeTruthy();
});
```

- [ ] **Step 2: Run the focused test**

```powershell
npm.cmd test -- src/components/site-header.test.tsx --reporter=verbose
```

Expected: the new accessible-name assertion fails before implementation.

- [ ] **Step 3: Refine `BrandLockup`**

Mobile requirements:

- image height approximately 44â€“50px;
- company name does not wrap unpredictably;
- slogan remains visible at 360px+;
- compact mode remains usable inside the navigation dialog;
- desktop sizing remains unchanged through `lg:` classes.

- [ ] **Step 4: Implement mobile header sizing**

Required mobile structure:

```tsx
<div className="mx-auto flex min-h-[82px] w-full items-center gap-2 px-4 sm:px-6 lg:min-h-[78px] lg:px-12">
```

CTA requirements:

```tsx
className="ml-auto inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl bg-primary px-3.5 text-[0.72rem] font-extrabold uppercase tracking-[0.04em] text-white sm:px-5 sm:text-[0.78rem]"
```

Menu requirements:

```tsx
className="grid size-11 shrink-0 place-items-center rounded-xl text-[#152238] xl:hidden"
```

Do not remove:

- focus trap;
- Escape close;
- body scroll lock;
- route-active logic;
- Manage Booking action inside the mobile drawer;
- consultation link.

- [ ] **Step 5: Verify at compact widths**

Manually inspect 320px, 360px, 390px, and 430px:

- logo remains visible;
- CTA stays on one line;
- hamburger is not clipped;
- no horizontal scroll;
- header height remains stable.

- [ ] **Step 6: Run focused verification**

```powershell
npm.cmd test -- src/components/site-header.test.tsx --reporter=verbose
npm.cmd run lint
```

- [ ] **Step 7: Commit Task 2**

```powershell
git add src/components/brand/brand-lockup.tsx src/components/site-header.tsx src/components/site-header.test.tsx
git commit -m "feat: refine IG Sabroso mobile header"
```

---

### Task 3: Recompose the mobile homepage hero and overview

**Files:**
- Modify: `src/features/home/home-page.tsx`
- Modify: `src/features/home/home-page.test.tsx`

**Interfaces:**
- Consumes: `COMPANY.metrics`, `PROJECTS`, `REVIEWS`, existing hero image, existing routes.
- Produces: mobile hero, metrics, about preview, featured project, and testimonial preview matching the reference.

- [ ] **Step 1: Extend the homepage test**

```tsx
it("renders the mobile homepage conversion structure", async () => {
  await renderRoute("/");

  expect(
    await screen.findByRole("heading", { level: 1, name: /build with confidence/i }),
  ).toBeTruthy();
  expect(screen.getByRole("link", { name: /get a quote/i })).toBeTruthy();
  expect(screen.getByRole("link", { name: /view our projects/i })).toBeTruthy();
  expect(screen.getByRole("region", { name: /client testimonials/i })).toBeTruthy();
});
```

- [ ] **Step 2: Preserve desktop markup**

Keep the current desktop hero active at `lg:` and introduce a structurally separate mobile hero using:

```tsx
<div className="lg:hidden">...</div>
<div className="hidden lg:block">...</div>
```

Shared data must remain outside both branches.

- [ ] **Step 3: Build the mobile hero**

Required order:

1. image;
2. gradient fade;
3. eyebrow;
4. heading;
5. copy;
6. two CTAs;
7. metrics.

Required mobile heading:

```tsx
className="mobile-heading text-[clamp(3.05rem,13.2vw,4.65rem)] text-[#152238]"
```

Required hero image:

```tsx
className="h-[clamp(330px,92vw,520px)] w-full object-cover object-[58%_center]"
```

- [ ] **Step 4: Build responsive metrics**

Use:

```tsx
className="grid grid-cols-2 overflow-hidden rounded-2xl border border-border bg-white shadow-soft min-[520px]:grid-cols-4"
```

Every item must include:

- icon;
- value;
- real metric label;
- border separators that adapt to 2Ã—2 and 4-column layouts.

- [ ] **Step 5: Recompose mobile overview**

Use a mobile-only composition that contains:

- `About IG Sabroso`;
- `Built on values. Focused on you.`;
- concise copy;
- link to `/details#about`;
- featured real project card;
- automatic-only testimonial region.

Do not duplicate the lower full About/Projects/Reviews sections.

- [ ] **Step 6: Keep the automatic-only testimonial**

Maintain:

- 6.5-second rotation;
- no arrows;
- no dots;
- no buttons;
- stable minimum height;
- `aria-live="off"`;
- reduced-motion-safe transition.

- [ ] **Step 7: Verify Task 3**

```powershell
npm.cmd test -- src/features/home/home-page.test.tsx --reporter=verbose
npm.cmd run lint
```

Manual QA:

- 320px;
- 375px;
- 430px;
- 768px;
- 1024px desktop handoff.

- [ ] **Step 8: Commit Task 3**

```powershell
git add src/features/home/home-page.tsx src/features/home/home-page.test.tsx
git commit -m "feat: rebuild IG Sabroso mobile homepage"
```

---

### Task 4: Rebuild About and Services for mobile

**Files:**
- Modify: `src/features/details/components/about-section.tsx`
- Modify: `src/features/details/components/services-section.tsx`
- Modify: `src/features/details/details-page.test.tsx`

**Interfaces:**
- Consumes: `COMPANY`, `SERVICES`, real images, `MobileSectionShell`, `ArchitecturalSketch`.
- Produces: reference-aligned mobile About and Services sections.

- [ ] **Step 1: Add semantic assertions**

The details test must assert:

- About heading exists;
- Mission, Vision, and Values headings exist;
- Services heading exists;
- all service names are rendered;
- consultation links remain available.

- [ ] **Step 2: Recompose About mobile layout**

Required mobile order:

1. eyebrow;
2. large heading;
3. company copy;
4. full-width real home image;
5. Mission/Vision/Values cards;
6. metrics strip;
7. consultation CTA.

Add pencil-line background behind the upper copy using `ArchitecturalSketch`.

Use one-column cards below 480px and three columns only at tablet widths.

- [ ] **Step 3: Recompose Services mobile layout**

Required order:

1. eyebrow;
2. large heading;
3. concise copy;
4. real image banner;
5. service cards;
6. CTA strip;
7. trust indicators.

Grid requirements:

```tsx
className="grid gap-4 min-[560px]:grid-cols-2 xl:grid-cols-3"
```

Service cards must retain real titles, descriptions, and consultation routes.

- [ ] **Step 4: Verify Task 4**

```powershell
npm.cmd test -- src/features/details/details-page.test.tsx --reporter=verbose
npm.cmd run lint
```

- [ ] **Step 5: Commit Task 4**

```powershell
git add src/features/details/components/about-section.tsx src/features/details/components/services-section.tsx src/features/details/details-page.test.tsx
git commit -m "feat: redesign mobile about and services"
```

---

### Task 5: Build the mobile process timeline and review layout

**Files:**
- Modify: `src/features/details/components/process-section.tsx`
- Modify: `src/features/details/components/process-section.test.tsx`
- Modify: `src/features/details/components/reviews-section.tsx`
- Modify: `src/features/details/details-page.test.tsx`

**Interfaces:**
- Consumes: `PROCESS_STEPS`, `REVIEWS`, existing real images.
- Produces: static mobile process timeline and premium review cards while preserving desktop tab interaction.

- [ ] **Step 1: Extend process tests**

Keep the existing keyboard-tab test for desktop behavior and add:

```tsx
it("renders every process phase in source order", () => {
  render(<ProcessSection />);
  for (const title of ["Consultation", "Planning", "Building", "Turnover"]) {
    expect(screen.getAllByText(title).length).toBeGreaterThan(0);
  }
});
```

Use exact titles from `PROCESS_STEPS`; do not hardcode a different word if the data says `Construction`.

- [ ] **Step 2: Implement mobile timeline**

Use:

```tsx
<div className="lg:hidden">
  {PROCESS_STEPS.map(...)}
</div>
<div className="hidden lg:block">
  {/* existing tab interface */}
</div>
```

Mobile timeline requirements:

- numbered orange circle;
- connecting line;
- white card;
- step icon;
- real step title and description;
- no mobile button interaction required;
- source order preserved.

- [ ] **Step 3: Add process image CTA**

Use the existing construction/turnover image and provide:

- dark readable overlay;
- short trust message;
- route to `/consultation`;
- no fake promise.

- [ ] **Step 4: Recompose Reviews mobile layout**

Requirements:

- mobile section heading;
- optional low-opacity sketch;
- one review card per row;
- five-star visual;
- real client names and project labels;
- review image retained below or above cards;
- desktop layout preserved.

- [ ] **Step 5: Verify Task 5**

```powershell
npm.cmd test -- src/features/details/components/process-section.test.tsx --reporter=verbose
npm.cmd test -- src/features/details/details-page.test.tsx --reporter=verbose
npm.cmd run lint
```

- [ ] **Step 6: Commit Task 5**

```powershell
git add src/features/details/components/process-section.tsx src/features/details/components/process-section.test.tsx src/features/details/components/reviews-section.tsx src/features/details/details-page.test.tsx
git commit -m "feat: add mobile process and reviews layouts"
```

---

### Task 6: Rebuild the mobile projects page while preserving filters

**Files:**
- Modify: `src/features/projects/projects-page.tsx`
- Modify: `src/features/projects/projects-page.test.tsx`

**Interfaces:**
- Consumes: `PROJECTS`, `PROJECT_CATEGORIES`, analytics `trackEvent`, project routes.
- Produces: reference-aligned mobile project cards with functional filters and search.

- [ ] **Step 1: Preserve existing filter test**

Keep tests that verify:

- category filtering;
- search filtering;
- no-results recovery;
- project links.

Add an assertion that the project filter region is labelled.

- [ ] **Step 2: Make filters mobile-safe**

Required container:

```tsx
<div
  className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0"
  aria-label="Project filters"
>
```

Each filter remains at least 44px high.

- [ ] **Step 3: Recompose mobile project cards**

Below `md`:

- image at top or left only where 430px width can support it;
- category eyebrow;
- project name;
- location;
- compact arrow action;
- card remains one link target or has a clear link;
- no layout overflow.

At `lg+`, preserve the existing featured/grid desktop presentation.

- [ ] **Step 4: Add featured mobile panel and metrics**

Use current featured project and existing real metrics. Do not use reference placeholder locations or names.

- [ ] **Step 5: Verify Task 6**

```powershell
npm.cmd test -- src/features/projects/projects-page.test.tsx --reporter=verbose
npm.cmd run lint
```

Manual checks:

- filters scroll without moving page;
- search field remains full-width;
- no-results reset works;
- project detail links open.

- [ ] **Step 6: Commit Task 6**

```powershell
git add src/features/projects/projects-page.tsx src/features/projects/projects-page.test.tsx
git commit -m "feat: redesign mobile projects experience"
```

---

### Task 7: Rebuild mobile Contact and Consultation without changing data flow

**Files:**
- Modify: `src/features/details/components/consultation-close.tsx`
- Modify: `src/routes/consultation.tsx`
- Modify: `src/routes/consultation.test.tsx`

**Interfaces:**
- Consumes: current contact constants, `callCRM`, `SchedulePicker`, booking modal, real consultation image.
- Produces: mobile contact callout and mobile-friendly consultation form.

- [ ] **Step 1: Preserve form behavior tests**

The route test must continue to verify:

- required fields;
- date/time requirement;
- CRM submission;
- success reference;
- error state;
- honeypot behavior;
- privacy consent.

Add a semantic assertion for the consultation form heading and submit button.

- [ ] **Step 2: Recompose mobile consultation page**

Required mobile order:

1. hero copy;
2. real image;
3. form card;
4. contact information card;
5. privacy note.

Desktop may retain side-by-side layout.

- [ ] **Step 3: Make all fields mobile-friendly**

Requirements:

- one column under `sm`;
- field controls at least 48px high;
- textarea remains resizable;
- labels stay visible;
- submit button full width;
- schedule picker remains usable at 320px;
- no CRM payload changes;
- no environment-variable changes.

- [ ] **Step 4: Recompose `ConsultationClose`**

Reference-aligned mobile card:

- eyebrow;
- headline;
- concise copy;
- consultation CTA;
- Manage Booking CTA;
- phone/email/address information;
- real project image;
- subtle sketch background.

- [ ] **Step 5: Verify Task 7**

```powershell
npm.cmd test -- src/routes/consultation.test.tsx --reporter=verbose
npm.cmd run lint
```

- [ ] **Step 6: Commit Task 7**

```powershell
git add src/features/details/components/consultation-close.tsx src/routes/consultation.tsx src/routes/consultation.test.tsx
git commit -m "feat: refine mobile consultation experience"
```

---

### Task 8: Complete responsive QA, production verification, and handoff

**Files:**
- Modify: `docs/IG_SABROSO_QA_CHECKLIST.md`
- Modify: `docs/IG_SABROSO_VERIFICATION_REPORT.md`
- Modify: `scripts/static-redesign-audit.mjs` only if final QA exposes an unguarded regression.

**Interfaces:**
- Consumes: all completed tasks.
- Produces: verified branch ready for user visual approval and later merge.

- [ ] **Step 1: Run formatting**

```powershell
npm.cmd run format
```

Review `git status --short`; do not accept unrelated formatting changes.

- [ ] **Step 2: Run static audit**

```powershell
npm.cmd run audit:redesign
```

Expected: pass.

- [ ] **Step 3: Run lint**

```powershell
npm.cmd run lint
```

Expected: zero errors.

- [ ] **Step 4: Run complete test suite**

```powershell
npm.cmd test
```

Expected: zero failed test files and zero failed tests.

- [ ] **Step 5: Run production build**

```powershell
npm.cmd run build
```

Expected: Nitro/Vite build completes successfully.

- [ ] **Step 6: Check patch quality**

```powershell
git diff --check
git status --short
```

`git diff --check` must return no output.

- [ ] **Step 7: Start local preview**

```powershell
npm.cmd run dev -- --host 127.0.0.1 --port 8080 --strictPort
```

Open:

```text
http://127.0.0.1:8080/
```

- [ ] **Step 8: Complete the viewport matrix**

Inspect:

- 320Ã—568
- 360Ã—800
- 375Ã—812
- 390Ã—844
- 414Ã—896
- 430Ã—932
- 768Ã—1024
- 1024Ã—768
- 1440Ã—900

For each width verify:

- no horizontal scroll;
- header controls fit;
- hero crop remains intentional;
- headings do not clip;
- CTA labels do not wrap unexpectedly;
- cards do not overlap;
- filter chips scroll only inside their container;
- process timeline remains aligned;
- form controls remain usable;
- desktop composition is unchanged at 1024px+.

- [ ] **Step 9: Complete functional QA**

Verify:

- mobile menu open/close;
- Escape close;
- keyboard focus trap;
- Home/About/Services/Projects/Process/Reviews/Contact navigation;
- project filters;
- search;
- project detail routes;
- consultation validation;
- consultation submission against configured backend;
- Manage Booking;
- automatic-only testimonial rotation;
- reduced-motion behavior;
- browser console has no red error.

- [ ] **Step 10: Update handoff documents**

Record:

- commands executed;
- final pass/fail counts;
- viewport results;
- known limitations;
- deployment not yet performed.

- [ ] **Step 11: Commit final verification**

```powershell
git add -A
git commit -m "test: complete IG Sabroso mobile responsive QA"
```

- [ ] **Step 12: Push the branch**

```powershell
git push origin codex/igsabroso-mobile-responsive-redesign
```

Do not merge into `main` until the user approves the live local preview.

---

## Final Acceptance Criteria

The implementation is complete only when:

- all automated checks pass;
- the page has no horizontal overflow at 320px;
- attached reference composition is closely reproduced using real project data;
- pencil-line backgrounds remain subtle and readable;
- mobile header fits at 320px;
- mobile process uses a vertical timeline;
- project search and filters remain functional;
- consultation and booking workflows remain functional;
- automatic testimonial movement has no controls;
- desktop layout remains visually unchanged at 1024px+;
- the user approves the final local mobile visual QA.

