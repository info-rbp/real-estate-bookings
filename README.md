# ProInspect Work Order Platform

A production-focused property field services platform for ProInspect, built with Vite, React, TypeScript and Appwrite.

## What the app does

ProInspect supports approved agencies, landlords and property teams with:

- public marketing pages for services, pricing, legal information and access requests
- client portal login and account approval workflow
- seven supported booking flows for property field services
- Appwrite-backed work-order creation, audit logging and supporting records
- booking email notifications and Google Calendar event creation through Appwrite Functions
- deployment to Cloudflare Workers Static Assets

## Core stack

- Frontend: React, Vite, TypeScript, Tailwind CSS
- Backend platform: Appwrite Databases, Auth, Functions and Storage
- Payments: Stripe browser and webhook integration hooks
- Deployment: Cloudflare Workers Static Assets via Wrangler

## White-label configuration

The rebuild now includes a small central brand configuration layer in `src/config/brand.ts`.

Brand values are driven by:

- `VITE_BRAND_NAME`
- `VITE_BRAND_LEGAL_NAME`
- `VITE_BRAND_TAGLINE`
- `VITE_BRAND_DOMAIN`

This covers the app shell, portal entry points and default document branding. Marketing copy still needs a final pass if the product is re-labelled away from ProInspect.

## Supported service catalogue

The current launch catalogue is limited to these seven services:

1. Property Condition Report
2. Routine Inspection
3. Exit Inspection
4. Open For Inspection
5. Insurance Claims Management
6. Maintenance Requests
7. Key Installation

Keep the public pages, `data/services-pricing.csv`, service imports and booking workflows aligned to this catalogue.

## Local setup

1. Install dependencies.

```bash
npm install
```

2. Copy the example environment file and fill in the required values.

```bash
cp .env.example .env.local
```

3. Validate frontend and booking-function configuration.

```bash
npm run check:env:local
npm run check:env:functions
```

4. Provision Appwrite baseline collections, then apply launch-specific schema updates.

```bash
npm run appwrite:provision:local
npm run appwrite:provision:launch
```

5. Import service areas and the approved launch pricing catalogue.

```bash
npm run service-areas:import
npm run services:import
```

6. Run the development server.

```bash
npm run dev
```

7. Run verification checks before deploying.

```bash
npm run typecheck
npm run build
```

## Environment variables

### Frontend build-time variables

These must be configured for local builds and Cloudflare deployment:

- `VITE_BRAND_NAME`
- `VITE_APPWRITE_*` collection, bucket and function IDs used by the frontend
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `PUBLIC_SITE_URL`

Use `npm run check:env` or `npm run check:env:local` to verify these names are populated.

### Booking function variables

These must be configured on the `create-work-order` Appwrite Function before deployment:

- `BOOKING_NOTIFICATIONS_COLLECTION_ID`
- `BOOKING_CALENDAR_EVENTS_COLLECTION_ID`
- `EMAIL_PROVIDER`
- `EMAIL_FROM`
- `OPERATIONS_EMAIL_TO`
- `OPERATIONS_ALERT_EMAIL_TO`
- provider-specific credentials such as `RESEND_API_KEY`, `SENDGRID_API_KEY`, `MAILGUN_*`, or `GMAIL_DELEGATED_USER`
- `GOOGLE_CALENDAR_ID`
- `GOOGLE_CLIENT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `GOOGLE_CALENDAR_TIMEZONE`
- optional `GOOGLE_CALENDAR_INVITE_BOOKER`

Use `npm run check:env:functions` to verify local values before function deployment.

## Appwrite provisioning and launch readiness

The repository includes two provisioning layers:

- `scripts/provision-appwrite-staging.mjs` creates the baseline collections, indexes and storage buckets.
- `scripts/provision-launch-schema.mjs` adds launch-readiness updates such as `pending_scheduling`, booking notification logs, booking calendar event logs, booking calendar metadata fields, and launch catalogue reconciliation.

After provisioning, import the approved service catalogue from `data/services-pricing.csv` so the database matches the public pricing tables and booking flows.

## Cloudflare deployment

Production deployment targets Cloudflare Workers Static Assets.

- Production branch: `main`
- Build command: `npm run build`
- Deploy command: `npm run deploy`
- Output directory: `dist`
- Wrangler config: `wrangler.toml`
- SPA fallback: `public/_redirects` and Wrangler `not_found_handling = "single-page-application"`

Run this sequence before every deploy:

```bash
npm ci
npm run check:env
npm run typecheck
npm run build
```

## Booking workflow notes

- Calendar-based services can fall back to scheduling review when no slot exists and timing notes are supplied.
- Open For Inspection requests are submitted for scheduling review and route planning rather than instant confirmation.
- Booking creation must remain durable even if email delivery or Google Calendar event creation fails.
- Booking notification failures and calendar failures are logged for manual follow-up.

## Recommended smoke tests

Before production launch, verify these flows with a real test client profile:

1. Submit a standard calendar-based booking and confirm the work order is saved.
2. Confirm operations and booker emails are sent.
3. Confirm a Google Calendar event is created for calendar-based services.
4. Confirm OFI accepts 10 properties and rejects 11.
5. Confirm no-slot calendar fallback submits for scheduling review when timing notes are provided.
6. Confirm pending client accounts are not granted immediate dashboard access.

## Key scripts

- `npm run typecheck`
- `npm run build`
- `npm run check:env`
- `npm run check:env:local`
- `npm run check:env:functions`
- `npm run appwrite:provision:local`
- `npm run appwrite:provision:launch`
- `npm run service-areas:import`
- `npm run services:import`
- `npm run deploy`
