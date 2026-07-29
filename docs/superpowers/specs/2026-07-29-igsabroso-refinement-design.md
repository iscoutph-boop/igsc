# IG Sabroso Downstream Refinement Design

## Status

Approved for implementation on 2026-07-29.

The approval basis is the user-reviewed v2 design package:

- `IG-Sabroso-Preserved-Home-Refined-Sections-Review-v2.pdf`
- `igsabroso-locked-homepage-reference.png`
- `igsabroso-refined-01-about.png`
- `igsabroso-refined-02-services.png`
- `igsabroso-refined-03-packages.png`
- `igsabroso-refined-04-projects.png`
- `igsabroso-refined-05-estimator.png`
- `igsabroso-refined-06-meetings.png`
- `igsabroso-refined-07-reviews.png`
- `igsabroso-refined-08-process.png`
- `igsabroso-refined-09-contact-footer.png`

## Goal

Refine every downstream section of the IG Sabroso website into a cohesive,
production-ready construction experience while preserving the supplied homepage
composition and all real company content, project imagery, routes, form fields,
contact details, and legal copy.

## Design Read

This is a targeted-evolution redesign for homeowners and property clients. The
experience should feel dependable, premium, editorial, and distinctly
construction-led. It should not feel like a generic card-grid landing page.

Design dials:

- Design variance: 7
- Motion intensity: 4
- Visual density: 4

## Scope

### Locked

The `/` homepage is visually locked to the supplied helmet hero reference:

- Header structure and navigation
- Consultation action
- Social controls and theme control
- Booking-management panel
- Helmet hero image and composition
- `10+` and `300+` proof cards
- `Discover More` action
- Floating contact control

Technical defects in shared components may be fixed when the visual composition
does not change.

### Refined

The `/details` route will be rebuilt section by section:

1. About
2. Services
3. Finish packages
4. Project portfolio
5. Price estimator
6. Client and team meetings
7. Client reviews
8. Process
9. Consultation close and footer

The `/consultation` route keeps its existing field order and booking behavior,
but receives accessible labels and consistent production states.

## Design System

### Foundation

- Existing React 19, TanStack Start, Tailwind CSS 4, and Radix primitives
- Existing Poppins display and Montserrat body typography
- Existing Lucide icon family, since it is already the project-wide icon source
- Existing real project and meeting photography
- No new runtime design-system dependency

### Color

- Page background: existing soft neutral light surface
- Dark mode: existing charcoal neutral system
- Single accent: IG Sabroso orange
- Text: near-black in light mode and near-white in dark mode
- Borders: quiet neutral hairlines
- No purple, teal, or unrelated semantic accents

### Shape

- Media and elevated content surfaces: 20-24px radius
- Compact controls and inputs: 12-16px radius
- Primary actions and filter controls: pill radius
- The rule is consistent by component role across all sections

### Typography

- One visible H1 per page
- Section headings use Poppins with compact line height and two-tone emphasis
- Body text uses Montserrat at readable line lengths
- Control labels are deliberate and never browser-default
- Visible copy contains no em dash or en dash separator characters

### Motion

- Motion communicates hierarchy, state change, or control feedback
- Transitions use opacity and transform only
- Autoplay is opt-in and exposes a visible control
- All automatic motion respects `prefers-reduced-motion`
- No scroll hijacking, perpetual decoration, or cursor effects

## Section Specifications

### About

- Desktop uses a 34/66 editorial split
- Left column keeps the approved headline, paragraph, and four destinations
- Destinations become compact, divided action rows
- Right column keeps real project media
- Autoplay is off by default and exposes a labeled switch
- Previous and next controls are semantic buttons with accessible names
- Mobile stacks copy above media

### Services

- Preserve all seven services and their current descriptions
- Residential Construction is the image-led feature
- The remaining six services form a two-column divided service index
- Every service opens or links to its existing detail behavior
- No empty grid cell
- Mobile uses the featured service followed by a single-column disclosure list

### Finish Packages

- Preserve all four tiers, current price ranges, inclusions, and disclaimer
- Use an accessible single-select package selector
- Show one selected package detail panel
- Use a compact price ladder for comparison
- Keep one primary checklist action
- Mobile uses a horizontal selector with one detail panel

### Project Portfolio

- Preserve all project categories, counts, project titles, filters, search,
  sorting, project modal, and lightbox behavior
- Replace poster-like thumbnail treatments with the real project photos
- Use one larger lead item and five supporting items for initial rhythm
- Keep captions and actions below images
- Mobile filters scroll horizontally and projects render in one column
- Empty search/filter state explains how to recover

### Price Estimator

- Preserve every existing field, option, package, inclusion, and calculation
- Present fields in three understandable groups:
  - Project basics
  - Finish and rooms
  - Site and add-ons
- Every input has a persistent label
- Required and invalid states render inline below the field
- The estimate summary stays visible on desktop and follows controls on mobile
- The empty summary is honest and instructive
- The detailed-estimate action is disabled until minimum valid input exists

### Client and Team Meetings

- Preserve the authentic meeting photography and approved copy
- Desktop uses a 4/8 editorial split
- Show one featured image and three supporting images
- Captions sit below images, never as photo overlays
- Include the approved meeting-coverage summary
- Mobile uses one featured image and a horizontal photo rail

### Client Reviews

- Preserve all three family names, five-star ratings, quotes, projects, and
  locations
- Use one feature review and two supporting reviews
- Quotes are edited only for display length without changing their meaning
- Attribution and project metadata remain readable
- Mobile uses a featured review followed by a carousel or stacked sequence

### Process

- Preserve the four phases, their order, descriptions, and consultation action
- Use one connected journey with a selected phase
- Selected phase reveals its description and concrete deliverables
- Phase controls are keyboard operable and use correct selected semantics
- Mobile becomes a vertical timeline

### Consultation Close and Footer

- Add a strong consultation close before the existing footer
- Primary action: book a consultation
- Secondary action: manage an existing booking
- Preserve exact phone, email, address, operating hours, navigation, service
  links, logo, social links, copyright, and location statement
- Correct Instagram destinations without changing the visible icon

## Production Corrections

The redesign also fixes the following approved QA findings:

- One H1 on `/details`
- Explicit labels and accessible names on consultation inputs
- Correct Instagram destinations in header and footer
- Mobile menu overlays content instead of pushing layout
- Intro loader skips after the first session view and is disabled for reduced
  motion
- Existing dark mode and focus visibility are preserved
- Empty, invalid, selected, hover, active, and disabled states are implemented

## Architecture

- `/details` becomes composition glue rather than a 1,700-line component
- Content data moves to a typed details content module
- Estimator calculations and portfolio filtering move to pure tested helpers
- Each major section owns its markup, local interaction state, and responsive
  collapse
- Shared primitives own section headings, focus styles, media treatment, and
  action styling
- Existing booking modals, lightbox, header, footer, and route slugs are reused

## Data Flow

- Static company content is imported from the typed details content module
- Section-local state controls package selection, process selection, autoplay,
  and estimator disclosure
- Portfolio state controls filters, search, sorting, selected project, and
  lightbox
- Estimator values are passed to a pure calculator that returns either an
  incomplete state or a numeric range
- Consultation submission keeps the existing server-function path

## Error and Empty States

- Portfolio: no-results state with a clear reset action
- Estimator: field-level validation and an incomplete-summary state
- Consultation: field-level labels plus existing submission error panel
- Media: useful alt text and stable aspect-ratio containers
- No fake success state or fabricated estimate

## Responsive Contract

- 1440px desktop is the primary fidelity viewport
- 1024px tablet keeps navigation on one line or switches to the menu
- 390px mobile uses explicit one-column fallbacks
- No horizontal document overflow
- No wrapped primary CTA labels at desktop
- Touch targets are at least 44px where controls are compact

## Verification Contract

Implementation is accepted only when:

- Unit tests demonstrate estimator and portfolio behavior
- The production build exits successfully
- Targeted linting reports no new errors in changed files
- Desktop and mobile browser checks show no framework overlay
- Console warnings and errors introduced by the changed UI are zero
- Homepage screenshot comparison confirms no visual recomposition
- Each refined section is compared with its approved concept
- Keyboard operation is verified for package, process, menu, and form controls
- The final implementation screenshot and approved concepts are inspected
  directly with `view_image`

## Explicit Non-Goals

- No deployment
- No GitHub push or pull request without user approval
- No route renaming
- No CMS, database, or booking-backend replacement
- No fabricated project claims, prices, reviews, or photography
- No homepage redesign
