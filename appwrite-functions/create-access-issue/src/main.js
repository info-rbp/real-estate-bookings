const { Client, Databases, ID, Query } = require('node-appwrite');

module.exports = async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_FUNCTION_API_KEY);

  const databases = new Databases(client);
  const databaseId = process.env.APPWRITE_DATABASE_ID;
  const workOrdersCollectionId = 'bookings'; // Using existing collection name
  const accessIssuesCollectionId = 'accessIssues';
  const auditLogsCollectionId = 'auditLogs';
  const statusHistoryCollectionId = 'workOrderStatusHistory';

  if (req.method !== 'POST') {
    return res.json({ error: 'Method not allowed' }, 405);
  }

  try {
    const {
      workOrderId,
      issueType,
      description,
      attendanceCommenced,
      travelCommenced,
      reattendanceRequired,
      waived,
      waiverReason
    } = JSON.parse(req.body);

    if (!workOrderId || !issueType) {
      return res.json({ error: 'Missing required fields' }, 400);
    }

    // 1. Fetch the Work Order
    const workOrder = await databases.getDocument(databaseId, workOrdersCollectionId, workOrderId);

    // 2. Calculate Fee (20% of base fee)
    const baseFee = workOrder.basePriceExGst || 0;
    const accessIssueFeeExGst = waived ? 0 : baseFee * 0.2;
    const gstAmount = accessIssueFeeExGst * 0.1;
    const totalIncGst = accessIssueFeeExGst + gstAmount;

    // 3. Create Access Issue record
    const accessIssue = await databases.createDocument(
      databaseId,
      accessIssuesCollectionId,
      ID.unique(),
      {
        workOrderId,
        issueType,
        description,
        attendanceCommenced,
        travelCommenced,
        issueDiscoveredAt: new Date().toISOString(),
        accessIssueFeeExGst,
        gstAmount,
        totalIncGst,
        reattendanceRequired,
        waived,
        waiverReason,
        createdBy: req.headers['x-appwrite-user-id']
      }
    );

    // 4. Update Original Work Order status
    await databases.updateDocument(
      databaseId,
      workOrdersCollectionId,
      workOrderId,
      {
        status: 'access_issue',
        accessIssueFeeExGst: (workOrder.accessIssueFeeExGst || 0) + accessIssueFeeExGst,
        totalPriceExGst: (workOrder.totalPriceExGst || 0) + accessIssueFeeExGst,
        totalPriceIncGst: (workOrder.totalPriceIncGst || 0) + totalIncGst,
        gstAmount: (workOrder.gstAmount || 0) + gstAmount
      }
    );

    // 5. Create Status History
    await databases.createDocument(
      databaseId,
      statusHistoryCollectionId,
      ID.unique(),
      {
        workOrderId,
        fromStatus: workOrder.status,
        toStatus: 'access_issue',
        actorId: req.headers['x-appwrite-user-id'],
        reason: issueType,
        createdAt: new Date().toISOString()
      }
    );

    let newWorkOrder = null;
    // 6. If Re-attendance Required, create new Work Order
    if (reattendanceRequired) {
      const { $id, $permissions, $collectionId, $databaseId, $createdAt, $updatedAt, workOrderNumber, ...woData } = workOrder;

      newWorkOrder = await databases.createDocument(
        databaseId,
        workOrdersCollectionId,
        ID.unique(),
        {
          ...woData,
          workOrderNumber: `${workOrderNumber}-RE`,
          status: 'pending_acceptance',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      );

      // Link re-attendance
      await databases.updateDocument(
        databaseId,
        accessIssuesCollectionId,
        accessIssue.$id,
        {
          reattendanceWorkOrderId: newWorkOrder.$id
        }
      );
    }

    // 7. Audit Log
    await databases.createDocument(
      databaseId,
      auditLogsCollectionId,
      ID.unique(),
      {
        actorId: req.headers['x-appwrite-user-id'],
        action: 'access_issue_created',
        entityType: 'workOrder',
        entityId: workOrderId,
        metadata: JSON.stringify({ accessIssueId: accessIssue.$id, reattendanceWorkOrderId: newWorkOrder?.$id }),
        createdAt: new Date().toISOString()
      }
    );

    return res.json({
      success: true,
      accessIssue,
      newWorkOrder
    });

  } catch (err) {
    error(err.message);
    return res.json({ error: err.message }, 500);
  }
};
