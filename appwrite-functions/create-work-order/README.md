# create-work-order Appwrite Function

Creates work orders in the `bookings` collection from an authenticated frontend request.

## Function ID

Use `create-work-order` in Appwrite so it matches `VITE_APPWRITE_FUNCTION_CREATE_WORK_ORDER_ID`.

## Required environment variables

- `APPWRITE_FUNCTION_ENDPOINT`
- `APPWRITE_FUNCTION_PROJECT_ID`
- `APPWRITE_FUNCTION_API_KEY`
- `APPWRITE_DATABASE_ID`
- `VITE_APPWRITE_USERS_COLLECTION_ID` or `APPWRITE_USERS_COLLECTION_ID`
- `VITE_APPWRITE_BOOKINGS_COLLECTION_ID` or `APPWRITE_BOOKINGS_COLLECTION_ID`
- `VITE_APPWRITE_AUDIT_LOGS_COLLECTION_ID` or `APPWRITE_AUDIT_LOGS_COLLECTION_ID`
- `VITE_APPWRITE_WORK_ORDER_CONTACTS_COLLECTION_ID` or `APPWRITE_WORK_ORDER_CONTACTS_COLLECTION_ID`
- `VITE_APPWRITE_WORK_ORDER_STATUS_HISTORY_COLLECTION_ID` or `APPWRITE_WORK_ORDER_STATUS_HISTORY_COLLECTION_ID`
- `VITE_APPWRITE_RATE_CARDS_COLLECTION_ID` or `APPWRITE_RATE_CARDS_COLLECTION_ID`
- `VITE_APPWRITE_RATE_CARD_ITEMS_COLLECTION_ID` or `APPWRITE_RATE_CARD_ITEMS_COLLECTION_ID`

## Payload contract

Accepts the frontend work-order payload, including service, property, access, safety, reporting, requested attendance, and contact fields.

The function derives `appwriteUserId` from `x-appwrite-user-id`, loads the matching user profile, derives `clientId` from that profile, and ignores client-supplied protected lifecycle fields such as `status`, `paymentStatus`, `invoiceStatus`, `appwriteUserId`, and `clientId`.

Pricing is recalculated from active rate-card data when available. If no matching rate-card item exists, the function creates the work order with zero pricing or `quote_required` where applicable.

## Deployment

Deploy with the Appwrite CLI or VS Code Appwrite extension as a Node.js function with `src/main.js` as the entrypoint.
