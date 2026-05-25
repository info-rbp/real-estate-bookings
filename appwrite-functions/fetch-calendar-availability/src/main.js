module.exports = async ({ req, res, log, error }) => {
  try {
    const { staffId, dateFrom, dateTo, timezone = 'Australia/Perth' } = JSON.parse(req.body || '{}');

    if (dateFrom && Number.isNaN(new Date(dateFrom).getTime())) {
      return res.json({ error: 'dateFrom is invalid' }, 400);
    }

    if (dateTo && Number.isNaN(new Date(dateTo).getTime())) {
      return res.json({ error: 'dateTo is invalid' }, 400);
    }

    if (!process.env.GOOGLE_CALENDAR_CLIENT_ID || !process.env.GOOGLE_CALENDAR_CLIENT_SECRET) {
      log(`Calendar integration not configured. Returning empty slots for ${staffId || 'unassigned'} in ${timezone}.`);
      return res.json({
        slots: [],
        integrationConfigured: false,
        message: 'Calendar availability is not configured yet.'
      });
    }

    return res.json({
      slots: [],
      integrationConfigured: true,
      message: 'Google Calendar integration scaffold is deployed, but slot calculation is not implemented yet.'
    });

  } catch (err) {
    error(err.message);
    return res.json({ slots: [], error: 'Unable to fetch calendar availability.' }, 200);
  }
};
