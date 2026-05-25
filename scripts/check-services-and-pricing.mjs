#!/usr/bin/env node
import { Client, Databases, Query } from 'node-appwrite'

function requireEnv(name, fallbackName) {
  const value = process.env[name] || (fallbackName ? process.env[fallbackName] : undefined)
  if (!value) {
    throw new Error(`Missing ${name}${fallbackName ? ` or ${fallbackName}` : ''}`)
  }
  return value
}

function optionalEnv(name, fallbackName) {
  return process.env[name] || (fallbackName ? process.env[fallbackName] : undefined)
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

async function listAllDocuments(databases, databaseId, collectionId, queries) {
  const documents = []
  let offset = 0
  const limit = 100

  while (true) {
    const response = await databases.listDocuments(databaseId, collectionId, [
      ...queries,
      Query.limit(limit),
      Query.offset(offset),
    ])

    documents.push(...response.documents)
    if (response.documents.length < limit) break
    offset += limit
  }

  return documents
}

function asMoney(value) {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue : null
}

async function main() {
  const clientId = process.argv[2]?.trim()
  const databases = buildClient()
  const databaseId = requireEnv('APPWRITE_DATABASE_ID', 'VITE_APPWRITE_DATABASE_ID')
  const servicesCollectionId = requireEnv('APPWRITE_SERVICES_COLLECTION_ID', 'VITE_APPWRITE_SERVICES_COLLECTION_ID')
  const rateCardItemsCollectionId = requireEnv('APPWRITE_RATE_CARD_ITEMS_COLLECTION_ID', 'VITE_APPWRITE_RATE_CARD_ITEMS_COLLECTION_ID')
  const clientPricingCollectionId = optionalEnv('APPWRITE_CLIENT_PRICING_COLLECTION_ID', 'VITE_APPWRITE_CLIENT_PRICING_COLLECTION_ID')

  const services = await listAllDocuments(databases, databaseId, servicesCollectionId, [
    Query.equal('active', true),
    Query.orderAsc('sortOrder'),
  ])

  const rateItems = await listAllDocuments(databases, databaseId, rateCardItemsCollectionId, [
    Query.equal('pricingClassification', 'perth_peel'),
    Query.equal('active', true),
  ])

  const rateByService = new Map(rateItems.map(item => [item.serviceType, item]))
  let premiumByService = new Map()

  if (clientId && clientPricingCollectionId) {
    const premiumItems = await listAllDocuments(databases, databaseId, clientPricingCollectionId, [
      Query.equal('clientId', clientId),
      Query.equal('status', 'active'),
    ])
    premiumByService = new Map(premiumItems.map(item => [item.serviceId, item]))
  }

  console.log('Active services and pricing')
  for (const service of services) {
    const rateItem = rateByService.get(service.$id)
    const premiumItem = premiumByService.get(service.$id)
    const basePrice = asMoney(rateItem?.priceExGst ?? service.defaultPriceExGst)
    const premiumPrice = asMoney(premiumItem?.customPriceExGst)

    console.log(JSON.stringify({
      serviceId: service.$id,
      name: service.name,
      description: service.description,
      basePriceExGst: basePrice,
      premiumPriceExGst: premiumPrice,
    }, null, 2))
  }

  console.log(`base rate card items for perth_peel: ${rateItems.length}`)
  if (clientId) {
    console.log(`premium clientPricing records for ${clientId}: ${premiumByService.size}`)
  }
}

main().catch(error => {
  console.error(error.message)
  process.exit(1)
})
