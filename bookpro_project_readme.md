# BookPro Work Order platform upgrade - Technical README

## Project Overview
This application is a contract-compliant Work Order platform for BookPro. It handles the full lifecycle of real estate service requests, from submission to regional batching, attendance, and invoicing.

## 1. Information Architecture & Page Flows

### A. Public-Facing & Onboarding Flow
1.  **Home Page:** Terris-inspired premium landing page.
2.  **Services Catalog:** Detailed view of BookPro services with pricing classification.
3.  **Authentication:** Unified login/register gateway.
4.  **Registration Workflow:** Account basics, professional profile, and security preferences.

### B. Client Dashboard Experience
*   **Dashboard Home:** Summary of Work Order activity.
*   **Work Orders (`/dashboard/bookings`):** Hub for tracking service requests.
*   **Account Settings:** Profile and sync management.

### C. Multi-Step Work Order Workflow
The booking engine is a 7-step progressive disclosure form:
1.  **Service Selection:** Choose BookPro service.
2.  **Property & Service Area:** Capture location and classify region (Perth/Peel vs Other).
3.  **Contacts:** Tenant, landlord, and contractor details.
4.  **Access & Safety:** Entry instructions and hazard reporting.
5.  **Reporting Requirements:** Template and system requirements (e.g., PropertyMe).
6.  **Scheduling:** Requested attendance window with notice period validation.
7.  **Review & Confirm:** Pricing preview including GST.

## 2. Integration Requirements

### Google Calendar Sync
*   **Availability:** Fetch real-time availability for scheduling.
*   **Events:** Write confirmed Work Orders to the calendar.

### Appwrite Functions
*   **`create-work-order`:** Validates and persists new requests.
*   **`update-work-order-status`:** Centralized state transitions with audit logging.
*   **`generate-invoice-lines`:** Automated fee calculation and export preparation.

## 3. Build & Technical Requirements

### Frontend Stack
*   **Framework:** React, Vite.
*   **Styling:** Tailwind CSS (Terris-inspired Design System).
*   **Type Safety:** Strict TypeScript.

### Backend & Data
*   **Backend:** Appwrite.
*   **Audit Logging:** Every sensitive action is recorded in `auditLogs`.
*   **Region Logic:** Suburb + Postcode matching against Schedule 1.

## 4. Work Order Definition
A Work Order is a written request for Services. It is accepted when confirmed in writing or performance commences. Minimum info includes property address, service type, attendance date, and legal authority confirmation.
