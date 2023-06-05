import { createConnection } from "mongoose"
import type { ConnectOptions, Connection } from "mongoose"

declare global {
  var mongoose: {
    promise: Promise<Connection> | null
    conn: Connection | null
  }
}

let clientCache = global.mongoose
if (!clientCache) {
  clientCache = global.mongoose = { promise: null, conn: null }
}

export interface MongoDBClientConfig {
  uri: string
  env: string
}
export const configureMongoDBClient = ({ uri, env }: MongoDBClientConfig) => {
  const options: ConnectOptions = {
    // @ts-ignore
    useUnifiedTopology: true,
    useNewUrlParser: true,
  }

  const isProduction = env === "production"
  if (isProduction) {
    global.mongoose = { promise: null, conn: null }
    return createConnection(uri, options)
  }

  if (clientCache.conn) {
    return clientCache.conn
  }

  if (!clientCache.promise) {
    clientCache.promise = createConnection(uri, options)
      .asPromise()
      .then((conn) => {
        global.mongoose.conn = conn
        return conn
      })
  }

  return clientCache.promise
}
