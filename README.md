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
