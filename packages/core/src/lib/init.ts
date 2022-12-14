import { adapterErrorHandler, eventsErrorHandler } from "./errors.js"
import * as jwt from "../jwt/index.js"
import { createCallbackUrl } from "./callback-url.js"
import * as cookie from "./cookie.js"
import { createCSRFToken } from "./csrf-token.js"
import { defaultCallbacks } from "./default-callbacks.js"
import parseProviders from "./providers.js"
import logger from "./utils/logger.js"
import parseUrl from "./utils/parse-url.js"

import type { AuthOptions, InternalOptions, RequestInternal } from "../index.js"

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
      // Asserted in assert.ts
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      secret: authOptions.secret!,
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
