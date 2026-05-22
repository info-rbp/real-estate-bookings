# BookPro Work Order Appwrite schema and permissions plan

Status: Upgraded for Work Order platform compliance.

This document intentionally stops before Stripe and SEO work. Those are blocked until auth, permissions, leads, and booking persistence pass typecheck, build, and manual staging verification.

## Platform assumptions

- The frontend currently uses the Appwrite Web SDK `Databases` client and the existing codebase naming uses `collection` and `document` terminology. Newer Appwrite documentation increasingly uses `table` and `row` language. In this plan, collection/table and document/row mean the same deployment object for implementation purposes.
- Appwrite permissions must be deny-by-default. Appwrite documentation states that no permissions are granted by default, so every collection/table and row/document needs explicit permissions before it can be accessed.
- Use Appwrite Auth for identity and Appwrite Teams for role grouping. Use Teams for `platform-admin`, `staff`, and per-client teams such as `client:{clientId}:admin` and `client:{clientId}:user`.
- Turn on row/document security for private operational collections. Public collections must expose only read-only published content, or create-only form entry points.
- Role, client assignment, `appwriteUserId`, status, and other admin-sensitive profile fields are not frontend-editable. They are managed through the Appwrite Console or an admin-only Appwrite Function.

References:

- Appwrite permissions: https://appwrite.io/docs/advanced/platform/permissions
- Appwrite databases: https://appwrite.io/docs/products/databases
- Appwrite functions executions: https://appwrite.io/docs/products/functions/executions

## Teams and roles

| Team or role | Purpose |
| --- | --- |
| `platform-admin` | Full platform operations. Owns schema, users, clients, pricing, payments, audit review, and support escalation. |
| `staff` | Internal operators who may see assigned work and update operational booking states. |
| `client:{clientId}:admin` | Client-side admin users for an agency, landlord, or property operator. |
| `client:{clientId}:user` | Standard client users who can create bookings and view authorised client records. |
| `guest` | Public anonymous visitor. Can read published marketing/property content and create leads/check-ins only through controlled create flows. |

## Collection plan

### users

Purpose: Application profile linked to Appwrite Auth user.

Key fields:

- `appwriteUserId` string, required, unique
- `clientId` string, nullable
- `full_name` string, required
- `email` email/string, required
- `phone` string, nullable
- `timezone` string, required, default `Australia/Perth`
- `email_notifications` boolean, default true
- `sms_notifications` boolean, default false
- `avatar_url` string/url, nullable
- `role` enum: `pending`, `client_user`, `client_admin`, `staff`, `admin`
- `status` enum: `pending`, `invited`, `active`, `disabled`
- `createdAt`, `updatedAt`

Permissions:

- No public access.
- User can read own profile row only.
- User cannot update own row directly.
- Profile edits go through `profile-update` function and are restricted to `full_name`, `phone`, `timezone`, `email_notifications`, `sms_notifications`, and `avatar_url`.
- `role`, `clientId`, `appwriteUserId`, `status`, email identity changes, and staff/admin flags are admin-only.
- Platform admin can read/update/delete all rows.

Indexes:

- unique `appwriteUserId`
- `clientId`
- `email`
- `role`
- `status`

### clients

Purpose: Agencies, landlords, property managers, leasing teams, and other BookPro customer accounts.

Key fields:

- `name`, `clientType`, `abn`, `billingEmail`, `phone`
- `addressLine1`, `addressLine2`, `suburb`, `state`, `postcode`, `country`
- `status` enum: `prospect`, `active`, `paused`, `disabled`
- `stripeCustomerId` nullable placeholder, not wired until Stripe phase
- `defaultPricingProfileId` nullable
- `createdAt`, `updatedAt`

Permissions:

- No public access.
- Platform admin full access.
- Client admin/user can read their own client row through row permissions for the relevant client team.
- Client-side edits should go through an admin-reviewed or client-admin function, not direct unrestricted row updates.

Indexes: `status`, `clientType`, `billingEmail`.

### services

Purpose: Bookable service catalogue.

Key fields:

- `name`, `slug`, `category`, `description`
- `defaultPriceExGst` number
- `durationMinutes` integer
- `priceType` enum: `fixed`, `hourly`, `quote`
- `active` boolean
- `sortOrder` integer
- `createdAt`, `updatedAt`

Permissions:

- Public/authenticated read is allowed for active services only through query filtering in the frontend and published seed data.
- Platform admin can create/update/delete.
- Staff can read.
- No client-side direct writes.

Indexes: `active`, `slug`, `category`, `sortOrder`.

### clientPricing

Purpose: Client-specific pricing overrides.

Key fields:

- `clientId`, `serviceId`
- `customPriceExGst`, `billingType`, `gstRate`
- `travelIncluded` boolean
- `activeFrom`, `activeUntil`
- `status` enum: `draft`, `active`, `expired`, `disabled`

Permissions:

- No public access.
- Client teams can read their own active pricing rows.
- Platform admin full access.
- Updates are admin-only until pricing admin UI is implemented.

Indexes: compound `clientId/serviceId`, `status`, `activeFrom`, `activeUntil`.

### bookings / workOrders

Purpose: Persistent Work Order requests and operational lifecycle. Using `bookings` collection name for compatibility.

Key fields:

- `workOrderNumber` string
- `appwriteUserId`, `clientId`, `serviceId`, `propertyId`
- `propertyAddress`, `propertySuburb`, `propertyPostcode`, `propertyState`, `propertyType`
- `region`, `pricingClassification`, `serviceAreaMatched`
- `accessMethod`, `accessInstructions`, `lockboxCode`, `alarmDetails`, `gateAccess`, `parkingDetails`
- `hasLegalAuthority` boolean, `authorityConfirmedBy`, `authorityConfirmedAt`
- `knownSafetyRisks`, `animalsAtProperty`, `hazards`, `accessLimitations`, `sensitiveCircumstances`
- `requiredTemplate`, `requiredSystem`, `uploadDestination`, `specificPhotosRequired`
- `scheduledStart`, `scheduledEnd`, `durationMinutes`
- `status` (WorkOrderStatus), `acceptanceStatus`, `acceptedAt`, `acceptedBy`
- `requiresQuote`, `urgentFlag`, `regionalBatchId`
- `basePriceExGst`, `travelSurchargeExGst`, `accessIssueFeeExGst`, `gstAmount`, `totalPriceIncGst`
- `paymentStatus`, `invoiceStatus`, `invoiceBatchId`
- `assignedStaffId`, `notes`, `createdAt`, `updatedAt`

Permissions:

- No public access.
- Client team can read bookings for its own `clientId`.
- Client users create through `create-work-order` function.
- Staff can read assigned bookings and update through `update-work-order-status` function.
- Platform admin full access.

Indexes: `workOrderNumber`, `clientId`, `appwriteUserId`, `status`, `regionalBatchId`, `invoiceBatchId`.

### properties

Purpose: Rental and inspection properties.

Key fields:

- `clientId`, `slug`, `address`, `suburb`, `state`, `postcode`
- `weeklyRent`, `bond`, `bedrooms`, `bathrooms`, `carSpaces`, `features`
- `status` enum: `draft`, `published`, `leased`, `archived`
- `availableDate`, `heroImageUrl`, `seoTitle`, `seoDescription`, `createdAt`, `updatedAt`

Permissions:

- Guest/public read only for published rows.
- Client team read for its own draft and published properties.
- Platform admin full access.
- Client/admin writes should be function-mediated or admin UI controlled.

Indexes: `clientId`, `slug`, `status`, `suburb`, `postcode`.

### leads

Purpose: Public consultation and service enquiries from Engage Us.

Key fields:

- `firstName`, `lastName`, `agencyName`, `email`, `phone`, `message`
- `source`, `status` enum: `new`, `contacted`, `qualified`, `closed`
- `notificationStatus` enum: `pending`, `sent`, `failed`
- `assignedTo`, `createdAt`, `updatedAt`

Permissions:

- Guest/public create only.
- No guest/public read/update/delete.
- Platform admin read/update/delete.
- Optional improvement: move lead creation behind a function with CAPTCHA/rate limiting before production traffic.

Indexes: `email`, `status`, `source`, `createdAt`.

### openInspections

Purpose: Open-for-inspection sessions attached to published properties.

Key fields:

- `propertyId`, `clientId`
- `startDateTime`, `endDateTime`, `attendeeCap`
- `status` enum: `draft`, `scheduled`, `open`, `closed`, `cancelled`
- `checkInEnabled`, `qrCodeUrl`, `createdAt`, `updatedAt`

Permissions:

- Guest/public read for scheduled/open inspections attached to published properties.
- Guest/public no writes.
- Client team read own inspections.
- Client admin and platform admin create/update through admin UI/function.

Indexes: `propertyId`, `clientId`, `status`, `startDateTime`.

### inspectionCheckIns

Purpose: QR/link-based attendee check-ins for open inspections.

Key fields:

- `inspectionId`, `propertyId`, `clientId`
- `firstName`, `lastName`, `email`, `phone`
- `consentToContact`, `privacyAccepted`, `checkedInAt`
- `source`, `duplicateKey`, `createdAt`

Permissions:

- Guest/public create only while inspection is open. Production should prefer a function so the function can verify inspection status, cap, duplicate key, and consent fields before writing.
- No guest/public read/update/delete.
- Client team and platform admin can read attendee rows for their own inspections.

Indexes: `inspectionId`, `clientId`, `email`, `duplicateKey`, `checkedInAt`.

### payments

Purpose: Payment state synced from Stripe later. Placeholder only until Stripe phase.

Key fields:

- `clientId`, `bookingId`
- `stripePaymentIntentId`, `stripeInvoiceId`
- `amountIncGst`, `currency`, `status`
- `createdAt`, `updatedAt`

Permissions:

- No public access.
- No client writes.
- Platform admin and Stripe webhook function write.
- Client team can read its own payment summaries if needed.

Indexes: `clientId`, `bookingId`, `status`, `stripePaymentIntentId`, `stripeInvoiceId`.

### subscriptions

Purpose: Client subscription billing state synced from Stripe later. Placeholder only until Stripe phase.

Key fields:

- `clientId`, `stripeSubscriptionId`, `billingMode`
- `unitPriceExGst`, `quantity`, `status`
- `currentPeriodStart`, `currentPeriodEnd`, `cancelAtPeriodEnd`
- `createdAt`, `updatedAt`

Permissions:

- No public access.
- No client writes.
- Platform admin and Stripe webhook function write.
- Client team can read its own subscription summary.

Indexes: `clientId`, `stripeSubscriptionId`, `status`.

### auditLogs

Purpose: Security and operational audit history.

Key fields:

- `actorId`, `actorRole`, `clientId`
- `action`, `entityType`, `entityId`
- `metadata` JSON string
- `ipAddress`, `userAgent`, `createdAt`

Permissions:

- No public access.
- No client writes.
- Platform admin read/write.
- Every Appwrite Function must write audit logs for sensitive actions.

Indexes: `actorId`, `clientId`, `entityType`, `entityId`, `action`, `createdAt`.

### serviceAreas

Fields: `region`, `suburb`, `postcode`, `pricingClassification`, `active`.

### workOrderStatusHistory

Fields: `workOrderId`, `fromStatus`, `toStatus`, `actorId`, `reason`, `createdAt`.

### accessIssues

Fields: `workOrderId`, `issueType`, `description`, `feeExGst`, `reattendanceRequired`, `reattendanceWorkOrderId`.

### regionalBatches

Fields: `batchNumber`, `region`, `status`, `workOrderIds`, `targetAttendanceStart`.

### openInspectionPlans

Fields: `planNumber`, `weekCommencing`, `status`, `workOrderIds`.

### invoiceLines

Fields: `clientId`, `workOrderId`, `description`, `subtotalExGst`, `gstAmount`, `totalIncGst`, `paymentCycleDate`.

## Function/process plan

### profile-update function

Purpose: Accept safe profile edits from the current authenticated user.

Allowed request fields:

- `full_name`
- `phone`
- `timezone`
- `email_notifications`
- `sms_notifications`
- `avatar_url`

Denied fields, even if provided:

- `role`
- `clientId`
- `appwriteUserId`
- `email`
- `status`
- `two_factor_enabled`
- any admin/staff assignment or billing fields

Process:

1. Read authenticated Appwrite user ID from the function execution context.
2. Parse request JSON.
3. Whitelist safe editable fields only.
4. Update the `users` row matching the authenticated user.
5. Write an `auditLogs` row.
6. Return the updated safe profile.

### role and client assignment

Current launch-safe process:

1. Create Auth user through Appwrite Auth or invite flow.
2. Create/update the corresponding `users` profile row in the Appwrite Console.
3. Assign `role`, `clientId`, and status in the Appwrite Console.
4. Add user to the matching Appwrite Team.
5. Record assignment in `auditLogs`.

Optional later function:

- `admin-user-assignment` callable only by `platform-admin`.
- It may set `role`, `clientId`, `status`, and team membership.
- It must reject non-admin callers and write an audit log for every assignment.

### create-booking function

The frontend now persists bookings directly for P0 staging progress. Before production, move booking creation into a server-side function so the client cannot spoof `clientId`, prices, booking status, payment status, or assigned staff.

The function should:

1. Read authenticated user.
2. Load profile by `appwriteUserId`.
3. Reject missing, pending, disabled, or unassigned profiles.
4. Load active service.
5. Resolve price from `clientPricing` and default service price.
6. Write booking with server-derived `clientId`, price, status, payment status, and audit log.

## Provisioning sequence

1. Create Appwrite staging project and database.
2. Create teams: `platform-admin`, `staff`, and one test client team pair.
3. Create collections and attributes in the order listed above.
4. Create indexes before connecting high-volume screens.
5. Enable row/document security for private collections.
6. Apply collection-level create/read permissions conservatively.
7. Seed services and one test client.
8. Create one admin profile, one staff profile, and one client profile.
9. Deploy `profile-update` function.
10. Test signup/login/session restore/profile read/profile safe update.
11. Test denied direct profile update attempts for `role`, `clientId`, and `appwriteUserId`.
12. Test Engage Us lead creation as guest and verify guest cannot read leads.
13. Test service loading and booking creation as assigned client user.
14. Test Client A cannot read Client B records.

## P0 manual verification checklist

- `npm install`
- `npm run typecheck`
- `npm run build`
- Register/login/logout/session restore.
- Pending user cannot access dashboard/admin routes.
- Assigned client user can load active services.
- Assigned client user can create a booking.
- Booking persists after refresh.
- Public visitor can submit Engage Us form.
- Public visitor cannot list leads.
- Direct browser/SDK attempt to update `role`, `clientId`, or `appwriteUserId` is denied.
- Admin Console role/client assignment works and is reflected after user refresh.
