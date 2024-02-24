import { defaultCookies } from "./cookie.js"
import {
  AuthError,
  DuplicateConditionalUI,
  ExperimentalFeatureNotEnabled,
  InvalidCallbackUrl,
  InvalidEndpoints,
  MissingAdapter,
  MissingAdapterMethods,
  MissingAuthorize,
  MissingSecret,
  MissingWebAuthnAutocomplete,
  UnsupportedStrategy,
  UntrustedHost,
} from "../../errors.js"

import type { AuthConfig, RequestInternal, SemverString } from "../../types.js"
import type { WarningCode } from "./logger.js"
import { Adapter } from "../../adapters.js"

type ConfigError =
  | InvalidCallbackUrl
  | InvalidEndpoints
  | MissingAdapter
  | MissingAdapterMethods
  | MissingAuthorize
  | MissingSecret
  | UnsupportedStrategy

let warned = false

function isValidHttpUrl(url: string, baseUrl: string) {
  try {
    return /^https?:/.test(
      new URL(url, url.startsWith("/") ? baseUrl : undefined).protocol
    )
  } catch {
    return false
  }
}

function isSemverString(version: string): version is SemverString {
  return /^v\d+(?:\.\d+){0,2}$/.test(version)
}

let hasCredentials = false
let hasEmail = false
let hasWebAuthn = false

const emailMethods: (keyof Adapter)[] = [
  "createVerificationToken",
  "useVerificationToken",
  "getUserByEmail",
]

const sessionMethods: (keyof Adapter)[] = [
  "createUser",
  "getUser",
  "getUserByEmail",
  "getUserByAccount",
  "updateUser",
  "linkAccount",
  "createSession",
  "getSessionAndUser",
  "updateSession",
  "deleteSession",
]

const webauthnMethods: (keyof Adapter)[] = [
  "createUser",
  "getUser",
  "linkAccount",
  "getAccount",
  "getAuthenticator",
  "createAuthenticator",
  "listAuthenticatorsByUserId",
  "updateAuthenticatorCounter",
]

/**
 * Verify that the user configured Auth.js correctly.
 * Good place to mention deprecations as well.
 *
 * This is invoked before the init method, so default values are not available yet.
 */
export function assertConfig(
  request: RequestInternal,
  options: AuthConfig
): ConfigError | WarningCode[] {
  const { url } = request
  const warnings: WarningCode[] = []

  if (!warned && options.debug) warnings.push("debug-enabled")

  if (!options.trustHost) {
    return new UntrustedHost(`Host must be trusted. URL was: ${request.url}`)
  }

  if (!options.secret) {
    return new MissingSecret("Please define a `secret`.")
  }

  const callbackUrlParam = request.query?.callbackUrl as string | undefined

  if (callbackUrlParam && !isValidHttpUrl(callbackUrlParam, url.origin)) {
    return new InvalidCallbackUrl(
      `Invalid callback URL. Received: ${callbackUrlParam}`
    )
  }

  const { callbackUrl: defaultCallbackUrl } = defaultCookies(
    options.useSecureCookies ?? url.protocol === "https:"
  )
  const callbackUrlCookie =
    request.cookies?.[
      options.cookies?.callbackUrl?.name ?? defaultCallbackUrl.name
    ]

  if (callbackUrlCookie && !isValidHttpUrl(callbackUrlCookie, url.origin)) {
    return new InvalidCallbackUrl(
      `Invalid callback URL. Received: ${callbackUrlCookie}`
    )
  }

  // Keep track of webauthn providers that use conditional UI
  let hasConditionalUIProvider = false

  for (const p of options.providers) {
    const provider = typeof p === "function" ? p() : p
    if (
      (provider.type === "oauth" || provider.type === "oidc") &&
      !(provider.issuer ?? provider.options?.issuer)
    ) {
      const { authorization: a, token: t, userinfo: u } = provider

      let key
      if (typeof a !== "string" && !a?.url) key = "authorization"
      else if (typeof t !== "string" && !t?.url) key = "token"
      else if (typeof u !== "string" && !u?.url) key = "userinfo"

      if (key) {
        return new InvalidEndpoints(
          `Provider "${provider.id}" is missing both \`issuer\` and \`${key}\` endpoint config. At least one of them is required.`
        )
      }
    }

    if (provider.type === "credentials") hasCredentials = true
    else if (provider.type === "email") hasEmail = true
    else if (provider.type === "webauthn") {
      hasWebAuthn = true

      // Validate simpleWebAuthnBrowserVersion
      if (provider.simpleWebAuthnBrowserVersion && !isSemverString(provider.simpleWebAuthnBrowserVersion)) {
        return new AuthError(
          `Invalid provider config for "${provider.id}": simpleWebAuthnBrowserVersion "${provider.simpleWebAuthnBrowserVersion}" must be a valid semver string.`
        )
      }

      if (provider.enableConditionalUI) {
        // Make sure only one webauthn provider has "enableConditionalUI" set to true
        if (hasConditionalUIProvider) {
          return new DuplicateConditionalUI(
            `Multiple webauthn providers have 'enableConditionalUI' set to True. Only one provider can have this option enabled at a time.`
          )
        }
        hasConditionalUIProvider = true

        // Make sure at least one formField has "webauthn" in its autocomplete param
        const hasWebauthnFormField = Object.values(
          provider.formFields
        ).some((f) => f.autocomplete && f.autocomplete.toString().indexOf("webauthn") > -1)
        if (!hasWebauthnFormField) {
          return new MissingWebAuthnAutocomplete(
            `Provider "${provider.id}" has 'enableConditionalUI' set to True, but none of its formFields have 'webauthn' in their autocomplete param.`
          )
        }
      }
    }
  }

  if (hasCredentials) {
    const dbStrategy = options.session?.strategy === "database"
    const onlyCredentials = !options.providers.some(
      (p) => (typeof p === "function" ? p() : p).type !== "credentials"
    )
    if (dbStrategy && onlyCredentials) {
      return new UnsupportedStrategy(
        "Signing in with credentials only supported if JWT strategy is enabled"
      )
    }

    const credentialsNoAuthorize = options.providers.some((p) => {
      const provider = typeof p === "function" ? p() : p
      return provider.type === "credentials" && !provider.authorize
    })
    if (credentialsNoAuthorize) {
      return new MissingAuthorize(
        "Must define an authorize() handler to use credentials authentication provider"
      )
    }
  }

  const { adapter, session } = options

  let requiredMethods: (keyof Adapter)[] = []

  if (hasEmail || session?.strategy === "database" || (!session?.strategy && adapter)) {
    if (hasEmail) {
      if (!adapter) return new MissingAdapter("Email login requires an adapter.")
      requiredMethods.push(...emailMethods)
    } else {
      if (!adapter) return new MissingAdapter("Database session requires an adapter.")
      requiredMethods.push(...sessionMethods)
    }
  }

  if (hasWebAuthn) {
    // Log experimental warning
    if (options.experimental?.enableWebAuthn) {
      warnings.push("experimental-webauthn")
    } else {
      return new ExperimentalFeatureNotEnabled("WebAuthn is an experimental feature. To enable it, set `experimental.enableWebAuthn` to `true` in your config.")
    }

    if (!adapter) return new MissingAdapter("WebAuthn requires an adapter.")
    requiredMethods.push(...webauthnMethods)
  }

  if (adapter) {
    const missing = requiredMethods.filter((m) => !(m in adapter))

    if (missing.length) {
      return new MissingAdapterMethods(
        `Required adapter methods were missing: ${missing.join(", ")}`
      )
    }
  }

  if (!warned) warned = true

  return warnings
}
