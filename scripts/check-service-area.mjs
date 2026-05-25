import { Client, Databases, Query } from 'node-appwrite'

function normaliseSuburb(value) {
  return String(value ?? '').trim().toUpperCase().replace(/\s+/g, ' ')
}

function normalisePostcode(value) {
  return String(value ?? '').trim()
}

function requireEnv(name, fallbackName) {
  const value = process.env[name] || (fallbackName ? process.env[fallbackName] : undefined)
  if (!value) {
    throw new Error(`Missing ${name}${fallbackName ? ` or ${fallbackName}` : ''}`)
  }
  return value
}

function buildClient() {
  const endpoint = requireEnv('APPWRITE_ENDPOINT', 'VITE_APPWRITE_ENDPOINT')
  const projectId = requireEnv('APPWRITE_PROJECT_ID', 'VITE_APPWRITE_PROJECT_ID')
  const apiKey = requireEnv('APPWRITE_API_KEY')

  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey)

  return new Databases(client)
}

async function main() {
  const [, , suburbInput, postcodeInput] = process.argv
  if (!suburbInput || !postcodeInput) {
    throw new Error('Usage: node --env-file=.env.local scripts/check-service-area.mjs ASHBY 6065')
  }

  const suburb = normaliseSuburb(suburbInput)
  const postcode = normalisePostcode(postcodeInput)
  const databaseId = requireEnv('APPWRITE_DATABASE_ID', 'VITE_APPWRITE_DATABASE_ID')
  const collectionId = requireEnv('APPWRITE_SERVICE_AREAS_COLLECTION_ID', 'VITE_APPWRITE_SERVICE_AREAS_COLLECTION_ID')
  const databases = buildClient()

  const response = await databases.listDocuments(databaseId, collectionId, [
    Query.equal('suburb', suburb),
    Query.equal('postcode', postcode),
    Query.equal('active', true),
  ])

  console.log(`searched suburb: ${suburb}`)
  console.log(`searched postcode: ${postcode}`)
  console.log(`match count: ${response.documents.length}`)
  console.log('matching record details:')
  for (const document of response.documents) {
    console.log(JSON.stringify({
      id: document.$id,
      suburb: document.suburb,
      postcode: document.postcode,
      region: document.region,
      pricingClassification: document.pricingClassification,
      active: document.active,
      source: document.source,
    }, null, 2))
  }
}

main().catch(error => {
  console.error(error.message)
  process.exit(1)
})
