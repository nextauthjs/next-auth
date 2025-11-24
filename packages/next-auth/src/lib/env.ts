// @ts-expect-error Next.js does not yet correctly use the `package.json#exports` field
import { NextRequest } from "next/server"
import type { NextAuthConfig } from "./index.js"
import { setEnvDefaults as coreSetEnvDefaults } from "@auth/core"

/** If Next.js base path is set, add it to the request's URL. */
export function reqWithBasePathURL(
  req: NextRequest,
  config: NextAuthConfig
): NextRequest {
  if (!config.nextJsBasePath) return req
  const url = new URL(req.nextUrl.href)

  // Check if basePath is already included in the pathname
  if (url.pathname.startsWith(config.nextJsBasePath + "/")) {
    return req
  }

  url.pathname = config.nextJsBasePath + url.pathname
  return new NextRequest(url.toString(), req)
}

/** If `NEXTAUTH_URL` or `AUTH_URL` is defined, override the request's URL. */
export function reqWithEnvURL(req: NextRequest): NextRequest {
  const url = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL
  if (!url) return req
  const { origin: envOrigin } = new URL(url)
  const { href, origin } = req.nextUrl
  return new NextRequest(href.replace(origin, envOrigin), req)
}

/**
 * For backwards compatibility, `next-auth` checks for `NEXTAUTH_URL`
 * and the `basePath` by default is `/api/auth` instead of `/auth`
 * (which is the default for all other Auth.js integrations).
 *
 * For the same reason, `NEXTAUTH_SECRET` is also checked.
 */
export function setEnvDefaults(config: NextAuthConfig) {
  try {
    config.secret ??= process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET
    const url = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL
    if (!url) return
    const { pathname } = new URL(url)
    if (pathname === "/") return
    config.basePath ||= pathname
  } catch {
    // Catching and swallowing potential URL parsing errors, we'll fall
    // back to `/api/auth` below.
  } finally {
    config.basePath ||= "/api/auth"
    coreSetEnvDefaults(process.env, config, true)
  }
}
