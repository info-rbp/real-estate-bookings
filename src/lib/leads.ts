import { ID } from 'appwrite'
import { appwriteConfig, databases, isAppwriteConfigured } from './appwrite'

export interface LeadInput {
  firstName: string
  lastName: string
  agencyName: string
  email: string
  phone: string
  message: string
  source?: string
}

function requireLeadsCollection() {
  if (!isAppwriteConfigured || !appwriteConfig.databaseId || !appwriteConfig.leadsCollectionId) {
    throw new Error('Leads Appwrite collection is not configured.')
  }
}

export async function createLead(input: LeadInput) {
  requireLeadsCollection()

  return databases.createDocument({
    databaseId: appwriteConfig.databaseId,
    collectionId: appwriteConfig.leadsCollectionId,
    documentId: ID.unique(),
    data: {
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      agencyName: input.agencyName.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone.trim(),
      message: input.message.trim(),
      source: input.source || 'engage-us',
      status: 'new',
      notificationStatus: 'pending',
      createdAt: new Date().toISOString(),
    },
  })
}
