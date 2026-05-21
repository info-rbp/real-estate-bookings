const { Client, Databases, ID, Query } = require('node-appwrite');

module.exports = async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_FUNCTION_API_KEY);

  const databases = new Databases(client);

  const databaseId = process.env.APPWRITE_DATABASE_ID;
  const usersCollectionId = process.env.VITE_APPWRITE_USERS_COLLECTION_ID;
  const bookingsCollectionId = process.env.VITE_APPWRITE_BOOKINGS_COLLECTION_ID;
  const auditLogsCollectionId = process.env.VITE_APPWRITE_AUDIT_LOGS_COLLECTION_ID;
  const statusHistoryCollectionId = process.env.VITE_APPWRITE_WORK_ORDER_STATUS_HISTORY_COLLECTION_ID;

  // 1. Authenticate user
  const userId = req.headers['x-appwrite-user-id'];
  if (!userId) {
    return res.json({ error: 'UNAUTHORIZED' }, 401);
  }

  // 2. Load user profile
  let profile;
  try {
    const profiles = await databases.listDocuments(databaseId, usersCollectionId, [
      Query.equal('appwriteUserId', userId),
      Query.limit(1)
    ]);
    profile = profiles.documents[0];
  } catch (err) {
    return res.json({ error: 'INTERNAL_ERROR' }, 500);
  }

  // 3. Parse payload
  const { workOrderId, toStatus, reason, metadata } = JSON.parse(req.body);
  if (!workOrderId || !toStatus) {
    return res.json({ error: 'MISSING_FIELDS' }, 400);
  }

  // 4. Load Work Order
  let workOrder;
  try {
    workOrder = await databases.getDocument(databaseId, bookingsCollectionId, workOrderId);
  } catch (err) {
    return res.json({ error: 'NOT_FOUND' }, 404);
  }

  // 5. Check Permissions
  const isAdmin = profile.role === 'admin';
  const isStaff = profile.role === 'staff';
  const isOwner = workOrder.clientId === profile.clientId;

  if (!isAdmin && !isStaff && !isOwner) {
    return res.json({ error: 'FORBIDDEN' }, 403);
  }

  // 6. Validate Transition (Simplified)
  const fromStatus = workOrder.status;
  if (fromStatus === toStatus) {
    return res.json(workOrder);
  }

  // 7. Update status
  try {
    const updatedWorkOrder = await databases.updateDocument(databaseId, bookingsCollectionId, workOrderId, {
      status: toStatus,
      updatedAt: new Date().toISOString()
    });

    // 8. History & Audit
    await databases.createDocument(databaseId, statusHistoryCollectionId, ID.unique(), {
      workOrderId,
      fromStatus,
      toStatus,
      actorId: userId,
      actorRole: profile.role,
      reason: reason || 'Status updated',
      metadata: metadata ? JSON.stringify(metadata) : null,
      createdAt: new Date().toISOString()
    });

    await databases.createDocument(databaseId, auditLogsCollectionId, ID.unique(), {
      actorId: userId,
      actorRole: profile.role,
      clientId: profile.clientId,
      action: 'UPDATE_WORK_ORDER_STATUS',
      entityType: 'workOrder',
      entityId: workOrderId,
      metadata: JSON.stringify({ fromStatus, toStatus, workOrderNumber: workOrder.workOrderNumber }),
      createdAt: new Date().toISOString()
    });

    return res.json(updatedWorkOrder);
  } catch (err) {
    error('Error updating status: ' + err.message);
    return res.json({ error: 'INTERNAL_ERROR' }, 500);
  }
};
