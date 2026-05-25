# Services and Pricing

Visible booking services are stored in the Appwrite `services` collection. The booking flow reads active service documents from this collection, so the document ID must match the corresponding `RentOnTimeServiceType` value used by work orders.

The `services.description` field stores the service scope summary shown to users. Base prices are stored on each service as `defaultPriceExGst` and are displayed as ex GST prices in the booking flow.

Runtime pricing resolves in this order:

1. `clientPricing` for an active client-specific record matching `clientId` and `serviceId`.
2. `rateCardItems` for the matching `serviceType`, `pricingClassification`, and `active=true`.

Premium customers are represented by client-specific records in `clientPricing`. Those records set `customPriceExGst`, `billingType=fixed`, `gstRate=0.1`, `travelIncluded=true`, and `status=active`.

Import and check commands:

```bash
npm run services:import
npm run premium-pricing:apply -- CLIENT_ID
npm run services:check
npm run services:check -- CLIENT_ID
```
