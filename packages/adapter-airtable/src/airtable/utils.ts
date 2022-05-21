import { Record, Records, Table, FieldSet } from 'airtable'
import { AdapterSession } from 'next-auth/adapters'
import { AirtableSession } from './session'

export const getRecordFields = (record: Record<FieldSet>) => record?.fields
export const getRecordsFields = (record: Records<FieldSet>) => record[0]?.fields
export const getRecordsIds = (records: Records<FieldSet>) =>
  records.map((record) => record.id)

export const getSessionBySessionToken =
  (sessionTable: Table<any>) => (sessionToken: string) =>
    <Promise<AdapterSession | null>>sessionTable
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
