import { Auth, AuthConfig } from "@auth/core"
import GitHub from "@auth/core/providers/github"

export default function handler(req: Request) {
  return Auth(req, getDefaults({ providers: [GitHub] }))
}

export const config = { runtime: "edge" }

export function getDefaults(config: AuthConfig) {
  config.secret ??= process.env.AUTH_SECRET
  config.trustHost ??= !!process.env.VERCEL
  config.redirectProxyUrl ??= process.env.AUTH_REDIRECT_PROXY_URL
  config.providers = config.providers.map((p) => {
    const finalProvider = typeof p === "function" ? p() : p
    if (finalProvider.type === "oauth" || finalProvider.type === "oidc") {
      const ID = finalProvider.id.toUpperCase()
      finalProvider.clientId ??= process.env[`AUTH_${ID}_ID`]
      finalProvider.clientSecret ??= process.env[`AUTH_${ID}_SECRET`]
      if (finalProvider.type === "oidc") {
        finalProvider.issuer ??= process.env[`AUTH_${ID}_ISSUER`]
      }
    }
    return finalProvider
  })
  return config
}
