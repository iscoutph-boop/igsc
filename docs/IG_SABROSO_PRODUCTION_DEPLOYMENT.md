# IG Sabroso Production Deployment

## Scope

This repository contains the approved premium light-theme hybrid redesign:

- `/` focused conversion homepage
- `/details` with About, Services, Process, Reviews, and Contact anchors
- `/projects` curated project portfolio
- `/projects/$slug` shareable project details
- `/consultation` inquiry and booking workflow

## Required Environment Variable

Create a local `.env` file from `.env.example` and set the server-only CRM endpoint:

```env
GOOGLE_APPS_SCRIPT_WEB_APP_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

Never prefix this variable with `VITE_`. Never commit `.env`.

## Release Verification

Run each command separately:

```powershell
npm.cmd run audit:redesign
npm.cmd run lint
npm.cmd test
npm.cmd run build
```

All commands must exit successfully before deployment.

## Local Review

Development review:

```powershell
npm.cmd run dev -- --host 127.0.0.1 --port 8080 --strictPort
```

Open `http://127.0.0.1:8080/`.

Production-output review after a successful build:

```powershell
npm.cmd run start
```

Use the local URL printed by the server.

## Git Release Workflow

```powershell
git status --short
git add -A
git commit -m "feat: launch IG Sabroso premium hybrid redesign"
git push origin codex/igsabroso-light-redesign
```

Create a pull request into `main`. Review the host-generated preview deployment before merging.

## Live Domain Cutover

The source patch does not change DNS by itself. The live URL becomes active only after the production hosting project deploys the merged commit and `www.igsabroso.com` points to that hosting project.

Before approving the live release, verify:

- Homepage and all routes return HTTP 200
- Official logo and project images load
- Consultation submission reaches the CRM endpoint
- Booking lookup, reschedule, and cancellation work
- Mobile menu and Details anchors work
- No browser-console errors
- Open Graph image resolves
- `robots.txt` and `sitemap.xml` resolve
- HTTPS is valid for both apex and `www`

## Rollback

Do not delete the current production deployment before verification. If the new release fails, redeploy the previous known-good commit or revert the merge commit.
