import { Auth, setEnvDefaults } from "@auth/core"
import type { AuthConfig } from "@auth/core"
import { getRequestFromEvent, getBasePath } from "../utils"
import { defineEventHandler } from "h3"
import type { H3Event } from "h3"
import type { Session } from "@auth/core/types"

/**
 * Handle auth calls in Nuxt project.
 *
 *  @example
 * ```ts title="server/routes/auth/[...].ts"
 * import { NuxtAuthHandler } from "#auth"
 * import GitHub from "@auth/nuxt/providers/github"
 *
 * export default defineEventHandler(async (event) => {
 *    return NuxtAuthHandler({ providers: [GitHub] })
 * })
 * ```
 *
 * @param config AuthConfig
 * @returns EventHandler
 */
export function NuxtAuthHandler(config: AuthConfig) {
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
    config.basePath ??= getBasePath(request)

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

export function getServerSession(config: AuthConfig) {
  /**
   * Gets and returns the session to be used in server side, like in API routes.
   *
   * @example
   * ```ts title="server/api/protected.get.ts"
   * const { getServerSession } = auth()
   *
   * export default defineEventHandler(async (event) => {
   *  const session = await getServerSession(event)
   *  if (!session) return null
   *
   *  return {
   *    message: "Protected data",
   *  }
   * })
   * ```
   *
   * @param event H3Event
   * @returns Session
   */
  return async (event: H3Event) => await getServerSessionInner(event, config)
}
