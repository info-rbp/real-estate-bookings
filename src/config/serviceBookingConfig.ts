import type { RentOnTimeServiceType } from '../types/workOrders'

export type BookingStepId =
  | 'property'
  | 'property_condition_report_details'
  | 'routine_inspection_details'
  | 'exit_inspection_details'
  | 'access'
  | 'contacts'
  | 'calendar_booking'
  | 'notes'
  | 'review'
  | 'ofi_batch_details'
  | 'ofi_properties'
  | 'attendee_capture'
  | 'key_collection'
  | 'installation_details'
  | 'maintenance_details'
  | 'contractor_approval'
  | 'scheduling'
  | 'claim_details'
  | 'claim_scope'
  | 'stakeholders'
  | 'access_safety'
  | 'documents'

export type SupportedBookingServiceType =
  | 'property_condition_report'
  | 'routine_inspection'
  | 'exit_inspection'
  | 'open_for_inspection'
  | 'insurance_claims_management'
  | 'maintenance_requests'
  | 'key_installation'

export interface ServiceBookingConfig {
  serviceType: SupportedBookingServiceType
  label: string
  durationMinutes: number | null
  calendarRequired: boolean
  calendarRecommended: boolean
  adminSchedulingRequired: boolean
  adminReviewRecommended: boolean
  maxProperties: number
  defaultStatus: 'pending_acceptance' | 'pending_scheduling' | 'confirmed' | 'quote_required'
  steps: BookingStepId[]
  requiredFields: string[]
  optionalFields: string[]
  notesLabel: string
  validationRules: string[]
}

const defaultNotesLabel = 'Additional notes'

export const serviceBookingConfig: Record<SupportedBookingServiceType, ServiceBookingConfig> = {
  property_condition_report: {
    serviceType: 'property_condition_report',
    label: 'Property Condition Report',
    durationMinutes: 90,
    calendarRequired: true,
    calendarRecommended: false,
    adminSchedulingRequired: false,
    adminReviewRecommended: false,
    maxProperties: 1,
    defaultStatus: 'pending_acceptance',
    steps: ['property', 'property_condition_report_details', 'access', 'contacts', 'calendar_booking', 'notes', 'review'],
    requiredFields: ['propertyAddress', 'propertySuburb', 'propertyPostcode', 'propertyType', 'occupancyStatus', 'furnishedStatus', 'requiredSystem', 'requiredTemplate', 'accessMethod', 'accessInstructions', 'primaryContactName', 'primaryContactPhone', 'primaryContactEmail', 'calendarEventStart', 'calendarEventEnd', 'hasLegalAuthority'],
    optionalFields: ['uploadDestination', 'lockboxCode', 'keyCollectionDetails', 'bookerNotes'],
    notesLabel: defaultNotesLabel,
    validationRules: ['Calendar booking is required before submission.'],
  },
  routine_inspection: {
    serviceType: 'routine_inspection',
    label: 'Routine Inspection',
    durationMinutes: 30,
    calendarRequired: true,
    calendarRecommended: false,
    adminSchedulingRequired: false,
    adminReviewRecommended: false,
    maxProperties: 1,
    defaultStatus: 'pending_acceptance',
    steps: ['property', 'routine_inspection_details', 'access', 'contacts', 'calendar_booking', 'notes', 'review'],
    requiredFields: ['propertyAddress', 'propertySuburb', 'propertyPostcode', 'propertyType', 'tenantNotified', 'accessMethod', 'accessInstructions', 'calendarEventStart', 'calendarEventEnd', 'hasLegalAuthority'],
    optionalFields: ['noticeServedDate', 'tenantContactName', 'tenantContactPhone', 'tenantContactEmail', 'inspectionFocus', 'knownIssues', 'ownerFocusAreas', 'bookerNotes'],
    notesLabel: defaultNotesLabel,
    validationRules: ['Tenant notice confirmation is required.', 'Calendar booking is required before submission.'],
  },
  exit_inspection: {
    serviceType: 'exit_inspection',
    label: 'Exit Inspection',
    durationMinutes: 60,
    calendarRequired: true,
    calendarRecommended: false,
    adminSchedulingRequired: false,
    adminReviewRecommended: false,
    maxProperties: 1,
    defaultStatus: 'pending_acceptance',
    steps: ['property', 'exit_inspection_details', 'access', 'contacts', 'calendar_booking', 'notes', 'review'],
    requiredFields: ['propertyAddress', 'propertySuburb', 'propertyPostcode', 'propertyType', 'vacateDate', 'tenantPossessionStatus', 'keysReturned', 'accessMethod', 'accessInstructions', 'calendarEventStart', 'calendarEventEnd', 'hasLegalAuthority'],
    optionalFields: ['originalPcrAvailable', 'originalPcrFileId', 'originalPcrReference', 'cleaningConcerns', 'damageConcerns', 'gardenConcerns', 'missingItemsConcerns', 'bondRelatedNotes', 'bookerNotes'],
    notesLabel: defaultNotesLabel,
    validationRules: ['Calendar booking is required before submission.'],
  },
  open_for_inspection: {
    serviceType: 'open_for_inspection',
    label: 'Open For Inspection',
    durationMinutes: null,
    calendarRequired: false,
    calendarRecommended: false,
    adminSchedulingRequired: true,
    adminReviewRecommended: false,
    maxProperties: 10,
    defaultStatus: 'pending_scheduling',
    steps: ['ofi_batch_details', 'ofi_properties', 'attendee_capture', 'notes', 'review'],
    requiredFields: ['preferredInspectionDate', 'bookingContactName', 'bookingContactPhone', 'bookingContactEmail'],
    optionalFields: ['attendeeCaptureRequired', 'attendeeCaptureMethod', 'attendeeUploadDestination', 'generalInstructions', 'bookerNotes'],
    notesLabel: 'Batch notes',
    validationRules: ['At least 1 property is required.', 'No more than 10 properties are allowed.', 'Every property must include address, suburb, postcode, access method, and access instructions.', 'Admin will review scheduling and route planning.'],
  },
  key_installation: {
    serviceType: 'key_installation',
    label: 'Key Installation',
    durationMinutes: 60,
    calendarRequired: true,
    calendarRecommended: true,
    adminSchedulingRequired: false,
    adminReviewRecommended: false,
    maxProperties: 1,
    defaultStatus: 'pending_acceptance',
    steps: ['property', 'key_collection', 'installation_details', 'access', 'calendar_booking', 'notes', 'review'],
    requiredFields: ['propertyAddress', 'propertySuburb', 'propertyPostcode', 'keyCollectionAddress', 'keyCollectionSuburb', 'keyCollectionPostcode', 'keyCollectionContactName', 'keyCollectionContactPhone', 'keyCollectionContactEmail', 'keyCollectionInstructions', 'deviceType', 'deviceSuppliedBy', 'installationLocation', 'photoConfirmationRequired', 'hasLegalAuthority'],
    optionalFields: ['lockboxCode', 'installationRestrictions', 'keyReturnRequired', 'keyReturnAddress', 'accessMethod', 'accessInstructions', 'calendarEventStart', 'calendarEventEnd', 'bookerNotes'],
    notesLabel: defaultNotesLabel,
    validationRules: ['Key collection details are required.', 'Calendar booking is recommended and required for immediate confirmation.'],
  },
  maintenance_requests: {
    serviceType: 'maintenance_requests',
    label: 'Maintenance Requests',
    durationMinutes: 60,
    calendarRequired: false,
    calendarRecommended: true,
    adminSchedulingRequired: false,
    adminReviewRecommended: false,
    maxProperties: 1,
    defaultStatus: 'pending_acceptance',
    steps: ['property', 'maintenance_details', 'contractor_approval', 'access', 'scheduling', 'notes', 'review'],
    requiredFields: ['propertyAddress', 'propertySuburb', 'propertyPostcode', 'maintenanceCategory', 'issueDescription', 'urgencyLevel', 'tenantImpact', 'ownerApprovalStatus', 'accessMethod', 'accessInstructions', 'hasLegalAuthority'],
    optionalFields: ['existingPhotos', 'contractorAssigned', 'contractorName', 'contractorPhone', 'contractorEmail', 'approvedSpendLimit', 'quoteRequired', 'attendancePurpose', 'preferredDate', 'preferredWindowStart', 'preferredWindowEnd', 'bookerNotes'],
    notesLabel: defaultNotesLabel,
    validationRules: ['Urgent maintenance requires admin review copy.', 'Unapproved owner approval may delay acceptance.'],
  },
  insurance_claims_management: {
    serviceType: 'insurance_claims_management',
    label: 'Insurance Claims Management',
    durationMinutes: 60,
    calendarRequired: false,
    calendarRecommended: true,
    adminSchedulingRequired: false,
    adminReviewRecommended: true,
    maxProperties: 1,
    defaultStatus: 'pending_acceptance',
    steps: ['property', 'claim_details', 'claim_scope', 'stakeholders', 'access_safety', 'documents', 'scheduling', 'notes', 'review'],
    requiredFields: ['propertyAddress', 'propertySuburb', 'propertyPostcode', 'claimNumber', 'insurerName', 'eventType', 'eventDate', 'damageAreas', 'requiredPhotos', 'requiredObservations', 'accessMethod', 'accessInstructions', 'hasLegalAuthority'],
    optionalFields: ['policyNumber', 'claimContactName', 'claimContactPhone', 'claimContactEmail', 'lossAdjusterName', 'supportingDocuments', 'safetyRisks', 'preferredDate', 'preferredWindowStart', 'preferredWindowEnd', 'bookerNotes'],
    notesLabel: defaultNotesLabel,
    validationRules: ['Complex or incomplete claim scopes may require a quote before acceptance.'],
  },
}

export function isSupportedBookingServiceType(serviceType: string): serviceType is SupportedBookingServiceType {
  return serviceType in serviceBookingConfig
}

export function getServiceBookingConfig(serviceType: RentOnTimeServiceType | string) {
  return isSupportedBookingServiceType(serviceType) ? serviceBookingConfig[serviceType] : null
}
