import {
  Container,
  ContainerRequest,
  CosmosClient,
  CosmosClientOptions,
  Database,
  DatabaseRequest,
  RequestOptions,
} from "@azure/cosmos"

let client: null | CosmosClient = null
let db: Database | null = null
const container: Record<string, Container> = {}

const DEFAULT_DB_NAME = "next-auth" as const
const CONTAINER_USER = "users" as const
const CONTAINER_ACCOUNTS = "accounts" as const
const CONTAINER_SESSIONS = "sessions" as const
const CONTAINER_TOKENS = "tokens" as const

function setClient(options: CosmosClientOptions) {
  client = new CosmosClient(options)
}
function getClient(options?: CosmosClientOptions): CosmosClient {
  if (client === null) {
    if (!options?.endpoint || !options.key) {
      throw new Error("DB initialize failed")
    }
    setClient(options)
  }
  return client as CosmosClient
}

async function setDb(
  clientOptions: CosmosClientOptions,
  dbOptions: CosmosDataBaseOptions
) {
  db = (
    await getClient(clientOptions).databases.createIfNotExists(
      dbOptions.body,
      dbOptions.options
    )
  ).database
}

interface CosmosDBBaseOptions {
  clientOptions: CosmosClientOptions
  dbOptions?: CosmosDataBaseOptions
}
interface CosmosDataBaseOptions {
  body: DatabaseRequest
  options?: RequestOptions
}
interface CosmosContainerOptions {
  body: ContainerRequest
  options?: RequestOptions
}

export interface CosmosDBInitOptions extends CosmosDBBaseOptions {
  containerOptions?: {
    usersOptions?: CosmosContainerOptions
    accountsOptions?: CosmosContainerOptions
    sessionsOptions?: CosmosContainerOptions
    tokensOptions?: CosmosContainerOptions
  }
}

async function init(options: CosmosDBBaseOptions) {
  const { clientOptions, dbOptions } = options
  if (client === null) setClient(clientOptions)
  if (db === null) {
    await setDb(clientOptions, dbOptions ?? { body: { id: DEFAULT_DB_NAME } })
  }
}

export async function getContainer(
  dbOptions: CosmosDBBaseOptions,
  body: ContainerRequest & { id: string },
  options?: RequestOptions
) {
  if (!container[body.id]) {
    await init(dbOptions)
    container[body.id] = (
      await (db as Database).containers.createIfNotExists(body, options)
    ).container
  }
  return container[body.id] as Container
}
export const getCosmos = (options: CosmosDBInitOptions) => {
  const { containerOptions, ...baseOptions } = options
  return {
    users: async () => {
      return await getContainer(
        baseOptions,
        Object.assign(
          {
            id: CONTAINER_USER,
            uniqueKeyPolicy: { uniqueKeys: [{ paths: ["/email"] }] },
          },
          containerOptions?.usersOptions?.body
        ),
        containerOptions?.usersOptions?.options
      )
    },
    accounts: async () => {
      return await getContainer(
        baseOptions,
        Object.assign(
          { id: CONTAINER_ACCOUNTS },
          containerOptions?.accountsOptions?.body
        ),
        containerOptions?.accountsOptions?.options
      )
    },
    sessions: async () => {
      return await getContainer(
        baseOptions,
        Object.assign(
          { id: CONTAINER_SESSIONS },
          containerOptions?.sessionsOptions?.body
        ),
        containerOptions?.sessionsOptions?.options
      )
    },
    tokens: async () => {
      return await getContainer(
        baseOptions,
        Object.assign(
          { id: CONTAINER_TOKENS },
          containerOptions?.tokensOptions?.body
        ),
        containerOptions?.tokensOptions?.options
      )
    },
  }
}
