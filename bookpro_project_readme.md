# BookPro: Real Estate Service Booking Portal - Technical README

## Project Overview
BookPro is a high-fidelity real estate service management platform designed for agents, property managers, and individual clients. The application facilitates the discovery, scheduling, and management of specialized property services like condition reports, inspections, and maintenance.

## 1. Information Architecture & Page Flows

### A. Public-Facing & Onboarding Flow
1.  **Home Page (`{{DATA:SCREEN:SCREEN_21}}`):** Brand landing page with value proposition and entry points for services and registration.
2.  **Services Catalog (`{{DATA:SCREEN:SCREEN_24}}`):** Detailed view of available real estate services with professional photography and descriptions.
3.  **Authentication (`{{DATA:SCREEN:SCREEN_9}}`):** Unified login/register gateway.
4.  **Registration Workflow:**
    *   **Step 1: Account Basics (`{{DATA:SCREEN:SCREEN_16}}`):** Email, password, and Google OAuth integration.
    *   **Step 2: Professional Profile (`{{DATA:SCREEN:SCREEN_7}}`):** Role selection (Agent, Manager, Client) to tailor the dashboard experience.
    *   **Step 3: Security & Preferences (`{{DATA:SCREEN:SCREEN_11}}`):** 2FA enablement and communication opt-ins.

### B. Client Dashboard Experience
*   **Dashboard Home (`{{DATA:SCREEN:SCREEN_26}}`):** High-level summary of upcoming activities and quick-access booking triggers.
*   **My Bookings (`{{DATA:SCREEN:SCREEN_13}}`):** Management hub with status filtering (Upcoming, Pending, Completed, Cancelled) and detailed professional tracking.
*   **Account Settings (`{{DATA:SCREEN:SCREEN_2}}`):** Profile management, Google Calendar sync control, and notification matrix (Email/SMS).

### C. Multi-Step Booking Workflow
The booking engine is a 4-step progressive disclosure form:
1.  **Service Selection (`{{DATA:SCREEN:SCREEN_15}}`):** Choosing the specific property service.
2.  **Property & Access (`{{DATA:SCREEN:SCREEN_17}}`):** Capturing location and entry instructions (Lockbox, Tenant meet, etc.).
3.  **Scheduling (`{{DATA:SCREEN:SCREEN_4}}`):** Date and time slot selection powered by real-time availability.
4.  **Review & Confirm (`{{DATA:SCREEN:SCREEN_23}}`):** Final price breakdown (Base + Surcharges) and confirmation.

## 2. Integration Requirements

### Google Calendar Sync
*   **Bi-directional Sync:** Required for reading professional availability and writing confirmed appointments.
*   **OAuth 2.0:** Secure authorization flow for users to connect their calendars.
*   **Conflict Resolution:** Real-time checking to prevent double-booking during the Scheduling step.

### Notification Engine
*   **Triggers:** New booking, status update (Pending -> Confirmed), 24h reminder, and report completion.
*   **Channels:** SMTP for email notifications and a third-party SMS gateway (e.g., Twilio) for urgent property access updates.

## 3. Build & Technical Requirements

### Frontend Stack
*   **Framework:** React or Next.js for state management across multi-step forms.
*   **Styling:** Tailwind CSS using the established Design System (`{{DATA:DESIGN_SYSTEM:DESIGN_SYSTEM_1}}`).
*   **Icons:** Material Symbols for consistent UI iconography.

### Backend & Data
*   **User Roles:** RBAC (Role-Based Access Control) to differentiate between Clients, Agents, and Admins.
*   **Storage:** Secure storage for property reports (PDFs) and high-res photography.
*   **Encryption:** Bank-level encryption for user data and professional profiles.

## 4. MVP Implementation Order
1.  Onboarding & Identity Management.
2.  Core Dashboard Layout & Navigation.
3.  Multi-step Booking Form logic.
4.  Google Calendar API Integration.
5.  Booking Status Workflow (Backend state machine).
