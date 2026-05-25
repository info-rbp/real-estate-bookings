# ProInspect staging and production deployment guide

## Purpose

This document covers the minimum setup required to move the ProInspect frontend from local development into a real staging and production deployment using Appwrite and Stripe.

## Environment split

Use separate environments for each of the following:

- Local: developer machine, Vite dev server, Appwrite staging project, Stripe test mode
- Staging: stakeholder review, non-production data, Appwrite staging project, Stripe test mode
- Production: live users, live Appwrite project, live Stripe account and webhook secrets

Do not reuse production Appwrite or Stripe secrets in local or staging environments.

## Frontend environment variables

Add these values to the host that builds and serves the Vite frontend.

- `VITE_APPWRITE_ENDPOINT`
- `VITE_APPWRITE_PROJECT_ID`
- `VITE_APPWRITE_DATABASE_ID`
- `VITE_APPWRITE_USERS_COLLECTION_ID`
- `VITE_APPWRITE_CLIENTS_COLLECTION_ID`
- `VITE_APPWRITE_SERVICES_COLLECTION_ID`
- `VITE_APPWRITE_BOOKINGS_COLLECTION_ID`
- `VITE_APPWRITE_PROPERTIES_COLLECTION_ID`
- `VITE_APPWRITE_LEADS_COLLECTION_ID`
- `VITE_APPWRITE_STORAGE_PROPERTY_IMAGES_BUCKET_ID`
- `VITE_APPWRITE_STORAGE_REPORTS_BUCKET_ID`
- `VITE_APPWRITE_FUNCTION_PRICING_ID`
- `VITE_APPWRITE_FUNCTION_STRIPE_CHECKOUT_ID`
- `VITE_APPWRITE_FUNCTION_STRIPE_WEBHOOK_ID`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `PUBLIC_SITE_URL`

## Server and function secrets

Keep these out of the frontend build and store them only in Appwrite Functions or your deployment platform secret store.

- `APPWRITE_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

## Appwrite setup checklist

1. Create separate Appwrite projects for staging and production.
2. Add the frontend hostname for each environment under the Appwrite web platform settings.
3. Create the primary database and the required collections before enabling frontend writes.
4. Enable row-level security on every collection that stores client, booking, pricing, inspection, payment, or lead data.
5. Configure storage buckets with MIME and size limits before enabling uploads.
6. Create the pricing, Stripe checkout, and Stripe webhook functions.
7. Add environment variables to each function and redeploy after every secret change.
8. Seed staging with an admin user, one client, and a default service catalogue.

## Stripe setup checklist

1. Create separate test and live webhook endpoints.
2. Point the webhook to the Appwrite function that handles Stripe events.
3. Subscribe the webhook to at least these events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `invoice.paid`
   - `invoice.payment_failed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Store the resulting webhook secret in the matching environment.
5. Keep the publishable key in the frontend only. Keep all other Stripe keys server-side.

## Pre-release checks

Before promoting staging to production, confirm all of the following:

- Vite build succeeds with production environment variables
- Appwrite authentication works with a real session
- Admin access is denied for non-admin accounts
- Dashboard routes load without redirect loops
- No hard-coded Stripe publishable or secret keys remain in source
- All public CTA routes resolve to real pages
- Terms and privacy pages resolve
- Booking detail route resolves
- Engage Us route resolves
- Stripe test checkout can call the checkout function
- Stripe webhook handler receives and records test events

## Manual smoke test order

1. Sign up a new client user.
2. Log out and log back in.
3. Confirm `/dashboard` loads.
4. Confirm `/admin/dashboard` is denied for the client account.
5. Log in with an admin account and confirm `/admin/dashboard` loads.
6. Open the public home, properties, engage-us, terms, and privacy pages.
7. Confirm the main CTAs land on working routes.

## Current implementation gap

This repository still needs the live Appwrite collections, functions, Stripe integration code, and end-to-end environment validation to fully satisfy the deployment plan. Treat this document as the deployment baseline, not as a final launch sign-off.
