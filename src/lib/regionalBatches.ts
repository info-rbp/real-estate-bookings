import { databases, appwriteConfig } from './appwrite'
import { ID, Query } from 'appwrite'

export async function createRegionalBatch(data: any) {
  return await databases.createDocument(
    appwriteConfig.databaseId,
    appwriteConfig.regionalBatchesCollectionId,
    ID.unique(),
    {
      ...data,
      status: 'collecting',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  )
}

export async function addWorkOrderToBatch(batchId: string, workOrderId: string) {
  // Update Work Order
  await databases.updateDocument(
    appwriteConfig.databaseId,
    appwriteConfig.bookingsCollectionId,
    workOrderId,
    {
      regionalBatchId: batchId,
      status: 'accepted'
    }
  )

  // Update Batch count
  const batch = await databases.getDocument(
    appwriteConfig.databaseId,
    appwriteConfig.regionalBatchesCollectionId,
    batchId
  )

  return await databases.updateDocument(
    appwriteConfig.databaseId,
    appwriteConfig.regionalBatchesCollectionId,
    batchId,
    {
      acceptedBookingCount: (batch.acceptedBookingCount || 0) + 1,
      updatedAt: new Date().toISOString()
    }
  )
}
