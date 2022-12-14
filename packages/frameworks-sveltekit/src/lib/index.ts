/// <reference types="@sveltejs/kit" />
import { dev } from "$app/environment"
import { env } from "$env/dynamic/private"
import { AUTH_SECRET } from "$env/static/private"
import {
  AuthHandler,
  type AuthAction,
  type AuthOptions,
  type Session,
} from "@auth/core"
import type { Handle } from "@sveltejs/kit"

export type GetSessionResult = Promise<Session | null>

export async function getSession(
  req: Request,
  options: AuthOptions
): GetSessionResult {
  options.secret ??= AUTH_SECRET
  options.trustHost ??= true

  const url = new URL("/api/auth/session", req.url)
  const response = await AuthHandler(
    new Request(url, { headers: req.headers }),
    options
  )

  const { status = 200 } = response

  const data = await response.json()

  if (!data || !Object.keys(data).length) return null
  if (status === 200) return data
  throw new Error(data.message)
}

export interface SvelteKitAuthOptions extends AuthOptions {
  /**
   * Defines the base path for the auth routes.
   * @default '/auth'
   */
  prefix?: string
}

const actions: AuthAction[] = [
  "providers",
  "session",
  "csrf",
  "signin",
  "signout",
  "callback",
  "verify-request",
  "error",
  "_log",
]

function SvelteKitAuthHandler(
  prefix: string,
  authOptions: AuthOptions
): Handle {
  return ({ event, resolve }) => {
    const { url, request } = event

    event.locals.getSession ??= () => getSession(request, authOptions)

    const [action] = url.pathname.slice(prefix.length + 1).split("/")
    if (
      actions.includes(action as AuthAction) &&
      url.pathname.startsWith(prefix + "/")
    ) {
      return AuthHandler(request, authOptions)
    }

    return resolve(event)
  }
}

/**
 * The main entry point to `@auth/sveltekit`
 * @see https://sveltekit.authjs.dev
 */
export default function SvelteKitAuth(options: SvelteKitAuthOptions): Handle {
  const { prefix = "/auth", ...authOptions } = options
  authOptions.secret ??= AUTH_SECRET
  authOptions.trustHost ??= !!(env.AUTH_TRUST_HOST ?? env.VERCEL ?? dev)

  return SvelteKitAuthHandler(prefix, authOptions)
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace App {
    interface Locals {
      getSession: () => GetSessionResult
    }
    interface PageData {
      session: Session | null
    }
  }
}

declare module "$env/dynamic/private" {
  export const AUTH_TRUST_HOST: string
  export const VERCEL: string
}

declare module "$env/static/private" {
  export const AUTH_SECRET: string
}
