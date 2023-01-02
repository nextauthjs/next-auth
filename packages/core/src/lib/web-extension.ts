import type { AuthAction, Session } from "../types.js"
import { PublicProvider } from "./routes/providers.js"

/** @internal */
export abstract class AuthRequest extends Request {
  abstract action: AuthAction
}

/**
 * Extends the standard {@link Request} to add a `session()` method on the response
 * for retrieving the {@link Session} object.
 */
export class SessionRequest extends AuthRequest {
  action = "session" as const
  constructor(req: Request) {
    super(req.url, req)
  }
}

export class SessionResponse extends Response {
  action = "session" as const

  /**
   * Returns the {@link Session} object from the response, or `null`
   * if the session is unavailable (config error, not authenticated, etc.).
   *
   * @example
   * ```ts
   * export default async function handle(req: Request) {
   *   const response = await Auth(new SessionRequest(req), authConfig)
   *   const session = await response.session()
   *
   *   if (!session) {
   *     return new Response("Not authenticated", { status: 401 })
   *   }
   *
   *   console.log(session.user) // Do something with the session
   *   return response // or return whatever you want.
   * }
   * ```
   */
  async session(): Promise<Session | null> {
    try {
      const data = await this.clone().json()
      if (!this.ok || !data || !Object.keys(data).length) {
        return null
      }
      return data
    } catch {
      return null
    }
  }
}

/**
 * Extends the standard {@link Request} to add a `providers()` method on the response
 * for retrieving a list of client-safe provider configuration. Useful for
 * rendering a list of sign-in options.
 */
export class ProvidersRequest extends AuthRequest {
  action = "providers" as const
  constructor(req: Request) {
    super(req.url, req)
  }
}

export class ProvidersResponse extends Response {
  action = "providers" as const

  /**
   * Returns the list of providers from the response, or `null`
   * if the providers are unavailable (config error, etc.).
   * @example
   * ```ts
   * export default async function handle(req: Request) {
   *  const response = await Auth(new ProvidersRequest(req), authConfig)
   * const providers = await response.providers()
   * if (!providers) {
   *  return new Response("Providers unavailable", { status: 500 })
   *
   *
   * console.log(providers) // Do something with the providers
   * return response // or return whatever you want.
   * }
   * ```
   */
  async providers(): Promise<PublicProvider[]> {
    try {
      if (!this.ok) return []
      return Object.values(await this.clone().json())
    } catch {
      return []
    }
  }
}
