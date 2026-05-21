# profile-update Appwrite Function

This function is the only supported self-service profile update path for authenticated users.

## Allowed fields

The function accepts and persists only these fields:

- `full_name`
- `phone`
- `timezone`
- `email_notifications`
- `sms_notifications`
- `avatar_url`

## Explicitly denied fields

These fields are ignored and logged if present in the request body:

- `role`
- `clientId`
- `appwriteUserId`
- `status`
- `email`
- `two_factor_enabled`

Role, client assignment, identity fields, status, and admin-sensitive profile fields must be managed through Appwrite Console or an admin-only assignment function.

## Runtime

- Runtime: Node.js
- Entrypoint: `src/main.js`
- Dependency: `node-appwrite`

## Required environment variables

- `APPWRITE_ENDPOINT`
- `APPWRITE_PROJECT_ID`
- `APPWRITE_API_KEY`
- `APPWRITE_DATABASE_ID`
- `APPWRITE_USERS_COLLECTION_ID`

Optional:

- `APPWRITE_AUDIT_LOGS_COLLECTION_ID`

## Security behaviour

1. Reads the authenticated Appwrite user ID from the Appwrite Function request headers.
2. Parses the request JSON body.
3. Drops any field not included in the safe allowlist.
4. Logs explicitly denied fields.
5. Validates safe field types.
6. Finds the profile row by document ID or `appwriteUserId`.
7. Updates only the safe fields.
8. Writes an audit log if `APPWRITE_AUDIT_LOGS_COLLECTION_ID` is configured.

## Manual test cases

Use an authenticated frontend session that calls `updateProfile`.

Expected pass:

```json
{
  "full_name": "Alex Client",
  "phone": "+61 400 000 000",
  "timezone": "Australia/Perth",
  "email_notifications": true,
  "sms_notifications": false,
  "avatar_url": null
}
```

Expected denial/ignore:

```json
{
  "role": "admin",
  "clientId": "another-client",
  "appwriteUserId": "spoofed-user",
  "status": "active",
  "email": "attacker@example.com",
  "two_factor_enabled": false
}
```

After the denial test, verify the `users` row still has its original `role`, `clientId`, `appwriteUserId`, `status`, `email`, and `two_factor_enabled` values.
