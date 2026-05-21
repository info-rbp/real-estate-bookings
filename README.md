# Rent On Time Work Order Platform

A contract-compliant real-estate Work Order booking platform for Rent On Time, built with Vite, React, TypeScript, and Appwrite.

## Overview

This application has been upgraded from a generic booking portal to a professional Work Order management system. It supports multi-step Work Order creation, service-area classification, rate card pricing, regional batching, open-for-inspection planning, and automated invoice line generation.

## Technical Stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS
- **Backend:** Appwrite (Databases, Auth, Functions, Storage, Teams)
- **State Management:** React Hooks
- **Routing:** React Router v6

## Core Domain Model

- **Work Order:** A formal request for service. Replaces "Booking" terminology.
- **Service Area:** WA regions (Perth and Peel, Gascoyne, etc.) classified by Suburb + Postcode.
- **Rate Card:** Client-specific pricing for Rent On Time services.
- **Regional Batch:** Grouping of Work Orders for "Other Regions" to meet attendance thresholds.
- **Access Issue:** Formal record of attendance failure with automated fee calculation (20%).
- **Open Inspection Plan:** Weekly planning for recurring property viewings.

## Local Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Copy `.env.example` to `.env.local` and fill in your Appwrite credentials.
   ```bash
   cp .env.example .env.local
   ```

3. **Provision Appwrite:**
   Run the staging provisioning script to set up collections and indexes.
   ```bash
   npm run appwrite:provision:staging
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```

5. **Typecheck and Build:**
   ```bash
   npm run typecheck
   npm run build
   ```

## Work Order Lifecycle

Work Orders move through a strict status machine:
`draft` -> `submitted` -> `pending_acceptance` -> `accepted` -> `scheduled` -> `in_progress` -> `completed` -> `report_delivered` -> `invoiced` -> `paid`

Other statuses include `declined`, `requires_information`, `quote_required`, `awaiting_batch`, `cancelled`, `access_issue`, `reattendance_required`, and `failed`.

## Documentation

- [Appwrite Schema and Permissions](docs/appwrite/schema-and-permissions.md)
- [Original Product Specification](booking_portal_project_specification.md)
- [Original Project README](bookpro_project_readme.md)
- `bookpro_home/code.html`
- `login_register/code.html`
- `book_a_service_step_1_service_selection/code.html`
- `client_dashboard/code.html`

### Option 2: Run a simple local web server

Serving the folder locally is the easiest way to browse the prototype cleanly and avoid browser restrictions around local assets.

From the repository root:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/bookpro_home/code.html
```

You can swap the path to any other screen folder to inspect a different part of the flow.

## Recommended way to review the prototype

Start with these pages in order:

1. `bookpro_home/code.html`
2. `services/code.html` or `real_estate_services/code.html`
3. `login_register/code.html`
4. `sign_up_step_1_account_basics/code.html`
5. `sign_up_step_2_professional_profile/code.html`
6. `sign_up_step_3_security_preferences/code.html`
7. `book_a_service_step_1_service_selection/code.html`
8. `book_a_service_step_2_property_details/code.html`
9. `book_a_service_step_3_scheduling/code.html`
10. `book_a_service_step_4_review_confirm/code.html`
11. `client_dashboard/code.html`
12. `client_dashboard_bookings/code.html`
13. `client_dashboard_settings/code.html`

That sequence tells the clearest story of how the product is intended to work.

## How the components come together

The prototype is organized around a few major application areas.

### 1. Public website

The public site introduces the service, explains what can be booked, and funnels users into account creation or sign-in.

Relevant folders:

- `bookpro_home/`
- `services/`
- `real_estate_services/`

### 2. Authentication and onboarding

Users enter through the shared login/register screen, then move through a multi-step signup process that captures identity, role, and security preferences.

Relevant folders:

- `login_register/`
- `sign_up_step_1_account_basics/`
- `sign_up_step_2_professional_profile/`
- `sign_up_step_3_security_preferences/`

### 3. Booking workflow

Once a user is in the platform, the booking flow guides them through selecting a service, entering property details, choosing a schedule, and reviewing the request before confirmation.

Relevant folders:

- `book_a_service_step_1_service_selection/`
- `book_a_service_step_2_property_details/`
- `book_a_service_step_3_scheduling/`
- `book_a_service_step_4_review_confirm/`

### 4. Client dashboard

After a booking is placed, the dashboard becomes the main workspace for tracking requests, reviewing booking states, and managing account settings.

Relevant folders:

- `client_dashboard/`
- `client_dashboard_booking_integrated/`
- `client_dashboard_bookings/`
- `client_dashboard_settings/`

### 5. Design system and documentation

The docs explain both the intended product behavior and the design language that should be preserved when the prototype becomes a real application.

Relevant files:

- `professional_saas_interface/DESIGN.md`
- `bookpro_project_readme.md`
- `booking_portal_project_specification.md`

## If you are turning this into a real application

The prototype is already broken into logical feature groups, which makes it a reasonable source for a production build. A practical implementation path would look like this:

1. Create an application shell using React or Next.js.
2. Convert each `code.html` screen into reusable page components.
3. Extract shared layout pieces such as navigation, cards, buttons, form fields, and status badges.
4. Turn the signup and booking flows into routed multi-step forms with shared state.
5. Add authentication and role handling for client, staff, and admin users.
6. Add a backend for bookings, services, users, availability, and status changes.
7. Integrate Google Calendar for availability and booking sync.
8. Add notifications for confirmations, reminders, and status updates.

## Suggested application structure

If this project is promoted from prototype to app, the current folders map naturally to these product modules:

- Marketing pages
- Auth and onboarding
- Booking flow
- Client dashboard
- Admin and staff tools
- Shared design system
- Integrations and backend services

The existing prototype already provides the screen-level reference for the first four of those.

## Notes for contributors

- Treat the HTML files as reference implementations for layout and flow.
- Use `screen.png` files for quick visual comparison while rebuilding pages into components.
- Keep the design language aligned with `professional_saas_interface/DESIGN.md`.
- Use `bookpro_project_readme.md` and `booking_portal_project_specification.md` as the source of truth for product intent.

## Next step

The cleanest next move is to convert this repository from a prototype archive into a real app scaffold while preserving these flows and visual references. Which we wll eventually do.
