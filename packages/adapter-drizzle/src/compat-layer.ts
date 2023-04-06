
// We need a compatibility layer for the various flavors of SQL
// Use a switch thing for whichever one you are using

import { and, eq } from 'drizzle-orm/expressions'
import { MySqlDatabase, MySqlTableWithColumns } from 'drizzle-orm/mysql-core'
import { PgDatabase, PgTableWithColumns } from 'drizzle-orm/pg-core'
import { BaseSQLiteDatabase, SQLiteTableWithColumns } from 'drizzle-orm/sqlite-core'
import { Adapter } from 'next-auth/adapters'

type DrizzleDatabase<T> = T extends "mysql" ? MySqlDatabase<any, any> :
  T extends "pg" ? PgDatabase<any, any> :
  BaseSQLiteDatabase<any, any>;


type DrizzleColumns<T> = T extends "mysql" ? MySqlTableWithColumns<any> :
  T extends "pg" ? PgTableWithColumns<any> :
  BaseSQLiteDatabase<any, any>;

type CoreTypes = "mysql" | "pg" | "sqlite"

interface CompatArgs<T extends CoreTypes> {
  coreType: T
  client: DrizzleDatabase<T>
  usersTable: DrizzleColumns<T>
  sessionsTable: DrizzleColumns<T>
  accountsTable: DrizzleColumns<T>
  verificationTokensTable: DrizzleColumns<T>
}

export const compatLayer = <T extends CoreTypes>({
  coreType,
  client,
  usersTable,
  sessionsTable,
  accountsTable,
  verificationTokensTable
}: CompatArgs<"pg">): Adapter => {
  if (coreType === "pg") {
    return {
      createUser: (data) => {
        return client
          .insert(usersTable)
          .values({ ...data, id: "123" }) ?? null
      },
      getUser: (data) => {
        return client
          .select()
          .from(usersTable)
          .where(eq(usersTable.id, data)) ?? null
      },
      getUserByEmail: (data) => {
        return client
          .select()
          .from(usersTable)
          .where(eq(usersTable.email, data)) ?? null
      },
      createSession: (data) => {
        return client
          .insert(sessionsTable)
          .values(data)
          .returning()
      },
      getSessionAndUser: (data) => {
        return client.select({
          session: sessionsTable,
          user: usersTable
        })
          .from(sessionsTable)
          .where(eq(sessionsTable.sessionToken, data))
          .innerJoin(usersTable, eq(usersTable.id, sessionsTable.userId)) ?? null
      },
      updateUser: (data) => {
        if (!data.id) {
          throw new Error("No user id.")
        }

        return client
          .update(usersTable)
          .set(data)
          .where(eq(usersTable.id, data.id))
          .returning()
      },
      updateSession: (data) => {
        return client
          .update(sessionsTable)
          .set(data)
          .where(eq(sessionsTable.sessionToken, data.sessionToken))
          .returning()
      },
      linkAccount: (rawAccount) => {
        const updatedAccount = client
          .insert(accountsTable)
          .values(rawAccount)
          .returning()

        const account: ReturnType<Adapter["linkAccount"]> = {
          ...updatedAccount,
          access_token: updatedAccount.access_token ?? undefined,
          token_type: updatedAccount.token_type ?? undefined,
          id_token: updatedAccount.id_token ?? undefined,
          refresh_token: updatedAccount.refresh_token ?? undefined,
          scope: updatedAccount.scope ?? undefined,
          expires_at: updatedAccount.expires_at ?? undefined,
          session_state: updatedAccount.session_state ?? undefined
        }

        return account
      },
      getUserByAccount: (account) => {
        return client.select({
          id: usersTable.id,
          email: usersTable.email,
          emailVerified: usersTable.emailVerified,
          image: usersTable.image,
          name: usersTable.name
        })
          .from(usersTable)
          .innerJoin(accountsTable, (
            and(
              eq(accountsTable.providerAccountId, account.providerAccountId),
              eq(accountsTable.provider, account.provider)
            )
          )) ?? null
      }
      ,
      deleteSession: (sessionToken) => {
        return client
          .delete(sessionsTable)
          .where(eq(sessionsTable.sessionToken, sessionToken))
          .returning() ?? null
      },
      createVerificationToken: (token) => {
        return client
          .insert(verificationTokensTable)
          .values(token)
          .returning()
          .get()
      },
      useVerificationToken: (token) => {
        try {
          return client
            .delete(verificationTokensTable)
            .where(
              and(
                eq(verificationTokensTable.identifier, token.identifier),
                eq(verificationTokensTable.token, token.token)
              )
            )
            .returning() ?? null

        } catch (err) {
          throw new Error("No verification token found.")
        }
      },
      deleteUser: (id) => {
        return client
          .delete(usersTable)
          .where(eq(usersTable.id, id))
          .returning()
      },
      unlinkAccount: (account) => {
        client.delete(accountsTable)
          .where(
            and(
              eq(accountsTable.providerAccountId, account.providerAccountId),
              eq(accountsTable.provider, account.provider),
            )
          )

        return undefined
      }
    }
  }
  if (coreType === "sqlite") {
    return {
      createUser: (data) => {
        return client
          .insert(usersTable)
          .values({ ...data, id: "123" })
          .returning()
          .get()
      },
      getUser: (data) => {
        return client
          .select()
          .from(usersTable)
          .where(eq(usersTable.id, data))
          .get() ?? null
      },
      getUserByEmail: (data) => {
        return client
          .select()
          .from(usersTable)
          .where(eq(usersTable.email, data))
          .get() ?? null
      },
      createSession: (data) => {
        return client
          .insert(sessionsTable)
          .values(data)
          .returning()
          .get()
      },
      getSessionAndUser: (data) => {
        return client.select({
          session: sessionsTable,
          user: usersTable
        })
          .from(sessionsTable)
          .where(eq(sessionsTable.sessionToken, data))
          .innerJoin(usersTable, eq(usersTable.id, sessionsTable.userId))
          .get() ?? null
      },
      updateUser: (data) => {
        if (!data.id) {
          throw new Error("No user id.")
        }

        return client
          .update(usersTable)
          .set(data)
          .where(eq(usersTable.id, data.id))
          .returning()
          .get()
      },
      updateSession: (data) => {
        return client
          .update(sessionsTable)
          .set(data)
          .where(eq(sessionsTable.sessionToken, data.sessionToken))
          .returning()
          .get()
      },
      linkAccount: (rawAccount) => {
        const updatedAccount = client
          .insert(accountsTable)
          .values(rawAccount)
          .returning()
          .get()

        const account: ReturnType<Adapter["linkAccount"]> = {
          ...updatedAccount,
          access_token: updatedAccount.access_token ?? undefined,
          token_type: updatedAccount.token_type ?? undefined,
          id_token: updatedAccount.id_token ?? undefined,
          refresh_token: updatedAccount.refresh_token ?? undefined,
          scope: updatedAccount.scope ?? undefined,
          expires_at: updatedAccount.expires_at ?? undefined,
          session_state: updatedAccount.session_state ?? undefined
        }

        return account
      },
      getUserByAccount: (account) => {
        return client.select({
          id: usersTable.id,
          email: usersTable.email,
          emailVerified: usersTable.emailVerified,
          image: usersTable.image,
          name: usersTable.name
        })
          .from(usersTable)
          .innerJoin(accountsTable, (
            and(
              eq(accountsTable.providerAccountId, account.providerAccountId),
              eq(accountsTable.provider, account.provider)
            )
          ))
          .get() ?? null
      }
      ,
      deleteSession: (sessionToken) => {
        return client
          .delete(sessionsTable)
          .where(eq(sessionsTable.sessionToken, sessionToken))
          .returning()
          .get() ?? null
      },
      createVerificationToken: (token) => {
        return client
          .insert(verificationTokensTable)
          .values(token)
          .returning()
          .get()
      },
      useVerificationToken: (token) => {
        try {
          return client
            .delete(verificationTokensTable)
            .where(
              and(
                eq(verificationTokensTable.identifier, token.identifier),
                eq(verificationTokensTable.token, token.token)
              )
            )
            .returning()
            .get() ?? null

        } catch (err) {
          throw new Error("No verification token found.")
        }
      },
      deleteUser: (id) => {
        return client
          .delete(usersTable)
          .where(eq(usersTable.id, id))
          .returning()
          .get()
      },
      unlinkAccount: (account) => {
        client.delete(accountsTable)
          .where(
            and(
              eq(accountsTable.providerAccountId, account.providerAccountId),
              eq(accountsTable.provider, account.provider),
            )
          )
          .run()

        return undefined
      }
    }
  }

  return {} as Adapter
}