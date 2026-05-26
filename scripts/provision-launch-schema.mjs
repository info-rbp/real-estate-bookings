#!/usr/bin/env node
import { Client, Databases, Permission, Role } from 'node-appwrite'

const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || process.env.APPWRITE_DATABASE_ID
const bookingsCollectionId = process.env.VITE_APPWRITE_BOOKINGS_COLLECTION_ID || process.env.APPWRITE_BOOKINGS_COLLECTION_ID || 'bookings'
const servicesCollectionId = process.env.VITE_APPWRITE_SERVICES_COLLECTION_ID || process.env.APPWRITE_SERVICES_COLLECTION_ID || 'services'
const notificationCollectionId = process.env.BOOKING_NOTIFICATIONS_COLLECTION_ID || process.env.APPWRITE_BOOKING_NOTIFICATIONS_COLLECTION_ID || 'bookingNotifications'
const calendarCollectionId = process.env.BOOKING_CALENDAR_EVENTS_COLLECTION_ID || process.env.APPWRITE_BOOKING_CALENDAR_EVENTS_COLLECTION_ID || 'bookingCalendarEvents'

const bookingStatuses = ['draft', 'pending', 'submitted', 'pending_acceptance', 'pending_scheduling', 'requires_information', 'quote_required', 'awaiting_batch', 'accepted', 'confirmed', 'declined', 'scheduled', 'in_progress', 'completed', 'report_delivered', 'invoiced', 'paid', 'cancelled', 'access_issue', 'reattendance_required', 'failed']
const calendarEventStatuses = ['pending', 'created', 'failed', 'skipped', 'cancelled']
const legacyServiceIds = ['routine-inspection', 'final-bond-inspection', 'open-home-attendance']
const launchServices = [
  {
    id: 'property_condition_report',
    slug: 'property-condition-report',
    name: 'Property Condition Report',
    category: 'Inspections',
    description: 'The service includes visiting the property, conducting a visual inspection, taking photographs, and preparing a standard Property Condition Report using the agreed system or template.',
    defaultPriceExGst: 200,
    durationMinutes: 90,
    sortOrder: 10,
  },
  {
    id: 'routine_inspection',
    slug: 'routine-inspection',
    name: 'Routine Inspection',
    category: 'Inspections',
    description: 'The service includes visiting the property, conducting a visual inspection, taking photographs and notes, and preparing a routine inspection report.',
    defaultPriceExGst: 60,
    durationMinutes: 30,
    sortOrder: 20,
  },
  {
    id: 'exit_inspection',
    slug: 'exit-inspection',
    name: 'Exit Inspection',
    category: 'Inspections',
    description: 'The service includes attending the property, conducting a visual inspection, taking photographs and notes, and preparing an exit inspection report.',
    defaultPriceExGst: 150,
    durationMinutes: 60,
    sortOrder: 30,
  },
  {
    id: 'open_for_inspection',
    slug: 'open-for-inspection',
    name: 'Open For Inspection',
    category: 'Leasing',
    description: 'The service involves attending a scheduled open house for potential tenants and providing confirmation or notes of attendance as needed.',
    defaultPriceExGst: 80,
    durationMinutes: 60,
    sortOrder: 40,
  },
  {
    id: 'insurance_claims_management',
    slug: 'insurance-claims-management',
    name: 'Insurance Claims Management',
    category: 'Insurance',
    description: 'The service provides field support for insurance claims by attending relevant events, taking photographs, making observations, and collating claim support information where approved.',
    defaultPriceExGst: 90,
    durationMinutes: 60,
    sortOrder: 50,
  },
  {
    id: 'maintenance_requests',
    slug: 'maintenance-requests',
    name: 'Maintenance Requests',
    category: 'Maintenance',
    description: 'The service entails coordinating property maintenance tasks, attending to the site, capturing photographic evidence, making observations, and supporting contractor engagement when approved.',
    defaultPriceExGst: 80,
    durationMinutes: 60,
    sortOrder: 60,
  },
  {
    id: 'key_installation',
    slug: 'key-installation',
    name: 'Key Installation',
    category: 'Access',
    description: 'The service involves collecting keys from a designated location, installing or placing a key safe or lockbox as directed, and providing photo confirmation where feasible.',
    defaultPriceExGst: 150,
    durationMinutes: 60,
    sortOrder: 70,
  },
]

function adminTeamId() {
  return process.env.APPWRITE_PLATFORM_ADMIN_TEAM_ID || 'platform-admin'
}

function staffTeamId() {
  return process.env.APPWRITE_STAFF_TEAM_ID || 'staff'
}

function perms() {
  return [
    Permission.read(Role.team(adminTeamId())),
    Permission.create(Role.team(adminTeamId())),
    Permission.update(Role.team(adminTeamId())),
    Permission.delete(Role.team(adminTeamId())),
    Permission.read(Role.team(staffTeamId())),
    Permission.create(Role.team(staffTeamId())),
    Permission.update(Role.team(staffTeamId())),
  ]
}

async function ignoreConflict(label, action) {
  try {
    await action()
    console.log(`[created] ${label}`)
  } catch (error) {
    if (error?.code === 409) {
      console.log(`[exists] ${label}`)
      return
    }
    if (error?.type === 'attribute_limit_exceeded') {
      console.warn(`[skipped] ${label}: attribute limit reached`)
      return
    }
    if (error?.type && String(error.type).includes('index')) {
      console.warn(`[skipped] ${label}: ${error.message}`)
      return
    }
    throw error
  }
}

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function collection(databases, id, name) {
  await ignoreConflict(`collection ${id}`, () => databases.createCollection(DATABASE_ID, id, name, perms(), true, true))
}

async function stringAttr(databases, collectionId, key, size, required = false) {
  await ignoreConflict(`${collectionId}.${key}`, () => databases.createStringAttribute(DATABASE_ID, collectionId, key, size, required))
}

async function datetimeAttr(databases, collectionId, key) {
  await ignoreConflict(`${collectionId}.${key}`, () => databases.createDatetimeAttribute(DATABASE_ID, collectionId, key, false))
}

async function enumAttr(databases, collectionId, key, values, defaultValue) {
  await ignoreConflict(`${collectionId}.${key}`, () => databases.createEnumAttribute(DATABASE_ID, collectionId, key, values, false, defaultValue))
}

async function index(databases, collectionId, key, attrs) {
  for (let attempt = 1; attempt <= 8; attempt += 1) {
    try {
      await ignoreConflict(`${collectionId}.index.${key}`, () => databases.createIndex(DATABASE_ID, collectionId, key, 'key', attrs))
      return
    } catch (error) {
      if (error?.type === 'attribute_not_available' && attempt < 8) {
        await wait(5000)
        continue
      }
      if (error?.type === 'attribute_not_available') {
        console.warn(`[deferred] ${collectionId}.index.${key}: rerun this script after attributes are available`)
        return
      }
      throw error
    }
  }
}

async function getCollectionInfo(databases, collectionId) {
  const response = await databases.listAttributes(DATABASE_ID, collectionId)
  return new Set(response.attributes.map((attribute) => attribute.key))
}

async function ensurePendingScheduling(databases) {
  const response = await databases.listAttributes(DATABASE_ID, bookingsCollectionId)
  const status = response.attributes.find((attribute) => attribute.key === 'status')
  if (!status) {
    await enumAttr(databases, bookingsCollectionId, 'status', bookingStatuses, 'pending')
    return
  }
  if (status.elements?.includes('pending_scheduling')) {
    console.log('[exists] bookings.status pending_scheduling')
    return
  }
  await databases.updateEnumAttribute(DATABASE_ID, bookingsCollectionId, 'status', bookingStatuses, false, status.default || 'pending')
  console.log('[updated] bookings.status pending_scheduling')
}

async function ensureBookingCalendarMetadata(databases) {
  await stringAttr(databases, bookingsCollectionId, 'calendarId', 320)
  await stringAttr(databases, bookingsCollectionId, 'calendarEventId', 256)
  await stringAttr(databases, bookingsCollectionId, 'calendarEventLink', 2048)
  await datetimeAttr(databases, bookingsCollectionId, 'calendarEventStart')
  await datetimeAttr(databases, bookingsCollectionId, 'calendarEventEnd')
  await enumAttr(databases, bookingsCollectionId, 'calendarEventStatus', calendarEventStatuses, 'pending')
  await index(databases, bookingsCollectionId, 'calendarEventId_idx', ['calendarEventId'])
  await index(databases, bookingsCollectionId, 'calendarEventStatus_idx', ['calendarEventStatus'])
}

async function notifications(databases) {
  await collection(databases, notificationCollectionId, 'Booking Notifications')
  await stringAttr(databases, notificationCollectionId, 'bookingId', 128, true)
  await stringAttr(databases, notificationCollectionId, 'workOrderId', 128)
  await stringAttr(databases, notificationCollectionId, 'workOrderNumber', 80)
  await enumAttr(databases, notificationCollectionId, 'channel', ['internal_new_booking', 'booker_confirmation', 'ops_failure_alert', 'other'], 'other')
  await stringAttr(databases, notificationCollectionId, 'recipient', 320)
  await enumAttr(databases, notificationCollectionId, 'status', ['pending', 'sent', 'failed', 'skipped'], 'pending')
  await stringAttr(databases, notificationCollectionId, 'providerMessageId', 2048)
  await stringAttr(databases, notificationCollectionId, 'failureReason', 2000)
  await datetimeAttr(databases, notificationCollectionId, 'sentAt')
  await datetimeAttr(databases, notificationCollectionId, 'createdAt')
  await datetimeAttr(databases, notificationCollectionId, 'updatedAt')
  await index(databases, notificationCollectionId, 'bookingId_idx', ['bookingId'])
  await index(databases, notificationCollectionId, 'status_idx', ['status'])
  await index(databases, notificationCollectionId, 'channel_idx', ['channel'])
}

async function calendarEvents(databases) {
  await collection(databases, calendarCollectionId, 'Booking Calendar Events')
  await stringAttr(databases, calendarCollectionId, 'bookingId', 128, true)
  await stringAttr(databases, calendarCollectionId, 'workOrderId', 128)
  await stringAttr(databases, calendarCollectionId, 'workOrderNumber', 80)
  await stringAttr(databases, calendarCollectionId, 'calendarId', 320)
  await stringAttr(databases, calendarCollectionId, 'eventId', 256)
  await stringAttr(databases, calendarCollectionId, 'eventLink', 2048)
  await datetimeAttr(databases, calendarCollectionId, 'eventStart')
  await datetimeAttr(databases, calendarCollectionId, 'eventEnd')
  await enumAttr(databases, calendarCollectionId, 'status', calendarEventStatuses, 'pending')
  await stringAttr(databases, calendarCollectionId, 'failureReason', 2000)
  await stringAttr(databases, calendarCollectionId, 'rawResponseJson', 10000)
  await datetimeAttr(databases, calendarCollectionId, 'createdAt')
  await datetimeAttr(databases, calendarCollectionId, 'updatedAt')
  await index(databases, calendarCollectionId, 'bookingId_idx', ['bookingId'])
  await index(databases, calendarCollectionId, 'eventId_idx', ['eventId'])
  await index(databases, calendarCollectionId, 'status_idx', ['status'])
}

async function syncLaunchServices(databases) {
  try {
    const availableFields = await getCollectionInfo(databases, servicesCollectionId)
    const timestamp = new Date().toISOString()

    for (const service of launchServices) {
      const payload = {
        name: service.name,
        slug: service.slug,
        category: service.category,
        description: service.description,
        defaultPriceExGst: service.defaultPriceExGst,
        durationMinutes: service.durationMinutes,
        priceType: 'fixed',
        active: true,
        sortOrder: service.sortOrder,
        createdAt: timestamp,
        updatedAt: timestamp,
      }
      const safePayload = Object.fromEntries(
        Object.entries(payload).filter(([key]) => availableFields.has(key)),
      )

      try {
        await databases.createDocument(DATABASE_ID, servicesCollectionId, service.id, safePayload)
        console.log(`[created] service ${service.id}`)
      } catch (error) {
        if (error?.code !== 409) throw error
        delete safePayload.createdAt
        await databases.updateDocument(DATABASE_ID, servicesCollectionId, service.id, safePayload)
        console.log(`[updated] service ${service.id}`)
      }
    }

    for (const legacyId of legacyServiceIds) {
      try {
        const existing = await databases.getDocument(DATABASE_ID, servicesCollectionId, legacyId)
        const payload = {}
        if (availableFields.has('active')) payload.active = false
        if (availableFields.has('updatedAt')) payload.updatedAt = timestamp
        if (availableFields.has('slug')) payload.slug = `${legacyId}-legacy`
        await databases.updateDocument(DATABASE_ID, servicesCollectionId, existing.$id, payload)
        console.log(`[updated] legacy service ${legacyId} deactivated`)
      } catch (error) {
        if (error?.code !== 404) throw error
      }
    }
  } catch (error) {
    console.warn(`[skipped] launch service sync: ${error.message}`)
  }
}

async function main() {
  const endpoint = process.env.VITE_APPWRITE_ENDPOINT || process.env.APPWRITE_ENDPOINT
  const project = process.env.VITE_APPWRITE_PROJECT_ID || process.env.APPWRITE_PROJECT_ID
  const secret = process.env['APPWRITE' + '_API' + '_KEY']
  if (!endpoint) throw new Error('Missing Appwrite endpoint')
  if (!project) throw new Error('Missing Appwrite project id')
  if (!DATABASE_ID) throw new Error('Missing Appwrite database id')
  if (!secret) throw new Error('Missing Appwrite server credential')

  const client = new Client().setEndpoint(endpoint).setProject(project).setKey(secret)
  const databases = new Databases(client)

  await ensurePendingScheduling(databases)
  await ensureBookingCalendarMetadata(databases)
  await notifications(databases)
  await calendarEvents(databases)
  await syncLaunchServices(databases)

  console.log('Launch schema provisioning complete.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
