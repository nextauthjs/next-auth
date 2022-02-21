import logger, { setLogger } from "../lib/logger"
import renderPage from "./pages"
import { init } from "./init"
import { assertConfig } from "./lib/assert"
import { SessionStore } from "./lib/cookie"

import { NextAuthOptions } from "./types"
import type { NextAuthAction } from "../lib/types"
import type { Cookie } from "./lib/cookie"

export interface IncomingRequest {
  /** @default "http://localhost:3000" */
  host?: string
  method?: string
  cookies?: Record<string, string>
  headers?: Record<string, any>
  query?: Record<string, any>
  body?: Record<string, any>
  action: NextAuthAction
  providerId?: string
  error?: string
}

export interface NextAuthHeader {
  key: string
  value: string
}

export interface OutgoingResponse<
  Body extends string | Record<string, any> | any[] = any
> {
  status?: number
  headers?: NextAuthHeader[]
  body?: Body
  redirect?: string
  cookies?: Cookie[]
}

export interface NextAuthHandlerParams {
  req: IncomingRequest
  options: NextAuthOptions
}

export async function NextAuthHandler<
  Body extends string | Record<string, any> | any[]
>(params: NextAuthHandlerParams): Promise<OutgoingResponse<Body>> {
  const { options: userOptions, req } = params

  setLogger(userOptions.logger, userOptions.debug)

  const assertionResult = assertConfig(params)

  if (typeof assertionResult === "string") {
    logger.warn(assertionResult)
  } else if (assertionResult instanceof Error) {
    // Bail out early if there's an error in the user config
    const { pages, theme } = userOptions
    logger.error(assertionResult.code, assertionResult)
    if (pages?.error) {
      return {
        redirect: `${pages.error}?error=Configuration`,
      }
    }
    const render = renderPage({ theme })
    return render.error({ error: "configuration" })
  }

  const { action, providerId, error, method = "GET" } = req

  const { options, cookies } = await init({
    userOptions,
    action,
    providerId,
    host: req.host,
    callbackUrl: req.body?.callbackUrl ?? req.query?.callbackUrl,
    csrfToken: req.body?.csrfToken,
    cookies: req.cookies,
    isPost: method === "POST",
  })

  const sessionStore = new SessionStore(
    options.cookies.sessionToken,
    req,
    options.logger
  )

  return options.routesHandler({
    options,
    error,
    cookies,
    sessionStore,
    req,
    userOptions,
  }) as OutgoingResponse<Body>
}
