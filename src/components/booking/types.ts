import type { PricingClassification, WorkOrderContact } from '../../types/workOrders'

export type BookingDetails = Record<string, string | boolean | number | null | undefined>

export interface OfiProperty {
  propertyAddress: string
  propertySuburb: string
  propertyPostcode: string
  listingUrl?: string
  preferredOpenDate?: string
  preferredOpenStartTime?: string
  preferredOpenDurationMinutes?: number | ''
  accessMethod: string
  accessInstructions: string
  lockboxCode?: string
  keyCollectionDetails?: string
  parkingDetails?: string
  tenantOccupied?: boolean
  tenantContactName?: string
  tenantContactPhone?: string
  notes?: string
}

export interface SharedBookingState {
  propertyAddress: string
  propertySuburb: string
  propertyPostcode: string
  propertyType: 'apartment' | 'house' | 'townhouse' | 'commercial' | 'other'
  region: string | null
  pricingClassification: PricingClassification
  serviceAreaMatched: boolean
  accessMethod: string
  accessInstructions: string
  lockboxCode: string
  keyCollectionDetails: string
  parkingDetails: string
  requestedDate: string
  requestedWindowStart: string
  requestedWindowEnd: string
  calendarEventStart: string
  calendarEventEnd: string
  bookerNotes: string
  hasLegalAuthority: boolean
  contacts: WorkOrderContact[]
}

export type UpdateSharedBookingState = <K extends keyof SharedBookingState>(key: K, value: SharedBookingState[K]) => void
export type UpdateDetails = (key: string, value: string | boolean | number | null | undefined) => void
