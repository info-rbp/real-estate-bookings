# Service Areas

The app determines whether an address is inside the service area by looking for an exact `suburb` and `postcode` match in the Appwrite `serviceAreas` collection.

Street address is currently ignored. Only suburb, postcode, and active status affect the service area lookup.

## Matching Rules

- `suburb` must be uppercase in Appwrite.
- `postcode` must match exactly.
- `active` must be `true`.
- If no match is found, the app treats the address as `outside_service_area`.

## Pricing Classification Values

- `perth_peel`
- `other_region`
- `outside_service_area`

## Import Service Areas

Import the repository CSV into Appwrite:

```bash
npm run service-areas:import
```

The import reads `data/service-areas.csv`, normalises suburbs and postcodes, then creates or updates records by exact suburb and postcode.

## Check A Service Area

Check a specific suburb and postcode:

```bash
npm run service-areas:check -- ASHBY 6065
```
