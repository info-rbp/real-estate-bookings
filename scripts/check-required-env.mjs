const requiredVars = [
  'VITE_APPWRITE_ENDPOINT',
  'VITE_APPWRITE_PROJECT_ID',
  'VITE_APPWRITE_DATABASE_ID',
  'VITE_APPWRITE_USERS_COLLECTION_ID',
  'VITE_APPWRITE_CLIENTS_COLLECTION_ID',
  'VITE_APPWRITE_SERVICES_COLLECTION_ID',
  'VITE_APPWRITE_BOOKINGS_COLLECTION_ID',
  'VITE_APPWRITE_PROPERTIES_COLLECTION_ID',
  'VITE_APPWRITE_LEADS_COLLECTION_ID',
  'VITE_APPWRITE_SERVICE_AREAS_COLLECTION_ID',
  'VITE_APPWRITE_RATE_CARD_ITEMS_COLLECTION_ID',
  'VITE_APPWRITE_INVOICE_LINES_COLLECTION_ID',
  'VITE_APPWRITE_FUNCTION_PROFILE_UPDATE_ID',
  'VITE_APPWRITE_FUNCTION_CREATE_WORK_ORDER_ID',
  'VITE_APPWRITE_FUNCTION_FETCH_CALENDAR_AVAILABILITY_ID',
  'VITE_APPWRITE_FUNCTION_GENERATE_INVOICE_LINES_ID',
]

const missing = requiredVars.filter((name) => !process.env[name] || process.env[name].trim() === '')

if (missing.length > 0) {
  console.error('Missing required environment variables:')
  for (const name of missing) console.error(`- ${name}`)
  console.error('\nSet these in Cloudflare production environment and locally when needed.')
  process.exit(1)
}

console.log(`All required environment variables are present (${requiredVars.length}).`)
