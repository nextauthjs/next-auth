import {
  isSession,
  redirect,
  Session,
  SessionStorage,
  CreateCookieSessionStorageFunction,
  SessionIdStorageStrategy,
} from "@remix-run/server-runtime"
import { Auth } from "../../../core/src"
import { defaultCookies as authjsDefaultCookies } from "../../../core/src/lib/cookie"

import type {
  AuthAction,
  AuthConfig,
  CookieOption as AuthjsCookieOptions,
} from "../../../core/src/types"

const actions: AuthAction[] = [
  "providers",
  "session",
  "csrf",
  "signin",
  "signout",
  "callback",
  "verify-request",
  "error",
]

export interface RemixAuthConfig extends AuthConfig {
  /**
   * Defines the base path for the auth routes.
   * If you change the default value,
   * you must also update the callback URL used by the [providers](https://authjs.dev/reference/core/modules/providers).
   *
   * @default "/auth"
   */
  prefix?: string
  trustHost?: boolean
  secret?: string
}

export class RemixAuthenticator<User = unknown> {
  private readonly options: RemixAuthConfig

  constructor(
    options: RemixAuthConfig,
    env: Record<string, string | undefined>
  ) {
    this.options = options
    this.options.secret ??= env.AUTH_SECRET
    this.options.trustHost ??= !!(
      env.AUTH_TRUST_HOST ?? env.NODE_ENV === "development"
    )
  }

  async authenticate(strategy: string, request: Request): Promise<Response> {
    return await Auth(request, this.options)
  }

  /**
   * Call this to check if the user is authenticated. It will return a Promise
   * with the user object or null, you can use this to check if the user is
   * logged-in or not without triggering the whole authentication flow.
   * @example
   * async function loader({ request }: LoaderArgs) {
   *   // if the user is not authenticated, redirect to login
   *   let user = await authenticator.isAuthenticated(request, {
   *     failureRedirect: "/login",
   *   });
   *   // do something with the user
   *   return json(privateData);
   * }
   * @example
   * async function loader({ request }: LoaderArgs) {
   *   // if the user is authenticated, redirect to /dashboard
   *   await authenticator.isAuthenticated(request, {
   *     successRedirect: "/dashboard"
   *   });
   *   return json(publicData);
   * }
   * @example
   * async function loader({ request }: LoaderArgs) {
   *   // manually handle what happens if the user is or not authenticated
   *   let user = await authenticator.isAuthenticated(request);
   *   if (!user) return json(publicData);
   *   return sessionLoader(request);
   * }
   */
  async isAuthenticated(
    request: Request | Session,
    options?: { successRedirect?: never; failureRedirect?: never }
  ): Promise<User | null>
  async isAuthenticated(
    request: Request | Session,
    options: { successRedirect: string; failureRedirect?: never }
  ): Promise<null>
  async isAuthenticated(
    request: Request | Session,
    options: { successRedirect?: never; failureRedirect: string }
  ): Promise<User>
  async isAuthenticated(
    request: Request | Session,
    options: { successRedirect: string; failureRedirect: string }
  ): Promise<null>
  async isAuthenticated(
    request: Request | Session,
    options:
      | { successRedirect?: never; failureRedirect?: never }
      | { successRedirect: string; failureRedirect?: never }
      | { successRedirect?: never; failureRedirect: string }
      | { successRedirect: string; failureRedirect: string } = {}
  ): Promise<User | null> {
    const session = isSession(request)
      ? request
      : await this.sessionStorage.getSession(request.headers.get("Cookie"))

    const user: User | null = session.get(this.sessionKey) ?? null

    if (user) {
      if (options.successRedirect) throw redirect(options.successRedirect)
      else return user
    }

    if (options.failureRedirect) throw redirect(options.failureRedirect)
    else return null
  }

  /**
   * Destroy the user session throw a redirect to another URL.
   * @example
   * async function action({ request }: ActionArgs) {
   *   await authenticator.logout(request, { redirectTo: "/login" });
   * }
   */
  async logout(
    request: Request | Session,
    options: { redirectTo: string }
  ): Promise<never> {
    const session = isSession(request)
      ? request
      : await this.sessionStorage.getSession(request.headers.get("Cookie"))

    throw redirect(options.redirectTo, {
      headers: {
        "Set-Cookie": await this.sessionStorage.destroySession(session),
      },
    })
  }
}
