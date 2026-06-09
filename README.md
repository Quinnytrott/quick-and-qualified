# Quick & Qualified Exteriors / Q2

Next.js site for Q2's exterior inspection, drone/photo documentation, homeowner qualification, and vetted contractor handoff workflow.

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Environment Variables

Copy `.env.example` to `.env.local` for local development and fill in real values. Do not commit real secrets.

Required for Vercel Preview and Production:

- `LEAD_VIEWER_SECRET`
- `CONTRACTOR_APPLICATIONS_ADMIN_TOKEN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_STORAGE_BUCKET`
- `RESEND_API_KEY`
- `RESEND_WEBHOOK_SECRET`

Optional or route-specific:

- `SITE_URL` / `NEXT_PUBLIC_SITE_URL`: canonical URL used when generating signed admin links.
- `LEAD_NOTIFICATION_FROM`: defaults to `Q2 Leads <leads@quickandqualified.ca>`.
- `MEASUREAGENT_FIREBASE_PROJECT_ID`
- `MEASUREAGENT_FIREBASE_CLIENT_EMAIL`
- `MEASUREAGENT_FIREBASE_PRIVATE_KEY`
- `MEASUREAGENT_OWNER_UID`
- `MEASUREAGENT_COMPANY_ID`
- `MEASUREAGENT_SITE_URL`

MeasureAgent variables are required only for converting homeowner leads into MeasureAgent projects.

## Admin URLs

Contractor application list:

```text
/admin/contractor-applications?token=<CONTRACTOR_APPLICATIONS_ADMIN_TOKEN>
```

Contractor application detail links are generated with `LEAD_VIEWER_SECRET` and included in contractor application notification emails.

Homeowner lead detail links are also generated with `LEAD_VIEWER_SECRET` and included in homeowner lead notification emails.

## Checks

```bash
npm run lint
npm run build
```
