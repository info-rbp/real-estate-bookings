import { Client, Databases } from 'node-appwrite'

const editableFields = [
  'full_name',
  'phone',
  'timezone',
  'email_notifications',
  'sms_notifications',
  'avatar_url'
]

export default async ({ req, res, log, error }) => {
  try {
    const endpoint = process.env.APPWRITE_ENDPOINT || process.env.APPWRITE_FUNCTION_API_ENDPOINT
    const projectId = process.env.APPWRITE_PROJECT_ID || process.env.APPWRITE_FUNCTION_PROJECT_ID
    const apiKey = process.env.APPWRITE_API_KEY
    const databaseId = process.env.APPWRITE_DATABASE_ID
    const usersCollectionId = process.env.USERS_COLLECTION_ID || 'users'

    if (!endpoint || !projectId || !apiKey || !databaseId) {
      return res.json({ error: 'Profile update function is not configured.' }, 500)
    }

    const userId = req.headers['x-appwrite-user-id']

    if (!userId) {
      return res.json({ error: 'Not authenticated.' }, 401)
    }

    const body = req.bodyJson || JSON.parse(req.body || '{}')
    const safeUpdate = {}

    for (const key of editableFields) {
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        safeUpdate[key] = body[key]
      }
    }

    safeUpdate.updatedAt = new Date().toISOString()

    const client = new Client()
      .setEndpoint(endpoint)
      .setProject(projectId)
      .setKey(apiKey)

    const databases = new Databases(client)

    const profile = await databases.updateDocument(
      databaseId,
      usersCollectionId,
      userId,
      safeUpdate
    )

    return res.json({ profile })
  } catch (err) {
    error(err.message)
    return res.json({ error: err.message }, 500)
  }
}
