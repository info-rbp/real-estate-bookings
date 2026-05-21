export interface InvoiceLine {
  $id: string;
  lineNumber: string;
  clientId: string;
  workOrderId: string;
  serviceType: string;
  description: string;
  propertyAddress: string;
  region: string;
  pricingClassification: string;
  quantity: number;
  unitPriceExGst: number;
  subtotalExGst: number;
  gstAmount: number;
  totalIncGst: number;
  lineStatus: 'pending' | 'invoiced' | 'paid' | 'cancelled' | 'disputed';
  invoiceBatchId?: string;
  paymentCycleDate?: string;
  exportedAt?: string;
  createdAt: string;
}
