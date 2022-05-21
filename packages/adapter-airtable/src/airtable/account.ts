import { Base } from 'airtable'
import { getRecordsFields } from './utils'

interface AuthProvider {
  provider: string
  providerAccountId: string
}

export default function Account(base: Base) {
  const table = base.table('Account')

  return {
    getAccountByProvider: async ({
      providerAccountId,
      provider,
    }: AuthProvider) =>
      table
        .select({
          filterByFormula: `AND({providerAccountId}='${providerAccountId}', {provider}='${provider}')`,
        })
        .all()
        .then(getRecordsFields),

    createAccount: async (account: any) => {
      const accountFields = { ...account, userId: [account.userId] }
      return table.create([{ fields: accountFields }]).then(getRecordsFields)
    },

    deleteAccount: async (accountId: string) => {
      await table.destroy(accountId)
      return null
    },
  }
}
