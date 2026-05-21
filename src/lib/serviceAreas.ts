import { Query } from 'appwrite';
import { databases, appwriteConfig } from './appwrite';
import { PricingClassification } from '../types/workOrders';

export function normaliseSuburb(value: string): string {
  return value.trim().toUpperCase().replace(/\s+/g, ' ');
}

export function normalisePostcode(value: string): string {
  return value.trim();
}

export async function classifyServiceArea(input: {
  suburb: string;
  postcode: string;
}): Promise<{
  matched: boolean;
  region: string | null;
  pricingClassification: PricingClassification;
  serviceAreaEntryId?: string;
}> {
  const suburb = normaliseSuburb(input.suburb);
  const postcode = normalisePostcode(input.postcode);

  if (!appwriteConfig.databaseId || !appwriteConfig.serviceAreasCollectionId) {
    return {
      matched: false,
      region: null,
      pricingClassification: 'outside_service_area',
    };
  }

  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.serviceAreasCollectionId,
      [
        Query.equal('suburb', suburb),
        Query.equal('postcode', postcode),
        Query.equal('active', true),
        Query.limit(1),
      ]
    );

    if (response.documents.length > 0) {
      const entry = response.documents[0];
      return {
        matched: true,
        region: entry.region,
        pricingClassification: entry.pricingClassification as PricingClassification,
        serviceAreaEntryId: entry.$id,
      };
    }
  } catch (error) {
    console.error('Error classifying service area:', error);
  }

  return {
    matched: false,
    region: null,
    pricingClassification: 'outside_service_area',
  };
}
