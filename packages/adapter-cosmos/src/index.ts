import { SqlQuerySpec } from "@azure/cosmos"
import {
  Adapter,
  AdapterSession,
  AdapterUser,
  AdapterAccount,
} from "next-auth/adapters"
import { CosmosDBInitOptions, getCosmos } from "./cosmos"
import { convertCosmosDocument } from "./util"

export default function MyAdapter(options: CosmosDBInitOptions): Adapter {
  // const BULK_DELETE_PROCEDURE = "bulkDelete"
  const db = getCosmos(options)
  return {
    async createUser(user) {
      const users = await db.users()
      const { resource } = await users.items.create(user)
      return convertCosmosDocument(resource)
    },
    async getUser(id) {
      const users = await db.users()
      const { resource } = await users
        .item(id, options.containerOptions?.usersOptions?.partitionKey)
        .read()
      if (resource === undefined) return null
      return convertCosmosDocument(resource)
    },
    async getUserByEmail(email) {
      const querySpec: SqlQuerySpec = {
        query: "select * from users u where u.email=@emailValue",
        parameters: [
          {
            name: "@emailValue",
            value: email,
          },
        ],
      }

      const users = await db.users()
      const { resources } = await users.items.query(querySpec).fetchAll()
      if (resources.length > 0) return convertCosmosDocument(resources[0])
      return null
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const querySpec: SqlQuerySpec = {
        query:
          "select * from accounts a where a.provider=@providerValue and a.providerAccountId=@providerAccountIdValue",
        parameters: [
          { name: "@providerValue", value: provider },
          { name: "@providerAccountIdValue", value: providerAccountId },
        ],
      }
      const accounts = await db.accounts()
      const { resources: account_result } = await accounts.items
        .query<AdapterAccount>(querySpec)
        .fetchAll()
      if (account_result && account_result.length > 0) {
        const { userId } = account_result[0] as AdapterAccount
        const { resource } = await (await db.users())
          .item(userId, options.containerOptions?.usersOptions?.partitionKey)
          .read()
        console.log(resource)
        return convertCosmosDocument(resource)
      }
      return null
    },
    async updateUser(user) {
      const users = await db.users()
      const target = users.item(
        user.id as string,
        options.containerOptions?.usersOptions?.partitionKey
      )
      const { resource: original_user } = await target.read()
      const replacement = Object.assign(original_user, user)
      const { resource } = await target.replace(replacement)
      /*
      const { resource } = await users.item(user.id as string).patch(
        Object.keys(user).reduce<PatchOperation[]>((prev, cur) => {
          if (cur === "id") return prev
          prev.push({
            op: "add",
            path: "/" + cur,
            value: user[cur as keyof typeof user],
          })
          return prev
        }, [])
      ) */
      if (resource === undefined) throw new Error("user is not defined")
      return convertCosmosDocument(resource)
    },
    async deleteUser(userId) {
      const users = await db.users()
      const accounts = await db.accounts()
      const sessions = await db.sessions()

      await users.item(userId).delete()
      const { resources: hit_account } = await accounts.items
        .query({
          query: "select a.id from accounts a where a.userId=@userIdValue",
          parameters: [{ name: "@userIdValue", value: userId }],
        })
        .fetchAll()
      if (hit_account.length > 0) {
        await Promise.all(
          hit_account.map(
            async (account) =>
              await accounts
                .item(
                  account.id,
                  options.containerOptions?.accountsOptions?.partitionKey
                )
                .delete()
          )
        )
      }
      const { resources: hit_session } = await sessions.items
        .query({
          query: "select a.id from sessions a where a.userId=@userIdValue",
          parameters: [{ name: "@userIdValue", value: userId }],
        })
        .fetchAll()
      if (hit_session.length > 0) {
        await Promise.all(
          hit_session.map(
            async (session) =>
              await sessions
                .item(
                  session.id,
                  options.containerOptions?.sessionsOptions?.partitionKey
                )
                .delete()
          )
        )
      }
    },
    async linkAccount(account) {
      const accounts = await db.accounts()
      return (await accounts.items.create(account)).resource
    },
    async unlinkAccount({ providerAccountId, provider }) {
      const accounts = await db.accounts()
      const { resources } = await accounts.items
        .query({
          query:
            "select a.id from accounts a where a.provider=@providerValue and a.providerAccountId=@accountIdValue",
          parameters: [
            { name: "@providerValue", value: provider },
            { name: "@accountIdValue", value: providerAccountId },
          ],
        })
        .fetchAll()
      if (resources.length > 0) {
        console.log("deleted")
        await accounts
          .item(
            resources[0].id,
            options.containerOptions?.accountsOptions?.partitionKey
          )
          .delete()
      }
    },
    async createSession(session) {
      const sessions = await db.sessions()
      return convertCosmosDocument(
        (await sessions.items.create(session)).resource
      )
    },
    async getSessionAndUser(sessionToken) {
      const sessions = await db.sessions()
      const sessionQuery: SqlQuerySpec = {
        query:
          "select * from sessions s where s.sessionToken=@sessionTokenValue",
        parameters: [{ name: "@sessionTokenValue", value: sessionToken }],
      }
      const { resources } = await sessions.items
        .query<AdapterSession>(sessionQuery)
        .fetchAll()
      if (resources.length > 0) {
        const session = resources[0] as AdapterSession
        const users = await db.users()
        const user = (
          await users
            .item(
              session.userId,
              options.containerOptions?.usersOptions?.partitionKey
            )
            .read<AdapterUser>()
        ).resource
        return {
          session: convertCosmosDocument(session),
          user: convertCosmosDocument(user),
        }
      }
      return null
    },
    async updateSession(partialSession) {
      const sessions = await db.sessions()
      const sessionQuery: SqlQuerySpec = {
        query:
          "select * from sessions s where s.sessionToken=@sessionTokenValue",
        parameters: [
          {
            name: "@sessionTokenValue",
            value: partialSession.sessionToken,
          },
        ],
      }
      const { resources } = await sessions.items
        .query<AdapterSession & { id: string }>(sessionQuery)
        .fetchAll()
      if (resources && resources.length > 0) {
        const target = sessions.item(
          (resources[0] as AdapterSession & { id: string }).id,
          options.containerOptions?.sessionsOptions?.partitionKey
        )
        const { resource: original_session } = await target.read()
        const replacement = Object.assign(original_session, partialSession)
        /*
        const { resource } = await sessions
          .item((resources[0] as AdapterSession & { id: string }).id)
          .patch(
            Object.keys(partialSession).reduce<PatchOperation[]>(
              (prev, cur) => {
                if (cur === "id") return prev
                prev.push({
                  op: "add",
                  path: "/" + cur,
                  value: partialSession[cur as keyof typeof partialSession],
                })
                return prev
              },
              []
            )
          ) */
        const { resource } = await target.replace(replacement)
        if (resource === undefined) throw new Error("user is not defined")
        return convertCosmosDocument(resource)
      }
    },
    async deleteSession(sessionToken) {
      const sessions = await db.sessions()
      const sessionQuery: SqlQuerySpec = {
        query:
          "select s.id from sessions s where s.sessionToken=@sessionTokenValue",
        parameters: [{ name: "@sessionTokenValue", value: sessionToken }],
      }
      await sessions
        .item(
          (
            await sessions.items.query(sessionQuery).fetchAll()
          ).resources[0].id
        )
        .delete()
    },
    async createVerificationToken(verificationToken) {
      const tokens = await db.tokens()
      return convertCosmosDocument(
        (await tokens.items.create(verificationToken)).resource
      )
    },
    async useVerificationToken(verificationToken) {
      const tokens = await db.tokens()
      const tokenQuery: SqlQuerySpec = {
        query:
          "select t.id from verificationTokens t where t.identifier=@verificationTokenIdentifier and t.token=@verificationTokenToken",
        parameters: [
          {
            name: "@verificationTokenIdentifier",
            value: verificationToken.identifier,
          },
          { name: "@verificationTokenToken", value: verificationToken.token },
        ],
      }
      const { resources } = await tokens.items.query(tokenQuery).fetchAll()
      if (resources.length > 0) {
        const item = tokens.item(
          resources[0].id,
          options.containerOptions?.tokensOptions?.partitionKey
        )
        const token = (await item.read()).resource
        await item.delete()
        return convertCosmosDocument(token)
      }
      return null
    },
  }
}
