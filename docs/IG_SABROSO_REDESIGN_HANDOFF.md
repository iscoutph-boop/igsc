# IG Sabroso Construction — Hybrid Light-Theme Redesign Handoff

## Delivery status

This source package implements the approved premium light-theme redesign on the existing TanStack Start codebase. The existing booking-management workflow, server-side CRM boundary, appointment lookup, reschedule, and cancellation components are retained.

## Implemented route architecture

| Route | Responsibility |
|---|---|
| `/` | Focused conversion homepage with hero, proof, company preview, services, selected projects, process, reviews, and consultation CTA |
| `/details` | Long-form About, Services, Process, Reviews, and Contact sections with hash navigation |
| `/projects` | Curated, searchable and filterable public portfolio |
| `/projects/$slug` | Shareable project detail pages with verified facts, project-specific galleries, status labels, and related projects |
| `/consultation` | Production inquiry and appointment-request form with success, error, and manage-booking states |

## Principal changes

- Replaced the dark/helmet-led presentation with a premium true-white visual system.
- Installed the exact supplied IG Sabroso logo as a local source asset.
- Added curated real project, team, and turnover photography in optimized WebP form.
- Rebuilt the homepage as a complete multi-section responsive experience.
- Removed packages, estimator, meeting gallery, and modal-only project browsing from the public `/details` flow.
- Added a dedicated portfolio and shareable project-detail routing system.
- Added clear completed/ongoing project status treatment; ongoing renders are labeled as architectural visualizations.
- Redesigned consultation intake while preserving booking-reference and manage-booking behavior.
- Removed the hardcoded Google Apps Script fallback URL. The CRM endpoint is now server-only through an environment variable.
- Replaced Lovable preview metadata with IG Sabroso production metadata and a local social-sharing image.
- Added robots, sitemap, LocalBusiness structured data, analytics hooks, and route-specific canonical metadata.
- Forced the approved light theme and removed theme ambiguity from the main experience.

## Environment variable

Create a local `.env` or configure the deployment dashboard with:

```env
GOOGLE_APPS_SCRIPT_WEB_APP_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

Do not place this value in browser code or commit a real production URL to Git.

## Windows verification commands

Run from the project folder in Windows PowerShell. Use `npm.cmd` because Windows execution policy may block `npm.ps1`.

```powershell
npm.cmd install
npm.cmd run lint
npm.cmd test
npm.cmd run build
```

Expected baseline before this redesign was:

- Lint: 0 errors and 7 existing Fast Refresh warnings
- Tests: 8 test files, 11 tests passed
- Production build: passed

The redesigned package adds tests, so the final test count should be higher than the baseline.

## Local preview

```powershell
npm.cmd run dev
```

Open the local URL printed by Vite. Verify the following routes:

```text
/
/details#about
/details#services
/details#process
/details#reviews
/details#contact
/projects
/projects/o-residence
/consultation
```

## Required production checks

1. Configure `GOOGLE_APPS_SCRIPT_WEB_APP_URL` in the preview deployment.
2. Submit a real internal test inquiry and confirm a booking reference is generated.
3. Test booking lookup, reschedule, and cancellation using the generated reference.
4. Verify every project cover and gallery asset in preview deployment.
5. Confirm approved project names, locations, specifications, reviews, phone, email, address, and office hours.
6. Test at 320, 375, 390, 414, 430, 768, 1024, 1280, and 1440+ viewport widths.
7. Complete keyboard-only and screen-reader smoke tests.
8. Check Open Graph output using the preview URL before production cutover.

## Deployment safety

Do not replace the production domain immediately. Deploy this branch to a preview URL, complete client review, then merge and promote only after functional and visual approval.
