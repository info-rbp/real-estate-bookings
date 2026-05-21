const { Client, Databases, ID } = require('node-appwrite');

module.exports = async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_FUNCTION_API_KEY);

  const databases = new Databases(client);

  try {
    const { workOrderId, start, end, summary, description } = JSON.parse(req.body);

    // Real implementation would call Google Calendar API
    // and store externalEventId in Appwrite

    log(`Creating calendar event for Work Order ${workOrderId}`);

    return res.json({
      success: true,
      externalEventId: `google_${Date.now()}`
    });

  } catch (err) {
    error(err.message);
    return res.json({ error: err.message }, 500);
  }
};
