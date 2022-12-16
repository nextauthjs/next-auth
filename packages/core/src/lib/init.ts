import * as jwt from "../jwt/index.js"
import { createCallbackUrl } from "./callback-url.js"
import * as cookie from "./cookie.js"
import { createCSRFToken } from "./csrf-token.js"
import { defaultCallbacks } from "./default-callbacks.js"
import { AdapterError, EventError } from "./errors.js"
import parseProviders from "./providers.js"
import { logger, type LoggerInstance } from "./utils/logger.js"
import parseUrl from "./utils/parse-url.js"

import type {
  AuthConfig,
  AuthConfigInternal,
  EventCallbacks,
  RequestInternal,
} from "../index.js"

interface InitParams {
  url: URL
  authConfig: AuthConfig
  providerId?: string
  action: AuthConfigInternal["action"]
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
  authConfig,
  providerId,
  action,
  url: reqUrl,
  cookies: reqCookies,
  callbackUrl: reqCallbackUrl,
  csrfToken: reqCsrfToken,
  isPost,
}: InitParams): Promise<{
  config: AuthConfigInternal
  cookies: cookie.Cookie[]
}> {
  // TODO: move this to web.ts
  const parsed = parseUrl(
    reqUrl.origin +
      reqUrl.pathname.replace(`/${action}`, "").replace(`/${providerId}`, "")
  )
  const url = new URL(parsed.toString())

  const { providers, provider } = parseProviders({
    providers: authConfig.providers,
    url,
    providerId,
  })

  const maxAge = 30 * 24 * 60 * 60 // Sessions expire after 30 days of being idle by default

  // User provided options are overriden by other options,
  // except for the options with special handling above
  const config: AuthConfigInternal = {
    debug: false,
    pages: {},
    theme: {
      colorScheme: "auto",
      logo: "",
      brandColor: "",
      buttonText: "",
    },
    // Custom options override defaults
    ...authConfig,
    // These computed settings can have values in userOptions but we override them
    // and are request-specific.
    url,
    action,
    // @ts-expect-errors
    provider,
    cookies: {
      ...cookie.defaultCookies(
        authConfig.useSecureCookies ?? url.protocol === "https:"
      ),
      // Allow user cookie options to override any cookie settings above
      ...authConfig.cookies,
    },
    providers,
    // Session options
    session: {
      // If no adapter specified, force use of JSON Web Tokens (stateless)
      strategy: authConfig.adapter ? "database" : "jwt",
      maxAge,
      updateAge: 24 * 60 * 60,
      generateSessionToken: crypto.randomUUID,
      ...authConfig.session,
    },
    // JWT options
    jwt: {
      // Asserted in assert.ts
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      secret: authConfig.secret!,
      maxAge, // same as session maxAge,
      encode: jwt.encode,
      decode: jwt.decode,
      ...authConfig.jwt,
    },
    // Event messages
    events: eventsErrorHandler(authConfig.events ?? {}, logger),
    adapter: adapterErrorHandler(authConfig.adapter, logger),
    // Callback functions
    callbacks: { ...defaultCallbacks, ...authConfig.callbacks },
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
    options: config,
    cookieValue: reqCookies?.[config.cookies.csrfToken.name],
    isPost,
    bodyValue: reqCsrfToken,
  })

  config.csrfToken = csrfToken
  config.csrfTokenVerified = csrfTokenVerified

  if (csrfCookie) {
    cookies.push({
      name: config.cookies.csrfToken.name,
      value: csrfCookie,
      options: config.cookies.csrfToken.options,
    })
  }

  const { callbackUrl, callbackUrlCookie } = await createCallbackUrl({
    options: config,
    cookieValue: reqCookies?.[config.cookies.callbackUrl.name],
    paramValue: reqCallbackUrl,
  })
  config.callbackUrl = callbackUrl
  if (callbackUrlCookie) {
    cookies.push({
      name: config.cookies.callbackUrl.name,
      value: callbackUrlCookie,
      options: config.cookies.callbackUrl.options,
    })
  }

  return { config, cookies }
}

type Method = (...args: any[]) => Promise<any>

/** Wraps an object of methods and adds error handling. */
function eventsErrorHandler(
  methods: Partial<EventCallbacks>,
  logger: LoggerInstance
): Partial<EventCallbacks> {
  return Object.keys(methods).reduce<any>((acc, name) => {
    acc[name] = async (...args: any[]) => {
      try {
        const method: Method = methods[name as keyof Method]
        return await method(...args)
      } catch (e) {
        logger.error(new EventError(e))
      }
    }
    return acc
  }, {})
}

/** Handles adapter induced errors. */
function adapterErrorHandler<TAdapter>(
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
      } catch (e) {
        const error = new AdapterError(e)
        logger.error(error)
        throw error
      }
    }
    return acc
  }, {})
}
