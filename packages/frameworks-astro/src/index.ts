/**
 *
 * :::warning
 * `@auth/astro` is currently experimental. The API _will_ change in the future.
 * :::
 *
 * `@auth/astro` is the official Astro integration for Auth.js.
 * It provides a simple way to add authentication to your Astro app in a few lines of code.
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm run astro add @auth/astro
 * ```
 *
 * @module @auth/astro
 */

import type { AstroIntegration } from "astro"
import type { PluginOption } from "vite"

export interface AstroAuthConfig {
  /**
   * Defines the base path for the auth routes.
   * @default '/api/auth'
   */
  basePath?: string
  /**
   * Defineds wether or not you want the integration to handle the API routes
   * @default true
   */
  injectEndpoints?: boolean
  /**
   * Path to the config file
   */
  configFile?: string
}

export const virtualConfigModule = ({
  configFile,
  basePath,
}: AstroAuthConfig): PluginOption => {
  const virtualModuleId = "auth:config"
  const resolvedId = "\0" + virtualModuleId

  const virtualClientModuleId = "auth:config/client"
  const resolvedClientId = "\0" + virtualClientModuleId

  return {
    name: "auth-astro-config",
    resolveId: (id) => {
      if (id === virtualModuleId) return resolvedId
      if (id === virtualClientModuleId) return resolvedClientId
    },
    load: (id) => {
      if (id === resolvedId)
        return `import authConfig from "${configFile}"; authConfig.basePath = '${basePath}'; export default authConfig`
      if (id === resolvedClientId)
        return `export default { basePath: '${basePath}' }`
    },
  }
}

export default (config: AstroAuthConfig = {}): AstroIntegration => ({
  name: "astro-auth",
  hooks: {
    "astro:config:setup": async ({
      config: astroConfig,
      injectRoute,
      injectScript,
      updateConfig,
      addMiddleware,
      logger,
    }) => {
      if (astroConfig.output === "static")
        throw new Error(
          'auth-astro requires server-side rendering. Please set output to "server" & install an adapter. See https://docs.astro.build/en/guides/deploy/#adding-an-adapter-for-ssr'
        )

      config.basePath ??= "/api/auth"
      config.configFile ??= "./auth.config"

      updateConfig({
        vite: {
          plugins: [virtualConfigModule(config)],
          optimizeDeps: { exclude: ["auth:config"] },
        },
      })

      addMiddleware({
        entrypoint: '@auth/astro/middleware',
        order: 'pre'
      })

      if (config.injectEndpoints !== false) {
        const { dirname, join } = await import("node:path")
        const currentDir = dirname(import.meta.url.replace("file://", ""))
        const entrypoint = join(currentDir + "/api/[...auth].ts")
        injectRoute({
          pattern: config.basePath + "/[...auth]",
          entrypoint: entrypoint,
          // @ts-ignore Astro 3 support
          entryPoint: entrypoint,
        })
      }

      if (!astroConfig.adapter) {
        logger.error(
          "No Adapter found, please make sure you provide one in your Astro config"
        )
      }
      const edge = ["@astrojs/vercel/edge", "@astrojs/cloudflare"].includes(
        astroConfig.adapter?.name!
      )

      if (
        (!edge && globalThis.process && process.versions.node < "19.0.0") ||
        (process.env.NODE_ENV === "development" && edge)
      ) {
        injectScript(
          "page-ssr",
          `import crypto from "node:crypto";
if (!globalThis.crypto) globalThis.crypto = crypto;
if (typeof globalThis.crypto.subtle === "undefined") globalThis.crypto.subtle = crypto.webcrypto.subtle;
if (typeof globalThis.crypto.randomUUID === "undefined") globalThis.crypto.randomUUID = crypto.randomUUID;
`
        )
      }
    },
  },
})
