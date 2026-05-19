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
  bookingsCollectionId: import.meta.env.VITE_APPWRITE_BOOKINGS_COLLECTION_ID,
  propertiesCollectionId: import.meta.env.VITE_APPWRITE_PROPERTIES_COLLECTION_ID,
  leadsCollectionId: import.meta.env.VITE_APPWRITE_LEADS_COLLECTION_ID,
  propertyImagesBucketId: import.meta.env.VITE_APPWRITE_STORAGE_PROPERTY_IMAGES_BUCKET_ID,
  reportsBucketId: import.meta.env.VITE_APPWRITE_STORAGE_REPORTS_BUCKET_ID,
  pricingFunctionId: import.meta.env.VITE_APPWRITE_FUNCTION_PRICING_ID,
  stripeCheckoutFunctionId: import.meta.env.VITE_APPWRITE_FUNCTION_STRIPE_CHECKOUT_ID,
  stripeWebhookFunctionId: import.meta.env.VITE_APPWRITE_FUNCTION_STRIPE_WEBHOOK_ID,
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
