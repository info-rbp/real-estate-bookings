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
  const contactsCollectionId = process.env.VITE_APPWRITE_WORK_ORDER_CONTACTS_COLLECTION_ID;
  const statusHistoryCollectionId = process.env.VITE_APPWRITE_WORK_ORDER_STATUS_HISTORY_COLLECTION_ID;
  const rateCardItemsCollectionId = process.env.VITE_APPWRITE_RATE_CARD_ITEMS_COLLECTION_ID;
  const rateCardsCollectionId = process.env.VITE_APPWRITE_RATE_CARDS_COLLECTION_ID;

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
    if (profiles.total === 0) {
      return res.json({ error: 'PROFILE_NOT_FOUND' }, 404);
    }
    profile = profiles.documents[0];
  } catch (err) {
    error('Error loading profile: ' + err.message);
    return res.json({ error: 'INTERNAL_ERROR' }, 500);
  }

  if (profile.status === 'disabled' || profile.status === 'pending') {
    return res.json({ error: 'ACCOUNT_NOT_ACTIVE' }, 403);
  }

  // 3. Validate payload
  const payload = JSON.parse(req.body);
  const requiredFields = ['serviceId', 'propertyAddress', 'propertyPostcode', 'hasLegalAuthority', 'pricingClassification'];
  for (const field of requiredFields) {
    if (!payload[field]) {
      return res.json({ error: 'VALIDATION_FAILED', fields: { [field]: 'Field is required' } }, 400);
    }
  }

  // 4. Server-side Pricing Calculation
  let basePriceExGst = 0;
  let requiresQuote = payload.outsideServiceArea || payload.pricingClassification === 'outside_service_area';

  if (!requiresQuote) {
    try {
      // Find active rate card for client
      const rateCards = await databases.listDocuments(databaseId, rateCardsCollectionId, [
        Query.equal('clientId', profile.clientId),
        Query.equal('status', 'active'),
        Query.limit(1)
      ]);

      const rateCardId = rateCards.documents[0]?.$id;
      if (rateCardId) {
        const items = await databases.listDocuments(databaseId, rateCardItemsCollectionId, [
          Query.equal('rateCardId', rateCardId),
          Query.equal('serviceType', payload.serviceType),
          Query.equal('pricingClassification', payload.pricingClassification),
          Query.limit(1)
        ]);

        if (items.total > 0) {
          basePriceExGst = items.documents[0].priceExGst;
          requiresQuote = items.documents[0].requiresQuote;
        }
      }
    } catch (err) {
      error('Pricing calculation error: ' + err.message);
      // Fallback or error
    }
  }

  const gstAmount = basePriceExGst * 0.1;
  const totalPriceExGst = basePriceExGst;
  const totalPriceIncGst = basePriceExGst + gstAmount;

  // 5. Generate Work Order Number
  const date = new Date();
  const yearMonth = date.getFullYear().toString() + (date.getMonth() + 1).toString().padStart(2, '0');
  const shortId = ID.unique().substring(0, 8).toUpperCase();
  const workOrderNumber = `BP-WO-${yearMonth}-${shortId}`;

  // 6. Create Work Order
  let workOrder;
  try {
    workOrder = await databases.createDocument(databaseId, bookingsCollectionId, ID.unique(), {
      workOrderNumber,
      appwriteUserId: userId,
      clientId: profile.clientId,
      serviceId: payload.serviceId,
      serviceType: payload.serviceType,
      propertyAddress: payload.propertyAddress,
      propertySuburb: payload.propertySuburb,
      propertyPostcode: payload.propertyPostcode,
      propertyState: payload.propertyState || 'WA',
      region: payload.region,
      pricingClassification: payload.pricingClassification,
      serviceAreaMatched: payload.serviceAreaMatched,
      outsideServiceArea: payload.outsideServiceArea,
      requestedAttendanceDate: payload.requestedAttendanceDate,
      requestedAttendanceWindowStart: payload.requestedAttendanceWindowStart,
      requestedAttendanceWindowEnd: payload.requestedAttendanceWindowEnd,
      status: requiresQuote ? 'quote_required' : 'pending_acceptance',
      hasLegalAuthority: true,
      authorityConfirmedBy: profile.full_name,
      authorityConfirmedAt: new Date().toISOString(),
      basePriceExGst,
      totalPriceExGst,
      totalPriceIncGst,
      gstAmount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Capture all other fields from payload if they exist in schema
      accessMethod: payload.accessMethod,
      accessInstructions: payload.accessInstructions,
      lockboxCode: payload.lockboxCode,
      alarmDetails: payload.alarmDetails,
      gateAccess: payload.gateAccess,
      parkingDetails: payload.parkingDetails,
      keyCollectionDetails: payload.keyCollectionDetails,
      knownSafetyRisks: payload.knownSafetyRisks,
      animalsAtProperty: payload.animalsAtProperty,
      hazards: payload.hazards,
      accessLimitations: payload.accessLimitations,
      sensitiveCircumstances: payload.sensitiveCircumstances,
      requiredTemplate: payload.requiredTemplate,
      requiredSystem: payload.requiredSystem,
      uploadDestination: payload.uploadDestination,
      specificPhotosRequired: payload.specificPhotosRequired,
      specificNotesRequired: payload.specificNotesRequired,
      specificQuestionsRequired: payload.specificQuestionsRequired,
      reportingRequirements: payload.reportingRequirements,
      timingRestrictions: payload.timingRestrictions
    });
  } catch (err) {
    error('Error creating work order: ' + err.message);
    return res.json({ error: 'INTERNAL_ERROR', message: err.message }, 500);
  }

  // 7. Create Contacts
  if (payload.contacts && Array.isArray(payload.contacts)) {
    for (const contact of payload.contacts) {
      try {
        await databases.createDocument(databaseId, contactsCollectionId, ID.unique(), {
          workOrderId: workOrder.$id,
          ...contact,
          createdAt: new Date().toISOString()
        });
      } catch (e) {
        error('Error creating contact: ' + e.message);
      }
    }
  }

  // 8. Audit Log & Status History
  await databases.createDocument(databaseId, statusHistoryCollectionId, ID.unique(), {
    workOrderId: workOrder.$id,
    fromStatus: 'draft',
    toStatus: workOrder.status,
    actorId: userId,
    actorRole: profile.role,
    reason: 'Initial submission',
    createdAt: new Date().toISOString()
  });

  await databases.createDocument(databaseId, auditLogsCollectionId, ID.unique(), {
    actorId: userId,
    actorRole: profile.role,
    clientId: profile.clientId,
    action: 'CREATE_WORK_ORDER',
    entityType: 'workOrder',
    entityId: workOrder.$id,
    metadata: JSON.stringify({ workOrderNumber }),
    createdAt: new Date().toISOString()
  });

  return res.json(workOrder);
};
