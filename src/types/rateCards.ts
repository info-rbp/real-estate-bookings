import { PricingClassification, BookProServiceType } from './workOrders';

export interface RateCard {
  $id: string;
  clientId: string;
  name: string;
  status: 'draft' | 'active' | 'expired';
  effectiveFrom: string;
  effectiveUntil?: string;
  gstRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface RateCardItem {
  $id: string;
  rateCardId: string;
  serviceType: BookProServiceType;
  pricingClassification: PricingClassification;
  priceExGst: number;
  priceType: 'fixed' | 'hourly' | 'quote';
  requiresQuote: boolean;
  includedUnlessOtherwiseAgreed: boolean;
  active: boolean;
}
