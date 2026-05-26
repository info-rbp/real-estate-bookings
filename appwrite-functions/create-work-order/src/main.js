const { Client, Databases, ID, Query } = require('node-appwrite');
const { JWT } = require('google-auth-library');

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

function safeJson(value) {
  try {
    return JSON.stringify(value ?? {});
  } catch {
    return '{}';
  }
}

function serviceLabel(serviceType) {
  return String(serviceType || '')
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function extractPrimaryBooker(payload, profile) {
  const contacts = Array.isArray(payload.contacts) ? payload.contacts : [];
  const explicitBooker = contacts.find((contact) => ['booker', 'requester', 'primary'].includes(String(contact.role || '').toLowerCase()));
  const firstContact = explicitBooker || contacts[0] || {};

  return {
    name: payload.bookerName || firstContact.name || firstContact.fullName || profile.full_name || profile.name || 'Booker',
    email: payload.bookerEmail || firstContact.email || profile.email || profile.userEmail,
    phone: payload.bookerPhone || firstContact.phone || firstContact.mobile || profile.phone,
  };
}

function formatAddress(payload) {
  return [payload.propertyAddress, payload.propertySuburb, payload.propertyState || 'WA', payload.propertyPostcode]
    .filter(Boolean)
    .join(', ');
}

function buildDashboardLink(workOrder) {
  const baseUrl = env('APP_URL', 'PUBLIC_SITE_URL', 'VITE_PUBLIC_SITE_URL');
  if (!baseUrl) return undefined;
  return `${baseUrl.replace(/\/$/, '')}/dashboard/bookings/${workOrder.$id}`;
}

function buildEmailBodies({ payload, profile, workOrder, booker }) {
  const serviceName = serviceLabel(payload.serviceType) || payload.serviceId || 'Booking';
  const address = formatAddress(payload) || 'Address not supplied';
  const selectedTime = payload.calendarEventStart && payload.calendarEventEnd
    ? `${payload.calendarEventStart} to ${payload.calendarEventEnd}`
    : 'Submitted for review';
  const dashboardLink = buildDashboardLink(workOrder) || 'Dashboard link unavailable';
  const details = safeJson(payload.bookingServiceDetails || {});
  const ofiCount = Array.isArray(payload.ofiProperties) ? payload.ofiProperties.length : undefined;

  const internalText = [
    `New ProInspect booking request: ${workOrder.workOrderNumber}`,
    '',
    `Service: ${serviceName}`,
    `Client: ${profile.clientName || profile.clientId || 'Unknown client'}`,
    `Booker: ${booker.name}${booker.email ? ` <${booker.email}>` : ''}${booker.phone ? ` / ${booker.phone}` : ''}`,
    `Property: ${address}`,
    `Access method: ${payload.accessMethod || 'Not supplied'}`,
    `Access notes: ${payload.accessInstructions || payload.keyCollectionDetails || 'Not supplied'}`,
    `Requested/calendar time: ${selectedTime}`,
    `Pricing classification: ${payload.pricingClassification || 'Not supplied'}`,
    `Requires quote: ${workOrder.requiresQuote ? 'Yes' : 'No'}`,
    ofiCount ? `OFI property count: ${ofiCount}` : undefined,
    '',
    'Service details JSON:',
    details,
    '',
    `Dashboard: ${dashboardLink}`,
  ].filter(Boolean).join('\n');

  const bookerText = [
    `Thanks ${booker.name},`,
    '',
    `ProInspect has received your booking request ${workOrder.workOrderNumber}.`,
    '',
    `Service: ${serviceName}`,
    `Property: ${address}`,
    `Selected time / status: ${selectedTime}`,
    '',
    workOrder.status === 'quote_required'
      ? 'This request needs pricing review before confirmation.'
      : workOrder.status === 'pending_scheduling'
        ? 'This request has been received for scheduling review.'
        : workOrder.status === 'confirmed'
          ? 'Your booking has been created and the selected attendance time has been reserved.'
          : 'The request has been saved and will be processed by ProInspect.',
    '',
    'ProInspect will follow up if more information is required.',
  ].join('\n');

  return {
    serviceName,
    address,
    internalSubject: `[ProInspect] New ${serviceName} booking - ${payload.propertySuburb || ''} ${payload.propertyPostcode || ''}`.trim(),
    bookerSubject: `ProInspect booking request received - ${serviceName}`,
    internalText,
    bookerText,
  };
}

function buildFailureAlertText({ workOrder, kind, detail, recipient }) {
  return [
    '[Action required] Booking notification or calendar event failed',
    '',
    `Work order: ${workOrder.workOrderNumber}`,
    `Failure type: ${kind}`,
    recipient ? `Recipient / target: ${recipient}` : undefined,
    detail ? `Detail: ${detail}` : undefined,
    buildDashboardLink(workOrder) ? `Dashboard: ${buildDashboardLink(workOrder)}` : undefined,
  ].filter(Boolean).join('\n');
}

async function sendWithProvider({ to, subject, text, log }) {
  const provider = String(env('EMAIL_PROVIDER') || '').toLowerCase();
  const from = env('EMAIL_FROM');

  if (!provider || !from || !to) {
    return { skipped: true, reason: 'EMAIL_PROVIDER, EMAIL_FROM or recipient missing' };
  }

  if (provider === 'resend') {
    const apiKey = env('RESEND_API_KEY');
    if (!apiKey) return { skipped: true, reason: 'RESEND_API_KEY missing' };
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: Array.isArray(to) ? to : [to], subject, text }),
    });
    const body = await response.text();
    if (!response.ok) throw new Error(`Resend failed: ${response.status} ${body}`);
    return { provider, providerMessageId: safeJson(body) };
  }

  if (provider === 'sendgrid') {
    const apiKey = env('SENDGRID_API_KEY');
    if (!apiKey) return { skipped: true, reason: 'SENDGRID_API_KEY missing' };
    const recipients = (Array.isArray(to) ? to : [to]).map((email) => ({ email }));
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ personalizations: [{ to: recipients }], from: { email: from }, subject, content: [{ type: 'text/plain', value: text }] }),
    });
    const body = await response.text();
    if (!response.ok) throw new Error(`SendGrid failed: ${response.status} ${body}`);
    return { provider, providerMessageId: response.headers.get('x-message-id') || undefined };
  }

  if (provider === 'mailgun') {
    const apiKey = env('MAILGUN_API_KEY');
    const domain = env('MAILGUN_DOMAIN');
    if (!apiKey || !domain) return { skipped: true, reason: 'MAILGUN_API_KEY or MAILGUN_DOMAIN missing' };
    const form = new URLSearchParams();
    form.append('from', from);
    form.append('to', Array.isArray(to) ? to.join(',') : to);
    form.append('subject', subject);
    form.append('text', text);
    const response = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
      method: 'POST',
      headers: { Authorization: `Basic ${Buffer.from(`api:${apiKey}`).toString('base64')}` },
      body: form,
    });
    const body = await response.text();
    if (!response.ok) throw new Error(`Mailgun failed: ${response.status} ${body}`);
    return { provider, providerMessageId: safeJson(body) };
  }

  if (provider === 'gmail') {
    const clientEmail = env('GOOGLE_CLIENT_EMAIL', 'GMAIL_CLIENT_EMAIL');
    const privateKey = env('GOOGLE_PRIVATE_KEY', 'GMAIL_PRIVATE_KEY')?.replace(/\\n/g, '\n');
    const delegatedUser = env('GMAIL_DELEGATED_USER', 'EMAIL_FROM');
    if (!clientEmail || !privateKey || !delegatedUser) return { skipped: true, reason: 'Gmail credentials missing' };
    const auth = new JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/gmail.send'],
      subject: delegatedUser,
    });
    const token = await auth.getAccessToken();
    const recipients = Array.isArray(to) ? to.join(', ') : to;
    const raw = Buffer.from([
      `From: ${from}`,
      `To: ${recipients}`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=utf-8',
      '',
      text,
    ].join('\r\n')).toString('base64url');
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token.token || token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw }),
    });
    const body = await response.text();
    if (!response.ok) throw new Error(`Gmail failed: ${response.status} ${body}`);
    return { provider, providerMessageId: safeJson(body) };
  }

  log?.(`Unknown EMAIL_PROVIDER ${provider}; notification skipped`);
  return { skipped: true, reason: `Unknown EMAIL_PROVIDER ${provider}` };
}

async function createGoogleCalendarEvent({ payload, profile, workOrder, booker }) {
  const calendarId = env('GOOGLE_CALENDAR_ID');
  const clientEmail = env('GOOGLE_CLIENT_EMAIL');
  const privateKey = env('GOOGLE_PRIVATE_KEY')?.replace(/\\n/g, '\n');
  const shouldCreateEvent = Boolean(calendarId && clientEmail && privateKey && payload.calendarEventStart && payload.calendarEventEnd && payload.serviceType !== 'open_for_inspection');

  if (!shouldCreateEvent) {
    return { skipped: true, reason: 'Calendar credentials missing, no selected slot, or OFI scheduling review' };
  }

  const auth = new JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/calendar.events'],
  });
  const token = await auth.getAccessToken();
  const serviceName = serviceLabel(payload.serviceType) || payload.serviceId || 'Booking';
  const suburb = payload.propertySuburb || 'Property';
  const dashboardLink = buildDashboardLink(workOrder);
  const address = formatAddress(payload);
  const accessSummary = [payload.accessMethod, payload.accessInstructions, payload.keyCollectionDetails]
    .filter(Boolean)
    .join(' | ');

  const event = {
    summary: `${serviceName} - ${suburb} - ${workOrder.workOrderNumber}`,
    location: address,
    description: [
      `Service: ${serviceName}`,
      `Client/agency: ${profile.clientName || profile.clientId || 'Unknown client'}`,
      `Booker: ${booker.name}${booker.email ? ` <${booker.email}>` : ''}${booker.phone ? ` / ${booker.phone}` : ''}`,
      `Access: ${accessSummary || 'Not supplied'}`,
      `Service details: ${safeJson(payload.bookingServiceDetails || {})}`,
      dashboardLink ? `Dashboard: ${dashboardLink}` : undefined,
    ].filter(Boolean).join('\n'),
    start: { dateTime: payload.calendarEventStart, timeZone: env('GOOGLE_CALENDAR_TIMEZONE') || 'Australia/Perth' },
    end: { dateTime: payload.calendarEventEnd, timeZone: env('GOOGLE_CALENDAR_TIMEZONE') || 'Australia/Perth' },
    reminders: { useDefault: true },
  };

  if (env('GOOGLE_CALENDAR_INVITE_BOOKER') === 'true' && booker.email) {
    event.attendees = [{ email: booker.email, displayName: booker.name }];
  }

  const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token.token || token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });
  const body = await response.json().catch(async () => ({ raw: await response.text() }));
  if (!response.ok) throw new Error(`Google Calendar failed: ${response.status} ${safeJson(body)}`);

  return {
    calendarId,
    eventId: body.id,
    eventLink: body.htmlLink,
    eventStart: payload.calendarEventStart,
    eventEnd: payload.calendarEventEnd,
    raw: body,
  };
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
  const bookingNotificationsCollectionId = env('BOOKING_NOTIFICATIONS_COLLECTION_ID', 'APPWRITE_BOOKING_NOTIFICATIONS_COLLECTION_ID');
  const bookingCalendarEventsCollectionId = env('BOOKING_CALENDAR_EVENTS_COLLECTION_ID', 'APPWRITE_BOOKING_CALENDAR_EVENTS_COLLECTION_ID');
  const operationsEmail = env('OPERATIONS_EMAIL_TO');
  const operationsAlertEmail = env('OPERATIONS_ALERT_EMAIL_TO') || operationsEmail;

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

  async function logNotification({ workOrder, channel, recipient, status, providerMessageId, failureReason }) {
    if (!bookingNotificationsCollectionId) return;
    try {
      const info = await getCollectionInfo(bookingNotificationsCollectionId);
      await databases.createDocument(databaseId, bookingNotificationsCollectionId, ID.unique(), pickSchemaSafe({
        bookingId: workOrder.$id,
        workOrderId: workOrder.$id,
        workOrderNumber: workOrder.workOrderNumber,
        channel,
        recipient,
        status,
        providerMessageId,
        failureReason,
        sentAt: status === 'sent' ? new Date().toISOString() : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, info.attributes));
    } catch (e) {
      error('Error logging booking notification: ' + e.message);
    }
  }

  async function sendFailureAlert({ workOrder, kind, detail, recipient }) {
    if (!operationsAlertEmail) {
      return;
    }

    try {
      const result = await sendWithProvider({
        to: operationsAlertEmail,
        subject: '[Action required] Booking notification or calendar event failed',
        text: buildFailureAlertText({ workOrder, kind, detail, recipient }),
        log,
      });

      await logNotification({
        workOrder,
        channel: 'ops_failure_alert',
        recipient: operationsAlertEmail,
        status: result.skipped ? 'skipped' : 'sent',
        providerMessageId: result.providerMessageId,
        failureReason: result.reason,
      });
    } catch (alertError) {
      error('Failure alert email failed: ' + alertError.message);
      await logNotification({
        workOrder,
        channel: 'ops_failure_alert',
        recipient: operationsAlertEmail,
        status: 'failed',
        failureReason: alertError.message,
      });
    }
  }

  async function logCalendarEvent({ workOrder, result, status, failureReason }) {
    if (bookingCalendarEventsCollectionId) {
      try {
        const info = await getCollectionInfo(bookingCalendarEventsCollectionId);
        await databases.createDocument(databaseId, bookingCalendarEventsCollectionId, ID.unique(), pickSchemaSafe({
          bookingId: workOrder.$id,
          workOrderId: workOrder.$id,
          workOrderNumber: workOrder.workOrderNumber,
          calendarId: result?.calendarId || env('GOOGLE_CALENDAR_ID'),
          eventId: result?.eventId,
          eventLink: result?.eventLink,
          eventStart: result?.eventStart,
          eventEnd: result?.eventEnd,
          status,
          failureReason,
          rawResponseJson: result?.raw ? safeJson(result.raw) : undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }, info.attributes));
      } catch (e) {
        error('Error logging calendar event: ' + e.message);
      }
    }

    try {
      const info = await getCollectionInfo(bookingsCollectionId);
      await databases.updateDocument(databaseId, bookingsCollectionId, workOrder.$id, pickSchemaSafe({
        calendarId: result?.calendarId,
        calendarEventId: result?.eventId,
        calendarEventLink: result?.eventLink,
        calendarEventStart: result?.eventStart,
        calendarEventEnd: result?.eventEnd,
        calendarEventStatus: status,
        updatedAt: new Date().toISOString(),
      }, info.attributes));
    } catch (e) {
      error('Error updating booking calendar metadata: ' + e.message);
    }
  }

  async function promoteBookingAfterCalendarCreation(workOrder, bookingsInfo) {
    const nextStatus = validStatus('confirmed', bookingsInfo.statusValues, workOrder.status);
    if (nextStatus === workOrder.status) {
      return workOrder;
    }

    try {
      const updated = await databases.updateDocument(databaseId, bookingsCollectionId, workOrder.$id, pickSchemaSafe({
        status: nextStatus,
        updatedAt: new Date().toISOString(),
      }, bookingsInfo.attributes));
      return updated;
    } catch (e) {
      error('Error promoting booking status after calendar creation: ' + e.message);
      return workOrder;
    }
  }

  const userId = req.headers['x-appwrite-user-id'];
  if (!userId) {
    return res.json({ error: 'UNAUTHORIZED' }, 401);
  }

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

  let basePriceExGst = 0;
  let requiresQuote = payload.outsideServiceArea || payload.pricingClassification === 'outside_service_area';

  if (!requiresQuote) {
    try {
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

  const date = new Date();
  const yearMonth = date.getFullYear().toString() + (date.getMonth() + 1).toString().padStart(2, '0');
  const shortId = ID.unique().substring(0, 8).toUpperCase();
  const workOrderNumber = `PRO-WO-${yearMonth}-${shortId}`;

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

  if (payload.contacts && Array.isArray(payload.contacts) && contactsCollectionId) {
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

  const booker = extractPrimaryBooker(payload, profile);
  const emailBodies = buildEmailBodies({ payload, profile, workOrder, booker });

  try {
    const result = await sendWithProvider({ to: operationsEmail, subject: emailBodies.internalSubject, text: emailBodies.internalText, log });
    await logNotification({ workOrder, channel: 'internal_new_booking', recipient: operationsEmail, status: result.skipped ? 'skipped' : 'sent', providerMessageId: result.providerMessageId, failureReason: result.reason });
    if (result.skipped) {
      await sendFailureAlert({ workOrder, kind: 'internal_new_booking', detail: result.reason, recipient: operationsEmail });
    }
  } catch (e) {
    error('Internal booking email failed: ' + e.message);
    await logNotification({ workOrder, channel: 'internal_new_booking', recipient: operationsEmail, status: 'failed', failureReason: e.message });
    await sendFailureAlert({ workOrder, kind: 'internal_new_booking', detail: e.message, recipient: operationsEmail });
  }

  try {
    const result = await sendWithProvider({ to: booker.email, subject: emailBodies.bookerSubject, text: emailBodies.bookerText, log });
    await logNotification({ workOrder, channel: 'booker_confirmation', recipient: booker.email, status: result.skipped ? 'skipped' : 'sent', providerMessageId: result.providerMessageId, failureReason: result.reason });
    if (result.skipped) {
      await sendFailureAlert({ workOrder, kind: 'booker_confirmation', detail: result.reason, recipient: booker.email });
    }
  } catch (e) {
    error('Booker confirmation email failed: ' + e.message);
    await logNotification({ workOrder, channel: 'booker_confirmation', recipient: booker.email, status: 'failed', failureReason: e.message });
    await sendFailureAlert({ workOrder, kind: 'booker_confirmation', detail: e.message, recipient: booker.email });
  }

  try {
    const calendarResult = await createGoogleCalendarEvent({ payload, profile, workOrder, booker });
    await logCalendarEvent({ workOrder, result: calendarResult, status: calendarResult.skipped ? 'skipped' : 'created', failureReason: calendarResult.reason });
    if (!calendarResult.skipped) {
      workOrder = { ...workOrder, calendarEventId: calendarResult.eventId, calendarId: calendarResult.calendarId, calendarEventLink: calendarResult.eventLink };
      if (workOrder.status === 'pending_acceptance') {
        workOrder = await promoteBookingAfterCalendarCreation(workOrder, bookingsInfo);
      }
    } else if (calendarResult.reason && calendarResult.reason.includes('credentials missing')) {
      await sendFailureAlert({ workOrder, kind: 'calendar_event', detail: calendarResult.reason, recipient: env('GOOGLE_CALENDAR_ID') || 'Google Calendar' });
    }
  } catch (e) {
    error('Calendar event creation failed: ' + e.message);
    await logCalendarEvent({ workOrder, result: undefined, status: 'failed', failureReason: e.message });
    await sendFailureAlert({ workOrder, kind: 'calendar_event', detail: e.message, recipient: env('GOOGLE_CALENDAR_ID') || 'Google Calendar' });
  }

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
