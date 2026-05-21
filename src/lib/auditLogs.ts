import { ID } from 'appwrite';
import { databases, appwriteConfig } from './appwrite';

export async function createAuditLog(input: {
  actorId: string;
  actorRole: string;
  clientId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: any;
}) {
  const data = {
    actorId: input.actorId,
    actorRole: input.actorRole,
    clientId: input.clientId,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId,
    metadata: input.metadata ? JSON.stringify(input.metadata) : null,
    createdAt: new Date().toISOString(),
  };

  return await databases.createDocument(
    appwriteConfig.databaseId!,
    appwriteConfig.auditLogsCollectionId!,
    ID.unique(),
    data
  );
}
