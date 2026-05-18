# Generic Booking Portal Web Application Build Instructions

## 1. Product Goal
Build a generic web application where clients can:
- Visit public-facing service pages.
- Create an account or log in.
- Access a private dashboard.
- View upcoming, pending, completed, and cancelled bookings.
- Create new bookings.
- Select available time slots based on Google Calendar availability.
- Receive confirmation notifications.
- Track booking status from request to completion.
- Allow admins to manage bookings, services, pricing, users, and calendar settings.

## 2. Core User Types
### Client User
- Register and log in.
- Create bookings.
- View their own bookings.
- Edit or cancel bookings if rules allow.
- Upload files or notes.
- Receive booking confirmations and reminders.

### Admin User
- View all clients and bookings.
- Approve, reject, edit, or cancel bookings.
- Manage services.
- Configure pricing.
- Manage availability rules.
- Connect Google Calendar.
- Export booking and invoice data.

### Staff / Operator User
- View assigned bookings.
- Update booking status.
- Add completion notes.
- Upload supporting files.
- Flag access or attendance issues.

## 3. Main Application Modules
### A. Public Website
Build front-facing pages for:
- Home
- Services
- Pricing
- About
- Contact
- Login
- Register
- Booking information page

### B. Authentication
- Email/password, Google login, Role-based permissions.

### C. Client Dashboard
- Upcoming bookings, Pending requests, Completed bookings, Cancelled bookings, Booking status summary, Quick “New Booking” button, Notifications, Profile details.

### D. Booking Form (Step-by-Step)
- Step 1: Service Selection
- Step 2: Location Details
- Step 3: Access Details
- Step 4: Availability Selection (Google Calendar Sync)
- Step 5: Pricing / Summary
- Step 6: Confirmation

## 4. Google Calendar Integration
- Connect admin account, read availability, create/update/cancel events, sync status.

## 5. Booking Status Flow
- Draft, Pending confirmation, Confirmed, Scheduled, In progress, Completed, Cancelled, Failed / no access, Invoiced.

## 6. MVP Build Order
1. Public website pages
2. Login/register system
3. Client dashboard
4. Admin dashboard
5. Service management
6. New booking form
7. Google Calendar integration
8. Booking history & reporting
