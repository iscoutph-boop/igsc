# IG Sabroso Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the approved downstream redesign, preserve the homepage composition, and close the approved production QA findings.

**Architecture:** Keep the route files as thin TanStack Start entry points and move the details experience into a typed `src/features/details` feature. Static company content, pure portfolio/estimator logic, and visual sections receive separate ownership so they can be tested and changed independently. Shared header, footer, loader, and consultation fixes stay in their existing components to avoid route or analytics churn.

**Tech Stack:** React 19, TanStack Start, Tailwind CSS 4, TypeScript, Framer Motion, Radix primitives, Lucide, Vitest 4, Testing Library, jsdom, Browser plugin.

## Global Constraints

- The `/` homepage composition is visually locked to `igsabroso-locked-homepage-reference.png`.
- Preserve `/`, `/details`, and `/consultation` route slugs.
- Preserve primary navigation labels, form field names and order, logo, contact details, and legal copy.
- Preserve all real project, meeting, and company media already in `src/assets`.
- Use the approved nine refined concept images as the visual specification.
- Use Poppins for display copy, Montserrat for body copy, and IG Sabroso orange as the only accent.
- Media/elevated surfaces use 20-24px radii, compact controls use 12-16px radii, and primary actions use pill radii.
- Visible page copy contains zero em dash or en dash separator characters.
- All automatic motion respects `prefers-reduced-motion`.
- Autoplay is off by default.
- No deployment, GitHub push, or pull request without user approval.

---

### Task 1: Add the test harness and pure details model

**Files:**

- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `src/features/details/types.ts`
- Create: `src/features/details/model.ts`
- Test: `src/features/details/model.test.ts`

**Interfaces:**

- Produces: `Project`, `ProjectFilter`, `ProjectSort`, `EstimateInput`, `EstimateResult`
- Produces: `filterProjects(projects, filter, query, sort): Project[]`
- Produces: `validateEstimate(input): Record<string, string>`
- Produces: `calculateEstimate(input): EstimateResult | null`
- Consumes: no UI or browser state

- [ ] **Step 1: Add the test command and development dependencies**

Add to `package.json`:

```json
"scripts": {
  "test": "vitest run",
  "test:watch": "vitest"
},
"devDependencies": {
  "@testing-library/react": "^16.3.2",
  "@testing-library/user-event": "^14.6.1",
  "jsdom": "^30.0.1",
  "vitest": "^4.1.10"
}
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    restoreMocks: true,
  },
});
```

- [ ] **Step 2: Write the failing model tests**

```ts
import { describe, expect, it } from "vitest";
import { calculateEstimate, filterProjects, validateEstimate } from "./model";
import type { Project } from "./types";

const projects: Project[] = [
  {
    id: "a",
    title: "A Residence",
    status: "Completed",
    type: "Residential",
    location: "Imus City, Cavite",
    description: "Family home",
    highlights: [],
    number: "01",
    img: "/a.jpg",
  },
  {
    id: "b",
    title: "Keystone Building",
    status: "Ongoing",
    type: "Commercial",
    location: "Dasmarinas City, Cavite",
    description: "Commercial build",
    highlights: [],
    number: "07",
    img: "/b.jpg",
  },
];

describe("filterProjects", () => {
  it("filters by status and a case-insensitive location query", () => {
    expect(filterProjects(projects, "Completed", "imus", "latest").map((p) => p.id))
      .toEqual(["a"]);
  });

  it("sorts latest projects by descending project number", () => {
    expect(filterProjects(projects, "All", "", "latest").map((p) => p.id))
      .toEqual(["b", "a"]);
  });
});

describe("estimate model", () => {
  it("returns field errors until the required project inputs are valid", () => {
    expect(validateEstimate({
      projectType: "",
      location: "",
      floors: 0,
      area: 0,
      packageType: "",
      bedrooms: 4,
      bathrooms: 3,
      site: "",
      addons: [],
    })).toEqual({
      projectType: "Please select a project type.",
      location: "Please enter your project location.",
      floors: "Please select the number of floors.",
      area: "Minimum floor area is 10 sqm.",
      packageType: "Please select a finish package.",
    });
  });

  it("returns a transparent range from area and package rates", () => {
    expect(calculateEstimate({
      projectType: "Residential",
      location: "Imus City, Cavite",
      floors: 2,
      area: 100,
      packageType: "Elegant",
      bedrooms: 4,
      bathrooms: 3,
      site: "Flat lot",
      addons: [],
    })).toEqual({ low: 4_000_000, high: 4_500_000 });
  });
});
```

- [ ] **Step 3: Run the model tests and verify RED**

Run:

```powershell
npm.cmd test -- src/features/details/model.test.ts
```

Expected: FAIL because `./model` and `./types` do not exist.

- [ ] **Step 4: Implement the minimal typed model**

Implement literal package ranges:

```ts
export const PACKAGE_RATES = {
  Standard: [30_000, 34_000],
  "Semi-Elegant": [35_000, 39_000],
  Elegant: [40_000, 45_000],
  Luxury: [50_000, 55_000],
} as const;
```

`filterProjects` must filter without mutating the source array. `validateEstimate`
must return only current errors. `calculateEstimate` must return `null` whenever
`validateEstimate` returns at least one error.

- [ ] **Step 5: Run the model tests and verify GREEN**

Run:

```powershell
npm.cmd test -- src/features/details/model.test.ts
```

Expected: 4 tests pass with zero failures.

- [ ] **Step 6: Commit**

```powershell
git add package.json vitest.config.ts src/features/details/types.ts src/features/details/model.ts src/features/details/model.test.ts
git commit -m "test: add details model coverage"
```

---

### Task 2: Extract real content and shared section primitives

**Files:**

- Create: `src/features/details/content.ts`
- Create: `src/features/details/components/section-heading.tsx`
- Create: `src/features/details/components/refinement-shell.tsx`
- Test: `src/features/details/components/section-heading.test.tsx`

**Interfaces:**

- Produces: `services`, `packages`, `projects`, `testimonials`, `processSteps`,
  `meetingImages`, and approved image arrays
- Produces: `<SectionHeading id title accent align />`
- Produces: `<RefinementSection id tone children />`
- Consumes: typed interfaces from Task 1 and existing asset JSON modules

- [ ] **Step 1: Write the failing semantic-heading test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SectionHeading } from "./section-heading";

describe("SectionHeading", () => {
  it("renders one semantic level-two heading with the accent in the same heading", () => {
    render(<SectionHeading title="Built on trust." accent="Driven by excellence." />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.textContent).toBe("Built on trust. Driven by excellence.");
  });
});
```

- [ ] **Step 2: Run the heading test and verify RED**

Run:

```powershell
npm.cmd test -- src/features/details/components/section-heading.test.tsx
```

Expected: FAIL because `section-heading.tsx` does not exist.

- [ ] **Step 3: Move existing content into the typed content module**

Move existing real asset imports and current content arrays out of
`src/routes/details.tsx`. Keep exact prices, contact-independent company copy,
project titles, project counts, review attribution, and process order. Replace
visible em dash and en dash separators with periods, commas, parentheses, or
regular hyphens while preserving meaning.

- [ ] **Step 4: Implement shared primitives**

`SectionHeading` must render one `h2`, an optional supporting paragraph, and an
optional approved eyebrow. `RefinementSection` must own the shared max-width,
responsive padding, `scroll-margin`, tone tokens, and `content-visibility`.

- [ ] **Step 5: Run the heading test and verify GREEN**

Run:

```powershell
npm.cmd test -- src/features/details/components/section-heading.test.tsx
```

Expected: 1 test passes.

- [ ] **Step 6: Commit**

```powershell
git add src/features/details/content.ts src/features/details/components/section-heading.tsx src/features/details/components/refinement-shell.tsx src/features/details/components/section-heading.test.tsx
git commit -m "refactor: extract details content and section primitives"
```

---

### Task 3: Implement About, Services, and Finish Packages

**Files:**

- Create: `src/features/details/components/about-section.tsx`
- Create: `src/features/details/components/services-section.tsx`
- Create: `src/features/details/components/packages-section.tsx`
- Test: `src/features/details/components/packages-section.test.tsx`

**Interfaces:**

- `<AboutSection onOpenImage(src, group) />`
- `<ServicesSection />`
- `<PackagesSection />`
- Consumes content arrays from Task 2

- [ ] **Step 1: Write the failing package-selector test**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PackagesSection } from "./packages-section";

describe("PackagesSection", () => {
  it("selects a package with keyboard-accessible radio semantics", async () => {
    const user = userEvent.setup();
    render(<PackagesSection />);
    const elegant = screen.getByRole("radio", { name: /Elegant/i });
    const standard = screen.getByRole("radio", { name: /Standard/i });
    expect(elegant).toHaveProperty("checked", true);
    await user.click(standard);
    expect(standard).toHaveProperty("checked", true);
    expect(screen.getByRole("heading", { name: "Standard Finish" })).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run the package test and verify RED**

Run:

```powershell
npm.cmd test -- src/features/details/components/packages-section.test.tsx
```

Expected: FAIL because `packages-section.tsx` does not exist.

- [ ] **Step 3: Implement About to the accepted concept**

Use a desktop `grid-template-columns: minmax(260px,.7fr) minmax(0,1.8fr)`.
Keep the approved action rows and project media. Autoplay starts `false`; the
switch exposes `aria-checked`, and previous/next buttons expose meaningful
labels. Mobile stacks content and keeps media controls reachable.

- [ ] **Step 4: Implement Services to the accepted concept**

Render Residential Construction as the image-led feature. Render the remaining
six items in a two-column divided index. Reuse the existing service-detail
dialog behavior and service descriptions. Mobile converts the index to a
single-column accordion or disclosure list with no duplicate DOM copy.

- [ ] **Step 5: Implement Packages to the accepted concept**

Use a native radio group for the four tier selectors. Default to Elegant.
Selected details render structure, systems, and finishes. Keep one primary
checklist action and the full disclaimer. The comparison list mirrors the same
radio values rather than maintaining duplicate state.

- [ ] **Step 6: Run the package test and verify GREEN**

Run:

```powershell
npm.cmd test -- src/features/details/components/packages-section.test.tsx
```

Expected: 1 test passes.

- [ ] **Step 7: Commit**

```powershell
git add src/features/details/components/about-section.tsx src/features/details/components/services-section.tsx src/features/details/components/packages-section.tsx src/features/details/components/packages-section.test.tsx
git commit -m "feat: refine about services and packages"
```

---

### Task 4: Implement the real-photo project portfolio

**Files:**

- Create: `src/features/details/components/projects-section.tsx`
- Create: `src/features/details/components/project-detail.tsx`
- Test: `src/features/details/components/projects-section.test.tsx`

**Interfaces:**

- `<ProjectsSection onOpenImage(src, group) />`
- `<ProjectDetail project onClose onOpenImage />`
- Consumes `filterProjects` from Task 1 and `projects` from Task 2

- [ ] **Step 1: Write the failing portfolio-state test**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ProjectsSection } from "./projects-section";

describe("ProjectsSection", () => {
  it("filters real project results and offers a recovery action for no results", async () => {
    const user = userEvent.setup();
    render(<ProjectsSection onOpenImage={() => undefined} />);
    await user.click(screen.getByRole("button", { name: "Commercial" }));
    expect(screen.getByText("Keystone Building")).toBeTruthy();
    await user.type(screen.getByRole("searchbox", { name: "Search projects" }), "not-a-project");
    expect(screen.getByText("No projects match these filters.")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(screen.getByText("A Residence")).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run the portfolio test and verify RED**

Run:

```powershell
npm.cmd test -- src/features/details/components/projects-section.test.tsx
```

Expected: FAIL because `projects-section.tsx` does not exist.

- [ ] **Step 3: Implement the portfolio and project detail**

Use the real project photos from `content.ts`. The initial gallery uses one lead
item and five supporting items. Keep filters, search, sorting, visible-count
expansion, project detail, and lightbox. Captions and actions sit below images.
Mobile uses horizontally scrollable filters and one project per row.

- [ ] **Step 4: Run the portfolio test and verify GREEN**

Run:

```powershell
npm.cmd test -- src/features/details/components/projects-section.test.tsx
```

Expected: 1 test passes.

- [ ] **Step 5: Commit**

```powershell
git add src/features/details/components/projects-section.tsx src/features/details/components/project-detail.tsx src/features/details/components/projects-section.test.tsx
git commit -m "feat: rebuild project portfolio with real media"
```

---

### Task 5: Implement the grouped price estimator

**Files:**

- Create: `src/features/details/components/estimator-section.tsx`
- Create: `src/features/details/components/estimate-summary.tsx`
- Test: `src/features/details/components/estimator-section.test.tsx`

**Interfaces:**

- `<EstimatorSection />`
- `<EstimateSummary input errors result />`
- Consumes `validateEstimate` and `calculateEstimate` from Task 1

- [ ] **Step 1: Write the failing estimator interaction test**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { EstimatorSection } from "./estimator-section";

describe("EstimatorSection", () => {
  it("keeps the detailed estimate disabled until required values are valid", async () => {
    const user = userEvent.setup();
    render(<EstimatorSection />);
    const action = screen.getByRole("link", { name: "Get Detailed Estimate" });
    expect(action.getAttribute("aria-disabled")).toBe("true");
    await user.selectOptions(screen.getByLabelText("Project Type"), "Residential");
    await user.type(screen.getByLabelText("Project Location"), "Imus City, Cavite");
    await user.type(screen.getByLabelText("Floor Area (sqm)"), "100");
    await user.selectOptions(screen.getByLabelText("Number of Floors"), "2");
    await user.click(screen.getByRole("radio", { name: "Elegant" }));
    expect(action.getAttribute("aria-disabled")).toBe("false");
    expect(screen.getByText("PHP 4,000,000 - PHP 4,500,000")).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run the estimator test and verify RED**

Run:

```powershell
npm.cmd test -- src/features/details/components/estimator-section.test.tsx
```

Expected: FAIL because `estimator-section.tsx` does not exist.

- [ ] **Step 3: Implement grouped fields and honest summary**

Use persistent labels with matching `id` and `htmlFor`. Render Project basics,
Finish and rooms, and Site and add-ons as explicit groups. Show validation below
fields. Keep the summary sticky on desktop and in document order after controls
on mobile. Use `aria-disabled` and prevent navigation until valid.

- [ ] **Step 4: Run the estimator test and verify GREEN**

Run:

```powershell
npm.cmd test -- src/features/details/components/estimator-section.test.tsx
```

Expected: 1 test passes.

- [ ] **Step 5: Commit**

```powershell
git add src/features/details/components/estimator-section.tsx src/features/details/components/estimate-summary.tsx src/features/details/components/estimator-section.test.tsx
git commit -m "feat: rebuild estimator with accessible validation"
```

---

### Task 6: Implement Meetings, Reviews, Process, and Consultation Close

**Files:**

- Create: `src/features/details/components/meetings-section.tsx`
- Create: `src/features/details/components/reviews-section.tsx`
- Create: `src/features/details/components/process-section.tsx`
- Create: `src/features/details/components/consultation-close.tsx`
- Test: `src/features/details/components/process-section.test.tsx`

**Interfaces:**

- `<MeetingsSection onOpenImage(src, group) />`
- `<ReviewsSection />`
- `<ProcessSection />`
- `<ConsultationClose onManageBooking />`

- [ ] **Step 1: Write the failing process keyboard test**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ProcessSection } from "./process-section";

describe("ProcessSection", () => {
  it("changes the selected phase with keyboard controls", async () => {
    const user = userEvent.setup();
    render(<ProcessSection />);
    const consultation = screen.getByRole("tab", { name: "Consultation" });
    const planning = screen.getByRole("tab", { name: "Planning" });
    expect(consultation.getAttribute("aria-selected")).toBe("true");
    planning.focus();
    await user.keyboard("{Enter}");
    expect(planning.getAttribute("aria-selected")).toBe("true");
    expect(screen.getByText("Designs, drawings, schedules, and strategy.")).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run the process test and verify RED**

Run:

```powershell
npm.cmd test -- src/features/details/components/process-section.test.tsx
```

Expected: FAIL because `process-section.tsx` does not exist.

- [ ] **Step 3: Implement Meetings and Reviews**

Meetings uses the approved 4/8 split, one featured photo, three supporting
photos, captions below media, and the three meeting coverage points. Reviews
uses one feature and two supporting stories, preserves all ratings and
attribution, and keeps visible quote excerpts concise.

- [ ] **Step 4: Implement Process and Consultation Close**

Process uses a semantic tablist on desktop and a vertical timeline presentation
on mobile. The selected phase exposes its description and deliverables.
Consultation Close keeps the two approved intents: book a consultation and
manage an existing booking.

- [ ] **Step 5: Run the process test and verify GREEN**

Run:

```powershell
npm.cmd test -- src/features/details/components/process-section.test.tsx
```

Expected: 1 test passes.

- [ ] **Step 6: Commit**

```powershell
git add src/features/details/components/meetings-section.tsx src/features/details/components/reviews-section.tsx src/features/details/components/process-section.tsx src/features/details/components/consultation-close.tsx src/features/details/components/process-section.test.tsx
git commit -m "feat: refine meetings reviews process and close"
```

---

### Task 7: Compose the route and close shared production QA findings

**Files:**

- Create: `src/features/details/details-page.tsx`
- Modify: `src/routes/details.tsx`
- Modify: `src/routes/consultation.tsx`
- Modify: `src/components/site-header.tsx`
- Modify: `src/components/site-footer.tsx`
- Modify: `src/components/intro-loader.tsx`
- Modify: `src/styles.css`
- Test: `src/components/intro-loader.test.tsx`

**Interfaces:**

- `/details` route imports and renders `<DetailsPage />`
- `DetailsPage` owns lightbox and manage-booking modal state
- Shared header/footer keep existing public props and navigation

- [ ] **Step 1: Write the failing intro-loader contract test**

```tsx
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { IntroLoader } from "./intro-loader";

afterEach(() => sessionStorage.clear());

describe("IntroLoader", () => {
  it("does not render after the session has already seen the intro", () => {
    sessionStorage.setItem("igs-intro-seen", "true");
    render(<IntroLoader />);
    expect(screen.queryByRole("status", { name: "Loading IG Sabroso Construction" }))
      .toBeNull();
  });
});
```

- [ ] **Step 2: Run the loader test and verify RED**

Run:

```powershell
npm.cmd test -- src/components/intro-loader.test.tsx
```

Expected: FAIL because the current loader always renders.

- [ ] **Step 3: Compose one semantic details page**

`DetailsPage` renders one screen-reader-only H1 for the route topic, then the
nine approved visible sections in order. This fixes the document outline
without inventing unapproved visible copy. It owns the lightbox and
manage-booking state. `src/routes/details.tsx` retains only route registration,
metadata, and the component import.

- [ ] **Step 4: Fix shared header, footer, loader, and consultation labels**

- Set the Instagram URL to the real Instagram profile in both shared components.
- Change mobile navigation to a fixed overlay/drawer that does not alter document
  height.
- Add `aria-expanded`, `aria-controls`, focus containment, Escape close, and
  body-scroll management to the menu.
- Make the intro loader session-aware and skip all animation for reduced motion.
- Add `id`, `htmlFor`, `aria-invalid`, and `aria-describedby` wiring to all
  consultation fields without changing field order or names.
- Add global `:focus-visible`, reduced-motion, and details-section utility rules
  without changing the locked homepage composition.

- [ ] **Step 5: Run the complete test suite and verify GREEN**

Run:

```powershell
npm.cmd test
```

Expected: all model and component tests pass with zero failures.

- [ ] **Step 6: Commit**

```powershell
git add src/features/details/details-page.tsx src/routes/details.tsx src/routes/consultation.tsx src/components/site-header.tsx src/components/site-footer.tsx src/components/intro-loader.tsx src/styles.css src/components/intro-loader.test.tsx
git commit -m "feat: compose refined details experience and close QA gates"
```

---

### Task 8: Production verification and visual fidelity loop

**Files:**

- Modify only files that fail the checks below
- Save final user-facing screenshots outside the repository under:
  `C:\Users\vence\Documents\Codex\2026-07-29\us\outputs`

**Interfaces:**

- Browser flow: `/` locked home check
- Browser flow: `/details` section journey and interaction checks
- Browser flow: `/consultation` labeled form and validation

- [ ] **Step 1: Run automated verification**

Run:

```powershell
npm.cmd test
npm.cmd run build
npx.cmd eslint src/features/details src/routes/details.tsx src/routes/consultation.tsx src/components/site-header.tsx src/components/site-footer.tsx src/components/intro-loader.tsx
```

Expected: tests and build exit 0. Targeted lint has zero errors in changed files.
Any pre-existing build warnings must be listed separately.

- [ ] **Step 2: Start the production preview**

Run:

```powershell
npm.cmd run preview -- --host 127.0.0.1
```

Keep the preview process open for browser QA.

- [ ] **Step 3: Run the Browser desktop checks**

The flow under test is:

`/details` loads -> each section renders in order -> package/process/filter/
estimator interactions change visible state -> consultation actions navigate or
open the expected booking state.

Use a 1440px desktop viewport and verify:

- Page identity and title
- Meaningful DOM and one H1
- No framework overlay
- No relevant console warning or error
- Header stays on one line
- Real media loads
- Package radio selection changes details
- Project filter and search recover from no results
- Estimator validation and valid range
- Process keyboard selection
- Consultation form required validation

- [ ] **Step 4: Run the Browser mobile checks**

Use a 390x844 viewport and verify:

- Mobile menu overlays instead of pushing layout
- No horizontal document overflow
- All multi-column sections collapse explicitly
- Project filters scroll horizontally
- Estimator summary follows controls
- Process becomes a vertical timeline
- Primary CTAs remain one line and touch targets remain usable

- [ ] **Step 5: Capture fidelity screenshots**

Save:

- `igsabroso-implemented-home-desktop.png`
- `igsabroso-implemented-details-desktop.png`
- `igsabroso-implemented-details-mobile.png`
- `igsabroso-implemented-consultation-mobile.png`

- [ ] **Step 6: Perform the required direct image comparison**

Use `view_image` on:

- `igsabroso-locked-homepage-reference.png`
- each relevant approved refined section concept
- every latest implementation screenshot

Record at least five concrete comparison points:

1. Copy and hierarchy
2. Layout and container model
3. Typography
4. Palette, border, and radius system
5. Media treatment and spacing
6. Responsive collapse
7. Focus, selected, disabled, and error states

Fix every material mismatch that is within the approved concept and rerun the
relevant automated and browser checks.

- [ ] **Step 7: Run the final verification gate**

Run fresh:

```powershell
npm.cmd test
npm.cmd run build
git status --short
git diff --check
```

Read the complete output. Do not claim completion if any test or build fails.

- [ ] **Step 8: Commit verified repairs**

```powershell
git add src package.json vitest.config.ts
git commit -m "fix: complete IG Sabroso production QA"
```

If there are no post-QA source changes, do not create an empty commit.
