import { NextRequest } from "next/server"

import type { NextAuthConfig } from "./index.js"

export function setEnvDefaults(config: NextAuthConfig) {
  try {
    const url = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL
    if (url && !config.basePath) config.basePath = new URL(url).pathname
  } catch {
  } finally {
    config.basePath ??= "/api/auth"
  }

  if (!config.secret) {
    config.secret = []
    const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET
    if (secret) config.secret.push(secret)
    for (const i of [1, 2, 3]) {
      const secret = process.env[`AUTH_SECRET_${i}`]
      if (secret) config.secret.unshift(secret)
    }
  }
  config.trustHost ??= !!(
    process.env.AUTH_URL ??
    process.env.NEXTAUTH_URL ??
    process.env.AUTH_TRUST_HOST ??
    process.env.VERCEL ??
    process.env.NODE_ENV !== "production"
  )
  config.redirectProxyUrl ??= process.env.AUTH_REDIRECT_PROXY_URL
  config.providers = config.providers.map((p) => {
    const finalProvider = typeof p === "function" ? p({}) : p
    const ID = finalProvider.id.toUpperCase()
    if (finalProvider.type === "oauth" || finalProvider.type === "oidc") {
      finalProvider.clientId ??= process.env[`AUTH_${ID}_ID`]
      finalProvider.clientSecret ??= process.env[`AUTH_${ID}_SECRET`]
      if (finalProvider.type === "oidc") {
        finalProvider.issuer ??= process.env[`AUTH_${ID}_ISSUER`]
      }
    } else if (finalProvider.type === "email") {
      finalProvider.apiKey ??= process.env[`AUTH_${ID}_KEY`]
    }
    return finalProvider
  })
}

/** If `NEXTAUTH_URL` or `AUTH_URL` is defined, override the request's URL. */
export function reqWithEnvURL(req: NextRequest): NextRequest {
  const url = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL
  if (!url) return req
  const { origin: envOrigin } = new URL(url)
  const { href, origin } = req.nextUrl
  return new NextRequest(href.replace(origin, envOrigin), req)
}
