# ProInspect production readiness follow-up

Generated 26 May 2026 after reviewing the implementation specification and current repository state.

## Completed in current codebase

- Public navigation has been simplified around Services, Pricing, About, Contact / Request Access, and Login.
- Subscription content is routed into `/pricing#subscription`.
- Public mock property and tenant booking routes are hidden from launch navigation.
- Terms and Privacy pages contain production-oriented ProInspect content rather than staging placeholder notices.
- Contact / Request Access collects audience type, request type, contact information, portfolio size, message, and consent.
- Booking notification and Google Calendar integration code exists in `create-work-order` and keeps booking creation resilient if those integrations fail.

## Remaining code actions

1. Calendar-required booking fallback needs a validation correction. The service config still treats `calendarEventStart` and `calendarEventEnd` as required for PCR, Routine Inspection, and Exit Inspection. Those fields should be optional at the config level, with `BookService.validateAll()` enforcing either a selected slot or preferred timing notes.
2. Appwrite booking status enum should include `pending_scheduling` so OFI bookings and no-slot fallback requests preserve the intended operational status.
3. Appwrite provisioning should include `bookingNotifications` and `bookingCalendarEvents` collections plus indexes.
4. Appwrite bookings schema should include Google Calendar metadata fields: `calendarId`, `calendarEventId`, `calendarEventLink`, `calendarEventStart`, `calendarEventEnd`, and `calendarEventStatus`.
5. Live deployment still needs real email provider variables and Google Calendar credentials.
6. Seed data and `data/services-pricing.csv` need one final reconciliation with the approved seven-service catalogue.
7. Login copy and signup flow should clearly handle pending account approval without implying immediate dashboard access.

## Deployment checks still required

- Run package install, typecheck, build, lint, and tests in a repository environment with network access.
- Run Appwrite provisioning or migration scripts against staging before production.
- Send test booking emails to internal and booker addresses.
- Create a test Google Calendar event for a selected-slot booking.
- Submit OFI and no-slot fallback bookings to verify `pending_scheduling` handling.
