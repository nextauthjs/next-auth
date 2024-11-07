import { Auth, setEnvDefaults } from "@auth/core"
import type { AuthConfig } from "@auth/core"
import { getRequestFromEvent } from "../utils"
import { defineEventHandler } from "h3"
import type { H3Event, EventHandler, EventHandlerRequest } from "h3"
import type { Session } from "@auth/core/types"

export interface NuxtAuthResult {
  /**
   * Handle auth calls in Nuxt project.
   *
   * @param config AuthConfig
   * @returns EventHandler
   *
   *  @example
   * ```ts title="server/utils/auth.ts"
   * import { NuxtAuth } from "#auth"
   * import GitHub from "@auth/nuxt/providers/github"
   *
   * const { handlers, auth: _auth } = NuxtAuth(providers: [GitHub])
   *
   * export function authHandler() {
   *   return handlers
   *}
   * ```
   *
   * ```ts title="server/routes/auth/[...].ts"
   * export default authHandler()
   * ```
   *
   */
  handlers: EventHandler<EventHandlerRequest, Promise<Response | undefined>>

  /**
   * Gets and returns the session to be used in server side, like in API routes.
   *
   * @example
   * ```ts title="server/api/protected.get.ts"
   * export default defineEventHandler(async (event) => {
   *   const session = await auth(event)
   *
   *  if (!session) return null
   *
   *  return {
   *    message: "Protected data",
   *  }
   *})
   * ```
   *
   * @param event H3Event
   * @returns Session
   */
  auth: (event: H3Event) => Promise<Session | null>
}

function NuxtAuthHandler(config: AuthConfig) {
  return defineEventHandler(async (event) => {
    /**
     * If the request is a prerender request, do nothing.
     */
    if (
      event.node.req.headers?.["x-nitro-prerender"] &&
      import.meta.env.NODE_ENV === "prerender"
    ) {
      return
    }

    // Do not handle source maps
    if (event.node.req.url?.includes(".js.map")) return

    // Set missing items/ override items based on the environment variables
    setEnvDefaults(process.env, config)

    const request = await getRequestFromEvent(event)
    config.trustHost ??= true
    config.basePath ??= "/auth"

    return await Auth(request, config)
  })
}

async function getServerSessionInner(
  event: H3Event,
  config: AuthConfig
): Promise<Session | null> {
  // Set missing items/ override items based on the environment variables
  setEnvDefaults(process.env, config)

  const headers = event.headers
  const data = await $fetch<Session>(`${config.basePath}/session`, {
    headers,
  })
  if (!data || !Object.keys(data).length) return null

  return data
}

function auth(config: AuthConfig) {
  return async (event: H3Event) => await getServerSessionInner(event, config)
}

/**
 *  Initialize NuxtAuth.js.
 *
 * @param config AuthConfig
 *
 *  @example
 * ```ts title="server/utils/auth.ts"
 * import { NuxtAuth } from "#auth"
 * import GitHub from "@auth/nuxt/providers/github"
 *
 * const { handlers, auth: _auth } = NuxtAuth(providers: [GitHub])
 *
 * export function authHandler() {
 *   return handlers
 *}
 *
 * export async function auth(event: H3Event) {
 *   return await _auth(event)
 *}
 * ```
 *
 */
export function NuxtAuth(config: AuthConfig): NuxtAuthResult {
  return {
    handlers: NuxtAuthHandler(config),
    auth: auth(config),
  }
}
