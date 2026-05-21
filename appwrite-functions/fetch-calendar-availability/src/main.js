const { Client, Databases, Query } = require('node-appwrite');

module.exports = async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_FUNCTION_API_KEY);

  const databases = new Databases(client);

  // Payload: { staffId, dateFrom, dateTo, timezone }
  // Since we don't have real Google credentials yet, this returns mock data
  // but is architected to be swapped with real Google Calendar API calls.

  try {
    const { staffId, dateFrom, dateTo, timezone = 'Australia/Perth' } = JSON.parse(req.body || '{}');

    // Real implementation would:
    // 1. Fetch calendar connection for staffId
    // 2. Refresh OAuth token if needed
    // 3. Call Google Calendar freebusy or list events
    // 4. Calculate available slots

    // Mock response for now (to be replaced by real Google logic)
    const slots = [
      { start: '2026-05-28T09:00:00+08:00', end: '2026-05-28T10:00:00+08:00', available: true },
      { start: '2026-05-28T10:00:00+08:00', end: '2026-05-28T11:00:00+08:00', available: true },
      { start: '2026-05-28T13:00:00+08:00', end: '2026-05-28T14:00:00+08:00', available: true },
      { start: '2026-05-29T09:00:00+08:00', end: '2026-05-29T10:00:00+08:00', available: true },
      { start: '2026-05-29T11:00:00+08:00', end: '2026-05-29T12:00:00+08:00', available: true }
    ];

    return res.json({ slots });

  } catch (err) {
    error(err.message);
    return res.json({ error: err.message }, 500);
  }
};
