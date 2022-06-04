import { FieldSet, Record, Records, Table } from "airtable"
import {
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "next-auth/adapters"

export interface AirtableAdapterOptions {
  apiKey: string
  baseId: string
}

export interface AirtableUser
  extends Pick<AdapterUser, "id" | "name" | "email" | "image"> {
  emailVerified: string | undefined
}

export interface AirtableSession extends Omit<AdapterSession, "expires"> {
  expires: string
}

export interface AirtableVerification extends VerificationToken {
  id: string
}

export const getRecordFields = (record: Record<FieldSet>) => record?.fields
export const getRecordsFields = (record: Records<FieldSet>) => record[0]?.fields
export const getRecordsIds = (records: Records<FieldSet>) =>
  records.map((record) => record.id)

export const getUserById = (userTable: Table<any>) => async (userId: string) =>
  userTable
    .find(userId)
    .then((r) => <AirtableUser>(<unknown>getRecordFields(r)))
    .then(convertAirtableUserToAdapterUser)
    .catch((e) => {
      if (e.error === "NOT_FOUND") return null
      throw e
    })

export const getSessionBySessionToken =
  (sessionTable: Table<any>) => (sessionToken: string) =>
    sessionTable
      .select({ filterByFormula: `{sessionToken} = '${sessionToken}'` })
      .all()
      .then((r) => <AirtableSession>(<unknown>getRecordsFields(r)))
      .then((fields) => {
        if (!fields) return null
        return {
          ...fields,
          userId: fields.userId[0],
          expires: new Date(fields.expires),
        }
      })

export const convertAirtableUserToAdapterUser = async (
  user: AirtableUser
): Promise<AdapterUser | null> => {
  if (!user) return null
  const { id, name, email, image, emailVerified } = user
  return {
    id,
    name,
    email,
    image,
    emailVerified: emailVerified ? new Date(emailVerified?.toString()) : null,
  }
}
