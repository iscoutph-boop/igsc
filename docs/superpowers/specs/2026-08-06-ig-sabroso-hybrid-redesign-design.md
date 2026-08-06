# IG Sabroso Construction Website
## Final Hybrid Architecture Design Specification

**Status:** Approved design direction
**Architecture:** Hybrid
**Primary theme:** Premium light theme
**Brand:** IG Sabroso Construction
**Tagline:** Elevate Your Lifestyle

---

## 1. Objective

Build a premium, responsive, conversion-focused website for IG Sabroso Construction using the approved light-theme visual direction, the attached official logo, verified company information, and a curated selection of real project images.

The website must:

- Present IG Sabroso as a credible, professional, and modern construction partner.
- Showcase selected completed and ongoing projects without publishing the full Google Drive archive.
- Make consultation and inquiry actions easy to find and complete.
- Preserve verified company information and avoid invented claims, testimonials, project details, or prices.
- Work reliably across desktop, tablet, and mobile.
- Remain maintainable as new projects and content are added.

---

## 2. Approved Architecture

### 2.1 Routes

```text
/                         Focused homepage
/details                  Long-form company details page
/details#about            About section
/details#services         Services section
/details#process          Process section
/details#reviews          Reviews section
/details#contact          Contact section
/projects                 Curated project index
/projects/[slug]          Individual project detail page
/consultation             Consultation and project inquiry
```

### 2.2 Booking Utility

Manage Booking may be implemented as either:

- A modal opened from the header and consultation page; or
- A small dedicated route if the final booking provider requires it.

The initial implementation should prefer a modal unless the provider requires a separate route.

---

## 3. Page Responsibilities

### 3.1 Homepage `/`

The homepage is a focused marketing page and must not contain every detail from the website.

Required sections:

1. Header
2. Hero
3. Trust indicators
4. Short company introduction
5. Selected services preview
6. Featured projects preview
7. Process preview
8. Client-review preview
9. Consultation call-to-action
10. Footer

Primary actions:

- Book a Consultation
- View Projects
- Discover More

### 3.2 Details `/details`

A long scrolling page containing:

- About
- Company history
- Mission and values
- Services
- Why choose IG Sabroso
- Construction process
- Approved reviews
- Contact information
- Final consultation call-to-action

The header must support anchor navigation without full-page reloads.

### 3.3 Projects `/projects`

Required capabilities:

- Completed / ongoing filters
- Residential / commercial / renovation / multi-unit filters
- Featured project
- Project cards
- Searchable or filterable project metadata
- Shareable project links
- Clear project-status labels
- Responsive project-image loading

### 3.4 Project Detail `/projects/[slug]`

Required content:

- Project name
- Status
- Verified location
- Verified project type
- Verified project description
- Verified specifications
- Primary exterior image
- Supporting gallery
- Related projects
- Consultation call-to-action

Ongoing project renders must be labeled:

> Ongoing Project — Architectural Visualization

### 3.5 Consultation `/consultation`

Required fields:

- Full name
- Email address
- Mobile number
- Project type
- Project location
- Approximate lot or floor area
- Preferred service
- Budget range
- Target start date
- Project description
- Privacy consent

Required states:

- Idle
- Validation error
- Submitting
- Success
- Server error
- Spam or abuse rejection

---

## 4. Final Content Direction

### 4.1 Verified Company Story

Use the verified company profile as the source of truth.

Recommended history copy:

> Founded in 2020 by Engr. Isagani Sabroso, IG Sabroso Construction began in steelworks before expanding into full-service contracting in 2022. The company established its office in 2023 and continues to grow through dependable service, quality construction, and a close-knit team.

### 4.2 Core Services

Use these verified service groups:

- General Contracting
- Design-Build Services
- Construction Management
- Renovation and Remodeling

Optional supporting service labels may include:

- Project Consultation
- After-Sales Support

These supporting labels must not replace the verified core services.

### 4.3 Mission Themes

The website should communicate:

- Exceeding client expectations
- Superior construction and service
- Long-term value
- Safety
- Sustainability
- Craftsmanship

---

## 5. Curated Project Selection

The public website should begin with approximately 6–8 projects.

### 5.1 Recommended Primary Projects

1. **O Residence**
   - Homepage hero
   - Flagship completed project
   - Strong modern exterior

2. **A Residence — Imus**
   - Featured completed project
   - Strong exterior and interior coverage

3. **G Residence**
   - Residential project card
   - Distinctive cladding and contemporary design

4. **I Residence**
   - Premium / smart-home example
   - Three-storey residential project

5. **A Residence — Sta. Rosa**
   - Renovation category
   - Demonstrates transformation capability

6. **B Apartment**
   - Multi-unit residential project
   - Demonstrates income-property capability

7. **Keystone Building**
   - Commercial project
   - Demonstrates commercial construction capability

8. **F Residence or K Residence**
   - Ongoing-project spotlight
   - Must be labeled as a visualization

### 5.2 Image Governance

Every selected image must have:

- Drive source
- Project association
- Section usage
- Desktop crop
- Mobile crop
- Alt text
- Approval status
- Completed / ongoing status

Do not publish:

- Duplicate images
- Low-resolution screenshots
- Unapproved personal client information
- Misleading renders presented as completed work
- Every image from the Drive archive

---

## 6. Visual Design System

### 6.1 Colors

```css
--igs-orange: #F4511E;
--igs-orange-dark: #D83B0E;
--igs-navy: #152238;
--igs-text: #28323F;
--igs-muted: #667085;
--igs-surface: #F7F8FA;
--igs-line: #E5E7EB;
--igs-white: #FFFFFF;
```

### 6.2 Typography

- Display headings: condensed architectural sans-serif
- Body: neutral sans-serif
- Buttons: medium-to-bold sans-serif
- Navigation: medium sans-serif

### 6.3 UI Rules

- White or soft off-white page background
- Orange only for high-priority emphasis
- Deep navy for headings
- Subtle shadows
- Light borders
- Rounded cards
- Restrained animation
- Strong whitespace
- Natural project photography
- No heavy dark overlays
- No excessive blur or glow

### 6.4 Logo Rules

Use only the attached official logo.

Do not:

- Stretch
- Recolor
- Simplify
- Redraw
- Place inside a white box
- Replace with a generated approximation

---

## 7. Responsive Behavior

### 7.1 Desktop

- Full navigation visible
- Multi-column layouts
- Large project imagery
- Hero content and project image displayed side by side where appropriate
- Project grid of 3–4 cards depending on viewport width

### 7.2 Tablet

- Reduced navigation density
- Two-column layouts where space allows
- Stacked layout for complex sections
- Consistent image priorities

### 7.3 Mobile

- Hamburger navigation
- Single-column layout
- Full-width primary buttons
- Minimum 44px touch targets
- Simplified project cards
- Single-column forms
- Safe-area spacing
- Readable line lengths
- No text overlap on project images

### 7.4 Required QA Widths

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

---

## 8. Component Architecture

Recommended reusable components:

```text
components/
├── layout/
│   ├── Header
│   ├── MobileMenu
│   ├── Footer
│   └── PageShell
├── brand/
│   ├── Logo
│   └── BrandMark
├── home/
│   ├── Hero
│   ├── TrustMetrics
│   ├── AboutPreview
│   ├── ServicesPreview
│   ├── ProjectsPreview
│   ├── ProcessPreview
│   ├── ReviewsPreview
│   └── ConsultationCTA
├── projects/
│   ├── ProjectCard
│   ├── ProjectFilters
│   ├── ProjectGallery
│   ├── ProjectMeta
│   ├── ProjectStatusBadge
│   └── RelatedProjects
├── consultation/
│   ├── ConsultationForm
│   ├── BookingModal
│   ├── FormField
│   ├── SelectField
│   └── FormStatus
└── ui/
    ├── Button
    ├── Card
    ├── SectionHeading
    ├── IconLabel
    ├── Modal
    └── LoadingState
```

Each component must have one clear responsibility and support responsive behavior without creating separate desktop and mobile implementations.

---

## 9. Data Model

### 9.1 Project

```ts
type Project = {
  slug: string;
  name: string;
  status: "completed" | "ongoing";
  projectType: "residential" | "commercial" | "renovation" | "multi-unit";
  location: string;
  description: string;
  specifications: {
    floorArea?: string;
    bedrooms?: number;
    bathrooms?: number;
    carport?: string;
    completionYear?: number;
  };
  coverImage: ImageAsset;
  gallery: ImageAsset[];
  featured: boolean;
  visualizationOnly?: boolean;
};
```

### 9.2 Image Asset

```ts
type ImageAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sourceFolder: string;
  approvedForPublicUse: boolean;
};
```

### 9.3 Review

```ts
type Review = {
  id: string;
  displayName: string;
  quote: string;
  projectSlug?: string;
  rating?: number;
  approvedForPublicUse: boolean;
};
```

---

## 10. Form and Booking Flow

### 10.1 Submission Flow

```text
Visitor completes form
→ client validation
→ spam protection
→ server validation
→ save inquiry
→ send internal notification
→ send client confirmation
→ display success state
```

### 10.2 Security Requirements

- No secret keys in frontend code
- Server-side validation
- Rate limiting
- Spam prevention
- Secure environment variables
- Privacy consent
- Sanitized input
- Error logging without exposing private data

---

## 11. SEO and Analytics

### 11.1 SEO

Required:

- Unique title and description per route
- Canonical URLs
- XML sitemap
- Robots configuration
- LocalBusiness structured data
- Organization structured data
- Project-page metadata
- Open Graph images
- Descriptive alt text
- Local service-area content

### 11.2 Analytics Events

Track:

- Consultation CTA click
- View Projects click
- Project-card click
- Project filter use
- Form start
- Form validation failure
- Form submission success
- Booking completion
- Phone click
- Email click

---

## 12. Accessibility

Required:

- Semantic headings
- Keyboard navigation
- Visible focus states
- Skip-to-content link
- Accessible mobile navigation
- Form labels and instructions
- Error summaries
- Color contrast compliance
- Reduced-motion support
- Descriptive alt text
- Correct button and link semantics

---

## 13. Performance

Required:

- AVIF or WebP production images
- Responsive `srcset`
- Lazy loading below the fold
- Priority loading for the hero image
- Proper image dimensions
- Font preloading only when necessary
- Minimal JavaScript
- Route-level code splitting where applicable
- Optimized third-party scripts
- No autoplaying heavy video on mobile

---

## 14. Testing

### 14.1 Functional

- Navigation
- Anchor links
- Mobile menu
- Project filters
- Project galleries
- Consultation form
- Booking modal
- Reschedule / cancel flow
- Error and success states

### 14.2 Responsive

Test all required viewport widths.

### 14.3 Accessibility

- Keyboard-only usage
- Focus order
- Screen-reader labels
- Form error announcements
- Contrast
- Reduced motion

### 14.4 Performance

- Lighthouse
- Core Web Vitals
- Image loading
- Slow network behavior
- JavaScript errors
- Missing-image fallbacks

---

## 15. Implementation Stages

1. Existing project audit
2. Content and asset curation
3. Data model creation
4. Design-system implementation
5. Layout and navigation
6. Homepage
7. Details page
8. Projects index
9. Project detail pages
10. Consultation and booking
11. SEO and analytics
12. Accessibility QA
13. Responsive QA
14. Production deployment
15. Post-launch verification

---

## 16. Acceptance Criteria

The implementation is complete only when:

- The attached official logo is used everywhere.
- The premium light-theme direction is consistent across all routes.
- Only curated real project images are used.
- Ongoing renders are clearly identified.
- No unverified content is published.
- Desktop, tablet, and mobile layouts are fully responsive.
- Forms are functional and validated.
- Booking controls are functional.
- Project routes are shareable.
- Images are optimized.
- Accessibility checks pass.
- Production build succeeds.
- Deployment is verified on the live domain.
- Existing working functionality is preserved unless an approved replacement exists.

---

## 17. Open Implementation Inputs

The following must be confirmed before code implementation:

- Current source-code folder or GitHub repository
- Existing framework and build system
- Current booking provider or desired booking workflow
- Existing form backend
- Deployment provider
- Final approved review list
- Final approved contact details
- Whether package pricing will be published
- Whether `/about`, `/services`, `/process`, and `/reviews` remain anchors under `/details` or become separate pages in a later phase

---

## 18. Final Approved Decision

**Architecture:** A — Hybrid
**Visual direction:** Premium light theme
**Project strategy:** Curated real project imagery
**Primary conversion goal:** Consultation and project inquiry
**Implementation principle:** Preserve working functionality, avoid unverified content, and build one reusable responsive system.
