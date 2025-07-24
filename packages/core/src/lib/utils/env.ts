import type { AuthAction } from "../../types.js"
import type { AuthConfig } from "../../index.js"
import { setLogger } from "./logger.js"
import type { Provider } from "../../providers/index.js"

export type ProviderSecrets<T = string> = {
  provider: Provider
  providerId: string
  PROVIDER_ID: string
  clientId?: T
  clientSecret?: T
  issuer?: T
  apiKey?: T
}

export type EnvSecrets<T = string> = {
  secrets: T[]
  providers: ProviderSecrets<T>[]
}

export function collectEnvSecrets<T>(
  envObject: any,
  config: AuthConfig
): EnvSecrets<T> {
  const secrets = []
  if (config.secret) {
    secrets.push(...config.secret)
  }
  if (envObject.AUTH_SECRET) {
    secrets.push(envObject.AUTH_SECRET)
  }
  for (const i of [1, 2, 3]) {
    const secret = envObject[`AUTH_SECRET_${i}`]
    if (secret) {
      secrets.push(secret)
    }
  }

  const providers = config.providers.map((provider) => {
    const { id } = typeof provider === "function" ? provider({}) : provider
    const ID = id.toUpperCase().replace(/-/g, "_")
    const secrets = {
      clientId: envObject[`AUTH_${ID}_ID`],
      clientSecret: envObject[`AUTH_${ID}_SECRET`],
      issuer: envObject[`AUTH_${ID}_ISSUER`],
      apiKey: envObject[`AUTH_${ID}_KEY`],
    }

    /**
     * Attach provider and id metadata to the secrets object.
     * Make non-enumerable to simplify iteration over secrets.
     */
    Object.defineProperties(secrets, {
      provider: {
        value: provider,
        enumerable: false,
      },
      providerId: {
        value: id,
        enumerable: false,
      },
      PROVIDER_ID: {
        value: ID,
        enumerable: false,
      },
    })

    return secrets as ProviderSecrets<T>
  })

  return {
    secrets,
    providers,
  }
}

export function applyEnvSettings(
  envObject: any,
  config: AuthConfig,
  suppressBasePathWarning = false
) {
  try {
    const url = envObject.AUTH_URL
    if (url) {
      if (config.basePath) {
        if (!suppressBasePathWarning) {
          const logger = setLogger(config)
          logger.warn("env-url-basepath-redundant")
        }
      } else {
        config.basePath = new URL(url).pathname
      }
    }
  } catch {
    // Catching and swallowing potential URL parsing errors, we'll fall
    // back to `/auth` below.
  } finally {
    config.basePath ??= `/auth`
  }

  config.redirectProxyUrl ??= envObject.AUTH_REDIRECT_PROXY_URL
  config.trustHost ??= !!(
    envObject.AUTH_URL ??
    envObject.AUTH_TRUST_HOST ??
    envObject.VERCEL ??
    envObject.CF_PAGES ??
    envObject.NODE_ENV !== "production"
  )
}

export function applyEnvSecrets(config: AuthConfig, secrets: EnvSecrets) {
  config.secret = secrets.secrets
  config.providers = secrets.providers.map(
    ({ provider, clientId, clientSecret, issuer, apiKey }) => {
      const finalProvider =
        typeof provider === "function"
          ? provider({ clientId, clientSecret, issuer, apiKey })
          : provider
      if (finalProvider.type === "oauth" || finalProvider.type === "oidc") {
        finalProvider.clientId ??= clientId
        finalProvider.clientSecret ??= clientSecret
        finalProvider.issuer ??= issuer
      } else if (finalProvider.type === "email") {
        finalProvider.apiKey ??= apiKey
      }
      return finalProvider
    }
  )
}

/**
 *  Set default env variables on the config object
 * @param suppressWarnings intended for framework authors.
 */
export function setEnvDefaults(
  envObject: any,
  config: AuthConfig,
  suppressBasePathWarning = false
) {
  applyEnvSettings(envObject, config, suppressBasePathWarning)
  applyEnvSecrets(config, collectEnvSecrets(envObject, config))
}

export function createActionURL(
  action: AuthAction,
  protocol: string,
  headers: Headers,
  envObject: any,
  config: Pick<AuthConfig, "basePath" | "logger">
): URL {
  const basePath = config?.basePath
  const envUrl = envObject.AUTH_URL ?? envObject.NEXTAUTH_URL

  let url: URL
  if (envUrl) {
    url = new URL(envUrl)
    if (basePath && basePath !== "/" && url.pathname !== "/") {
      if (url.pathname !== basePath) {
        const logger = setLogger(config)
        logger.warn("env-url-basepath-mismatch")
      }
      url.pathname = "/"
    }
  } else {
    const detectedHost = headers.get("x-forwarded-host") ?? headers.get("host")
    const detectedProtocol =
      headers.get("x-forwarded-proto") ?? protocol ?? "https"
    const _protocol = detectedProtocol.endsWith(":")
      ? detectedProtocol
      : detectedProtocol + ":"

    url = new URL(`${_protocol}//${detectedHost}`)
  }

  // remove trailing slash
  const sanitizedUrl = url.toString().replace(/\/$/, "")

  if (basePath) {
    // remove leading and trailing slash
    const sanitizedBasePath = basePath?.replace(/(^\/|\/$)/g, "") ?? ""
    return new URL(`${sanitizedUrl}/${sanitizedBasePath}/${action}`)
  }
  return new URL(`${sanitizedUrl}/${action}`)
}
