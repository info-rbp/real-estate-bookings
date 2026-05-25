import fs from 'node:fs'
import path from 'node:path'
import { Client, Databases, ID, Query } from 'node-appwrite'

const REQUIRED_COLUMNS = ['suburb', 'postcode', 'region', 'pricingClassification', 'active', 'source']
const VALID_PRICING_CLASSIFICATIONS = new Set(['perth_peel', 'other_region', 'outside_service_area'])
const WRITABLE_FIELDS = ['suburb', 'postcode', 'region', 'pricingClassification', 'active', 'source', 'createdAt', 'updatedAt']

function normaliseSuburb(value) {
  return String(value ?? '').trim().toUpperCase().replace(/\s+/g, ' ')
}

function normalisePostcode(value) {
  return String(value ?? '').trim()
}

function parseCsv(content) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < content.length; i += 1) {
    const char = content[i]
    const next = content[i + 1]

    if (char === '"') {
      if (inQuotes && next === '"') {
        field += '"'
        i += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === ',' && !inQuotes) {
      row.push(field)
      field = ''
      continue
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') i += 1
      row.push(field)
      if (row.some(value => value.trim() !== '')) rows.push(row)
      row = []
      field = ''
      continue
    }

    field += char
  }

  row.push(field)
  if (row.some(value => value.trim() !== '')) rows.push(row)

  if (rows.length === 0) return []

  const headers = rows[0].map(header => header.trim())
  return rows.slice(1).map((values, index) => {
    const record = { __line: index + 2 }
    for (const [headerIndex, header] of headers.entries()) {
      record[header] = values[headerIndex] ?? ''
    }
    return record
  })
}

function parseActive(value, line) {
  const normalised = String(value ?? '').trim().toLowerCase()
  if (normalised === 'true') return true
  if (normalised === 'false') return false
  throw new Error(`Line ${line}: active must be true or false`)
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

async function getAvailableFields(databases, databaseId, collectionId) {
  const response = await databases.listAttributes(databaseId, collectionId)
  const available = new Set(
    response.attributes
      .filter(attribute => attribute.status === 'available')
      .map(attribute => attribute.key)
  )

  return new Set(WRITABLE_FIELDS.filter(field => available.has(field)))
}

function filterSupportedFields(data, availableFields) {
  return Object.fromEntries(
    Object.entries(data).filter(([key]) => availableFields.has(key))
  )
}

function validateColumns(records) {
  const first = records[0] || {}
  const missing = REQUIRED_COLUMNS.filter(column => !(column in first))
  if (missing.length > 0) {
    throw new Error(`Missing required CSV columns: ${missing.join(', ')}`)
  }
}

function normaliseRecord(record) {
  const suburb = normaliseSuburb(record.suburb)
  const postcode = normalisePostcode(record.postcode)
  const region = String(record.region || 'Perth and Peel Region').trim() || 'Perth and Peel Region'
  const pricingClassification = String(record.pricingClassification ?? '').trim()
  const active = parseActive(record.active, record.__line)
  const source = String(record.source || 'Rent On Time - Service Areas.xlsx').trim() || 'Rent On Time - Service Areas.xlsx'

  if (!suburb) throw new Error(`Line ${record.__line}: suburb is required`)
  if (!postcode) throw new Error(`Line ${record.__line}: postcode is required`)
  if (!VALID_PRICING_CLASSIFICATIONS.has(pricingClassification)) {
    throw new Error(`Line ${record.__line}: invalid pricingClassification "${pricingClassification}"`)
  }

  return { suburb, postcode, region, pricingClassification, active, source }
}

async function findExisting(databases, databaseId, collectionId, suburb, postcode) {
  const response = await databases.listDocuments(databaseId, collectionId, [
    Query.equal('suburb', suburb),
    Query.equal('postcode', postcode),
    Query.limit(1),
  ])

  return response.documents[0] || null
}

async function main() {
  const inputPath = process.argv[2]
  if (!inputPath) {
    throw new Error('Usage: node --env-file=.env.local scripts/import-service-areas.mjs data/service-areas.csv')
  }

  const csvPath = path.resolve(process.cwd(), inputPath)
  const content = fs.readFileSync(csvPath, 'utf8')
  const records = parseCsv(content)
  validateColumns(records)

  const databases = buildClient()
  const databaseId = requireEnv('APPWRITE_DATABASE_ID', 'VITE_APPWRITE_DATABASE_ID')
  const collectionId = requireEnv('APPWRITE_SERVICE_AREAS_COLLECTION_ID', 'VITE_APPWRITE_SERVICE_AREAS_COLLECTION_ID')
  const availableFields = await getAvailableFields(databases, databaseId, collectionId)
  const timestamp = new Date().toISOString()

  const summary = {
    created: 0,
    updated: 0,
    skipped: 0,
    totalProcessed: 0,
  }

  for (const record of records) {
    summary.totalProcessed += 1

    try {
      const normalised = normaliseRecord(record)
      const existing = await findExisting(databases, databaseId, collectionId, normalised.suburb, normalised.postcode)

      if (existing) {
        const data = filterSupportedFields({
          region: normalised.region,
          pricingClassification: normalised.pricingClassification,
          active: normalised.active,
          source: normalised.source,
          updatedAt: timestamp,
        }, availableFields)

        await databases.updateDocument(databaseId, collectionId, existing.$id, data)
        summary.updated += 1
      } else {
        const data = filterSupportedFields({
          ...normalised,
          createdAt: timestamp,
          updatedAt: timestamp,
        }, availableFields)

        await databases.createDocument(databaseId, collectionId, ID.unique(), data)
        summary.created += 1
      }
    } catch (error) {
      summary.skipped += 1
      console.warn(`Skipped line ${record.__line}: ${error.message}`)
    }
  }

  console.log('Service area import summary')
  console.log(`created: ${summary.created}`)
  console.log(`updated: ${summary.updated}`)
  console.log(`skipped: ${summary.skipped}`)
  console.log(`total processed: ${summary.totalProcessed}`)
}

main().catch(error => {
  console.error(error.message)
  process.exit(1)
})
