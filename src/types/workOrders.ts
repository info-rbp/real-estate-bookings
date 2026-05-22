export type WorkOrderStatus =
  | 'draft'
  | 'submitted'
  | 'pending_acceptance'
  | 'requires_information'
  | 'quote_required'
  | 'awaiting_batch'
  | 'accepted'
  | 'declined'
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'report_delivered'
  | 'invoiced'
  | 'paid'
  | 'cancelled'
  | 'access_issue'
  | 'reattendance_required'
  | 'failed';

export type BookProServiceType =
  | 'property_condition_report'
  | 'exit_inspection'
  | 'routine_inspection'
  | 'open_for_inspection'
  | 'key_installation'
  | 'insurance_claims_management'
  | 'maintenance_requests'
  | 'tenant_dispute_management'
  | 'referral'
  | 'customised_solution';

export type PricingClassification =
  | 'perth_peel'
  | 'other_region'
  | 'outside_service_area';

export interface WorkOrderContact {
  name: string;
  phone: string;
  email: string;
  company?: string;
  notes?: string;
  contactType: 'tenant' | 'occupant' | 'landlord' | 'strata' | 'contractor' | 'property_manager' | 'other';
}

export interface WorkOrderAccessDetails {
  accessMethod: string;
  accessInstructions?: string;
  lockboxCode?: string;
  alarmDetails?: string;
  gateAccess?: string;
  parkingDetails?: string;
  keyCollectionDetails?: string;
}

export interface WorkOrderSafetyDetails {
  knownSafetyRisks?: string;
  animalsAtProperty?: string;
  hazards?: string;
  accessLimitations?: string;
  sensitiveCircumstances?: string;
}

export interface WorkOrderReportingRequirements {
  requiredTemplate?: string;
  requiredSystem?: string;
  uploadDestination?: string;
  specificPhotosRequired?: string;
  specificNotesRequired?: string;
  specificQuestionsRequired?: string;
  reportingRequirements?: string;
}

export interface WorkOrderPricing {
  basePriceExGst: number;
  travelSurchargeExGst: number;
  accessIssueFeeExGst: number;
  otherApprovedExpensesExGst: number;
  gstAmount: number;
  totalPriceExGst: number;
  totalPriceIncGst: number;
}

export interface WorkOrder {
  $id: string;
  workOrderNumber: string;
  appwriteUserId: string;
  clientId: string;
  serviceId: string;
  serviceType: BookProServiceType;
  propertyAddress: string;
  propertySuburb: string;
  propertyPostcode: string;
  propertyState: string;
  region: string | null;
  pricingClassification: PricingClassification;
  serviceAreaMatched: boolean;
  outsideServiceArea: boolean;
  requestedAttendanceDate: string;
  requestedAttendanceWindowStart?: string;
  requestedAttendanceWindowEnd?: string;
  status: WorkOrderStatus;
  acceptanceStatus: 'pending' | 'accepted' | 'declined';
  hasLegalAuthority: boolean;
  authorityConfirmedBy: string;
  authorityConfirmedAt: string;
  requiresQuote: boolean;
  urgentFlag: boolean;
  regionalBatchId?: string;
  assignedStaffId?: string;
  pricing: WorkOrderPricing;
  createdAt: string;
  updatedAt: string;
}

export interface WorkOrderStatusHistoryEntry {
  $id: string;
  workOrderId: string;
  fromStatus: WorkOrderStatus;
  toStatus: WorkOrderStatus;
  actorId: string;
  actorRole: string;
  reason?: string;
  createdAt: string;
}
