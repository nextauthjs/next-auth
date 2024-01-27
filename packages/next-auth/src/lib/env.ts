import { NextRequest } from "next/server"
import type { NextAuthConfig } from "./index.js"
import { setEnvDefaults as coreSetEnvDefaults } from "@auth/core"

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
 */
export function setEnvDefaults(config: NextAuthConfig) {
  try {
    const url = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL
    if (!url) return
    config.basePath ||= new URL(url).pathname
  } catch {
  } finally {
    config.basePath ||= "/api/auth"
    coreSetEnvDefaults(process.env, config)
  }
}

export function actionWithEnv<T extends (...args: any[]) => any>(action: T, config: (request: NextRequest | undefined) => NextAuthConfig): any {
  return (...args: Parameters<T>) => {
    const _config = config(undefined)
    setEnvDefaults(_config)
    return action(...args, _config)
  }
}
