# fetch-calendar-availability Appwrite Function

Returns available appointment slots for scheduling.

## Function ID

Use `fetch-calendar-availability` in Appwrite so it matches `VITE_APPWRITE_FUNCTION_FETCH_CALENDAR_AVAILABILITY_ID`.

## Payload contract

```json
{
  "staffId": "optional-staff-id",
  "dateFrom": "2026-06-01",
  "dateTo": "2026-06-07",
  "timezone": "Australia/Perth"
}
```

## Current behaviour

The Google Calendar integration is intentionally not wired yet. When calendar credentials are not configured, the function returns:

```json
{
  "slots": [],
  "integrationConfigured": false,
  "message": "Calendar availability is not configured yet."
}
```

It should not throw unhandled errors to the frontend.

## Future Google Calendar requirements

- OAuth client ID and secret.
- Staff calendar connection storage.
- Token refresh handling.
- Free/busy query implementation.
- Slot calculation rules for service duration, timezone, business hours, travel buffers, and blocked dates.

Deploy with the Appwrite CLI or VS Code Appwrite extension as a Node.js function with `src/main.js` as the entrypoint.
