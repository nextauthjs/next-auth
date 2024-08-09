import type {
  Adapter,
  AdapterAccount,
  AdapterAuthenticator,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "@auth/core/adapters"
import { Container, Resource } from "@azure/cosmos"

const isoDateRE =
  /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/

const isDate = (val: any): val is ConstructorParameters<typeof Date>[0] =>
  !!(val && isoDateRE.test(val) && !isNaN(Date.parse(val)))

const format = {
  /** Takes an object that's coming from a database and converts it to plain JavaScript. */
  from<T>(object: Record<string, any> = {}): T {
    const newObject: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(object))
      if (isDate(value)) newObject[key] = new Date(value)
      else newObject[key] = value
    return newObject as T
  },
}

type CosmosItem = {
  id: string
  _rid: string
  _self: string
  _etag: string
  _attachments?: string
  dataType: string
  _ts: number
  [key: string]: any
}

export const cosmosHelper = {
  withoutKeys<T extends CosmosItem, TOUT>(
    entity: T,
    partitionKeyConfiguration?: CosmosDbPartitionConfiguration
  ): TOUT {
    const {
      id,
      dataType,
      _rid,
      _self,
      _etag,
      _ts,
      _attachments,
      ...entityData
    } = entity

    const newId = id.replace(`|${dataType}|`, "")

    if (
      partitionKeyConfiguration &&
      entityData.hasOwnProperty(partitionKeyConfiguration.partitionKey)
    ) {
      delete entityData[partitionKeyConfiguration.partitionKey]
    }

    return {
      id: newId,
      ...format.from<TOUT>(entityData),
    } as TOUT
  },
  withoutKeysAndId<T extends CosmosItem, TOUT>(
    entity: T,
    partitionKeyConfiguration?: CosmosDbPartitionConfiguration
  ): TOUT {
    const {
      id,
      dataType,
      _rid,
      _self,
      _etag,
      _ts,
      _attachments,
      ...entityData
    } = entity

    if (
      partitionKeyConfiguration &&
      entity.hasOwnProperty(partitionKeyConfiguration.partitionKey)
    ) {
      delete entityData[partitionKeyConfiguration.partitionKey]
    }
    return {
      ...format.from<TOUT>(entityData),
    }
  },
}
export enum CosmosDbPartitionStrategy {
  SameAsId,
  SameAsDataType,
  HardCodedValue,
}
export type CosmosDbPartitionConfiguration = {
  partitionKey: string
  partitionKeyStrategy: CosmosDbPartitionStrategy
  hardCodedValue?: string
}
export function CosmosDbAdapter(
  cosmosContainer: Container,
  partitionKeyConfiguration?: CosmosDbPartitionConfiguration
): Adapter {
  const enrichDataModel = (
    item: (
      | AdapterAccount
      | AdapterAuthenticator
      | AdapterSession
      | AdapterUser
      | VerificationToken
    ) & { [key: string]: any; dataType: string }
  ): void => {
    if (partitionKeyConfiguration) {
      switch (partitionKeyConfiguration.partitionKeyStrategy) {
        case CosmosDbPartitionStrategy.HardCodedValue:
          item[partitionKeyConfiguration.partitionKey] =
            partitionKeyConfiguration.hardCodedValue
          return
        case CosmosDbPartitionStrategy.SameAsDataType:
          item[partitionKeyConfiguration.partitionKey] = item.dataType
          return
        case CosmosDbPartitionStrategy.SameAsId:
          item[partitionKeyConfiguration.partitionKey] = item.id
          return
      }
    }
  }

  const getPartitionKey = (
    id: string,
    dataType: string
  ): string | undefined => {
    if (partitionKeyConfiguration) {
      switch (partitionKeyConfiguration.partitionKeyStrategy) {
        case CosmosDbPartitionStrategy.HardCodedValue:
          return partitionKeyConfiguration.hardCodedValue ?? ""
        case CosmosDbPartitionStrategy.SameAsDataType:
          return dataType
        case CosmosDbPartitionStrategy.SameAsId:
          return id
      }
    }

    return undefined
  }

  return {
    createUser: async ({
      id: _id,
      ...data
    }: AdapterUser): Promise<AdapterUser> => {
      const userObject = {
        id: `|User|${_id}`,
        dataType: "User",
        ...data,
      }
      enrichDataModel(userObject)
      const response = await cosmosContainer.items.create(userObject)

      if (response.resource) {
        return cosmosHelper.withoutKeys<
          AdapterUser & Resource & CosmosItem,
          AdapterUser
        >(response.resource, partitionKeyConfiguration)
      } else {
        throw Error("Error creating user")
      }
    },
    getUser: async (id: string): Promise<AdapterUser | null> => {
      try {
        const response = await cosmosContainer
          .item(`|User|${id}`, getPartitionKey(`|User|${id}`, "User"))
          .read()
        if (response.statusCode === 404) {
          return null
        }
        return cosmosHelper.withoutKeys<
          AdapterUser & Resource & CosmosItem,
          AdapterUser
        >(response.resource, partitionKeyConfiguration)
      } catch {
        return null
      }
    },
    getUserByEmail: async (email: string): Promise<AdapterUser | null> => {
      const queryResponse = cosmosContainer.items.query({
        query: "SELECT * from c WHERE c.dataType = 'User' and c.email = @email",
        parameters: [{ name: "@email", value: email }],
      })
      try {
        const response = await queryResponse.fetchAll()

        if (response.resources.length === 0) {
          return null
        }
        return cosmosHelper.withoutKeys<
          AdapterUser & Resource & CosmosItem,
          AdapterUser
        >(response.resources[0], partitionKeyConfiguration)
      } catch {
        return null
      }
    },
    getUserByAccount: async (provider_providerAccountId) => {
      try {
        const account = await cosmosContainer
          .item(
            `|Account|${provider_providerAccountId.provider}|${provider_providerAccountId.providerAccountId}`,
            getPartitionKey(
              `|Account|${provider_providerAccountId.provider}|${provider_providerAccountId.providerAccountId}`,
              "Account"
            )
          )
          .read()
        if (account.statusCode === 404) {
          return null
        }
        const user = await cosmosContainer
          .item(
            `|User|${account.resource.userId}`,
            getPartitionKey(`|User|${account.resource.userId}`, "User")
          )
          .read()
        if (user.statusCode === 404) {
          return null
        }
        return cosmosHelper.withoutKeys<
          AdapterUser & Resource & CosmosItem,
          AdapterUser
        >(user.resource, partitionKeyConfiguration)
      } catch {
        return null
      }
    },
    updateUser: async ({ id, ...data }): Promise<AdapterUser> => {
      const existingUser = await cosmosContainer
        .item(`|User|${id}`, getPartitionKey(`|User|${id}`, "User"))
        .read()
      const updatedUser = { ...existingUser.resource, ...data }
      await cosmosContainer.item(`|User|${id}`).replace(updatedUser)

      return cosmosHelper.withoutKeys<
        AdapterUser & Resource & CosmosItem,
        AdapterUser
      >(updatedUser, partitionKeyConfiguration)
    },
    deleteUser: async (id: string): Promise<AdapterUser> => {
      const sessionsForUserQuery = cosmosContainer.items
        .query({
          query:
            "SELECT * from c WHERE c.dataType = 'Session' and c.userId = @userId",
          parameters: [{ name: "@userId", value: id }],
        })
        .fetchAll()
      const accountsForUserQuery = cosmosContainer.items
        .query({
          query:
            "SELECT * from c WHERE c.dataType = 'Account' and c.userId = @userId",
          parameters: [{ name: "@userId", value: id }],
        })
        .fetchAll()

      const sessionsForUser = await sessionsForUserQuery
      const accountsForUser = await accountsForUserQuery

      const userDataResponse = await cosmosContainer
        .item(`|User|${id}`, getPartitionKey(`|User|${id}`, "User"))
        .read()
      const userData = cosmosHelper.withoutKeys<
        AdapterUser & Resource & CosmosItem,
        AdapterUser
      >(userDataResponse.resource)

      await cosmosContainer
        .item(`|User|${id}`, getPartitionKey(`|User|${id}`, "User"))
        .delete()

      const sessionDeletions = sessionsForUser.resources.map((s) =>
        cosmosContainer.item(s.id, getPartitionKey(s.id, s.dataType)).delete()
      )
      await Promise.allSettled(sessionDeletions)

      const accountDeletions = accountsForUser.resources.map((a) =>
        cosmosContainer.item(a.id, getPartitionKey(a.id, a.dataType)).delete()
      )
      await Promise.allSettled(accountDeletions)

      return userData
    },
    linkAccount: async ({
      ...data
    }: AdapterAccount): Promise<AdapterAccount> => {
      const accountObjectForEnrichment = {
        id: `|Account|${data.provider}|${data.providerAccountId}`,
        dataType: "Account",
        ...data,
      }
      enrichDataModel(accountObjectForEnrichment)

      const { type, ...accountData } = accountObjectForEnrichment
      const accountObject = {
        type: type.toString(),
        ...accountData,
      }

      const createAccountResponse =
        await cosmosContainer.items.create(accountObject)
      if (createAccountResponse.resource) {
        return cosmosHelper.withoutKeysAndId<
          Resource & CosmosItem,
          AdapterAccount
        >(createAccountResponse.resource, partitionKeyConfiguration)
      } else {
        throw Error("Error creating account")
      }
    },
    unlinkAccount: async (
      provider_providerAccountId
    ): Promise<AdapterAccount | undefined> => {
      const existingAccount = await cosmosContainer
        .item(
          `|Account|${provider_providerAccountId.provider}|${provider_providerAccountId.providerAccountId}`,
          getPartitionKey(
            `|Account|${provider_providerAccountId.provider}|${provider_providerAccountId.providerAccountId}`,
            "Account"
          )
        )
        .read()

      await cosmosContainer
        .item(
          `|Account|${provider_providerAccountId.provider}|${provider_providerAccountId.providerAccountId}`,
          getPartitionKey(
            `|Account|${provider_providerAccountId.provider}|${provider_providerAccountId.providerAccountId}`,
            "Account"
          )
        )
        .delete()

      return cosmosHelper.withoutKeysAndId<
        Resource & CosmosItem,
        AdapterAccount
      >(existingAccount.resource)
    },
    getSessionAndUser: async (sessionToken) => {
      const session = await cosmosContainer
        .item(
          `|Session|${sessionToken}`,
          getPartitionKey(`|Session|${sessionToken}`, "Session")
        )
        .read()
      if (session.statusCode === 404) {
        return null
      }

      const user = await cosmosContainer
        .item(
          `|User|${session.resource.userId}`,
          getPartitionKey(`|User|${session.resource.userId}`, "User")
        )
        .read()
      if (user.statusCode === 404) {
        return null
      }

      const response = {
        user: cosmosHelper.withoutKeys<
          AdapterUser & Resource & CosmosItem,
          AdapterUser
        >(user.resource, partitionKeyConfiguration),
        session: cosmosHelper.withoutKeysAndId<
          Resource & CosmosItem,
          AdapterSession
        >(session.resource, partitionKeyConfiguration),
      } as { user: AdapterUser; session: AdapterSession }
      return response
    },
    createSession: async (data) => {
      const sessionObject = {
        id: `|Session|${data.sessionToken}`,
        dataType: "Session",
        ...data,
      }
      enrichDataModel(sessionObject)

      const sessionResource = await cosmosContainer.items.create(sessionObject)
      if (sessionResource.resource) {
        return cosmosHelper.withoutKeysAndId<
          Resource & CosmosItem,
          AdapterSession
        >(sessionResource.resource, partitionKeyConfiguration)
      } else {
        throw Error("Error creating session")
      }
    },
    updateSession: async (data): Promise<AdapterSession> => {
      const existingSession = await cosmosContainer
        .item(
          `|Session|${data.sessionToken}`,
          getPartitionKey(`|Session|${data.sessionToken}`, "Session")
        )
        .read()

      const updatedSession = {
        ...existingSession.resource,
        ...data,
      }

      const sessionResource = await cosmosContainer
        .item(
          `|Session|${data.sessionToken}`,
          getPartitionKey(`|Session|${data.sessionToken}`, "Session")
        )
        .replace(updatedSession)

      if (sessionResource.resource) {
        return cosmosHelper.withoutKeysAndId<
          Resource & CosmosItem,
          AdapterSession
        >(sessionResource.resource, partitionKeyConfiguration)
      } else {
        throw Error("Error updating session")
      }
    },
    deleteSession: async (
      sessionToken: string
    ): Promise<AdapterSession | null | undefined> => {
      const existingSession = await cosmosContainer
        .item(
          `|Session|${sessionToken}`,
          getPartitionKey(`|Session|${sessionToken}`, "Session")
        )
        .read()
      await cosmosContainer
        .item(
          `|Session|${sessionToken}`,
          getPartitionKey(`|Session|${sessionToken}`, "Session")
        )
        .delete()

      return cosmosHelper.withoutKeysAndId<
        Resource & CosmosItem,
        AdapterSession
      >(existingSession.resource, partitionKeyConfiguration)
    },
    createVerificationToken: async (
      data: VerificationToken
    ): Promise<VerificationToken | null | undefined> => {
      const verificationTokenObject = {
        id: `|VerificationToken|${data.token}`,
        dataType: "VerificationToken",
        ...data,
      }
      enrichDataModel(verificationTokenObject)

      const response = await cosmosContainer.items.create(
        verificationTokenObject
      )

      if (response.resource) {
        return cosmosHelper.withoutKeysAndId<
          Resource & CosmosItem,
          VerificationToken
        >(response.resource, partitionKeyConfiguration)
      } else {
        throw Error("Error creating verification token")
      }
    },
    useVerificationToken: async (
      identifier_token: VerificationToken
    ): Promise<VerificationToken | null> => {
      try {
        const response = await cosmosContainer
          .item(
            `|VerificationToken|${identifier_token.token}`,
            getPartitionKey(
              `|VerificationToken|${identifier_token.token}`,
              "VerificationToken"
            )
          )
          .read()
        if (response.statusCode === 404) {
          return null
        }
        const tokenData = cosmosHelper.withoutKeysAndId<
          VerificationToken & Resource & CosmosItem,
          VerificationToken
        >(response.resource, partitionKeyConfiguration)

        if (tokenData.identifier !== identifier_token.identifier) {
          return null
        }

        await cosmosContainer
          .item(
            `|VerificationToken|${identifier_token.token}`,
            getPartitionKey(
              `|VerificationToken|${identifier_token.token}`,
              "VerificationToken"
            )
          )
          .delete()

        return tokenData
      } catch {
        return null
      }
    },
    getAccount: async (
      providerAccountId: string,
      provider: string
    ): Promise<AdapterAccount | null> => {
      try {
        const response = await cosmosContainer
          .item(
            `|Account|${provider}|${providerAccountId}`,
            getPartitionKey(
              `|Account|${provider}|${providerAccountId}`,
              "Account"
            )
          )
          .read()
        if (response.statusCode === 404) {
          return null
        }
        return cosmosHelper.withoutKeysAndId<
          AdapterAccount & Resource & CosmosItem,
          AdapterAccount
        >(response.resource, partitionKeyConfiguration)
      } catch {
        return null
      }
    },
    createAuthenticator: async (
      authenticator: AdapterAuthenticator
    ): Promise<AdapterAuthenticator> => {
      const verificationTokenObject = {
        id: `|Authenticator|${authenticator.credentialID}`,
        dataType: "Authenticator",
        ...authenticator,
      }
      enrichDataModel(verificationTokenObject)

      const response = await cosmosContainer.items.create(
        verificationTokenObject
      )

      if (response.resource) {
        return cosmosHelper.withoutKeysAndId<
          Resource & CosmosItem,
          AdapterAuthenticator
        >(response.resource, partitionKeyConfiguration)
      } else {
        throw Error("Error creating authenticator")
      }
    },
    getAuthenticator: async (
      credentialID: string
    ): Promise<AdapterAuthenticator | null> => {
      try {
        const response = await cosmosContainer
          .item(
            `|Authenticator|${credentialID}`,
            getPartitionKey(`|Authenticator|${credentialID}`, "Authenticator")
          )
          .read()
        if (response.statusCode === 404) {
          return null
        }
        return cosmosHelper.withoutKeys<
          AdapterAuthenticator & Resource & CosmosItem,
          AdapterAuthenticator
        >(response.resource, partitionKeyConfiguration)
      } catch {
        return null
      }
    },
    listAuthenticatorsByUserId: async (
      userId: string
    ): Promise<AdapterAuthenticator[]> => {
      const queryResponse = cosmosContainer.items.query({
        query:
          "SELECT * from c WHERE c.dataType = 'Authenticator' and c.userId = @userId",
        parameters: [{ name: "@userId", value: userId }],
      })
      const response = await queryResponse.fetchAll()

      return response.resources.map((a) =>
        cosmosHelper.withoutKeysAndId<
          AdapterAuthenticator & Resource & CosmosItem,
          AdapterAuthenticator
        >(a, partitionKeyConfiguration)
      )
    },

    updateAuthenticatorCounter: async (
      credentialID,
      counter
    ): Promise<AdapterAuthenticator> => {
      const response = await cosmosContainer
        .item(
          `|Authenticator|${credentialID}`,
          getPartitionKey(`|Authenticator|${credentialID}`, "Authenticator")
        )
        .read()

      const updatedItem = {
        ...response.resource,
        counter,
      }

      await cosmosContainer
        .item(
          `|Authenticator|${credentialID}`,
          getPartitionKey(`|Authenticator|${credentialID}`, "Authenticator")
        )
        .replace(updatedItem)

      return cosmosHelper.withoutKeys<
        AdapterAuthenticator & Resource & CosmosItem,
        AdapterAuthenticator
      >(updatedItem, partitionKeyConfiguration)
    },
  }
}
