import { randomBytes, randomUUID } from "crypto"
import { AuthOptions } from ".."
import logger from "../utils/logger"
import { adapterErrorHandler, eventsErrorHandler } from "./errors"
import parseProviders from "./lib/providers"
import { createSecret } from "./lib/utils"
import * as cookie from "./lib/cookie"
import * as jwt from "../jwt"
import { defaultCallbacks } from "./lib/default-callbacks"
import { createCSRFToken } from "./lib/csrf-token"
import { createCallbackUrl } from "./lib/callback-url"
import { RequestInternal } from "."

import type { InternalOptions } from "./types"
import parseUrl from "../utils/parse-url"

interface InitParams {
  origin?: string
  authOptions: AuthOptions
  providerId?: string
  action: InternalOptions["action"]
  /** Callback URL value extracted from the incoming request. */
  callbackUrl?: string
  /** CSRF token value extracted from the incoming request. From body if POST, from query if GET */
  csrfToken?: string
  /** Is the incoming request a POST request? */
  isPost: boolean
  cookies: RequestInternal["cookies"]
}

/** Initialize all internal options and cookies. */
export async function init({
  authOptions,
  providerId,
  action,
  origin,
  cookies: reqCookies,
  callbackUrl: reqCallbackUrl,
  csrfToken: reqCsrfToken,
  isPost,
}: InitParams): Promise<{
  options: InternalOptions
  cookies: cookie.Cookie[]
}> {
  const url = parseUrl(origin)

  const secret = createSecret({ authOptions, url })

  const { providers, provider } = parseProviders({
    providers: authOptions.providers,
    url,
    providerId,
  })

  const maxAge = 30 * 24 * 60 * 60 // Sessions expire after 30 days of being idle by default

  // User provided options are overriden by other options,
  // except for the options with special handling above
  const options: InternalOptions = {
    debug: false,
    pages: {},
    theme: {
      colorScheme: "auto",
      logo: "",
      brandColor: "",
      buttonText: "",
    },
    // Custom options override defaults
    ...authOptions,
    // These computed settings can have values in authOptions but we override them
    // and are request-specific.
    url,
    action,
    // @ts-expect-errors
    provider,
    cookies: {
      ...cookie.defaultCookies(
        authOptions.useSecureCookies ?? url.base.startsWith("https://")
      ),
      // Allow user cookie options to override any cookie settings above
      ...authOptions.cookies,
    },
    secret,
    providers,
    // Session options
    session: {
      // If no adapter specified, force use of JSON Web Tokens (stateless)
      strategy: authOptions.adapter ? "database" : "jwt",
      maxAge,
      updateAge: 24 * 60 * 60,
      generateSessionToken: () => {
        // Use `randomUUID` if available. (Node 15.6+)
        return randomUUID?.() ?? randomBytes(32).toString("hex")
      },
      ...authOptions.session,
    },
    // JWT options
    jwt: {
      secret, // Use application secret if no keys specified
      maxAge, // same as session maxAge,
      encode: jwt.encode,
      decode: jwt.decode,
      ...authOptions.jwt,
    },
    // Event messages
    events: eventsErrorHandler(authOptions.events ?? {}, logger),
    adapter: adapterErrorHandler(authOptions.adapter, logger),
    // Callback functions
    callbacks: { ...defaultCallbacks, ...authOptions.callbacks },
    logger,
    callbackUrl: url.origin,
  }

  // Init cookies

  const cookies: cookie.Cookie[] = []

  const {
    csrfToken,
    cookie: csrfCookie,
    csrfTokenVerified,
  } = createCSRFToken({
    options,
    cookieValue: reqCookies?.[options.cookies.csrfToken.name],
    isPost,
    bodyValue: reqCsrfToken,
  })

  options.csrfToken = csrfToken
  options.csrfTokenVerified = csrfTokenVerified

  if (csrfCookie) {
    cookies.push({
      name: options.cookies.csrfToken.name,
      value: csrfCookie,
      options: options.cookies.csrfToken.options,
    })
  }

  const { callbackUrl, callbackUrlCookie } = await createCallbackUrl({
    options,
    cookieValue: reqCookies?.[options.cookies.callbackUrl.name],
    paramValue: reqCallbackUrl,
  })
  options.callbackUrl = callbackUrl
  if (callbackUrlCookie) {
    cookies.push({
      name: options.cookies.callbackUrl.name,
      value: callbackUrlCookie,
      options: options.cookies.callbackUrl.options,
    })
  }

  return { options, cookies }
}
