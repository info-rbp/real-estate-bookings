const { Client, Databases, Query } = require('node-appwrite');
const { pickSafeProfileUpdates, validateSafeProfileUpdates } = require('./safe-fields.js');

function header(req, name) {
  return req.headers?.[name] || req.headers?.[name.toLowerCase()] || req.headers?.[name.toUpperCase()]
}

function requiredEnv(name) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing ${name}`)
  return value
}

function parseJsonBody(req) {
  if (!req.body) return {}
  if (typeof req.body === 'object') return req.body
  try {
    return JSON.parse(req.body)
  } catch (e) {
    return {}
  }
}

async function getProfileDocument(databases, databaseId, usersCollectionId, appwriteUserId) {
  try {
    return await databases.getDocument(databaseId, usersCollectionId, appwriteUserId)
  } catch {
    const response = await databases.listDocuments(databaseId, usersCollectionId, [
      Query.equal('appwriteUserId', appwriteUserId),
      Query.limit(1),
    ])

    return response.documents[0] || null
  }
}

async function writeAuditLog(databases, databaseId, auditLogsCollectionId, actorId, safeUpdates, deniedFields) {
  if (!auditLogsCollectionId) return

  try {
    await databases.createDocument(databaseId, auditLogsCollectionId, 'unique()', {
      actorId,
      actorRole: 'self',
      clientId: null,
      action: 'profile.update.self',
      entityType: 'users',
      entityId: actorId,
      metadata: JSON.stringify({ updatedFields: Object.keys(safeUpdates), deniedFields }),
      createdAt: new Date().toISOString(),
    })
  } catch (auditError) {
    console.warn('profile-update audit log failed', auditError)
  }
}

module.exports = async function ({ req, res, log, error }) {
  try {
    const appwriteUserId = header(req, 'x-appwrite-user-id')
    if (!appwriteUserId) return res.json({ error: 'Authentication required.' }, 401)

    const databaseId = requiredEnv('APPWRITE_DATABASE_ID')
    const usersCollectionId = requiredEnv('APPWRITE_USERS_COLLECTION_ID')
    const auditLogsCollectionId = process.env.APPWRITE_AUDIT_LOGS_COLLECTION_ID

    const { safe, denied } = pickSafeProfileUpdates(parseJsonBody(req))
    if (denied.length > 0) log(`Denied profile fields for ${appwriteUserId}: ${denied.join(', ')}`)
    if (Object.keys(safe).length === 0) return res.json({ error: 'No safe profile fields were provided.' }, 400)

    const validationError = validateSafeProfileUpdates(safe)
    if (validationError) return res.json({ error: validationError }, 400)

    const client = new Client()
      .setEndpoint(requiredEnv('APPWRITE_ENDPOINT'))
      .setProject(requiredEnv('APPWRITE_PROJECT_ID'))
      .setKey(requiredEnv('APPWRITE_API_KEY'))

    const databases = new Databases(client)
    const existingProfile = await getProfileDocument(databases, databaseId, usersCollectionId, appwriteUserId)
    if (!existingProfile) return res.json({ error: 'Profile not found.' }, 404)

    const profile = await databases.updateDocument(databaseId, usersCollectionId, existingProfile.$id, safe)
    await writeAuditLog(databases, databaseId, auditLogsCollectionId, appwriteUserId, safe, denied)

    return res.json({ profile }, 200)
  } catch (err) {
    error(err instanceof Error ? err.message : String(err))
    return res.json({ error: 'Unable to update profile.' }, 500)
  }
}
