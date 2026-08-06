# IG Sabroso Hybrid Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the existing `iscoutph-boop/igsc` website into the approved premium light-theme hybrid architecture while preserving working booking/CRM behavior and replacing the current presentation-style content with production-ready responsive pages using curated real IG Sabroso project imagery.

**Architecture:** Keep the existing TanStack Start, React 19, TypeScript, Tailwind CSS v4, and Vitest stack. Use `/` as the focused conversion homepage, `/details` for About/Services/Process/Reviews/Contact sections, `/projects` for the curated portfolio, `/projects/$slug` for shareable project detail routes, and `/consultation` for the existing booking and inquiry flow. Reuse the existing CRM server function and booking management components instead of rebuilding them.

**Tech Stack:** TanStack Start, TanStack Router, React 19, TypeScript, Tailwind CSS v4, Framer Motion, Radix UI, React Hook Form, Zod, Vitest, Testing Library.

## Global Constraints

- Use the approved premium white theme with restrained orange accents and deep navy typography.
- Use only the exact official IG Sabroso logo.
- Use only curated real IG Sabroso project images; do not import the entire Drive archive.
- Clearly label architectural renders and ongoing projects.
- Preserve working consultation, booking lookup, reschedule, cancellation, CRM, and server-side validation behavior.
- Do not expose secrets or API URLs in client-side code.
- Do not publish unverified project details, testimonials, prices, statistics, or personal client contact details.
- Support 320, 375, 390, 414, 430, 768, 1024, 1280, and 1440+ viewport widths.
- Maintain keyboard navigation, visible focus states, semantic structure, reduced-motion support, and accessible forms.
- Use test-driven development and commit after each independently testable task.

---

## Repository Audit Summary

The repository already contains:

- TanStack Start file-based routing.
- A homepage feature at `src/features/home/home-page.tsx`.
- A consolidated details page at `src/features/details/details-page.tsx`.
- A functional consultation route at `src/routes/consultation.tsx`.
- Booking and CRM integration in `src/lib/bookings.ts` and `src/lib/bookings.functions.ts`.
- Project filtering and estimator logic in `src/features/details/model.ts`.
- Existing asset metadata under `src/assets/*.asset.json`.
- Vitest and Testing Library.
- A light-theme token system in `src/styles.css`.

The redesign should therefore refactor and extend the current codebase rather than replace the framework or booking integration.

---

## Target File Structure

```text
src/
├── assets/
│   ├── brand/
│   ├── company/
│   ├── process/
│   └── projects/
├── components/
│   ├── layout/
│   │   ├── site-header.tsx
│   │   ├── mobile-menu.tsx
│   │   ├── site-footer.tsx
│   │   └── page-shell.tsx
│   ├── brand/
│   │   └── brand-lockup.tsx
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── section-heading.tsx
│   │   ├── status-badge.tsx
│   │   └── responsive-image.tsx
│   └── booking/
│       └── existing booking components retained
├── content/
│   ├── company.ts
│   ├── navigation.ts
│   ├── projects.ts
│   ├── reviews.ts
│   └── services.ts
├── features/
│   ├── home/
│   ├── details/
│   ├── projects/
│   └── consultation/
├── routes/
│   ├── __root.tsx
│   ├── index.tsx
│   ├── details.tsx
│   ├── projects.index.tsx
│   ├── projects.$slug.tsx
│   └── consultation.tsx
└── styles.css
```

Follow existing repository conventions where generated TanStack route naming requires a slightly different filename.

---

### Task 1: Establish the Safe Redesign Branch and Baseline

**Files:**
- Read: `package.json`
- Read: `src/routes/__root.tsx`
- Read: `src/routes/index.tsx`
- Read: `src/routes/details.tsx`
- Read: `src/routes/consultation.tsx`
- Read: `src/styles.css`
- Create: `docs/superpowers/plans/2026-08-06-ig-sabroso-hybrid-redesign.md`

**Interfaces:**
- Consumes: Existing `main` branch.
- Produces: A dedicated implementation branch and a verified baseline test/build result.

- [ ] **Step 1: Clone and enter the repository**

Run in Windows PowerShell:

```powershell
cd C:\Users\User\Desktop
git clone https://github.com/iscoutph-boop/igsc.git
cd .\igsc
```

Expected: The repository is cloned and the prompt is inside `C:\Users\User\Desktop\igsc`.

- [ ] **Step 2: Verify repository state**

```powershell
git status
git branch --show-current
git remote -v
```

Expected:
- Working tree is clean.
- Current branch is `main`.
- `origin` points to `https://github.com/iscoutph-boop/igsc.git`.

- [ ] **Step 3: Create the redesign branch**

```powershell
git pull origin main
git switch -c codex/light-theme-hybrid-redesign
```

Expected: `Switched to a new branch 'codex/light-theme-hybrid-redesign'`.

- [ ] **Step 4: Install dependencies**

```powershell
npm install
```

Expected: Dependencies install without an unresolved dependency error.

- [ ] **Step 5: Run the baseline verification**

```powershell
npm run lint
npm test
npm run build
```

Expected: Record the exact result of all three commands before changing code. Do not claim the baseline passes unless each command exits successfully.

- [ ] **Step 6: Save the approved design and implementation documents**

Create:

```text
docs/superpowers/specs/2026-08-06-ig-sabroso-hybrid-redesign-design.md
docs/superpowers/plans/2026-08-06-ig-sabroso-hybrid-redesign.md
```

Copy the approved specification and this plan into those files.

- [ ] **Step 7: Commit the planning baseline**

```powershell
git add docs/superpowers/specs/2026-08-06-ig-sabroso-hybrid-redesign-design.md docs/superpowers/plans/2026-08-06-ig-sabroso-hybrid-redesign.md
git commit -m "docs: define hybrid light-theme redesign"
```

Expected: One documentation commit on the redesign branch.

---

### Task 2: Curate and Register Production Assets

**Files:**
- Create: `src/content/image-assets.ts`
- Create: `src/content/projects.ts`
- Create: `src/content/company.ts`
- Create: `src/content/reviews.ts`
- Modify: `src/assets/*`
- Test: `src/content/projects.test.ts`

**Interfaces:**
- Consumes: Approved logo and selected Drive images.
- Produces:
  - `PROJECTS: readonly ProjectRecord[]`
  - `COMPANY_PROFILE: CompanyProfile`
  - `REVIEWS: readonly ReviewRecord[]`
  - `IMAGE_ASSETS: Record<string, ImageAsset>`

- [ ] **Step 1: Create the failing project-content test**

```ts
import { describe, expect, it } from "vitest";
import { PROJECTS } from "./projects";

describe("PROJECTS", () => {
  it("contains only public, curated projects with valid cover images", () => {
    expect(PROJECTS.length).toBeGreaterThanOrEqual(6);
    expect(PROJECTS.length).toBeLessThanOrEqual(8);

    for (const project of PROJECTS) {
      expect(project.slug).toMatch(/^[a-z0-9-]+$/);
      expect(project.coverImage.approvedForPublicUse).toBe(true);
      expect(project.coverImage.alt.length).toBeGreaterThan(10);

      if (project.status === "ongoing") {
        expect(project.visualizationOnly).toBe(true);
      }
    }
  });
});
```

- [ ] **Step 2: Run the test and verify failure**

```powershell
npm test -- src/content/projects.test.ts
```

Expected: FAIL because `src/content/projects.ts` does not exist.

- [ ] **Step 3: Add content types and curated records**

Create `src/content/projects.ts` with explicit types:

```ts
export type ProjectStatus = "completed" | "ongoing";
export type ProjectCategory =
  | "residential"
  | "commercial"
  | "renovation"
  | "multi-unit";

export type ImageAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sourceFolder: string;
  approvedForPublicUse: boolean;
};

export type ProjectRecord = {
  slug: string;
  name: string;
  status: ProjectStatus;
  category: ProjectCategory;
  location: string;
  description: string;
  specifications: {
    floorArea?: string;
    completionYear?: number;
    bedrooms?: number;
    bathrooms?: number;
    carport?: string;
  };
  coverImage: ImageAsset;
  gallery: readonly ImageAsset[];
  featured: boolean;
  visualizationOnly?: boolean;
};
```

Add only verified records for:

- O Residence
- A Residence — Imus
- G Residence
- I Residence
- A Residence — Sta. Rosa
- B Apartment
- Keystone Building
- One approved ongoing project

Do not use placeholder locations or statistics.

- [ ] **Step 4: Replace incorrect shared-gallery behavior**

Remove the current behavior that derives every project's gallery from `projectGalleryPool`. Each project must receive its own verified gallery array.

- [ ] **Step 5: Run the content test**

```powershell
npm test -- src/content/projects.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit curated content**

```powershell
git add src/assets src/content
git commit -m "feat: add curated IG Sabroso production content"
```

---

### Task 3: Lock the Premium Light Design System

**Files:**
- Modify: `src/styles.css`
- Create: `src/components/ui/section-heading.tsx`
- Create: `src/components/ui/status-badge.tsx`
- Create: `src/components/ui/responsive-image.tsx`
- Test: `src/components/ui/status-badge.test.tsx`

**Interfaces:**
- Consumes: Tailwind v4 theme variables.
- Produces:
  - `SectionHeading`
  - `StatusBadge`
  - `ResponsiveImage`

- [ ] **Step 1: Write a failing status-badge test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusBadge } from "./status-badge";

describe("StatusBadge", () => {
  it("labels ongoing visualizations explicitly", () => {
    render(<StatusBadge status="ongoing" visualizationOnly />);
    expect(
      screen.getByText("Ongoing Project — Architectural Visualization"),
    ).toBeTruthy();
  });
});
```

- [ ] **Step 2: Verify the test fails**

```powershell
npm test -- src/components/ui/status-badge.test.tsx
```

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Refine global tokens**

Set the production theme in `src/styles.css`:

```css
:root {
  --radius: 1rem;
  --background: #ffffff;
  --foreground: #152238;
  --surface: #f7f8fa;
  --surface-foreground: #152238;
  --card: #ffffff;
  --card-foreground: #152238;
  --primary: #f4511e;
  --primary-foreground: #ffffff;
  --secondary: #fff3ed;
  --secondary-foreground: #152238;
  --muted: #f2f4f7;
  --muted-foreground: #667085;
  --border: #e5e7eb;
  --input: #dfe3e8;
  --ring: #f4511e;
}
```

Remove dark-theme-first styling from redesigned pages. Retain a dark token block only if the theme switch remains an approved requirement.

- [ ] **Step 4: Implement shared visual primitives**

Create:

```tsx
export function StatusBadge({
  status,
  visualizationOnly = false,
}: {
  status: "completed" | "ongoing";
  visualizationOnly?: boolean;
}) {
  const label =
    status === "ongoing" && visualizationOnly
      ? "Ongoing Project — Architectural Visualization"
      : status === "ongoing"
        ? "Ongoing Project"
        : "Completed Project";

  return <span className="...">{label}</span>;
}
```

- [ ] **Step 5: Run focused and full tests**

```powershell
npm test -- src/components/ui/status-badge.test.tsx
npm test
```

Expected: PASS.

- [ ] **Step 6: Commit**

```powershell
git add src/styles.css src/components/ui
git commit -m "feat: establish premium light design system"
```

---

### Task 4: Rebuild the Shared Header, Mobile Navigation, and Footer

**Files:**
- Modify: `src/components/site-header.tsx`
- Modify: `src/components/site-header-home.tsx`
- Modify: `src/components/site-footer.tsx`
- Create: `src/components/mobile-menu.tsx`
- Create: `src/content/navigation.ts`
- Test: `src/components/site-header.test.tsx`

**Interfaces:**
- Consumes: TanStack Router `Link`, approved route structure.
- Produces:
  - Shared desktop navigation
  - Accessible mobile menu
  - Consistent consultation CTA
  - Anchor-aware details navigation

- [ ] **Step 1: Write failing navigation tests**

Test that:

- Home points to `/`.
- About points to `/details#about`.
- Services points to `/details#services`.
- Projects points to `/projects`.
- Process points to `/details#process`.
- Reviews points to `/details#reviews`.
- Contact points to `/details#contact`.
- Consultation points to `/consultation`.
- Escape closes the mobile menu.
- Focus returns to the menu opener.

- [ ] **Step 2: Verify failure**

```powershell
npm test -- src/components/site-header.test.tsx
```

Expected: At least the Projects route assertion fails because the current navigation does not yet expose `/projects`.

- [ ] **Step 3: Implement the shared navigation model**

```ts
export const PRIMARY_NAV = [
  { label: "Home", to: "/" },
  { label: "About", to: "/details", hash: "about" },
  { label: "Services", to: "/details", hash: "services" },
  { label: "Projects", to: "/projects" },
  { label: "Process", to: "/details", hash: "process" },
  { label: "Reviews", to: "/details", hash: "reviews" },
  { label: "Contact", to: "/details", hash: "contact" },
] as const;
```

- [ ] **Step 4: Implement accessible desktop and mobile headers**

Requirements:

- Exact official logo.
- White header surface.
- Active-route indication.
- Mobile focus trap.
- Escape close.
- Scroll lock.
- 44px minimum controls.
- Consultation button always available.

- [ ] **Step 5: Run tests**

```powershell
npm test -- src/components/site-header.test.tsx
npm test
```

Expected: PASS.

- [ ] **Step 6: Commit**

```powershell
git add src/components src/content/navigation.ts
git commit -m "feat: rebuild responsive site navigation"
```

---

### Task 5: Rebuild the Focused Homepage

**Files:**
- Modify: `src/features/home/home-page.tsx`
- Modify: `src/features/home/home-page.test.tsx`
- Create: `src/features/home/components/hero.tsx`
- Create: `src/features/home/components/trust-metrics.tsx`
- Create: `src/features/home/components/about-preview.tsx`
- Create: `src/features/home/components/services-preview.tsx`
- Create: `src/features/home/components/projects-preview.tsx`
- Create: `src/features/home/components/process-preview.tsx`
- Create: `src/features/home/components/reviews-preview.tsx`
- Create: `src/features/home/components/consultation-cta.tsx`

**Interfaces:**
- Consumes: `PROJECTS`, company content, services, reviews.
- Produces: Conversion-focused `/` route.

- [ ] **Step 1: Replace the current hero-only test with a full homepage hierarchy test**

Assert:

```tsx
expect(screen.getByRole("heading", {
  level: 1,
  name: /build with confidence/i,
})).toBeTruthy();

expect(screen.getByRole("link", { name: /view projects/i }))
  .toHaveAttribute("href", "/projects");

expect(screen.getByRole("link", { name: /book a consultation/i }))
  .toHaveAttribute("href", "/consultation");

expect(screen.getByText("O Residence")).toBeTruthy();
```

- [ ] **Step 2: Verify failure**

```powershell
npm test -- src/features/home/home-page.test.tsx
```

Expected: FAIL because the current homepage contains only the hero.

- [ ] **Step 3: Implement homepage sections in this order**

1. Hero
2. Trust metrics
3. About preview
4. Services preview
5. Featured projects
6. Process preview
7. Approved review preview
8. Consultation CTA
9. Footer

The hero must use a strong completed real-project exterior, not the hard-hat banner.

- [ ] **Step 4: Preserve booking management access**

The existing `CheckBookingModal` must remain available from the header or homepage utility action.

- [ ] **Step 5: Run tests and build**

```powershell
npm test -- src/features/home/home-page.test.tsx
npm test
npm run build
```

Expected: PASS.

- [ ] **Step 6: Commit**

```powershell
git add src/features/home src/routes/index.tsx
git commit -m "feat: rebuild premium conversion homepage"
```

---

### Task 6: Refactor the Details Page to the Approved Long-Form Structure

**Files:**
- Modify: `src/features/details/details-page.tsx`
- Modify: `src/features/details/components/about-section.tsx`
- Modify: `src/features/details/components/services-section.tsx`
- Modify: `src/features/details/components/process-section.tsx`
- Modify: `src/features/details/components/reviews-section.tsx`
- Modify/Create: `src/features/details/components/contact-section.tsx`
- Remove from public flow or relocate:
  - `packages-section.tsx`
  - `estimator-section.tsx`
  - `meetings-section.tsx`
- Test: `src/features/details/details-page.test.tsx`

**Interfaces:**
- Consumes: Company, services, reviews, process content.
- Produces: `/details#about`, `#services`, `#process`, `#reviews`, `#contact`.

- [ ] **Step 1: Write failing anchor-section test**

```tsx
expect(container.querySelector("#about")).toBeTruthy();
expect(container.querySelector("#services")).toBeTruthy();
expect(container.querySelector("#process")).toBeTruthy();
expect(container.querySelector("#reviews")).toBeTruthy();
expect(container.querySelector("#contact")).toBeTruthy();
```

Also assert that package prices and estimator content are not rendered in the default details flow unless explicitly approved.

- [ ] **Step 2: Verify failure**

```powershell
npm test -- src/features/details/details-page.test.tsx
```

- [ ] **Step 3: Reorder and simplify the page**

Render:

```tsx
<AboutSection />
<ServicesSection />
<WhyChooseSection />
<ProcessSection />
<ReviewsSection />
<ContactSection />
<ConsultationClose />
```

- [ ] **Step 4: Preserve deep-link scrolling**

Add a route-level or page-level effect that scrolls to the current hash after content mounts, while respecting reduced-motion preference.

- [ ] **Step 5: Run tests**

```powershell
npm test -- src/features/details/details-page.test.tsx
npm test
```

Expected: PASS.

- [ ] **Step 6: Commit**

```powershell
git add src/features/details src/routes/details.tsx
git commit -m "feat: rebuild long-form company details page"
```

---

### Task 7: Create the Dedicated Projects Index Route

**Files:**
- Create: `src/routes/projects.index.tsx`
- Create: `src/features/projects/projects-page.tsx`
- Create: `src/features/projects/project-card.tsx`
- Create: `src/features/projects/project-filters.tsx`
- Move/refactor: `src/features/details/model.ts`
- Test: `src/features/projects/projects-page.test.tsx`

**Interfaces:**
- Consumes: `PROJECTS`.
- Produces:
  - `/projects`
  - `filterProjects(projects, filters): ProjectRecord[]`

- [ ] **Step 1: Write failing filter and navigation tests**

Cover:

- Completed
- Ongoing
- Residential
- Commercial
- Renovation
- Multi-unit
- Search
- Empty-result recovery
- Project-card link to `/projects/$slug`

- [ ] **Step 2: Verify failure**

```powershell
npm test -- src/features/projects/projects-page.test.tsx
```

- [ ] **Step 3: Implement the page**

Use semantic filter buttons, URL-search parameters when practical, and shareable project links.

Do not use a modal as the only project-detail mechanism.

- [ ] **Step 4: Run tests**

```powershell
npm test -- src/features/projects/projects-page.test.tsx
npm test
```

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/routes src/features/projects src/features/details/model.ts
git commit -m "feat: add dedicated curated projects portfolio"
```

---

### Task 8: Create Shareable Project Detail Routes

**Files:**
- Create: `src/routes/projects.$slug.tsx`
- Create: `src/features/projects/project-detail-page.tsx`
- Create: `src/features/projects/project-gallery.tsx`
- Create: `src/features/projects/project-specifications.tsx`
- Create: `src/features/projects/related-projects.tsx`
- Test: `src/features/projects/project-detail-page.test.tsx`

**Interfaces:**
- Consumes:
  - `getProjectBySlug(slug): ProjectRecord | undefined`
  - `getRelatedProjects(project): ProjectRecord[]`
- Produces: `/projects/:slug`

- [ ] **Step 1: Write failing detail-page tests**

Assert:

- Correct project title.
- Correct status badge.
- Correct image alt text.
- Correct verified specifications.
- Consultation link.
- Related projects.
- Unknown slug produces not-found behavior.

- [ ] **Step 2: Verify failure**

```powershell
npm test -- src/features/projects/project-detail-page.test.tsx
```

- [ ] **Step 3: Implement project lookup helpers**

```ts
export function getProjectBySlug(slug: string) {
  return PROJECTS.find((project) => project.slug === slug);
}
```

- [ ] **Step 4: Implement accessible gallery behavior**

Requirements:

- Keyboard-operable thumbnails.
- Visible active state.
- Dialog/lightbox with close button.
- Escape close.
- Accurate alt text.
- No unrelated shared gallery images.

- [ ] **Step 5: Add route metadata**

Generate title, description, canonical URL, and Open Graph image from project data.

- [ ] **Step 6: Run tests and build**

```powershell
npm test -- src/features/projects/project-detail-page.test.tsx
npm test
npm run build
```

Expected: PASS.

- [ ] **Step 7: Commit**

```powershell
git add src/routes src/features/projects
git commit -m "feat: add shareable project detail pages"
```

---

### Task 9: Redesign Consultation UI Without Breaking CRM

**Files:**
- Modify: `src/routes/consultation.tsx`
- Retain: `src/lib/bookings.ts`
- Modify carefully: `src/lib/bookings.functions.ts`
- Test: `src/routes/consultation.test.tsx`
- Test: `src/lib/bookings.functions.test.ts`

**Interfaces:**
- Consumes: `callCRM("createBooking", payload)`.
- Produces: Accessible consultation form and unchanged booking reference workflow.

- [ ] **Step 1: Write failing form tests**

Cover:

- Required fields.
- Email format.
- Phone value.
- Project type.
- Project location.
- Approximate area.
- Preferred service.
- Budget range.
- Target start date.
- Description.
- Privacy consent.
- Loading.
- Success.
- Server failure.

- [ ] **Step 2: Verify failure**

```powershell
npm test -- src/routes/consultation.test.tsx
```

- [ ] **Step 3: Expand server-side Zod schema**

Add fields without removing current supported payload fields.

Never move the CRM URL into client code.

- [ ] **Step 4: Remove the hardcoded fallback CRM URL**

Require:

```ts
const url = process.env.GOOGLE_APPS_SCRIPT_WEB_APP_URL;

if (!url) {
  throw new Error("Booking service is not configured.");
}
```

Document the variable in `.env.example`.

- [ ] **Step 5: Preserve booking reference and management flow**

After success:

- Display booking reference.
- Keep Manage Booking.
- Keep reschedule and cancel capability.
- Do not log PII.

- [ ] **Step 6: Run focused and full tests**

```powershell
npm test -- src/routes/consultation.test.tsx
npm test -- src/lib/bookings.functions.test.ts
npm test
npm run build
```

Expected: PASS.

- [ ] **Step 7: Commit**

```powershell
git add src/routes/consultation.tsx src/lib .env.example
git commit -m "feat: redesign consultation flow and secure CRM config"
```

---

### Task 10: SEO, Structured Data, Sitemap, and Analytics Hooks

**Files:**
- Modify: `src/routes/__root.tsx`
- Modify: route head functions
- Create: `src/lib/seo.ts`
- Create: `src/lib/analytics.ts`
- Create: `public/robots.txt`
- Create: `public/sitemap.xml` or a generated sitemap route
- Test: `src/lib/seo.test.ts`

**Interfaces:**
- Produces:
  - `buildSeoMetadata()`
  - `trackEvent()`
  - LocalBusiness structured data

- [ ] **Step 1: Write failing SEO tests**

Verify:

- No Lovable preview image remains in Open Graph metadata.
- Each route has a unique title and description.
- Project pages have project-specific images.
- Canonical URLs use the production domain.

- [ ] **Step 2: Verify failure**

```powershell
npm test -- src/lib/seo.test.ts
```

Expected: FAIL because the root metadata currently references a Lovable preview URL.

- [ ] **Step 3: Implement metadata helpers and structured data**

Use verified contact details only.

- [ ] **Step 4: Add analytics event hooks**

Track:

- Consultation CTA
- View Projects
- Project-card click
- Filter use
- Form start
- Validation failure
- Successful submission
- Booking completion
- Phone click
- Email click

Do not load an analytics provider until the provider ID is configured.

- [ ] **Step 5: Run tests and build**

```powershell
npm test -- src/lib/seo.test.ts
npm test
npm run build
```

Expected: PASS.

- [ ] **Step 6: Commit**

```powershell
git add src/lib src/routes public
git commit -m "feat: add production SEO and analytics hooks"
```

---

### Task 11: Full Responsive, Accessibility, and Visual QA

**Files:**
- Modify: Any files with verified defects.
- Create: `docs/qa/2026-08-06-responsive-qa.md`
- Create: `docs/qa/2026-08-06-accessibility-qa.md`

**Interfaces:**
- Produces: Verified release candidate.

- [ ] **Step 1: Run automated checks**

```powershell
npm run lint
npm test
npm run build
```

Expected: All commands pass.

- [ ] **Step 2: Run the site locally**

```powershell
npm run dev
```

Expected: Vite prints the local URL and the site loads without console errors.

- [ ] **Step 3: Test required viewport widths**

Verify:

```text
320
375
390
414
430
768
1024
1280
1440+
```

Check:

- Header
- Mobile menu
- Hero crop
- Cards
- Filters
- Gallery
- Forms
- Footer
- Floating contact control
- No horizontal overflow
- No text overlap
- No clipped action buttons

- [ ] **Step 4: Run keyboard-only QA**

Verify:

- Skip link.
- Header navigation.
- Mobile menu.
- Project filters.
- Gallery controls.
- Consultation form.
- Booking modal.
- Visible focus.
- Logical focus order.
- Escape close behavior.

- [ ] **Step 5: Run content QA**

Verify every displayed:

- Project name
- Location
- Status
- Specification
- Review
- Contact detail
- Statistic
- Price

against an approved source.

- [ ] **Step 6: Run performance QA**

Verify:

- Hero image is prioritized.
- Below-fold images lazy-load.
- Width and height are present.
- WebP/AVIF is used where supported.
- No unnecessary autoplay video.
- Reduced-motion behavior works.

- [ ] **Step 7: Document results and commit**

```powershell
git add .
git commit -m "test: complete responsive accessibility and production QA"
```

---

### Task 12: Push, Preview Deployment, and Pull Request

**Files:**
- Modify only if deployment verification reveals a defect.

**Interfaces:**
- Produces: Reviewable preview deployment and pull request.

- [ ] **Step 1: Confirm final Git state**

```powershell
git status
git log --oneline --decorate -10
git branch --show-current
```

Expected:
- Clean working tree.
- Branch is `codex/light-theme-hybrid-redesign`.

- [ ] **Step 2: Push the branch**

```powershell
git push -u origin codex/light-theme-hybrid-redesign
```

Expected: Git prints the remote branch and pull-request URL.

- [ ] **Step 3: Open a draft pull request**

Title:

```text
feat: rebuild IG Sabroso website with premium hybrid architecture
```

PR body must include:

- Summary
- Routes added
- Existing functionality preserved
- Curated assets used
- Test commands and exact results
- Responsive QA widths
- Environment variables
- Preview deployment
- Remaining client approvals

- [ ] **Step 4: Verify deployment**

Check:

- Build logs
- Preview URL
- Homepage
- Details anchors
- Projects filters
- Project detail URLs
- Consultation submission
- Booking management
- Open Graph previews
- Mobile layout

- [ ] **Step 5: Obtain approval before production**

Do not merge or repoint the production domain until the preview is approved.

---

## Final Verification Checklist

- [ ] Official logo is exact and undistorted.
- [ ] Premium light theme matches the approved PDF direction.
- [ ] Homepage is focused rather than overloaded.
- [ ] `/details` anchors work.
- [ ] `/projects` is filterable.
- [ ] Project detail routes are shareable.
- [ ] Only curated real images are used.
- [ ] Ongoing visualizations are labeled.
- [ ] Consultation submits successfully.
- [ ] Booking lookup, reschedule, and cancellation still work.
- [ ] No secret appears in client code.
- [ ] No hardcoded CRM endpoint remains.
- [ ] No Lovable preview metadata remains.
- [ ] All tests pass.
- [ ] Production build passes.
- [ ] Responsive QA is complete.
- [ ] Accessibility QA is complete.
- [ ] Client approves preview before production launch.
