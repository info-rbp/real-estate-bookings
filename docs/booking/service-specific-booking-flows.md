# Service-Specific Booking Flows

The booking page uses `src/config/serviceBookingConfig.ts` to choose steps, required fields, calendar behavior, and review rules from the selected service ID.

## Services

- `property_condition_report`: property, PCR details, access, contacts, 90 minute calendar slot, notes, review.
- `routine_inspection`: property, tenant notice details, access, contacts, 30 minute calendar slot, notes, review.
- `exit_inspection`: property, vacate/keys/PCR reference details, access, contacts, 60 minute calendar slot, notes, review.
- `open_for_inspection`: batch details, up to 10 OFI property records, attendee capture, notes, review. No calendar slot is selected at submission.
- `key_installation`: property, key collection address/contact/instructions, installation details, access, 60 minute calendar slot, notes, review.
- `maintenance_requests`: property, maintenance issue, contractor/owner approval, access, preferred timing, notes, review. Urgent requests are flagged for admin review.
- `insurance_claims_management`: property, claim details, scope, stakeholders, access and safety, documents, preferred timing, notes, review. Complex or incomplete scopes can require quote review.

## Calendar Rules

Calendar-required services call the `fetch-calendar-availability` Appwrite Function with `dateFrom`, `dateTo`, `durationMinutes`, and `serviceType`.

- Property Condition Report: 90 minutes, required.
- Routine Inspection: 30 minutes, required.
- Exit Inspection: 60 minutes, required.
- Key Installation: 60 minutes, required/recommended.
- Maintenance Requests: 60 minutes, recommended.
- Insurance Claims Management: 60 minutes, recommended.
- Open For Inspection: admin scheduling only.

If no slots are returned, the UI asks the user to add preferred timing notes and submit for review.

## Storage Model

- `bookings`: core work order record, pricing, service area, status, shared access/scheduling fields.
- `bookingServiceDetails`: one side document per booking with `detailsJson` for service-specific fields.
- `bookingProperties`: Open For Inspection child rows, one per property in the batch.

Open For Inspection requires at least 1 property and blocks submission above 10. Every OFI property needs address, suburb, postcode, access method, and access instructions.

## Future Improvements

- Admin OFI route planner and bulk schedule confirmation.
- Upload handling for PCR references, maintenance photos, claim documents, and attendee files.
- Google Calendar event creation after admin or automatic confirmation.
