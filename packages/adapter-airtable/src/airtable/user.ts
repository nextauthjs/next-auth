import { Base, FieldSet } from "airtable"
import { AdapterUser } from "next-auth/adapters"
import { getRecordFields, getRecordsFields } from "./utils"

// Not sure why Pick works but Omit<AdapterUser, 'emailVerified'> does not
interface AirtableUser
  extends Pick<AdapterUser, "id" | "name" | "email" | "image"> {
  emailVerified: string | undefined
}

export default function User(base: Base) {
  const userTable = base.table("User")
  const accountTable = base.table("Account")
  const sessionTable = base.table("Session")

  return {
    getUserById: async (userId: string) =>
      userTable
        .find(userId)
        .then((r) => <AirtableUser>(<unknown>getRecordFields(r)))
        .then(convertAirtableUserToAdapterUser)
        .catch((e) => {
          if (e.error === "NOT_FOUND") return null
          throw e
        }),

    getUserByEmail: (email: string) =>
      userTable
        .select({ filterByFormula: `{email}='${email}'` })
        .all()
        .then((r) => <AirtableUser>(<unknown>getRecordsFields(r)))
        .then(convertAirtableUserToAdapterUser),

    createUser: async ({ name, email, image, emailVerified }: AdapterUser) => {
      const userFields = {
        name: name?.toString(),
        email: email?.toString(),
        image: image?.toString(),
        emailVerified: emailVerified?.toISOString(),
      }

      return <Promise<AdapterUser>>userTable
        .create(userFields)
        .then((r) => <AirtableUser>(<unknown>getRecordFields(r)))
        .then(convertAirtableUserToAdapterUser)
    },

    updateUser: async (user: Partial<AdapterUser>) => {
      const { id, ...userFields } = user
      if (!id) return null
      return <Promise<AdapterUser>>(
        userTable
          .update(id, <Partial<FieldSet>>userFields)
          .then(getRecordFields)
      )
    },

    deleteUser: async (userId: string) => {
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
  }
}

const convertAirtableUserToAdapterUser = async (
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
