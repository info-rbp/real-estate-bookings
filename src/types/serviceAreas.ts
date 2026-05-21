import { PricingClassification } from './workOrders';

export interface ServiceAreaEntry {
  $id: string;
  region: string;
  suburb: string;
  postcode: string;
  pricingClassification: PricingClassification;
  active: boolean;
  source?: string;
  createdAt: string;
  updatedAt: string;
}

export type Region =
  | 'Perth and Peel'
  | 'Gascoyne'
  | 'Goldfields-Esperance'
  | 'Great Southern'
  | 'Kimberley'
  | 'Mid West'
  | 'Pilbara'
  | 'South West'
  | 'Wheatbelt';
