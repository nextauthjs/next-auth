import type { EventCallbacks, LoggerInstance } from ".."
import type { Adapter } from "../adapters"

/**
 * Same as the default `Error`, but it is JSON serializable.
 * @source https://iaincollins.medium.com/error-handling-in-javascript-a6172ccdf9af
 */
export class UnknownError extends Error {
  constructor(error: Error | string) {
    // Support passing error or string
    super((error as Error)?.message ?? error)
    this.name = "UnknownError"
    if (error instanceof Error) {
      this.stack = error.stack
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack,
    }
  }
}

export class OAuthCallbackError extends UnknownError {
  name = "OAuthCallbackError"
}

/**
 * Thrown when an Email address is already associated with an account
 * but the user is trying an OAuth account that is not linked to it.
 */
export class AccountNotLinkedError extends UnknownError {
  name = "AccountNotLinkedError"
}

type Method = (...args: any[]) => Promise<any>

export function upperSnake(s: string) {
  return s.replace(/([A-Z])/g, "_$1").toUpperCase()
}

export function capitalize(s: string) {
  return `${s[0].toUpperCase()}${s.slice(1)}`
}

/**
 * Wraps an object of methods and adds error handling.
 */
export function eventsErrorHandler(
  methods: Partial<EventCallbacks>,
  logger: LoggerInstance
): Partial<EventCallbacks> {
  return Object.keys(methods).reduce<any>((acc, name) => {
    acc[name] = async (...args: any[]) => {
      try {
        const method: Method = methods[name as keyof Method]
        return await method(...args)
      } catch (e) {
        logger.error(`${upperSnake(name)}_EVENT_ERROR`, e as Error)
      }
    }
    return acc
  }, {})
}

/** Handles adapter induced errors. */
export function adapterErrorHandler(
  adapter: Adapter | undefined,
  logger: LoggerInstance
): Adapter | undefined {
  if (!adapter) return

  return Object.keys(adapter).reduce<any>((acc, name) => {
    acc[name] = async (...args: any[]) => {
      try {
        logger.debug(`adapter_${name}`, { args })
        const method: Method = adapter[name as keyof Method]
        return await method(...args)
      } catch (error) {
        logger.error(`adapter_error_${name}`, error as Error)
        const e = new UnknownError(error as Error)
        e.name = `${capitalize(name)}Error`
        throw e
      }
    }
    return acc
  }, {})
}
