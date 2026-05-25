const { Client, Databases, ID, Query } = require('node-appwrite');

function env(...names) {
  for (const name of names) {
    if (process.env[name]) return process.env[name];
  }
  return undefined;
}

function parseBody(body) {
  try {
    return JSON.parse(body || '{}');
  } catch {
    return {};
  }
}

function resolvePaymentCycleDate(inputDate) {
  if (inputDate) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(inputDate)) {
      throw new Error('paymentCycleDate must use YYYY-MM-DD format');
    }

    const explicit = new Date(`${inputDate}T00:00:00.000Z`);
    if (Number.isNaN(explicit.getTime())) {
      throw new Error('paymentCycleDate is invalid');
    }

    return explicit;
  }

  const now = new Date();
  const isAfterThursdayNoonUtc = now.getUTCDay() > 4 || (now.getUTCDay() === 4 && now.getUTCHours() >= 4);
  const paymentCycleDate = new Date(now);

  if (isAfterThursdayNoonUtc) {
    paymentCycleDate.setUTCDate(now.getUTCDate() + (12 - now.getUTCDay()) % 7 + 7);
  } else {
    paymentCycleDate.setUTCDate(now.getUTCDate() + (5 - now.getUTCDay() + 7) % 7);
  }

  paymentCycleDate.setUTCHours(0, 0, 0, 0);
  return paymentCycleDate;
}

module.exports = async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(env('APPWRITE_ENDPOINT', 'APPWRITE_FUNCTION_API_ENDPOINT', 'APPWRITE_FUNCTION_ENDPOINT'))
    .setProject(env('APPWRITE_PROJECT_ID', 'APPWRITE_FUNCTION_PROJECT_ID'))
    .setKey(env('APPWRITE_API_KEY', 'APPWRITE_FUNCTION_API_KEY'));

  const databases = new Databases(client);
  const databaseId = env('APPWRITE_DATABASE_ID', 'VITE_APPWRITE_DATABASE_ID');
  const workOrdersCollectionId = env('BOOKINGS_COLLECTION_ID', 'APPWRITE_BOOKINGS_COLLECTION_ID', 'VITE_APPWRITE_BOOKINGS_COLLECTION_ID') || 'bookings';
  const invoiceLinesCollectionId = env('INVOICE_LINES_COLLECTION_ID', 'APPWRITE_INVOICE_LINES_COLLECTION_ID', 'VITE_APPWRITE_INVOICE_LINES_COLLECTION_ID') || 'invoiceLines';
  const auditLogsCollectionId = env('AUDIT_LOGS_COLLECTION_ID', 'APPWRITE_AUDIT_LOGS_COLLECTION_ID', 'VITE_APPWRITE_AUDIT_LOGS_COLLECTION_ID') || 'auditLogs';

  if (req.method !== 'POST') {
    return res.json({ error: 'Method not allowed' }, 405);
  }

  try {
    const body = parseBody(req.body);
    if (!['all', 'client'].includes(body.scope)) {
      return res.json({ error: 'scope must be "all" or "client"' }, 400);
    }

    const scope = body.scope;
    const paymentCycleDate = resolvePaymentCycleDate(body.paymentCycleDate);

    const clientId = typeof body.clientId === 'string' ? body.clientId.trim() : '';
    if (scope === 'client' && !clientId) {
      return res.json({ error: 'clientId is required when scope is client' }, 400);
    }

    const workOrderIds = Array.isArray(body.workOrderIds) ? body.workOrderIds.filter(Boolean) : [];

    const queries = [
      Query.equal('invoiceStatus', 'pending'),
      Query.or([
        Query.equal('status', 'completed'),
        Query.equal('status', 'report_delivered')
      ])
    ];

    if (scope === 'client') {
      queries.push(Query.equal('clientId', clientId));
    }

    if (workOrderIds.length > 0) {
      queries.push(Query.equal('$id', workOrderIds));
    }

    const workOrders = await databases.listDocuments(databaseId, workOrdersCollectionId, queries);

    const generatedLines = [];
    const now = new Date();

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
          lineStatus: 'pending',
          paymentCycleDate: paymentCycleDate.toISOString(),
          createdAt: now.toISOString()
        }
      );

      await databases.updateDocument(databaseId, workOrdersCollectionId, wo.$id, {
        invoiceStatus: 'invoiced',
        updatedAt: now.toISOString()
      });

      generatedLines.push(line);

      await databases.createDocument(databaseId, auditLogsCollectionId, ID.unique(), {
        actorId: req.headers['x-appwrite-user-id'],
        action: 'invoice_line_generated',
        entityType: 'workOrder',
        entityId: wo.$id,
        metadata: JSON.stringify({ invoiceLineId: line.$id, scope }),
        createdAt: now.toISOString()
      });
    }

    return res.json({ success: true, scope, paymentCycleDate: paymentCycleDate.toISOString(), count: generatedLines.length, lines: generatedLines });
  } catch (err) {
    error(err.message);
    return res.json({ error: err.message }, 500);
  }
};
