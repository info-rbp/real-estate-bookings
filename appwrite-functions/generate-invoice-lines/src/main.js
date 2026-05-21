const { Client, Databases, ID, Query } = require('node-appwrite');

module.exports = async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_FUNCTION_API_KEY);

  const databases = new Databases(client);
  const databaseId = process.env.APPWRITE_DATABASE_ID;
  const workOrdersCollectionId = 'bookings';
  const invoiceLinesCollectionId = 'invoiceLines';
  const auditLogsCollectionId = 'auditLogs';

  if (req.method !== 'POST') {
    return res.json({ error: 'Method not allowed' }, 405);
  }

  try {
    const { clientId, workOrderIds } = JSON.parse(req.body);

    if (!clientId) {
      return res.json({ error: 'Client ID is required' }, 400);
    }

    // Query eligible Work Orders
    let queries = [
      Query.equal('clientId', clientId),
      Query.equal('invoiceStatus', 'pending'), // Assuming default is pending or null
      Query.or([
        Query.equal('status', 'completed'),
        Query.equal('status', 'report_delivered')
      ])
    ];

    if (workOrderIds && workOrderIds.length > 0) {
      queries.push(Query.equal('$id', workOrderIds));
    }

    const workOrders = await databases.listDocuments(databaseId, workOrdersCollectionId, queries);

    const generatedLines = [];
    const now = new Date();

    // Payment Cycle Logic
    // Thursday 12:00 PM Perth is Thursday 04:00 AM UTC (Perth is UTC+8)
    // We'll simplify to node's local time assuming environment is Perth or we use offsets
    const isAfterThursdayNoon = now.getUTCDay() > 4 || (now.getUTCDay() === 4 && now.getUTCHours() >= 4);

    const paymentCycleDate = new Date();
    if (isAfterThursdayNoon) {
      // Next Friday
      paymentCycleDate.setUTCDate(now.getUTCDate() + (12 - now.getUTCDay()) % 7 + 7);
    } else {
      // Upcoming Friday
      paymentCycleDate.setUTCDate(now.getUTCDate() + (5 - now.getUTCDay() + 7) % 7);
    }
    paymentCycleDate.setUTCHours(0, 0, 0, 0);

    for (const wo of workOrders.documents) {
      const line = await databases.createDocument(
        databaseId,
        invoiceLinesCollectionId,
        ID.unique(),
        {
          clientId: wo.clientId,
          workOrderId: wo.$id,
          serviceType: wo.serviceType,
          description: `${wo.serviceType} at ${wo.propertyAddress}`,
          propertyAddress: wo.propertyAddress,
          region: wo.region,
          pricingClassification: wo.pricingClassification,
          quantity: 1,
          unitPriceExGst: wo.basePriceExGst,
          subtotalExGst: wo.totalPriceExGst,
          gstAmount: wo.gstAmount,
          totalIncGst: wo.totalPriceIncGst,
          lineStatus: 'generated',
          paymentCycleDate: paymentCycleDate.toISOString(),
          createdAt: now.toISOString()
        }
      );

      // Update WO status
      await databases.updateDocument(
        databaseId,
        workOrdersCollectionId,
        wo.$id,
        {
          invoiceStatus: 'invoiced',
          updatedAt: now.toISOString()
        }
      );

      generatedLines.push(line);

      // Audit
      await databases.createDocument(
        databaseId,
        auditLogsCollectionId,
        ID.unique(),
        {
          actorId: req.headers['x-appwrite-user-id'],
          action: 'invoice_line_generated',
          entityType: 'workOrder',
          entityId: wo.$id,
          metadata: JSON.stringify({ invoiceLineId: line.$id }),
          createdAt: now.toISOString()
        }
      );
    }

    return res.json({ success: true, count: generatedLines.length, lines: generatedLines });

  } catch (err) {
    error(err.message);
    return res.json({ error: err.message }, 500);
  }
};
