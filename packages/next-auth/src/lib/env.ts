// @ts-expect-error Next.js does not yet correctly use the `package.json#exports` field
import { NextRequest } from "next/server"
import type { NextAuthConfig } from "./index.js"
import { setEnvDefaults as coreSetEnvDefaults } from "@auth/core"

/**
 * Safely derives the request protocol from available sources.
 * Fallback order: AUTH_URL/NEXTAUTH_URL origin > x-forwarded-proto header > "http" in development only.
 * Never returns null to avoid createActionURL defaulting to https incorrectly.
 */
export function getProtocol(headers: Headers, env: NodeJS.ProcessEnv): string {
  const envUrl = env.AUTH_URL ?? env.NEXTAUTH_URL
  if (envUrl) {
    try {
      return new URL(envUrl).protocol.replace(/:$/, "")
    } catch {
      // Invalid URL, fall through to header-based detection
    }
  }

  const forwardedProto = headers.get("x-forwarded-proto")
  if (forwardedProto) {
    // Handle comma-separated values (first hop is the original protocol)
    return forwardedProto.split(",")[0].trim()
  }

  // In development, default to http; in production, let createActionURL use https
  return env.NODE_ENV !== "production" ? "http" : "https"
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
