import { Base } from 'airtable'
import { AdapterSession } from 'next-auth/adapters'
import {
  getSessionBySessionToken,
  getRecordFields,
  getRecordsFields,
} from './utils'

export interface AirtableSession extends Omit<AdapterSession, 'expires'> {
  expires: string
}

export default function Session(base: Base) {
  const table = base.table('Session')

  return {
    getSessionBySessionToken: getSessionBySessionToken(table),

    createSession: async ({
      sessionToken,
      userId,
      expires,
    }: Omit<AdapterSession, 'id'>) => {
      const sessionFields = {
        sessionToken,
        userId: [userId],
        expires: expires.toISOString(),
      }
      return <Promise<AdapterSession>>table
        .create([{ fields: sessionFields }])
        .then(getRecordsFields)
        .then((fields) => ({
          ...fields,
          userId: userId[0],
          expires: new Date(expires),
        }))
    },

    updateSession: async (newSession: Partial<AdapterSession>) => {
      const { sessionToken } = newSession
      if (!sessionToken) return null
      const session = await getSessionBySessionToken(table)(sessionToken)
      if (!session?.id) return null
      return <Promise<AirtableSession | null>>table
        .update(session.id, {
          ...newSession,
          expires: newSession.expires?.toISOString(),
        })
        .then(getRecordFields)
        .catch((_e) => null)
    },

    getSession: (sessionId: string) => <Promise<AdapterSession | null>>table
        .find(sessionId)
        .then(getRecordFields)
        .then((fields) => {
          if (!fields || !fields.expires) return null
          return {
            sessionToken: fields.sessionToken,
            userId: Array.isArray(fields.userId)
              ? fields?.userId[0]
              : fields.userId,
            expires: new Date(fields.expires.toString()),
          }
        })
        .catch((e) => {
          if (e.error === 'NOT_FOUND') return null
          throw e
        }),

    deleteSession: (sessionId: string) => table.destroy(sessionId),
  }
}
