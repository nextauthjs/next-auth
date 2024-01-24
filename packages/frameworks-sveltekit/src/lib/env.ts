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
  config.secret ??= env.AUTH_SECRET
  config.trustHost ??= !!(
    env.AUTH_URL ??
    env.AUTH_TRUST_HOST ??
    env.VERCEL ??
    env.NODE_ENV !== "production" ??
    dev
  )
  config.providers = config.providers.map((p) => {
    const finalProvider = typeof p === "function" ? p({}) : p
    if (finalProvider.type === "oauth" || finalProvider.type === "oidc") {
      const ID = finalProvider.id.toUpperCase()
      finalProvider.clientId ??= envObject[`AUTH_${ID}_ID`]
      finalProvider.clientSecret ??= envObject[`AUTH_${ID}_SECRET`]
      if (finalProvider.type === "oidc") {
        finalProvider.issuer ??= envObject[`AUTH_${ID}_ISSUER`]
      }
    }
    return finalProvider
  })
}
