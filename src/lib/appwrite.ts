import { Account, Client, Databases, Functions, Storage, Teams } from 'appwrite'

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID

export const appwriteConfig = {
  endpoint,
  projectId,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  usersCollectionId: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
  clientsCollectionId: import.meta.env.VITE_APPWRITE_CLIENTS_COLLECTION_ID,
  servicesCollectionId: import.meta.env.VITE_APPWRITE_SERVICES_COLLECTION_ID,
  clientPricingCollectionId: import.meta.env.VITE_APPWRITE_CLIENT_PRICING_COLLECTION_ID,
  bookingsCollectionId: import.meta.env.VITE_APPWRITE_BOOKINGS_COLLECTION_ID,
  bookingServiceDetailsCollectionId: import.meta.env.VITE_APPWRITE_BOOKING_SERVICE_DETAILS_COLLECTION_ID,
  bookingPropertiesCollectionId: import.meta.env.VITE_APPWRITE_BOOKING_PROPERTIES_COLLECTION_ID,
  propertiesCollectionId: import.meta.env.VITE_APPWRITE_PROPERTIES_COLLECTION_ID,
  leadsCollectionId: import.meta.env.VITE_APPWRITE_LEADS_COLLECTION_ID,
  openInspectionsCollectionId: import.meta.env.VITE_APPWRITE_OPEN_INSPECTIONS_COLLECTION_ID,
  inspectionCheckInsCollectionId: import.meta.env.VITE_APPWRITE_INSPECTION_CHECK_INS_COLLECTION_ID,
  paymentsCollectionId: import.meta.env.VITE_APPWRITE_PAYMENTS_COLLECTION_ID,
  subscriptionsCollectionId: import.meta.env.VITE_APPWRITE_SUBSCRIPTIONS_COLLECTION_ID,
  auditLogsCollectionId: import.meta.env.VITE_APPWRITE_AUDIT_LOGS_COLLECTION_ID,
  serviceAreasCollectionId: import.meta.env.VITE_APPWRITE_SERVICE_AREAS_COLLECTION_ID,
  rateCardsCollectionId: import.meta.env.VITE_APPWRITE_RATE_CARDS_COLLECTION_ID,
  rateCardItemsCollectionId: import.meta.env.VITE_APPWRITE_RATE_CARD_ITEMS_COLLECTION_ID,
  workOrderContactsCollectionId: import.meta.env.VITE_APPWRITE_WORK_ORDER_CONTACTS_COLLECTION_ID,
  workOrderStatusHistoryCollectionId: import.meta.env.VITE_APPWRITE_WORK_ORDER_STATUS_HISTORY_COLLECTION_ID,
  accessIssuesCollectionId: import.meta.env.VITE_APPWRITE_ACCESS_ISSUES_COLLECTION_ID,
  regionalBatchesCollectionId: import.meta.env.VITE_APPWRITE_REGIONAL_BATCHES_COLLECTION_ID,
  openInspectionPlansCollectionId: import.meta.env.VITE_APPWRITE_OPEN_INSPECTION_PLANS_COLLECTION_ID,
  openInspectionItemsCollectionId: import.meta.env.VITE_APPWRITE_OPEN_INSPECTION_ITEMS_COLLECTION_ID,
  invoiceLinesCollectionId: import.meta.env.VITE_APPWRITE_INVOICE_LINES_COLLECTION_ID,
  propertyImagesBucketId: import.meta.env.VITE_APPWRITE_STORAGE_PROPERTY_IMAGES_BUCKET_ID,
  reportsBucketId: import.meta.env.VITE_APPWRITE_STORAGE_REPORTS_BUCKET_ID,
  profileUpdateFunctionId: import.meta.env.VITE_APPWRITE_FUNCTION_PROFILE_UPDATE_ID,
  adminUserAssignmentFunctionId: import.meta.env.VITE_APPWRITE_FUNCTION_ADMIN_USER_ASSIGNMENT_ID,
  pricingFunctionId: import.meta.env.VITE_APPWRITE_FUNCTION_PRICING_ID,
  stripeCheckoutFunctionId: import.meta.env.VITE_APPWRITE_FUNCTION_STRIPE_CHECKOUT_ID,
  stripeWebhookFunctionId: import.meta.env.VITE_APPWRITE_FUNCTION_STRIPE_WEBHOOK_ID,
  createWorkOrderFunctionId: import.meta.env.VITE_APPWRITE_FUNCTION_CREATE_WORK_ORDER_ID,
  fetchCalendarAvailabilityFunctionId: import.meta.env.VITE_APPWRITE_FUNCTION_FETCH_CALENDAR_AVAILABILITY_ID,
  generateInvoiceLinesFunctionId: import.meta.env.VITE_APPWRITE_FUNCTION_GENERATE_INVOICE_LINES_ID,
} as const

export const isAppwriteConfigured = Boolean(endpoint && projectId)

export const client = new Client()

if (endpoint) {
  client.setEndpoint(endpoint)
}

if (projectId) {
  client.setProject(projectId)
}

export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)
export const functions = new Functions(client)
export const teams = new Teams(client)
