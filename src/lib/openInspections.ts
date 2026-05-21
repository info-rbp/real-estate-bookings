import { databases, appwriteConfig } from './appwrite'
import { ID, Query } from 'appwrite'

export async function createOFIPlan(data: any) {
  return await databases.createDocument(
    appwriteConfig.databaseId,
    appwriteConfig.openInspectionPlansCollectionId,
    ID.unique(),
    {
      ...data,
      status: 'planned',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  )
}

export async function updateOFIItem(itemId: string, data: any) {
  return await databases.updateDocument(
    appwriteConfig.databaseId,
    appwriteConfig.openInspectionItemsCollectionId,
    itemId,
    {
      ...data,
      updatedAt: new Date().toISOString()
    }
  )
}
