#!/usr/bin/env node
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { Client, Databases, ID, Query } from 'node-appwrite'

const REQUIRED_COLUMNS = [
  'serviceId',
  'slug',
  'name',
  'category',
  'description',
  'basePriceExGst',
  'premiumPriceExGst',
  'durationMinutes',
  'sortOrder',
]

const CLIENT_PRICING_FIELDS = [
  'clientId',
  'serviceId',
  'customPriceExGst',
  'billingType',
  'gstRate',
  'travelIncluded',
  'activeFrom',
  'activeUntil',
  'status',
  'createdAt',
  'updatedAt',
]

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

  if (inQuotes) throw new Error('CSV contains an unterminated quoted field')

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
      .map(attribute => attribute.key),
  )

  return new Set(CLIENT_PRICING_FIELDS.filter(field => available.has(field)))
}

function filterSupportedFields(data, availableFields) {
  return Object.fromEntries(
    Object.entries(data).filter(([key, value]) => availableFields.has(key) && value !== undefined),
  )
}

function validateColumns(records) {
  const first = records[0] || {}
  const missing = REQUIRED_COLUMNS.filter(column => !(column in first))
  if (missing.length > 0) {
    throw new Error(`Missing required CSV columns: ${missing.join(', ')}`)
  }
}

function parseMoney(value, line, field) {
  const numberValue = Number(value)
  if (!Number.isFinite(numberValue) || numberValue < 0) {
    throw new Error(`Line ${line}: ${field} must be a non-negative number`)
  }
  return numberValue
}

function normaliseRecord(record) {
  const serviceId = String(record.serviceId ?? '').trim()
  const premiumPriceExGst = parseMoney(record.premiumPriceExGst, record.__line, 'premiumPriceExGst')
  if (!serviceId) throw new Error(`Line ${record.__line}: serviceId is required`)
  return { serviceId, premiumPriceExGst }
}

function makeDocumentId(clientId, serviceId) {
  const preferred = `premium_${clientId}_${serviceId}`
  if (preferred.length <= 36 && /^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(preferred)) {
    return preferred
  }

  const hash = crypto
    .createHash('sha1')
    .update(`${clientId}:${serviceId}`)
    .digest('hex')
    .slice(0, 24)

  return `premium_${hash}`
}

async function findExisting(databases, databaseId, collectionId, clientId, serviceId) {
  const response = await databases.listDocuments(databaseId, collectionId, [
    Query.equal('clientId', clientId),
    Query.equal('serviceId', serviceId),
    Query.limit(1),
  ])

  return response.documents[0] || null
}

async function createWithFallback(databases, databaseId, collectionId, documentId, data, clientId, serviceId) {
  try {
    return await databases.createDocument(databaseId, collectionId, documentId, data)
  } catch (error) {
    if (error?.code !== 409) throw error

    const existing = await findExisting(databases, databaseId, collectionId, clientId, serviceId)
    if (existing) {
      return databases.updateDocument(databaseId, collectionId, existing.$id, data)
    }

    return databases.createDocument(databaseId, collectionId, ID.unique(), data)
  }
}

async function main() {
  const clientIds = process.argv.slice(2).map(value => value.trim()).filter(Boolean)
  if (clientIds.length === 0) {
    throw new Error('Usage: node --env-file=.env.local scripts/apply-premium-pricing.mjs CLIENT_ID_1 CLIENT_ID_2')
  }

  const csvPath = path.resolve(process.cwd(), 'data/services-pricing.csv')
  const content = fs.readFileSync(csvPath, 'utf8')
  const records = parseCsv(content)
  validateColumns(records)
  const services = records.map(normaliseRecord)

  const databases = buildClient()
  const databaseId = requireEnv('APPWRITE_DATABASE_ID', 'VITE_APPWRITE_DATABASE_ID')
  const clientPricingCollectionId = requireEnv('APPWRITE_CLIENT_PRICING_COLLECTION_ID', 'VITE_APPWRITE_CLIENT_PRICING_COLLECTION_ID')
  const availableFields = await getAvailableFields(databases, databaseId, clientPricingCollectionId)
  const summary = {
    clientIdsProcessed: clientIds.length,
    created: 0,
    updated: 0,
    skipped: 0,
  }

  for (const clientId of clientIds) {
    for (const service of services) {
      try {
        const timestamp = new Date().toISOString()
        const existing = await findExisting(databases, databaseId, clientPricingCollectionId, clientId, service.serviceId)
        const data = filterSupportedFields({
          clientId,
          serviceId: service.serviceId,
          customPriceExGst: service.premiumPriceExGst,
          billingType: 'fixed',
          gstRate: 0.1,
          travelIncluded: true,
          activeFrom: timestamp,
          status: 'active',
          createdAt: timestamp,
          updatedAt: timestamp,
        }, availableFields)

        if (existing) {
          delete data.createdAt
          await databases.updateDocument(databaseId, clientPricingCollectionId, existing.$id, data)
          summary.updated += 1
        } else {
          await createWithFallback(
            databases,
            databaseId,
            clientPricingCollectionId,
            makeDocumentId(clientId, service.serviceId),
            data,
            clientId,
            service.serviceId,
          )
          summary.created += 1
        }
      } catch (error) {
        summary.skipped += 1
        console.warn(`Skipped premium pricing for ${clientId}/${service.serviceId}: ${error.message}`)
      }
    }
  }

  console.log('Premium pricing apply summary')
  for (const [key, value] of Object.entries(summary)) {
    console.log(`${key}: ${value}`)
  }
}

main().catch(error => {
  console.error(error.message)
  process.exit(1)
})
