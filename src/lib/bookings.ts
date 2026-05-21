import { ID } from 'appwrite'
import { appwriteConfig, databases, isAppwriteConfigured } from './appwrite'
import type { AppProfile } from '../hooks/useAuth'
import type { Booking, Service } from '../types/database'

export interface BookingInput {
  profile: AppProfile
  service: Service
  propertyAddress: string
  propertyCity: string
  propertyPostalCode: string
  propertyType: Booking['property_type']
  accessMethod: Booking['access_method']
  accessInstructions: string
  bookingDate: string
  bookingTime: string
  durationMinutes: number
  basePrice: number
  travelSurcharge: number
  totalPrice: number
}

function requireBookingsCollection() {
  if (!isAppwriteConfigured || !appwriteConfig.databaseId || !appwriteConfig.bookingsCollectionId) {
    throw new Error('Bookings Appwrite collection is not configured.')
  }
}

export async function createBooking(input: BookingInput) {
  requireBookingsCollection()

  const scheduledStart = new Date(`${input.bookingDate}T${input.bookingTime}:00`)
  const scheduledEnd = new Date(scheduledStart.getTime() + input.durationMinutes * 60 * 1000)

  return databases.createDocument(
    appwriteConfig.databaseId,
    appwriteConfig.bookingsCollectionId,
    ID.unique(),
    {
      appwriteUserId: input.profile.appwriteUserId,
      clientId: input.profile.clientId,
      serviceId: input.service.id,
      propertyId: null,
      propertyAddress: input.propertyAddress.trim(),
      propertyCity: input.propertyCity.trim(),
      propertyPostcode: input.propertyPostalCode.trim(),
      propertyType: input.propertyType,
      accessMethod: input.accessMethod,
      accessInstructions: input.accessInstructions.trim() || null,
      scheduledStart: scheduledStart.toISOString(),
      scheduledEnd: scheduledEnd.toISOString(),
      durationMinutes: input.durationMinutes,
      status: 'pending',
      paymentStatus: input.totalPrice > 0 ? 'unpaid' : 'not_required',
      basePriceExGst: input.basePrice,
      travelSurchargeExGst: input.travelSurcharge,
      totalPriceExGst: input.totalPrice,
      notes: null,
      createdAt: new Date().toISOString(),
    }
  )
}
