import type { AuthAction, AuthConfig } from "../../types"

/**
 * Set default env variables on the config object
 **/
export function setEnvDefaults(envObject: any, config: AuthConfig) {
  try {
    const url = envObject.AUTH_URL ?? envObject.NEXTAUTH_URL
    if (url && !config.basePath) config.basePath = new URL(url).pathname
  } catch {
  } finally {
    config.basePath ??= `/auth`
  }

  if (!config.secret) {
    config.secret = []
    const secret = envObject.AUTH_SECRET
    if (secret) config.secret.push(secret)
    for (const i of [1, 2, 3]) {
      const secret = process.env[`AUTH_SECRET_${i}`]
      if (secret) config.secret.unshift(secret)
    }
  }

  config.redirectProxyUrl ??= process.env.AUTH_REDIRECT_PROXY_URL
  config.secret ??= process.env.AUTH_SECRET
  config.trustHost ??= !!(
    process.env.AUTH_URL ??
    process.env.AUTH_TRUST_HOST ??
    process.env.VERCEL ??
    process.env.NODE_ENV !== "production"
  )
  config.providers = config.providers.map((p) => {
    const finalProvider = typeof p === "function" ? p({}) : p
    const ID = finalProvider.id.toUpperCase()
    if (finalProvider.type === "oauth" || finalProvider.type === "oidc") {
      finalProvider.clientId ??= envObject[`AUTH_${ID}_ID`]
      finalProvider.clientSecret ??= envObject[`AUTH_${ID}_SECRET`]
      if (finalProvider.type === "oidc") {
        finalProvider.issuer ??= envObject[`AUTH_${ID}_ISSUER`]
      }
    } else if (finalProvider.type === "email") {
      finalProvider.apiKey ??= envObject[`AUTH_${ID}_KEY`]
    }
    return finalProvider
  })
}

export function createActionURL(
  action: AuthAction,
  protocol: string,
  headers: Headers,
  envObject: any,
  basePath?: string
): URL {
  let url = envObject.AUTH_URL
  if (!url) {
    const host = headers.get("x-forwarded-host") ?? headers.get("host")
    const proto = headers.get("x-forwarded-proto") ?? protocol
    url = `${proto === "http" ? "http" : "https"}://${host}${basePath}`
  }

  return new URL(`${url.replace(/\/$/, "")}/${action}`)
}
