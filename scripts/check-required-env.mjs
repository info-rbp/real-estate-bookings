const frontendVars = [
  'VITE_APPWRITE_ENDPOINT',
  'VITE_APPWRITE_PROJECT_ID',
  'VITE_APPWRITE_DATABASE_ID',
  'VITE_APPWRITE_USERS_COLLECTION_ID',
  'VITE_APPWRITE_CLIENTS_COLLECTION_ID',
  'VITE_APPWRITE_SERVICES_COLLECTION_ID',
  'VITE_APPWRITE_CLIENT_PRICING_COLLECTION_ID',
  'VITE_APPWRITE_BOOKINGS_COLLECTION_ID',
  'VITE_APPWRITE_BOOKING_SERVICE_DETAILS_COLLECTION_ID',
  'VITE_APPWRITE_BOOKING_PROPERTIES_COLLECTION_ID',
  'VITE_APPWRITE_PROPERTIES_COLLECTION_ID',
  'VITE_APPWRITE_LEADS_COLLECTION_ID',
  'VITE_APPWRITE_OPEN_INSPECTIONS_COLLECTION_ID',
  'VITE_APPWRITE_INSPECTION_CHECK_INS_COLLECTION_ID',
  'VITE_APPWRITE_PAYMENTS_COLLECTION_ID',
  'VITE_APPWRITE_SUBSCRIPTIONS_COLLECTION_ID',
  'VITE_APPWRITE_AUDIT_LOGS_COLLECTION_ID',
  'VITE_APPWRITE_SERVICE_AREAS_COLLECTION_ID',
  'VITE_APPWRITE_RATE_CARDS_COLLECTION_ID',
  'VITE_APPWRITE_RATE_CARD_ITEMS_COLLECTION_ID',
  'VITE_APPWRITE_WORK_ORDER_CONTACTS_COLLECTION_ID',
  'VITE_APPWRITE_WORK_ORDER_STATUS_HISTORY_COLLECTION_ID',
  'VITE_APPWRITE_ACCESS_ISSUES_COLLECTION_ID',
  'VITE_APPWRITE_REGIONAL_BATCHES_COLLECTION_ID',
  'VITE_APPWRITE_OPEN_INSPECTION_PLANS_COLLECTION_ID',
  'VITE_APPWRITE_OPEN_INSPECTION_ITEMS_COLLECTION_ID',
  'VITE_APPWRITE_INVOICE_LINES_COLLECTION_ID',
  'VITE_APPWRITE_STORAGE_PROPERTY_IMAGES_BUCKET_ID',
  'VITE_APPWRITE_STORAGE_REPORTS_BUCKET_ID',
  'VITE_APPWRITE_FUNCTION_PROFILE_UPDATE_ID',
  'VITE_APPWRITE_FUNCTION_ADMIN_USER_ASSIGNMENT_ID',
  'VITE_APPWRITE_FUNCTION_PRICING_ID',
  'VITE_APPWRITE_FUNCTION_CREATE_WORK_ORDER_ID',
  'VITE_APPWRITE_FUNCTION_FETCH_CALENDAR_AVAILABILITY_ID',
  'VITE_APPWRITE_FUNCTION_GENERATE_INVOICE_LINES_ID',
  'VITE_APPWRITE_FUNCTION_STRIPE_CHECKOUT_ID',
  'VITE_APPWRITE_FUNCTION_STRIPE_WEBHOOK_ID',
]

const serverBaseVars = [
  'BOOKING_NOTIFICATIONS_COLLECTION_ID',
  'BOOKING_CALENDAR_EVENTS_COLLECTION_ID',
  'EMAIL_PROVIDER',
  'EMAIL_FROM',
  'OPERATIONS_EMAIL_TO',
  'OPERATIONS_ALERT_EMAIL_TO',
  'GOOGLE_CALENDAR_ID',
  'GOOGLE_CLIENT_EMAIL',
  'GOOGLE_PRIVATE_KEY',
  'GOOGLE_CALENDAR_TIMEZONE',
]

const providerVars = {
  resend: ['RESEND_API_KEY'],
  sendgrid: ['SENDGRID_API_KEY'],
  mailgun: ['MAILGUN_API_KEY', 'MAILGUN_DOMAIN'],
  gmail: ['GMAIL_DELEGATED_USER'],
}

function missingVars(names) {
  return names.filter((name) => !process.env[name] || process.env[name].trim() === '')
}

function printMissing(names) {
  console.error('Missing required environment variables:')
  for (const name of names) console.error(`- ${name}`)
}

const shouldCheckFunctions = process.argv.includes('--functions')
const missingFrontend = missingVars(frontendVars)

if (missingFrontend.length > 0) {
  printMissing(missingFrontend)
  console.error('\nSet these in Cloudflare production environment and locally when needed.')
  process.exit(1)
}

if (!shouldCheckFunctions) {
  console.log(`All required frontend environment variables are present (${frontendVars.length}).`)
  process.exit(0)
}

const provider = String(process.env.EMAIL_PROVIDER || '').trim().toLowerCase()
const missingServer = missingVars(serverBaseVars)
const missingProvider = provider ? missingVars(providerVars[provider] || []) : []
const missing = [...missingServer, ...missingProvider]

if (provider && !providerVars[provider]) {
  console.error(`Unsupported EMAIL_PROVIDER value: ${provider}`)
  process.exit(1)
}

if (missing.length > 0) {
  printMissing(missing)
  console.error('\nSet these as Appwrite function variables before deploying booking email/calendar workflows.')
  process.exit(1)
}

console.log(`All required frontend and booking-function environment variables are present (${frontendVars.length + serverBaseVars.length + missingProvider.length}).`)
