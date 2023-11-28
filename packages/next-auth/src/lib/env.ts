import { NextRequest } from "next/server"
import type { headers } from "next/headers"

import type { NextAuthConfig } from "./index.js"

export function setEnvDefaults(config: NextAuthConfig) {
  config.secret ??= process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET
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
}

/**
 * Extract the origin from `NEXTAUTH_URL` or `AUTH_URL`
 * environment variables, or the request's headers.
 */
export function detectOrigin(h: Headers | ReturnType<typeof headers>) {
  const url = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL
  if (url) return new URL(url)
  const host = h.get("x-forwarded-host") ?? h.get("host")
  const protocol = h.get("x-forwarded-proto") === "http" ? "http" : "https"
  return new URL(`${protocol}://${host}`)
}

/** If `NEXTAUTH_URL` or `AUTH_URL` is defined, override the request's URL. */
export function reqWithEnvUrl(req: NextRequest): NextRequest {
  const url = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL
  if (!url) return req
  const base = new URL(url).origin
  // REVIEW: Bug in Next.js?: TypeError: next_dist_server_web_exports_next_request__WEBPACK_IMPORTED_MODULE_0__ is not a constructor
  // return new NextRequest(new URL(nonBase, base), req)
  const _url = req.nextUrl.clone()
  _url.href = req.nextUrl.href.replace(req.nextUrl.origin, base)
  const _req = new Request(_url, req) as any
  _req.nextUrl = _url
  return _req
}
