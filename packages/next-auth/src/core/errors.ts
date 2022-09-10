import type { EventCallbacks, LoggerInstance } from ".."

/**
 * Same as the default `Error`, but it is JSON serializable.
 * @source https://iaincollins.medium.com/error-handling-in-javascript-a6172ccdf9af
 */
export class UnknownError extends Error {
  code: string
  constructor(error: Error | string) {
    // Support passing error or string
    super((error as Error)?.message ?? error)
    this.name = "UnknownError"
    this.code = (error as any).code
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

export class MissingAPIRoute extends UnknownError {
  name = "MissingAPIRouteError"
  code = "MISSING_NEXTAUTH_API_ROUTE_ERROR"
}

export class MissingSecret extends UnknownError {
  name = "MissingSecretError"
  code = "NO_SECRET"
}

export class MissingAuthorize extends UnknownError {
  name = "MissingAuthorizeError"
  code = "CALLBACK_CREDENTIALS_HANDLER_ERROR"
}

export class MissingAdapter extends UnknownError {
  name = "MissingAdapterError"
  code = "EMAIL_REQUIRES_ADAPTER_ERROR"
}

export class MissingAdapterMethods extends UnknownError {
  name = "MissingAdapterMethodsError"
  code = "MISSING_ADAPTER_METHODS_ERROR"
}

export class UnsupportedStrategy extends UnknownError {
  name = "UnsupportedStrategyError"
  code = "CALLBACK_CREDENTIALS_JWT_ERROR"
}

export class InvalidCallbackUrl extends UnknownError {
  name = "InvalidCallbackUrl"
  code = "INVALID_CALLBACK_URL_ERROR"
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
export function adapterErrorHandler<TAdapter>(
  adapter: TAdapter | undefined,
  logger: LoggerInstance
): TAdapter | undefined {
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
