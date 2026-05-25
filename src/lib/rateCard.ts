// TODO(security): Move sensitive pricing/status/fee mutations behind Appwrite Functions with server-side authorization checks.
import { PricingClassification, RentOnTimeServiceType } from '../types/workOrders';
import { databases, appwriteConfig } from './appwrite';
import { Query } from 'appwrite';

export const GST_RATE = 0.10;

export async function calculateWorkOrderPricing(input: {
  clientId: string;
  serviceType: RentOnTimeServiceType;
  pricingClassification: PricingClassification;
  urgentFlag?: boolean;
  outsideServiceArea?: boolean;
  accessIssue?: boolean;
  approvedExpensesExGst?: number;
}): Promise<{
  basePriceExGst: number;
  travelSurchargeExGst: number;
  accessIssueFeeExGst: number;
  approvedExpensesExGst: number;
  gstAmount: number;
  totalPriceExGst: number;
  totalPriceIncGst: number;
  requiresQuote: boolean;
  pricingNotes: string[];
}> {
  const pricingNotes: string[] = [];
  let basePriceExGst = 0;
  let requiresQuote = false;

  if (input.outsideServiceArea || input.pricingClassification === 'outside_service_area') {
    requiresQuote = true;
    pricingNotes.push('Property is outside the standard service area.');
  }

  if (input.serviceType === 'customised_solution') {
    requiresQuote = true;
    pricingNotes.push('Customised solutions require a manual quote.');
  }

  if (input.urgentFlag) {
    requiresQuote = true;
    pricingNotes.push('Urgent work requires admin review and may incur additional fees.');
  }

  if (!requiresQuote) {
    try {
      // 1. Try to find client-specific rate card first (simplified for MVP: just use a default Rent On Time rate card if client card not found)
      // For this implementation, we'll look for a rate card item that matches the service and classification.
      // In a full implementation, we'd resolve the RateCardId for the client first.

      const response = await databases.listDocuments(
        appwriteConfig.databaseId!,
        appwriteConfig.rateCardItemsCollectionId!,
        [
          Query.equal('serviceType', input.serviceType),
          Query.equal('pricingClassification', input.pricingClassification),
          Query.equal('active', true),
          Query.limit(1)
        ]
      );

      if (response.documents.length > 0) {
        const item = response.documents[0];
        basePriceExGst = item.priceExGst;
        if (item.requiresQuote) {
          requiresQuote = true;
          pricingNotes.push('Service item is marked as quote required.');
        }
        if (item.includedUnlessOtherwiseAgreed && basePriceExGst === 0) {
          pricingNotes.push('Service is included in base agreement.');
        }
      } else {
        requiresQuote = true;
        pricingNotes.push('No rate card found for this service and region.');
      }
    } catch (error) {
      console.error('Error fetching rate card:', error);
      requiresQuote = true;
      pricingNotes.push('Error calculating pricing.');
    }
  }

  let accessIssueFeeExGst = 0;
  if (input.accessIssue) {
    accessIssueFeeExGst = basePriceExGst * 0.20;
    pricingNotes.push('Access issue fee applied (20% of base fee).');
  }

  const approvedExpensesExGst = input.approvedExpensesExGst || 0;
  const travelSurchargeExGst = 0; // Rent On Time uses regional base rates, not a flat surcharge

  const totalPriceExGst = basePriceExGst + travelSurchargeExGst + accessIssueFeeExGst + approvedExpensesExGst;
  const gstAmount = totalPriceExGst * GST_RATE;
  const totalPriceIncGst = totalPriceExGst + gstAmount;

  return {
    basePriceExGst,
    travelSurchargeExGst,
    accessIssueFeeExGst,
    approvedExpensesExGst,
    gstAmount,
    totalPriceExGst,
    totalPriceIncGst,
    requiresQuote,
    pricingNotes,
  };
}
