const SAFE_PROFILE_FIELDS = [
  'full_name',
  'phone',
  'timezone',
  'email_notifications',
  'sms_notifications',
  'avatar_url',
]

const DENIED_PROFILE_FIELDS = [
  'role',
  'clientId',
  'appwriteUserId',
  'status',
  'email',
  'two_factor_enabled',
]

function pickSafeProfileUpdates(input) {
  const safe = {}
  const denied = []

  for (const [key, value] of Object.entries(input || {})) {
    if (DENIED_PROFILE_FIELDS.includes(key)) {
      denied.push(key)
      continue
    }

    if (SAFE_PROFILE_FIELDS.includes(key)) {
      safe[key] = value
    }
  }

  if (typeof safe.full_name === 'string') safe.full_name = safe.full_name.trim()
  if (typeof safe.phone === 'string') safe.phone = safe.phone.trim()
  if (typeof safe.timezone === 'string') safe.timezone = safe.timezone.trim()
  if (typeof safe.avatar_url === 'string') safe.avatar_url = safe.avatar_url.trim()

  return { safe, denied }
}

function validateSafeProfileUpdates(updates) {
  if (updates.full_name !== undefined && (typeof updates.full_name !== 'string' || updates.full_name.length < 2)) {
    return 'full_name must be at least 2 characters.'
  }

  if (updates.phone !== undefined && updates.phone !== null && typeof updates.phone !== 'string') {
    return 'phone must be a string or null.'
  }

  if (updates.timezone !== undefined && (typeof updates.timezone !== 'string' || updates.timezone.length < 3)) {
    return 'timezone must be a valid timezone string.'
  }

  if (updates.email_notifications !== undefined && typeof updates.email_notifications !== 'boolean') {
    return 'email_notifications must be true or false.'
  }

  if (updates.sms_notifications !== undefined && typeof updates.sms_notifications !== 'boolean') {
    return 'sms_notifications must be true or false.'
  }

  if (updates.avatar_url !== undefined && updates.avatar_url !== null && typeof updates.avatar_url !== 'string') {
    return 'avatar_url must be a string or null.'
  }

  return null
}

module.exports = {
  SAFE_PROFILE_FIELDS,
  DENIED_PROFILE_FIELDS,
  pickSafeProfileUpdates,
  validateSafeProfileUpdates,
};
