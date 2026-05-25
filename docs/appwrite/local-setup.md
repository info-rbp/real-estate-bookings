# Appwrite Local Setup

The frontend reads Appwrite configuration from `import.meta.env` in `src/lib/appwrite.ts`. Every `VITE_APPWRITE_*` variable must be present when Vite builds the app. Setting only Cloudflare Worker runtime secrets will not configure the browser bundle.

## Local env file

Create `.env.local` from `.env.example` or use the checked-out local copy. `.env.local` is ignored and must not be committed.

The known project values are:

```sh
VITE_APPWRITE_ENDPOINT=https://syd.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=69ff55980009b1cd7dbe
VITE_APPWRITE_DATABASE_ID=6a05bbdb00081175d56c
```

The local file also contains non-`VITE_` aliases for provisioning:

```sh
APPWRITE_ENDPOINT=https://syd.cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=69ff55980009b1cd7dbe
APPWRITE_DATABASE_ID=6a05bbdb00081175d56c
APPWRITE_API_KEY=
```

Paste the Appwrite API key only into `.env.local`. Do not add it to `.env.example`, Cloudflare frontend build variables, or any committed file.

## Create an Appwrite API key

In the Appwrite Console:

1. Open project `69ff55980009b1cd7dbe`.
2. Go to Overview or Project settings, then API keys.
3. Create a local provisioning key.
4. Grant only the scopes required to provision and seed the project: databases, collections, attributes, indexes, documents, storage buckets/files, functions, and teams.
5. Paste the key into `.env.local` as `APPWRITE_API_KEY`.

Delete or rotate the key when provisioning work is finished.

## Provision resources

Install dependencies first:

```sh
npm ci
```

Validate local frontend build variables:

```sh
npm run check:env:local
```

Provision the database schema and storage buckets:

```sh
npm run appwrite:provision:local
```

The script provisions the required database collections, indexes, seed service rows, and storage buckets referenced by the frontend. It keeps collection permissions conservative: public read is limited to catalogue/public-display resources, public create is limited to intake resources, and operational records are restricted to admin/staff/authenticated access.

If `APPWRITE_API_KEY` is blank, provisioning will fail with `Missing APPWRITE_API_KEY`. That is expected until a developer pastes a local-only key.

## Appwrite Functions

Function scaffolds live under `appwrite-functions/`. Deploy these with the Appwrite CLI or the VS Code Appwrite extension using matching function IDs:

- `profile-update`
- `create-work-order`
- `fetch-calendar-availability`
- `generate-invoice-lines`

Additional frontend IDs reserved for later deployment:

- `admin-user-assignment`
- `pricing`
- `stripe-checkout`
- `stripe-webhook`

Each function directory contains its own README with environment variables and payload contracts. Server-side function secrets must be configured in Appwrite Function settings, not as frontend `VITE_*` variables.

The `create-work-order` function also needs the service-specific booking side-collection IDs:

```sh
BOOKING_SERVICE_DETAILS_COLLECTION_ID=bookingServiceDetails
BOOKING_PROPERTIES_COLLECTION_ID=bookingProperties
```

## Web platforms

The Appwrite project must include these Web platforms:

- `real-estate.remotebusinesspartner.com.au`
- `localhost`

Optional preview/staging platform:

- `rbp-real-estate.delicate-dream-e4c9.workers.dev`

If the Appwrite CLI or VS Code extension is available, add these through the project platform settings. Otherwise add them manually in the Appwrite Console before testing login/signup from those hosts.

## Cloudflare production

Copy the same `VITE_APPWRITE_*` values from `.env.local` into Cloudflare production build variables, then rebuild and redeploy. The variables must exist during `npm run build`; runtime-only Worker secrets are too late for the Vite frontend bundle.
