#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { Client, Databases, Query } from 'node-appwrite'

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

const SERVICE_FIELDS = [
  'name',
  'slug',
  'category',
  'description',
  'defaultPriceExGst',
  'durationMinutes',
  'priceType',
  'active',
  'sortOrder',
  'createdAt',
  'updatedAt',
]

const RATE_ITEM_FIELDS = [
  'rateCardId',
  'serviceType',
  'pricingClassification',
  'priceExGst',
  'priceType',
  'requiresQuote',
  'includedUnlessOtherwiseAgreed',
  'active',
]

const LEGACY_SERVICE_IDS = [
  'routine-inspection',
  'final-bond-inspection',
  'open-home-attendance',
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

async function getAvailableFields(databases, databaseId, collectionId, writableFields) {
  const response = await databases.listAttributes(databaseId, collectionId)
  const available = new Set(
    response.attributes
      .filter(attribute => attribute.status === 'available')
      .map(attribute => attribute.key),
  )

  return new Set(writableFields.filter(field => available.has(field)))
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

function parseInteger(value, line, field) {
  const numberValue = Number(value)
  if (!Number.isInteger(numberValue) || numberValue < 0) {
    throw new Error(`Line ${line}: ${field} must be a non-negative integer`)
  }
  return numberValue
}

function normaliseRecord(record) {
  const serviceId = String(record.serviceId ?? '').trim()
  const slug = String(record.slug ?? '').trim()
  const name = String(record.name ?? '').trim()
  const category = String(record.category ?? '').trim()
  const description = String(record.description ?? '').trim()
  const basePriceExGst = parseMoney(record.basePriceExGst, record.__line, 'basePriceExGst')
  const premiumPriceExGst = parseMoney(record.premiumPriceExGst, record.__line, 'premiumPriceExGst')
  const durationMinutes = parseInteger(record.durationMinutes, record.__line, 'durationMinutes')
  const sortOrder = parseInteger(record.sortOrder, record.__line, 'sortOrder')

  for (const [field, value] of Object.entries({ serviceId, slug, name, category, description })) {
    if (!value) throw new Error(`Line ${record.__line}: ${field} is required`)
  }

  return {
    serviceId,
    slug,
    name,
    category,
    description,
    basePriceExGst,
    premiumPriceExGst,
    durationMinutes,
    sortOrder,
  }
}

async function getDocumentOrNull(databases, databaseId, collectionId, documentId) {
  try {
    return await databases.getDocument(databaseId, collectionId, documentId)
  } catch (error) {
    if (error?.code === 404) return null
    throw error
  }
}

function makeSafeDocumentId(preferredId) {
  if (preferredId.length <= 36 && /^[A-Za-z0-9][A-Za-z0-9_]*$/.test(preferredId)) {
    return preferredId
  }

  return preferredId
    .replace(/^base_perth_peel_/, 'base_pp_')
    .slice(0, 36)
}

async function findRateItem(databases, databaseId, collectionId, serviceId) {
  const response = await databases.listDocuments(databaseId, collectionId, [
    Query.equal('serviceType', serviceId),
    Query.equal('pricingClassification', 'perth_peel'),
    Query.limit(1),
  ])

  return response.documents[0] || null
}

async function deactivateLegacyServices(databases, databaseId, servicesCollectionId, availableFields) {
  let deactivated = 0
  if (!availableFields.has('active')) return deactivated

  for (const legacyId of LEGACY_SERVICE_IDS) {
    const existing = await getDocumentOrNull(databases, databaseId, servicesCollectionId, legacyId)
    if (!existing) continue

    const data = filterSupportedFields({
      active: false,
      slug: availableFields.has('slug') ? `${legacyId}-legacy` : undefined,
      updatedAt: new Date().toISOString(),
    }, availableFields)

    await databases.updateDocument(databaseId, servicesCollectionId, legacyId, data)
    if (existing.active !== false) deactivated += 1
  }

  return deactivated
}

async function main() {
  const inputPath = process.argv[2]
  if (!inputPath) {
    throw new Error('Usage: node --env-file=.env.local scripts/import-services-and-pricing.mjs data/services-pricing.csv')
  }

  const csvPath = path.resolve(process.cwd(), inputPath)
  const content = fs.readFileSync(csvPath, 'utf8')
  const records = parseCsv(content)
  validateColumns(records)

  const services = records.map(normaliseRecord)
  const databases = buildClient()
  const databaseId = requireEnv('APPWRITE_DATABASE_ID', 'VITE_APPWRITE_DATABASE_ID')
  const servicesCollectionId = requireEnv('APPWRITE_SERVICES_COLLECTION_ID', 'VITE_APPWRITE_SERVICES_COLLECTION_ID')
  const rateCardItemsCollectionId = requireEnv('APPWRITE_RATE_CARD_ITEMS_COLLECTION_ID', 'VITE_APPWRITE_RATE_CARD_ITEMS_COLLECTION_ID')
  const serviceFields = await getAvailableFields(databases, databaseId, servicesCollectionId, SERVICE_FIELDS)
  const rateItemFields = await getAvailableFields(databases, databaseId, rateCardItemsCollectionId, RATE_ITEM_FIELDS)

  const summary = {
    servicesCreated: 0,
    servicesUpdated: 0,
    servicesDeactivated: await deactivateLegacyServices(databases, databaseId, servicesCollectionId, serviceFields),
    rateItemsCreated: 0,
    rateItemsUpdated: 0,
    skipped: 0,
  }

  for (const service of services) {
    try {
      const timestamp = new Date().toISOString()
      const serviceData = filterSupportedFields({
        name: service.name,
        slug: service.slug,
        category: service.category,
        description: service.description,
        defaultPriceExGst: service.basePriceExGst,
        durationMinutes: service.durationMinutes,
        priceType: 'fixed',
        active: true,
        sortOrder: service.sortOrder,
        createdAt: timestamp,
        updatedAt: timestamp,
      }, serviceFields)

      try {
        await databases.createDocument(databaseId, servicesCollectionId, service.serviceId, serviceData)
        summary.servicesCreated += 1
      } catch (error) {
        if (error?.code !== 409) throw error
        delete serviceData.createdAt
        await databases.updateDocument(databaseId, servicesCollectionId, service.serviceId, serviceData)
        summary.servicesUpdated += 1
      }

      const preferredRateItemId = `base_perth_peel_${service.serviceId}`
      const rateItemId = makeSafeDocumentId(preferredRateItemId)
      const existingRateItem = await findRateItem(databases, databaseId, rateCardItemsCollectionId, service.serviceId)
      const rateItemData = filterSupportedFields({
        rateCardId: 'base_perth_peel',
        serviceType: service.serviceId,
        pricingClassification: 'perth_peel',
        priceExGst: service.basePriceExGst,
        priceType: 'fixed',
        requiresQuote: false,
        includedUnlessOtherwiseAgreed: false,
        active: true,
      }, rateItemFields)

      if (existingRateItem) {
        await databases.updateDocument(databaseId, rateCardItemsCollectionId, existingRateItem.$id, rateItemData)
        summary.rateItemsUpdated += 1
      } else {
        await databases.createDocument(databaseId, rateCardItemsCollectionId, rateItemId, rateItemData)
        summary.rateItemsCreated += 1
      }
    } catch (error) {
      summary.skipped += 1
      console.warn(`Skipped service ${service.serviceId}: ${error.message}`)
    }
  }

  console.log('Services and pricing import summary')
  for (const [key, value] of Object.entries(summary)) {
    console.log(`${key}: ${value}`)
  }
}

main().catch(error => {
  console.error(error.message)
  process.exit(1)
})
