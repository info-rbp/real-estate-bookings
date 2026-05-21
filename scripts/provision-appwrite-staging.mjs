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
  serviceAreas: process.env.VITE_APPWRITE_SERVICE_AREAS_COLLECTION_ID || 'serviceAreas',
  rateCards: process.env.VITE_APPWRITE_RATE_CARDS_COLLECTION_ID || 'rateCards',
  rateCardItems: process.env.VITE_APPWRITE_RATE_CARD_ITEMS_COLLECTION_ID || 'rateCardItems',
  workOrderContacts: process.env.VITE_APPWRITE_WORK_ORDER_CONTACTS_COLLECTION_ID || 'workOrderContacts',
  workOrderStatusHistory: process.env.VITE_APPWRITE_WORK_ORDER_STATUS_HISTORY_COLLECTION_ID || 'workOrderStatusHistory',
  accessIssues: process.env.VITE_APPWRITE_ACCESS_ISSUES_COLLECTION_ID || 'accessIssues',
  regionalBatches: process.env.VITE_APPWRITE_REGIONAL_BATCHES_COLLECTION_ID || 'regionalBatches',
  openInspectionPlans: process.env.VITE_APPWRITE_OPEN_INSPECTION_PLANS_COLLECTION_ID || 'openInspectionPlans',
  openInspectionItems: process.env.VITE_APPWRITE_OPEN_INSPECTION_ITEMS_COLLECTION_ID || 'openInspectionItems',
  invoiceLines: process.env.VITE_APPWRITE_INVOICE_LINES_COLLECTION_ID || 'invoiceLines',
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

  await stringAttr(databases, c, 'workOrderNumber', 64, false)
  await stringAttr(databases, c, 'appwriteUserId', 128, true)
  await stringAttr(databases, c, 'clientId', 128, false)
  await stringAttr(databases, c, 'serviceId', 128, true)
  await stringAttr(databases, c, 'serviceType', 64, false)
  await stringAttr(databases, c, 'propertyId', 128, false)
  await stringAttr(databases, c, 'propertyAddress', 300, true)
  await stringAttr(databases, c, 'propertySuburb', 120, false)
  await stringAttr(databases, c, 'propertyPostcode', 16, true)
  await stringAttr(databases, c, 'propertyState', 64, false, 'WA')
  await enumAttr(databases, c, 'propertyType', ['apartment', 'house', 'townhouse', 'commercial', 'other'], true)

  await stringAttr(databases, c, 'region', 64, false)
  await enumAttr(databases, c, 'pricingClassification', ['perth_peel', 'other_region', 'outside_service_area'], false)
  await boolAttr(databases, c, 'serviceAreaMatched', false, false)
  await boolAttr(databases, c, 'outsideServiceArea', false, false)

  await datetimeAttr(databases, c, 'requestedAttendanceDate', false)
  await stringAttr(databases, c, 'requestedAttendanceWindowStart', 10, false)
  await stringAttr(databases, c, 'requestedAttendanceWindowEnd', 10, false)
  await stringAttr(databases, c, 'timingRestrictions', 1000, false)

  await enumAttr(databases, c, 'accessMethod', ['lockbox', 'tenant', 'agency', 'concierge', 'owner', 'other'], true)
  await stringAttr(databases, c, 'accessInstructions', 2000, false)
  await stringAttr(databases, c, 'lockboxCode', 64, false)
  await stringAttr(databases, c, 'alarmDetails', 200, false)
  await stringAttr(databases, c, 'gateAccess', 200, false)
  await stringAttr(databases, c, 'parkingDetails', 200, false)
  await stringAttr(databases, c, 'keyCollectionDetails', 500, false)

  await boolAttr(databases, c, 'hasLegalAuthority', false, false)
  await stringAttr(databases, c, 'authorityConfirmedBy', 160, false)
  await datetimeAttr(databases, c, 'authorityConfirmedAt', false)

  await stringAttr(databases, c, 'knownSafetyRisks', 500, false)
  await stringAttr(databases, c, 'animalsAtProperty', 200, false)
  await stringAttr(databases, c, 'hazards', 500, false)
  await stringAttr(databases, c, 'accessLimitations', 500, false)
  await stringAttr(databases, c, 'sensitiveCircumstances', 500, false)

  await stringAttr(databases, c, 'requiredTemplate', 100, false)
  await stringAttr(databases, c, 'requiredSystem', 100, false)
  await stringAttr(databases, c, 'uploadDestination', 200, false)
  await stringAttr(databases, c, 'specificPhotosRequired', 1000, false)
  await stringAttr(databases, c, 'specificNotesRequired', 1000, false)
  await stringAttr(databases, c, 'specificQuestionsRequired', 1000, false)
  await stringAttr(databases, c, 'reportingRequirements', 2000, false)
  await stringAttr(databases, c, 'supportingFileIds', 128, false, undefined, true)

  await datetimeAttr(databases, c, 'scheduledStart', false)
  await datetimeAttr(databases, c, 'scheduledEnd', false)
  await intAttr(databases, c, 'durationMinutes', true, 1, 1440, 60)

  const statusEnum = ['draft', 'submitted', 'pending_acceptance', 'requires_information', 'quote_required', 'awaiting_batch', 'accepted', 'declined', 'scheduled', 'in_progress', 'completed', 'report_delivered', 'invoiced', 'paid', 'cancelled', 'access_issue', 'reattendance_required', 'failed']
  await enumAttr(databases, c, 'status', statusEnum, true, 'pending')
  await enumAttr(databases, c, 'acceptanceStatus', ['pending', 'accepted', 'declined'], false, 'pending')
  await datetimeAttr(databases, c, 'acceptedAt', false)
  await stringAttr(databases, c, 'acceptedBy', 128, false)
  await datetimeAttr(databases, c, 'declinedAt', false)
  await stringAttr(databases, c, 'declinedBy', 128, false)
  await stringAttr(databases, c, 'declineReason', 500, false)

  await boolAttr(databases, c, 'requiresQuote', false, false)
  await stringAttr(databases, c, 'quoteNotes', 1000, false)
  await boolAttr(databases, c, 'urgentFlag', false, false)
  await intAttr(databases, c, 'noticePeriodDays', false)
  await stringAttr(databases, c, 'regionalBatchId', 128, false)

  await floatAttr(databases, c, 'basePriceExGst', true, 0)
  await floatAttr(databases, c, 'travelSurchargeExGst', true, 0)
  await floatAttr(databases, c, 'accessIssueFeeExGst', false, 0)
  await floatAttr(databases, c, 'otherApprovedExpensesExGst', false, 0)
  await floatAttr(databases, c, 'gstAmount', false, 0)
  await floatAttr(databases, c, 'totalPriceExGst', true, 0)
  await floatAttr(databases, c, 'totalPriceIncGst', false, 0)

  await enumAttr(databases, c, 'paymentStatus', ['not_required', 'unpaid', 'pending', 'paid', 'failed', 'refunded'], true, 'unpaid')
  await enumAttr(databases, c, 'invoiceStatus', ['pending', 'invoiced', 'paid', 'cancelled'], false, 'pending')
  await stringAttr(databases, c, 'invoiceBatchId', 128, false)

  await stringAttr(databases, c, 'assignedStaffId', 128, false)
  await stringAttr(databases, c, 'notes', 4000, false)
  await datetimeAttr(databases, c, 'createdAt', false)
  await datetimeAttr(databases, c, 'updatedAt', false)

  await index(databases, c, 'workOrderNumber_unique', 'unique', ['workOrderNumber'])
  await index(databases, c, 'clientId_idx', 'key', ['clientId'])
  await index(databases, c, 'appwriteUserId_idx', 'key', ['appwriteUserId'])
  await index(databases, c, 'status_idx', 'key', ['status'])
  await index(databases, c, 'regionalBatchId_idx', 'key', ['regionalBatchId'])
  await index(databases, c, 'invoiceBatchId_idx', 'key', ['invoiceBatchId'])
}

async function createServiceAreas(databases) {
  const c = COLLECTIONS.serviceAreas
  await ensureCollection(databases, c, 'Service Areas', collectionPermissions({ publicRead: true, staffRead: true }))
  await stringAttr(databases, c, 'region', 64, true)
  await stringAttr(databases, c, 'suburb', 120, true)
  await stringAttr(databases, c, 'postcode', 16, true)
  await enumAttr(databases, c, 'pricingClassification', ['perth_peel', 'other_region', 'outside_service_area'], true)
  await boolAttr(databases, c, 'active', true, true)
  await stringAttr(databases, c, 'source', 100, false)
  await datetimeAttr(databases, c, 'createdAt', false)
  await datetimeAttr(databases, c, 'updatedAt', false)
  await index(databases, c, 'suburb_idx', 'key', ['suburb'])
  await index(databases, c, 'postcode_idx', 'key', ['postcode'])
  await index(databases, c, 'region_idx', 'key', ['region'])
  await index(databases, c, 'pricing_idx', 'key', ['pricingClassification'])
}

async function createRateCards(databases) {
  const c = COLLECTIONS.rateCards
  await ensureCollection(databases, c, 'Rate Cards', collectionPermissions({ staffRead: true }))
  await stringAttr(databases, c, 'clientId', 128, true)
  await stringAttr(databases, c, 'name', 200, true)
  await enumAttr(databases, c, 'status', ['draft', 'active', 'expired'], true, 'active')
  await datetimeAttr(databases, c, 'effectiveFrom', true)
  await datetimeAttr(databases, c, 'effectiveUntil', false)
  await floatAttr(databases, c, 'gstRate', true, 0, 1, 0.1)
  await datetimeAttr(databases, c, 'createdAt', false)
  await datetimeAttr(databases, c, 'updatedAt', false)
  await index(databases, c, 'clientId_idx', 'key', ['clientId'])
}

async function createRateCardItems(databases) {
  const c = COLLECTIONS.rateCardItems
  await ensureCollection(databases, c, 'Rate Card Items', collectionPermissions({ staffRead: true }))
  await stringAttr(databases, c, 'rateCardId', 128, true)
  await stringAttr(databases, c, 'serviceType', 64, true)
  await enumAttr(databases, c, 'pricingClassification', ['perth_peel', 'other_region', 'outside_service_area'], true)
  await floatAttr(databases, c, 'priceExGst', true, 0)
  await enumAttr(databases, c, 'priceType', ['fixed', 'hourly', 'quote'], true, 'fixed')
  await boolAttr(databases, c, 'requiresQuote', true, false)
  await boolAttr(databases, c, 'includedUnlessOtherwiseAgreed', true, false)
  await boolAttr(databases, c, 'active', true, true)
  await index(databases, c, 'rateCardId_idx', 'key', ['rateCardId'])
}

async function createWorkOrderContacts(databases) {
  const c = COLLECTIONS.workOrderContacts
  await ensureCollection(databases, c, 'Work Order Contacts', collectionPermissions({ staffRead: true }))
  await stringAttr(databases, c, 'workOrderId', 128, true)
  await enumAttr(databases, c, 'contactType', ['tenant', 'occupant', 'landlord', 'strata', 'contractor', 'property_manager', 'other'], true)
  await stringAttr(databases, c, 'name', 160, true)
  await stringAttr(databases, c, 'phone', 40, false)
  await stringAttr(databases, c, 'email', 128, false)
  await stringAttr(databases, c, 'company', 200, false)
  await stringAttr(databases, c, 'notes', 1000, false)
  await datetimeAttr(databases, c, 'createdAt', false)
  await index(databases, c, 'workOrderId_idx', 'key', ['workOrderId'])
}

async function createWorkOrderStatusHistory(databases) {
  const c = COLLECTIONS.workOrderStatusHistory
  await ensureCollection(databases, c, 'Work Order Status History', collectionPermissions({ staffRead: true }))
  await stringAttr(databases, c, 'workOrderId', 128, true)
  await stringAttr(databases, c, 'fromStatus', 64, true)
  await stringAttr(databases, c, 'toStatus', 64, true)
  await stringAttr(databases, c, 'actorId', 128, true)
  await stringAttr(databases, c, 'actorRole', 64, false)
  await stringAttr(databases, c, 'reason', 1000, false)
  await stringAttr(databases, c, 'metadata', 4000, false)
  await datetimeAttr(databases, c, 'createdAt', false)
  await index(databases, c, 'workOrderId_idx', 'key', ['workOrderId'])
}

async function createAccessIssues(databases) {
  const c = COLLECTIONS.accessIssues
  await ensureCollection(databases, c, 'Access Issues', collectionPermissions({ staffRead: true }))
  await stringAttr(databases, c, 'workOrderId', 128, true)
  await stringAttr(databases, c, 'issueType', 100, true)
  await stringAttr(databases, c, 'description', 2000, true)
  await boolAttr(databases, c, 'attendanceCommenced', false, false)
  await boolAttr(databases, c, 'travelCommenced', false, false)
  await datetimeAttr(databases, c, 'issueDiscoveredAt', false)
  await stringAttr(databases, c, 'evidenceFileIds', 128, false, undefined, true)
  await floatAttr(databases, c, 'accessIssueFeeExGst', false, 0)
  await floatAttr(databases, c, 'gstAmount', false, 0)
  await floatAttr(databases, c, 'totalIncGst', false, 0)
  await boolAttr(databases, c, 'reattendanceRequired', false, false)
  await stringAttr(databases, c, 'reattendanceWorkOrderId', 128, false)
  await boolAttr(databases, c, 'waived', false, false)
  await stringAttr(databases, c, 'waiverReason', 500, false)
  await stringAttr(databases, c, 'createdBy', 128, false)
  await datetimeAttr(databases, c, 'createdAt', false)
  await index(databases, c, 'workOrderId_idx', 'key', ['workOrderId'])
}

async function createRegionalBatches(databases) {
  const c = COLLECTIONS.regionalBatches
  await ensureCollection(databases, c, 'Regional Batches', collectionPermissions({ staffRead: true }))
  await stringAttr(databases, c, 'batchNumber', 64, true)
  await stringAttr(databases, c, 'clientId', 128, false)
  await stringAttr(databases, c, 'region', 64, true)
  await stringAttr(databases, c, 'routeName', 200, false)
  await datetimeAttr(databases, c, 'targetAttendanceStart', false)
  await datetimeAttr(databases, c, 'targetAttendanceEnd', false)
  await intAttr(databases, c, 'minimumAcceptedBookings', true, 1, 100, 10)
  await intAttr(databases, c, 'maximumRequiredBookings', true, 1, 200, 15)
  await intAttr(databases, c, 'acceptedBookingCount', true, 0, 200, 0)
  await enumAttr(databases, c, 'status', ['draft', 'collecting', 'ready_for_acceptance', 'accepted', 'scheduled', 'in_progress', 'completed', 'cancelled'], true, 'draft')
  await stringAttr(databases, c, 'workOrderIds', 128, false, undefined, true)
  await boolAttr(databases, c, 'travelApprovalRequired', false, false)
  await floatAttr(databases, c, 'approvedExpensesExGst', false, 0)
  await stringAttr(databases, c, 'notes', 2000, false)
  await datetimeAttr(databases, c, 'createdAt', false)
  await datetimeAttr(databases, c, 'updatedAt', false)
  await index(databases, c, 'batchNumber_unique', 'unique', ['batchNumber'])
}

async function createOpenInspectionPlans(databases) {
  const c = COLLECTIONS.openInspectionPlans
  await ensureCollection(databases, c, 'Open Inspection Plans', collectionPermissions({ staffRead: true }))
  await stringAttr(databases, c, 'planNumber', 64, true)
  await stringAttr(databases, c, 'clientId', 128, false)
  await datetimeAttr(databases, c, 'weekCommencing', true)
  await datetimeAttr(databases, c, 'cutoffAt', false)
  await datetimeAttr(databases, c, 'submittedAt', false)
  await enumAttr(databases, c, 'status', ['draft', 'submitted', 'active', 'completed', 'cancelled'], true, 'draft')
  await boolAttr(databases, c, 'routeOptimised', false, false)
  await stringAttr(databases, c, 'routeNotes', 2000, false)
  await stringAttr(databases, c, 'createdBy', 128, false)
  await datetimeAttr(databases, c, 'createdAt', false)
  await datetimeAttr(databases, c, 'updatedAt', false)
}

async function createOpenInspectionItems(databases) {
  const c = COLLECTIONS.openInspectionItems
  await ensureCollection(databases, c, 'Open Inspection Items', collectionPermissions({ staffRead: true }))
  await stringAttr(databases, c, 'planId', 128, true)
  await stringAttr(databases, c, 'workOrderId', 128, true)
  await stringAttr(databases, c, 'propertyAddress', 300, true)
  await stringAttr(databases, c, 'propertySuburb', 120, false)
  await stringAttr(databases, c, 'propertyPostcode', 16, false)
  await datetimeAttr(databases, c, 'scheduledStart', false)
  await datetimeAttr(databases, c, 'scheduledEnd', false)
  const statusEnum = ['planned', 'scheduled', 'attended', 'cancelled', 'leased', 'no_access', 'changed']
  await enumAttr(databases, c, 'status', statusEnum, true, 'planned')
  await boolAttr(databases, c, 'leased', false, false)
  await boolAttr(databases, c, 'cancelled', false, false)
  await boolAttr(databases, c, 'addedLate', false, false)
  await boolAttr(databases, c, 'removed', false, false)
  await boolAttr(databases, c, 'changed', false, false)
  await stringAttr(databases, c, 'attendanceNotes', 2000, false)
  await stringAttr(databases, c, 'confirmationFileIds', 128, false, undefined, true)
  await datetimeAttr(databases, c, 'createdAt', false)
  await datetimeAttr(databases, c, 'updatedAt', false)
}

async function createInvoiceLines(databases) {
  const c = COLLECTIONS.invoiceLines
  await ensureCollection(databases, c, 'Invoice Lines', collectionPermissions({ staffRead: true }))
  await stringAttr(databases, c, 'lineNumber', 64, true)
  await stringAttr(databases, c, 'clientId', 128, true)
  await stringAttr(databases, c, 'workOrderId', 128, true)
  await stringAttr(databases, c, 'serviceType', 64, true)
  await stringAttr(databases, c, 'description', 500, true)
  await stringAttr(databases, c, 'propertyAddress', 300, false)
  await stringAttr(databases, c, 'region', 64, false)
  await stringAttr(databases, c, 'pricingClassification', 64, false)
  await intAttr(databases, c, 'quantity', true, 1, 1000, 1)
  await floatAttr(databases, c, 'unitPriceExGst', true, 0)
  await floatAttr(databases, c, 'subtotalExGst', true, 0)
  await floatAttr(databases, c, 'gstAmount', true, 0)
  await floatAttr(databases, c, 'totalIncGst', true, 0)
  await enumAttr(databases, c, 'lineStatus', ['pending', 'invoiced', 'paid', 'cancelled', 'disputed'], true, 'pending')
  await stringAttr(databases, c, 'invoiceBatchId', 128, false)
  await datetimeAttr(databases, c, 'paymentCycleDate', false)
  await datetimeAttr(databases, c, 'exportedAt', false)
  await datetimeAttr(databases, c, 'createdAt', false)
  await index(databases, c, 'clientId_idx', 'key', ['clientId'])
  await index(databases, c, 'workOrderId_idx', 'key', ['workOrderId'])
  await index(databases, c, 'invoiceBatchId_idx', 'key', ['invoiceBatchId'])
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
  await createServiceAreas(databases)
  await createRateCards(databases)
  await createRateCardItems(databases)
  await createWorkOrderContacts(databases)
  await createWorkOrderStatusHistory(databases)
  await createAccessIssues(databases)
  await createRegionalBatches(databases)
  await createOpenInspectionPlans(databases)
  await createOpenInspectionItems(databases)
  await createInvoiceLines(databases)
  await seedServices(databases)

  console.log('Appwrite staging schema baseline complete.')
  console.log('Next manual steps: create one admin Auth user, one client Auth user, one client row, assign profile role/clientId/team permissions, then deploy the profile-update function.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
