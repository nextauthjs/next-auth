import { dev, building } from "$app/environment"
import { base } from "$app/paths"
import { env } from "$env/dynamic/private"
import type { SvelteKitAuthConfig } from "./types"

export function setEnvDefaults(envObject: Record<string, string | undefined>, config: SvelteKitAuthConfig) {
  if (building) return

  try {
    const url = env.AUTH_URL
    if (url) config.basePath = new URL(url).pathname
  } catch { /* empty */ } finally {
    config.basePath ??= `${base}/auth`
  }

  config.redirectProxyUrl ??= env.AUTH_REDIRECT_PROXY_URL

  if (!config.secret) {
    config.secret = []
    const secret = env.AUTH_SECRET
    if (secret) config.secret.push(secret)
    for (const i of [1, 2, 3]) {
      const secret = process.env[`AUTH_SECRET_${i}`]
      if (secret) config.secret.unshift(secret)
    }
  }

  config.trustHost ??= !!(
    env.AUTH_URL ??
    env.AUTH_TRUST_HOST ??
    env.VERCEL ??
    env.NODE_ENV !== "production" ??
    dev
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

