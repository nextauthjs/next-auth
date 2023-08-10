import type { NextAuthConfig } from "./index.js"

export function setEnvDefaults(config: NextAuthConfig) {
  config.secret ??= process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET
  config.trustHost ??= !!(process.env.NEXTAUTH_URL ?? process.env.AUTH_TRUST_HOST ?? process.env.VERCEL ?? process.env.NODE_ENV !== "production")
  config.redirectProxyUrl ??= process.env.AUTH_REDIRECT_PROXY_URL
  config.providers = config.providers.map((p) => {
    if (typeof p !== "function") return p
    const provider = p()
    if (provider.type === "oauth" || provider.type === "oidc") {
      const ID = provider.id.toUpperCase()
      provider.clientId ??= process.env[`AUTH_${ID}_ID`]
      provider.clientSecret ??= process.env[`AUTH_${ID}_SECRET`]
      provider.issuer ??= process.env[`AUTH_${ID}_ISSUER`]
    }
    return provider
  })
}
