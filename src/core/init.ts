import { NextAuthOptions } from ".."
import logger from "../lib/logger"
import parseUrl from "../lib/parse-url"
import { InternalOptions } from "../lib/types"
import { adapterErrorHandler, eventsErrorHandler } from "./errors"
import parseProviders from "./lib/providers"
import createSecret from "./lib/utils"
import * as cookie from "./lib/cookie"
import * as jwt from "../jwt"
import { defaultCallbacks } from "./lib/default-callbacks"
import { createCSRFToken } from "./lib/csrf-token"
import { createCallbackUrl } from "./lib/callback-url"
import { IncomingRequest } from "."

interface InitParams {
  host?: string
  userOptions: NextAuthOptions
  providerId?: string
  action: InternalOptions["action"]
  /** Callback URL value extracted from the incoming request. */
  callbackUrl?: string
  /** CSRF token value extracted from the incoming request. From body if POST, from query if GET */
  csrfToken?: string
  /** Is the incoming request a POST request? */
  isPost: boolean
  cookies: IncomingRequest["cookies"]
}

/** Initialize all internal options and cookies. */
export async function init({
  userOptions,
  providerId,
  action,
  host,
  cookies: reqCookies,
  callbackUrl: reqCallbackUrl,
  csrfToken: reqCsrfToken,
  isPost,
}: InitParams): Promise<{
  options: InternalOptions
  cookies: cookie.Cookie[]
}> {
  const url = parseUrl(host)

  const secret = createSecret({ userOptions, url })

  const { providers, provider } = parseProviders({
    providers: userOptions.providers,
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
    },
    // Custom options override defaults
    ...userOptions,
    // These computed settings can have values in userOptions but we override them
    // and are request-specific.
    url,
    action,
    provider,
    cookies: {
      ...cookie.defaultCookies(
        userOptions.useSecureCookies ?? url.base.startsWith("https://")
      ),
      // Allow user cookie options to override any cookie settings above
      ...userOptions.cookies,
    },
    secret,
    providers,
    // Session options
    session: {
      // If no adapter specified, force use of JSON Web Tokens (stateless)
      strategy: userOptions.adapter ? "database" : "jwt",
      maxAge,
      updateAge: 24 * 60 * 60,
      ...userOptions.session,
    },
    // JWT options
    jwt: {
      secret, // Use application secret if no keys specified
      maxAge, // same as session maxAge,
      encode: jwt.encode,
      decode: jwt.decode,
      ...userOptions.jwt,
    },
    // Event messages
    events: eventsErrorHandler(userOptions.events ?? {}, logger),
    adapter: adapterErrorHandler(userOptions.adapter, logger),
    // Callback functions
    callbacks: { ...defaultCallbacks, ...userOptions.callbacks },
    logger,
    callbackUrl: process.env.NEXTAUTH_URL ?? "http://localhost:3000",
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
