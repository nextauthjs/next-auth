import { createClient, RedisClientType } from "redis"

// Singleton Redis client
let redisClient: RedisClientType | null = null
let initializing = false
let initializedPromise: Promise<RedisClientType> | null = null

export const getRedisClient = async (): Promise<RedisClientType> => {
  if (redisClient && redisClient.isOpen) {
    return redisClient
  }

  // Prevent duplicate initializations
  if (initializing && initializedPromise) {
    return initializedPromise
  }

  initializing = true

  initializedPromise = (async () => {
    redisClient = createClient({
      url: process.env.NODE_REDIS_URL,
      password: process.env.NODE_REDIS_PASSWORD,
    })

    redisClient.on("error", (err) => {
      console.error("Redis error:", err)
    })

    await redisClient.connect()
    console.log("Connected to Redis")

    return redisClient
  })()

  try {
    return await initializedPromise
  } finally {
    initializing = false
  }
}

/**
 * Helper function to perform operations with Redis client
 * Automatically handles getting the client and proper error handling
 * @param operation Function that receives Redis client and performs operations
 * @returns Result of the operation
 */

export const withRedisClient = async <T>(
  operation: (client: RedisClientType) => Promise<T>
): Promise<T> => {
  const client = await getRedisClient()
  try {
    return await operation(client)
  } catch (error) {
    console.error("Redis operation failed:", error)
    throw error
  }
}
