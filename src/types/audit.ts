export interface AuditLog {
  $id: string;
  actorId: string;
  actorRole: string;
  clientId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: string; // JSON string
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}
