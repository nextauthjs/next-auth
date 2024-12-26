import type { AuthAction } from "../../types.js"
import type { AuthConfig } from "../../index.js"
import { setLogger } from "./logger.js"

/**
 *  Set default env variables on the config object
 * @param suppressWarnings intended for framework authors.
 */
export function setEnvDefaults(
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

  if (!config.secret?.length) {
    config.secret = []
    const secret = envObject.AUTH_SECRET
    if (secret) config.secret.push(secret)
    for (const i of [1, 2, 3]) {
      const secret = envObject[`AUTH_SECRET_${i}`]
      if (secret) config.secret.unshift(secret)
    }
  }

  config.redirectProxyUrl ??= envObject.AUTH_REDIRECT_PROXY_URL
  config.trustHost ??= !!(
    envObject.AUTH_URL ??
    envObject.AUTH_TRUST_HOST ??
    envObject.VERCEL ??
    envObject.CF_PAGES ??
    envObject.NODE_ENV !== "production"
  )
  config.providers = config.providers.map((provider) => {
    const { id } = typeof provider === "function" ? provider({}) : provider
    const ID = id.toUpperCase().replace(/-/g, "_")
    const clientId = envObject[`AUTH_${ID}_ID`]
    const clientSecret = envObject[`AUTH_${ID}_SECRET`]
    const issuer = envObject[`AUTH_${ID}_ISSUER`]
    const apiKey = envObject[`AUTH_${ID}_KEY`]
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
  })
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
