import { ID } from 'appwrite';
import { databases, appwriteConfig } from './appwrite';

export async function generateInvoiceLine(input: {
  workOrder: any;
}) {
  const wo = input.workOrder;
  const date = new Date();
  const lineNumber = `INV-${date.getFullYear()}${date.getMonth() + 1}-${ID.unique().substring(0, 5).toUpperCase()}`;

  // Payment cycle logic: Thursday 12pm cutoff
  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setDate(now.getDate() + (4 - now.getDay() + 7) % 7); // Upcoming Thursday
  cutoff.setHours(12, 0, 0, 0);

  const paymentDate = new Date(cutoff);
  if (now > cutoff) {
    paymentDate.setDate(cutoff.getDate() + 8); // Following Friday
  } else {
    paymentDate.setDate(cutoff.getDate() + 1); // Upcoming Friday
  }

  const data = {
    lineNumber,
    clientId: wo.clientId,
    workOrderId: wo.$id,
    serviceType: wo.serviceType,
    description: `Service: ${wo.serviceType.replace(/_/g, ' ')} at ${wo.propertyAddress}`,
    propertyAddress: wo.propertyAddress,
    region: wo.region,
    pricingClassification: wo.pricingClassification,
    quantity: 1,
    unitPriceExGst: wo.basePriceExGst,
    subtotalExGst: wo.totalPriceExGst,
    gstAmount: wo.gstAmount,
    totalIncGst: wo.totalPriceIncGst,
    lineStatus: 'pending',
    paymentCycleDate: paymentDate.toISOString(),
    createdAt: new Date().toISOString(),
  };

  return await databases.createDocument(
    appwriteConfig.databaseId!,
    appwriteConfig.invoiceLinesCollectionId!,
    ID.unique(),
    data
  );
}
