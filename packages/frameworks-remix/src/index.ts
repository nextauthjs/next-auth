import { Auth } from "@auth/core"
import type { AuthAction, AuthConfig, Session } from "@auth/core/types"
export async function getSession(
  req: Request,
  env: Record<string, string | undefined>,
  config: AuthConfig
): Promise<Session | null> {
  config.secret ??= env.AUTH_SECRET
  config.trustHost ??= true

  const url = new URL("/api/auth/session", req.url)
  const request = new Request(url, { headers: req.headers })
  const response = await Auth(request, config)

  const { status = 200 } = response
  const data: Session & { message?: string } = await response.json()

  if (!data || !Object.keys(data).length) return null
  if (status === 200) return data
  throw new Error(data.message)
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

export function createRequestHandlerWithAuth(
  request: Request,
  env: Record<string, string | undefined>,
  context: Record<string, any> = {},
  options: RemixAuthConfig,
  /**
   * The request handler created from running createRequestHandler from remix (@remix-run/express, @remix-run/netlify, @remix-run/vercel) or createPagesFunctionHandler from @remix-run/cloudflare-pages
   *
   */
  requestHandler: () => Promise<Response | void>
): Promise<Response | void> {
  const { prefix = "/auth", ...authOptions } = options
  authOptions.secret ??= env.AUTH_SECRET
  authOptions.trustHost ??= !!(
    env.AUTH_TRUST_HOST ?? env.NODE_ENV === "development"
  )
  const url = new URL(request.url)
  context.getSession ??= () => getSession(request, env, authOptions)

  const action = url.pathname
    .slice(prefix.length + 1)
    .split("/")[0] as AuthAction

  if (!actions.includes(action) || !url.pathname.startsWith(prefix + "/")) {
    return requestHandler()
  }

  return Auth(request, authOptions)
}
