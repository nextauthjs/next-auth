import * as jwt from "../jwt.js"
import { createCallbackUrl } from "./utils/callback-url.js"
import * as cookie from "./utils/cookie.js"
import { createCSRFToken } from "./actions/callback/oauth/csrf-token.js"

import { AdapterError, EventError } from "../errors.js"
import parseProviders from "./utils/providers.js"
import { setLogger, type LoggerInstance } from "./utils/logger.js"
import { merge } from "./utils/merge.js"
import { skipCSRFCheck } from "./symbols.js"

import type { InternalConfig, RequestInternal } from "../types.js"
import type { AuthConfig } from "../index.js"

export const defaultCallbacks: InternalConfig["callbacks"] = {
  signIn() {
    return true
  },
  redirect({ url, baseUrl }) {
    if (url.startsWith("/")) return `${baseUrl}${url}`
    else if (new URL(url).origin === baseUrl) return url
    return baseUrl
  },
  session({ session }) {
    return {
      user: {
        name: session.user?.name,
        email: session.user?.email,
        image: session.user?.image,
      },
      expires: session.expires?.toISOString?.() ?? session.expires,
    }
  },
  jwt({ token }) {
    return token
  },
}

/** Initialize all internal options. */
export async function init(
  request: RequestInternal,
  userConfig: AuthConfig
): Promise<InternalConfig> {
  const logger = setLogger(userConfig)

  const { providerId, action, url, cookies: reqCookies } = request
  const isPost = request.method === "POST"
  const csrfDisabled = userConfig.skipCSRFCheck === skipCSRFCheck

  const reqCallbackUrl = request.body?.callbackUrl ?? request.query?.callbackUrl
  const reqCsrfToken = request.body?.csrfToken

  const { providers, provider } = parseProviders({
    url,
    providerId,
    config: userConfig,
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

  const cookies = merge(
    cookie.defaultCookies(
      userConfig.useSecureCookies ?? url.protocol === "https:"
    ),
    userConfig.cookies
  )

  // User provided options are overridden by other options,
  // except for the options with special handling above
  const config: InternalConfig = {
    debug: false,
    pages: {},
    theme: {
      colorScheme: "auto",
      logo: "",
      brandColor: "",
      buttonText: "",
    },
    // Custom options override defaults
    ...userConfig,
    // These computed settings can have values in userOptions but we override them
    // and are request-specific.
    url,
    action,
    // @ts-expect-errors
    provider,
    cookies,
    providers,
    // Session options
    session: {
      // If no adapter specified, force use of JSON Web Tokens (stateless)
      strategy: userConfig.adapter ? "database" : "jwt",
      maxAge,
      updateAge: 24 * 60 * 60,
      generateSessionToken: () => crypto.randomUUID(),
      ...userConfig.session,
    },
    // JWT options
    jwt: {
      secret: userConfig.secret!, // Asserted in assert.ts
      maxAge: userConfig.session?.maxAge ?? maxAge, // default to same as `session.maxAge`
      encode: jwt.encode,
      decode: jwt.decode,
      ...userConfig.jwt,
    },
    // Event messages
    events: eventsErrorHandler(userConfig.events ?? {}, logger),
    adapter: adapterErrorHandler(userConfig.adapter, logger),
    // Callback functions
    callbacks: { ...defaultCallbacks, ...userConfig.callbacks },
    logger,
    callbackUrl: url.origin,
    isOnRedirectProxy,
    experimental: {
      ...userConfig.experimental,
    },
    resCookies: [],
    sessionStore: new cookie.SessionStore(
      cookies.sessionToken,
      reqCookies,
      logger
    ),
  }

  if (csrfDisabled) {
    config.csrfTokenVerified = true
  } else {
    const {
      csrfToken,
      cookie: csrfCookie,
      csrfTokenVerified,
    } = await createCSRFToken({
      config: config,
      cookieValue: reqCookies?.[config.cookies.csrfToken.name],
      isPost,
      bodyValue: reqCsrfToken,
    })

    config.csrfToken = csrfToken
    config.csrfTokenVerified = csrfTokenVerified

    if (csrfCookie) {
      config.resCookies.push({
        name: config.cookies.csrfToken.name,
        value: csrfCookie,
        options: config.cookies.csrfToken.options,
      })
    }
  }

  const { callbackUrl, callbackUrlCookie } = await createCallbackUrl({
    config: config,
    cookieValue: reqCookies?.[config.cookies.callbackUrl.name],
    paramValue: reqCallbackUrl,
  })
  config.callbackUrl = callbackUrl
  if (callbackUrlCookie) {
    config.resCookies.push({
      name: config.cookies.callbackUrl.name,
      value: callbackUrlCookie,
      options: config.cookies.callbackUrl.options,
    })
  }

  return config
}

type Method = (...args: any[]) => Promise<any>

/** Wraps an object of methods and adds error handling. */
function eventsErrorHandler(
  methods: Partial<InternalConfig["events"]>,
  logger: LoggerInstance
): Partial<InternalConfig["events"]> {
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
