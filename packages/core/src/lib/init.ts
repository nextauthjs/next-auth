import * as jwt from "../jwt.js"
import { createCallbackUrl } from "./utils/callback-url.js"
import * as cookie from "./utils/cookie.js"
import { createCSRFToken } from "./actions/callback/oauth/csrf-token.js"

import { AdapterError, EventError } from "../errors.js"
import parseProviders from "./utils/providers.js"
import { logger, type LoggerInstance } from "./utils/logger.js"
import parseUrl from "./utils/parse-url.js"
import { merge } from "./utils/merge.js"

import type {
  AuthConfig,
  CallbacksOptions,
  EventCallbacks,
  InternalOptions,
  RequestInternal,
} from "../types.js"

interface InitParams {
  url: URL
  authOptions: AuthConfig
  providerId?: string
  action: InternalOptions["action"]
  /** Callback URL value extracted from the incoming request. */
  callbackUrl?: string
  /** CSRF token value extracted from the incoming request. From body if POST, from query if GET */
  csrfToken?: string
  /** Is the incoming request a POST request? */
  csrfDisabled: boolean
  isPost: boolean
  cookies: RequestInternal["cookies"]
}

export const defaultCallbacks: CallbacksOptions = {
  signIn() {
    return true
  },
  redirect({ url, baseUrl }) {
    if (url.startsWith("/")) return `${baseUrl}${url}`
    else if (new URL(url).origin === baseUrl) return url
    return baseUrl
  },
  session({ session }) {
    return session
  },
  jwt({ token }) {
    return token
  },
}

/** Initialize all internal options and cookies. */
export async function init({
  authOptions,
  providerId,
  action,
  url,
  cookies: reqCookies,
  callbackUrl: reqCallbackUrl,
  csrfToken: reqCsrfToken,
  csrfDisabled,
  isPost,
}: InitParams): Promise<{
  options: InternalOptions
  cookies: cookie.Cookie[]
}> {
  const { providers, provider } = parseProviders({
    providers: authOptions.providers,
    url,
    providerId,
    options: authOptions,
  })

  const maxAge = 30 * 24 * 60 * 60 // Sessions expire after 30 days of being idle by default

  let isOnRedirectProxy = false
  if (
    (provider?.type === "oauth" || provider?.type === "oidc") &&
    provider.redirectProxyUrl
  ) {
    try {
      isOnRedirectProxy =
        new URL(provider.redirectProxyUrl).origin === url.origin
    } catch {
      throw new TypeError(
        `redirectProxyUrl must be a valid URL. Received: ${provider.redirectProxyUrl}`
      )
    }
  }

  // User provided options are overridden by other options,
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
    cookies: merge(
      cookie.defaultCookies(
        authOptions.useSecureCookies ?? url.protocol === "https:"
      ),
      authOptions.cookies
    ),
    providers,
    // Session options
    session: {
      // If no adapter specified, force use of JSON Web Tokens (stateless)
      strategy: authOptions.adapter ? "database" : "jwt",
      maxAge,
      updateAge: 24 * 60 * 60,
      generateSessionToken: () => crypto.randomUUID(),
      ...authOptions.session,
    },
    // JWT options
    jwt: {
      // Asserted in assert.ts
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      secret: authOptions.secret!,
      maxAge: authOptions.session?.maxAge ?? maxAge, // default to same as `session.maxAge`
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
    isOnRedirectProxy,
    experimental: {
      ...authOptions.experimental,
    }
  }

  // Init cookies

  const cookies: cookie.Cookie[] = []

  if (csrfDisabled) {
    options.csrfTokenVerified = true
  } else {
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
        logger.error(new EventError(e as Error))
      }
    }
    return acc
  }, {})
}

/** Handles adapter induced errors. */
function adapterErrorHandler(
  adapter: AuthConfig["adapter"],
  logger: LoggerInstance
) {
  if (!adapter) return

  return Object.keys(adapter).reduce<any>((acc, name) => {
    acc[name] = async (...args: any[]) => {
      try {
        logger.debug(`adapter_${name}`, { args })
        const method: Method = adapter[name as keyof Method]
        return await method(...args)
      } catch (e) {
        const error = new AdapterError(e as Error)
        logger.error(error)
        throw error
      }
    }
    return acc
  }, {})
}
