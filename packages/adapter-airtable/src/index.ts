import {
  Adapter,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "next-auth/adapters"
import Airtable, { FieldSet } from "airtable"
import {
  AirtableUser,
  AirtableAdapterOptions,
  AirtableVerification,
  getUserById,
  getRecordFields,
  getRecordsFields,
  getSessionBySessionToken,
  convertAirtableUserToAdapterUser,
} from "./utils"

export function AirtableAdapter({
  apiKey,
  baseId,
}: AirtableAdapterOptions): Adapter {
  const airtable = new Airtable({ apiKey })
  const base = airtable.base(baseId)
  const userTable = base.table("User")
  const accountTable = base.table("Account")
  const sessionTable = base.table("Session")
  const verificationTable = base.table("VerificationToken")

  return {
    async createUser(user) {
      const {
        name,
        email,
        image,
        emailVerified,
      }: {
        name?: string
        email?: string
        image?: string
        emailVerified?: Date | null
      } = user
      const userFields = {
        name,
        email,
        image,
        emailVerified: emailVerified?.toISOString(),
      }

      return userTable
        .create(userFields)
        .then((r) => <AirtableUser>(<unknown>getRecordFields(r)))
        .then((d) => ({
          ...d,
          emailVerified: d.emailVerified
            ? new Date(d.emailVerified?.toString())
            : null,
        }))
    },

    async getUser(id) {
      return getUserById(userTable)(id)
    },

    async getUserByEmail(email) {
      return userTable
        .select({ filterByFormula: `{email}='${email}'` })
        .all()
        .then((r) => <AirtableUser>(<unknown>getRecordsFields(r)))
        .then(convertAirtableUserToAdapterUser)
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const user = await accountTable
        .select({
          filterByFormula: `AND({providerAccountId}='${providerAccountId}', {provider}='${provider}')`,
        })
        .all()
        .then(getRecordsFields)
      const { userId } = user || {}
      if (!userId) return null
      return getUserById(userTable)(userId.toString())
    },

    async updateUser(user) {
      const { id = "", ...userFields } = user
      await (<Promise<AdapterUser>>(
        userTable
          .update(id, <Partial<FieldSet>>userFields)
          .then(getRecordFields)
      ))
      return userTable
        .find(id)
        .then((r) => <AirtableUser>(<unknown>getRecordFields(r)))
        .then((d) => ({
          ...d,
          emailVerified: d.emailVerified
            ? new Date(d.emailVerified?.toString())
            : null,
        }))
    },

    async deleteUser(userId) {
      if (!userId) return null
      await sessionTable
        .select({ filterByFormula: `{userId}='${userId}'` })
        .all()
        .then((records) =>
          Promise.all(records.map((record) => record.destroy()))
        )
      await accountTable
        .select({ filterByFormula: `{userId}='${userId}'` })
        .all()
        .then((records) =>
          Promise.all(records.map((record) => record.destroy()))
        )
      await userTable
        .destroy(userId)
        .then((fields) => ({ ...fields, Account: undefined }))
    },

    async linkAccount(account) {
      const accountFields = { ...account, userId: [account.userId] }
      await accountTable
        .create([{ fields: accountFields }])
        .then(getRecordsFields)
    },

    async unlinkAccount({ providerAccountId, provider }) {
      const account = await accountTable
        .select({
          filterByFormula: `AND({providerAccountId}='${providerAccountId}', {provider}='${provider}')`,
        })
        .all()
        .then(getRecordsFields)
      const { id } = account || {}
      if (!id) return
      await accountTable.destroy(id.toString())
    },

    async createSession(session) {
      const sessionFields = {
        sessionToken: session.sessionToken,
        userId: [session.userId],
        expires: session.expires.toISOString(),
      }
      return <Promise<AdapterSession>>sessionTable
        .create([{ fields: sessionFields }])
        .then(getRecordsFields)
        .then((fields) => ({
          ...fields,
          userId: sessionFields.userId,
          expires: new Date(sessionFields.expires),
        }))
    },

    async getSessionAndUser(sessionToken) {
      const session = await getSessionBySessionToken(sessionTable)(sessionToken)
      if (!session) return null
      const user = await getUserById(userTable)(session.userId)
      if (!user) return null
      return {
        session,
        user,
      }
    },

    async updateSession(newSession) {
      const { sessionToken } = newSession
      if (!sessionToken) return null
      const session = await getSessionBySessionToken(sessionTable)(sessionToken)
      if (!session?.id) return null
      return <Promise<AdapterSession | null>>sessionTable
        .update(session.id, {
          ...newSession,
          expires: newSession.expires?.toISOString(),
        })
        .then(getRecordFields)
        .catch((_e) => null)
    },

    async deleteSession(sessionToken) {
      const sessionId = (
        await getSessionBySessionToken(sessionTable)(sessionToken)
      )?.id
      if (!sessionId) return null
      await sessionTable.destroy(sessionId)
    },

    async createVerificationToken(data) {
      const verifier = await (<Promise<VerificationToken>>(
        verificationTable
          .create([
            { fields: { ...data, expires: data.expires.toISOString() } },
          ])
          .then(getRecordsFields)
      ))

      if (!verifier) return null
      const { expires, identifier, token } = verifier
      return {
        token,
        identifier,
        expires,
      }
    },

    async useVerificationToken({ identifier, token }) {
      const verifier = await (<Promise<AirtableVerification | null>>(
        verificationTable
          .select({
            filterByFormula: `AND({token}='${token}', {identifier}='${identifier}')`,
          })
          .all()
          .then(getRecordsFields)
          .then((fields) => {
            if (!fields) return null
            return {
              id: fields.id,
              token: fields.token,
              identifier: fields.identifier,
              expires: new Date(<string>fields.expires),
            }
          })
      ))
      if (!verifier?.id) return null
      await verificationTable.destroy(verifier.id)
      return {
        token: verifier.token,
        identifier: verifier.identifier,
        expires: verifier.expires,
      }
    },
  }
}
