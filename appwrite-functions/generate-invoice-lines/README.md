# generate-invoice-lines Appwrite Function

Creates invoice-line records for eligible completed work orders.

## Function ID

Use `generate-invoice-lines` in Appwrite so it matches `VITE_APPWRITE_FUNCTION_GENERATE_INVOICE_LINES_ID`.

## Required environment variables

- `APPWRITE_FUNCTION_ENDPOINT`
- `APPWRITE_FUNCTION_PROJECT_ID`
- `APPWRITE_FUNCTION_API_KEY`
- `APPWRITE_DATABASE_ID`
- `APPWRITE_BOOKINGS_COLLECTION_ID` or `VITE_APPWRITE_BOOKINGS_COLLECTION_ID`
- `APPWRITE_INVOICE_LINES_COLLECTION_ID` or `VITE_APPWRITE_INVOICE_LINES_COLLECTION_ID`
- `APPWRITE_AUDIT_LOGS_COLLECTION_ID` or `VITE_APPWRITE_AUDIT_LOGS_COLLECTION_ID`

## Payload contract

Generate for all clients:

```json
{
  "scope": "all",
  "paymentCycleDate": "2026-06-05"
}
```

Generate for one client:

```json
{
  "scope": "client",
  "clientId": "client-id",
  "paymentCycleDate": "2026-06-05"
}
```

The function validates `scope` and `paymentCycleDate`, does not trust client-supplied roles or totals, and reads invoice totals from stored work orders.

## Deployment

Deploy with the Appwrite CLI or VS Code Appwrite extension as a Node.js function with `src/main.js` as the entrypoint.
