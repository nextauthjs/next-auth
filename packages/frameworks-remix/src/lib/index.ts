import { Auth } from "../../../core/src"
import { defaultCookies as authjsDefaultCookies } from "../../../core/src/lib/cookie"

import type {
  AuthAction,
  AuthConfig,
  CookieOption as AuthjsCookieOptions,
} from "../../../core/src/types"
import type {
  CreateCookieSessionStorageFunction,
  SessionIdStorageStrategy,
} from "@remix-run/server-runtime"

export interface CookiesOptions {
  sessionToken: SessionIdStorageStrategy["cookie"]
  callbackUrl?: SessionIdStorageStrategy["cookie"]
  csrfToken?: SessionIdStorageStrategy["cookie"]
  pkceCodeVerifier?: SessionIdStorageStrategy["cookie"]
  state?: SessionIdStorageStrategy["cookie"]
  nonce?: SessionIdStorageStrategy["cookie"]
}

/** Configure the {@link RemixAuth} method. */
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

export async function RemixAuth(
  request: Request,
  env: Record<string, string | undefined>,
  options: RemixAuthConfig
): Promise<Response> {
  const { prefix = "/auth", ...authOptions } = options
  authOptions.secret ??= env.AUTH_SECRET
  authOptions.trustHost ??= !!(
    env.AUTH_TRUST_HOST ?? env.NODE_ENV === "development"
  )
  const url = new URL(request.url)

  const action = url.pathname
    .slice(prefix.length + 1)
    .split("/")[0] as AuthAction

  if (!actions.includes(action) || !url.pathname.startsWith(prefix + "/")) {
    return await requestHandler()
  }

  const cookies = {
    ...authjsDefaultCookies(
      authOptions.useSecureCookies ?? url.protocol === "https:"
    ),
  }

  return await Auth(request, authOptions)
}

export function createCookies(useSecureCookies: boolean): AuthjsCookieOptions {
  const cookiePrefix = useSecureCookies ? "__Secure-" : ""
  return {
    // default cookie options
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
    callbackUrl: {
      name: `${cookiePrefix}next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
    csrfToken: {
      // Default to __Host- for CSRF token for additional protection if using useSecureCookies
      // NB: The `__Host-` prefix is stricter than the `__Secure-` prefix.
      name: `${useSecureCookies ? "__Host-" : ""}next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
    pkceCodeVerifier: {
      name: `${cookiePrefix}next-auth.pkce.code_verifier`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        maxAge: 60 * 15, // 15 minutes in seconds
      },
    },
    state: {
      name: `${cookiePrefix}next-auth.state`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        maxAge: 60 * 15, // 15 minutes in seconds
      },
    },
    nonce: {
      name: `${cookiePrefix}next-auth.nonce`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
  }
}
