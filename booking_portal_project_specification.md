# ProInspect Work Order Platform Specification

## 1. Product Goal
Build a contract-compliant Work Order platform where ProInspect and its clients can:
- Submit detailed Work Orders for property services.
- Classify properties by Service Area (Perth/Peel vs Other Regions).
- Apply regional pricing and batching rules.
- Manage access issues and re-attendance workflows.
- Coordinate weekly Open for Inspection plans.
- Generate and export invoice lines with GST.
- Maintain a full audit trail of all operational changes.

## 2. Core User Types
### Client User (ProInspect / Agency)
- Create Work Orders.
- Confirm legal authority for attendance.
- View real-time status and reports.

### Admin User (Service Provider)
- Manage the full platform operations.
- Accept/decline Work Orders.
- Manage regional batches and OFI plans.
- Assign staff and schedule attendance.
- Export invoices.

### Staff User (Field Professional)
- View assigned Work Orders.
- Capture attendance notes and access issues.
- Submit reports.

## 3. Service Area Rules (Schedule 1)
- **Perth and Peel Region:** Standard rates, 7 days' notice preferred.
- **Other Regions:** Regional rates, requires batching (min 10-15 bookings).
- **Outside Service Area:** Requires quote and admin review.

## 4. Rate Card (GST-Exclusive)
- Property Condition Report: $120 (Perth/Peel) / $150 (Other)
- Routine/Exit/OFI: $40 / $60
- Key Installation: $70 / $100
- GST Rate: 10%

## 5. Access Issues
- Fee: 20% of relevant booking fee + GST.
- Triggered by missing keys, tenant refusal, unsafe conditions, etc.
- Re-attendance is treated as a new Work Order.

## 6. Invoice Rules
- Invoices before Thursday 12:00pm -> Paid Friday same week.
- Invoices after Thursday 12:00pm -> Paid following Friday.
