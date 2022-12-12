import { adapterErrorHandler, eventsErrorHandler } from "./errors"
import * as jwt from "./jwt"
import { createCallbackUrl } from "./lib/callback-url"
import * as cookie from "./lib/cookie"
import { createCSRFToken } from "./lib/csrf-token"
import { defaultCallbacks } from "./lib/default-callbacks"
import parseProviders from "./lib/providers"
import { createHash } from "./lib/web"
import logger from "./utils/logger"
import parseUrl from "./utils/parse-url"

import type { AuthOptions, InternalOptions, RequestInternal } from "."

interface InitParams {
  url: URL
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
  url: reqUrl,
  cookies: reqCookies,
  callbackUrl: reqCallbackUrl,
  csrfToken: reqCsrfToken,
  isPost,
}: InitParams): Promise<{
  options: InternalOptions
  cookies: cookie.Cookie[]
}> {
  // TODO: move this to web.ts
  const parsed = parseUrl(
    reqUrl.origin +
      reqUrl.pathname.replace(`/${action}`, "").replace(`/${providerId}`, "")
  )
  const url = new URL(parsed.toString())

  /**
   * Secret used to salt cookies and tokens (e.g. for CSRF protection).
   * If no secret option is specified then it creates one on the fly
   * based on options passed here. If options contains unique data, such as
   * OAuth provider secrets and database credentials it should be sufficent.
   * If no secret provided in production, we throw an error.
   */
  const secret =
    authOptions.secret ??
    // TODO: Remove this, always ask the user for a secret, even in dev! (Fix assert.ts too)
    (await createHash(JSON.stringify({ ...url, ...authOptions })))

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
    // These computed settings can have values in userOptions but we override them
    // and are request-specific.
    url,
    action,
    // @ts-expect-errors
    provider,
    cookies: {
      ...cookie.defaultCookies(
        authOptions.useSecureCookies ?? url.protocol === "https:"
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
      generateSessionToken: crypto.randomUUID,
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
  } = await createCSRFToken({
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
