import {
  Container,
  ContainerRequest,
  CosmosClient,
  CosmosClientOptions,
  Database,
  DatabaseRequest,
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

async function setDb(clientOptions: CosmosClientOptions, req: DatabaseRequest) {
  db = (await getClient(clientOptions).databases.createIfNotExists(req))
    .database
}

interface CosmosDBBaseOptions {
  clientOptions: CosmosClientOptions
  dbOptions?: DatabaseRequest
}

export interface CosmosDBInitOptions extends CosmosDBBaseOptions {
  containerOptions?: {
    usersOptions?: ContainerRequest
    accountsOptions?: ContainerRequest
    sessionsOptions?: ContainerRequest
    tokensOptions?: ContainerRequest
  }
}

async function init(options: CosmosDBBaseOptions) {
  if (client === null) setClient(options.clientOptions)
  if (db === null) {
    await setDb(
      options.clientOptions,
      options.dbOptions ?? { id: DEFAULT_DB_NAME }
    )
  }
}

export async function getContainer(
  options: CosmosDBBaseOptions,
  req: ContainerRequest & { id: string }
) {
  if (!container[req.id]) {
    await init(options)
    container[req.id] = (
      await (db as Database).containers.createIfNotExists(req)
    ).container
  }
  return container[req.id] as Container
}

export const getCosmos = (options: CosmosDBInitOptions) => {
  const { containerOptions, ...baseOptions } = options
  return {
    users: async () => {
      return await getContainer(
        baseOptions,
        containerOptions?.usersOptions
          ? Object.assign({ id: CONTAINER_USER }, containerOptions.usersOptions)
          : {
              id: CONTAINER_USER,
              uniqueKeyPolicy: { uniqueKeys: [{ paths: ["/email"] }] },
            }
      )
    },
    accounts: async () => {
      return await getContainer(
        baseOptions,
        containerOptions?.usersOptions
          ? Object.assign(
              { id: CONTAINER_ACCOUNTS },
              containerOptions.usersOptions
            )
          : {
              id: CONTAINER_ACCOUNTS,
            }
      )
    },
    sessions: async () => {
      return await getContainer(
        baseOptions,
        containerOptions?.usersOptions
          ? Object.assign(
              { id: CONTAINER_SESSIONS },
              containerOptions.usersOptions
            )
          : {
              id: CONTAINER_SESSIONS,
            }
      )
    },
    tokens: async () => {
      return await getContainer(
        baseOptions,
        containerOptions?.usersOptions
          ? Object.assign(
              { id: CONTAINER_TOKENS },
              containerOptions.usersOptions
            )
          : {
              id: CONTAINER_TOKENS,
            }
      )
    },
  }
}
