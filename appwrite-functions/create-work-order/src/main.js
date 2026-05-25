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
    return null;
  }
}

module.exports = async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(env('APPWRITE_ENDPOINT', 'APPWRITE_FUNCTION_API_ENDPOINT', 'APPWRITE_FUNCTION_ENDPOINT'))
    .setProject(env('APPWRITE_PROJECT_ID', 'APPWRITE_FUNCTION_PROJECT_ID'))
    .setKey(env('APPWRITE_API_KEY', 'APPWRITE_FUNCTION_API_KEY'));

  const databases = new Databases(client);

  const databaseId = env('APPWRITE_DATABASE_ID', 'VITE_APPWRITE_DATABASE_ID');
  const usersCollectionId = env('USERS_COLLECTION_ID', 'APPWRITE_USERS_COLLECTION_ID', 'VITE_APPWRITE_USERS_COLLECTION_ID');
  const bookingsCollectionId = env('BOOKINGS_COLLECTION_ID', 'APPWRITE_BOOKINGS_COLLECTION_ID', 'VITE_APPWRITE_BOOKINGS_COLLECTION_ID');
  const auditLogsCollectionId = env('AUDIT_LOGS_COLLECTION_ID', 'APPWRITE_AUDIT_LOGS_COLLECTION_ID', 'VITE_APPWRITE_AUDIT_LOGS_COLLECTION_ID');
  const contactsCollectionId = env('WORK_ORDER_CONTACTS_COLLECTION_ID', 'APPWRITE_WORK_ORDER_CONTACTS_COLLECTION_ID', 'VITE_APPWRITE_WORK_ORDER_CONTACTS_COLLECTION_ID');
  const statusHistoryCollectionId = env('WORK_ORDER_STATUS_HISTORY_COLLECTION_ID', 'APPWRITE_WORK_ORDER_STATUS_HISTORY_COLLECTION_ID', 'VITE_APPWRITE_WORK_ORDER_STATUS_HISTORY_COLLECTION_ID');
  const rateCardItemsCollectionId = env('RATE_CARD_ITEMS_COLLECTION_ID', 'APPWRITE_RATE_CARD_ITEMS_COLLECTION_ID', 'VITE_APPWRITE_RATE_CARD_ITEMS_COLLECTION_ID');
  const rateCardsCollectionId = env('RATE_CARDS_COLLECTION_ID', 'APPWRITE_RATE_CARDS_COLLECTION_ID', 'VITE_APPWRITE_RATE_CARDS_COLLECTION_ID');
  const bookingServiceDetailsCollectionId = env('BOOKING_SERVICE_DETAILS_COLLECTION_ID', 'APPWRITE_BOOKING_SERVICE_DETAILS_COLLECTION_ID', 'VITE_APPWRITE_BOOKING_SERVICE_DETAILS_COLLECTION_ID');
  const bookingPropertiesCollectionId = env('BOOKING_PROPERTIES_COLLECTION_ID', 'APPWRITE_BOOKING_PROPERTIES_COLLECTION_ID', 'VITE_APPWRITE_BOOKING_PROPERTIES_COLLECTION_ID');

  async function getCollectionInfo(collectionId) {
    const attributes = await databases.listAttributes(databaseId, collectionId);
    const statusAttribute = attributes.attributes.find((attribute) => attribute.key === 'status');
    return {
      attributes: new Set(attributes.attributes.map((attribute) => attribute.key)),
      statusValues: statusAttribute?.elements || [],
    };
  }

  function pickSchemaSafe(data, attributes) {
    const safe = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null && attributes.has(key)) safe[key] = value;
    }
    return safe;
  }

  function validStatus(preferred, statusValues, fallback = 'pending_acceptance') {
    if (statusValues.includes(preferred)) return preferred;
    if (statusValues.includes(fallback)) return fallback;
    if (statusValues.includes('submitted')) return 'submitted';
    if (statusValues.includes('pending')) return 'pending';
    return statusValues[0] || fallback;
  }

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
  const payload = parseBody(req.body);
  if (!payload) {
    return res.json({ error: 'INVALID_JSON' }, 400);
  }

  const requiredFields = ['serviceId', 'propertyAddress', 'propertyPostcode', 'hasLegalAuthority', 'pricingClassification'];
  for (const field of requiredFields) {
    if (!payload[field]) {
      return res.json({ error: 'VALIDATION_FAILED', fields: { [field]: 'Field is required' } }, 400);
    }
  }

  if (payload.calendarRequired && (!payload.calendarEventStart || !payload.calendarEventEnd) && payload.submitForReviewDueToNoCalendarSlots !== true) {
    return res.json({ error: 'VALIDATION_FAILED', fields: { calendarEventStart: 'Calendar slot is required for this service' } }, 400);
  }

  if (payload.serviceType === 'open_for_inspection') {
    if (!Array.isArray(payload.ofiProperties) || payload.ofiProperties.length < 1 || payload.ofiProperties.length > 10) {
      return res.json({ error: 'VALIDATION_FAILED', fields: { ofiProperties: 'Open For Inspection requires 1 to 10 properties' } }, 400);
    }
    for (const [index, property] of payload.ofiProperties.entries()) {
      for (const field of ['propertyAddress', 'propertySuburb', 'propertyPostcode', 'accessMethod', 'accessInstructions']) {
        if (!property[field]) {
          return res.json({ error: 'VALIDATION_FAILED', fields: { [`ofiProperties.${index}.${field}`]: 'Field is required' } }, 400);
        }
      }
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

  let bookingsInfo;
  try {
    bookingsInfo = await getCollectionInfo(bookingsCollectionId);
  } catch (err) {
    error('Error inspecting bookings collection: ' + err.message);
    return res.json({ error: 'INTERNAL_ERROR', message: err.message }, 500);
  }

  let status = requiresQuote ? 'quote_required' : 'pending_acceptance';
  if (payload.serviceType === 'open_for_inspection') status = 'pending_scheduling';
  if (payload.pricingClassification === 'outside_service_area') status = 'quote_required';
  if (payload.serviceType === 'maintenance_requests' && ['urgent', 'emergency'].includes(payload.bookingServiceDetails?.urgencyLevel)) status = 'pending_acceptance';
  if (payload.serviceType === 'insurance_claims_management' && (payload.bookingServiceDetails?.quoteRequired || payload.bookingServiceDetails?.scopeIncomplete)) status = 'quote_required';
  status = validStatus(status, bookingsInfo.statusValues);

  // 5. Generate Work Order Number
  const date = new Date();
  const yearMonth = date.getFullYear().toString() + (date.getMonth() + 1).toString().padStart(2, '0');
  const shortId = ID.unique().substring(0, 8).toUpperCase();
  const workOrderNumber = `ROT-WO-${yearMonth}-${shortId}`;

  // 6. Create Work Order
  let workOrder;
  try {
    const bookingDocument = pickSchemaSafe({
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
      scheduledStart: payload.calendarEventStart,
      scheduledEnd: payload.calendarEventEnd,
      durationMinutes: payload.durationMinutes || undefined,
      status,
      hasLegalAuthority: Boolean(payload.hasLegalAuthority),
      authorityConfirmedBy: payload.authorityConfirmedBy || profile.full_name,
      authorityConfirmedAt: new Date().toISOString(),
      basePriceExGst,
      travelSurchargeExGst: 0,
      totalPriceExGst,
      totalPriceIncGst,
      gstAmount,
      requiresQuote,
      urgentFlag: Boolean(payload.bookingServiceDetails?.urgencyLevel === 'urgent' || payload.bookingServiceDetails?.urgencyLevel === 'emergency'),
      notes: payload.bookerNotes,
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
    }, bookingsInfo.attributes);

    workOrder = await databases.createDocument(databaseId, bookingsCollectionId, ID.unique(), bookingDocument);
  } catch (err) {
    error('Error creating work order: ' + err.message);
    return res.json({ error: 'INTERNAL_ERROR', message: err.message }, 500);
  }

  if (bookingServiceDetailsCollectionId && payload.bookingServiceDetails && typeof payload.bookingServiceDetails === 'object') {
    try {
      const info = await getCollectionInfo(bookingServiceDetailsCollectionId);
      await databases.createDocument(databaseId, bookingServiceDetailsCollectionId, ID.unique(), pickSchemaSafe({
        bookingId: workOrder.$id,
        serviceType: payload.serviceType,
        detailsJson: JSON.stringify(payload.bookingServiceDetails),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, info.attributes));
    } catch (e) {
      error('Error creating booking service details: ' + e.message);
    }
  }

  if (bookingPropertiesCollectionId && payload.serviceType === 'open_for_inspection') {
    try {
      const info = await getCollectionInfo(bookingPropertiesCollectionId);
      for (const [index, property] of payload.ofiProperties.entries()) {
        await databases.createDocument(databaseId, bookingPropertiesCollectionId, ID.unique(), pickSchemaSafe({
          bookingId: workOrder.$id,
          sequence: index + 1,
          propertyAddress: property.propertyAddress,
          propertySuburb: property.propertySuburb,
          propertyPostcode: property.propertyPostcode,
          listingUrl: property.listingUrl,
          preferredOpenDate: property.preferredOpenDate,
          preferredOpenStartTime: property.preferredOpenStartTime,
          preferredOpenDurationMinutes: property.preferredOpenDurationMinutes,
          accessMethod: property.accessMethod,
          accessInstructions: property.accessInstructions,
          lockboxCode: property.lockboxCode,
          keyCollectionDetails: property.keyCollectionDetails,
          parkingDetails: property.parkingDetails,
          tenantOccupied: property.tenantOccupied,
          tenantContactName: property.tenantContactName,
          tenantContactPhone: property.tenantContactPhone,
          notes: property.notes,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }, info.attributes));
      }
    } catch (e) {
      error('Error creating booking property rows: ' + e.message);
    }
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
  try {
    const statusHistoryInfo = await getCollectionInfo(statusHistoryCollectionId);
    await databases.createDocument(databaseId, statusHistoryCollectionId, ID.unique(), pickSchemaSafe({
      workOrderId: workOrder.$id,
      fromStatus: 'draft',
      toStatus: workOrder.status,
      actorId: userId,
      actorRole: profile.role,
      reason: 'Initial submission',
      createdAt: new Date().toISOString()
    }, statusHistoryInfo.attributes));
  } catch (e) {
    error('Error creating status history: ' + e.message);
  }

  try {
    const auditInfo = await getCollectionInfo(auditLogsCollectionId);
    await databases.createDocument(databaseId, auditLogsCollectionId, ID.unique(), pickSchemaSafe({
      actorId: userId,
      actorRole: profile.role,
      clientId: profile.clientId,
      action: 'CREATE_WORK_ORDER',
      entityType: 'workOrder',
      entityId: workOrder.$id,
      metadata: JSON.stringify({ workOrderNumber }),
      createdAt: new Date().toISOString()
    }, auditInfo.attributes));
  } catch (e) {
    error('Error creating audit log: ' + e.message);
  }

  return res.json(workOrder);
};
