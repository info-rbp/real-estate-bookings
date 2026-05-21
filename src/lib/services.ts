import { Query } from 'appwrite'
import { appwriteConfig, databases, isAppwriteConfigured } from './appwrite'
import type { Service } from '../types/database'

function requireServicesCollection() {
  if (!isAppwriteConfigured || !appwriteConfig.databaseId || !appwriteConfig.servicesCollectionId) {
    throw new Error('Services Appwrite collection is not configured.')
  }
}

function toNumber(value: unknown, fallback = 0) {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue : fallback
}

function toBoolean(value: unknown, fallback = false) {
  return typeof value === 'boolean' ? value : fallback
}

function toPriceType(value: unknown): Service['price_type'] {
  return value === 'hourly' || value === 'quote' || value === 'fixed' ? value : 'fixed'
}

function mapService(document: Record<string, unknown>): Service {
  return {
    id: String(document.$id || document.id || ''),
    name: String(document.name || ''),
    description: String(document.description || ''),
    price: toNumber(document.defaultPriceExGst ?? document.price),
    price_type: toPriceType(document.priceType ?? document.price_type),
    duration_minutes: toNumber(document.durationMinutes ?? document.duration_minutes, 60),
    icon_name: String(document.iconName || document.icon_name || 'assignment'),
    category: String(document.category || 'Inspections'),
    is_active: toBoolean(document.active ?? document.is_active, true),
    created_at: String(document.$createdAt || document.created_at || new Date().toISOString()),
  }
}

export async function listActiveServices() {
  requireServicesCollection()

  const response = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.servicesCollectionId,
    [Query.equal('active', true), Query.orderAsc('category'), Query.orderAsc('name')]
  )

  return response.documents.map((document) => mapService(document as unknown as Record<string, unknown>))
}
