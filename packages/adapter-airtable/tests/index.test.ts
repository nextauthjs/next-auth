import { runBasicTests } from "@next-auth/adapter-test"
import { AirtableAdapter } from "../src/index"
import Airtable, { Table } from "airtable"
import dotenv from "dotenv"
dotenv.config()

/*

  To run the tests you need to:
   - clone this base: https://airtable.com/shr16Xd8glUk90c4P
   - add your api key and base id to .env

*/

const apiKey = process.env.AIRTABLE_API_KEY || ""
const baseId = process.env.AIRTABLE_BASE_ID || ""

const airtable = new Airtable({ apiKey })
const base = airtable.base(baseId)
const userTable = base.table("User")
const accountTable = base.table("Account")
const sessionTable = base.table("Session")
const verificationTable = base.table("VerificationToken")

runBasicTests({
  adapter: AirtableAdapter({ apiKey, baseId }),
  db: {
    id: () => "recThisIsAFakeUid",
    connect: async () => {
      await emptyDb()
    },
    disconnect: async () => {
      await emptyDb()
    },
    verificationToken: ({ identifier, token }) => {
      return verificationTable
        .select({
          filterByFormula: `AND({identifier}='${identifier}', {token}='${token}')`,
        })
        .firstPage()
        .then((records) => records[0].fields)
        .then((fields) => ({
          token: fields.token,
          identifier: fields.identifier,
          expires: new Date(fields?.expires?.toString() || 0),
        }))
    },
    user: (id) => {
      return userTable
        .find(id)
        .then((record) => record.fields)
        .then((fields) => {
          return {
            id,
            name: fields.name,
            email: fields.email,
            image: fields.image,
            emailVerified: new Date(fields?.emailVerified?.toString() || 0),
          }
        })
        .catch((e) => {
          if (e.error === "NOT_FOUND") return null
          throw e
        }) // Airtable throws a 404 error when find fails
    },
    account: ({ provider, providerAccountId }) =>
      accountTable
        .select({
          filterByFormula: `AND({provider}='${provider}', {providerAccountId}='${providerAccountId}')`,
        })
        .all()
        .then((records) => records[0]?.fields)
        .then((fields) => {
          if (!fields) return null
          return {
            ...fields,
            userId: Array.isArray(fields.userId)
              ? fields?.userId[0]
              : fields.userId || null,
          }
        }),
    session: (sessionToken) =>
      sessionTable
        .select({ filterByFormula: `{sessionToken}='${sessionToken}'` })
        .all()
        .then((records) => records[0]?.fields)
        .then((fields) => {
          if (!fields) return null
          return {
            ...fields,
            expires: new Date(fields?.expires?.toString() || 0),
            userId: Array.isArray(fields.userId)
              ? fields?.userId[0]
              : fields.userId || null,
          }
        }),
  },
})

const emptyDb = async () => {
  return Promise.all(
    [userTable, accountTable, sessionTable, verificationTable].map(
      async (table) => {
        return deleteAllRecords(table)
      }
    )
  )
}

const deleteAllRecords = async (table: Table<any>) =>
  table
    .select()
    .all()
    .then((records) => records.map((record) => record.destroy()))
