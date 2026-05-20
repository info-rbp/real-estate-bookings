#!/usr/bin/env node
import { Client, Databases, Permission, Role, ID } from 'node-appwrite'

const REQUIRED_ENV = [
  'APPWRITE_ENDPOINT',
  'APPWRITE_PROJECT_ID',
  'APPWRITE_API_KEY',
  'APPWRITE_DATABASE_ID',
]

const COLLECTIONS = {
  users: process.env.VITE_APPWRITE_USERS_COLLECTION_ID || 'users',
  clients: process.env.VITE_APPWRITE_CLIENTS_COLLECTION_ID || 'clients',
  services: process.env.VITE_APPWRITE_SERVICES_COLLECTION_ID || 'services',
  leads: process.env.VITE_APPWRITE_LEADS_COLLECTION_ID || 'leads',
  bookings: process.env.VITE_APPWRITE_BOOKINGS_COLLECTION_ID || 'bookings',
  auditLogs: process.env.VITE_APPWRITE_AUDIT_LOGS_COLLECTION_ID || 'auditLogs',
}

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID

function required(name) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing ${name}`)
  return value
}

function getAdminTeamId() {
  return process.env.APPWRITE_PLATFORM_ADMIN_TEAM_ID || 'platform-admin'
}

function getStaffTeamId() {
  return process.env.APPWRITE_STAFF_TEAM_ID || 'staff'
}

function collectionPermissions({ publicRead = false, publicCreate = false, staffRead = false } = {}) {
  const permissions = [
    Permission.read(Role.team(getAdminTeamId())),
    Permission.create(Role.team(getAdminTeamId())),
    Permission.update(Role.team(getAdminTeamId())),
    Permission.delete(Role.team(getAdminTeamId())),
  ]

  if (staffRead) permissions.push(Permission.read(Role.team(getStaffTeamId())))
  if (publicRead) permissions.push(Permission.read(Role.any()))
  if (publicCreate) permissions.push(Permission.create(Role.any()))

  return permissions
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
    throw error
  }
}

async function ensureCollection(databases, collectionId, name, permissions) {
  await ignoreConflict(`collection ${collectionId}`, () =>
    databases.createCollection(DATABASE_ID, collectionId, name, permissions, true, true),
  )
}

async function stringAttr(databases, collectionId, key, size, required = false, defaultValue = undefined, array = false) {
  await ignoreConflict(`${collectionId}.${key}`, () =>
    databases.createStringAttribute(DATABASE_ID, collectionId, key, size, required, defaultValue, array),
  )
}

async function emailAttr(databases, collectionId, key, required = false) {
  await ignoreConflict(`${collectionId}.${key}`, () =>
    databases.createEmailAttribute(DATABASE_ID, collectionId, key, required),
  )
}

async function boolAttr(databases, collectionId, key, required = false, defaultValue = undefined) {
  await ignoreConflict(`${collectionId}.${key}`, () =>
    databases.createBooleanAttribute(DATABASE_ID, collectionId, key, required, defaultValue),
  )
}

async function intAttr(databases, collectionId, key, required = false, min = undefined, max = undefined, defaultValue = undefined) {
  await ignoreConflict(`${collectionId}.${key}`, () =>
    databases.createIntegerAttribute(DATABASE_ID, collectionId, key, required, min, max, defaultValue),
  )
}

async function floatAttr(databases, collectionId, key, required = false, min = undefined, max = undefined, defaultValue = undefined) {
  await ignoreConflict(`${collectionId}.${key}`, () =>
    databases.createFloatAttribute(DATABASE_ID, collectionId, key, required, min, max, defaultValue),
  )
}

async function datetimeAttr(databases, collectionId, key, required = false, defaultValue = undefined) {
  await ignoreConflict(`${collectionId}.${key}`, () =>
    databases.createDatetimeAttribute(DATABASE_ID, collectionId, key, required, defaultValue),
  )
}

async function enumAttr(databases, collectionId, key, elements, required = false, defaultValue = undefined, array = false) {
  await ignoreConflict(`${collectionId}.${key}`, () =>
    databases.createEnumAttribute(DATABASE_ID, collectionId, key, elements, required, defaultValue, array),
  )
}

async function index(databases, collectionId, key, type, attributes, orders = undefined) {
  await ignoreConflict(`${collectionId}.index.${key}`, () =>
    databases.createIndex(DATABASE_ID, collectionId, key, type, attributes, orders),
  )
}

async function createUsers(databases) {
  const c = COLLECTIONS.users
  await ensureCollection(databases, c, 'Users', collectionPermissions({ staffRead: true }))
  await stringAttr(databases, c, 'appwriteUserId', 128, true)
  await stringAttr(databases, c, 'clientId', 128, false)
  await stringAttr(databases, c, 'full_name', 160, true)
  await emailAttr(databases, c, 'email', true)
  await stringAttr(databases, c, 'phone', 40, false)
  await stringAttr(databases, c, 'timezone', 80, true, 'Australia/Perth')
  await boolAttr(databases, c, 'email_notifications', true, true)
  await boolAttr(databases, c, 'sms_notifications', true, false)
  await boolAttr(databases, c, 'two_factor_enabled', true, false)
  await enumAttr(databases, c, 'role', ['pending', 'client_user', 'client_admin', 'staff', 'admin'], true, 'pending')
  await enumAttr(databases, c, 'status', ['pending', 'invited', 'active', 'disabled'], true, 'pending')
  await stringAttr(databases, c, 'avatar_url', 2048, false)
  await datetimeAttr(databases, c, 'createdAt', false)
  await datetimeAttr(databases, c, 'updatedAt', false)
  await index(databases, c, 'appwriteUserId_unique', 'unique', ['appwriteUserId'])
  await index(databases, c, 'clientId_idx', 'key', ['clientId'])
  await index(databases, c, 'email_idx', 'key', ['email'])
  await index(databases, c, 'role_idx', 'key', ['role'])
  await index(databases, c, 'status_idx', 'key', ['status'])
}

async function createClients(databases) {
  const c = COLLECTIONS.clients
  await ensureCollection(databases, c, 'Clients', collectionPermissions({ staffRead: true }))
  await stringAttr(databases, c, 'name', 200, true)
  await enumAttr(databases, c, 'clientType', ['agency', 'landlord', 'property_manager', 'other'], true, 'agency')
  await stringAttr(databases, c, 'abn', 32, false)
  await emailAttr(databases, c, 'billingEmail', false)
  await stringAttr(databases, c, 'phone', 40, false)
  await stringAttr(databases, c, 'addressLine1', 200, false)
  await stringAttr(databases, c, 'addressLine2', 200, false)
  await stringAttr(databases, c, 'suburb', 100, false)
  await stringAttr(databases, c, 'state', 40, false)
  await stringAttr(databases, c, 'postcode', 16, false)
  await stringAttr(databases, c, 'country', 80, false, 'Australia')
  await enumAttr(databases, c, 'status', ['prospect', 'active', 'paused', 'disabled'], true, 'active')
  await datetimeAttr(databases, c, 'createdAt', false)
  await datetimeAttr(databases, c, 'updatedAt', false)
  await index(databases, c, 'status_idx', 'key', ['status'])
  await index(databases, c, 'billingEmail_idx', 'key', ['billingEmail'])
}

async function createServices(databases) {
  const c = COLLECTIONS.services
  await ensureCollection(databases, c, 'Services', collectionPermissions({ publicRead: true, staffRead: true }))
  await stringAttr(databases, c, 'name', 160, true)
  await stringAttr(databases, c, 'slug', 160, true)
  await stringAttr(databases, c, 'category', 120, true)
  await stringAttr(databases, c, 'description', 2000, false)
  await floatAttr(databases, c, 'defaultPriceExGst', true, 0)
  await intAttr(databases, c, 'durationMinutes', true, 1, 1440, 60)
  await enumAttr(databases, c, 'priceType', ['fixed', 'hourly', 'quote'], true, 'fixed')
  await boolAttr(databases, c, 'active', true, true)
  await intAttr(databases, c, 'sortOrder', true, 0, 10000, 0)
  await datetimeAttr(databases, c, 'createdAt', false)
  await datetimeAttr(databases, c, 'updatedAt', false)
  await index(databases, c, 'active_idx', 'key', ['active'])
  await index(databases, c, 'slug_unique', 'unique', ['slug'])
  await index(databases, c, 'category_idx', 'key', ['category'])
  await index(databases, c, 'sortOrder_idx', 'key', ['sortOrder'])
}

async function createLeads(databases) {
  const c = COLLECTIONS.leads
  await ensureCollection(databases, c, 'Leads', collectionPermissions({ publicCreate: true, staffRead: true }))
  await stringAttr(databases, c, 'firstName', 120, true)
  await stringAttr(databases, c, 'lastName', 120, true)
  await stringAttr(databases, c, 'agencyName', 200, false)
  await emailAttr(databases, c, 'email', true)
  await stringAttr(databases, c, 'phone', 40, false)
  await stringAttr(databases, c, 'message', 4000, true)
  await stringAttr(databases, c, 'source', 80, true, 'engage-us')
  await enumAttr(databases, c, 'status', ['new', 'contacted', 'qualified', 'closed'], true, 'new')
  await enumAttr(databases, c, 'notificationStatus', ['pending', 'sent', 'failed'], true, 'pending')
  await stringAttr(databases, c, 'assignedTo', 128, false)
  await datetimeAttr(databases, c, 'createdAt', false)
  await datetimeAttr(databases, c, 'updatedAt', false)
  await index(databases, c, 'email_idx', 'key', ['email'])
  await index(databases, c, 'status_idx', 'key', ['status'])
  await index(databases, c, 'source_idx', 'key', ['source'])
  await index(databases, c, 'createdAt_idx', 'key', ['createdAt'])
}

async function createBookings(databases) {
  const c = COLLECTIONS.bookings
  await ensureCollection(databases, c, 'Bookings', collectionPermissions({ staffRead: true }))
  await stringAttr(databases, c, 'appwriteUserId', 128, true)
  await stringAttr(databases, c, 'clientId', 128, false)
  await stringAttr(databases, c, 'serviceId', 128, true)
  await stringAttr(databases, c, 'propertyId', 128, false)
  await stringAttr(databases, c, 'propertyAddress', 300, true)
  await stringAttr(databases, c, 'propertyCity', 120, true)
  await stringAttr(databases, c, 'propertyPostcode', 16, true)
  await enumAttr(databases, c, 'propertyType', ['apartment', 'house', 'townhouse', 'commercial', 'other'], true)
  await enumAttr(databases, c, 'accessMethod', ['lockbox', 'tenant', 'agency', 'concierge', 'owner', 'other'], true)
  await stringAttr(databases, c, 'accessInstructions', 2000, false)
  await datetimeAttr(databases, c, 'scheduledStart', true)
  await datetimeAttr(databases, c, 'scheduledEnd', true)
  await intAttr(databases, c, 'durationMinutes', true, 1, 1440)
  await enumAttr(databases, c, 'status', ['pending', 'confirmed', 'scheduled', 'in_progress', 'completed', 'cancelled', 'failed', 'invoiced'], true, 'pending')
  await enumAttr(databases, c, 'paymentStatus', ['not_required', 'unpaid', 'pending', 'paid', 'failed', 'refunded'], true, 'unpaid')
  await floatAttr(databases, c, 'basePriceExGst', true, 0)
  await floatAttr(databases, c, 'travelSurchargeExGst', true, 0)
  await floatAttr(databases, c, 'totalPriceExGst', true, 0)
  await stringAttr(databases, c, 'assignedStaffId', 128, false)
  await stringAttr(databases, c, 'notes', 4000, false)
  await datetimeAttr(databases, c, 'createdAt', false)
  await datetimeAttr(databases, c, 'updatedAt', false)
  await index(databases, c, 'clientId_idx', 'key', ['clientId'])
  await index(databases, c, 'appwriteUserId_idx', 'key', ['appwriteUserId'])
  await index(databases, c, 'serviceId_idx', 'key', ['serviceId'])
  await index(databases, c, 'scheduledStart_idx', 'key', ['scheduledStart'])
  await index(databases, c, 'status_idx', 'key', ['status'])
  await index(databases, c, 'paymentStatus_idx', 'key', ['paymentStatus'])
}

async function createAuditLogs(databases) {
  const c = COLLECTIONS.auditLogs
  await ensureCollection(databases, c, 'Audit Logs', collectionPermissions())
  await stringAttr(databases, c, 'actorId', 128, false)
  await stringAttr(databases, c, 'actorRole', 80, false)
  await stringAttr(databases, c, 'clientId', 128, false)
  await stringAttr(databases, c, 'action', 160, true)
  await stringAttr(databases, c, 'entityType', 120, true)
  await stringAttr(databases, c, 'entityId', 128, false)
  await stringAttr(databases, c, 'metadata', 8000, false)
  await stringAttr(databases, c, 'ipAddress', 80, false)
  await stringAttr(databases, c, 'userAgent', 1000, false)
  await datetimeAttr(databases, c, 'createdAt', false)
  await index(databases, c, 'actorId_idx', 'key', ['actorId'])
  await index(databases, c, 'clientId_idx', 'key', ['clientId'])
  await index(databases, c, 'entity_idx', 'key', ['entityType', 'entityId'])
  await index(databases, c, 'action_idx', 'key', ['action'])
  await index(databases, c, 'createdAt_idx', 'key', ['createdAt'])
}

async function seedServices(databases) {
  const c = COLLECTIONS.services
  const services = [
    ['routine-inspection', 'Routine Inspection', 'Inspections', 'Standard property inspection and condition notes.', 165, 60, 10],
    ['final-bond-inspection', 'Final Bond Inspection', 'Inspections', 'Exit inspection and supporting condition report.', 220, 90, 20],
    ['open-home-attendance', 'Open Home Attendance', 'Leasing', 'Staffed open home attendance and attendee follow-up notes.', 145, 60, 30],
  ]

  for (const [slug, name, category, description, price, duration, sortOrder] of services) {
    await ignoreConflict(`seed service ${slug}`, () =>
      databases.createDocument(DATABASE_ID, c, slug, {
        name,
        slug,
        category,
        description,
        defaultPriceExGst: price,
        durationMinutes: duration,
        priceType: 'fixed',
        active: true,
        sortOrder,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    )
  }
}

async function main() {
  for (const envName of REQUIRED_ENV) required(envName)

  const client = new Client()
    .setEndpoint(required('APPWRITE_ENDPOINT'))
    .setProject(required('APPWRITE_PROJECT_ID'))
    .setKey(required('APPWRITE_API_KEY'))

  const databases = new Databases(client)

  await createUsers(databases)
  await createClients(databases)
  await createServices(databases)
  await createLeads(databases)
  await createBookings(databases)
  await createAuditLogs(databases)
  await seedServices(databases)

  console.log('Appwrite staging schema baseline complete.')
  console.log('Next manual steps: create one admin Auth user, one client Auth user, one client row, assign profile role/clientId/team permissions, then deploy the profile-update function.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
